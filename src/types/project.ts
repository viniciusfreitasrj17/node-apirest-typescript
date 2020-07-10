import { Document } from 'mongoose';
import { ITask } from '../types/task';

export interface IProject extends Document {
  title?: string;
  description?: string;
  user?: string;
  tasks?: ITask[];
  createAt?: Date;
}
