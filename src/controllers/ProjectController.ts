import { Request, Response } from 'express';

import { TReq } from '../types/user';
import { ITask } from '../types/task';
import Project from '../models/Project';
import Task from '../models/Task';

class ProjectController {
  public async index(req: Request & TReq, res: Response): Promise<Response> {
    try {
      const projects = await Project.find().populate(['user', 'tasks']);

      return res.json({ projects });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Project Index Failed' });
    }
  }

  public async show(req: Request & TReq, res: Response): Promise<Response> {
    try {
      const project = await Project.findById(req.params.projectId).populate([
        'user',
        'tasks'
      ]);

      return res.json({ project });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Project Show Failed' });
    }
  }

  public async store(req: Request & TReq, res: Response): Promise<Response> {
    try {
      const { title, description, tasks } = req.body;

      const project = await Project.create({
        title,
        description,
        user: req.userId as string
      });

      await Promise.all(
        tasks.map(async (task: ITask) => {
          const projectTask = new Task({ ...task, project: project._id }); // or Task.create({...})

          await projectTask.save();

          project.tasks.push(projectTask);
        })
      );

      await project.save();

      return res.json({ project });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Project Store Failed' });
    }
  }

  public async update(req: Request & TReq, res: Response): Promise<Response> {
    try {
      const { title, description, tasks } = req.body;

      const project = await Project.findByIdAndUpdate(
        req.params.projectId,
        {
          title,
          description
        },
        { new: true }
      );

      project.tasks = [];
      await Task.deleteOne({ project: project._id });

      await Promise.all(
        tasks.map(async (task: ITask) => {
          const projectTask = new Task({ ...task, project: project._id }); // or Task.create({...})

          await projectTask.save();

          project.tasks.push(projectTask);
        })
      );

      await project.save();

      return res.json({ project });
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Project Update Failed' });
    }
  }

  public async destroy(req: Request & TReq, res: Response): Promise<Response> {
    try {
      await Project.findByIdAndRemove(req.params.projectId);

      return res.send();
    } catch (err) {
      return res.status(400).json({ Mensagge: 'Project Destroy Failed' });
    }
  }
}

export default new ProjectController();
