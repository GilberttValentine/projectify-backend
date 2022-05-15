import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/userService';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const response = await UserService.createUser(body);

    return res.send({ message: 'User created successfully', user: response });
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();
    return next(error);
  }
};
