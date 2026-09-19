import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const operationalUsers = [
  {
    id: 'user-001',
    name: 'Ananya Singh',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'CITY_ADMIN',
    department: 'Office of the Mayor & Municipal Commissioner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-1 Executive Clearance'
  },
  {
    id: 'user-002',
    name: 'Ananya Singh (Water Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'WATER_DEPT',
    department: 'Water & Drainage Department',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Municipal Operations'
  },
  {
    id: 'user-003',
    name: 'Ananya Singh (Mobility Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'MOBILITY_DEPT',
    department: 'Traffic & Mobility Department',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Municipal Operations'
  },
  {
    id: 'user-004',
    name: 'Ananya Singh (Grid Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'ENERGY_DEPT',
    department: 'Energy & Smart Grid Department',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Critical Infrastructure'
  },
  {
    id: 'user-005',
    name: 'Ananya Singh (Waste Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'WASTE_DEPT',
    department: 'Waste Management Department',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Municipal Operations'
  },
  {
    id: 'user-006',
    name: 'Ananya Singh (Climate Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'ENVIRONMENT_DEPT',
    department: 'Environment & Climate Resilience',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Environmental Oversight'
  },
  {
    id: 'user-007',
    name: 'Ananya Singh (Infra Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'INFRASTRUCTURE_DEPT',
    department: 'Public Works & Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Public Works'
  },
  {
    id: 'user-008',
    name: 'Ananya Singh (Health Ops)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'HEALTH_DEPT',
    department: 'Public Health Department',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-2 Public Health'
  },
  {
    id: 'user-009',
    name: 'Ananya Singh (Emergency Cmd)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'EMERGENCY_DEPT',
    department: 'Emergency Services & 911 Operations',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-1 Emergency Command'
  },
  {
    id: 'user-010',
    name: 'Ananya Singh (Carbon Developer)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'CARBON_COMPANY',
    department: 'Nordic Carbon Solutions & Bio-Credits',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Verified Carbon Developer'
  },
  {
    id: 'user-011',
    name: 'Ananya Singh (Carbon Auditor)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'GOVT_CARBON_MONITOR',
    department: 'National Climate Registry & Emission Audits',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Sovereign Carbon Auditor'
  },
  {
    id: 'user-012',
    name: 'Ananya Singh',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'CITIZEN',
    department: 'Citizen Contributor & Verified Resident',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-3 Public Verified Resident'
  },
  {
    id: 'user-013',
    name: 'Ananya Singh (Master Admin)',
    email: 'ananyasingh561329@gmail.com',
    password: 'AURIS123',
    role: 'ALL_ADMIN',
    department: 'System Core & Multi-Agent Orchestrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    clearanceLevel: 'Tier-0 Master System Authority'
  }
];

export const findUserByEmail = (email) => {
  return operationalUsers.find((user) => user.email.toLowerCase() === String(email).trim().toLowerCase()) || null;
};

export const findUserByRole = (role) => {
  return operationalUsers.find((user) => user.role.toUpperCase() === String(role).trim().toUpperCase()) || null;
};

export const issueToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
      avatar: user.avatar,
      authProvider: user.authProvider || 'credentials'
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
