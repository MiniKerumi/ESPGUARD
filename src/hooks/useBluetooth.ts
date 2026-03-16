import { useState, useCallback, useRef } from 'react';
import { BleClient } from '@capacitor-community/bluetooth-le';

const TARGET_NAME = 'ESPGUARD-Server';
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const CHAR_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

export type SystemState = 'NORMAL' | 'MAINT' | 'ALARM' | 'UNKNOWN';
export type SystemEvent = 'UNAUTH' | null;

export interface LogEntry {
  timestamp: Date;
  message: string;
  state?: SystemState;
  severity?: 'info' | 'warning' | 'critical';
}

export interface SensorStatus {
  nfcActive: boolean;
  irActive: boolean;
}

export const useBluetooth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceAddress, setDeviceAddress] = useState<string>('');
  const [currentState, setCurrentState] = useState<SystemState>('UNKNOWN');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>({ nfcActive: false, irActive: false });
  const [lastEvent, setLastEvent] = useState<SystemEvent>(null);
  const previousStateRef = useRef<SystemState>('UNKNOWN');

  const addLog = useCallback((message: string, state?: SystemState, severity: 'info' | 'warning' | 'critical' = 'info') => {
    setLogs(prev => [{
      timestamp: new Date(),
      message,
      state,
      severity
    }, ...prev].slice(0, 50));
  }, []);

  const handleNotification = useCallback((value: DataView) => {
    const decoder = new TextDecoder();
    const stateText = decoder.decode(value).trim();
    const prevState = previousStateRef.current;

    if (stateText === 'UNAUTH') {
      setSensorStatus(prev => ({ ...prev, nfcActive: true }));
      addLog('🚫 NFC: Unauthorized tag scanned — access denied', undefined, 'critical');
      setLastEvent('UNAUTH');
      setTimeout(() => {
        setSensorStatus(prev => ({ ...prev, nfcActive: false }));
        setLastEvent(null);
      }, 3000);
      return;
    }

    if (stateText === 'NORMAL' || stateText === 'MAINT' || stateText === 'ALARM') {
      const newState = stateText as SystemState;
      
      // Infer sensor activity from state transitions
      if (newState === 'MAINT' && prevState !== 'MAINT') {
        setSensorStatus(prev => ({ ...prev, nfcActive: true }));
        addLog('NFC: Authorized tag scanned → Maintenance ON', 'MAINT', 'warning');
        setTimeout(() => setSensorStatus(prev => ({ ...prev, nfcActive: false })), 3000);
      } else if (prevState === 'MAINT' && newState === 'NORMAL') {
        setSensorStatus(prev => ({ ...prev, nfcActive: true }));
        addLog('NFC: Authorized tag scanned → Maintenance OFF', 'NORMAL', 'info');
        setTimeout(() => setSensorStatus(prev => ({ ...prev, nfcActive: false })), 3000);
      }

      if (newState === 'ALARM') {
        setSensorStatus(prev => ({ ...prev, irActive: true }));
        if (prevState !== 'ALARM') {
          addLog('⚠ ALARM: Motion detected by IR sensor!', 'ALARM', 'critical');
        }
      } else {
        setSensorStatus(prev => ({ ...prev, irActive: false }));
      }

      if (newState === prevState) {
        // Same state, no log needed
      } else if (newState === 'NORMAL' && prevState === 'ALARM') {
        addLog('System returned to NORMAL', 'NORMAL', 'info');
      }

      setCurrentState(newState);
      previousStateRef.current = newState;
    } else {
      addLog(`Unknown data: ${stateText}`);
    }
  }, [addLog]);

  const connect = useCallback(async () => {
    try {
      await BleClient.initialize();
      setIsScanning(true);
      addLog('Scanning for ESP32 transmitter...');

      const device = await BleClient.requestDevice({
        namePrefix: TARGET_NAME,
        optionalServices: [SERVICE_UUID]
      });

      if (device) {
        setDeviceAddress(device.deviceId);
        addLog(`Found device: ${device.name}`);

        await BleClient.connect(device.deviceId, () => {
          setIsConnected(false);
          setSensorStatus({ nfcActive: false, irActive: false });
          addLog('Device disconnected', undefined, 'warning');
        });

        setIsConnected(true);
        addLog('Connected successfully', undefined, 'info');

        await BleClient.startNotifications(
          device.deviceId,
          SERVICE_UUID,
          CHAR_UUID,
          handleNotification
        );

        addLog('Listening for notifications');
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`, undefined, 'critical');
      setIsScanning(false);
    }
  }, [addLog, handleNotification]);

  const disconnect = useCallback(async () => {
    if (deviceAddress) {
      try {
        await BleClient.disconnect(deviceAddress);
        setIsConnected(false);
        setDeviceAddress('');
        setSensorStatus({ nfcActive: false, irActive: false });
        setCurrentState('UNKNOWN');
        previousStateRef.current = 'UNKNOWN';
        addLog('Disconnected by user');
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  }, [deviceAddress, addLog]);

  return {
    isConnected,
    currentState,
    logs,
    isScanning,
    sensorStatus,
    lastEvent,
    connect,
    disconnect,
  };
};
