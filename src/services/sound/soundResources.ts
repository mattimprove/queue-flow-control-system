
// Sound options with URLs for audio files
export const soundOptions = {
  notification: "/sounds/notification.mp3",
  alert: "/sounds/alert.mp3",
  beep: "/sounds/beep.mp3",
};

// Map to store preloaded audio objects
const audioCache: Record<string, HTMLAudioElement> = {};

// Preload sounds for better performance
export const preloadSounds = () => {
  // Clean cache first
  Object.keys(audioCache).forEach(key => {
    delete audioCache[key];
  });

  // Preload each sound
  Object.entries(soundOptions).forEach(([key, soundUrl]) => {
    try {
      const audio = new Audio(soundUrl);
      audio.preload = "auto";
      
      // Cache the audio object
      audioCache[key] = audio;
      
      // This will start loading the audio file
      audio.load();
      
      console.log(`Preloaded sound: ${key} (${soundUrl})`);
    } catch (error) {
      console.error(`Failed to preload sound ${key}:`, error);
    }
  });
};

// Get cached audio object if available, or create a new one
export const getAudio = (soundType: string): HTMLAudioElement => {
  const soundUrl = soundOptions[soundType as keyof typeof soundOptions] || soundOptions.notification;
  
  // If we have a cached version, clone it for safe usage
  if (audioCache[soundType]) {
    // Create a fresh Audio instance that references the same resource
    // (this avoids issues with trying to play the same Audio element again)
    const newAudio = new Audio(soundUrl);
    newAudio.preload = "auto";
    return newAudio;
  }
  
  // Fall back to new instance if not cached
  const newAudio = new Audio(soundUrl);
  newAudio.preload = "auto";
  return newAudio;
};

// Don't try to preload sounds on initial module import
// We'll call this explicitly after user interaction
