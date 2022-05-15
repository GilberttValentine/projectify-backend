import { BusinessError } from '../utils/errorHandlerMiddleware';
import { encryptPassword } from '../utils/passwordEncrypter';
import * as EmailValidator from 'email-validator';

import { UserDTO } from '../models/dto/user';
import * as UserRepository from '../repositories/userRepository';

export const createUser = async (user: UserDTO) => {
  const emailRepeated = await UserRepository.findByEmail(user.email);

  if (emailRepeated) throw new BusinessError('The email address already in use');

  if (!EmailValidator.validate(user.email)) throw new BusinessError('The email address is invalid');

  user.password = await encryptPassword(user.password);

  await UserRepository.create(user);

  const body = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  return body;
};
