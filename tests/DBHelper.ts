import { User } from '../app/models/schemas/user';
import { Project } from '../app/models/schemas/project';
import { Report } from '../app/models/schemas/report';

export const clearAll = async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Report.deleteMany({});
};
