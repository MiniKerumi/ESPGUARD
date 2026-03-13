import { useEffect } from "react";
import { Bluetooth, BluetoothOff, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ActivityLog } from "@/components/ActivityLog";
import { HardwareConfig } from "@/components/HardwareConfig";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useAlarm } from "@/hooks/useAlarm";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { isConnected, currentState, logs, isScanning, sensorStatus, connect, disconnect } = useBluetooth();
  const { isPlaying, triggerAlarm, stopAlarm, requestPermissions } = useAlarm();
  const { toast } = useToast();

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  useEffect(() => {
    if (currentState === 'ALARM') {
      triggerAlarm();
      toast({
        title: "⚠ ALARM!",
        description: "Motion detected by IR sensor",
        variant: "destructive",
      });
    }
  }, [currentState, triggerAlarm, toast]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">ESP32 Security Monitor</h1>
          <p className="text-muted-foreground">Real-time motion detection system</p>
        </div>

        {/* Status Display */}
        <StatusIndicator state={currentState} isConnected={isConnected} />

        {/* Stop Alarm — full-width, prominent when alarm is active */}
        {isPlaying && (
          <Button
            onClick={stopAlarm}
            variant="destructive"
            size="lg"
            className="w-full gap-2 animate-pulse text-base font-bold py-6"
          >
            <BellOff className="h-6 w-6" />
            Stop Alarm
          </Button>
        )}

        {/* Connection Controls */}
        <div className="flex gap-4">
          {!isConnected ? (
            <Button
              onClick={connect}
              disabled={isScanning}
              className="flex-1 gap-2"
              size="lg"
            >
              <Bluetooth className="h-5 w-5" />
              {isScanning ? "Scanning..." : "Connect to ESP32"}
            </Button>
          ) : (
            <Button
              onClick={disconnect}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <BluetoothOff className="h-5 w-5" />
              Disconnect
            </Button>
          )}
        </div>

        {/* Connection Status */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connection Status</span>
            <span className={`text-sm ${isConnected ? 'text-status-active' : 'text-muted-foreground'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Tabs: Monitor / Hardware */}
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="monitor" className="flex-1">Monitor</TabsTrigger>
            <TabsTrigger value="hardware" className="flex-1">Hardware</TabsTrigger>
          </TabsList>
          <TabsContent value="monitor">
            <ActivityLog logs={logs} />
          </TabsContent>
          <TabsContent value="hardware">
            <HardwareConfig sensorStatus={sensorStatus} isConnected={isConnected} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
