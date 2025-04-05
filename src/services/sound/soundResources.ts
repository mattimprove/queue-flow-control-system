
// Sound options with URLs for audio files
export const soundOptions = {
  notification: "/sounds/notification.mp3",
  alert: "/sounds/alert.mp3",
  beep: "/sounds/beep.mp3",
  podium: "/sounds/podium.mp3",
  firstPlace: "/sounds/firstPlace.mp3",
};

// Available sound files in the sounds directory
// This includes both default sounds and custom sounds uploaded by users
export const availableSoundFiles: string[] = [
  // Additional sound files from the image
  "alertabeebep.mp3",
  "cashregister.mp3",
  "notificacao.mp3",
  "senna.mp3",
  "sireneindustrial.mp3",
  "ultrapassagem.mp3"
];

// Function to get nice display name from a filename
export const getSoundDisplayName = (filename: string): string => {
  // Remove file extension
  const nameWithoutExtension = filename.replace('.mp3', '');
  
  // Make it more readable (capitalize first letter, handle special cases)
  switch(nameWithoutExtension) {
    case 'notification': return 'Som de Notificação';
    case 'alert': return 'Som de Alerta';
    case 'beep': return 'Som de Beep';
    case 'podium': return 'Som de Pódio';
    case 'firstPlace': return 'Som de Primeiro Lugar';
    case 'alerta': return 'Som de Alerta (Alt)';
    case 'alertabeebep': return 'Alerta Beep';
    case 'cashregister': return 'Caixa Registradora';
    case 'notificacao': return 'Notificação';
    case 'senna': return 'Senna';
    case 'sireneindustrial': return 'Sirene Industrial';
    case 'ultrapassagem': return 'Ultrapassagem';
    default:
      // For custom files, capitalize first letter and add spaces before uppercase letters
      return nameWithoutExtension
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
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
  // Check if it's a standard sound or a custom file
  let soundUrl: string;
  
  if (soundType in soundOptions) {
    // Standard sound type
    soundUrl = soundOptions[soundType as keyof typeof soundOptions];
  } else if (soundType.endsWith('.mp3')) {
    // Custom sound file
    soundUrl = `/sounds/${soundType}`;
  } else {
    // Fallback to notification
    soundUrl = soundOptions.notification;
  }
  
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
