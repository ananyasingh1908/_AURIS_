import { Incident, IncidentCategory, IncidentSeverity, IncidentStatus } from '../types';

export interface StructuredWaterIncident {
  id: string;
  type: string;
  location: string;
  ward: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;
  populationAffected: number;
  nearbyHospitals: {
    name: string;
    distanceKm: number;
    bedOccupancyRate: number;
    icuCapacityAvailable: number;
  }[];
  citizenComplaints: number;
  roadAccessibility: string;
  environmentalRisk: string;
  timestamp: string;
  status: IncidentStatus;
  department: string;
  waterQualityMetrics: {
    turbidityNtu: number; // Normal < 1.0 NTU, Contaminated: 14.2 NTU
    phLevel: number; // Normal 6.5 - 8.5, Contaminated: 5.8
    freeChlorineMgL: number; // Normal 0.2 - 0.5, Contaminated: 0.02
    coliformDetected: boolean;
    pipelinePressureBar: number; // Normal: 4.2 bar, Contaminated: 1.1 bar
  };
}

export interface AgentAnalysisResult {
  agentName: string;
  domain: string;
  status: 'Critical' | 'Warning' | 'Action Required' | 'Optimal';
  confidence: number;
  findings: string[];
  recommendedActions: string[];
  evidenceData: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface RiskFactorScore {
  factor: string;
  score: number;
  maxScore: number;
  weight: number;
  rationale: string;
}

export interface IncidentRiskEvaluation {
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactorScore[];
  summary: string;
  evidencePoints: {
    domain: string;
    finding: string;
    metric: string;
    actionJustification: string;
  }[];
}

export interface CoordinatedDepartmentAction {
  id: string;
  department: string;
  priority: 'P1 - Immediate' | 'P2 - High' | 'P3 - Moderate';
  actionTitle: string;
  actionDetails: string;
  targetEntity: string;
  deadline: string;
  status: 'Pending Authorization' | 'Dispatched' | 'In Progress' | 'Completed';
}

export interface IncidentTimelineEvent {
  id: string;
  phase: 'Detected' | 'Correlated' | 'Analyzed' | 'Risk Calculated' | 'Response Generated' | 'Actions Dispatched';
  timeOffset: string; // e.g. "T+00m"
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  department: string;
  status: 'complete' | 'active' | 'pending';
}

export interface FullIncidentExecutionResult {
  incident: StructuredWaterIncident;
  baseIncident: Incident;
  agentOutputs: {
    waterAgent: AgentAnalysisResult;
    citizenAgent: AgentAnalysisResult;
    healthAgent: AgentAnalysisResult;
    mobilityAgent: AgentAnalysisResult;
    environmentAgent: AgentAnalysisResult;
    responseAgent: AgentAnalysisResult;
  };
  riskEvaluation: IncidentRiskEvaluation;
  departmentActions: CoordinatedDepartmentAction[];
  timeline: IncidentTimelineEvent[];
}

// ----------------------------------------------------------------------------
// 1. SPECIALIZED AGENTS IMPLEMENTATION
// ----------------------------------------------------------------------------

/**
 * Water Agent: Analyzes SCADA pressure drops, turbidity spikes, and hydraulic backflow risks.
 */
export const runWaterAgent = (incident: StructuredWaterIncident): AgentAnalysisResult => {
  const isHighTurbidity = incident.waterQualityMetrics.turbidityNtu > 5.0;
  const isPressureLoss = incident.waterQualityMetrics.pipelinePressureBar < 2.0;
  const pressureDrop = Math.max(0, 4.2 - incident.waterQualityMetrics.pipelinePressureBar);

  return {
    agentName: 'Water & Hydrology Agent',
    domain: 'Water Infrastructure & SCADA Telemetry',
    status: isHighTurbidity || isPressureLoss ? 'Critical' : 'Warning',
    confidence: 0.98,
    findings: [
      `Acoustic sensor flagged a ${pressureDrop.toFixed(1)} bar pressure drop at DMA-04 Distribution Main (Current: ${incident.waterQualityMetrics.pipelinePressureBar} bar).`,
      `Optical turbidity sensor logged acute spike of ${incident.waterQualityMetrics.turbidityNtu} NTU (Standard limit: < 1.0 NTU).`,
      `Free chlorine residual depleted to ${incident.waterQualityMetrics.freeChlorineMgL} mg/L, indicating severe biological or chemical contaminant neutralization load.`,
      `Sub-surface hydraulic backflow detected near industrial storm culvert junction.`
    ],
    recommendedActions: [
      'Remotely actuate motorized isolation valves V-104A and V-104B to quarantine Sector 4 mains.',
      'Reroute gravity-fed drinking water from Pali Hill Secondary Reservoir to supply unimpacted residential blocks.',
      'Deploy 18 municipal water tankers with UV filtration units to designated community hubs.'
    ],
    evidenceData: {
      turbidityNtu: incident.waterQualityMetrics.turbidityNtu,
      phLevel: incident.waterQualityMetrics.phLevel,
      pipelinePressureBar: incident.waterQualityMetrics.pipelinePressureBar,
      chlorineResidualMgL: incident.waterQualityMetrics.freeChlorineMgL,
      coliformStatus: incident.waterQualityMetrics.coliformDetected ? 'DETECTED' : 'CLEAR'
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Citizen Agent: Clusters verified civic reports, sentiment escalation, and geographical signal spread.
 */
export const runCitizenAgent = (incident: StructuredWaterIncident): AgentAnalysisResult => {
  return {
    agentName: 'Citizen Intelligence Agent',
    domain: 'Civic Signal Aggregation & NLP Sentiment',
    status: incident.citizenComplaints > 20 ? 'Critical' : 'Warning',
    confidence: 0.94,
    findings: [
      `Aggregated ${incident.citizenComplaints} geolocated citizen complaint tickets within a 1.2km radius in past 90 minutes.`,
      'NLP signal classification: 71% reported "foul chemical odor & rust discoloration", 29% reported "sudden household tap loss".',
      'Geospatial complaint centroid aligns within 120m of Sector 4 distribution junction.',
      'Civic sentiment score plummeted to -0.82 (High Panic / Agitation indicator).'
    ],
    recommendedActions: [
      'Broadcast automated geo-fenced SMS and WhatsApp civic bulletin: "Do Not Consume / Boil Water Advisory".',
      'Deploy localized interactive voice response (IVR) helpline for vulnerable senior citizens.',
      'Provide real-time water tanker live tracking link on AURIS Citizen Portal.'
    ],
    evidenceData: {
      verifiedComplaintsCount: incident.citizenComplaints,
      complaintCentroidRadiusKm: 1.2,
      sentimentPolarity: -0.82,
      topKeywords: 'tap water, brown color, chemical smell, stomach ache'
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Health Agent: Syndromic disease surveillance, hospital ICU/bed capacity, and vulnerable population protection.
 */
export const runHealthAgent = (
  incident: StructuredWaterIncident,
  waterOutput: AgentAnalysisResult
): AgentAnalysisResult => {
  const totalHospitals = incident.nearbyHospitals.length;
  const avgOccupancy = incident.nearbyHospitals.reduce((acc, h) => acc + h.bedOccupancyRate, 0) / (totalHospitals || 1);

  return {
    agentName: 'Public Health & Bio-Surveillance Agent',
    domain: 'Epidemiological Risk & Clinical Capacity',
    status: 'Critical',
    confidence: 0.96,
    findings: [
      `Identified ${totalHospitals} major healthcare facilities in direct downstream contamination zone (Lilavati, Bhabha, Holy Family).`,
      `Downstream hospital network currently operating at ${avgOccupancy.toFixed(1)}% average bed occupancy; limited pediatric ICU buffer.`,
      `Syndromic early-warning surveillance detected +42% spike in outpatient gastroenteritis and acute diarrhea consultations.`,
      `Estimated ${Math.round(incident.populationAffected * 0.18).toLocaleString()} high-vulnerability residents (children <5 and elderly >65) in Ward 7.`
    ],
    recommendedActions: [
      'Issue Emergency Red Protocol to Lilavati & Bhabha ER and triage centers; pre-position 2,500 IV hydration units.',
      'Mandate immediate hospital backup water reservoir switchover and on-site chemical verification testing.',
      'Mobilize mobile health inspection vans to conduct rapid diagnostic testing in affected residential sectors.'
    ],
    evidenceData: {
      hospitalsAtRisk: totalHospitals,
      avgBedOccupancyRate: `${avgOccupancy.toFixed(1)}%`,
      syndromicGastroSpike: '+42%',
      vulnerablePopulation: Math.round(incident.populationAffected * 0.18)
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Mobility Agent: Traffic preemption, emergency green waves for tankers and ambulances, and street closures.
 */
export const runMobilityAgent = (
  incident: StructuredWaterIncident,
  waterOutput: AgentAnalysisResult,
  healthOutput: AgentAnalysisResult
): AgentAnalysisResult => {
  return {
    agentName: 'Mobility & Traffic Control Agent',
    domain: 'Urban Transit Grid & Emergency Preemption',
    status: 'Action Required',
    confidence: 0.93,
    findings: [
      `Excavation and dewatering on Arterial Corridor 3 will restrict carriageway capacity by 65%.`,
      `Water tanker supply fleet (18 vehicles) requires prioritized transit corridors from Pali Hill Reservoir.`,
      `Ambulance transit times from Ward 7 to Lilavati Trauma Bay risk increasing from 6 min to 24 min if unmanaged.`,
      `SV Road & Hill Road feeder junctions experiencing spillback congestion at 8.4 km/h average speed.`
    ],
    recommendedActions: [
      'Activate AURIS Emergency Green Wave Corridor #E-04 with adaptive signal preemption for emergency vehicles.',
      'Enact automated heavy-commercial vehicle diversion via Link Road bypass.',
      'Reprogram 8 connected traffic signals to provide 90-second priority bursts for water relief logistics.'
    ],
    evidenceData: {
      roadCapacityReduction: '65%',
      corridorActive: 'Corridor #E-04 Lilavati Express',
      tankerFleetSize: 18,
      transitDelayReduction: '18 min saved via Green Wave'
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Environment Agent: Soil percolation, chemical runoff into waterways, and ecological compliance monitoring.
 */
export const runEnvironmentAgent = (
  incident: StructuredWaterIncident,
  waterOutput: AgentAnalysisResult
): AgentAnalysisResult => {
  return {
    agentName: 'Environment & Climate Resilience Agent',
    domain: 'Microclimate, Soil Leaching & Aquatic Runoff',
    status: 'Warning',
    confidence: 0.91,
    findings: [
      `High environmental leaching risk: Contaminated runoff threatens coastal Mahim Creek ecosystem within 3 hours.`,
      `Sub-surface water table depth in Sector 4 is only 1.8m, accelerating groundwater infiltration.`,
      `Estimated 12,000 liters of acidic/chemical-loaded water pooled in unlined roadside drainage swales.`
    ],
    recommendedActions: [
      'Deploy absorbent floating containment booms at Mahim Creek culvert outfall 7.',
      'Dispatch environmental emergency response unit for core soil sampling and pH neutralization buffer spraying.',
      'Issue automated compliance audit flag to nearby industrial zoning district.'
    ],
    evidenceData: {
      groundwaterPercolationTime: '2.8 hours',
      waterTableDepthMeters: 1.8,
      ecosystemThreatLevel: 'High (Coastal Estuary Catchment)',
      estimatedSpillVolumeLiters: 12000
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Response / Decision Agent: Synthesizes cross-department intelligence into unified municipal directives.
 */
export const runResponseAgent = (
  incident: StructuredWaterIncident,
  agents: {
    water: AgentAnalysisResult;
    citizen: AgentAnalysisResult;
    health: AgentAnalysisResult;
    mobility: AgentAnalysisResult;
    environment: AgentAnalysisResult;
  }
): AgentAnalysisResult => {
  const tankerFleetSize = Math.min(25, Math.max(4, Math.ceil(incident.populationAffected / 8000)));
  const correlatedSignals = incident.citizenComplaints + Math.round(incident.populationAffected / 1500) + 8;

  return {
    agentName: 'Unified Urban Response & Decision Agent',
    domain: 'Multi-Agency Executive Command & Policy Synthesis',
    status: 'Critical',
    confidence: 0.99,
    findings: [
      `SYNTHESIS COMPLETE: 5 Neural Domain Agents cross-correlated SCADA telemetry, ${incident.citizenComplaints} citizen tickets, 3 hospital vulnerability models, and traffic gridlocks.`,
      `Root Cause: Pipeline fracture with toxic backflow at Ward 7 Main Trunk line (Lat: ${incident.latitude.toFixed(4)}, Lng: ${incident.longitude.toFixed(4)}).`,
      `Compound Impact: Direct threat to ${incident.populationAffected.toLocaleString()} residents, 3 major hospitals, and coastal aquatic basin.`,
      `Action Directive: 6 synchronized cross-agency operations formulated for Mayor & Commissioner Authorization.`
    ],
    recommendedActions: [
      `EXEC-01 [Water Dept]: Isolate valves V-104A/B, activate Pali Hill bypass, dispatch ${tankerFleetSize} relief tankers.`,
      'EXEC-02 [Public Health]: Elevate Lilavati & Bhabha to Epidemic Triage Level 2; supply 2,500 IV bags.',
      'EXEC-03 [Mobility Dept]: Engage Emergency Green Wave Corridor #E-04 and re-route bus lines #14 and #88.',
      `EXEC-04 [Citizen Dept]: Transmit multi-channel SMS/App Boil Water Advisory to ${incident.populationAffected.toLocaleString()} residents.`,
      'EXEC-05 [Environment]: Place containment booms at Mahim Creek outfall and spray lime neutralization.',
      'EXEC-06 [Admin Command]: Establish Joint Incident Command Centre at Ward 7 Municipal HQ.'
    ],
    evidenceData: {
      participatingAgents: 5,
      correlatedSignals,
      crossAgencyDirectives: 6,
      estimatedContainmentWindowHours: 4.5
    },
    timestamp: new Date().toISOString()
  };
};

// ----------------------------------------------------------------------------
// 2. TRANSPARENT MATHEMATICAL RISK & EVIDENCE CALCULATION
// ----------------------------------------------------------------------------

export const calculateTransparentRisk = (incident: StructuredWaterIncident): IncidentRiskEvaluation => {
  const factors: RiskFactorScore[] = [];

  // Factor 1: Water-quality severity is derived directly from the editable SCADA inputs.
  const turbidityScore = Math.min(16, Math.max(0, Math.round(((incident.waterQualityMetrics.turbidityNtu - 1) / 13) * 16)));
  const pressureLossScore = Math.min(14, Math.max(0, Math.round(((4.2 - incident.waterQualityMetrics.pipelinePressureBar) / 3.1) * 14)));
  const baseSeverityScore = turbidityScore + pressureLossScore;
  factors.push({
    factor: 'Water Quality & Pressure Severity',
    score: baseSeverityScore,
    maxScore: 30,
    weight: 0.3,
    rationale: `Turbidity is ${incident.waterQualityMetrics.turbidityNtu.toFixed(1)} NTU and main pressure is ${incident.waterQualityMetrics.pipelinePressureBar.toFixed(1)} bar against a 4.2 bar operating baseline.`
  });

  // Factor 2: Affected Population Multiplier (Log-Scale)
  let popScore = Math.min(25, Math.round((incident.populationAffected / 150000) * 25));
  if (incident.populationAffected > 100000) popScore = 25;
  factors.push({
    factor: 'Population Exposure Scale',
    score: popScore,
    maxScore: 25,
    weight: 0.25,
    rationale: `${incident.populationAffected.toLocaleString()} citizens reside in the direct hydraulic contamination contour.`
  });

  // Factor 3: Critical Healthcare Vulnerability
  const hospitalCount = incident.nearbyHospitals.length;
  const hospitalScore = Math.min(20, hospitalCount * 6 + 2);
  factors.push({
    factor: 'Critical Hospital Infrastructure Ingress',
    score: hospitalScore,
    maxScore: 20,
    weight: 0.2,
    rationale: `${hospitalCount} acute care trauma centers (Lilavati, Bhabha, Holy Family) situated downstream with high bed loads.`
  });

  // Factor 4: Citizen Signal Velocity & Severity Spike
  const complaintScore = Math.min(15, Math.round((incident.citizenComplaints / 35) * 15));
  factors.push({
    factor: 'Civic Distress & Outbreak Signals',
    score: complaintScore,
    maxScore: 15,
    weight: 0.15,
    rationale: `${incident.citizenComplaints} verified civic complaints filed with acute symptoms within past 90 minutes.`
  });

  // Factor 5: Higher contamination and pressure loss increase runoff and emergency-access friction.
  const cascadeScore = Math.min(
    10,
    Math.max(0, 3 + Math.round(incident.waterQualityMetrics.turbidityNtu / 5) + Math.round((4.2 - incident.waterQualityMetrics.pipelinePressureBar) / 1.5))
  );
  factors.push({
    factor: 'Corridor Access & Environmental Runoff',
    score: cascadeScore,
    maxScore: 10,
    weight: 0.1,
    rationale: `Cascade risk rises with ${incident.waterQualityMetrics.turbidityNtu.toFixed(1)} NTU contamination and a ${Math.max(0, 4.2 - incident.waterQualityMetrics.pipelinePressureBar).toFixed(1)} bar pressure loss.`
  });

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalScore >= 85) riskLevel = 'CRITICAL';
  else if (totalScore >= 70) riskLevel = 'HIGH';
  else if (totalScore >= 40) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';

  const evidencePoints = [
    {
      domain: 'Water Quality Telemetry',
      finding: `Turbidity: ${incident.waterQualityMetrics.turbidityNtu} NTU (Standard < 1.0) | Pressure: ${incident.waterQualityMetrics.pipelinePressureBar} bar (Standard 4.2)`,
      metric: 'SCADA Optical Sensor W-41',
      actionJustification: 'Mandates immediate sector valve isolation to quarantine contaminated trunk volume.'
    },
    {
      domain: 'Clinical & Bio-Surveillance',
      finding: 'Lilavati Hospital & Bhabha Hospital at 88% ICU occupancy; +42% gastro outpatient surge.',
      metric: 'City Health Electronic Health Record Feed',
      actionJustification: 'Requires immediate emergency priority corridor for water tankers and medical buffer supply.'
    },
    {
      domain: 'Civic Signal Correlation',
      finding: `${incident.citizenComplaints} geotagged tickets reporting tap water discoloration and chemical odor.`,
      metric: 'AURIS Citizen NLP Cluster',
      actionJustification: 'Justifies immediate citywide push alert (Boil Water Advisory) to avert mass illness.'
    },
    {
      domain: 'Transit & Emergency Routing',
      finding: 'Emergency response delay increased +18 min due to localized surface flooding and lane closure.',
      metric: 'Adaptive Traffic Grid Sensor #SV-08',
      actionJustification: 'Preempts 8 connected traffic signals to clear 90-second green wave for emergency relief.'
    }
  ];

  return {
    riskScore: totalScore,
    riskLevel,
    factors,
    summary: `Risk calculated at ${totalScore}/100 (${riskLevel}) from ${incident.populationAffected.toLocaleString()} exposed residents, ${incident.citizenComplaints} verified civic signals, ${incident.waterQualityMetrics.turbidityNtu.toFixed(1)} NTU turbidity, and ${incident.waterQualityMetrics.pipelinePressureBar.toFixed(1)} bar mains pressure.`,
    evidencePoints
  };
};

// ----------------------------------------------------------------------------
// 3. DEPARTMENT ACTIONS GENERATOR
// ----------------------------------------------------------------------------

export const generateDepartmentActions = (
  incident: StructuredWaterIncident,
  risk: IncidentRiskEvaluation
): CoordinatedDepartmentAction[] => {
  const tankerFleetSize = Math.min(25, Math.max(4, Math.ceil(incident.populationAffected / 8000)));
  const alertPriority = risk.riskScore >= 85 ? 'P1 - Immediate' : risk.riskScore >= 70 ? 'P2 - High' : 'P3 - Moderate';
  const responseMultiplier = risk.riskScore >= 85 ? 0.45 : risk.riskScore >= 70 ? 0.7 : risk.riskScore >= 40 ? 1 : 1.35;
  const deadline = (baselineMinutes: number) => `${Math.max(5, Math.round((baselineMinutes * responseMultiplier) / 5) * 5)} Minutes`;
  const actionStatus = risk.riskScore >= 85 ? 'In Progress' : risk.riskScore >= 70 ? 'Dispatched' : 'Pending Authorization';

  return [
    {
      id: 'ACT-W01',
      department: 'Water & Drainage Department',
      priority: alertPriority,
      actionTitle: 'Isolate Sector Valves V-104A & V-104B',
      actionDetails: 'Trigger remote SCADA actuation to isolate 450mm contaminated main and avoid sub-base infiltration.',
      targetEntity: 'Ward 7 Distribution Sub-network',
      deadline: deadline(15),
      status: actionStatus
    },
    {
      id: 'ACT-W02',
      department: 'Water & Drainage Department',
      priority: alertPriority,
      actionTitle: `Deploy ${tankerFleetSize} Emergency Tankers & UV Units`,
      actionDetails: `Dispatch ${tankerFleetSize} municipal clean water tankers from Pali Hill Reservoir to designated relief points for ${incident.populationAffected.toLocaleString()} residents.`,
      targetEntity: 'Sector 4 Residential & Commercial Grid',
      deadline: deadline(45),
      status: actionStatus
    },
    {
      id: 'ACT-H01',
      department: 'Public Health Department',
      priority: alertPriority,
      actionTitle: 'Activate Hospital Epidemic Triage Protocol',
      actionDetails: 'Alert Lilavati and Bhabha hospitals; supply 2,500 IV hydration units and switch to backup water tanks.',
      targetEntity: 'Lilavati, Bhabha & Holy Family Hospitals',
      deadline: deadline(30),
      status: actionStatus
    },
    {
      id: 'ACT-M01',
      department: 'Traffic & Mobility Department',
      priority: alertPriority,
      actionTitle: 'Engage Emergency Green Wave Corridor #E-04',
      actionDetails: 'Override signal timings on SV Road to Lilavati Trauma bay; reroute buses #14 and #88.',
      targetEntity: 'SV Road & Hill Road Intersection Mesh',
      deadline: deadline(20),
      status: actionStatus
    },
    {
      id: 'ACT-C01',
      department: 'Citizen & Civic Engagement',
      priority: alertPriority,
      actionTitle: 'Broadcast Multi-Channel "Boil Water Advisory"',
      actionDetails: `Send geo-targeted SMS, WhatsApp, and AURIS citizen app push alerts to ${incident.populationAffected.toLocaleString()} residents.`,
      targetEntity: 'Ward 7 Registered Citizens',
      deadline: deadline(10),
      status: actionStatus
    },
    {
      id: 'ACT-E01',
      department: 'Environment & Climate Department',
      priority: alertPriority,
      actionTitle: 'Deploy Mahim Creek Containment Booms',
      actionDetails: 'Place absorbent booms at outfall 7 to prevent toxic leachate entering coastal marine sanctuary.',
      targetEntity: 'Mahim Creek Storm Outfall 7',
      deadline: deadline(60),
      status: actionStatus
    }
  ];
};

// ----------------------------------------------------------------------------
// 4. PIPELINE TIMELINE GENERATOR
// ----------------------------------------------------------------------------

export const generateIncidentTimeline = (
  incident: StructuredWaterIncident,
  risk: IncidentRiskEvaluation
): IncidentTimelineEvent[] => {
  const baseTime = new Date(incident.timestamp).getTime();

  return [
    {
      id: 'TL-01',
      phase: 'Detected',
      timeOffset: 'T+00m',
      timestamp: new Date(baseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Telemetry Anomaly Detected',
      description: `Optical turbidity sensor W-41 flagged ${incident.waterQualityMetrics.turbidityNtu.toFixed(1)} NTU and pressure dropped to ${incident.waterQualityMetrics.pipelinePressureBar.toFixed(1)} bar.`,
      actor: 'Water & Hydrology Agent',
      department: 'Water & Drainage',
      status: 'complete'
    },
    {
      id: 'TL-02',
      phase: 'Correlated',
      timeOffset: 'T+05m',
      timestamp: new Date(baseTime + 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Signals & Complaints Correlated',
      description: `Citizen Agent cross-referenced ${incident.citizenComplaints} civic odor/color tickets with SCADA physical pipe coordinates.`,
      actor: 'Citizen Intelligence Agent',
      department: 'Citizen Affairs',
      status: 'complete'
    },
    {
      id: 'TL-03',
      phase: 'Analyzed',
      timeOffset: 'T+12m',
      timestamp: new Date(baseTime + 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Multi-Agent Cross-Domain Simulation',
      description: 'Water, Health, Mobility, Citizen, and Environment agents processed cascade repercussions in parallel.',
      actor: '5 Specialized Domain Agents',
      department: 'Multi-Agency Neural Engine',
      status: 'complete'
    },
    {
      id: 'TL-04',
      phase: 'Risk Calculated',
      timeOffset: 'T+18m',
      timestamp: new Date(baseTime + 18 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Multi-Factor Risk Assessed: ${risk.riskLevel} (${risk.riskScore}/100)`,
      description: `Evaluated ${incident.populationAffected.toLocaleString()} affected residents, 3 trauma centers, and live water-quality evidence.`,
      actor: 'AURIS Risk Engine',
      department: 'City Executive Command',
      status: 'complete'
    },
    {
      id: 'TL-05',
      phase: 'Response Generated',
      timeOffset: 'T+25m',
      timestamp: new Date(baseTime + 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Coordinated Municipal Directive Formulated',
      description: 'Response Agent synthesized 6-point inter-departmental action plan with prioritized work orders.',
      actor: 'Response / Decision Agent',
      department: 'Executive Decision Center',
      status: 'complete'
    },
    {
      id: 'TL-06',
      phase: 'Actions Dispatched',
      timeOffset: 'T+30m',
      timestamp: new Date(baseTime + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Department Actions & Green Waves Active',
      description: 'Valve isolation underway, hospital triage active, Green Wave #E-04 engaged, and citizen SMS dispatched.',
      actor: 'Joint Operations Command',
      department: 'Water / Health / Mobility / Environment',
      status: 'active'
    }
  ];
};

// ----------------------------------------------------------------------------
// 5. DEFAULT WATER CONTAMINATION INCIDENT FACTORY
// ----------------------------------------------------------------------------

export const createWaterContaminationIncident = (
  city: string = 'Mumbai',
  country: string = 'India'
): StructuredWaterIncident => {
  // Mumbai Bandra West / Sector 4 coordinates
  const lat = 19.0558;
  const lng = 72.8335;

  return {
    id: `INC-WATER-${Date.now().toString().slice(-4)}`,
    type: 'Water Contamination & Toxic Backflow',
    location: 'Bandra West, Ward 7 (Sector 4 Main Distribution Trunk)',
    ward: 'Ward 7 (H-West)',
    city,
    country,
    latitude: lat,
    longitude: lng,
    severity: 'Critical',
    populationAffected: 145000,
    nearbyHospitals: [
      {
        name: 'Lilavati Hospital & Research Centre',
        distanceKm: 1.1,
        bedOccupancyRate: 88,
        icuCapacityAvailable: 4
      },
      {
        name: 'Bhabha Municipal General Hospital',
        distanceKm: 1.6,
        bedOccupancyRate: 92,
        icuCapacityAvailable: 2
      },
      {
        name: 'Holy Family Multispeciality Hospital',
        distanceKm: 2.2,
        bedOccupancyRate: 79,
        icuCapacityAvailable: 7
      }
    ],
    citizenComplaints: 38,
    roadAccessibility: 'Severely Impaired (-65% Carriageway capacity on Hill Road)',
    environmentalRisk: 'High (Leaching into unlined roadside swales & Mahim Creek outfall)',
    timestamp: new Date().toISOString(),
    status: 'In Progress',
    department: 'Water & Drainage',
    waterQualityMetrics: {
      turbidityNtu: 14.2,
      phLevel: 5.8,
      freeChlorineMgL: 0.02,
      coliformDetected: true,
      pipelinePressureBar: 1.1
    }
  };
};

export const executeFullIncidentPipeline = (
  structuredIncident: StructuredWaterIncident
): FullIncidentExecutionResult => {
  const waterAgent = runWaterAgent(structuredIncident);
  const citizenAgent = runCitizenAgent(structuredIncident);
  const healthAgent = runHealthAgent(structuredIncident, waterAgent);
  const mobilityAgent = runMobilityAgent(structuredIncident, waterAgent, healthAgent);
  const environmentAgent = runEnvironmentAgent(structuredIncident, waterAgent);

  const responseAgent = runResponseAgent(structuredIncident, {
    water: waterAgent,
    citizen: citizenAgent,
    health: healthAgent,
    mobility: mobilityAgent,
    environment: environmentAgent
  });

  const riskEvaluation = calculateTransparentRisk(structuredIncident);
  const departmentActions = generateDepartmentActions(structuredIncident, riskEvaluation);
  const timeline = generateIncidentTimeline(structuredIncident, riskEvaluation);

  const baseIncident: Incident = {
    id: structuredIncident.id,
    title: `${structuredIncident.type} - ${structuredIncident.ward}`,
    category: 'Water',
    description: `Critical water quality anomaly detected in ${structuredIncident.ward}. Turbidity: ${structuredIncident.waterQualityMetrics.turbidityNtu} NTU, Pressure: ${structuredIncident.waterQualityMetrics.pipelinePressureBar} bar. Multi-agent response active.`,
    latitude: structuredIncident.latitude,
    longitude: structuredIncident.longitude,
    country: structuredIncident.country,
    city: structuredIncident.city,
    ward: structuredIncident.ward,
    severity: structuredIncident.severity,
    status: structuredIncident.status,
    department: structuredIncident.department,
    source: 'IoT Sensor',
    reportedAt: 'Just now',
    affectedPopulation: structuredIncident.populationAffected,
    aiConfidence: 0.98,
    recommendedAction: 'Isolate Sector Valves V-104A/B, engage Green Wave #E-04, broadcast Boil Water Advisory.',
    aiAnalysis: responseAgent.findings.join('\n'),
    relatedReportsCount: structuredIncident.citizenComplaints,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    assignedTeam: 'Multi-Agency Rapid Taskforce'
  };

  return {
    incident: structuredIncident,
    baseIncident,
    agentOutputs: {
      waterAgent,
      citizenAgent,
      healthAgent,
      mobilityAgent,
      environmentAgent,
      responseAgent
    },
    riskEvaluation,
    departmentActions,
    timeline
  };
};
