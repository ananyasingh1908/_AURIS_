import { getStatus } from './healthController.js';
import { login, googleAuth, getRoles, getCurrentUser } from './authController.js';
import { listIncidents, getIncidentById, createIncident, updateIncidentStatus } from './incidentsController.js';
import { listComplaints, getComplaintById, createComplaint, updateComplaintStatus } from './complaintsController.js';
import { listProjects, createProject, purchaseCredits, retireCredits } from './carbonController.js';
import { listNotifications, markNotificationRead } from './notificationsController.js';
import { chat } from './chatController.js';

export const healthController = { getStatus };
export const authController = { login, googleAuth, getRoles, getCurrentUser };
export const incidentsController = { listIncidents, getIncidentById, createIncident, updateIncidentStatus };
export const complaintsController = { listComplaints, getComplaintById, createComplaint, updateComplaintStatus };
export const carbonController = { listProjects, createProject, purchaseCredits, retireCredits };
export const notificationsController = { listNotifications, markNotificationRead };
export const chatController = { chat };
