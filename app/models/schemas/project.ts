import { Schema } from 'mongoose';

export const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  reports: [{ type: Schema.Types.ObjectId, ref: 'report' }],
  createdAt: { type: Date, default: Date.now },
});
