import { BadRequestError, BusinessError, NotFoundError } from '../utils/errorHandlerMiddleware';
import { ReportDTO } from '../models/dto/report';
import { DateTime, Duration } from 'luxon';
import * as TimeCalculator from '../utils/timeCalculator';

import * as ProjectRepository from '../repositories/projectRepository';
import * as ReportRepository from '../repositories/reportRepository';
import * as UserRepository from '../repositories/userRepository';

export const createReport = async (userId: string, report: ReportDTO) => {
  const user = UserRepository.findById(userId);
  if (!user) throw new NotFoundError('User was not found');

  const { projectId } = report;

  const project = ProjectRepository.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');

  const currentDate = DateTime.utc();
  const weekNumber = currentDate.weekNumber;

  report.userId = userId;
  report.weekNumber = weekNumber;

  const thisWeekUserReportsByProject = await ReportRepository.findUserReportsByProjectAndWeek(userId, projectId, weekNumber);
  if (thisWeekUserReportsByProject && TimeCalculator.validateWeekNumber(weekNumber, currentDate.year, thisWeekUserReportsByProject.createdAt)) throw new BusinessError('User has already reported this week');

  const currentWeekStartDate = currentDate.startOf('week').toUTC().toJSDate();
  const thisWeekUserReports = await ReportRepository.findUserReportsByWeek(userId, weekNumber, currentWeekStartDate);

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

export const findReportById = async (id: string) => {
  const report = await ReportRepository.findById(id);

  if (!report) throw new BusinessError('Report does not exist');

  return report;
};

export const findUserReports = async (userId: string) => {
  const reports = await ReportRepository.findReportsByUser(userId);

  if (reports.length === 0) {
    throw new NotFoundError('User has not reports');
  }

  return reports;
};

export const updateReport = async (userId: string, reportId: string, report: ReportDTO) => {
  const user = UserRepository.findById(userId);
  if (!user) throw new NotFoundError('User was not found');

  const reportToUpdate = await ReportRepository.findById(reportId);

  if (!reportToUpdate) throw new NotFoundError('Report does not exist');

  const currentDate = DateTime.utc();
  const currentMonth = currentDate.month;

  const conversionOfcreatedAt = DateTime.fromJSDate(reportToUpdate.createdAt).toUTC();
  const monthOfcreatedAt = conversionOfcreatedAt.month;

  if (currentMonth !== monthOfcreatedAt) throw new BusinessError('The updatable date from report is expired');

  const weekStartDateOfCreatedAt = conversionOfcreatedAt.startOf('week').toUTC().toJSDate();
  const weekNumberOfCreatedAt = conversionOfcreatedAt.weekNumber;

  const weekUserReportsOfCreatedAt = await ReportRepository.findUserReportsByWeek(userId, weekNumberOfCreatedAt, weekStartDateOfCreatedAt);

  const { hours, minutes } = report.dedication;
  if (TimeCalculator.validateTime(hours, minutes)) throw new BadRequestError('BAD REQUEST');

  let totalHoursReported = 0;
  let totalMinutesReported = 0;

  weekUserReportsOfCreatedAt.forEach((it) => {
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

  reportToUpdate.dedication = report.dedication;

  return await ReportRepository.update(reportId, reportToUpdate);
};
