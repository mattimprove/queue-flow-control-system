
// This file serves as a facade to maintain backward compatibility
// It re-exports all functionality from the refactored modules

// Re-export from sound core
import { setupUserInteractionTracking, canPlayAudio, unlockAudio } from './sound/soundCore';
export { canPlayAudio, unlockAudio };

// Re-export from sound player
import { playSound, stopSound, startAlertNotification, stopAlertNotification } from './sound/soundPlayer';
export { playSound, stopSound, startAlertNotification, stopAlertNotification };

// Re-export from browser notifications
import { requestNotificationPermission, sendBrowserNotification } from './notifications/browserNotifications';
export { requestNotificationPermission, sendBrowserNotification };

// Execute setup on module import (to maintain original behavior)
setupUserInteractionTracking();
