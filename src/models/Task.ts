import { Schema, model, SchemaTypes } from 'mongoose';

import { ITask } from '../types/task';

const TaskModel = new Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: SchemaTypes.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default model<ITask>('Task', TaskModel);
