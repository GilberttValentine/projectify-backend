import { Request, Response, NextFunction } from 'express';
import * as ReportService from '../services/reportService';

export const createReport = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { body, user } = req;

    const response = await ReportService.createReport(user._id, body);

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

export const findUserReports = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    const response = await ReportService.findUserReports(user._id);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const updateReport = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { body, user, params } = req;
    const response = await ReportService.updateReport(user, params.id, body);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const findProjectReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const response = await ReportService.findProjectReports(params.id);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};
