
// Format the phone number for display based on display mode
export const formatPhoneDisplay = (
  phone: string | undefined, 
  mode: 'full' | 'partial' | 'hidden'
): string => {
  if (!phone || mode === 'hidden') {
    return '***-***-****';
  }
  
  if (mode === 'partial') {
    // Only show the last 4 digits
    return `***-***-${phone.slice(-4)}`;
  }
  
  // Format as Brazilian number if it matches
  if (phone.length === 11) { // Brazilian mobile number
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  } else if (phone.length === 10) { // Brazilian landline
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  
  // Return as is for other formats
  return phone;
};
