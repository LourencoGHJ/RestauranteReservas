export const generateTimeSlots = () => {
  const slots = [];
  let hour = 12;
  let minutes = 0;

  while (hour < 23 || (hour === 22 && minutes === 30)) {
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    slots.push(`${formattedHour}:${formattedMinutes}`);
    
    minutes += 30;
    if (minutes === 60) {
      minutes = 0;
      hour += 1;
    }
  }

  return slots;
};