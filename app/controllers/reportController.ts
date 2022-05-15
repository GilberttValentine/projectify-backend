import { Request, Response, NextFunction } from 'express';
import * as ReportService from '../services/reportService';

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: any = req;
    const { body, user } = request;
    const response = await ReportService.createReport('6280a2d9ccb1699f749c0c40', body);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const findReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const response = await ReportService.findReportById(params.reportId);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, params } = req;
    const response = await ReportService.updateReport('6280a2d9ccb1699f749c0c40', params.id, body);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};
