
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
