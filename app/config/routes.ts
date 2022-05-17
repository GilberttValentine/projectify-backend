import express from 'express';
import * as SecurityAuthMiddleware from '../utils/securityAuthMiddleware';

import * as UserController from '../controllers/userController';
import * as ProjectController from '../controllers/projectController';
import * as ReportController from '../controllers/reportController';
import * as SecurityController from '../controllers/securityController';

export const router = express.Router();

// Users
router.post('/users', UserController.createUser);

// Projects
router.post('/projects', SecurityAuthMiddleware.securityInterceptor, ProjectController.createProject);
router.get('/projects', SecurityAuthMiddleware.securityInterceptor, ProjectController.findAllProjects);
router.get('/projects/:id', SecurityAuthMiddleware.securityInterceptor, ProjectController.findProjectById);
router.patch('/projects/:id/activate', SecurityAuthMiddleware.securityInterceptor, ProjectController.activateProject);
router.patch('/projects/:id/deactivate', SecurityAuthMiddleware.securityInterceptor, ProjectController.deactivateProject);

// Reports
router.post('/reports', SecurityAuthMiddleware.securityInterceptor, ReportController.createReport);
router.get('/reports/my-reports', SecurityAuthMiddleware.securityInterceptor, ReportController.findUserReports);
router.get('/reports/:id', SecurityAuthMiddleware.securityInterceptor, ReportController.findReportById);
router.put('/reports/:id', SecurityAuthMiddleware.securityInterceptor, ReportController.updateReport);
router.get('/projects/:id/reports', SecurityAuthMiddleware.securityInterceptor, ReportController.findProjectReports);

// Security
router.post('/security/login', SecurityController.login);
router.post('/security/verify-token', SecurityController.verifyToken);
