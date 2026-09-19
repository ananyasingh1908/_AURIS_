import React, { useEffect, useState } from 'react';
import { Incident, IncidentStatus } from '../types';
import { useAuris } from '../store/AurisContext';
import {
  X,
  MapPin,
  Users,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  PhoneCall,
  Flame,
  FileText,
  GitBranch,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UrbanCausalGraph } from './UrbanCausalGraph';
import { InterventionPlanner } from './InterventionPlanner';
import { FALLBACK_IMAGES, SafeImage } from './SafeImage';
import { fetchNearbyHospitals, NearbyHospital } from '../services/hospitalService';
import { calculateEnvironmentalImpact } from '../services/environmentalImpactService';


interface IncidentDetailPanelProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailPanel: React.FC<IncidentDetailPanelProps> = ({
  incident,
  onClose
}) => {
  const { updateIncidentStatus, userProfile } = useAuris();
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('Rapid Response Team #1');
  const [showRelatedReportsModal, setShowRelatedReportsModal] = useState(false);
  const [showCausalModal, setShowCausalModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showNearbyHospitals, setShowNearbyHospitals] = useState(true);
  const [nearbyHospitalsData, setNearbyHospitalsData] = useState<NearbyHospital[]>([]);
  const [nearbyHospitalsLoading, setNearbyHospitalsLoading] = useState(false);
  const [nearbyHospitalsError, setNearbyHospitalsError] = useState<string | null>(null);

  const toggleNearbyHospitals = () => {
    setShowNearbyHospitals((prev) => !prev);
  };

  if (!incident) return null;

  useEffect(() => {
    let isMounted = true;

    const loadNearbyHospitals = async () => {
      setNearbyHospitalsLoading(true);
      setNearbyHospitalsError(null);
      setNearbyHospitalsData([]);

      try {
        const hospitals = await fetchNearbyHospitals(incident.latitude, incident.longitude, 5000);
        if (isMounted) {
          setNearbyHospitalsData(hospitals);
        }
      } catch (error) {
        if (isMounted) {
          setNearbyHospitalsError('Unable to fetch hospitals right now.');
        }
      } finally {
        if (isMounted) {
          setNearbyHospitalsLoading(false);
        }
      }
    };

    loadNearbyHospitals();

    return () => {
      isMounted = false;
    };
  }, [incident.id, incident.latitude, incident.longitude]);

  const handleStatusChange = (status: IncidentStatus, team?: string) => {
    updateIncidentStatus(incident.id, status, team);
  };

  const getIncidentFallbackImage = (category: string) => {
    const categoryMap: Record<string, string> = {
      Water: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=900&auto=format&fit=crop&q=80',
      Flooding: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&auto=format&fit=crop&q=80',
      Mobility: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop&q=80',
      Infrastructure: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=900&auto=format&fit=crop&q=80',
      Waste: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=900&auto=format&fit=crop&q=80',
      Environment: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=900&auto=format&fit=crop&q=80',
      Energy: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900&auto=format&fit=crop&q=80',
      Health: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&auto=format&fit=crop&q=80',
      'Public Safety': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&auto=format&fit=crop&q=80',
      'Citizen Report': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&auto=format&fit=crop&q=80',
      'AI Predicted Risk': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=900&auto=format&fit=crop&q=80',
      'Climate / Carbon': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&auto=format&fit=crop&q=80'
    };

    return categoryMap[category] || FALLBACK_IMAGES.incident;
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Assigned':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AI Verified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const nearbyHospitals = incident.nearbyHospitals ?? [
    { name: 'Primary Care Hospital', distanceKm: 1.2, bedOccupancyRate: 82, icuCapacityAvailable: 5 },
    { name: 'Regional Medical Center', distanceKm: 2.3, bedOccupancyRate: 76, icuCapacityAvailable: 8 },
    { name: 'Emergency Trauma Centre', distanceKm: 3.1, bedOccupancyRate: 71, icuCapacityAvailable: 6 }
  ];

  const environmentalImpact = incident.environmentalImpact ?? {
    airQualityIndex: 168,
    waterRisk: 'High contamination risk to downstream water channels',
    emissionsReduction: 'Potential 18% cut in emergency transport emissions through bypass routing',
    biodiversityRisk: 'Moderate habitat stress near drainage channels',
    exposureRisk: 'Elevated risk for vulnerable residents and high-footfall corridors',
    publicHealthImpact: 'Strong need for rapid response and preventive public alerts'
  };
  const impactMetrics = calculateEnvironmentalImpact(incident);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full lg:w-[460px] bg-white rounded-3xl border border-slate-200/90 shadow-floating p-6 overflow-y-auto max-h-[88vh] flex flex-col justify-between"
      >
        <div>
          {/* Header & Close */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-400">#{incident.id}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getSeverityBadgeClass(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">{incident.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Incident Image Preview */}
          {incident.image || incident.category ? (
            <div className="mt-4 relative rounded-2xl overflow-hidden h-44 bg-slate-100 border border-slate-100">
              <SafeImage
                src={incident.image || getIncidentFallbackImage(incident.category)}
                alt={incident.title}
                fallbackType="incident"
                customFallback={getIncidentFallbackImage(incident.category)}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">

                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{incident.source === 'Citizen' ? 'Citizen report' : incident.source === 'AI Prediction' ? 'AI prediction' : 'Sensor & Citizen Telemetry'}</span>
              </div>
            </div>
          ) : null}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</span>
              <p className="text-xs font-medium text-slate-800 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{incident.ward ? `${incident.ward}, ` : ''}{incident.city}, {incident.country}</span>
              </p>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Department</span>
              <p className="text-xs font-medium text-slate-800 mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{incident.department}</span>
              </p>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Citizen Reports</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {incident.relatedReportsCount} <span className="text-xs font-normal text-slate-500">verified</span>
              </p>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Affected Population</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{incident.affectedPopulation.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Risk Level & Contributing Factors Badge */}
          {incident.riskScore && (
            <div className="mt-4 p-3.5 rounded-2xl border border-red-200 bg-red-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>Calculated Risk: {incident.riskLevel || 'CRITICAL'}</span>
                </span>
                <span className="text-xs font-extrabold text-red-700 bg-white px-2.5 py-0.5 rounded-lg border border-red-200">
                  {incident.riskScore}/100
                </span>
              </div>
              {incident.evidenceSummary && (
                <p className="text-[11px] text-red-900/80 leading-relaxed font-mono">
                  {incident.evidenceSummary}
                </p>
              )}
            </div>
          )}

          {/* AI Confidence & Analysis Box */}
          <div className="mt-4 bg-sky-50/60 rounded-2xl p-4 border border-sky-100/90">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-sky-900">AURIS Multi-Agent Intelligence</span>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                {Math.round(incident.aiConfidence > 1 ? incident.aiConfidence : incident.aiConfidence * 100)}% Confidence
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {incident.aiAnalysis || incident.description}
            </p>
          </div>

          {/* Floating operational insights */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Environmental impact</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-white rounded-full px-2 py-0.5 border border-emerald-200">
                  {environmentalImpact.airQualityIndex ?? 160} AQI
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {impactMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-emerald-100 bg-white/60 px-2.5 py-2">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700/80">{metric.label}</p>
                        <p className="mt-1 text-base font-bold text-emerald-900">{metric.value}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {metric.unit}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-emerald-900/80">{metric.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-3">
              <button
                type="button"
                onClick={toggleNearbyHospitals}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Nearby hospitals</span>
                <span className="text-[10px] font-semibold text-sky-700 bg-white/80 px-2 py-1 rounded-full border border-sky-200">
                  {showNearbyHospitals ? 'Hide' : 'Load'}
                </span>
              </button>

              {showNearbyHospitals && (
                <div className="mt-2 space-y-2">
                  {nearbyHospitalsLoading && (
                    <div className="rounded-xl bg-white/80 px-2.5 py-2 border border-sky-100 text-[10px] font-medium text-slate-600">
                      Loading nearby hospitals...
                    </div>
                  )}

                  {!nearbyHospitalsLoading && nearbyHospitalsError && (
                    <div className="rounded-xl bg-white/80 px-2.5 py-2 border border-red-100 text-[10px] font-medium text-red-600">
                      {nearbyHospitalsError}
                    </div>
                  )}

                  {!nearbyHospitalsLoading && !nearbyHospitalsError && nearbyHospitalsData.length === 0 && (
                    <div className="rounded-xl bg-white/80 px-2.5 py-2 border border-sky-100 text-[10px] font-medium text-slate-600">
                      No hospitals found within 5km
                    </div>
                  )}

                  {!nearbyHospitalsLoading && nearbyHospitalsData.length > 0 && (
                    nearbyHospitalsData.map((hospital) => (
                      <div key={`${hospital.name}-${hospital.lat}-${hospital.lng}`} className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-2.5 py-1.5 border border-sky-100">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-800">{hospital.name}</p>
                          <p className="text-[10px] text-slate-500">{hospital.distanceKm.toFixed(1)} km away</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                          {hospital.distanceKm < 1 ? '<1km' : `${hospital.distanceKm.toFixed(1)}km`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Action & Evidence */}
          <div className="mt-3 bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Recommended Action & Evidence:</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              "{incident.recommendedAction}"
            </p>
          </div>

          {/* Assigned Team Info if any */}
          {incident.assignedTeam && (
            <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Current Dispatch:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {incident.assignedTeam}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="grid grid-cols-3 gap-2">
            {/* Assign Button */}
            <div className="relative">
              <button
                onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${incident.status === 'Assigned'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <span>Assign</span>
              </button>

              {assignDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-52 bg-white rounded-2xl p-2 border border-slate-200 shadow-floating z-50">
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase">Select Team:</span>
                  {['Ward Rapid Hydro Unit #4', 'Field Maintenance Alpha', 'Emergency Dispatch Bravo', 'Special Ops Paving'].map(team => (
                    <button
                      key={team}
                      onClick={() => {
                        handleStatusChange('Assigned', team);
                        setAssignDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-medium transition-colors"
                    >
                      {team}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mark In Progress */}
            <button
              onClick={() => handleStatusChange('In Progress')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${incident.status === 'In Progress'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
            >
              In Progress
            </button>

            {/* Resolve */}
            <button
              onClick={() => handleStatusChange('Resolved')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${incident.status === 'Resolved'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          </div>

          {/* Urban Causal Chain & AI Intervention Planner Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowCausalModal(true)}
              className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold transition-all border border-sky-200 flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <GitBranch className="w-3.5 h-3.5 text-sky-600" />
              <span>Causal Chain</span>
            </button>

            <button
              onClick={() => setShowInterventionModal(true)}
              className="py-2.5 px-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-200" />
              <span>Intervene (AI)</span>
            </button>
          </div>

          {/* View Related Reports Button */}
          <button
            onClick={() => setShowRelatedReportsModal(true)}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>View Related Citizen Reports ({incident.relatedReportsCount})</span>
          </button>
        </div>
      </motion.div>

      {/* Urban Causal Chain Modal */}
      <AnimatePresence>
        {showCausalModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-floating border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Urban Causal Ripple Analysis: #{incident.id}
                    </h4>
                    <p className="text-xs text-slate-500">Live multi-agent cascade and cascading secondary impacts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCausalModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <UrbanCausalGraph compact={false} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCausalModal(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Intervention Planner Modal */}
      <AnimatePresence>
        {showInterventionModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-floating border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      AI Intervention Decision Engine: #{incident.id}
                    </h4>
                    <p className="text-xs text-slate-500">Simulate, compare and dispatch multi-department interventions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInterventionModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <InterventionPlanner
                problemId={incident.id}
                onInterventionApplied={() => {
                  setTimeout(() => setShowInterventionModal(false), 800);
                }}
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowInterventionModal(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Reports Modal */}
      <AnimatePresence>
        {showRelatedReportsModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-floating border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-900">
                  Related Reports for #{incident.id}
                </h4>
                <button
                  onClick={() => setShowRelatedReportsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                {[
                  {
                    user: 'Ramesh K.',
                    time: '35m ago',
                    note: 'Water has flooded the entrance of the commercial plaza. Drain is overflowing.'
                  },
                  {
                    user: 'Pooja M.',
                    time: '1h ago',
                    note: 'Severe water pressure dropped in building B. Muddy water bubbling up from pavement.'
                  },
                  {
                    user: 'IoT Sensor Node-49',
                    time: '1h 15m ago',
                    note: 'Acoustic resonance threshold exceeded (94 dB) on 450mm feeder main.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">{item.user}</span>
                      <span className="text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowRelatedReportsModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
