
// Sound options with preloaded audio files
export const soundOptions = {
  notification: "/sounds/notification.mp3",
  alert: "/sounds/alert.mp3",
  beep: "/sounds/beep.mp3",
};

// Preload sounds for better performance
export const preloadSounds = () => {
  Object.values(soundOptions).forEach(soundUrl => {
    const tempAudio = new Audio(soundUrl);
    tempAudio.preload = "auto";
    
    // Force preload by trying to start loading
    tempAudio.load();
  });
};

// Initialize preloading
try {
  preloadSounds();
} catch (error) {
  console.warn("Could not preload sounds:", error);
}
