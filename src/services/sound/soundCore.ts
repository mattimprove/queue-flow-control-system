
// Core audio setup and initialization
let userHasInteracted = false;
let audioContext: AudioContext | null = null;
let audio: HTMLAudioElement | null = null;

// Initialize audio context on user interaction
export const setupUserInteractionTracking = () => {
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

export const getAudioInstance = (): HTMLAudioElement | null => {
  return audio;
};

export const setAudioInstance = (newAudio: HTMLAudioElement | null) => {
  audio = newAudio;
};
