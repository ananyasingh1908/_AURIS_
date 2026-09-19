import React, { useEffect, useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import { IncidentDetailPanel } from '../components/IncidentDetailPanel';
import { UrbanCausalGraph } from '../components/UrbanCausalGraph';
import { InterventionPlanner } from '../components/InterventionPlanner';
import { SafeImage } from '../components/SafeImage';
import { Incident, RoleId, IncidentStatus } from '../types';

import { USER_ROLES } from '../data/mockData';
import {
  Building2,
  Droplets,
  Navigation,
  Trash2,
  Wind,
  Construction,
  Zap,
  HeartPulse,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  Sliders,
  Play,
  Layers,
  FileText,
  Activity,
  GitBranch
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export const DepartmentDashboardPage: React.FC = () => {
  const {
    currentRole,
    setRole,
    incidents,
    selectedIncident,
    setSelectedIncident,
    updateIncidentStatus,
    flyToLocation,
    // Advanced intelligence states & actions
    dmas,
    executeWaterRepair,
    intersections,
    optimizeIntersectionSignal,
    emergencyCorridors,
    activatePriorityCorridor,
    smartBins,
    wasteRoute,
    applyOptimizedWasteRoute,
    complaintClusters,
    operationalizeCluster,
    predictiveAssets,
    createAssetWorkOrder,
    repairAsset,
    coordinatedWorks,
    scheduleCoordinatedWindow,
    energyFlexibility,
    executeEnergyFlexibility,
    heatZones,
    implementCoolingIntervention
  } = useAuris();

  const [selectedDeptRole, setSelectedDeptRole] = useState<RoleId>(() => {
    return currentRole.endsWith('_DEPT') ? currentRole : 'WATER_DEPT';
  });

  useEffect(() => {
    if (currentRole.endsWith('_DEPT')) {
      setSelectedDeptRole(currentRole);
      return;
    }

    if (currentRole === 'CITY_ADMIN' || currentRole === 'ALL_ADMIN') {
      setSelectedDeptRole('WATER_DEPT');
    }
  }, [currentRole]);

  const [deptSubTab, setDeptSubTab] = useState<'overview' | 'intelligence' | 'work-orders'>('overview');

  const departmentRoles: { role: RoleId; label: string; icon: any; categoryMatch: string }[] = [
    { role: 'WATER_DEPT', label: 'Water & Drainage', icon: Droplets, categoryMatch: 'Water' },
    { role: 'MOBILITY_DEPT', label: 'Traffic & Mobility', icon: Navigation, categoryMatch: 'Mobility' },
    { role: 'WASTE_DEPT', label: 'Waste Management', icon: Trash2, categoryMatch: 'Waste' },
    { role: 'ENVIRONMENT_DEPT', label: 'Environment & AQI', icon: Wind, categoryMatch: 'Environment' },
    { role: 'INFRASTRUCTURE_DEPT', label: 'Infrastructure & Roads', icon: Construction, categoryMatch: 'Infrastructure' },
    { role: 'ENERGY_DEPT', label: 'Energy & Smart Grid', icon: Zap, categoryMatch: 'Energy' },
    { role: 'HEALTH_DEPT', label: 'Public Health', icon: HeartPulse, categoryMatch: 'Health' },
    { role: 'EMERGENCY_DEPT', label: 'Emergency Services', icon: Flame, categoryMatch: 'Emergency' }
  ];

  const currentDeptMeta = departmentRoles.find(d => d.role === selectedDeptRole) || departmentRoles[0];
  const deptProfile = USER_ROLES[selectedDeptRole];

  const deptIncidents = incidents.filter(i =>
    i.category.toLowerCase().includes(currentDeptMeta.categoryMatch.toLowerCase()) ||
    i.department.toLowerCase().includes(currentDeptMeta.label.toLowerCase())
  );

  const getIncidentImage = (incident: Incident) => {
    const categoryFallbacks: Record<string, string> = {
      Water: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      Flooding: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&auto=format&fit=crop&q=80',
      Mobility: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&auto=format&fit=crop&q=80',
      Infrastructure: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      Waste: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      Environment: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
      Energy: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
      Health: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&auto=format&fit=crop&q=80',
      'Public Safety': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
      'Citizen Report': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
      'AI Predicted Risk': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      'Climate / Carbon': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80'
    };

    return incident.image || categoryFallbacks[incident.category] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80';
  };

  const criticalDeptCount = deptIncidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const inProgressDeptCount = deptIncidents.filter(i => i.status === 'In Progress').length;
  const resolvedDeptCount = deptIncidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Department Selector Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-subtle">
        {departmentRoles.map(dept => {
          const Icon = dept.icon;
          const isActive = selectedDeptRole === dept.role;
          return (
            <button
              key={dept.role}
              onClick={() => {
                setSelectedDeptRole(dept.role);
                setRole(dept.role);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{dept.label}</span>
            </button>
          );
        })}
      </div>

      {/* Header Info Banner & Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SafeImage
            src={deptProfile.avatar}
            alt={deptProfile.name}
            fallbackType="avatar"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm shrink-0"
          />
          <div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                {deptProfile.roleBadge}
              </span>
              <span className="text-xs text-slate-400">Head: {deptProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
              {deptProfile.departmentName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{deptProfile.description}</p>
          </div>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setDeptSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deptSubTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            GIS & Work Orders
          </button>
          <button
            onClick={() => setDeptSubTab('intelligence')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              deptSubTab === 'intelligence' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Operational Solutions</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: GIS Map & Department Work Orders */}
      {deptSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 min-w-0 space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-bold text-slate-900">
                {currentDeptMeta.label} Geospatial Incidents
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {deptIncidents.length} active mapped
              </span>
            </div>

            <GeospatialMap
              incidents={deptIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                flyToLocation(inc.latitude, inc.longitude, 14);
              }}
              height="clamp(380px, 62vh, 520px)"
              center={deptIncidents[0] ? [deptIncidents[0].latitude, deptIncidents[0].longitude] : [20, 0]}
              zoom={deptIncidents[0] ? 5 : 2}
            />
          </div>

          <div className="lg:col-span-5 min-w-0">
            <AnimatePresence mode="wait">
              {selectedIncident ? (
                <IncidentDetailPanel
                  incident={selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                />
              ) : (
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-subtle space-y-3 max-h-[560px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Department Active Queue</span>
                    <span className="text-xs text-slate-400 font-semibold">{deptIncidents.length} Total</span>
                  </div>

                  <div className="space-y-2.5">
                    {deptIncidents.map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncident(inc);
                          flyToLocation(inc.latitude, inc.longitude, 14);
                        }}
                        className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-sky-50/60 hover:border-sky-200 cursor-pointer transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shrink-0">
                            <SafeImage
                              src={getIncidentImage(inc)}
                              alt={inc.title}
                              fallbackType="incident"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-slate-900 leading-snug">{inc.title}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                inc.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {inc.severity}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {inc.city}, {inc.country}
                              </span>
                              <span>{inc.reportedAt}</span>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700">Status: {inc.status}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateIncidentStatus(inc.id, 'Resolved');
                                }}
                                className="text-emerald-700 font-bold hover:text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200"
                              >
                                Resolve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Tailored Real-World Operational Solutions for Each Department */}
      {deptSubTab === 'intelligence' && (
        <div className="space-y-8">
          
          {/* 1. WATER DEPARTMENT: DMA Non-Revenue Water Loss Engine & Leak Repair */}
          {selectedDeptRole === 'WATER_DEPT' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                        Water Loss Recovery Engine
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">District Metered Area (DMA) Telemetry</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Non-Revenue Water (NRW) mass-balance calculation and acoustic leak localization
                    </p>
                  </div>

                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                    3 DMAs Monitored
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dmas.map(dma => (
                    <div
                      key={dma.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between ${
                        dma.status === 'Critical Leak Detected'
                          ? 'bg-red-50/40 border-red-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500">{dma.ward}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dma.status === 'Critical Leak Detected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {dma.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">{dma.name}</h4>

                        <div className="mt-4 space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200/60">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Inflow:</span>
                            <span className="font-bold text-slate-900">{dma.inflowMLPerDay} ML/day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Billed Demand:</span>
                            <span className="font-bold text-slate-900">{dma.billedConsumptionMLPerDay} ML/day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Unexplained Loss:</span>
                            <span className="font-black text-red-600">{dma.unexplainedLossMLPerDay} ML/day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pressure:</span>
                            <span className="font-bold text-slate-900">{dma.pressureBar} bar</span>
                          </div>
                        </div>

                        {dma.status === 'Critical Leak Detected' && (
                          <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                            <p className="font-semibold">Acoustic Triangulation:</p>
                            <p>{dma.probableCorridor}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60">
                        {dma.status === 'Critical Leak Detected' ? (
                          <button
                            onClick={() => executeWaterRepair(dma.id)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Repair & Recover 1.4 ML/day</span>
                          </button>
                        ) : (
                          <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Loss Stabilized & Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Flood Intervention Planner Integration */}
              <InterventionPlanner problemId="INC-8492" />
            </div>
          )}

          {/* 2. MOBILITY DEPARTMENT: Adaptive Intersections & Emergency Green Corridor */}
          {selectedDeptRole === 'MOBILITY_DEPT' && (
            <div className="space-y-6">
              
              {/* Adaptive Intersections */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Adaptive Intersection Simulator</h3>
                    <p className="text-xs text-slate-500">Coordinated signal green waves with network spillover calculation</p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
                    Network-Wide Optimization
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {intersections.map(int => (
                    <div key={int.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{int.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          int.status === 'AI Adaptive Wave Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {int.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/60">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Green Time</span>
                          <span className="font-bold text-slate-900">{int.currentGreenTimeSeconds}s</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Queue</span>
                          <span className="font-bold text-slate-900">{int.queueLengthMeters}m</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Speed</span>
                          <span className="font-bold text-emerald-700">{int.avgSpeedKmph} km/h</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        Spillover check on {int.spilloverImpact.neighborIntersection}: +{int.spilloverImpact.neighborDelayShiftPct}% offset.
                      </p>

                      <button
                        onClick={() => optimizeIntersectionSignal(int.id)}
                        disabled={int.status === 'AI Adaptive Wave Active'}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        {int.status === 'AI Adaptive Wave Active' ? 'Adaptive Wave Active' : 'Optimize Signal Timing (-28% Delay)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Green Corridor */}
              <div className="bg-red-50/40 rounded-3xl p-6 border border-red-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-red-200/60">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="font-bold text-base text-red-950">Emergency Priority Corridor Controller</h3>
                      <p className="text-xs text-red-800">Dynamic signal preemption for active trauma ambulances & fire engines</p>
                    </div>
                  </div>
                </div>

                {emergencyCorridors.map(corr => (
                  <div key={corr.id} className="bg-white p-4 rounded-2xl border border-red-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-red-700">{corr.vehicleType}</span>
                        <span>•</span>
                        <span className="text-slate-600">{corr.origin} → {corr.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-1">
                        <span>Current ETA: <strong className="text-red-600">{corr.currentEtaMinutes} mins</strong></span>
                        <span>Preempted Signals: <strong className="text-slate-900">{corr.controlledSignalsCount} intersections</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => activatePriorityCorridor(corr.id)}
                      disabled={corr.status === 'Active Green Wave'}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                    >
                      {corr.status === 'Active Green Wave' ? 'Green Wave Preempted (ETA: 9 min)' : 'Activate Priority Green Corridor (-9 min)'}
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. WASTE DEPARTMENT: Dynamic Truck Routing & Hotspots */}
          {selectedDeptRole === 'WASTE_DEPT' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Smart Waste Collection Routing Engine</h3>
                    <p className="text-xs text-slate-500">Telemetry-guided dynamic compactor route optimization</p>
                  </div>
                  <button
                    onClick={applyOptimizedWasteRoute}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Apply AI Dynamic Route
                  </button>
                </div>

                {/* Current Route vs AI Route Comparison */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Transit Distance</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">
                      {wasteRoute.status === 'AI Optimized Applied' ? `${wasteRoute.optimizedDistanceKm} km` : `${wasteRoute.baselineDistanceKm} km`}
                      <span className="text-[11px] font-normal text-emerald-600 ml-1">(-36%)</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Collection Time</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">
                      {wasteRoute.status === 'AI Optimized Applied' ? `${wasteRoute.optimizedTimeMin} min` : `${wasteRoute.baselineTimeMin} min`}
                      <span className="text-[11px] font-normal text-emerald-600 ml-1">(-37 min)</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">CO₂ Reduction</span>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">{wasteRoute.co2SavedKg} kg</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Bins Covered</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{wasteRoute.binsCovered} Smart Bins</p>
                  </div>
                </div>

                {/* Smart Bins Live Grid */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Smart Bin Sensors (Ultrasonic Fill & Odor Telemetry)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {smartBins.map(b => (
                      <div key={b.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{b.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.priority === 'Overflow Imminent' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {b.currentFillPct}% Fill
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{b.locationName}</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${b.currentFillPct > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${b.currentFillPct}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emerging Waste Hotspot from Citizen Clusters */}
              <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-amber-950">Emerging Waste Hotspot from Citizen Clusters</h4>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    38 Signals Merged
                  </span>
                </div>
                <p className="text-xs text-amber-900">
                  Multiple citizen photo uploads around Central Market food plaza have been clustered into single priority clean-up work order #WO-WASTE-992.
                </p>
              </div>
            </div>
          )}

          {/* 4. ENVIRONMENT: Pollution Source Attribution & Heat Exposure */}
          {selectedDeptRole === 'ENVIRONMENT_DEPT' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Source Attribution (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Air Quality Attribution Model</h3>
                      <p className="text-[11px] text-slate-400">Chemical speciation & atmospheric transport modeling</p>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                      PM2.5: 68 µg/m³
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Vehicular Traffic Exhaust', pct: 43, color: '#0284c7' },
                      { name: 'Industrial Thermal Boilers', pct: 29, color: '#f59e0b' },
                      { name: 'Construction Dust & Excavation', pct: 17, color: '#8b5cf6' },
                      { name: 'Background Atmospheric Dispersion', pct: 11, color: '#10b981' }
                    ].map(s => (
                      <div key={s.name} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>{s.name}</span>
                          <span>{s.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heat Exposure Zone (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Urban Heat Exposure Index</h3>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
                      Critical Zone
                    </span>
                  </div>

                  {heatZones.map(z => (
                    <div key={z.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{z.zoneName}</span>
                        <span className="text-red-600">{z.surfaceTempC}°C</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{z.suggestedAction}</p>

                      <button
                        onClick={() => implementCoolingIntervention(z.id)}
                        disabled={z.implementedCooling}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        {z.implementedCooling ? 'Cooling Misting Deployed (36.4°C)' : 'Deploy Misting & Cooling Hub (-4.8°C)'}
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* 5. INFRASTRUCTURE: Predictive Asset Maintenance & Urban Works Coordinator */}
          {selectedDeptRole === 'INFRASTRUCTURE_DEPT' && (
            <div className="space-y-6">
              
              {/* Urban Works Coordinator (Hero Feature) */}
              <div className="bg-sky-50/60 rounded-3xl p-6 border border-sky-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-200/70">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Construction className="w-4 h-4 text-sky-700" />
                      <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full uppercase">
                        Hero Feature: Urban Works Coordinator
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Excavation Conflict Harmonization</h3>
                    <p className="text-xs text-slate-600">
                      Detects overlapping permits across Water, Energy, Telecom & Roadways to prevent repeated excavations.
                    </p>
                  </div>

                  {coordinatedWorks[0]?.status === 'Conflict Detected' ? (
                    <button
                      onClick={() => scheduleCoordinatedWindow(coordinatedWorks[0].id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0"
                    >
                      Harmonize into 1 Shared Window
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Coordinated Window Scheduled
                    </span>
                  )}
                </div>

                {coordinatedWorks.map(cw => (
                  <div key={cw.id} className="bg-white p-4 rounded-2xl border border-sky-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{cw.roadSegment}</span>
                      <span className="font-mono text-emerald-700 font-bold">Saves ${cw.costSavingsUSD.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {cw.conflictingProjects.map(p => (
                        <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                          <span className="font-bold text-slate-800 block">{p.department}</span>
                          <p className="text-slate-500 mt-0.5">{p.title}</p>
                          <span className="text-slate-400 block mt-1">Duration: {p.excavationDays} days</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-medium text-emerald-800 flex justify-between">
                      <span>Impact: 24 independent excavation days → <strong>9 coordinated days</strong></span>
                      <span>Disruption Reduction: <strong>{cw.disruptionReductionPct}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Predictive Asset Risk Engine */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Predictive Asset Health & Preventive Maintenance</h3>
                    <p className="text-[11px] text-slate-400">Sensory vibration, age decay and environmental stress modeling</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictiveAssets.map(asset => (
                    <div key={asset.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{asset.assetCode} ({asset.assetType})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          asset.failureProbabilityNext30Days > 50 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {asset.failureProbabilityNext30Days}% Failure Risk
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{asset.recommendedWork}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <span className="text-slate-500">Status: {asset.workOrderStatus}</span>
                        {asset.workOrderStatus === 'None' ? (
                          <button
                            onClick={() => createAssetWorkOrder(asset.id)}
                            className="px-3 py-1 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                          >
                            Create Work Order
                          </button>
                        ) : asset.workOrderStatus === 'Work Order Created' ? (
                          <button
                            onClick={() => repairAsset(asset.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                          >
                            Complete & Verify
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Repaired
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 6. ENERGY DEPARTMENT: Peak Flexibility Shaving */}
          {selectedDeptRole === 'ENERGY_DEPT' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                        Energy Flexibility Engine
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Peak Demand Shaving Dispatch</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Forecast window: {energyFlexibility.peakWindow}
                    </p>
                  </div>

                  <button
                    onClick={executeEnergyFlexibility}
                    disabled={energyFlexibility.isExecuted}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    {energyFlexibility.isExecuted ? 'Flexibility Plan Dispatched (8.7 GW)' : 'Dispatch Flexibility Plan (-700 MW)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Unmitigated Peak</span>
                    <p className="text-sm font-black text-red-600 mt-0.5">{energyFlexibility.baselineDemandGW} GW</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Safe Grid Capacity</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{energyFlexibility.safeCapacityGW} GW</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Optimized Demand</span>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">{energyFlexibility.optimizedDemandGW} GW</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Cost & Carbon Avoided</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">${energyFlexibility.costAvoidedUSD.toLocaleString()} / 84t</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Dispatched Demand-Response Actions
                  </span>
                  {energyFlexibility.actions.map((act, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{act.name}</span>
                      <span className="font-bold text-amber-700">+{act.mwRelief} MW Relief</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. PUBLIC HEALTH & EMERGENCY */}
          {(selectedDeptRole === 'HEALTH_DEPT' || selectedDeptRole === 'EMERGENCY_DEPT') && (
            <div className="space-y-6">
              <UrbanCausalGraph />
              <InterventionPlanner problemId="INC-8492" />
            </div>
          )}

        </div>
      )}

    </div>
  );
};
