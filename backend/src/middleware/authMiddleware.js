import { verifyToken } from '../services/authService.js';
import { findUserByEmail } from '../services/authService.js';

export const GOVERNMENT_ROLES = [
  'CITY_ADMIN',
  'ALL_ADMIN',
  'WATER_DEPT',
  'MOBILITY_DEPT',
  'ENERGY_DEPT',
  'WASTE_DEPT',
  'ENVIRONMENT_DEPT',
  'INFRASTRUCTURE_DEPT',
  'HEALTH_DEPT',
  'EMERGENCY_DEPT',
  'GOVT_CARBON_MONITOR'
];

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token missing' });
  }

  try {
    const decoded = verifyToken(token);
    const user = findUserByEmail(decoded.email || '');

    if (!user || !user.role || !['CITY_ADMIN', 'WATER_DEPT', 'MOBILITY_DEPT', 'ENERGY_DEPT', 'WASTE_DEPT', 'ENVIRONMENT_DEPT', 'INFRASTRUCTURE_DEPT', 'HEALTH_DEPT', 'EMERGENCY_DEPT', 'CARBON_COMPANY', 'GOVT_CARBON_MONITOR', 'CITIZEN', 'ALL_ADMIN'].includes(user.role)) {
      return res.status(401).json({ success: false, message: 'Invalid user in token or unknown role' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const normalizedAllowed = allowedRoles.map((role) => String(role).trim());
    const validRoles = new Set([
      'CITY_ADMIN',
      'ALL_ADMIN',
      'WATER_DEPT',
      'MOBILITY_DEPT',
      'ENERGY_DEPT',
      'WASTE_DEPT',
      'ENVIRONMENT_DEPT',
      'INFRASTRUCTURE_DEPT',
      'HEALTH_DEPT',
      'EMERGENCY_DEPT',
      'CARBON_COMPANY',
      'GOVT_CARBON_MONITOR',
      'CITIZEN'
    ]);

    if (!userRole || !validRoles.has(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role ${String(userRole || 'unknown')} is not recognized.`
      });
    }

    if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole) && userRole !== 'ALL_ADMIN' && userRole !== 'CITY_ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires [${normalizedAllowed.join(', ')}], current role is ${userRole}`
      });
    }

    next();
  };
};
