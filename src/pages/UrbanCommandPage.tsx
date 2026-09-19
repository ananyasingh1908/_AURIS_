import React, { useState, useMemo } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import { IncidentDetailPanel } from '../components/IncidentDetailPanel';
import { SimulateIncidentModal } from '../components/SimulateIncidentModal';
import { IncidentPipelineTimeline } from '../components/IncidentPipelineTimeline';
import { Incident, IncidentCategory, IncidentSeverity } from '../types';
import {
  Filter,
  Search,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
  Flame,
  Droplets,
  Activity,
  CheckCircle2,
  Building2,
  Users,
  Play,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UrbanCommandPage: React.FC = () => {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    mapFlyTo,
    flyToLocation,
    currentCity,
    currentCountry,
    simulateModalOpen,
    setSimulateModalOpen,
    simulatedPipelineResult
  } = useAuris() as any;

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Water',
    'Mobility',
    'Waste',
    'Environment',
    'Energy',
    'Infrastructure',
    'Health',
    'Flooding',
    'Public Safety',
    'Citizen Report',
    'AI Predicted Risk'
  ];

  const severities = ['All', 'Critical', 'Warning', 'Normal', 'Resolved'];

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      if (categoryFilter !== 'All' && inc.category !== categoryFilter) return false;
      if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inc.title.toLowerCase().includes(q) ||
          inc.city.toLowerCase().includes(q) ||
          inc.country.toLowerCase().includes(q) ||
          inc.department.toLowerCase().includes(q) ||
          (inc.ward && inc.ward.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [incidents, categoryFilter, severityFilter, statusFilter, searchQuery]);

  const criticalCount = useMemo(() => incidents.filter((i: Incident) => i.severity === 'Critical' && i.status !== 'Resolved').length, [incidents]);
  const inProgressCount = useMemo(() => incidents.filter((i: Incident) => i.status === 'In Progress').length, [incidents]);
  const resolvedCount = useMemo(() => incidents.filter((i: Incident) => i.status === 'Resolved').length, [incidents]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Urban Intelligence & Command Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              📍 {currentCity || 'Mumbai'}, {currentCountry || 'India'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-agent geospatial problem intelligence and cross-department response orchestration
          </p>
        </div>

        {/* Global Overview Stat Bar & Simulate Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Main "Simulate Incident" Button */}
          <button
            onClick={() => setSimulateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md shadow-blue-500/20 text-xs font-bold transition-all hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Incident</span>
          </button>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-subtle">
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
              <span className="text-sm font-bold text-slate-900">{incidents.length}</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-red-500 block">Critical</span>
              <span className="text-sm font-bold text-red-600">{criticalCount}</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-500 block">In Progress</span>
              <span className="text-sm font-bold text-blue-600">{inProgressCount}</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <div className="px-3 py-1 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Resolved</span>
              <span className="text-sm font-bold text-emerald-600">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Severity & Search Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter city or issue..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:bg-white"
            />
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            {severities.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Severities' : s}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {(categoryFilter !== 'All' || severityFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setSeverityFilter('All');
                setSearchQuery('');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Map & Incident Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Geospatial Map Canvas */}
        <div className={`${selectedIncident ? 'lg:col-span-7' : 'lg:col-span-12'} min-w-0 transition-all duration-300`}>
          <GeospatialMap
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            center={[22.9734, 78.6569]}
            zoom={5}
            height={selectedIncident ? 'clamp(400px, 70vh, 640px)' : 'clamp(400px, 70vh, 620px)'}
            flyToCoords={mapFlyTo}
            highlightCategory={categoryFilter !== 'All' ? categoryFilter : null}
          />
        </div>

        {/* Right Side: Incident Detail Panel */}
        {selectedIncident && (
          <div className="lg:col-span-5 min-w-0">
            <IncidentDetailPanel
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
            />
          </div>
        )}

      </div>

      {/* Incident Processing Pipeline Timeline Section */}
      <div className="mt-8">
        <IncidentPipelineTimeline
          timelineEvents={simulatedPipelineResult?.timeline || []}
          incidentTitle={simulatedPipelineResult ? `${simulatedPipelineResult.incident.type} - ${simulatedPipelineResult.incident.ward}` : undefined}
          isSimulated={true}
        />
      </div>

      {/* Simulate Incident Modal */}
      <SimulateIncidentModal
        isOpen={simulateModalOpen}
        onClose={() => setSimulateModalOpen(false)}
      />

    </div>
  );
};
