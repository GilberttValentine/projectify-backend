import { Request, Response } from 'express';
import * as ReportService from '../services/reportService';

export const createReport = async (req: Request, res: Response) => {
  try {
    const request: any = req;
    const { body, params, user } = request;
    const response = await ReportService.createReport(params.projectId, "6280a2d9ccb1699f749c0c40", body);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    return res.status(status).send({ status: error.status, message: error.message }).end();
  }
};
