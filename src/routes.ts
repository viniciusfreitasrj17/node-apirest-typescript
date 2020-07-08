import { Router } from 'express';

import UserController from './controllers/UserController';
import AuthenticateController from './controllers/AuthenticateController';
import ProjectController from './controllers/ProjectController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/authenticate', AuthenticateController.store);

routes.get('/projects', authMiddleware, ProjectController.index);

export default routes;
