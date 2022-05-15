export const validateTime = (hours: number, minutes: number) => {
  if ((hours === 0 && minutes === 0) || hours < 0 || minutes < 0 || minutes > 59) {
    return true;
  }

  return false;
};
