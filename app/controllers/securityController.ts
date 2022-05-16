import { Request, Response, NextFunction } from 'express';
import * as SecurityService from '../services/securityService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const response = await SecurityService.login(email, password);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;

    const response = await SecurityService.verifyToken(body.token);

    return res.send(response);
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};
