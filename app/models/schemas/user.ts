import mongoose, { Schema } from 'mongoose';
import { DateTime } from 'luxon';

const UserSchema = new Schema({
  names: { type: String, required: true },
  lastNames: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: DateTime.utc() },
});

export const User = mongoose.model('User', UserSchema, 'users');
