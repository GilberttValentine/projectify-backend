import { ProjectDTO } from '../models/dto/project';
import { Project } from '../models/schemas/project';

export const create = async (project: ProjectDTO) => await new Project(project).save();

export const findAll = async () => await Project.find().exec();

export const findByName = async (name: string) => await Project.findOne({ name: name }).exec();

export const findById = async (id: string) => await Project.findById(id).exec();

export const activateById = async (id: string) => await Project.findOneAndUpdate({ _id: id }, { status: true }).exec();

export const deactivateById = async (id: string) => await Project.findOneAndUpdate({ _id: id }, { status: false }).exec();
