import mongoose, { Schema } from 'mongoose';

export const ReportSchema = new Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  dedication: {
    hours: { type: Number, required: true },
    minutes: { type: Number, default: 0 },
  },
  weekNumber: { type: Number, required: true },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model('Report', ReportSchema, 'reports');
