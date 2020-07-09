import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '../types/user';

const UserModel = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

UserModel.pre('save', async function (next) {
  const user = this as IUser;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  next();
});

export default model<IUser>('User', UserModel);
