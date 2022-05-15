import mongoose, { Schema } from 'mongoose';
import { DateTime } from 'luxon';

export const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: DateTime.utc() },
});

export const Project = mongoose.model('Project', ProjectSchema, 'projects');
