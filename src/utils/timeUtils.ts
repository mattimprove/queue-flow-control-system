
export const getTimeDifferenceInMinutes = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / 60000);
};

export const formatTimeSince = (dateString: string): string => {
  const minutes = getTimeDifferenceInMinutes(dateString);
  
  if (minutes < 1) {
    return "Agora mesmo";
  }
  if (minutes === 1) {
    return "1 minuto atrás";
  }
  if (minutes < 60) {
    return `${minutes} minutos atrás`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) {
    return "1 hora atrás";
  }
  if (hours < 24) {
    return `${hours} horas atrás`;
  }
  
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "1 dia atrás";
  }
  return `${days} dias atrás`;
};

export const formatPhoneNumber = (phone: string | undefined, mode: 'full' | 'partial' | 'hidden'): string => {
  if (!phone || mode === 'hidden') return '***';
  
  if (mode === 'partial') {
    // Show only the last 4 digits
    return `***-${phone.slice(-4)}`;
  }
  
  // Full mode - format nicely if it's a Brazilian number
  if (phone.length === 11) { // Brazilian mobile
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  } else if (phone.length === 10) { // Brazilian landline
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  
  // Return as is if it doesn't match standard formats
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
