/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');

import { NotFoundError, UnauthorizedError } from './errorHandlerMiddleware';
import { findByEmail } from '../repositories/userRepository';

export const securityInterceptor = async (req: any, res: any, next: any) => {
  try {
    const auth = req.header('Authorization');
    if (!auth) throw new UnauthorizedError('Unauthorized');

    if (!auth.toLowerCase().startsWith('bearer')) {
      throw new UnauthorizedError('Unauthorized');
    }

    const token = auth.slice(7);
    const payload = jwt.verify(token, process.env.SECRET);

    const user = await findByEmail(payload.email);

    if (!user) throw new NotFoundError('User does not exist');

    req.user = user;

    if (payload) return next();
  } catch (error: any) {
    const status = error.status || 500;

    res.status(status).send({ status: error.status, message: error.message }).end();

    return next(error);
  }
};
