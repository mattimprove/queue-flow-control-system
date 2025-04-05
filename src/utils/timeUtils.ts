export const getTimeDifferenceInMinutes = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / 60000);
};

export const getTimeDifferenceInSeconds = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / 1000);
};

export const formatTimeSince = (dateString: string): string => {
  const totalSeconds = getTimeDifferenceInSeconds(dateString);
  
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  if (days > 0) {
    return `${days} dias ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
};

export const formatPhoneNumber = (phone: string | undefined, mode: 'full' | 'partial' | 'hidden'): string => {
  if (!phone || mode === 'hidden') return '***';
  
  if (mode === 'partial') {
    return `***-${phone.slice(-4)}`;
  }
  
  if (phone.length === 11) { // Brazilian mobile
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  } else if (phone.length === 10) { // Brazilian landline
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  
  return phone;
};

export const getTimeStatus = (
  dateString: string, 
  warningTimeMinutes: number, 
  criticalTimeMinutes: number
): { status: 'normal' | 'warning' | 'critical'; minutes: number } => {
  const minutes = getTimeDifferenceInMinutes(dateString);
  
  if (minutes >= criticalTimeMinutes) {
    return { status: 'critical', minutes };
  }
  
  if (minutes >= warningTimeMinutes) {
    return { status: 'warning', minutes };
  }
  
  return { status: 'normal', minutes };
};
