import { Router } from 'express';
import { healthController, authController, incidentsController, complaintsController, carbonController, notificationsController, chatController } from '../controllers/index.js';
import { authenticateToken, requireRole, GOVERNMENT_ROLES } from '../middleware/authMiddleware.js';

export const apiRouter = Router();

apiRouter.get('/health', healthController.getStatus);

apiRouter.post('/auth/login', authController.login);
apiRouter.post('/auth/google', authController.googleAuth);
apiRouter.get('/auth/roles', authController.getRoles);
apiRouter.get('/auth/me', authenticateToken, authController.getCurrentUser);

apiRouter.post('/chat', chatController.chat);

apiRouter.get('/incidents', authenticateToken, requireRole(GOVERNMENT_ROLES), incidentsController.listIncidents);
apiRouter.get('/incidents/:id', authenticateToken, requireRole(GOVERNMENT_ROLES), incidentsController.getIncidentById);
apiRouter.post('/incidents', authenticateToken, requireRole(GOVERNMENT_ROLES), incidentsController.createIncident);
apiRouter.patch('/incidents/:id/status', authenticateToken, requireRole(GOVERNMENT_ROLES), incidentsController.updateIncidentStatus);

apiRouter.get('/complaints', authenticateToken, requireRole(GOVERNMENT_ROLES), complaintsController.listComplaints);
apiRouter.get('/complaints/:id', authenticateToken, requireRole(GOVERNMENT_ROLES), complaintsController.getComplaintById);
apiRouter.post('/complaints', authenticateToken, requireRole(GOVERNMENT_ROLES), complaintsController.createComplaint);
apiRouter.patch('/complaints/:id/status', authenticateToken, requireRole(GOVERNMENT_ROLES), complaintsController.updateComplaintStatus);

apiRouter.get('/carbon/projects', authenticateToken, requireRole(GOVERNMENT_ROLES.concat(['CARBON_COMPANY'])), carbonController.listProjects);
apiRouter.post('/carbon/projects', authenticateToken, requireRole(GOVERNMENT_ROLES.concat(['CARBON_COMPANY'])), carbonController.createProject);
apiRouter.post('/carbon/purchase', authenticateToken, requireRole(GOVERNMENT_ROLES.concat(['CARBON_COMPANY'])), carbonController.purchaseCredits);
apiRouter.post('/carbon/retire', authenticateToken, requireRole(GOVERNMENT_ROLES.concat(['CARBON_COMPANY'])), carbonController.retireCredits);

apiRouter.get('/notifications', authenticateToken, requireRole(GOVERNMENT_ROLES), notificationsController.listNotifications);
apiRouter.patch('/notifications/:id/read', authenticateToken, requireRole(GOVERNMENT_ROLES), notificationsController.markNotificationRead);
