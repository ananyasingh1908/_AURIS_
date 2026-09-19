import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Sliders,
  RotateCcw,
  ArrowUpRight,
  Droplets,
  Navigation,
  Zap,
  Wind,
  Trash2,
  Construction,
  HeartPulse,
  Users,
  Leaf,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

export const CityHealthPage: React.FC = () => {
  const {
    cityHealthMetrics,
    selectedHealthCategory,
    setSelectedHealthCategory,
    overallCityHealth,
    incidents,
    setSelectedIncident,
    setActiveTab,
    flyToLocation,
    simulationParams,
    setSimulationParams,
    resetSimulation
  } = useAuris();

  const [activeView, setActiveView] = useState<'index' | 'simulation'>('index');

  // Computed What-If Projections based on slider inputs
  const floodRisk = Math.round(
    Math.max(5, Math.min(95, simulationParams.rainfall * 0.65 + simulationParams.pollution * 0.1))
  );
  const trafficDisruption = Math.round(
    Math.max(5, Math.min(95, simulationParams.traffic * 0.5 + simulationParams.rainfall * 0.2 + simulationParams.population * 0.3))
  );
  const emergencyDemand = Math.round(
    Math.max(5, Math.min(90, simulationParams.temperature * 4 + simulationParams.rainfall * 0.3 + simulationParams.traffic * 0.2))
  );
  const airQualityDrop = Math.round(
    Math.max(2, Math.min(85, simulationParams.pollution * 0.7 + simulationParams.temperature * 2 - simulationParams.rainfall * 0.2))
  );
  const gridStress = Math.round(
    Math.max(10, Math.min(98, simulationParams.energyDemand * 0.7 + simulationParams.temperature * 5))
  );

  // Time-series operational trend data for City Health Index
  const trendData = [
    { day: 'Mon', score: 76, water: 68, mobility: 70 },
    { day: 'Tue', score: 77, water: 67, mobility: 71 },
    { day: 'Wed', score: 75, water: 63, mobility: 69 },
    { day: 'Thu', score: 76, water: 64, mobility: 71 },
    { day: 'Fri', score: 77, water: 65, mobility: 72 },
    { day: 'Sat', score: 78, water: 65, mobility: 72 },
    { day: 'Today', score: overallCityHealth, water: 65, mobility: 72 }
  ];

  const simulationChartData = [
    { name: 'Flood Risk', baseline: 24, simulated: floodRisk },
    { name: 'Traffic Delay', baseline: 35, simulated: trafficDisruption },
    { name: 'Emergency Demand', baseline: 20, simulated: emergencyDemand },
    { name: 'AQI Degradation', baseline: 18, simulated: airQualityDrop },
    { name: 'Grid Stress', baseline: 42, simulated: gridStress }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mobility':
        return <Navigation className="w-4 h-4 text-sky-600" />;
      case 'Water':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'Energy':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Environment':
        return <Wind className="w-4 h-4 text-teal-600" />;
      case 'Waste':
        return <Trash2 className="w-4 h-4 text-emerald-600" />;
      case 'Infrastructure':
        return <Construction className="w-4 h-4 text-orange-500" />;
      case 'Public Health':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'Citizen Services':
        return <Users className="w-4 h-4 text-violet-500" />;
      case 'Sustainability':
        return <Leaf className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              City Health & Resilience Index
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Holistic cross-department diagnostic index and predictive What-If simulation engine
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-subtle">
          <button
            onClick={() => setActiveView('index')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'index'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            City Health Index
          </button>
          <button
            onClick={() => setActiveView('simulation')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'simulation'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Simulation</span>
          </button>
        </div>
      </div>

      {activeView === 'index' ? (
        <>
          {/* Top Score Banner & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Overall Score Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Overall City Health Score
                </span>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-display text-5xl font-black text-slate-900">
                    {overallCityHealth}
                  </span>
                  <span className="text-xl text-slate-400 font-normal">/ 100</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +1.2 pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Benchmark: <strong className="text-slate-700">Upper Quartile (Resilient)</strong> across global Tier-1 metros.
                </p>
              </div>

              {/* Sparkline chart */}
              <div className="h-24 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="lg:col-span-8 bg-sky-50/60 rounded-3xl p-6 border border-sky-100 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-sky-950">AURIS City Intelligence Synthesizer</h3>
                      <p className="text-[11px] text-sky-700">Cross-domain anomaly correlation</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-800 bg-white/80 px-2.5 py-1 rounded-xl border border-sky-200">
                    Real-Time Synthesis
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  "City Health increased 1.2 points overall, but <strong className="text-blue-700">Water & Drainage dipped 4.0 points</strong> due to the Ward 7 pipeline breach and catch-basin siltation. Concurrently, Mobility resilience is holding at 72 via proactive arterial diversion."
                </p>

                <div className="mt-4 pt-3 border-t border-sky-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/80 p-3 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block">
                      Recommended Action #1
                    </span>
                    <p className="text-xs text-slate-700 mt-1">
                      Deploy additional hydro-jetting units to Ward 7 to restore gravity catchment flow before afternoon precipitation.
                    </p>
                  </div>

                  <div className="bg-white/80 p-3 rounded-2xl border border-sky-100">
                    <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block">
                      Recommended Action #2
                    </span>
                    <p className="text-xs text-slate-700 mt-1">
                      Maintain dynamic signal timing on FDR Drive until average transit speed recovers to &gt;20 km/h.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Categories Grid & Map Synchronization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Category Cards (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category Diagnostics (Click to highlight on map)
                </span>
                {selectedHealthCategory && (
                  <button
                    onClick={() => setSelectedHealthCategory(null)}
                    className="text-xs text-sky-600 font-semibold hover:text-sky-700"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cityHealthMetrics.map((item) => {
                  const isSelected = selectedHealthCategory === item.category;
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSelectedHealthCategory(isSelected ? null : item.category)
                      }
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-400 shadow-premium scale-[1.01]'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-subtle'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.category}</h4>
                            <span className="text-[10px] text-slate-400">Previous: {item.previousScore}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-lg font-black text-slate-900">
                            {item.score}
                          </span>
                          <span
                            className={`text-[10px] font-bold block ${
                              item.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {item.trend === 'up' ? `+${item.delta}` : `${item.delta}`}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2.5 leading-snug line-clamp-2">
                        {item.changeReason}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Click to view {item.category} incidents</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Synchronized Health Map (Right 5 Cols) */}
            <div className="lg:col-span-5 min-w-0 bg-white rounded-3xl p-4 border border-slate-200/90 shadow-subtle space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-xs text-slate-900">
                    {selectedHealthCategory ? `${selectedHealthCategory} Map Hotspots` : 'Global Health Hotspots'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Synchronized GIS Layer</span>
              </div>

              <GeospatialMap
                incidents={incidents}
                highlightCategory={selectedHealthCategory}
                height="clamp(360px, 58vh, 460px)"
                center={[20, 20]}
                zoom={2}
                onSelectIncident={(inc) => {
                  setSelectedIncident(inc);
                  setActiveTab('urban-command');
                }}
              />
            </div>

          </div>
        </>
      ) : (
        /* What-If City Simulation Tool */
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  What-If Environmental & Infrastructure Scenario Engine
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust simulated climatic and urban parameters to project cascading municipal impacts in real-time.
                </p>
              </div>
              <button
                onClick={resetSimulation}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Parameters</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Rainfall Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Precipitation / Rainfall</span>
                  <span className="font-mono font-bold text-blue-600">+{simulationParams.rainfall}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulationParams.rainfall}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, rainfall: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal (0%)</span>
                  <span>Extreme Flood (+100%)</span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Ambient Temperature</span>
                  <span className="font-mono font-bold text-amber-600">+{simulationParams.temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="8"
                  value={simulationParams.temperature}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, temperature: Number(e.target.value) }))
                  }
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-5°C Cold Wave</span>
                  <span>+8°C Heatwave</span>
                </div>
              </div>

              {/* Traffic Volume Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Commuter Traffic Load</span>
                  <span className="font-mono font-bold text-indigo-600">+{simulationParams.traffic}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={simulationParams.traffic}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, traffic: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Baseline (0%)</span>
                  <span>Severe Peak (+80%)</span>
                </div>
              </div>

              {/* Population Shift Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Urban Influx / Event Density</span>
                  <span className="font-mono font-bold text-violet-600">+{simulationParams.population}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={simulationParams.population}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, population: Number(e.target.value) }))
                  }
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal (0%)</span>
                  <span>+50% Festival / Surge</span>
                </div>
              </div>

              {/* Energy Demand Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Grid Cooling & Power Demand</span>
                  <span className="font-mono font-bold text-orange-600">+{simulationParams.energyDemand}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simulationParams.energyDemand}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, energyDemand: Number(e.target.value) }))
                  }
                  className="w-full accent-orange-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal (0%)</span>
                  <span>+60% Peak Strain</span>
                </div>
              </div>

              {/* Industrial Pollution Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Particulate / Industrial Output</span>
                  <span className="font-mono font-bold text-teal-600">+{simulationParams.pollution}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simulationParams.pollution}
                  onChange={(e) =>
                    setSimulationParams(prev => ({ ...prev, pollution: Number(e.target.value) }))
                  }
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Standard (0%)</span>
                  <span>+60% High Emissions</span>
                </div>
              </div>

            </div>
          </div>

          {/* Real-time Projected Impacts Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Projected Impact Cards */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Simulated Cascade Outputs
              </span>

              <div className="p-4 rounded-2xl bg-white border border-red-200/80 shadow-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Projected Flood Inundation Risk</h4>
                    <span className="text-[10px] text-slate-400">Catch-basin saturation probability</span>
                  </div>
                </div>
                <span className="font-display text-lg font-black text-red-600">+{floodRisk}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Traffic Disruption & Bottlenecks</h4>
                    <span className="text-[10px] text-slate-400">Arterial travel delay multiplier</span>
                  </div>
                </div>
                <span className="font-display text-lg font-black text-amber-600">+{trafficDisruption}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-orange-200/80 shadow-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Emergency & Ambulance Demand</h4>
                    <span className="text-[10px] text-slate-400">Heat/hazard dispatch load</span>
                  </div>
                </div>
                <span className="font-display text-lg font-black text-orange-600">+{emergencyDemand}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-teal-200/80 shadow-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Air Quality & Respiratory Risk</h4>
                    <span className="text-[10px] text-slate-400">PM2.5 micro-concentration jump</span>
                  </div>
                </div>
                <span className="font-display text-lg font-black text-teal-600">+{airQualityDrop}%</span>
              </div>
            </div>

            {/* Simulated Comparison Chart */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle">
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Baseline vs. Simulated Scenario Comparison
              </h4>
              <p className="text-[11px] text-slate-400 mb-4">
                Dynamic projection calculated via AURIS City Intelligence multi-agent neural model
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulationChartData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="baseline" name="Standard Baseline (%)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated" name="Simulated Scenario (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
