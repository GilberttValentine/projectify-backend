import { ProjectDTO } from '../models/dto/project';
import { Project } from '../models/schemas/project';

export const create = async (project: ProjectDTO) => await new Project(project).save();

export const findByName = async (name: string) => await Project.findOne({ name }).exec();

export const findById = async (id: string) => await Project.findOne({ id }).exec();

export const activateById = async (id: string) => await Project.findOneAndUpdate({ id }, { status: true }).exec();

export const deactivateById = async (id: string) => await Project.findOneAndUpdate({ id }, { status: false }).exec();
