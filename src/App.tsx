import React, { useEffect, useMemo, useState } from 'react';
import { AurisProvider, useAuris } from './store/AurisContext';
import { Navbar } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { UrbanCommandPage } from './pages/UrbanCommandPage';
import { CityHealthPage } from './pages/CityHealthPage';
import { CitizenPage } from './pages/CitizenPage';
import { CarbonPage } from './pages/CarbonPage';
import { DepartmentDashboardPage } from './pages/DepartmentDashboardPage';
import { AiAgentsPage } from './pages/AiAgentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GoogleAuthPage } from './pages/GoogleAuthPage';
import { GlobalSearchDialog } from './components/GlobalSearchDialog';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AuditTrailDrawer } from './components/AuditTrailDrawer';
import { LoginModal } from './components/LoginModal';
import { SimulateIncidentModal } from './components/SimulateIncidentModal';
import { USER_ROLES } from './data/mockData';
import { RoleId } from './types';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronUp,
  Coins,
  Droplets,
  ExternalLink,
  Globe,
  Heart,
  Layers,
  Lock,
  Mail,
  MessageSquareText,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  UserCheck,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './components/SafeImage';
import { isTabAllowedForRole } from './services/rbac';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    currentRole,
    userProfile,
    setRole,
    setActiveTab,
    loginModalOpen,
    setLoginModalOpen,
    simulateModalOpen,
    setSimulateModalOpen,
    authGuardOpen,
    setAuthGuardOpen,
    authGuardMessage
  } = useAuris() as any;

  const [quickRolePickerOpen, setQuickRolePickerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);


  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const protectedModules: Record<string, string> = useMemo(() => ({
    'urban-command': 'Urban Command',
    'city-health': 'City Health',
    'departments': 'Department Dashboard',
    'analytics': 'Analytics',
    'agents': 'AI Center'
  }), []);

  const isProtected = Boolean(protectedModules[activeTab]);

  useEffect(() => {
    if (!isHydrated) return;

    const isAllowed = isTabAllowedForRole(currentRole, activeTab);
    if (!isAllowed && isProtected) {
      setAuthGuardOpen(true);
      return;
    }

    if (!isAllowed) {
      setAuthGuardOpen(true);
      return;
    }

    setAuthGuardOpen(false);
  }, [activeTab, currentRole, isHydrated, isProtected, setAuthGuardOpen]);

  const allowProtectedAccess = () => {
    setRole('CITY_ADMIN');
    setAuthGuardOpen(false);
    pushToast({
      title: 'Access restored',
      message: 'You are now viewing the city dashboard with admin access.',
      variant: 'success'
    });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 animate-pulse" />
          <div className="text-sm font-semibold text-slate-600 tracking-[0.22em] uppercase">Loading AURIS</div>
        </div>
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'urban-command':
        return <UrbanCommandPage />;
      case 'city-health':
        return <CityHealthPage />;
      case 'citizen':
        return <CitizenPage />;
      case 'carbon':
        return <CarbonPage />;
      case 'departments':
        return <DepartmentDashboardPage />;
      case 'agents':
        return <AiAgentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'auth':
        return <GoogleAuthPage />;
      default:
        return <OverviewPage />;
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900 font-sans">

      {/* Top Persistent Navbar */}
      <Navbar />

      {/* Main App Workspace Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AURIS Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
            <div className="col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm shadow-premium">
                  A
                </div>
                <span className="font-display font-bold text-slate-900 text-base">AURIS</span>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Multi-Agent Urban Intelligence & Carbon Exchange — a unified command center for sustainable, resilient smart cities.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <a
                  href="https://github.com/ananyasingh1908/AURIS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AURIS repository"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="AURIS community"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                >
                  <MessageSquareText className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="AURIS network"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@auris.city"
                  aria-label="Email AURIS"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform</span>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('overview')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Activity className="w-3.5 h-3.5" /> Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('urban-command')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Layers className="w-3.5 h-3.5" /> Urban Command
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('city-health')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Heart className="w-3.5 h-3.5" /> City Health
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('departments')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Building2 className="w-3.5 h-3.5" /> Departments
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programs</span>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('citizen')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Users className="w-3.5 h-3.5" /> Citizen Intelligence
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('carbon')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Coins className="w-3.5 h-3.5" /> Carbon Exchange
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('agents')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <Sparkles className="w-3.5 h-3.5" /> AI Center
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('analytics')} className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5" /> Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trust & Registry</span>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Gold Standard Registry</li>
                <li className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-sky-500" /> Real-Time DMA Telemetry</li>
                <li className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-teal-500" /> Emissions Inventory</li>
                <li>
                  <button onClick={() => setActiveTab('analytics')} className="flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                    <Shield className="w-3.5 h-3.5" /> Audit Trail
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="rounded-2xl bg-slate-900 p-4 shadow-premium">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Network</span>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Cities Connected</span>
                    <span className="text-xs font-bold text-white">200+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Neural Agents</span>
                    <span className="text-xs font-bold text-white">12</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-emerald-400 font-semibold">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} AURIS. Designed for high-impact sustainable smart cities.
            </p>
            <div className="flex items-center gap-5 text-xs">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-1 text-sky-600 font-semibold hover:underline"
              >
                Switch Role / Sign In <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Quick Role Switcher Pill */}
      <div className="fixed bottom-6 right-6 z-[1300]">
        <div className="relative z-[1300]">
          <button
            onClick={() => setQuickRolePickerOpen(!quickRolePickerOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-floating border border-slate-700/50 text-xs font-semibold transition-all hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Role: {userProfile.roleBadge}</span>
            <ChevronUp className={`w-3.5 h-3.5 transition-transform ${quickRolePickerOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {quickRolePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-3xl p-3 border border-slate-200 shadow-floating z-[1300] max-h-80 overflow-y-auto"
              >
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Role Switcher (13 Roles)
                  </span>
                </div>
                <div className="space-y-1">
                  {(Object.keys(USER_ROLES) as RoleId[]).map(roleKey => {
                    const prof = USER_ROLES[roleKey];
                    const isSelected = currentRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setRole(roleKey);
                          setQuickRolePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${isSelected
                            ? 'bg-slate-900 text-white font-bold'
                            : 'hover:bg-slate-100 text-slate-700 font-medium'
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <SafeImage src={prof.avatar} alt={prof.name} fallbackType="avatar" className="w-5 h-5 rounded-md object-cover" />
                          <span className="truncate">{prof.roleBadge}</span>
                        </div>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setQuickRolePickerOpen(false);
                      setActiveTab('auth');
                    }}
                    className="w-full py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-center text-xs font-bold transition-colors block"
                  >
                    Google Authentication Portal
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      {/* Global Modals & Drawers */}
      <GlobalSearchDialog />
      <AiAssistantDrawer />
      <AuditTrailDrawer />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <SimulateIncidentModal isOpen={simulateModalOpen} onClose={() => setSimulateModalOpen(false)} />

      {authGuardOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-floating"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Access limited</div>
                  <div className="text-lg font-bold text-slate-900">Protected module</div>
                </div>
              </div>
              <button
                onClick={() => setAuthGuardOpen(false)}
                className="rounded-xl border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              {authGuardMessage || 'This section requires an operational role. Switch to a city or department profile to continue.'}
            </p>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-3 text-sm text-sky-900">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Recommended role: City Administrator
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={allowProtectedAccess}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Continue as City Admin
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Choose role
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AurisProvider>
      <MainAppContent />
    </AurisProvider>
  );
}
