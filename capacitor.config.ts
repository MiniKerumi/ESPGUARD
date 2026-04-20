import { CapacitorConfig } from '@capacitor/cli';

const isDevMode = process.env.CAP_DEV !== 'false';

const config: CapacitorConfig = {
  appId: 'com.espguard.app',
  appName: 'ESPGUARD',
  webDir: 'dist',
  // Live-reload server — only active during local development, stripped for APK builds
  ...(isDevMode && {
    server: {
      url: 'https://8ac77ac2-8522-4977-9ffd-606cffd4b29a.lovableproject.com?forceHideBadge=true',
      cleartext: true
    }
  })
};

export default config;
