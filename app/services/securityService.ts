/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');

import { UnauthorizedError } from '../utils/errorHandlerMiddleware';

import * as UserRepository from '../repositories/userRepository';
import { comparePassword } from '../utils/passwordEncrypter';
import { PayloadDTO } from '../models/dto/payload';

const { SECRET, EXPIRATION = '1d' } = process.env;

export const login = async (email: string, password: string) => {
  const user = await UserRepository.findByEmail(email);

  if (!user) throw new UnauthorizedError('Credentials are invalid');
  if (!user.status) throw new UnauthorizedError('User has been deactivated');

  if (!(await comparePassword(password, user.password))) throw new UnauthorizedError('Credentials are invalid');

  const payload: PayloadDTO = {
    names: user.names,
    lastNames: user.lastNames,
    email: user.email,
    status: user.status,
  };

  const token = { token: jwt.sign(payload, SECRET, { expiresIn: EXPIRATION }) };

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    return await jwt.verify(token, SECRET);
  } catch (error) {
    throw new UnauthorizedError('Unauthorized');
  }
};
