
// This file serves as a facade to maintain backward compatibility
// It re-exports all functionality from the refactored modules

// Re-export from sound core
import { setupUserInteractionTracking, canPlayAudio, unlockAudio, getAudioState } from './sound/soundCore';
export { canPlayAudio, unlockAudio, getAudioState };

// Re-export from sound resources
import { preloadSounds } from './sound/soundResources';
export { preloadSounds };

// Re-export from sound player
import { playSound, stopSound, startAlertNotification, stopAlertNotification, isNotificationActive } from './sound/soundPlayer';
export { playSound, stopSound, startAlertNotification, stopAlertNotification, isNotificationActive };

// Re-export from browser notifications
import { requestNotificationPermission, sendBrowserNotification } from './notifications/browserNotifications';
export { requestNotificationPermission, sendBrowserNotification };

// Debug function to check all audio systems
export const debugAudioSystems = () => {
  const state = getAudioState();
  console.log("Audio System Status:");
  console.log("-----------------");
  console.log(`User has interacted: ${state.userHasInteracted}`);
  console.log(`Web Audio API Support: ${state.webAudioSupport}`);
  console.log(`AudioContext exists: ${state.audioContextExists}`);
  if (state.audioContextExists) {
    console.log(`AudioContext state: ${state.audioContextState}`);
  }
  console.log(`Active audio instance: ${state.audioInstanceExists ? 'Yes' : 'No'}`);
  console.log("-----------------");
  return state;
};

// Create audio files to use in public folder if they don't exist
// This function doesn't actually run - it's just a reminder that real audio files are needed
const ensureAudioFilesExist = () => {
  console.warn(
    "Please ensure that real audio files exist at:\n" +
    "- /public/sounds/notification.mp3\n" + 
    "- /public/sounds/alert.mp3\n" + 
    "- /public/sounds/beep.mp3\n" +
    "These should be real MP3 files, not placeholder text files."
  );
};

// Execute setup on module import (to maintain original behavior)
setupUserInteractionTracking();
