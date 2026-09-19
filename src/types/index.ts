export type RoleId =
  | 'CITY_ADMIN'
  | 'WATER_DEPT'
  | 'MOBILITY_DEPT'
  | 'ENERGY_DEPT'
  | 'WASTE_DEPT'
  | 'ENVIRONMENT_DEPT'
  | 'INFRASTRUCTURE_DEPT'
  | 'HEALTH_DEPT'
  | 'EMERGENCY_DEPT'
  | 'CARBON_COMPANY'
  | 'GOVT_CARBON_MONITOR'
  | 'CITIZEN'
  | 'ALL_ADMIN';

export interface UserRoleProfile {
  id: RoleId;
  name: string;
  departmentName?: string;
  email: string;
  avatar: string;
  roleBadge: string;
  description: string;
  clearanceLevel?: string;
  googleDomain?: string;
  country?: string;
  city?: string;
  googleSub?: string;
  authProvider?: 'google' | 'credentials';
}

export interface NearbyHospitalInfo {
  name: string;
  distanceKm: number;
  bedOccupancyRate: number;
  icuCapacityAvailable: number;
  specialities?: string[];
}

export interface EnvironmentalImpactSummary {
  airQualityIndex?: number;
  waterRisk?: string;
  emissionsReduction?: string;
  biodiversityRisk?: string;
  exposureRisk?: string;
  publicHealthImpact?: string;
}

export interface GoogleAuthSession {
  token: string;
  user: UserRoleProfile;
  country: string;
  city: string;
  authenticatedAt: string;
  authProvider: 'google';
}

export type IncidentCategory =
  | 'Water'
  | 'Mobility'
  | 'Waste'
  | 'Infrastructure'
  | 'Environment'
  | 'Energy'
  | 'Flooding'
  | 'Public Safety'
  | 'Health'
  | 'Citizen Report'
  | 'AI Predicted Risk'
  | 'Climate / Carbon';

export type IncidentSeverity = 'Critical' | 'Warning' | 'Normal' | 'Resolved' | 'AI Predicted';

export type IncidentStatus = 'New' | 'AI Verified' | 'Assigned' | 'In Progress' | 'Resolved';

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  ward?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  department: string;
  source: 'Citizen' | 'IoT Sensor' | 'AI Prediction' | 'Satellite' | 'Municipal Patrol';
  reportedAt: string;
  affectedPopulation: number;
  aiConfidence: number;
  recommendedAction: string;
  aiAnalysis?: string;
  relatedReportsCount: number;
  image?: string;
  assignedTeam?: string;
  resolvedAt?: string;
  causalChainId?: string;
  interventionId?: string;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceSummary?: string;
  nearbyHospitals?: NearbyHospitalInfo[];
  environmentalImpact?: EnvironmentalImpactSummary;
  isSimulated?: boolean;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'AI Verified'
  | 'Assigned'
  | 'Inspection'
  | 'In Progress'
  | 'Resolved';

export interface ComplaintUpdate {
  timestamp: string;
  title: string;
  note: string;
  status: ComplaintStatus;
  actor: string;
}

export interface Complaint {
  id: string;
  issue: string;
  category: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  department: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: ComplaintStatus;
  createdAt: string;
  expectedResolution: string;
  aiConfidence: number;
  affectedSystems: string[];
  updates: ComplaintUpdate[];
  image?: string;
  citizenName: string;
  citizenEmail: string;
  clusterId?: string;
}

export interface CitizenComplaintCluster {
  id: string;
  title: string;
  category: string;
  centerLocation: string;
  latitude: number;
  longitude: number;
  signalsCount: number;
  signalIds: string[];
  severity: 'High' | 'Critical' | 'Medium';
  department: string;
  aiAnalysis: string;
  recommendedIntervention: string;
  status: 'Forming' | 'Operationalized' | 'Resolved';
}

// -------------------------------------------------------------
// URBAN CAUSAL GRAPH TYPES
// -------------------------------------------------------------
export interface CausalNode {
  id: string;
  label: string;
  department: string;
  category: IncidentCategory;
  severity: 'Critical' | 'Warning' | 'Normal';
  status: string;
  description: string;
  recommendedIntervention: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface CausalEdge {
  from: string;
  to: string;
  label: string;
}

export interface UrbanCausalScenario {
  id: string;
  name: string;
  rootEvent: string;
  nodes: CausalNode[];
  edges: CausalEdge[];
}

// -------------------------------------------------------------
// AI INTERVENTION PLANNER TYPES
// -------------------------------------------------------------
export interface InterventionOption {
  id: string;
  title: string;
  type: 'tactical' | 'infrastructure' | 'policy' | 'combined';
  department: string;
  costEstimate: string;
  implementationTime: string;
  riskReductionPct: number;
  populationProtected: number;
  secondaryBenefits: string[];
  emissionsAvoidedTons?: number;
  energyImpactKWh?: number;
  status: 'available' | 'simulating' | 'active' | 'completed';
  description: string;
}

export interface ProblemInterventionPlan {
  problemId: string;
  problemTitle: string;
  currentRiskScore: number;
  interventions: InterventionOption[];
  appliedInterventionId?: string;
  postInterventionRiskScore?: number;
}

// -------------------------------------------------------------
// WATER SECTOR: DMA NON-REVENUE WATER LOSS ENGINE
// -------------------------------------------------------------
export interface DistrictMeteredArea {
  id: string;
  name: string;
  ward: string;
  inflowMLPerDay: number;
  expectedDemandMLPerDay: number;
  billedConsumptionMLPerDay: number;
  unexplainedLossMLPerDay: number;
  pressureBar: number;
  leakProbabilityPct: number;
  probableCorridor: string;
  corridorCoords: [number, number];
  affectedPopulation: number;
  status: 'Normal' | 'Warning' | 'Critical Leak Detected';
  investigationCaseId?: string;
  beforeAfterComparison?: {
    lossBefore: number;
    lossAfter: number;
    networkHealthBefore: number;
    networkHealthAfter: number;
  };
}

// -------------------------------------------------------------
// MOBILITY: ADAPTIVE INTERSECTIONS & EMERGENCY ROUTING
// -------------------------------------------------------------
export interface IntersectionTelemetry {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  currentGreenTimeSeconds: number;
  optimizedGreenTimeSeconds: number;
  queueLengthMeters: number;
  avgSpeedKmph: number;
  delayReductionPct: number;
  spilloverImpact: {
    neighborIntersection: string;
    neighborDelayShiftPct: number;
  };
  status: 'Standard' | 'AI Adaptive Wave Active';
}

export interface EmergencyPriorityCorridor {
  id: string;
  incidentId: string;
  vehicleType: 'Ambulance' | 'Fire Engine' | 'Hydro Jetter';
  origin: string;
  destination: string;
  originCoords: [number, number];
  destCoords: [number, number];
  currentEtaMinutes: number;
  priorityEtaMinutes: number;
  controlledSignalsCount: number;
  routeWaypoints: [number, number][];
  status: 'Pending' | 'Active Green Wave' | 'Completed';
}

// -------------------------------------------------------------
// WASTE: DYNAMIC ROUTING & HOTSPOTS
// -------------------------------------------------------------
export interface SmartWasteBin {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  capacityLiters: number;
  currentFillPct: number;
  predictedFillIn3HrsPct: number;
  priority: 'Low' | 'Medium' | 'High' | 'Overflow Imminent';
}

export interface WasteTruckRoute {
  id: string;
  truckId: string;
  driver: string;
  baselineDistanceKm: number;
  optimizedDistanceKm: number;
  baselineTimeMin: number;
  optimizedTimeMin: number;
  co2SavedKg: number;
  binsCovered: number;
  status: 'Baseline' | 'AI Optimized Applied';
  stops: string[];
}

// -------------------------------------------------------------
// ENVIRONMENT: SOURCE ATTRIBUTION & HEAT EXPOSURE
// -------------------------------------------------------------
export interface AirQualityAttribution {
  zone: string;
  currentAQI: number;
  sources: {
    traffic: number;
    industry: number;
    construction: number;
    dust: number;
    other: number;
  };
  interventions: {
    name: string;
    pm25Reduction: number;
    pm10Reduction: number;
    congestionShift: number;
    selected: boolean;
  }[];
}

export interface HeatExposureZone {
  id: string;
  zoneName: string;
  latitude: number;
  longitude: number;
  surfaceTempC: number;
  humidityPct: number;
  treeCanopyPct: number;
  populationExposed: number;
  exposureRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  suggestedAction: string;
  implementedCooling: boolean;
}

// -------------------------------------------------------------
// ENERGY: FLEXIBILITY PEAK AVOIDANCE & OUTAGE COMMAND
// -------------------------------------------------------------
export interface EnergyFlexibilityPlan {
  id: string;
  peakWindow: string;
  baselineDemandGW: number;
  safeCapacityGW: number;
  optimizedDemandGW: number;
  actions: {
    name: string;
    mwRelief: number;
    status: 'Ready' | 'Dispatched';
  }[];
  costAvoidedUSD: number;
  co2AvoidedTons: number;
  isExecuted: boolean;
}

// -------------------------------------------------------------
// INFRASTRUCTURE: PREDICTIVE ASSET & URBAN WORKS COORDINATOR
// -------------------------------------------------------------
export interface PredictiveAsset {
  id: string;
  assetType: 'Streetlight' | 'Bridge Joint' | 'Water Main' | 'Transformer' | 'Pavement Section';
  assetCode: string;
  location: string;
  latitude: number;
  longitude: number;
  ageYears: number;
  conditionScore: number;
  failureProbabilityNext30Days: number;
  recommendedWork: string;
  workOrderStatus: 'None' | 'Work Order Created' | 'Inspection Completed' | 'Repaired & Verified';
}

export interface UrbanWorkProject {
  id: string;
  department: string;
  title: string;
  roadSegment: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  excavationDays: number;
  status: 'Independent' | 'Coordinated Shared Window';
}

export interface CoordinatedWorkWindow {
  id: string;
  roadSegment: string;
  latitude: number;
  longitude: number;
  conflictingProjects: UrbanWorkProject[];
  independentExcavationDays: number;
  coordinatedExcavationDays: number;
  disruptionReductionPct: number;
  costSavingsUSD: number;
  status: 'Conflict Detected' | 'Window Coordinated & Scheduled';
}

// -------------------------------------------------------------
// CARBON EXCHANGE & MRV LIFECYCLE
// -------------------------------------------------------------
export type CarbonProjectType =
  | 'Solar'
  | 'Wind'
  | 'Reforestation'
  | 'Clean Cooking'
  | 'Waste-to-Energy'
  | 'EV Infrastructure'
  | 'Energy Efficiency'
  | 'Sustainable Agriculture';

export type VerificationStatus = 'Draft' | 'Monitoring' | 'Under Review' | 'Verified' | 'Issued';

export interface CarbonCreditItem {
  id: string;
  serialNumber: string;
  projectId: string;
  projectName: string;
  vintage: string;
  owner: string;
  quantityTons: number;
  pricePerTon: number;
  status: 'Available' | 'Listed' | 'Transferred' | 'Retired';
  integrityScore: number;
  additionalityProof: string;
}

export interface CarbonProject {
  id: string;
  name: string;
  country: string;
  cityRegion: string;
  developer: string;
  type: CarbonProjectType;
  co2ReductionTons: number;
  creditsAvailable: number;
  pricePerCredit: number;
  verificationStatus: VerificationStatus;
  projectStatus: 'Draft' | 'Monitoring' | 'Under Review' | 'Active' | 'Funding' | 'Completed';
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  vintage: string;
  standardsBody: string;
  integrityScore: number;
  mrvEvents: {
    date: string;
    stage: string;
    verifier: string;
    note: string;
  }[];
  impactMetrics: {
    treesPlanted?: string;
    cleanPowerMWh?: string;
    familiesImpacted?: string;
    hectaresPreserved?: string;
  };
}

export interface CarbonTransaction {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  projectType: CarbonProjectType;
  quantity: number;
  pricePerCredit: number;
  totalValue: number;
  type: 'Purchase' | 'Sale' | 'Retirement';
  status: 'Completed' | 'Pending';
  certificateId?: string;
  buyer: string;
  seller: string;
  beneficiary?: string;
  retirementPurpose?: string;
}

export interface CarbonPortfolio {
  creditsOwned: number;
  creditsRetired: number;
  creditsListed: number;
  co2ImpactTons: number;
  totalSpent: number;
  totalEarned: number;
}

export interface CityEmissionsInventory {
  city: string;
  year: number;
  totalEmissionsMt: number;
  scope1: number;
  scope2: number;
  scope3: number;
  sectors: {
    transport: number;
    buildings: number;
    energy: number;
    industry: number;
    waste: number;
  };
  hotspots: {
    name: string;
    emissionsTons: number;
    latitude: number;
    longitude: number;
    primaryDriver: string;
    suggestedProject: string;
  }[];
}

// -------------------------------------------------------------
// AUDIT TRAIL & SYSTEM LOG
// -------------------------------------------------------------
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  department: string;
  entity: string;
  previousState?: string;
  newState?: string;
  impactSummary?: string;
}

export interface CityHealthMetric {
  id: string;
  category:
    | 'Mobility'
    | 'Water'
    | 'Energy'
    | 'Environment'
    | 'Waste'
    | 'Infrastructure'
    | 'Public Health'
    | 'Citizen Services'
    | 'Sustainability';
  score: number;
  trend: 'up' | 'down' | 'neutral';
  delta: number;
  previousScore: number;
  changeReason: string;
  highlightCategory: IncidentCategory;
  metrics: { label: string; value: string; status: 'good' | 'warning' | 'critical' }[];
}

export interface AgentInfo {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Analyzing' | 'Waiting' | 'Alert';
  description: string;
  iconName: string;
  lastAction: string;
  activeAlertsCount: number;
  recentActivity: string[];
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  targetModule?: string;
  actionId?: string;
}

export interface CountryEmission {
  country: string;
  code: string;
  latitude: number;
  longitude: number;
  totalEmissionsMt: number;
  yoyChange: number;
  perCapitaTonnes: number;
  complianceRate: number;
  activeAuditsCount: number;
  sectors: {
    energy: number;
    transportation: number;
    industry: number;
    agriculture: number;
    buildings: number;
  };
  aiInsight: string;
}
