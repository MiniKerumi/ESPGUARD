import { createContext, useContext, ReactNode } from 'react';
import { useBluetooth } from '@/hooks/useBluetooth';

type BluetoothContextType = ReturnType<typeof useBluetooth>;

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  const value = useBluetooth();
  return <BluetoothContext.Provider value={value}>{children}</BluetoothContext.Provider>;
};

export const useBluetoothContext = () => {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error('useBluetoothContext must be used within BluetoothProvider');
  return ctx;
};
