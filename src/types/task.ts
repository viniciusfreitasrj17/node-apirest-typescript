import { Document } from 'mongoose';

export interface ITask extends Document {
  title?: string;
  project?: string;
  assignedTo?: string;
  completed?: boolean;
  createAt?: Date;
}
