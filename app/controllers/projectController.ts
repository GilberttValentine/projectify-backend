import { Request, Response, NextFunction } from 'express';
import * as ProjectService from '../services/projectService';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const response = await ProjectService.createProject(body);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();
    return next(error);
  }
};

export const findProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const response = await ProjectService.findProjectById(params.id);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const activateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const response = await ProjectService.activateProject(params.id);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const deactivateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const response = await ProjectService.deactivateProject(params.id);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};
