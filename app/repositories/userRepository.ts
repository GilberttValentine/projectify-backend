import { UserDTO } from '../models/dto/user';
import { User } from '../models/schemas/user';

export const create = async (user: UserDTO) => await new User(user).save();

export const findByEmail = async (email: string) => await User.findOne({ email: email }).exec();
