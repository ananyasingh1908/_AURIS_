import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { CausalNode, UrbanCausalScenario } from '../types';
import {
  GitBranch,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  X,
  Play,
  Layers,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UrbanCausalGraphProps {
  scenario?: UrbanCausalScenario | null;
  onSelectNode?: (node: CausalNode) => void;
  compact?: boolean;
}

export const UrbanCausalGraph: React.FC<UrbanCausalGraphProps> = ({
  scenario,
  onSelectNode,
  compact = false
}) => {
  const {
    activeCausalScenario,
    setActiveCausalScenario,
    causalScenarios,
    selectedCausalNode,
    setSelectedCausalNode,
    flyToLocation,
    setActiveTab,
    setSelectedIncident,
    incidents
  } = useAuris();

  const active = scenario || activeCausalScenario || causalScenarios['storm-cascade'];
  const [inspectNode, setInspectNode] = useState<CausalNode | null>(null);

  const handleNodeClick = (node: CausalNode) => {
    setInspectNode(node);
    setSelectedCausalNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const handleFlyToNode = (node: CausalNode) => {
    if (node.latitude && node.longitude) {
      flyToLocation(node.latitude, node.longitude, 14);
      setActiveTab('urban-command');
      const matchInc = incidents.find(i => i.department.toLowerCase().includes(node.department.toLowerCase()));
      if (matchInc) setSelectedIncident(matchInc);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-4 h-4 text-sky-600" />
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              AURIS Causal Intelligence Chain
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{active.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Root trigger: <strong className="text-slate-700">{active.rootEvent}</strong>
          </p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
          {Object.keys(causalScenarios).map(key => {
            const sc = causalScenarios[key];
            const isSel = active.id === sc.id;
            return (
              <button
                key={key}
                onClick={() => setActiveCausalScenario(sc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSel ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sc.id === 'storm-cascade' ? 'Storm & Flood' : 'Pipe Rupture'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Interactive Chain Diagram */}
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 min-w-[700px]">
          {active.nodes.map((node, idx) => {
            const isSelected = inspectNode?.id === node.id;
            const edge = active.edges.find(e => e.from === node.id);

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNodeClick(node)}
                  className={`flex-1 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-200 shadow-premium'
                      : node.severity === 'Critical'
                      ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        STEP 0{idx + 1}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          node.severity === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {node.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{node.label}</h4>
                    
                    <span className="text-[10px] font-semibold text-slate-500 block mt-1.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      {node.department}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-700">{node.status}</span>
                    <span className="text-sky-600 font-bold hover:underline">Inspect →</span>
                  </div>
                </motion.div>

                {/* Arrow Connector between nodes */}
                {idx < active.nodes.length - 1 && (
                  <div className="hidden lg:flex flex-col items-center justify-center px-1 text-slate-400 shrink-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">
                      {edge?.label || 'Triggers'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-sky-600" />
                  </div>
                )}
                {idx < active.nodes.length - 1 && (
                  <div className="lg:hidden flex items-center justify-center py-1 text-slate-400">
                    <ArrowDown className="w-4 h-4 text-sky-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Node Detail Drawer / Inspection View */}
      <AnimatePresence>
        {inspectNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-sky-950">{inspectNode.label}</span>
                  <span className="text-xs font-semibold text-sky-700 bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                    {inspectNode.department}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {inspectNode.description}
                </p>
                <p className="text-xs text-amber-900 font-semibold mt-1">
                  Recommended Action: "{inspectNode.recommendedIntervention}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inspectNode.latitude && inspectNode.longitude && (
                  <button
                    onClick={() => handleFlyToNode(inspectNode)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Fly to Location on Map</span>
                  </button>
                )}
                <button
                  onClick={() => setInspectNode(null)}
                  className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-700 border border-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
