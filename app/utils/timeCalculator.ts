import { DateTime } from 'luxon';

export const validateTime = (hours: number, minutes: number) => {
  if ((hours === 0 && minutes === 0) || hours < 0 || minutes < 0 || minutes > 59) {
    return true;
  }

  return false;
};

export const validateWeekNumber = (weekNumber: number, currentYear: number, createdAt: Date) => {
  const dateConverted = DateTime.fromJSDate(createdAt).toUTC();

  const createdAtYear = dateConverted.year;
  const createdAtWeekNumber = dateConverted.weekNumber;

  if (currentYear === createdAtYear && weekNumber === createdAtWeekNumber) {
    return true;
  }

  return false;
};
