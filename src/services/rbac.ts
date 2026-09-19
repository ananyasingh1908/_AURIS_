import { RoleId } from '../types';

export const GOVERNMENT_ONLY_TABS = new Set([
  'urban-command',
  'city-health',
  'departments',
  'analytics',
  'agents'
]);

export const SAFE_PUBLIC_TABS = new Set(['overview', 'citizen', 'auth', 'carbon']);

const VALID_ROLES: Record<string, true> = {
  CITY_ADMIN: true,
  WATER_DEPT: true,
  MOBILITY_DEPT: true,
  ENERGY_DEPT: true,
  WASTE_DEPT: true,
  ENVIRONMENT_DEPT: true,
  INFRASTRUCTURE_DEPT: true,
  HEALTH_DEPT: true,
  EMERGENCY_DEPT: true,
  CARBON_COMPANY: true,
  GOVT_CARBON_MONITOR: true,
  CITIZEN: true,
  ALL_ADMIN: true
};

export const isValidRole = (role?: string | null): role is RoleId => {
  return Boolean(role && VALID_ROLES[role]);
};

export const getDefaultAuthorizedTab = (role?: string | null): string => {
  return role === 'CITIZEN' ? 'citizen' : 'overview';
};

export const isGovernmentTab = (tab?: string | null): boolean => {
  return Boolean(tab && GOVERNMENT_ONLY_TABS.has(tab));
};

export const isTabAllowedForRole = (role?: string | null, tab?: string | null): boolean => {
  const normalizedTab = (tab || 'overview').trim();

  if (!normalizedTab) {
    return false;
  }

  if (!role || !isValidRole(role)) {
    return SAFE_PUBLIC_TABS.has(normalizedTab);
  }

  if (role === 'CITIZEN') {
    return normalizedTab === 'citizen' || normalizedTab === 'overview' || normalizedTab === 'auth';
  }

  if (role === 'CITY_ADMIN' || role === 'ALL_ADMIN') {
    return true;
  }

  if (role === 'CARBON_COMPANY' || role === 'GOVT_CARBON_MONITOR') {
    return normalizedTab === 'carbon' || normalizedTab === 'overview' || normalizedTab === 'auth';
  }

  if (role.endsWith('_DEPT')) {
    return normalizedTab === 'departments' || normalizedTab === 'overview' || normalizedTab === 'auth';
  }

  return normalizedTab === 'overview' || normalizedTab === 'auth';
};

export const getAuthorizedTabForRole = (role?: string | null, tab?: string | null): string => {
  const normalizedTab = (tab || 'overview').trim();
  return isTabAllowedForRole(role, normalizedTab) ? normalizedTab : getDefaultAuthorizedTab(role);
};

export const canAccessGovernmentSection = (role?: string | null): boolean => {
  return isValidRole(role) && role !== 'CITIZEN';
};
