import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import { UrbanCausalGraph } from '../components/UrbanCausalGraph';
import { InterventionPlanner } from '../components/InterventionPlanner';
import { SafeImage } from '../components/SafeImage';

import {
  ArrowRight,
  Play,
  Globe2,
  Building2,
  Users,
  Coins,
  ShieldCheck,
  Sparkles,
  MapPin,
  TrendingUp,
  Cpu,
  Droplets,
  Layers,
  Leaf,
  GitBranch,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OverviewPage: React.FC = () => {
  const {
    setActiveTab,
    incidents,
    carbonProjects,
    setSelectedIncident,
    setSelectedProject,
    flyToLocation,
    setAiDrawerOpen
  } = useAuris();

  const [activeHeroIntelligenceTab, setActiveHeroIntelligenceTab] = useState<'causal' | 'intervention'>('causal');

  const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-12 pb-16">

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Hero Left Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Intelligent Cities. A Healthier Planet.</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              AURIS <br />
              <span className="text-slate-800 font-medium">Sees Cities Differently.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              A global AI-powered platform connecting people, cities and climate action through real-time intelligence, multi-agent coordination, and verified carbon impact.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('urban-command')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-200 shadow-premium hover:shadow-floating flex items-center gap-2 group"
              >
                <span>Explore Live Map</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setAiDrawerOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all duration-200 flex items-center gap-2 shadow-subtle"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Talk to AURIS</span>
              </button>
            </div>
          </motion.div>

          {/* Hero Right: Live Interactive Map Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 min-w-0 space-y-4"
          >
            {/* This KPI belongs to the page flow rather than the map surface. */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-premium max-w-full">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Global at a glance
              </span>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-sm font-bold text-slate-900">{activeIncidentsCount}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Active issues</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-sm font-bold text-slate-900">{inProgressCount}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">In Progress</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-bold text-slate-900">{resolvedCount}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Resolved</span>
                </div>
              </div>
            </div>

            {/* Geospatial Map */}
            <GeospatialMap
              incidents={incidents}
              carbonProjects={carbonProjects}
              height="clamp(360px, 58vh, 460px)"
              center={[20, 10]}
              zoom={2}
              onSelectIncident={(inc) => {
                setSelectedIncident(inc);
                setActiveTab('urban-command');
              }}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                setActiveTab('carbon');
              }}
            />
          </motion.div>

        </div>
      </section>

      {/* Primary Section Header */}
      <div className="pt-8 border-t border-slate-200/80">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            A Unified Intelligence Layer <br />
            <span className="text-slate-500 font-normal">for People, Cities and the Planet.</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            AURIS integrates urban management, citizen participation and climate action — powered by multi-agent AI and real-time geospatial intelligence.
          </p>
        </div>
      </div>

      {/* 3 Primary Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Urban Command */}
        <div
          onClick={() => setActiveTab('urban-command')}
          className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-floating transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              Urban Command
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              3D city maps. Real-time issues. Department coordination. From insight to action.
            </p>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden h-36 relative bg-slate-100 border border-slate-100">
            <SafeImage
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80"
              alt="Urban Command 3D"
              fallbackType="city"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
              <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                Live Incident Telemetry
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Citizen Intelligence */}
        <div
          onClick={() => setActiveTab('citizen')}
          className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-floating transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Citizen Intelligence
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Report. Track. Resolve. A smarter, more connected and transparent citizen experience.
            </p>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden h-36 relative bg-slate-100 border border-slate-100">
            <SafeImage
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80"
              alt="Citizen Intelligence"
              fallbackType="city"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
              <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                AI-Driven Civic Action
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Carbon Exchange */}
        <div
          onClick={() => setActiveTab('carbon')}
          className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-floating transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Carbon Exchange
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              A global marketplace for real climate impact. Buy. Sell. Verify. Retire. Track.
            </p>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden h-36 relative bg-slate-100 border border-slate-100">
            <SafeImage
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80"
              alt="Carbon Exchange"
              fallbackType="carbon"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
              <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                Verified Bio-Offsets
              </span>
            </div>
          </div>
        </div>


      </div>

      {/* Signature AURIS Features: Urban Causal Graph & AI Intervention Engine */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-floating">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Signature Core Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Understanding + Intervening in City Problems
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              From passive telemetry to causal chain reactions and deterministic multi-department intervention modeling.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveHeroIntelligenceTab('causal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeHeroIntelligenceTab === 'causal'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Urban Causal Graph</span>
            </button>

            <button
              onClick={() => setActiveHeroIntelligenceTab('intervention')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeHeroIntelligenceTab === 'intervention'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>AI Intervention Planner</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-slate-900">
          {activeHeroIntelligenceTab === 'causal' ? (
            <UrbanCausalGraph compact={false} />
          ) : (
            <InterventionPlanner problemId="INC-8492" />
          )}
        </div>
      </section>

      {/* Global Impact Metrics Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        <div>
          <span className="font-display text-2xl font-extrabold text-slate-900">200+</span>
          <p className="text-xs text-slate-500 mt-0.5">Cities Connected</p>
        </div>
        <div>
          <span className="font-display text-2xl font-extrabold text-slate-900">12</span>
          <p className="text-xs text-slate-500 mt-0.5">Departments Unified</p>
        </div>
        <div>
          <span className="font-display text-2xl font-extrabold text-slate-900">5M+</span>
          <p className="text-xs text-slate-500 mt-0.5">Citizen Reports</p>
        </div>
        <div>
          <span className="font-display text-2xl font-extrabold text-slate-900">150+</span>
          <p className="text-xs text-slate-500 mt-0.5">Carbon Projects</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl font-extrabold text-emerald-600">50M+ t</span>
          <p className="text-xs text-slate-500 mt-0.5">CO₂ Tracked & Offset</p>
        </div>
      </div>

    </div>
  );
};
