
// Sound options with preloaded audio files
const soundOptions = {
  notification: "/sounds/notification.mp3",
  alert: "/sounds/alert.mp3",
  beep: "/sounds/beep.mp3",
};

// Track user interaction state
let userHasInteracted = false;
let audioContext: AudioContext | null = null;

// Initialize audio context and elements
let audio: HTMLAudioElement | null = null;
let notificationInterval: NodeJS.Timeout | null = null;

// Setup event listeners for user interaction
const setupUserInteractionTracking = () => {
  if (typeof window !== 'undefined') {
    const interactionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleInteraction = () => {
      userHasInteracted = true;
      
      // Try to initialize AudioContext on interaction
      if (!audioContext) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioContext = new AudioContextClass();
          }
        } catch (e) {
          console.warn("Failed to initialize AudioContext:", e);
        }
      }
      
      // Cleanup listeners after first interaction
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    
    // Add listeners
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction);
    });
  }
};

// Call this immediately
setupUserInteractionTracking();

// Preload sounds for better performance
const preloadSounds = () => {
  Object.values(soundOptions).forEach(soundUrl => {
    const tempAudio = new Audio(soundUrl);
    tempAudio.preload = "auto";
    
    // Force preload by trying to start loading
    tempAudio.load();
  });
};

// Try to preload sounds on module import
try {
  preloadSounds();
} catch (error) {
  console.warn("Could not preload sounds:", error);
}

// Check if audio can be played
export const canPlayAudio = (): boolean => {
  return userHasInteracted;
};

// Force unlock audio context
export const unlockAudio = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext resumed successfully');
    }).catch(e => {
      console.warn('Failed to resume AudioContext:', e);
    });
  }
  
  // Create and play a silent sound to unlock audio
  try {
    const silentAudio = new Audio();
    silentAudio.play().then(() => {
      silentAudio.pause();
      silentAudio.currentTime = 0;
      userHasInteracted = true;
      console.log('Audio system unlocked by user interaction');
    }).catch(e => {
      console.warn('Could not unlock audio system:', e);
    });
    return true;
  } catch (e) {
    console.warn('Error attempting to unlock audio:', e);
    return false;
  }
};

export const playSound = (soundType: string = "notification", volume: number = 0.5, loop: boolean = false): boolean => {
  try {
    if (audio) {
      stopSound();
    }

    // Get the correct sound URL or fallback to notification
    const soundUrl = soundOptions[soundType as keyof typeof soundOptions] || soundOptions.notification;
    
    // Create new audio instance
    audio = new Audio(soundUrl);
    audio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    audio.loop = loop;
    
    console.log(`Playing sound: ${soundType}, volume: ${volume}, loop: ${loop}, url: ${soundUrl}`);
    
    // Try to unlock audio context first
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Use promise with user interaction context
    const playPromise = audio.play();
    
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
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
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

// Request permission for browser notifications
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }
  
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return Notification.permission === "granted";
};

// Send a browser notification
export const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }
  
  try {
    new Notification(title, options);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};
