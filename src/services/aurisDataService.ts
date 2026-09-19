export const STORAGE_KEYS = {
  ROLE: 'auris_role_v3',
  INCIDENTS: 'auris_incidents_v3',
  COMPLAINTS: 'auris_complaints_v3',
  PROJECTS: 'auris_carbon_projects_v3',
  TRANSACTIONS: 'auris_carbon_txns_v3',
  PORTFOLIO: 'auris_carbon_portfolio_v3',
  NOTIFICATIONS: 'auris_notifications_v3',
  DMAS: 'auris_dmas_v3',
  AUDIT: 'auris_audit_v3',
  AUTH_TOKEN: 'auris_auth_token_v3',
  AUTH_USER: 'auris_auth_user_v3',
  COUNTRY: 'auris_current_country_v3',
  CITY: 'auris_current_city_v3',
  ACTIVE_TAB: 'auris_active_tab_v3'
} as const;


export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const loadState = <T>(key: StorageKey, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

export const saveState = <T>(key: StorageKey, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // fail silently for private mode / quota issues
  }
};

export const hydrateFromBackend = async <T>(
  key: StorageKey,
  fallback: T,
  backendLoader?: () => Promise<T>
): Promise<T> => {
  try {
    if (backendLoader) {
      const remoteValue = await backendLoader();
      if (remoteValue) {
        saveState(key, remoteValue);
        return remoteValue;
      }
    }

    return loadState(key, fallback);
  } catch {
    return loadState(key, fallback);
  }
};
