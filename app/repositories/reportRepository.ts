import { DateTime } from 'luxon';
import { ReportDTO } from '../models/dto/report';
import { Report } from '../models/schemas/report';

export const create = async (report: ReportDTO) => await new Report(report).save();

export const update = async (id: string, report: ReportDTO) => Report.findOneAndUpdate({ id }, { dedication: report.dedication }).exec();

export const findById = async (id: string) => await Report.findOne({ id }).exec();

export const findUserReportsByProjectAndWeek = async (userId: string, projectId: string, weekNumber: number) => await Report.findOne({ userId, projectId, weekNumber }).exec();

export const findUserReportsByWeek = async (userId: string, weekNumber: number, currentWeekStartDate: Date) => await Report.find({ userId, weekNumber, createdAt: { $gt: currentWeekStartDate, $lt: DateTime.utc() } }).exec();

export const findReportsByUser = async (userId: string) => await Report.find({ userId }).exec();
