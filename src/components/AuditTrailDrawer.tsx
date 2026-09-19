import React from 'react';
import { useAuris } from '../store/AurisContext';
import {
  FileText,
  X,
  ShieldCheck,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  Building2,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuditTrailDrawer: React.FC = () => {
  const { auditLogs, auditDrawerOpen, setAuditDrawerOpen } = useAuris();

  if (!auditDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="w-full max-w-md sm:max-w-xl bg-white h-full shadow-floating border-l border-slate-200 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">AURIS Governance & Audit Trail</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Immutable
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Every operational intervention, trade & state mutation recorded</p>
            </div>
          </div>
          <button
            onClick={() => setAuditDrawerOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-12">No audit entries yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-sky-700">{log.id}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{log.action}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>Actor: <strong className="text-slate-800">{log.actor}</strong></span>
                    <span>•</span>
                    <span>Dept: <strong className="text-slate-800">{log.department}</strong></span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Entity:</span>
                    <span className="font-semibold text-slate-800">{log.entity}</span>
                  </div>
                  {log.previousState && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Previous State:</span>
                      <span className="text-amber-700 font-medium">{log.previousState}</span>
                    </div>
                  )}
                  {log.newState && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">New State:</span>
                      <span className="text-emerald-700 font-bold">{log.newState}</span>
                    </div>
                  )}
                </div>

                {log.impactSummary && (
                  <p className="text-[11px] text-slate-600 italic bg-sky-50/50 p-2 rounded-lg border border-sky-100/60">
                    "{log.impactSummary}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center text-[10px] text-slate-400">
          Cryptographically hashed municipal ledger • Compliance Verified
        </div>
      </motion.div>
    </div>
  );
};
