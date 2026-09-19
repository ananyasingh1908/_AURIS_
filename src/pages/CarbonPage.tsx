import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import { BuyCarbonModal } from '../components/BuyCarbonModal';
import { SellCarbonModal } from '../components/SellCarbonModal';
import { SafeImage } from '../components/SafeImage';
import { CarbonProject, CarbonProjectType, CountryEmission } from '../types';
import { COUNTRY_EMISSIONS } from '../data/mockData';

import {
  Coins,
  Leaf,
  Globe2,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  TreePine,
  DollarSign,
  TrendingUp,
  Award,
  Plus,
  Building2,
  Activity,
  FileCheck,
  AlertTriangle,
  Flame,
  PieChart as PieIcon,
  MapPin,
  CheckCircle2,
  Sliders,
  Layers,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export const CarbonPage: React.FC = () => {
  const {
    carbonProjects,
    selectedProject,
    setSelectedProject,
    carbonTransactions,
    carbonPortfolio,
    buyModalProject,
    setBuyModalProject,
    sellModalOpen,
    setSellModalOpen,
    retireCarbonCredits,
    cityEmissionsInventory,
    createProjectFromHotspot,
    userProfile,
    currentRole
  } = useAuris();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'inventory' | 'mrv' | 'portfolio' | 'government'>('marketplace');

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [retireQty, setRetireQty] = useState<number>(1000);
  const [retireBeneficiary, setRetireBeneficiary] = useState('City of Mumbai Municipal Corp');
  const [retirePurpose, setRetirePurpose] = useState('2026 Municipal Net-Zero Compliance Target');
  const [activeCertificate, setActiveCertificate] = useState<string | null>(null);

  // Buy vs Reduce Strategy Tool Calculator
  const [orgEmissions, setOrgEmissions] = useState<number>(10000);
  const efficiencyReduction = Math.round(orgEmissions * 0.18);
  const renewableReduction = Math.round(orgEmissions * 0.22);
  const fleetReduction = Math.round(orgEmissions * 0.09);
  const remainingResidual = orgEmissions - (efficiencyReduction + renewableReduction + fleetReduction);

  const projectTypes = [
    'All',
    'Reforestation',
    'Solar',
    'Wind',
    'Clean Cooking',
    'Energy Efficiency'
  ];

  const filteredProjects = carbonProjects.filter(p => {
    if (typeFilter !== 'All' && p.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCreditsAvailable = carbonProjects.reduce((acc, p) => acc + p.creditsAvailable, 0);

  const sectorData = [
    { name: 'Transport', value: cityEmissionsInventory.sectors.transport, color: '#0284c7' },
    { name: 'Buildings', value: cityEmissionsInventory.sectors.buildings, color: '#38bdf8' },
    { name: 'Energy', value: cityEmissionsInventory.sectors.energy, color: '#f59e0b' },
    { name: 'Industry', value: cityEmissionsInventory.sectors.industry, color: '#10b981' },
    { name: 'Waste', value: cityEmissionsInventory.sectors.waste, color: '#8b5cf6' }
  ];

  const handleRetire = (e: React.FormEvent) => {
    e.preventDefault();
    if (retireQty > carbonPortfolio.creditsOwned || retireQty <= 0) return;
    const certId = `CERT-RETIRE-VCS-${Math.floor(100000 + Math.random() * 900000)}`;
    const ok = retireCarbonCredits(carbonProjects[0]?.id || 'CARB-801', retireQty, retirePurpose, retireBeneficiary);
    if (ok) {
      setActiveCertificate(certId);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Global Carbon Exchange & Climate Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            End-to-End Value Chain: Measure (Scope 1/2/3) → Reduce → Verify → Track → Trade → Retire
          </p>
        </div>

        {/* Value Chain Navigation Tabs */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-subtle overflow-x-auto">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'marketplace'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            City Emissions Inventory
          </button>
          <button
            onClick={() => setActiveTab('mrv')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mrv'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MRV Pipeline
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'portfolio'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vault & Ledger
          </button>
          <button
            onClick={() => setActiveTab('government')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'government'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Govt Audits
          </button>
        </div>
      </div>

      {/* TAB 1: Marketplace & World Map */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          
          {/* Key KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Available Supply
              </span>
              <p className="font-display text-xl font-bold text-slate-900 mt-1">
                {totalCreditsAvailable.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO₂</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Projects
              </span>
              <p className="font-display text-xl font-bold text-emerald-700 mt-1">
                {carbonProjects.length} <span className="text-xs font-normal text-slate-400">active</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Market Price
              </span>
              <p className="font-display text-xl font-bold text-slate-900 mt-1">
                $19.80 <span className="text-xs font-normal text-slate-400">/ ton</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Retired Impact
              </span>
              <p className="font-display text-xl font-bold text-emerald-600 mt-1">
                25.2M <span className="text-xs font-normal text-slate-400">tCO₂</span>
              </p>
            </div>
          </div>

          {/* Reduce First vs Buy Strategy Calculator */}
          <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/70">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  AURIS Carbon Intelligence: Reduce First Policy
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">Enterprise Emission Abatement Strategy</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Annual Footprint:</span>
                <input
                  type="number"
                  value={orgEmissions}
                  onChange={(e) => setOrgEmissions(Number(e.target.value))}
                  className="w-28 px-3 py-1 bg-white border border-emerald-300 rounded-xl font-bold text-slate-900 text-xs text-right"
                />
                <span className="text-slate-500 font-semibold">tCO₂e</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200/60">
                <span className="text-slate-500 block font-medium">1. Energy Efficiency</span>
                <span className="font-bold text-emerald-700 block mt-0.5">-{efficiencyReduction.toLocaleString()} t (18%)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200/60">
                <span className="text-slate-500 block font-medium">2. On-Site Renewables</span>
                <span className="font-bold text-emerald-700 block mt-0.5">-{renewableReduction.toLocaleString()} t (22%)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200/60">
                <span className="text-slate-500 block font-medium">3. Fleet Electrification</span>
                <span className="font-bold text-emerald-700 block mt-0.5">-{fleetReduction.toLocaleString()} t (9%)</span>
              </div>
              <div className="p-3 bg-emerald-700 text-white rounded-xl">
                <span className="text-emerald-200 block font-medium">Residual Offset Need</span>
                <span className="font-bold text-white block mt-0.5">{remainingResidual.toLocaleString()} t (51%)</span>
              </div>
            </div>
          </div>

          {/* World Carbon Project Geospatial Map */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex flex-col gap-1 px-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">
                  Global Verified Carbon Mitigation Projects Map
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Satellite NDVI & Bio-integrity Verified</span>
            </div>

            <GeospatialMap
              carbonProjects={filteredProjects}
              selectedProject={selectedProject}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
              }}
              height="clamp(360px, 58vh, 440px)"
              center={[15, 20]}
              zoom={2}
            />
          </div>

          {/* Marketplace Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {projectTypes.map(pt => (
                <button
                  key={pt}
                  onClick={() => setTypeFilter(pt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    typeFilter === pt
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-52">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project or country..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <button
                onClick={() => setSellModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Project</span>
              </button>
            </div>
          </div>

          {/* Project Cards Grid with Integrity Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-floating transition-all duration-300 p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden h-40 bg-slate-100 border border-slate-100 mb-4">
                    <SafeImage
                      src={project.image}
                      alt={project.name}
                      fallbackType="carbon"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">

                      {project.type}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Integrity: {project.integrityScore || 92}/100</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {project.cityRegion}, {project.country}
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Standard Body</span>
                      <span className="font-bold text-slate-700 truncate block">{project.standardsBody}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Supply Available</span>
                      <span className="font-bold text-emerald-700">{project.creditsAvailable.toLocaleString()} t</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Price</span>
                    <span className="font-display text-lg font-black text-slate-900">
                      ${project.pricePerCredit.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-400">/ ton</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setBuyModalProject(project)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-subtle hover:scale-105"
                  >
                    Buy Credits
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: City Emissions Inventory (Scope 1/2/3 & Hotspots) */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Scope 1/2/3 Cards (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {cityEmissionsInventory.city} GHG Inventory ({cityEmissionsInventory.year})
                  </h3>
                  <p className="text-xs text-slate-500">Total City Footprint: {cityEmissionsInventory.totalEmissionsMt} Mt CO₂e</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  GPC Compliant
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Scope 1 (Direct)</span>
                  <p className="text-lg font-black text-slate-900 mt-1">{cityEmissionsInventory.scope1} Mt</p>
                  <span className="text-[10px] text-slate-500">Transit & on-site gas</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Scope 2 (Electricity)</span>
                  <p className="text-lg font-black text-slate-900 mt-1">{cityEmissionsInventory.scope2} Mt</p>
                  <span className="text-[10px] text-slate-500">Imported grid power</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Scope 3 (Supply Chain)</span>
                  <p className="text-lg font-black text-slate-900 mt-1">{cityEmissionsInventory.scope3} Mt</p>
                  <span className="text-[10px] text-slate-500">Municipal procurement</span>
                </div>
              </div>

              {/* Emission Hotspots with Origination CTA */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Municipal Emission Hotspots & Project Origination
                </span>

                {cityEmissionsInventory.hotspots.map((h, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{h.name}</span>
                      <p className="text-slate-500 mt-0.5">{h.primaryDriver}</p>
                      <span className="font-mono text-emerald-700 font-bold block mt-1">
                        Annual Emissions: {h.emissionsTons.toLocaleString()} tCO₂e
                      </span>
                    </div>

                    <button
                      onClick={() => createProjectFromHotspot(h.name)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm shrink-0"
                    >
                      + Originate Carbon Project
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors Pie Chart (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Emissions by Economic Sector</h3>
              
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {sectorData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: MRV Pipeline (Monitoring, Reporting, Verification) */}
      {activeTab === 'mrv' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">MRV Quality Assurance & Issuance Pipeline</h3>
              <p className="text-xs text-slate-500">Registry workflow: Draft → Submitted → Monitoring → Verification → Issued</p>
            </div>
          </div>

          <div className="space-y-4">
            {carbonProjects.slice(0, 4).map(p => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{p.name}</span>
                    <p className="text-slate-500 text-[11px]">{p.standardsBody} • Vintage {p.vintage}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                    Stage: {p.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] bg-white p-3 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block font-medium">Quantification</span>
                    <span className="font-bold text-slate-800">Satellite Biomass Telemetry</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Additionality Proof</span>
                    <span className="font-bold text-slate-800">Fossil Grid Displacement</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Permanence Rating</span>
                    <span className="font-bold text-slate-800">100-Year Soil Buffer</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Integrity Score</span>
                    <span className="font-bold text-emerald-700">{p.integrityScore || 94}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Vault, Retirement & Certificate Generator */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Credits Held in Vault
              </span>
              <p className="font-display text-2xl font-black text-slate-900 mt-1">
                {carbonPortfolio.creditsOwned.toLocaleString()} <span className="text-xs font-normal text-slate-400">tons</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Permanently Retired
              </span>
              <p className="font-display text-2xl font-black text-emerald-600 mt-1">
                {carbonPortfolio.creditsRetired.toLocaleString()} <span className="text-xs font-normal text-slate-400">tons</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Capital Deployed
              </span>
              <p className="font-display text-2xl font-black text-slate-900 mt-1">
                ${carbonPortfolio.totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Net Carbon Abated
              </span>
              <p className="font-display text-2xl font-black text-emerald-700 mt-1">
                {carbonPortfolio.co2ImpactTons.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO₂</span>
              </p>
            </div>
          </div>

          {/* Retirement Tool */}
          <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-emerald-950">Permanent Carbon Retirement & Certificate Minting</h3>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Permanently burn credits from your holdings to fulfill net-zero sustainability quotas.
              </p>
            </div>

            <form onSubmit={handleRetire} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity (tCO₂)</label>
                <input
                  type="number"
                  min="1"
                  max={carbonPortfolio.creditsOwned}
                  value={retireQty}
                  onChange={(e) => setRetireQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-200 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Beneficiary Entity</label>
                <input
                  type="text"
                  value={retireBeneficiary}
                  onChange={(e) => setRetireBeneficiary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-200 font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Retirement Purpose</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={retirePurpose}
                    onChange={(e) => setRetirePurpose(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 font-medium text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={carbonPortfolio.creditsOwned <= 0}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl whitespace-nowrap shadow-sm"
                  >
                    Burn & Retire
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Generated Certificate Card */}
          {activeCertificate && (
            <div className="p-6 bg-white rounded-3xl border-2 border-emerald-500 shadow-floating text-center space-y-2">
              <Award className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Certificate of Permanent Climate Abatement</h4>
              <p className="text-xs text-slate-500">Certificate ID: <strong className="font-mono text-emerald-700">{activeCertificate}</strong></p>
              <p className="text-xs text-slate-700 font-medium">
                {retireQty.toLocaleString()} Metric Tons of CO₂ permanently retired on behalf of <strong>{retireBeneficiary}</strong> for {retirePurpose}.
              </p>
              <span className="text-[10px] text-slate-400 block pt-2">
                Prototype certificate — recorded on AURIS Immutable Audit Ledger.
              </span>
            </div>
          )}

          {/* Transactions Ledger */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
            <span className="font-bold text-sm text-slate-900 block">Carbon Transaction Ledger</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3 font-semibold">Txn ID</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Project Name</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">Value ($)</th>
                    <th className="pb-3 font-semibold">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {carbonTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-sky-700">{txn.id}</td>
                      <td className="py-3 text-slate-500">{txn.date}</td>
                      <td className="py-3 font-medium text-slate-900">{txn.projectName}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          txn.type === 'Purchase' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-800">{txn.quantity.toLocaleString()} t</td>
                      <td className="py-3 font-bold text-slate-900">${txn.totalValue.toLocaleString()}</td>
                      <td className="py-3 font-mono text-[11px] text-slate-500">{txn.certificateId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: Government Audits */}
      {activeTab === 'government' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">AURIS National Emission Audit Advisory</h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  "Industrial emissions in Sector D showed an 8.4% quarterly anomaly. Prioritize compliance audit for high-growth thermal clusters."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
            <span className="font-bold text-sm text-slate-900 block">National Carbon Footprint & Compliance</span>
            <div className="space-y-3">
              {COUNTRY_EMISSIONS.map(c => (
                <div key={c.code} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{c.country} ({c.code})</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                        {c.complianceRate}% Compliance
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{c.aiInsight}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-sm font-black text-slate-900">{c.totalEmissionsMt.toLocaleString()} Mt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <BuyCarbonModal
        project={buyModalProject}
        onClose={() => setBuyModalProject(null)}
      />

      <SellCarbonModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />

    </div>
  );
};
