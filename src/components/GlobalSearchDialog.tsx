import React, { useState, useEffect, useRef } from 'react';
import { useAuris } from '../store/AurisContext';
import {
  Search,
  X,
  MapPin,
  AlertCircle,
  FileText,
  Coins,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalSearchDialog: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    incidents,
    complaints,
    carbonProjects,
    setSelectedIncident,
    setSelectedComplaint,
    setSelectedProject,
    setActiveTab,
    flyToLocation
  } = useAuris();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedIncidents = q
    ? incidents.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.country.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    )
    : incidents.slice(0, 3);

  const matchedComplaints = q
    ? complaints.filter(
      c =>
        c.issue.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
    : complaints.slice(0, 2);

  const matchedProjects = q
    ? carbonProjects.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q)
    )
    : carbonProjects.slice(0, 2);

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-floating border border-slate-200 overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city problems, tickets, carbon projects, departments..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 bg-white rounded-lg border border-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">

          {/* Incidents Section */}
          {matchedIncidents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Urban Command Incidents</span>
              </div>
              <div className="space-y-1.5">
                {matchedIncidents.map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => {
                      setSelectedIncident(incident);
                      setActiveTab('urban-command');
                      flyToLocation(incident.latitude, incident.longitude, 14);
                      setSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-2xl hover:bg-sky-50 text-left flex items-center justify-between group transition-colors border border-transparent hover:border-sky-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{incident.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${incident.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {incident.city}, {incident.country} • {incident.department}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Complaints */}
          {matchedComplaints.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>Citizen Intelligence Tickets</span>
              </div>
              <div className="space-y-1.5">
                {matchedComplaints.map((complaint) => (
                  <button
                    key={complaint.id}
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setActiveTab('citizen');
                      setSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-50 text-left flex items-center justify-between group transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-600">#{complaint.id}</span>
                        <span className="text-xs font-bold text-slate-900">{complaint.issue}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {complaint.location} • Status: <span className="font-semibold">{complaint.status}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Carbon Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                <span>Carbon Exchange Projects</span>
              </div>
              <div className="space-y-1.5">
                {matchedProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('carbon');
                      setSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-2xl hover:bg-emerald-50/60 text-left flex items-center justify-between group transition-colors border border-transparent hover:border-emerald-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{project.name}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full">
                          ${project.pricePerCredit}/t
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {project.country} • {project.developer}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Search across 200+ connected cities and global carbon registries</span>
          <span className="font-medium text-slate-600">AURIS Search Engine</span>
        </div>
      </motion.div>
    </div>
  );
};
