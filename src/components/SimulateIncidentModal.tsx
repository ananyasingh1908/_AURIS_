import React, { useMemo, useState } from 'react';
import {
  StructuredWaterIncident,
  FullIncidentExecutionResult,
  createWaterContaminationIncident,
  executeFullIncidentPipeline
} from '../services/incidentEngine';
import { useAuris } from '../store/AurisContext';
import {
  X,
  Droplets,
  Activity,
  Navigation,
  MessageSquareText,
  Leaf,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Building2,
  Users,
  MapPin,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SimulateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateComplete?: (result: FullIncidentExecutionResult) => void;
}

export const SimulateIncidentModal: React.FC<SimulateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSimulateComplete
}) => {
  const { currentCity, currentCountry, addSimulatedIncident, flyToLocation, setActiveTab } = useAuris() as any;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(-1);

  // Simulation form inputs
  const [population, setPopulation] = useState<number>(145000);
  const [complaintsCount, setComplaintsCount] = useState<number>(38);
  const [turbidity, setTurbidity] = useState<number>(14.2);
  const [pressure, setPressure] = useState<number>(1.1);

  // Rebuild the full deterministic scenario whenever an operator changes telemetry.
  // The review cards and dispatched incident therefore always represent the visible inputs.
  const pipelineResult = useMemo<FullIncidentExecutionResult>(() => {
    const incidentData: StructuredWaterIncident = {
      ...createWaterContaminationIncident(currentCity || 'Mumbai', currentCountry || 'India'),
      populationAffected: population,
      citizenComplaints: complaintsCount,
      waterQualityMetrics: {
        turbidityNtu: turbidity,
        phLevel: 5.8,
        freeChlorineMgL: 0.02,
        coliformDetected: true,
        pipelinePressureBar: pressure
      }
    };

    return executeFullIncidentPipeline(incidentData);
  }, [population, complaintsCount, turbidity, pressure, currentCity, currentCountry]);

  if (!isOpen) return null;

  const agentSteps = [
    { key: 'water', name: 'Water Agent', icon: Droplets, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { key: 'citizen', name: 'Citizen Agent', icon: MessageSquareText, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { key: 'health', name: 'Health Agent', icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { key: 'mobility', name: 'Mobility Agent', icon: Navigation, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { key: 'environment', name: 'Environment Agent', icon: Leaf, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'response', name: 'Response Agent', icon: Cpu, color: 'text-amber-600 bg-amber-50 border-amber-200' }
  ];

  const handleRunSimulation = async () => {
    setIsRunningPipeline(true);
    setActiveAgentIndex(0);

    // Animate through each agent sequentially
    for (let i = 0; i < agentSteps.length; i++) {
      setActiveAgentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    setIsRunningPipeline(false);
    setActiveStep(1); // Move to review & dispatch step
  };

  const handleDispatchIncident = () => {
    if (addSimulatedIncident) {
      addSimulatedIncident(pipelineResult);
    }

    if (flyToLocation) {
      flyToLocation(pipelineResult.incident.latitude, pipelineResult.incident.longitude, 15);
    }

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    if (onSimulateComplete) {
      onSimulateComplete(pipelineResult);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Simulate Water Contamination Incident</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  End-to-End Multi-Agent Flow
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trigger structured municipal telemetry into cross-department agent intelligence and response.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Top Multi-Agent Propagation Chain */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between">
              <span>Cross-Department Intelligence Propagation</span>
              <span className="text-sky-400 font-mono text-[10px]">ONE EVENT → MULTIPLE IMPACTS → COORDINATED RESPONSE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 relative z-10">
              {agentSteps.map((step, idx) => {
                const isCurrent = activeAgentIndex === idx;
                const isPassed = activeAgentIndex > idx || activeStep === 1;
                const Icon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`p-3 rounded-xl border transition-all duration-300 ${isCurrent
                        ? 'bg-sky-500/20 border-sky-400 scale-105 shadow-lg shadow-sky-500/20'
                        : isPassed
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-800/30 border-slate-800 text-slate-500'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-bold truncate">{step.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {idx === 0 && `${turbidity.toFixed(1)} NTU`}
                      {idx === 1 && `${complaintsCount} Signals`}
                      {idx === 2 && `${Math.round(population * 0.18).toLocaleString()} vulnerable`}
                      {idx === 3 && 'Green Corridor'}
                      {idx === 4 && 'Soil & Creek'}
                      {idx === 5 && 'Action Plan'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Scenario Parameters */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Incident Parameters & Telemetry Inputs</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Location: Bandra West Ward 7, {currentCity || 'Mumbai'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Population Affected: <span className="font-bold text-slate-900">{population.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={population}
                  onChange={(e) => setPopulation(Number(e.target.value))}
                  disabled={isRunningPipeline}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Citizen Complaints: <span className="font-bold text-slate-900">{complaintsCount} tickets</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={complaintsCount}
                  onChange={(e) => setComplaintsCount(Number(e.target.value))}
                  disabled={isRunningPipeline}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Turbidity (NTU): <span className="font-bold text-red-600">{turbidity.toFixed(1)} NTU</span> (Max &lt;1.0)
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={turbidity}
                  onChange={(e) => setTurbidity(Number(e.target.value))}
                  disabled={isRunningPipeline}
                  className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mains Pressure: <span className="font-bold text-amber-600">{pressure.toFixed(1)} bar</span> (Std 4.2)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4.5"
                  step="0.1"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                  disabled={isRunningPipeline}
                  className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Risk Score & Evidence Section */}
          {pipelineResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Risk Gauge Card */}
              <div className="bg-white p-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">Calculated Multi-Factor Risk</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                    {pipelineResult.riskEvaluation.riskLevel}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-red-600 font-display">
                    {pipelineResult.riskEvaluation.riskScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-500"
                    style={{ width: `${pipelineResult.riskEvaluation.riskScore}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pipelineResult.riskEvaluation.summary}
                </p>

                {/* Score Breakdown List */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  {pipelineResult.riskEvaluation.factors.map((f) => (
                    <div key={f.factor} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{f.factor}</span>
                      <span className="font-bold text-slate-800">+{f.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Behind Actions (Col 2 & 3) */}
              <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Evidence Behind Recommendations</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Cross-Agent Telemetry Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pipelineResult.riskEvaluation.evidencePoints.map((ep, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>{ep.domain}</span>
                        <span className="text-blue-600 font-mono">{ep.metric}</span>
                      </div>
                      <p className="font-medium text-slate-800 text-[11px] mb-1">{ep.finding}</p>
                      <p className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-1 font-mono">
                        ↳ Action: {ep.actionJustification}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coordinated Action Directives */}
                <div className="mt-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Generated Coordinated Department Directives:
                  </span>
                  <div className="space-y-1.5">
                    {pipelineResult.departmentActions.slice(0, 3).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-700">{act.department}</span>
                          <span className="text-slate-600 truncate max-w-[280px]">{act.actionTitle}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {act.deadline}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Deterministic Urban Simulation Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isRunningPipeline}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-all ${isRunningPipeline ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isRunningPipeline ? 'Running Agents...' : 'Re-Run Multi-Agent Simulation'}
            </button>

            <button
              onClick={handleDispatchIncident}
              disabled={isRunningPipeline}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <span>Dispatch Coordinated Response</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
