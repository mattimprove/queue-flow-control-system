
import { soundOptions } from './soundResources';
import { getAudioInstance, setAudioInstance, unlockAudio } from './soundCore';

let notificationInterval: NodeJS.Timeout | null = null;

export const playSound = (soundType: string = "notification", volume: number = 0.5, loop: boolean = false): boolean => {
  try {
    if (getAudioInstance()) {
      stopSound();
    }

    // Get the correct sound URL or fallback to notification
    const soundUrl = soundOptions[soundType as keyof typeof soundOptions] || soundOptions.notification;
    
    // Create new audio instance
    const newAudio = new Audio(soundUrl);
    newAudio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    newAudio.loop = loop;
    
    setAudioInstance(newAudio);
    
    console.log(`Playing sound: ${soundType}, volume: ${volume}, loop: ${loop}, url: ${soundUrl}`);
    
    // Try to unlock audio context first
    unlockAudio();
    
    // Use promise with user interaction context
    const playPromise = newAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Error playing sound:", error);
        if (error.name === "NotAllowedError") {
          console.warn("Audio playback was prevented by browser. User interaction is required first.");
          return false;
        }
      });
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to play sound:", error);
    return false;
  }
};

export const stopSound = () => {
  const audio = getAudioInstance();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    setAudioInstance(null);
    console.log("Sound stopped");
    return true;
  }
  return false;
};

// Set up a repeating notification
export const startAlertNotification = (soundType: string, volume: number, intervalSeconds: number = 10) => {
  // First play immediately
  playSound(soundType, volume, false);
  
  // Then set up interval
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
  
  notificationInterval = setInterval(() => {
    playSound(soundType, volume, false);
  }, intervalSeconds * 1000);
  
  console.log(`Started alert notification with sound: ${soundType}, volume: ${volume}, interval: ${intervalSeconds}s`);
  return true;
};

export const stopAlertNotification = () => {
  stopSound();
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    console.log("Alert notification stopped");
    return true;
  }
  return false;
};
