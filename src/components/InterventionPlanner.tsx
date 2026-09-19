import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { InterventionOption, ProblemInterventionPlan } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Layers,
  Leaf,
  Activity,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterventionPlannerProps {
  problemId?: string;
  onInterventionApplied?: () => void;
}

export const InterventionPlanner: React.FC<InterventionPlannerProps> = ({
  problemId = 'INC-8492',
  onInterventionApplied
}) => {
  const { interventionPlans, applyIntervention } = useAuris();
  const plan = interventionPlans[problemId] || interventionPlans['INC-8492'];

  const [selectedInterventionId, setSelectedInterventionId] = useState<string>(
    plan.interventions[plan.interventions.length - 1]?.id || 'int-5'
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedPreview, setSimulatedPreview] = useState<InterventionOption | null>(
    plan.interventions[plan.interventions.length - 1] || null
  );

  const activeIntervention = plan.interventions.find(i => i.id === selectedInterventionId) || plan.interventions[0];
  const isAlreadyApplied = plan.appliedInterventionId === activeIntervention?.id;

  const handleSimulate = (opt: InterventionOption) => {
    setSelectedInterventionId(opt.id);
    setIsSimulating(true);
    setTimeout(() => {
      setSimulatedPreview(opt);
      setIsSimulating(false);
    }, 350);
  };

  const handleExecute = () => {
    if (!activeIntervention) return;
    applyIntervention(plan.problemId, activeIntervention.id);
    if (onInterventionApplied) onInterventionApplied();
  };

  const currentScore = plan.currentRiskScore;
  const postScore = plan.postInterventionRiskScore || (activeIntervention ? Math.max(10, Math.round(currentScore * (1 - activeIntervention.riskReductionPct / 100))) : currentScore);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              AURIS AI Intervention Planner
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{plan.problemTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare tactical, infrastructure, and policy interventions with predictive multi-system impact modeling
          </p>
        </div>

        {/* Current Risk Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Baseline Risk</span>
            <span className="text-base font-black text-red-600">{currentScore} / 100</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Projected Risk</span>
            <span className="text-base font-black text-emerald-600">{postScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Interventions Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.interventions.map((opt) => {
          const isSelected = selectedInterventionId === opt.id;
          const isApplied = plan.appliedInterventionId === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => handleSimulate(opt)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-400 shadow-premium scale-[1.01]'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    opt.type === 'combined'
                      ? 'bg-purple-100 text-purple-700'
                      : opt.type === 'infrastructure'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {opt.type}
                  </span>
                  
                  {isApplied ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600">
                      -{opt.riskReductionPct}% Risk
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 leading-snug">{opt.title}</h4>
                <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Est. Cost</span>
                  <span className="font-bold text-slate-800">{opt.costEstimate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Deployment</span>
                  <span className="font-bold text-slate-800">{opt.implementationTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Intervention In-Depth Simulation Preview Card */}
      {activeIntervention && (
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cross-Domain Impact Projection
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeIntervention.title}</h4>
            </div>

            <button
              onClick={handleExecute}
              disabled={isAlreadyApplied}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                isAlreadyApplied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isAlreadyApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Intervention Active & Operating</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Execute Intervention Package</span>
                </>
              )}
            </button>
          </div>

          {/* Impact Metrics Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Risk Abatement</span>
              <p className="text-base font-black text-emerald-600 mt-0.5">-{activeIntervention.riskReductionPct}%</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Population Protected</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{activeIntervention.populationProtected.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Budget Required</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{activeIntervention.costEstimate}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Time to Implement</span>
              <p className="text-base font-black text-sky-700 mt-0.5">{activeIntervention.implementationTime}</p>
            </div>
          </div>

          {/* Secondary Co-benefits */}
          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Cross-Department Co-Benefits:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeIntervention.secondaryBenefits.map((b, idx) => (
                <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 shadow-subtle flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
