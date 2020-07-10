import { Schema, model, SchemaTypes } from 'mongoose';

import { IProject } from '../types/project';

const ProjectModel = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Task'
    }
  ],
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default model<IProject>('Project', ProjectModel);
