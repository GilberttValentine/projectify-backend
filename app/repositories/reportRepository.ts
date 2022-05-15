import { ReportDTO } from '../models/dto/report';
import { Report } from '../models/schemas/report';

export const create = async (report: ReportDTO) => await new Report(report).save();

export const findUserReportsByProjectAndWeek = async (userId: string, projectId: string, weekNumber: number) => await Report.findOne({ userId, projectId, weekNumber }).exec();

export const findUserReportsByWeek = async (userId: string, weekNumber: number) => await Report.find({ userId, weekNumber }).exec();
