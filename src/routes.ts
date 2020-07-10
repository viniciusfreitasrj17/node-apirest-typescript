import { Router } from 'express';

import UserController from './controllers/UserController';
import ProjectController from './controllers/ProjectController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/users', UserController.create);
routes.post('/authenticate', UserController.auth);
routes.post('/forgotPassword', UserController.forgotPassword);
routes.post('/resetPassword', UserController.resetPassword);

routes.get('/projects', authMiddleware, ProjectController.index);
routes.get('/projects/:projectId', authMiddleware, ProjectController.show);
routes.post('/projects', authMiddleware, ProjectController.store);
routes.put('/projects/:projectId', authMiddleware, ProjectController.update);
routes.delete(
  '/projects/:projectId',
  authMiddleware,
  ProjectController.destroy
);

export default routes;
