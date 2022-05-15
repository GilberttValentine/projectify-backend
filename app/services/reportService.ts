import { BadRequestError, BusinessError, NotFoundError } from '../utils/errorHandlerMiddleware';
import { ReportDTO } from '../models/dto/report';
import { DateTime, Duration } from 'luxon';
import * as TimeCalculator from '../utils/timeCalculator';

import * as ProjectRepository from '../repositories/projectRepository';
import * as ReportRepository from '../repositories/reportRepository';
import * as UserRepository from '../repositories/userRepository';

export const createReport = async (projectId: string, userId: string, report: ReportDTO) => {
  const user = UserRepository.findById(userId);

  if (!user) throw new NotFoundError('User was not found');

  const project = ProjectRepository.findById(projectId);

  if (!project) throw new NotFoundError('Project not found');

  const weekNumber = DateTime.utc().weekNumber;

  report.userId = userId;
  report.projectId = projectId;
  report.weekNumber = weekNumber;

  const thisWeekUserReportsByProject = await ReportRepository.findUserReportsByProjectAndWeek(userId, projectId, weekNumber);

  if (thisWeekUserReportsByProject) throw new BusinessError('User has already reported this week');

  const thisWeekUserReports = await ReportRepository.findUserReportsByWeek(userId, weekNumber);

  const { hours, minutes } = report.dedication;

  if (TimeCalculator.validateTime(hours, minutes)) throw new BadRequestError('BAD REQUEST');

  let totalHoursReported = 0;
  let totalMinutesReported = 0;

  thisWeekUserReports.forEach((it) => {
    const { hours, minutes } = it.dedication;

    totalHoursReported += hours;
    totalMinutesReported += minutes;
  });

  const totalHours = Duration.fromObject({ hours: totalHoursReported, minutes: totalMinutesReported });
  const todayTotalHours = Duration.fromObject({ hours: hours, minutes: minutes });

  // This is equivalent to 45 hours
  const limitOfTimeInMinutes = 2700;

  if (totalHours.as('minutes') + todayTotalHours.as('minutes') > limitOfTimeInMinutes) {
    throw new BusinessError('User has exceded the limit of hours');
  }

  return await ReportRepository.create(report);
};
