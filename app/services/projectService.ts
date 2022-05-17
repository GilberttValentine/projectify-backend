import { BusinessError, NotFoundError } from '../utils/errorHandlerMiddleware';
import { ProjectDTO } from '../models/dto/project';

import * as ProjectRepository from '../repositories/projectRepository';

export const createProject = async (project: ProjectDTO) => {
  const projectRepeated = await ProjectRepository.findByName(project.name);

  if (projectRepeated) throw new BusinessError('Project already exist');

  return await ProjectRepository.create(project);
};

export const findAllProjects = async () => {
  return await ProjectRepository.findAll();
};

export const findProjectById = async (id: string) => {
  const project = await ProjectRepository.findById(id);

  if (!project) throw new NotFoundError('Project not found');

  return project;
};

export const activateProject = async (id: string) => {
  const project = await ProjectRepository.findById(id);

  if (!project) throw new NotFoundError('Project not found');

  if (project.status === true) {
    throw new BusinessError('Project is already actived');
  }

  await ProjectRepository.activateById(id);

  return true;
};

export const deactivateProject = async (id: string) => {
  const project = await ProjectRepository.findById(id);

  if (!project) throw new NotFoundError('Project not found');

  if (project.status === false) {
    throw new BusinessError('Project is already deactived');
  }

  await ProjectRepository.deactivateById(id);

  return true;
};
