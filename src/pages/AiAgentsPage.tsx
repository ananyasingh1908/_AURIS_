import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { AgentInfo } from '../types';
import { SimulateIncidentModal } from '../components/SimulateIncidentModal';
import { IncidentPipelineTimeline } from '../components/IncidentPipelineTimeline';
import {
  Cpu,
  Droplets,
  Navigation,
  Zap,
  Wind,
  Trash2,
  Construction,
  HeartPulse,
  Flame,
  MessageSquareText,
  Leaf,
  Coins,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ShieldAlert,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiAgentsPage: React.FC = () => {
  const {
    agents,
    simulateModalOpen,
    setSimulateModalOpen,
    simulatedPipelineResult,
    currentCity,
    currentCountry
  } = useAuris() as any;

  const [activeScenario, setActiveScenario] = useState<'water' | 'storm' | 'grid' | 'air'>('water');
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(agents[0]);

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-sky-600" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Navigation': return <Navigation className="w-5 h-5 text-indigo-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-600" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-emerald-600" />;
      case 'Construction': return <Construction className="w-5 h-5 text-orange-500" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-red-500" />;
      case 'MessageSquareText': return <MessageSquareText className="w-5 h-5 text-violet-600" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Coins': return <Coins className="w-5 h-5 text-cyan-600" />;
      default: return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  const scenarios = {
    water: {
      title: 'Water Contamination & Cascading Municipal Impact',
      trigger: 'SCADA Optical Sensor W-41 logged 14.2 NTU turbidity spike; pressure dropped to 1.1 bar.',
      steps: [
        {
          agent: 'Water Agent',
          status: 'Pipeline Isolation',
          action: 'Detected 3.1 bar pressure drop and turbidity surge; recommends isolating valves V-104A/B and rerouting Pali Hill bypass.'
        },
        {
          agent: 'Citizen Agent',
          status: 'Signal Clustering',
          action: 'Aggregated 38 verified complaint tickets reporting chemical odor/discoloration; triggers geo-targeted Boil Water Advisory.'
        },
        {
          agent: 'Health Agent',
          status: 'Bio-Surveillance',
          action: 'Identified 3 downstream hospitals (Lilavati, Bhabha, Holy Family) at 88% bed load; supplies 2,500 IV hydration units.'
        },
        {
          agent: 'Mobility Agent',
          status: 'Green Corridor',
          action: 'Engages Emergency Green Wave #E-04 to prioritize 18 water relief tankers and ambulances to Lilavati Trauma Bay.'
        },
        {
          agent: 'Environment Agent',
          status: 'Creek Protection',
          action: 'Deploys floating absorbent containment booms at Mahim Creek outfall 7 to prevent coastal marine leachate.'
        },
        {
          agent: 'Response / Decision Agent',
          status: 'Executive Synthesis',
          action: 'Formulates 6-point synchronized municipal directive with instant department work order dispatch.'
        }
      ]
    },
    storm: {
      title: 'Monsoon Storm & Urban Inundation Cascade',
      trigger: 'Doppler Radar detected 65mm/hr sustained downpour over Ward 7.',
      steps: [
        {
          agent: 'Water Agent',
          status: 'Drainage Alert',
          action: 'Detected catch-basin intake saturation & 3.4 bar backpressure in feeder node LN-04.'
        },
        {
          agent: 'Mobility Agent',
          status: 'Transit Rerouting',
          action: 'Calculated 42% road surface delay on Hill Road arterial; diverts bus route #14.'
        },
        {
          agent: 'Infrastructure Agent',
          status: 'Gate Actuation',
          action: 'Signals automated high-velocity de-silting jetters and opens secondary sluice gate 7B.'
        },
        {
          agent: 'Emergency Agent',
          status: 'Pre-Deployment',
          action: 'Stages mobile high-capacity dewatering pumps in low-lying canal basin.'
        },
        {
          agent: 'City Intelligence Agent',
          status: 'Coordinated Dispatch',
          action: 'Synthesizes cross-department order #AURIS-882 to synchronize drainage, traffic wave, and citizen SMS.'
        }
      ]
    },
    grid: {
      title: 'Substation 4B Thermal Spike & Heatwave Surge',
      trigger: 'Ambient city temperature exceeded 38.5°C; HVAC peak load surge +35%.',
      steps: [
        {
          agent: 'Energy Agent',
          status: 'Thermal Alert',
          action: 'Detected transformer oil temperature at 98°C. Dispatches 1.2 MWh battery buffer.'
        },
        {
          agent: 'Public Health Agent',
          status: 'Heat Advisory',
          action: 'Issues hydration advisory for high-density subway platforms and sets up mobile cooling centers.'
        },
        {
          agent: 'Sustainability Agent',
          status: 'Microgrid Balance',
          action: 'Ramps up commercial solar rooftop feed-in to offset 18 MW peak grid demand.'
        },
        {
          agent: 'City Intelligence Agent',
          status: 'Load Shaving Directive',
          action: 'Triggers voluntary industrial curtailment and protects residential substations.'
        }
      ]
    },
    air: {
      title: 'Atmospheric Inversion & Industrial AQI Surge',
      trigger: 'Calm winds combined with PM2.5 spike to 285 µg/m³ in Mitte industrial sector.',
      steps: [
        {
          agent: 'Environment Agent',
          status: 'Air Exceedance',
          action: 'Optical scattering sensors detect particulate concentration exceeding safe limits.'
        },
        {
          agent: 'Mobility Agent',
          status: 'Low Emission Zone',
          action: 'Enforces automated dynamic congestion toll for heavy diesel commercial vehicles in Zone 3.'
        },
        {
          agent: 'Carbon Agent',
          status: 'Audit Flag',
          action: 'Audits industrial boiler telemetry and issues excess carbon penalty warning.'
        },
        {
          agent: 'City Intelligence Agent',
          status: 'Clean Air Protocol',
          action: 'Broadcasts air filtration alert and throttles industrial thermal operations by 25%.'
        }
      ]
    }
  };

  const currentScenario = scenarios[activeScenario];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Multi-Agent City Intelligence Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Autonomous specialized neural agents synthesizing telemetry into unified civic action
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md shadow-blue-500/20 text-xs font-bold transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Water Incident</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-subtle text-xs font-semibold text-slate-700">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>6/6 Core Agents Operational</span>
          </div>
        </div>
      </div>

      {/* Cross-Department Propagation Chain Showcase */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-sky-400 block">Multi-Agent Propagation Architecture</span>
            <h3 className="text-base font-bold text-white">ONE CITY EVENT → MULTIPLE IMPACTS → COORDINATED RESPONSE</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
            {(['water', 'storm', 'grid', 'air'] as const).map((scKey) => (
              <button
                key={scKey}
                onClick={() => setActiveScenario(scKey)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeScenario === scKey
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {scKey}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-400 shrink-0" />
          <span><strong className="text-white">Trigger Telemetry:</strong> {currentScenario.trigger}</span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentScenario.steps.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400">{step.agent}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {step.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Agents Grid List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">Specialized Domain Neural Agents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent: AgentInfo) => {
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400 shadow-md'
                    : 'bg-white hover:bg-slate-50/60 border-slate-200/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                        {getAgentIcon(agent.iconName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{agent.type}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {agent.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium truncate max-w-[150px]">{agent.lastAction}</span>
                  <span className="text-blue-600 font-bold">{agent.activeAlertsCount} Alerts Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Processing Pipeline Timeline View */}
      <div className="mt-6">
        <IncidentPipelineTimeline
          timelineEvents={simulatedPipelineResult?.timeline || []}
          incidentTitle={simulatedPipelineResult ? `${simulatedPipelineResult.incident.type} - ${simulatedPipelineResult.incident.ward}` : undefined}
          isSimulated={true}
        />
      </div>

      {/* Simulate Modal */}
      <SimulateIncidentModal
        isOpen={simulateModalOpen}
        onClose={() => setSimulateModalOpen(false)}
      />

    </div>
  );
};
