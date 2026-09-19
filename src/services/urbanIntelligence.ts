import {
  UrbanCausalScenario,
  ProblemInterventionPlan,
  DistrictMeteredArea,
  IntersectionTelemetry,
  EmergencyPriorityCorridor,
  SmartWasteBin,
  WasteTruckRoute,
  AirQualityAttribution,
  HeatExposureZone,
  EnergyFlexibilityPlan,
  PredictiveAsset,
  CoordinatedWorkWindow,
  CitizenComplaintCluster,
  CityEmissionsInventory,
  AuditLogEntry
} from '../types';

export const INITIAL_CAUSAL_SCENARIOS: Record<string, UrbanCausalScenario> = {
  'storm-cascade': {
    id: 'storm-cascade',
    name: 'Monsoon Flash Inundation & Cascading Transit Failure',
    rootEvent: 'Heavy Precipitation Event (68mm/hr)',
    nodes: [
      {
        id: 'node-1',
        label: 'Heavy Rainfall (68mm/hr)',
        department: 'Environment',
        category: 'Environment',
        severity: 'Critical',
        status: 'Active',
        description: 'Sustained precipitation overwhelmed gravity drainage capacity.',
        recommendedIntervention: 'Issue city-wide flash flood warning advisory.',
        location: 'Ward 7 & Coastal Basin',
        latitude: 19.0760,
        longitude: 72.8777
      },
      {
        id: 'node-2',
        label: 'Drainage Capacity Exceeded',
        department: 'Water & Drainage',
        category: 'Water',
        severity: 'Critical',
        status: 'Overloaded',
        description: 'Storm culvert intake reached 135% hydraulic capacity; silt trap blocked.',
        recommendedIntervention: 'Deploy high-velocity jetting van and open sluice 7B.',
        location: 'Hill Road Sluice Gate',
        latitude: 19.0558,
        longitude: 72.8335
      },
      {
        id: 'node-3',
        label: 'Waterlogging & Surface Ponding',
        department: 'Water & Drainage',
        category: 'Flooding',
        severity: 'Critical',
        status: 'High Pooling',
        description: '0.45m standing water across arterial corridor impacting 2,400 residents.',
        recommendedIntervention: 'Deploy 2x mobile diesel dewatering pumps (8000 L/min).',
        location: 'Hill Road Junction',
        latitude: 19.0565,
        longitude: 72.8340
      },
      {
        id: 'node-4',
        label: 'Road Capacity Reduced (-65%)',
        department: 'Infrastructure',
        category: 'Infrastructure',
        severity: 'Warning',
        status: 'Impaired',
        description: 'Two lanes closed due to deep water accumulation; lane taper erected.',
        recommendedIntervention: 'Erect hazard pylons and deploy tow recovery units.',
        location: 'Arterial Corridor B',
        latitude: 19.0570,
        longitude: 72.8350
      },
      {
        id: 'node-5',
        label: 'Severe Traffic Congestion',
        department: 'Traffic & Mobility',
        category: 'Mobility',
        severity: 'Critical',
        status: 'Gridlock',
        description: 'Average transit speed dropped to 4.2 km/h; 3.8km tailback forming.',
        recommendedIntervention: 'Override signal cycle to adaptive 120s green wave; divert to 2nd Ave.',
        location: 'SV Road Feeder Junction',
        latitude: 19.0580,
        longitude: 72.8360
      },
      {
        id: 'node-6',
        label: 'Ambulance & Fire Response Delayed',
        department: 'Emergency Services',
        category: 'Public Safety',
        severity: 'Critical',
        status: 'Delayed ETA',
        description: 'Hospital transit delay increased from 8 min to 26 min for emergency vehicles.',
        recommendedIntervention: 'Activate Emergency Green Wave Corridor with signal preemption.',
        location: 'Lilavati Hospital Corridor',
        latitude: 19.0520,
        longitude: 72.8290
      },
      {
        id: 'node-7',
        label: 'Hospital Accessibility Impaired',
        department: 'Public Health',
        category: 'Health',
        severity: 'Warning',
        status: 'Bottleneck',
        description: 'Emergency ambulance bay ingress slowed by local queue spillover.',
        recommendedIntervention: 'Coordinate with traffic police for dedicated emergency staging lane.',
        location: 'Lilavati Trauma Center',
        latitude: 19.0515,
        longitude: 72.8280
      }
    ],
    edges: [
      { from: 'node-1', to: 'node-2', label: 'Overwhelms' },
      { from: 'node-2', to: 'node-3', label: 'Causes' },
      { from: 'node-3', to: 'node-4', label: 'Submerges' },
      { from: 'node-4', to: 'node-5', label: 'Bottlenecks' },
      { from: 'node-5', to: 'node-6', label: 'Delays' },
      { from: 'node-6', to: 'node-7', label: 'Restricts Access' }
    ]
  },
  'leak-cascade': {
    id: 'leak-cascade',
    name: 'Mains Burst, Pressure Drop & Contamination Hazard',
    rootEvent: 'Underground 450mm Distribution Pipe Fracture',
    nodes: [
      {
        id: 'leak-1',
        label: 'Pipeline Rupture (450mm Mains)',
        department: 'Water & Drainage',
        category: 'Water',
        severity: 'Critical',
        status: 'Active Leak',
        description: 'Acoustic sensor flagged sudden 3.4 bar pressure loss in Ward 7 mains.',
        recommendedIntervention: 'Isolate Sector Valve B-4 to prevent sub-base washout.',
        latitude: 19.0760,
        longitude: 72.8777
      },
      {
        id: 'leak-2',
        label: 'Non-Revenue Water Loss (1.8 ML/day)',
        department: 'Water & Drainage',
        category: 'Water',
        severity: 'Critical',
        status: 'Severe Loss',
        description: 'Treated municipal water escaping into underground storm gravel layers.',
        recommendedIntervention: 'Deploy electro-acoustic ground microphone for precise excavation fix.',
        latitude: 19.0765,
        longitude: 72.8780
      },
      {
        id: 'leak-3',
        label: 'Sub-Pavement Soil Subsidence',
        department: 'Infrastructure',
        category: 'Infrastructure',
        severity: 'Warning',
        status: 'Erosion Risk',
        description: 'Underground gravel wash creates void underneath asphalt carriageway.',
        recommendedIntervention: 'Barricade lane and test ground penetration radar.',
        latitude: 19.0770,
        longitude: 72.8785
      },
      {
        id: 'leak-4',
        label: 'Low Pressure in 1,200 Households',
        department: 'Citizen Services',
        category: 'Citizen Report',
        severity: 'Warning',
        status: 'Supply Disruption',
        description: 'Tap water pressure dropped below 0.8 bar across 4 residential complexes.',
        recommendedIntervention: 'Dispatch 4 municipal potable water tankers as interim supply.',
        latitude: 19.0775,
        longitude: 72.8790
      }
    ],
    edges: [
      { from: 'leak-1', to: 'leak-2', label: 'Discharges' },
      { from: 'leak-2', to: 'leak-3', label: 'Undermines' },
      { from: 'leak-1', to: 'leak-4', label: 'Depressurizes' }
    ]
  }
};

export const INITIAL_INTERVENTION_PLANS: Record<string, ProblemInterventionPlan> = {
  'INC-8492': {
    problemId: 'INC-8492',
    problemTitle: 'Ward 7 Flood & Major Mains Leakage',
    currentRiskScore: 88,
    interventions: [
      {
        id: 'int-1',
        title: 'High-Velocity Drain Cleaning & De-Silting',
        type: 'tactical',
        department: 'Water & Drainage',
        costEstimate: '$4,200',
        implementationTime: '3 hours',
        riskReductionPct: 34,
        populationProtected: 1800,
        secondaryBenefits: ['Restores 85% gravity drain flow', 'Reduces road puddle depth by 25cm'],
        status: 'available',
        description: 'Deploy heavy vacuum truck and rotary water-jetting nozzles to clear tree roots and silt from culvert LN-04.'
      },
      {
        id: 'int-2',
        title: 'Stage Mobile Dewatering Pumps (2x 8000 L/min)',
        type: 'tactical',
        department: 'Emergency Services',
        costEstimate: '$2,800',
        implementationTime: '1.5 hours',
        riskReductionPct: 28,
        populationProtected: 2100,
        secondaryBenefits: ['Rapid evacuation of basement poolings', 'Prevents transformer substation trip'],
        status: 'available',
        description: 'Pre-position high-output submersible diesel pumps along low-elevation canal basin.'
      },
      {
        id: 'int-3',
        title: 'Adaptive Signal Diversion & Bus Rerouting',
        type: 'policy',
        department: 'Traffic & Mobility',
        costEstimate: '$800',
        implementationTime: '15 mins',
        riskReductionPct: 22,
        populationProtected: 6500,
        secondaryBenefits: ['Reduces corridor congestion by 48%', 'Clears ambulance priority lane'],
        status: 'available',
        description: 'Engage 120s green wave on alternate North-South connector and broadcast dynamic transit reroutes.'
      },
      {
        id: 'int-4',
        title: 'Deploy Temporary Inflatable Flood Barriers',
        type: 'infrastructure',
        department: 'Infrastructure',
        costEstimate: '$6,500',
        implementationTime: '4 hours',
        riskReductionPct: 38,
        populationProtected: 3200,
        secondaryBenefits: ['Protects commercial stores', 'Contains surface water within channel'],
        status: 'available',
        description: 'Install 400m water-filled barrier dams along retail promenade.'
      },
      {
        id: 'int-5',
        title: 'AURIS Combined Coordinated Intervention Package',
        type: 'combined',
        department: 'City Intelligence Orchestrator',
        costEstimate: '$12,400',
        implementationTime: '4.5 hours',
        riskReductionPct: 76,
        populationProtected: 8400,
        secondaryBenefits: [
          'Drain cleaning + Mobile pumps + Traffic green wave + Emergency staging',
          'Avoids $180,000 in commercial property water damage',
          'Cuts ambulance ETA by 14 minutes'
        ],
        emissionsAvoidedTons: 18.4,
        status: 'available',
        description: 'Simultaneous cross-agency execution: Water hydro-jetting, Emergency pump staging, Mobility signal wave, and Citizen notifications.'
      }
    ]
  }
};

export const INITIAL_DMAS: DistrictMeteredArea[] = [
  {
    id: 'DMA-ZONE-7',
    name: 'District Metered Area 7 (Bandra West Basin)',
    ward: 'Ward 7',
    inflowMLPerDay: 10.2,
    expectedDemandMLPerDay: 8.4,
    billedConsumptionMLPerDay: 7.9,
    unexplainedLossMLPerDay: 1.8,
    pressureBar: 2.8,
    leakProbabilityPct: 88,
    probableCorridor: 'Hill Road 450mm Distribution Branch (Node B-14)',
    corridorCoords: [19.0558, 72.8335],
    affectedPopulation: 2400,
    status: 'Critical Leak Detected',
    investigationCaseId: 'CASE-WD-8841',
    beforeAfterComparison: {
      lossBefore: 1.8,
      lossAfter: 0.4,
      networkHealthBefore: 65,
      networkHealthAfter: 84
    }
  },
  {
    id: 'DMA-ZONE-3',
    name: 'District Metered Area 3 (Colaba Heritage Zone)',
    ward: 'Ward 3',
    inflowMLPerDay: 6.8,
    expectedDemandMLPerDay: 6.1,
    billedConsumptionMLPerDay: 5.9,
    unexplainedLossMLPerDay: 0.7,
    pressureBar: 3.9,
    leakProbabilityPct: 24,
    probableCorridor: 'Harbor Road Feeder',
    corridorCoords: [18.9220, 72.8347],
    affectedPopulation: 1100,
    status: 'Normal'
  },
  {
    id: 'DMA-ZONE-11',
    name: 'District Metered Area 11 (Andheri Commercial Hub)',
    ward: 'Ward 11',
    inflowMLPerDay: 14.5,
    expectedDemandMLPerDay: 12.8,
    billedConsumptionMLPerDay: 12.2,
    unexplainedLossMLPerDay: 1.7,
    pressureBar: 3.1,
    leakProbabilityPct: 62,
    probableCorridor: 'Link Road Main Feeder',
    corridorCoords: [19.1136, 72.8697],
    affectedPopulation: 5200,
    status: 'Warning'
  }
];

export const INITIAL_INTERSECTIONS: IntersectionTelemetry[] = [
  {
    id: 'INT-NY-01',
    name: 'FDR Drive & East 14th St Junction',
    latitude: 40.7282,
    longitude: -73.9722,
    currentGreenTimeSeconds: 45,
    optimizedGreenTimeSeconds: 75,
    queueLengthMeters: 380,
    avgSpeedKmph: 6.4,
    delayReductionPct: 28,
    spilloverImpact: {
      neighborIntersection: '2nd Ave & East 14th St',
      neighborDelayShiftPct: 4.2
    },
    status: 'Standard'
  },
  {
    id: 'INT-MUM-04',
    name: 'Hill Road & SV Road Junction',
    latitude: 19.0558,
    longitude: 72.8335,
    currentGreenTimeSeconds: 40,
    optimizedGreenTimeSeconds: 65,
    queueLengthMeters: 450,
    avgSpeedKmph: 4.8,
    delayReductionPct: 34,
    spilloverImpact: {
      neighborIntersection: 'Linking Road Intersection',
      neighborDelayShiftPct: 6.1
    },
    status: 'Standard'
  }
];

export const INITIAL_EMERGENCY_CORRIDORS: EmergencyPriorityCorridor[] = [
  {
    id: 'CORR-EM-01',
    incidentId: 'INC-8492',
    vehicleType: 'Ambulance',
    origin: 'Bandra Reclamation Rescue Station',
    destination: 'Lilavati Hospital Trauma Hub',
    originCoords: [19.0480, 72.8250],
    destCoords: [19.0520, 72.8290],
    currentEtaMinutes: 18,
    priorityEtaMinutes: 9,
    controlledSignalsCount: 6,
    routeWaypoints: [
      [19.0480, 72.8250],
      [19.0500, 72.8270],
      [19.0515, 72.8280],
      [19.0520, 72.8290]
    ],
    status: 'Pending'
  }
];

export const INITIAL_SMART_BINS: SmartWasteBin[] = [
  {
    id: 'BIN-101',
    locationName: 'Central Market Food Plaza',
    latitude: -33.8688,
    longitude: 151.2093,
    capacityLiters: 1100,
    currentFillPct: 96,
    predictedFillIn3HrsPct: 118,
    priority: 'Overflow Imminent'
  },
  {
    id: 'BIN-102',
    locationName: 'Haymarket Transit Concourse',
    latitude: -33.8720,
    longitude: 151.2060,
    capacityLiters: 1100,
    currentFillPct: 88,
    predictedFillIn3HrsPct: 104,
    priority: 'High'
  },
  {
    id: 'BIN-103',
    locationName: 'Chinatown Pedestrian Mall',
    latitude: -33.8790,
    longitude: 151.2040,
    capacityLiters: 800,
    currentFillPct: 74,
    predictedFillIn3HrsPct: 92,
    priority: 'Medium'
  },
  {
    id: 'BIN-104',
    locationName: 'Darling Harbour North Walkway',
    latitude: -33.8710,
    longitude: 151.2010,
    capacityLiters: 800,
    currentFillPct: 45,
    predictedFillIn3HrsPct: 60,
    priority: 'Low'
  }
];

export const INITIAL_WASTE_ROUTE: WasteTruckRoute = {
  id: 'ROUTE-TRUCK-09',
  truckId: 'Compactor Truck #9 (18-Ton)',
  driver: 'Marcus Taylor',
  baselineDistanceKm: 28.4,
  optimizedDistanceKm: 18.2,
  baselineTimeMin: 95,
  optimizedTimeMin: 58,
  co2SavedKg: 24.6,
  binsCovered: 14,
  status: 'Baseline',
  stops: ['Depot Alpha', 'BIN-101 (Overflow)', 'BIN-102 (High)', 'BIN-103', 'Recycling Hub']
};

export const INITIAL_COMPLAINT_CLUSTERS: CitizenComplaintCluster[] = [
  {
    id: 'CLUS-889',
    title: 'Emerging Catch-Basin Drainage Failure (38 Citizen Reports)',
    category: 'Water & Drainage',
    centerLocation: 'Hill Road Junction, Bandra West, Mumbai',
    latitude: 19.0558,
    longitude: 72.8335,
    signalsCount: 38,
    signalIds: ['AUR-1042', 'AUR-1045', 'AUR-1049', 'AUR-1052'],
    severity: 'Critical',
    department: 'Water & Drainage Department',
    aiAnalysis: 'Spatial clustering of 38 distinct geo-tagged citizen submissions over past 4 hours indicates high-probability arterial culvert blockage with surface runoff risk.',
    recommendedIntervention: 'Convert clustered signals into High Priority Municipal Work Order #WD-491.',
    status: 'Forming'
  }
];

export const INITIAL_COORDINATED_WORKS: CoordinatedWorkWindow[] = [
  {
    id: 'WORK-COORD-104',
    roadSegment: 'Hill Road Arterial Corridor (Section 4 to 8)',
    latitude: 19.0560,
    longitude: 72.8340,
    independentExcavationDays: 24,
    coordinatedExcavationDays: 9,
    disruptionReductionPct: 62.5,
    costSavingsUSD: 38500,
    status: 'Conflict Detected',
    conflictingProjects: [
      {
        id: 'PRJ-W-01',
        department: 'Water & Drainage',
        title: 'Replace 450mm Ductile Iron Pipeline',
        roadSegment: 'Hill Road Section 4-7',
        latitude: 19.0558,
        longitude: 72.8335,
        startDate: '2026-10-15',
        endDate: '2026-10-21',
        excavationDays: 7,
        status: 'Independent'
      },
      {
        id: 'PRJ-E-02',
        department: 'Energy Department',
        title: 'High-Voltage Underground Grid Feeder Trenching',
        roadSegment: 'Hill Road Section 5-8',
        latitude: 19.0562,
        longitude: 72.8342,
        startDate: '2026-10-18',
        endDate: '2026-10-26',
        excavationDays: 9,
        status: 'Independent'
      },
      {
        id: 'PRJ-R-03',
        department: 'Infrastructure',
        title: 'Full Pavement Cold-Milling & Asphalt Resurfacing',
        roadSegment: 'Hill Road Section 4-8',
        latitude: 19.0560,
        longitude: 72.8340,
        startDate: '2026-10-22',
        endDate: '2026-10-30',
        excavationDays: 8,
        status: 'Independent'
      }
    ]
  }
];

export const INITIAL_PREDICTIVE_ASSETS: PredictiveAsset[] = [
  {
    id: 'ASSET-SL-448',
    assetType: 'Streetlight',
    assetCode: 'SL-448-LED',
    location: 'Bandra Bandstand Promenade',
    latitude: 19.0430,
    longitude: 72.8190,
    ageYears: 6.2,
    conditionScore: 42,
    failureProbabilityNext30Days: 84,
    recommendedWork: 'Replace degraded driver ballast & clean optical lens.',
    workOrderStatus: 'None'
  },
  {
    id: 'ASSET-BRG-12',
    assetType: 'Bridge Joint',
    assetCode: 'BRG-EXP-12',
    location: 'Sea Link North Abutment',
    latitude: 19.0350,
    longitude: 72.8180,
    ageYears: 12.0,
    conditionScore: 58,
    failureProbabilityNext30Days: 71,
    recommendedWork: 'Inject elastomeric expansion sealant before monsoon swell.',
    workOrderStatus: 'None'
  }
];

export const INITIAL_HEAT_ZONES: HeatExposureZone[] = [
  {
    id: 'HEAT-Z1',
    zoneName: 'Central Industrial Corridor & Transit Terminus',
    latitude: 19.0650,
    longitude: 72.8650,
    surfaceTempC: 41.2,
    humidityPct: 68,
    treeCanopyPct: 11.4,
    populationExposed: 42000,
    exposureRisk: 'Critical',
    suggestedAction: 'Deploy 4 shaded misting transit stops & activate community cooling hub.',
    implementedCooling: false
  }
];

export const INITIAL_ENERGY_FLEXIBILITY: EnergyFlexibilityPlan = {
  id: 'FLEX-PEAK-01',
  peakWindow: '18:00 – 21:00 Today',
  baselineDemandGW: 9.4,
  safeCapacityGW: 9.0,
  optimizedDemandGW: 8.7,
  costAvoidedUSD: 142000,
  co2AvoidedTons: 84.5,
  isExecuted: false,
  actions: [
    { name: 'Defer 12,000 Municipal EV Fleet Charging Cycles to 23:00', mwRelief: 240, status: 'Ready' },
    { name: 'Discharge 4x Grid-Scale Utility Battery Buffers', mwRelief: 310, status: 'Ready' },
    { name: 'Commercial Building Chiller Pre-Cooling Setpoint Drift (+1.5°C)', mwRelief: 150, status: 'Ready' }
  ]
};

export const INITIAL_CITY_EMISSIONS_INVENTORY: CityEmissionsInventory = {
  city: 'Mumbai Metropolitan Region',
  year: 2026,
  totalEmissionsMt: 32.4,
  scope1: 14.8,
  scope2: 11.2,
  scope3: 6.4,
  sectors: {
    transport: 38,
    buildings: 26,
    energy: 22,
    industry: 11,
    waste: 3
  },
  hotspots: [
    {
      name: 'Central Industrial Manufacturing Cluster D',
      emissionsTons: 420000,
      latitude: 19.0800,
      longitude: 72.8900,
      primaryDriver: 'Heavy thermal boilers & fossil generation',
      suggestedProject: 'Industrial Waste Heat Recovery & Rooftop Solar Hybrid'
    },
    {
      name: 'Eastern Expressway Freight Freight Corridor',
      emissionsTons: 310000,
      latitude: 19.0600,
      longitude: 72.8800,
      primaryDriver: 'Heavy diesel commercial transit congestion',
      suggestedProject: 'EV Heavy Haul Charging Hub & Green Freight Wave'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: 'Today, 08:30 AM',
    actor: 'Citizen Ananya Deshmukh',
    action: 'Complaint Logged',
    department: 'Citizen Services',
    entity: 'Ticket #AUR-1042',
    newState: 'Submitted',
    impactSummary: 'Citizen report logged with photo & geo-coordinates.'
  },
  {
    id: 'AUD-002',
    timestamp: 'Today, 08:45 AM',
    actor: 'AURIS Water Agent',
    action: 'AI Verification & Anomaly Detection',
    department: 'Water & Drainage',
    entity: 'DMA-ZONE-7',
    previousState: 'Normal',
    newState: 'Critical Leak Detected',
    impactSummary: 'Correlated 1.8 ML/day non-revenue water loss with acoustic sensor LN-04.'
  },
  {
    id: 'AUD-003',
    timestamp: 'Today, 11:20 AM',
    actor: 'City Intelligence Orchestrator',
    action: 'Dispatched Inter-Department Work Order',
    department: 'Office of Municipal Commissioner',
    entity: 'Work Order #WD-491',
    newState: 'Assigned',
    impactSummary: 'Synchronized Water Hydro Crew #4 and Traffic Signal Wave #MUM-04.'
  }
];
