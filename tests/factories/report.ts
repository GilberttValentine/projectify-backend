import { DateTime } from 'luxon';
import { randNumber } from '@ngneat/falso';

export class ReportFactory {
  userId = '';
  projectId = '';
  dedication = {
    hours: randNumber({ min: 1, max: 5 }),
    minutes: randNumber({ min: 0, max: 59 }),
  };
  weekNumber = DateTime.utc().weekNumber;
  createdAt = DateTime.utc().toJSDate();
}
