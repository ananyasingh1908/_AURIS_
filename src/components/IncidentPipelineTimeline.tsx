import React, { useState } from 'react';
import { IncidentTimelineEvent } from '../services/incidentEngine';
import {
  CheckCircle2,
  Clock,
  Radio,
  Cpu,
  Droplets,
  MessageSquareText,
  Activity,
  Navigation,
  Leaf,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IncidentPipelineTimelineProps {
  timelineEvents: IncidentTimelineEvent[];
  incidentTitle?: string;
  isSimulated?: boolean;
}

export const IncidentPipelineTimeline: React.FC<IncidentPipelineTimelineProps> = ({
  timelineEvents,
  incidentTitle = 'Water Contamination & Toxic Backflow Incident',
  isSimulated = true
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'Detected':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Correlated':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Analyzed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Risk Calculated':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Response Generated':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Actions Dispatched':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getActorIcon = (actor: string) => {
    if (actor.includes('Water')) return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
    if (actor.includes('Citizen')) return <MessageSquareText className="w-3.5 h-3.5 text-violet-600" />;
    if (actor.includes('Health')) return <Activity className="w-3.5 h-3.5 text-rose-600" />;
    if (actor.includes('Mobility')) return <Navigation className="w-3.5 h-3.5 text-indigo-600" />;
    if (actor.includes('Environment')) return <Leaf className="w-3.5 h-3.5 text-emerald-600" />;
    return <Cpu className="w-3.5 h-3.5 text-sky-600" />;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
              Incident Processing Pipeline Timeline
            </h3>
            {isSimulated && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                System Event
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {incidentTitle} — Autonomous multi-agent synthesis & operational execution
          </p>
        </div>

        <div className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
          6/6 Pipeline Stages Active
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timelineEvents.map((evt, idx) => {
          const isExpanded = expandedEventId === evt.id;
          const isLast = idx === timelineEvents.length - 1;

          return (
            <div key={evt.id} className="relative group">
              {/* Dot marker */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  evt.status === 'complete'
                    ? 'border-emerald-500 text-emerald-600 shadow-sm'
                    : evt.status === 'active'
                    ? 'border-sky-500 text-sky-600 animate-pulse shadow-md shadow-sky-500/20'
                    : 'border-slate-300 text-slate-400'
                }`}
              >
                {evt.status === 'complete' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                )}
              </div>

              {/* Event Content Box */}
              <div
                onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-slate-50/90 border-slate-300 shadow-sm'
                    : 'bg-white hover:bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">{evt.timeOffset}</span>
                      <span className="text-xs text-slate-400">• {evt.timestamp}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPhaseBadge(evt.phase)}`}>
                        {evt.phase}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {getActorIcon(evt.actor)}
                      <span>{evt.title}</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                      {evt.department}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {evt.description}
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-1 font-mono"
                    >
                      <div className="flex justify-between">
                        <span className="text-slate-400">Executing Agent / System:</span>
                        <span className="font-bold text-slate-800">{evt.actor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Responsible Department:</span>
                        <span className="font-bold text-slate-800">{evt.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Execution Status:</span>
                        <span className="font-bold text-emerald-600 uppercase">{evt.status}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
