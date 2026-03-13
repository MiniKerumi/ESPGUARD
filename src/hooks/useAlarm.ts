import { useState, useCallback, useRef } from 'react';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useAlarm = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alarm.mp3');
      // Loop audio so it keeps playing — don't auto-stop isPlaying on end
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
    if (isPlaying) return;

    // Set alarm active immediately — button stays visible regardless of audio/haptic success
    setIsPlaying(true);

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

    // Play alarm sound (best-effort — failure does NOT hide the button)
    initializeAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio autoplay blocked:', err);
      });
    }
  }, [isPlaying, initializeAudio]);

  const stopAlarm = useCallback(async () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    LocalNotifications.cancel({ notifications: [{ id: 1 }] }).catch(() => {});
  }, []);

  return {
    isPlaying,
    triggerAlarm,
    stopAlarm,
    requestPermissions
  };
};
