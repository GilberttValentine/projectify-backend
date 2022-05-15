import express from 'express';
import * as UserController from '../controllers/userController';
import * as ProjectController from '../controllers/projectController';
import * as ReportController from '../controllers/reportController';

export const router = express.Router();

router.post('/users', UserController.createUser);

router.post('/projects', ProjectController.createProject);
router.get('/projects', ProjectController.findProjectById);
router.patch('/projects/:id/activate', ProjectController.activateProject);
router.patch('/projects/:id/deactivate', ProjectController.deactivateProject);

router.post('/projects/:projectId/reports', ReportController.createReport);
