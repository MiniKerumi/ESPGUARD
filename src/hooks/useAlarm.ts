import { useCallback, useRef } from 'react';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useAlarm = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alarm.mp3');
      audioRef.current.loop = true;
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
    }
  }, []);

  const triggerAlarm = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    // Vibrate (best-effort)
    Haptics.vibrate({ duration: 1000 }).catch(() => {});

    // Show notification (best-effort)
    LocalNotifications.schedule({
      notifications: [{
        title: 'ESP32 Security Alert',
        body: 'Object Detected!',
        id: 1,
        schedule: { at: new Date(Date.now() + 100) }
      }]
    }).catch(() => {});

    // Play alarm sound (best-effort)
    initializeAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio autoplay blocked:', err);
      });
    }
  }, [initializeAudio]);

  const stopAlarm = useCallback(async () => {
    isPlayingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    LocalNotifications.cancel({ notifications: [{ id: 1 }] }).catch(() => {});
  }, []);

  return {
    triggerAlarm,
    stopAlarm,
    requestPermissions
  };
};
