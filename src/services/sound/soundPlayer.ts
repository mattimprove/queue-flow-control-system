
import { getAudio } from './soundResources';
import { getAudioInstance, setAudioInstance, unlockAudio, canPlayAudio } from './soundCore';

let notificationInterval: NodeJS.Timeout | null = null;

export const playSound = (soundType: string = "notification", volume: number = 0.5, loop: boolean = false): boolean => {
  try {
    // Check if user has interacted
    if (!canPlayAudio()) {
      console.warn("Cannot play audio yet - waiting for user interaction");
      return false;
    }

    // Stop any existing sound
    if (getAudioInstance()) {
      stopSound();
    }
    
    // Se soundType for "none", não tocar nenhum som
    if (soundType === "none") {
      console.log("Sound type is 'none', not playing any sound");
      return true;
    }
    
    // Get the audio instance
    const newAudio = getAudio(soundType);
    
    // Configure the audio
    newAudio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    newAudio.loop = loop;
    
    // Store the instance
    setAudioInstance(newAudio);
    
    console.log(`▶️ Playing sound: ${soundType}, volume: ${volume}, loop: ${loop}`);
    
    // Try to unlock audio first (for iOS/Safari)
    unlockAudio();
    
    // Add event listeners to track success/failure
    newAudio.addEventListener('playing', () => {
      console.log(`✅ Sound '${soundType}' started playing successfully`);
    });
    
    newAudio.addEventListener('error', (e) => {
      console.error(`❌ Error playing sound '${soundType}':`, e);
    });
    
    // Use promise with user interaction context
    const playPromise = newAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error(`❌ Error playing sound '${soundType}':`, error);
        if (error.name === "NotAllowedError") {
          console.warn("⚠️ Audio playback was prevented by browser. User interaction is required first.");
          return false;
        }
      });
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("❌ Failed to play sound:", error);
    return false;
  }
};

export const stopSound = () => {
  const audio = getAudioInstance();
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
      setAudioInstance(null);
      console.log("⏹ Sound stopped");
      return true;
    } catch (error) {
      console.error("❌ Error stopping sound:", error);
    }
  }
  return false;
};

// Set up a repeating notification
export const startAlertNotification = (soundType: string, volume: number, intervalSeconds: number = 10) => {
  // Stop any existing alert first
  stopAlertNotification();
  
  // First play immediately
  const success = playSound(soundType, volume, false);
  
  // Then set up interval only if first play was successful
  if (success) {
    notificationInterval = setInterval(() => {
      playSound(soundType, volume, false);
    }, intervalSeconds * 1000);
    
    console.log(`🔔 Started alert notification with sound: ${soundType}, volume: ${volume}, interval: ${intervalSeconds}s`);
    return true;
  }
  
  return false;
};

export const stopAlertNotification = () => {
  stopSound();
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    console.log("🔕 Alert notification stopped");
    return true;
  }
  return false;
};

// Check current notification state
export const isNotificationActive = (): boolean => {
  return notificationInterval !== null;
};
