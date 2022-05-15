import { User } from '../app/models/schemas/user';
import { Project } from '../app/models/schemas/project';

export const clearAll = async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
};
