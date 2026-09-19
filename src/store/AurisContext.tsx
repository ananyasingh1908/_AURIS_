import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  RoleId,
  Incident,
  IncidentStatus,
  Complaint,
  ComplaintStatus,
  CarbonProject,
  CarbonTransaction,
  CarbonPortfolio,
  CityHealthMetric,
  AgentInfo,
  NotificationItem,
  UserRoleProfile,
  UrbanCausalScenario,
  CausalNode,
  ProblemInterventionPlan,
  DistrictMeteredArea,
  IntersectionTelemetry,
  EmergencyPriorityCorridor,
  SmartWasteBin,
  WasteTruckRoute,
  CitizenComplaintCluster,
  PredictiveAsset,
  CoordinatedWorkWindow,
  EnergyFlexibilityPlan,
  HeatExposureZone,
  CityEmissionsInventory,
  AuditLogEntry
} from '../types';
import {
  USER_ROLES,
  INITIAL_INCIDENTS,
  INITIAL_COMPLAINTS,
  INITIAL_CARBON_PROJECTS,
  INITIAL_TRANSACTIONS,
  INITIAL_PORTFOLIO,
  CITY_HEALTH_METRICS,
  AI_AGENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import {
  INITIAL_CAUSAL_SCENARIOS,
  INITIAL_INTERVENTION_PLANS,
  INITIAL_DMAS,
  INITIAL_INTERSECTIONS,
  INITIAL_EMERGENCY_CORRIDORS,
  INITIAL_SMART_BINS,
  INITIAL_WASTE_ROUTE,
  INITIAL_COMPLAINT_CLUSTERS,
  INITIAL_COORDINATED_WORKS,
  INITIAL_PREDICTIVE_ASSETS,
  INITIAL_HEAT_ZONES,
  INITIAL_ENERGY_FLEXIBILITY,
  INITIAL_CITY_EMISSIONS_INVENTORY,
  INITIAL_AUDIT_LOGS
} from '../services/urbanIntelligence';
import {
  FullIncidentExecutionResult,
  createWaterContaminationIncident,
  executeFullIncidentPipeline
} from '../services/incidentEngine';
import confetti from 'canvas-confetti';
import { STORAGE_KEYS, loadState, saveState, hydrateFromBackend } from '../services/aurisDataService';
import {
  getAuthorizedTabForRole,
  getDefaultAuthorizedTab,
  isGovernmentTab,
  isTabAllowedForRole,
  isValidRole
} from '../services/rbac';

export interface SimulationParams {
  rainfall: number;
  temperature: number;
  traffic: number;
  population: number;
  energyDemand: number;
  pollution: number;
}

interface AurisContextType {
  currentRole: RoleId;
  userProfile: UserRoleProfile;
  setRole: (roleId: RoleId) => void;
  currentCountry: string;
  setCountry: (country: string) => void;
  currentCity: string;
  setCity: (city: string) => void;
  isAuthenticated: boolean;
  authToken: string | null;
  loginWithGoogle: (roleId: RoleId, country?: string, city?: string, customUser?: Partial<UserRoleProfile>) => Promise<boolean>;
  logout: () => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  simulateModalOpen: boolean;
  setSimulateModalOpen: (open: boolean) => void;
  simulatedPipelineResult: FullIncidentExecutionResult | null;
  addSimulatedIncident: (result: FullIncidentExecutionResult) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authGuardOpen: boolean;
  setAuthGuardOpen: (open: boolean) => void;
  authGuardMessage: string;
  setAuthGuardMessage: (message: string) => void;

  // Incidents
  incidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus, team?: string) => void;
  
  // Complaints
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  submitComplaint: (data: {
    issue: string;
    category: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
    image?: string;
  }) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, note?: string) => void;

  // Carbon
  carbonProjects: CarbonProject[];
  selectedProject: CarbonProject | null;
  setSelectedProject: (project: CarbonProject | null) => void;
  carbonTransactions: CarbonTransaction[];
  carbonPortfolio: CarbonPortfolio;
  buyCarbonCredits: (projectId: string, quantity: number) => boolean;
  retireCarbonCredits: (projectId: string, quantity: number, purpose?: string, beneficiary?: string) => boolean;
  listCarbonProject: (project: Omit<CarbonProject, 'id'>) => void;
  buyModalProject: CarbonProject | null;
  setBuyModalProject: (project: CarbonProject | null) => void;
  sellModalOpen: boolean;
  setSellModalOpen: (open: boolean) => void;

  // City Health & Dynamic Metric Outcomes
  cityHealthMetrics: CityHealthMetric[];
  selectedHealthCategory: string | null;
  setSelectedHealthCategory: (category: string | null) => void;
  overallCityHealth: number;

  // Simulation
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  resetSimulation: () => void;

  // Agents
  agents: AgentInfo[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: 'critical' | 'warning' | 'info' | 'success', targetModule?: string, actionId?: string) => void;

  // Map Navigation
  mapFlyTo: { lat: number; lng: number; zoom?: number } | null;
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // AI Assistant Drawer
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;

  // -------------------------------------------------------------
  // URBAN INTELLIGENCE & INTERVENTION ENGINE
  // -------------------------------------------------------------
  causalScenarios: Record<string, UrbanCausalScenario>;
  activeCausalScenario: UrbanCausalScenario | null;
  setActiveCausalScenario: (scenario: UrbanCausalScenario | null) => void;
  selectedCausalNode: CausalNode | null;
  setSelectedCausalNode: (node: CausalNode | null) => void;
  causalModalOpen: boolean;
  setCausalModalOpen: (open: boolean) => void;

  interventionPlans: Record<string, ProblemInterventionPlan>;
  applyIntervention: (problemId: string, interventionId: string) => void;

  dmas: DistrictMeteredArea[];
  executeWaterRepair: (dmaId: string) => void;

  intersections: IntersectionTelemetry[];
  optimizeIntersectionSignal: (intId: string) => void;

  emergencyCorridors: EmergencyPriorityCorridor[];
  activatePriorityCorridor: (corridorId: string) => void;

  smartBins: SmartWasteBin[];
  wasteRoute: WasteTruckRoute;
  applyOptimizedWasteRoute: () => void;

  complaintClusters: CitizenComplaintCluster[];
  operationalizeCluster: (clusterId: string) => void;

  predictiveAssets: PredictiveAsset[];
  createAssetWorkOrder: (assetId: string) => void;
  repairAsset: (assetId: string) => void;

  coordinatedWorks: CoordinatedWorkWindow[];
  scheduleCoordinatedWindow: (windowId: string) => void;

  energyFlexibility: EnergyFlexibilityPlan;
  executeEnergyFlexibility: () => void;

  heatZones: HeatExposureZone[];
  implementCoolingIntervention: (zoneId: string) => void;

  cityEmissionsInventory: CityEmissionsInventory;
  createProjectFromHotspot: (hotspotName: string) => void;

  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: { actor: string; action: string; department: string; entity: string; previousState?: string; newState?: string; impactSummary?: string }) => void;
  auditDrawerOpen: boolean;
  setAuditDrawerOpen: (open: boolean) => void;
}

const AurisContext = createContext<AurisContextType | undefined>(undefined);

const hasValidIncidentImage = (incident: Incident): boolean => {
  const image = incident.image?.trim();
  return !!image && /^https?:\/\//i.test(image);
};

const mergeSeedIncidents = (cachedIncidents: Incident[]): Incident[] => {
  const validCached = cachedIncidents.filter((incident) => hasValidIncidentImage(incident));
  const cachedById = new Map(validCached.map((incident) => [incident.id, incident]));
  const seededIds = new Set(INITIAL_INCIDENTS.filter(hasValidIncidentImage).map((incident) => incident.id));
  const customIncidents = validCached.filter((incident) => !seededIds.has(incident.id));
  const mergedSeededIncidents = INITIAL_INCIDENTS.filter(hasValidIncidentImage).map(
    (incident) => cachedById.get(incident.id) ?? incident
  );

  return [...customIncidents, ...mergedSeededIncidents];
};

export const AurisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleId>(() => {
    const saved = loadState<RoleId | null>(STORAGE_KEYS.ROLE, null);
    return saved && USER_ROLES[saved] ? saved : 'CITY_ADMIN';
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authGuardOpen, setAuthGuardOpen] = useState(false);
  const [authGuardMessage, setAuthGuardMessage] = useState('This section requires an operational role. Switch to a city or department profile to continue.');
  const [activeTabState, setActiveTabState] = useState<string>(() => {
    const savedTab = loadState<string | null>(STORAGE_KEYS.ACTIVE_TAB, null);
    return savedTab || 'overview';
  });

  const setActiveTab = (tab: string) => {
    const safeTab = tab || 'overview';

    if (currentRole === 'CITIZEN' && isGovernmentTab(safeTab)) {
      setAuthGuardMessage('Citizen users cannot access Government Department pages. Your current authorized view remains active.');
      setAuthGuardOpen(true);
      return;
    }

    if (!isValidRole(currentRole) || !isTabAllowedForRole(currentRole, safeTab)) {
      setAuthGuardMessage('Your session is missing a valid role. Please sign in with an authorized account.');
      setAuthGuardOpen(true);
      setActiveTabState(getDefaultAuthorizedTab(currentRole));
      return;
    }

    setActiveTabState(safeTab);
    setAuthGuardOpen(false);
  };

  const activeTab = getAuthorizedTabForRole(currentRole, activeTabState);

  useEffect(() => {
    saveState(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    const nextAllowedTab = getAuthorizedTabForRole(currentRole, activeTabState);
    if (nextAllowedTab !== activeTabState) {
      setActiveTabState(nextAllowedTab);
    }
  }, [currentRole, activeTabState]);

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const cachedIncidents = loadState<Incident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    return mergeSeedIncidents(cachedIncidents);
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Also merge on mount so a dev-session hot update receives newly seeded markers.
  useEffect(() => {
    setIncidents((current) => {
      const merged = mergeSeedIncidents(current);
      const isUnchanged = merged.length === current.length && merged.every((incident, index) => incident === current[index]);
      return isUnchanged ? current : merged;
    });
  }, []);

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    return loadState<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [carbonProjects, setCarbonProjects] = useState<CarbonProject[]>(() => {
    return loadState<CarbonProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_CARBON_PROJECTS);
  });
  const [selectedProject, setSelectedProject] = useState<CarbonProject | null>(null);
  const [buyModalProject, setBuyModalProject] = useState<CarbonProject | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState<boolean>(false);

  const [carbonTransactions, setCarbonTransactions] = useState<CarbonTransaction[]>(() => {
    return loadState<CarbonTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  });

  const [carbonPortfolio, setCarbonPortfolio] = useState<CarbonPortfolio>(() => {
    return loadState<CarbonPortfolio>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO);
  });

  const [cityHealthMetrics, setCityHealthMetrics] = useState<CityHealthMetric[]>(CITY_HEALTH_METRICS);
  const [selectedHealthCategory, setSelectedHealthCategory] = useState<string | null>(null);

  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    rainfall: 40,
    temperature: 2,
    traffic: 30,
    population: 10,
    energyDemand: 25,
    pollution: 20
  });

  const [agents] = useState<AgentInfo[]>(AI_AGENTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return loadState<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  });

  const [mapFlyTo, setMapFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  // -------------------------------------------------------------
  // ADVANCED URBAN INTELLIGENCE STATE
  // -------------------------------------------------------------
  const [causalScenarios] = useState<Record<string, UrbanCausalScenario>>(INITIAL_CAUSAL_SCENARIOS);
  const [activeCausalScenario, setActiveCausalScenario] = useState<UrbanCausalScenario | null>(INITIAL_CAUSAL_SCENARIOS['storm-cascade']);
  const [selectedCausalNode, setSelectedCausalNode] = useState<CausalNode | null>(null);
  const [causalModalOpen, setCausalModalOpen] = useState<boolean>(false);

  const [interventionPlans, setInterventionPlans] = useState<Record<string, ProblemInterventionPlan>>(INITIAL_INTERVENTION_PLANS);

  const [dmas, setDmas] = useState<DistrictMeteredArea[]>(() => {
    return loadState<DistrictMeteredArea[]>(STORAGE_KEYS.DMAS, INITIAL_DMAS);
  });

  const [intersections, setIntersections] = useState<IntersectionTelemetry[]>(INITIAL_INTERSECTIONS);
  const [emergencyCorridors, setEmergencyCorridors] = useState<EmergencyPriorityCorridor[]>(INITIAL_EMERGENCY_CORRIDORS);
  const [smartBins, setSmartBins] = useState<SmartWasteBin[]>(INITIAL_SMART_BINS);
  const [wasteRoute, setWasteRoute] = useState<WasteTruckRoute>(INITIAL_WASTE_ROUTE);
  const [complaintClusters, setComplaintClusters] = useState<CitizenComplaintCluster[]>(INITIAL_COMPLAINT_CLUSTERS);
  const [predictiveAssets, setPredictiveAssets] = useState<PredictiveAsset[]>(INITIAL_PREDICTIVE_ASSETS);
  const [coordinatedWorks, setCoordinatedWorks] = useState<CoordinatedWorkWindow[]>(INITIAL_COORDINATED_WORKS);
  const [energyFlexibility, setEnergyFlexibility] = useState<EnergyFlexibilityPlan>(INITIAL_ENERGY_FLEXIBILITY);
  const [heatZones, setHeatZones] = useState<HeatExposureZone[]>(INITIAL_HEAT_ZONES);
  const [cityEmissionsInventory, setCityEmissionsInventory] = useState<CityEmissionsInventory>(INITIAL_CITY_EMISSIONS_INVENTORY);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    return loadState<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  });
  const [auditDrawerOpen, setAuditDrawerOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    saveState(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    saveState(STORAGE_KEYS.INCIDENTS, incidents);
  }, [incidents]);

  useEffect(() => {
    saveState(STORAGE_KEYS.COMPLAINTS, complaints);
  }, [complaints]);

  useEffect(() => {
    saveState(STORAGE_KEYS.PROJECTS, carbonProjects);
  }, [carbonProjects]);

  useEffect(() => {
    saveState(STORAGE_KEYS.TRANSACTIONS, carbonTransactions);
  }, [carbonTransactions]);

  useEffect(() => {
    saveState(STORAGE_KEYS.PORTFOLIO, carbonPortfolio);
  }, [carbonPortfolio]);

  useEffect(() => {
    saveState(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    saveState(STORAGE_KEYS.DMAS, dmas);
  }, [dmas]);

  useEffect(() => {
    saveState(STORAGE_KEYS.AUDIT, auditLogs);
  }, [auditLogs]);

  const [currentCountry, setCurrentCountry] = useState<string>(() => {
    return loadState<string>(STORAGE_KEYS.COUNTRY, 'India');
  });

  const [currentCity, setCurrentCity] = useState<string>(() => {
    return loadState<string>(STORAGE_KEYS.CITY, 'Mumbai');
  });

  const [simulateModalOpen, setSimulateModalOpen] = useState<boolean>(false);
  const [simulatedPipelineResult, setSimulatedPipelineResult] = useState<FullIncidentExecutionResult | null>(() => {
    const base = createWaterContaminationIncident('Mumbai', 'India');
    return executeFullIncidentPipeline(base);
  });

  const setCountry = (country: string) => {
    setCurrentCountry(country);
    saveState(STORAGE_KEYS.COUNTRY, country);
  };

  const setCity = (city: string) => {
    setCurrentCity(city);
    saveState(STORAGE_KEYS.CITY, city);
  };

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return loadState<string | null>(STORAGE_KEYS.AUTH_TOKEN, 'auris-google-jwt-session');
  });

  const [customProfile, setCustomProfile] = useState<UserRoleProfile | null>(() => {
    return loadState<UserRoleProfile | null>(STORAGE_KEYS.AUTH_USER, null);
  });

  const isAuthenticated = Boolean(authToken);

  useEffect(() => {
    saveState(STORAGE_KEYS.AUTH_TOKEN, authToken);
  }, [authToken]);

  useEffect(() => {
    saveState(STORAGE_KEYS.AUTH_USER, customProfile);
  }, [customProfile]);

  useEffect(() => {
    saveState(STORAGE_KEYS.COUNTRY, currentCountry);
  }, [currentCountry]);

  useEffect(() => {
    saveState(STORAGE_KEYS.CITY, currentCity);
  }, [currentCity]);

  const userProfile: UserRoleProfile = customProfile && customProfile.id === currentRole
    ? { ...customProfile, country: currentCountry, city: currentCity }
    : { ...(USER_ROLES[currentRole] || USER_ROLES.CITY_ADMIN), country: currentCountry, city: currentCity };

  const setRole = (roleId: RoleId) => {
    const nextTab = roleId === 'CITIZEN'
      ? 'citizen'
      : roleId === 'CARBON_COMPANY' || roleId === 'GOVT_CARBON_MONITOR'
        ? 'carbon'
        : roleId.endsWith('_DEPT')
          ? 'departments'
          : 'overview';

    setCurrentRole(roleId);
    setCustomProfile(null);
    setActiveTabState(getAuthorizedTabForRole(roleId, nextTab));
    setAuthGuardOpen(false);
  };

  const addSimulatedIncident = (result: FullIncidentExecutionResult) => {
    setSimulatedPipelineResult(result);
    setIncidents((prev) => {
      const exists = prev.some((inc) => inc.id === result.baseIncident.id);
      if (exists) {
        return prev.map((inc) => (inc.id === result.baseIncident.id ? result.baseIncident : inc));
      }
      return [result.baseIncident, ...prev];
    });
    setSelectedIncident(result.baseIncident);

    // Add immediate audit log entry
    addAuditLog({
      actor: userProfile.name,
      action: 'Water Contamination Incident Executed',
      department: 'Multi-Agency Incident Command',
      entity: `${result.incident.type} (#${result.incident.id})`,
      impactSummary: `Multi-agent pipeline ran with ${result.riskEvaluation.riskLevel} risk (${result.riskEvaluation.riskScore}/100). 6 coordinated actions dispatched.`
    });

    // Add alert notification
    addNotification(
      'CRITICAL: Water Contamination Alert',
      `SCADA anomaly & 38 citizen reports confirmed at Ward 7, ${result.incident.city}. Emergency corridor active.`,
      'critical',
      'urban-command',
      result.baseIncident.id
    );
  };

  const loginWithGoogle = async (
    roleId: RoleId,
    country: string = 'India',
    city: string = 'Mumbai',
    customUser?: Partial<UserRoleProfile>
  ): Promise<boolean> => {
    const baseProfile = USER_ROLES[roleId] || USER_ROLES.CITY_ADMIN;
    const resolvedProfile: UserRoleProfile = {
      ...baseProfile,
      ...(customUser || {}),
      country,
      city,
      authProvider: 'google'
    };

    const simulatedToken = `auris-google-jwt-${roleId.toLowerCase()}-${Date.now().toString(36)}`;
    
    // Attempt backend sync if available
    try {
      fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleId,
          email: resolvedProfile.email,
          name: resolvedProfile.name,
          avatar: resolvedProfile.avatar,
          country,
          city
        })
      }).catch(() => {
        // Backend fallback to client local state
      });
    } catch {
      // Ignore network errors
    }

    setAuthToken(simulatedToken);
    setCurrentRole(roleId);
    setCurrentCountry(country);
    setCurrentCity(city);
    setCustomProfile(resolvedProfile);

    const nextTab = roleId === 'CITIZEN'
      ? 'citizen'
      : roleId === 'CARBON_COMPANY' || roleId === 'GOVT_CARBON_MONITOR'
        ? 'carbon'
        : roleId.endsWith('_DEPT')
          ? 'departments'
          : 'overview';

    setActiveTabState(getAuthorizedTabForRole(roleId, nextTab));
    setAuthGuardOpen(false);

    // Audit log entry
    addAuditLog({
      actor: resolvedProfile.name,
      action: `Google OAuth 2.0 Login (${resolvedProfile.roleBadge})`,
      department: resolvedProfile.departmentName || 'AURIS Global Authentication',
      entity: `Google SSO: ${resolvedProfile.email} (${city}, ${country})`,
      impactSummary: `Authenticated with ${resolvedProfile.clearanceLevel || 'Tier-2 Operations'} permissions.`
    });

    return true;
  };

  const logout = () => {
    setAuthToken(null);
    setCustomProfile(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    addAuditLog({
      actor: userProfile.name,
      action: 'User Signed Out',
      department: userProfile.departmentName || 'Security Operations',
      entity: `Session Terminated: ${userProfile.email}`,
      impactSummary: 'Session invalidated and access cleared.'
    });
  };


  const addAuditLog = (entry: {
    actor: string;
    action: string;
    department: string;
    entity: string;
    previousState?: string;
    newState?: string;
    impactSummary?: string;
  }) => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      ...entry
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus, team?: string) => {
    const incBefore = incidents.find(i => i.id === id);
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          const updated: Incident = {
            ...inc,
            status,
            assignedTeam: team || inc.assignedTeam,
            resolvedAt: status === 'Resolved' ? 'Just now' : inc.resolvedAt
          };
          if (selectedIncident?.id === id) {
            setSelectedIncident(updated);
          }
          return updated;
        }
        return inc;
      })
    );

    addAuditLog({
      actor: userProfile.name,
      action: `Incident Status Change to ${status}`,
      department: incBefore?.department || 'Municipal Operations',
      entity: `Incident #${id}`,
      previousState: incBefore?.status,
      newState: status,
      impactSummary: `Field team dispatch: ${team || incBefore?.assignedTeam || 'Standard Unit'}`
    });

    if (status === 'Resolved') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      // Improve City Health outcome!
      setCityHealthMetrics(prev =>
        prev.map(m => (m.category === 'Water' || m.category === 'Infrastructure' ? { ...m, score: Math.min(100, m.score + 3), delta: +3, trend: 'up' } : m))
      );
    }

    addNotification(
      `Incident ${id} Updated`,
      `Status changed to "${status}"${team ? ` and assigned to ${team}` : ''}.`,
      status === 'Resolved' ? 'success' : 'info',
      'urban-command',
      id
    );
  };

  // -------------------------------------------------------------
  // INTERVENTION PLANNER EXECUTION
  // -------------------------------------------------------------
  const applyIntervention = (problemId: string, interventionId: string) => {
    const plan = interventionPlans[problemId];
    if (!plan) return;

    const opt = plan.interventions.find(i => i.id === interventionId);
    if (!opt) return;

    const postScore = Math.max(10, Math.round(plan.currentRiskScore * (1 - opt.riskReductionPct / 100)));

    setInterventionPlans(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        appliedInterventionId: interventionId,
        postInterventionRiskScore: postScore,
        interventions: prev[problemId].interventions.map(i =>
          i.id === interventionId ? { ...i, status: 'completed' } : i
        )
      }
    }));

    // Update corresponding incident
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === problemId
          ? {
              ...inc,
              severity: postScore < 40 ? 'Normal' : 'Warning',
              status: 'In Progress',
              recommendedAction: `Applied: ${opt.title}. Risk decreased by ${opt.riskReductionPct}%.`
            }
          : inc
      )
    );

    // Update City Health Outcomes!
    setCityHealthMetrics(prev =>
      prev.map(m => {
        if (m.category === 'Water' || m.category === 'Mobility' || m.category === 'Sustainability') {
          return {
            ...m,
            score: Math.min(100, m.score + 4),
            trend: 'up',
            delta: +4,
            changeReason: `Intervention "${opt.title}" mitigated cascade risk across ${opt.populationProtected.toLocaleString()} residents.`
          };
        }
        return m;
      })
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Executed AI Intervention Package',
      department: opt.department,
      entity: `Problem #${problemId}`,
      previousState: `Risk Score ${plan.currentRiskScore}`,
      newState: `Risk Score ${postScore} (-${opt.riskReductionPct}%)`,
      impactSummary: `${opt.title} implemented. Protected: ${opt.populationProtected.toLocaleString()} citizens.`
    });

    addNotification(
      `Intervention Applied: ${opt.title}`,
      `Risk reduced by ${opt.riskReductionPct}%. ${opt.populationProtected.toLocaleString()} citizens protected.`,
      'success',
      'urban-command',
      problemId
    );

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // WATER LOSS RECOVERY REPAIR
  // -------------------------------------------------------------
  const executeWaterRepair = (dmaId: string) => {
    setDmas(prev =>
      prev.map(dma => {
        if (dma.id === dmaId) {
          const comp = dma.beforeAfterComparison;
          return {
            ...dma,
            unexplainedLossMLPerDay: comp ? comp.lossAfter : 0.4,
            pressureBar: 3.8,
            leakProbabilityPct: 12,
            status: 'Normal',
            investigationCaseId: `${dma.investigationCaseId || 'CASE'} (Verified Fixed)`
          };
        }
        return dma;
      })
    );

    // City health water sector improves!
    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Water'
          ? {
              ...m,
              score: 84,
              trend: 'up',
              delta: +19,
              previousScore: 65,
              changeReason: 'DMA-7 mains repair completed. Non-revenue water loss dropped from 1.8 ML/day to 0.4 ML/day.'
            }
          : m
      )
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Completed Acoustic Leak Excavation & Pipe Sleeve Fix',
      department: 'Water & Drainage Department',
      entity: `DMA #${dmaId}`,
      previousState: '1.8 ML/day loss (Critical)',
      newState: '0.4 ML/day loss (Normal)',
      impactSummary: 'Recovered 1.4 ML potable water per day. Restored 3.8 bar pressure to 2,400 residents.'
    });

    addNotification(
      `Water Loss Recovered: ${dmaId}`,
      'Pipeline sleeve repair verified. Saved 1.4 million liters/day of treated water!',
      'success',
      'departments'
    );

    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  };

  // -------------------------------------------------------------
  // MOBILITY: ADAPTIVE INTERSECTION OPTIMIZATION
  // -------------------------------------------------------------
  const optimizeIntersectionSignal = (intId: string) => {
    setIntersections(prev =>
      prev.map(item =>
        item.id === intId
          ? {
              ...item,
              currentGreenTimeSeconds: item.optimizedGreenTimeSeconds,
              queueLengthMeters: Math.round(item.queueLengthMeters * 0.6),
              avgSpeedKmph: Math.round(item.avgSpeedKmph * 2.1),
              status: 'AI Adaptive Wave Active'
            }
          : item
      )
    );

    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Mobility'
          ? { ...m, score: Math.min(100, m.score + 3), delta: +3, trend: 'up' }
          : m
      )
    );

    addAuditLog({
      actor: 'AURIS Mobility Agent',
      action: 'Activated Adaptive Coordinated Green Wave',
      department: 'Traffic & Mobility Department',
      entity: `Intersection #${intId}`,
      previousState: 'Fixed 45s Cycle (Queue 380m)',
      newState: 'Adaptive 75s Wave (Queue 228m)',
      impactSummary: 'Corridor delay decreased by 28%. Transit emissions reduced by 14%.'
    });

    addNotification(
      'Signal Priority Wave Engaged',
      'Coordinated green wave activated across corridor with 28% queue clearance.',
      'success',
      'departments'
    );
  };

  // -------------------------------------------------------------
  // MOBILITY: EMERGENCY GREEN CORRIDOR
  // -------------------------------------------------------------
  const activatePriorityCorridor = (corridorId: string) => {
    setEmergencyCorridors(prev =>
      prev.map(c =>
        c.id === corridorId
          ? { ...c, status: 'Active Green Wave', currentEtaMinutes: c.priorityEtaMinutes }
          : c
      )
    );

    addAuditLog({
      actor: 'AURIS Emergency Orchestrator',
      action: 'Emergency Green Corridor Signal Preemption Triggered',
      department: 'Emergency & Traffic Services',
      entity: `Corridor #${corridorId}`,
      previousState: 'ETA 18 mins (Congested)',
      newState: 'ETA 9 mins (Preempted)',
      impactSummary: '6 automated signal overrides engaged for trauma transport.'
    });

    addNotification(
      'Emergency Priority Corridor Active',
      'Ambulance route preempted with signal green wave. ETA reduced from 18m to 9m.',
      'critical',
      'departments'
    );

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // WASTE: ROUTE OPTIMIZATION
  // -------------------------------------------------------------
  const applyOptimizedWasteRoute = () => {
    setWasteRoute(prev => ({
      ...prev,
      status: 'AI Optimized Applied'
    }));

    setSmartBins(prev =>
      prev.map(b => (b.priority === 'Overflow Imminent' ? { ...b, priority: 'Low', currentFillPct: 15 } : b))
    );

    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Waste'
          ? { ...m, score: Math.min(100, m.score + 5), delta: +5, trend: 'up' }
          : m
      )
    );

    addAuditLog({
      actor: 'AURIS Waste Agent',
      action: 'Dynamic Route Dispatch & Bin Clearance',
      department: 'Waste Management Department',
      entity: 'Truck #9 Route',
      previousState: '28.4 km / 95 mins',
      newState: '18.2 km / 58 mins (-36% distance)',
      impactSummary: 'Avoided 24.6 kg diesel CO₂ emissions and cleared 14 overflow bins.'
    });

    addNotification(
      'AI Waste Route Dispatched',
      'Optimized compactor route applied. Saved 10.2km transit distance and 24.6kg CO₂.',
      'success',
      'departments'
    );

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // CITIZEN CLUSTER OPERATIONALIZATION
  // -------------------------------------------------------------
  const operationalizeCluster = (clusterId: string) => {
    setComplaintClusters(prev =>
      prev.map(c => (c.id === clusterId ? { ...c, status: 'Operationalized' } : c))
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Operationalized Citizen Cluster to Work Order',
      department: 'Municipal Public Works',
      entity: `Cluster #${clusterId}`,
      previousState: '38 Isolated Complaints',
      newState: 'Unified Work Order #WD-491',
      impactSummary: 'Consolidated 38 redundant tickets into single operational dispatch.'
    });

    addNotification(
      'Citizen Cluster Operationalized',
      '38 citizen signals transformed into single verified municipal work order!',
      'success',
      'citizen'
    );

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // INFRASTRUCTURE: PREDICTIVE ASSET MAINTENANCE
  // -------------------------------------------------------------
  const createAssetWorkOrder = (assetId: string) => {
    setPredictiveAssets(prev =>
      prev.map(a =>
        a.id === assetId ? { ...a, workOrderStatus: 'Work Order Created' } : a
      )
    );

    addAuditLog({
      actor: 'AURIS Infrastructure Agent',
      action: 'Generated Predictive Preventive Work Order',
      department: 'Public Works & Infrastructure',
      entity: `Asset #${assetId}`,
      previousState: 'Failure Probability 84%',
      newState: 'Preventive Dispatch Queued',
      impactSummary: 'Scheduled maintenance prior to catastrophic failure.'
    });

    addNotification(
      `Work Order Created for ${assetId}`,
      'Preventive repair order scheduled with priority parts allocation.',
      'info',
      'departments'
    );
  };

  const repairAsset = (assetId: string) => {
    setPredictiveAssets(prev =>
      prev.map(a =>
        a.id === assetId
          ? { ...a, failureProbabilityNext30Days: 4, conditionScore: 96, workOrderStatus: 'Repaired & Verified' }
          : a
      )
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Verified Asset Repair & Recalibration',
      department: 'Public Works & Infrastructure',
      entity: `Asset #${assetId}`,
      previousState: 'Failure Risk 84%',
      newState: 'Failure Risk 4% (Verified)',
      impactSummary: 'Extended asset operating lifespan by estimated 4.5 years.'
    });

    addNotification(
      `Asset ${assetId} Repaired`,
      'Asset condition restored to 96/100. Failure risk dropped to 4%.',
      'success',
      'departments'
    );

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
  };

  // -------------------------------------------------------------
  // URBAN WORKS COORDINATOR
  // -------------------------------------------------------------
  const scheduleCoordinatedWindow = (windowId: string) => {
    setCoordinatedWorks(prev =>
      prev.map(w =>
        w.id === windowId ? { ...w, status: 'Window Coordinated & Scheduled' } : w
      )
    );

    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Infrastructure' || m.category === 'Mobility'
          ? { ...m, score: Math.min(100, m.score + 4), delta: +4, trend: 'up' }
          : m
      )
    );

    addAuditLog({
      actor: 'AURIS Urban Works Coordinator',
      action: 'Harmonized 3 Conflicting Excavation Permits into 1 Window',
      department: 'Office of City Administrator',
      entity: `Work Window #${windowId}`,
      previousState: '24 Disruption Days (3 Excavations)',
      newState: '9 Disruption Days (1 Shared Window)',
      impactSummary: 'Saved $38,500 in municipal restoration fees and prevented 15 days of arterial lane closures.'
    });

    addNotification(
      'Excavation Conflicts Resolved',
      'Harmonized Water, Energy & Road works into single 9-day shared window. Saved $38,500!',
      'success',
      'overview'
    );

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // ENERGY FLEXIBILITY DISPATCH
  // -------------------------------------------------------------
  const executeEnergyFlexibility = () => {
    setEnergyFlexibility(prev => ({
      ...prev,
      isExecuted: true,
      actions: prev.actions.map(a => ({ ...a, status: 'Dispatched' }))
    }));

    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Energy'
          ? { ...m, score: 88, delta: +8, trend: 'up', changeReason: 'Flexibility dispatch shaved 700 MW peak load.' }
          : m
      )
    );

    addAuditLog({
      actor: 'AURIS Energy Agent',
      action: 'Dispatched Energy Flexibility Demand-Response Plan',
      department: 'Energy & Smart Grid Department',
      entity: 'Substation Grid Feeders',
      previousState: '9.4 GW Peak Demand (High Strain)',
      newState: '8.7 GW Optimized (Safe Buffer)',
      impactSummary: 'Avoided $142,000 in spot power generation costs and 84.5 tons of carbon emissions.'
    });

    addNotification(
      'Peak Grid Flexibility Engaged',
      'Discharged battery buffers & deferred EV charging. Shaved 700 MW peak load safely.',
      'success',
      'departments'
    );

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // ENVIRONMENT: HEAT COOLING INTERVENTION
  // -------------------------------------------------------------
  const implementCoolingIntervention = (zoneId: string) => {
    setHeatZones(prev =>
      prev.map(z =>
        z.id === zoneId
          ? { ...z, implementedCooling: true, surfaceTempC: 36.4, exposureRisk: 'Moderate' }
          : z
      )
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Deployed Urban Shade Misting & Cooling Centers',
      department: 'Environment & Public Health',
      entity: `Heat Zone #${zoneId}`,
      previousState: '41.2°C (Critical Exposure)',
      newState: '36.4°C (Moderate Exposure)',
      impactSummary: 'Protected 42,000 transit commuters from dangerous thermal exposure.'
    });

    addNotification(
      'Urban Cooling Deployed',
      'Misting transit shelters and public cooling hubs active. Temperature reduced by 4.8°C.',
      'success',
      'departments'
    );

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // -------------------------------------------------------------
  // CARBON: CREATE PROJECT FROM HOTSPOT
  // -------------------------------------------------------------
  const createProjectFromHotspot = (hotspotName: string) => {
    const newId = `CARB-${900 + carbonProjects.length}`;
    const newPrj: CarbonProject = {
      id: newId,
      name: `${hotspotName} Decarbonization Initiative`,
      country: 'India',
      cityRegion: 'Mumbai Industrial Zone',
      developer: 'AURIS Municipal Decarbonization Trust',
      type: 'Energy Efficiency',
      co2ReductionTons: 42000,
      creditsAvailable: 35000,
      pricePerCredit: 19.50,
      verificationStatus: 'Monitoring',
      projectStatus: 'Active',
      description: 'Industrial thermal heat recovery and solar microgrid installation at manufacturing cluster.',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      latitude: 19.0800,
      longitude: 72.8900,
      vintage: '2026',
      standardsBody: 'Gold Standard GS4GG',
      integrityScore: 94,
      mrvEvents: [
        {
          date: 'Just now',
          stage: 'Monitoring Initialized',
          verifier: 'TÜV Rheinland AI Telemetry',
          note: 'Continuous smart-meter baseline monitoring active.'
        }
      ],
      impactMetrics: {
        cleanPowerMWh: '65,000 MWh/yr',
        familiesImpacted: '18,000 Homes'
      }
    };

    setCarbonProjects(prev => [newPrj, ...prev]);

    addAuditLog({
      actor: userProfile.name,
      action: 'Originated Carbon Project from Municipal Emission Hotspot',
      department: 'National Climate Registry',
      entity: `Project #${newId}`,
      newState: 'Monitoring & Verification Pipeline',
      impactSummary: 'Projected 42,000 tons annual CO₂ abatement.'
    });

    addNotification(
      'New Carbon Project Originated',
      `Originated project for "${hotspotName}" into MRV verification pipeline.`,
      'success',
      'carbon',
      newId
    );

    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  const submitComplaint = (data: {
    issue: string;
    category: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
    image?: string;
  }): Complaint => {
    const nextNum = 1045 + complaints.length;
    const ticketId = `AUR-${nextNum}`;
    
    let dept = 'Infrastructure Department';
    const lower = (data.issue + ' ' + data.description + ' ' + data.category).toLowerCase();
    const affected: string[] = [];

    if (lower.includes('water') || lower.includes('drain') || lower.includes('flood') || lower.includes('leak') || lower.includes('pipe')) {
      dept = 'Water & Drainage Department';
      affected.push('Water & Drainage', 'Public Safety');
    } else if (lower.includes('traffic') || lower.includes('signal') || lower.includes('bus') || lower.includes('car') || lower.includes('jam')) {
      dept = 'Traffic & Mobility Department';
      affected.push('Traffic & Mobility', 'Safety');
    } else if (lower.includes('waste') || lower.includes('garbage') || lower.includes('trash') || lower.includes('bin') || lower.includes('dump')) {
      dept = 'Waste Management Department';
      affected.push('Waste', 'Public Health');
    } else if (lower.includes('light') || lower.includes('pothole') || lower.includes('road') || lower.includes('bridge') || lower.includes('crack')) {
      dept = 'Infrastructure Department';
      affected.push('Infrastructure', 'Mobility');
    } else if (lower.includes('air') || lower.includes('smoke') || lower.includes('pollution') || lower.includes('smell') || lower.includes('noise')) {
      dept = 'Environment & Climate Resilience';
      affected.push('Environment', 'Public Health');
    } else if (lower.includes('power') || lower.includes('electricity') || lower.includes('wire') || lower.includes('outage') || lower.includes('spark')) {
      dept = 'Energy Department';
      affected.push('Energy', 'Safety');
    } else {
      affected.push('Citizen Services');
    }

    const newComplaint: Complaint = {
      id: ticketId,
      issue: data.issue,
      category: data.category,
      description: data.description,
      location: data.location || 'Reported Location',
      latitude: data.latitude,
      longitude: data.longitude,
      department: dept,
      severity: data.severity || 'High',
      status: 'AI Verified',
      createdAt: 'Just now',
      expectedResolution: 'Within 24 hours',
      aiConfidence: 95,
      affectedSystems: affected,
      citizenName: userProfile.name,
      citizenEmail: userProfile.email,
      image: data.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      updates: [
        {
          timestamp: 'Just now',
          title: 'Complaint Submitted',
          note: 'Report submitted via AURIS Citizen Intelligence Portal.',
          status: 'Submitted',
          actor: 'Citizen'
        },
        {
          timestamp: 'Just now',
          title: 'AI Classified & Verified',
          note: `AURIS Multi-Agent Core parsed report. Routed to ${dept} with 95% AI confidence.`,
          status: 'AI Verified',
          actor: 'Citizen Agent'
        }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Also add to global incidents
    const newIncident: Incident = {
      id: `INC-${9000 + complaints.length}`,
      title: data.issue,
      category: 'Citizen Report',
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      country: 'Reported Area',
      city: data.location.split(',')[1]?.trim() || 'Metro',
      ward: data.location.split(',')[0]?.trim() || 'Urban Zone',
      severity: data.severity === 'Critical' ? 'Critical' : 'Warning',
      status: 'AI Verified',
      department: dept,
      source: 'Citizen',
      reportedAt: 'Just now',
      affectedPopulation: 1500,
      aiConfidence: 95,
      recommendedAction: `Inspect reported civic issue at ${data.location} and assign municipal field unit.`,
      aiAnalysis: `Citizen report validated against regional GIS layer; categorized under ${dept}.`,
      relatedReportsCount: 1,
      image: newComplaint.image
    };

    setIncidents(prev => [newIncident, ...prev]);

    addAuditLog({
      actor: userProfile.name,
      action: 'Submitted New Citizen Signal',
      department: dept,
      entity: `Ticket #${ticketId}`,
      newState: 'AI Verified',
      impactSummary: `Categorized under ${dept} with 95% confidence.`
    });

    addNotification(
      `New Ticket Created: ${ticketId}`,
      `Your complaint "${data.issue}" was verified by AI and assigned to ${dept}.`,
      'success',
      'citizen',
      ticketId
    );

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, note?: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newUpdate = {
            timestamp: 'Just now',
            title: `Status: ${status}`,
            note: note || `Ticket advanced to ${status} stage.`,
            status,
            actor: userProfile.roleBadge
          };
          const updated: Complaint = {
            ...c,
            status,
            updates: [...c.updates, newUpdate]
          };
          if (selectedComplaint?.id === id) {
            setSelectedComplaint(updated);
          }
          return updated;
        }
        return c;
      })
    );

    addAuditLog({
      actor: userProfile.name,
      action: `Advanced Complaint to ${status}`,
      department: userProfile.departmentName || 'Municipal Dept',
      entity: `Ticket #${id}`,
      newState: status,
      impactSummary: note || 'Citizen notified in app.'
    });

    addNotification(
      `Complaint ${id} Updated`,
      `Ticket status changed to ${status}.`,
      status === 'Resolved' ? 'success' : 'info',
      'citizen',
      id
    );

    if (status === 'Resolved') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    }
  };

  const buyCarbonCredits = (projectId: string, quantity: number): boolean => {
    const project = carbonProjects.find(p => p.id === projectId);
    if (!project || project.creditsAvailable < quantity) return false;

    const totalValue = quantity * project.pricePerCredit;
    const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: CarbonTransaction = {
      id: txnId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      projectId: project.id,
      projectName: project.name,
      projectType: project.type,
      quantity,
      pricePerCredit: project.pricePerCredit,
      totalValue,
      type: 'Purchase',
      status: 'Completed',
      certificateId: `CERT-${project.standardsBody.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      buyer: userProfile.name,
      seller: project.developer
    };

    setCarbonProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, creditsAvailable: p.creditsAvailable - quantity } : p
      )
    );

    setCarbonTransactions(prev => [newTxn, ...prev]);

    setCarbonPortfolio(prev => ({
      ...prev,
      creditsOwned: prev.creditsOwned + quantity,
      totalSpent: prev.totalSpent + totalValue,
      co2ImpactTons: prev.co2ImpactTons + quantity
    }));

    addAuditLog({
      actor: userProfile.name,
      action: 'Executed Carbon Credit Purchase',
      department: 'Global Carbon Registry',
      entity: `Txn #${txnId}`,
      newState: 'Settled',
      impactSummary: `Acquired ${quantity.toLocaleString()} tons from ${project.name} ($${totalValue.toLocaleString()}).`
    });

    addNotification(
      `Carbon Purchase Confirmed: ${txnId}`,
      `Purchased ${quantity.toLocaleString()} tons of verified credits from ${project.name} for $${totalValue.toLocaleString()}.`,
      'success',
      'carbon',
      txnId
    );

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    return true;
  };

  const retireCarbonCredits = (projectId: string, quantity: number, purpose = 'Municipal Net-Zero Quota', beneficiary = 'City of Mumbai'): boolean => {
    if (carbonPortfolio.creditsOwned < quantity) return false;

    const project = carbonProjects.find(p => p.id === projectId) || carbonProjects[0];
    const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: CarbonTransaction = {
      id: txnId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      projectId: project.id,
      projectName: project.name,
      projectType: project.type,
      quantity,
      pricePerCredit: project.pricePerCredit,
      totalValue: quantity * project.pricePerCredit,
      type: 'Retirement',
      status: 'Completed',
      certificateId: `RETIRE-PERM-${Math.floor(100000 + Math.random() * 900000)}`,
      buyer: userProfile.name,
      seller: 'AURIS Carbon Registry Vault',
      beneficiary,
      retirementPurpose: purpose
    };

    setCarbonTransactions(prev => [newTxn, ...prev]);

    setCarbonPortfolio(prev => ({
      ...prev,
      creditsOwned: prev.creditsOwned - quantity,
      creditsRetired: prev.creditsRetired + quantity
    }));

    // Improve Sustainability score in City Health!
    setCityHealthMetrics(prev =>
      prev.map(m =>
        m.category === 'Sustainability'
          ? { ...m, score: Math.min(100, m.score + 5), delta: +5, trend: 'up' }
          : m
      )
    );

    addAuditLog({
      actor: userProfile.name,
      action: 'Permanently Retired Carbon Credits',
      department: 'Municipal Climate Action',
      entity: `Certificate #${newTxn.certificateId}`,
      previousState: `${quantity.toLocaleString()} t in Vault`,
      newState: 'Permanently Abated',
      impactSummary: `Retired for beneficiary: ${beneficiary}. Purpose: ${purpose}.`
    });

    addNotification(
      `Carbon Credits Retired: ${txnId}`,
      `Successfully retired ${quantity.toLocaleString()} tons of CO₂ permanently for ${beneficiary}.`,
      'success',
      'carbon',
      txnId
    );

    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    return true;
  };

  const listCarbonProject = (projectData: Omit<CarbonProject, 'id'>) => {
    const newId = `CARB-${811 + carbonProjects.length}`;
    const newProject: CarbonProject = {
      ...projectData,
      id: newId
    };

    setCarbonProjects(prev => [newProject, ...prev]);

    setCarbonPortfolio(prev => ({
      ...prev,
      creditsListed: prev.creditsListed + newProject.creditsAvailable
    }));

    addAuditLog({
      actor: userProfile.name,
      action: 'Listed New Project on Global Exchange',
      department: 'Carbon Developer Portal',
      entity: `Project #${newId}`,
      newState: 'Listed for Trading',
      impactSummary: `Listed ${newProject.creditsAvailable.toLocaleString()} credits at $${newProject.pricePerCredit}/t.`
    });

    addNotification(
      `New Project Listed: ${newProject.name}`,
      `Listed ${newProject.creditsAvailable.toLocaleString()} tons at $${newProject.pricePerCredit}/ton on Global Carbon Exchange.`,
      'success',
      'carbon',
      newId
    );

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const resetSimulation = () => {
    setSimulationParams({
      rainfall: 40,
      temperature: 2,
      traffic: 30,
      population: 10,
      energyDemand: 25,
      pollution: 20
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (
    title: string,
    message: string,
    type: 'critical' | 'warning' | 'info' | 'success',
    targetModule?: string,
    actionId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      targetModule,
      actionId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const flyToLocation = (lat: number, lng: number, zoom?: number) => {
    setMapFlyTo({ lat, lng, zoom: zoom || 14 });
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const overallCityHealth = Math.round(
    cityHealthMetrics.reduce((acc, curr) => acc + curr.score, 0) / cityHealthMetrics.length
  );

  return (
    <AurisContext.Provider
      value={{
        currentRole,
        userProfile,
        setRole,
        currentCountry,
        setCountry,
        currentCity,
        setCity,
        isAuthenticated,
        authToken,
        loginWithGoogle,
        logout,
        loginModalOpen,
        setLoginModalOpen,
        simulateModalOpen,
        setSimulateModalOpen,
        simulatedPipelineResult,
        addSimulatedIncident,
        activeTab,
        setActiveTab,
        authGuardOpen,
        setAuthGuardOpen,
        authGuardMessage,
        setAuthGuardMessage,

        incidents,
        selectedIncident,
        setSelectedIncident,
        updateIncidentStatus,
        complaints,
        selectedComplaint,
        setSelectedComplaint,
        submitComplaint,
        updateComplaintStatus,
        carbonProjects,
        selectedProject,
        setSelectedProject,
        carbonTransactions,
        carbonPortfolio,
        buyCarbonCredits,
        retireCarbonCredits,
        listCarbonProject,
        buyModalProject,
        setBuyModalProject,
        sellModalOpen,
        setSellModalOpen,
        cityHealthMetrics,
        selectedHealthCategory,
        setSelectedHealthCategory,
        overallCityHealth,
        simulationParams,
        setSimulationParams,
        resetSimulation,
        agents,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        mapFlyTo,
        flyToLocation,
        searchOpen,
        setSearchOpen,
        aiDrawerOpen,
        setAiDrawerOpen,
        // Advanced Urban Intelligence
        causalScenarios,
        activeCausalScenario,
        setActiveCausalScenario,
        selectedCausalNode,
        setSelectedCausalNode,
        causalModalOpen,
        setCausalModalOpen,
        interventionPlans,
        applyIntervention,
        dmas,
        executeWaterRepair,
        intersections,
        optimizeIntersectionSignal,
        emergencyCorridors,
        activatePriorityCorridor,
        smartBins,
        wasteRoute,
        applyOptimizedWasteRoute,
        complaintClusters,
        operationalizeCluster,
        predictiveAssets,
        createAssetWorkOrder,
        repairAsset,
        coordinatedWorks,
        scheduleCoordinatedWindow,
        energyFlexibility,
        executeEnergyFlexibility,
        heatZones,
        implementCoolingIntervention,
        cityEmissionsInventory,
        createProjectFromHotspot,
        auditLogs,
        addAuditLog,
        auditDrawerOpen,
        setAuditDrawerOpen
      }}
    >
      {children}
    </AurisContext.Provider>
  );
};

export const useAuris = () => {
  const context = useContext(AurisContext);
  if (!context) {
    throw new Error('useAuris must be used within an AurisProvider');
  }
  return context;
};
