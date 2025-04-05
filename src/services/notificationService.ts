
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

// Função auxiliar para reproduzir som com base nas configurações do usuário
export const playSoundByEventType = (
  eventType: "notification" | "alert" | "podium" | "firstPlace", 
  settings: any, 
  volume?: number
): boolean => {
  // Mapeia o tipo de evento para a configuração correspondente
  const soundSettingsMap = {
    notification: "notificationSound",
    alert: "alertSound",
    podium: "podiumSound",
    firstPlace: "firstPlaceSound"
  };
  
  const soundSetting = soundSettingsMap[eventType];
  const soundType = settings[soundSetting] || eventType;
  
  // Se o tipo de som for "none", não toca nada
  if (soundType === "none") return true;
  
  // Usa o volume das configurações ou o volume fornecido
  const soundVolume = volume !== undefined ? volume : (settings.soundVolume || 0.5);
  
  return playSound(soundType, soundVolume);
};

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
    "- /public/sounds/podium.mp3\n" +
    "- /public/sounds/firstPlace.mp3\n" +
    "These should be real MP3 files, not placeholder text files."
  );
};

// Execute setup on module import (to maintain original behavior)
setupUserInteractionTracking();
