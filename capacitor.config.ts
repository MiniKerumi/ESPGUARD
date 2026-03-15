import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.espguard.app',
  appName: 'ESP32 Security Monitor',
  webDir: 'dist',
  server: {
    url: 'https://8ac77ac2-8522-4977-9ffd-606cffd4b29a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
