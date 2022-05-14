import { Schema } from 'mongoose';

export const ReportSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  dedication: {
    hours: { type: Number, required: true },
    minutes: { type: Number, default: 0 },
  },
  weekNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
