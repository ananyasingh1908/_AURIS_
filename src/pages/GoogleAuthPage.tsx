import React, { useState, useMemo, useEffect } from 'react';
import { useAuris } from '../store/AurisContext';
import { USER_ROLES, SUPPORTED_COUNTRIES, CITIES_BY_COUNTRY } from '../data/mockData';
import { RoleId } from '../types';
import {
  triggerRealGoogleOAuth,
  getGoogleClientId,
  saveCustomGoogleClientId,
  GoogleUserProfile
} from '../services/googleAuthService';
import {
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Radio,
  Zap,
  Fingerprint,
  LogOut,
  Check,
  Search,
  Globe,
  MapPin,
  Building2,
  ExternalLink,
  Key,
  Info,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SafeImage } from '../components/SafeImage';

// Official Google "G" Logo
export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

type RoleCategory = 'all' | 'executive' | 'operations' | 'climate' | 'civic';

export const GoogleAuthPage: React.FC<{ initialRole?: RoleId; onComplete?: () => void }> = ({
  initialRole,
  onComplete
}) => {
  const {
    currentRole,
    userProfile,
    currentCountry,
    setCountry,
    currentCity,
    setCity,
    loginWithGoogle,
    logout,
    isAuthenticated,
    setActiveTab
  } = useAuris() as any;

  const [selectedRole, setSelectedRole] = useState<RoleId>(initialRole || currentRole || 'CITY_ADMIN');
  const [selectedCountry, setSelectedCountry] = useState<string>(currentCountry || 'India');
  const [selectedCity, setSelectedCity] = useState<string>(currentCity || 'Mumbai');
  const [categoryFilter, setCategoryFilter] = useState<RoleCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Google OAuth Popup & Flow state
  const [googlePopupOpen, setGooglePopupOpen] = useState(false);
  const [authState, setAuthState] = useState<'idle' | 'authorizing' | 'verifying' | 'success' | 'error'>('idle');
  const [authStepText, setAuthStepText] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [showConfigHelper, setShowConfigHelper] = useState(false);

  // Client ID input state
  const [inputClientId, setInputClientId] = useState(() => getGoogleClientId());

  // Update city list when country changes
  const availableCities = useMemo(() => {
    return CITIES_BY_COUNTRY[selectedCountry] || [{ name: 'Central City', ward: 'Main Ward', lat: 20, lng: 78 }];
  }, [selectedCountry]);

  useEffect(() => {
    if (!availableCities.some((c) => c.name === selectedCity)) {
      setSelectedCity(availableCities[0]?.name || 'Mumbai');
    }
  }, [selectedCountry, availableCities, selectedCity]);

  const activeRoleData = USER_ROLES[selectedRole] || USER_ROLES.CITY_ADMIN;

  const roleCategories: Record<RoleId, RoleCategory> = useMemo(() => ({
    CITY_ADMIN: 'executive',
    ALL_ADMIN: 'executive',
    WATER_DEPT: 'operations',
    MOBILITY_DEPT: 'operations',
    ENERGY_DEPT: 'operations',
    WASTE_DEPT: 'operations',
    INFRASTRUCTURE_DEPT: 'operations',
    HEALTH_DEPT: 'operations',
    EMERGENCY_DEPT: 'operations',
    ENVIRONMENT_DEPT: 'climate',
    CARBON_COMPANY: 'climate',
    GOVT_CARBON_MONITOR: 'climate',
    CITIZEN: 'civic'
  }), []);

  const roleList = useMemo(() => {
    return (Object.keys(USER_ROLES) as RoleId[]).filter((roleId) => {
      const prof = USER_ROLES[roleId];
      const matchesCategory = categoryFilter === 'all' || roleCategories[roleId] === categoryFilter;
      const matchesSearch =
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.roleBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prof.departmentName && prof.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery, roleCategories]);

  const handleStartGoogleAuth = async (roleId?: RoleId) => {
    if (roleId) setSelectedRole(roleId);
    
    const activeClientId = inputClientId.trim() || getGoogleClientId();

    if (!activeClientId) {
      // Prompt modal to provide Client ID or view setup guide
      setGooglePopupOpen(true);
      setAuthState('idle');
      setAuthStepText('Please enter your Google OAuth 2.0 Web Client ID to continue.');
      return;
    }

    setGooglePopupOpen(true);
    setAuthState('authorizing');
    setAuthStepText('Launching official Google Sign-In prompt...');
    setAuthErrorMessage('');

    try {
      const { profile } = await triggerRealGoogleOAuth(activeClientId);

      setAuthState('verifying');
      setAuthStepText(`Verifying Google ID Token for ${profile.email}...`);

      await new Promise((resolve) => setTimeout(resolve, 600));
      setAuthState('success');
      setAuthStepText(`Authenticated as ${profile.name}! Provisioning session...`);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setCountry(selectedCountry);
      setCity(selectedCity);

      await loginWithGoogle(roleId || selectedRole, selectedCountry, selectedCity, {
        email: profile.email,
        name: profile.name,
        avatar: profile.picture || activeRoleData.avatar,
        googleSub: profile.sub
      });

      setGooglePopupOpen(false);
      setAuthState('idle');

      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error('Google OAuth execution error:', err);
      setAuthState('error');
      setAuthErrorMessage(err.message || 'Google Sign-In was cancelled or failed.');
    }
  };

  const handleSaveAndAuthWithClientId = async () => {
    if (!inputClientId.trim()) {
      setAuthErrorMessage('Please enter a valid Google Client ID.');
      return;
    }
    saveCustomGoogleClientId(inputClientId.trim());
    handleStartGoogleAuth();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
              AURIS Sovereign Identity & Access Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Single Sign-On with Google
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select your Role, Country, and Municipal Jurisdiction to establish a real Google OAuth 2.0 authenticated session.
          </p>
        </div>

        {/* Authenticated Status or Config Helper Trigger */}
        <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 bg-slate-800/90 border border-emerald-500/40 px-4 py-2.5 rounded-2xl shadow-md">
              <SafeImage
                src={userProfile.avatar}
                alt={userProfile.name}
                fallbackType="avatar"
                className="w-8 h-8 rounded-full border border-white/20 object-cover"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{userProfile.name}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                    {userProfile.roleBadge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentCity || 'Mumbai'}, {currentCountry || 'India'}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors ml-2"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Real Google Identity Services Ready</span>
            </div>
          )}

          <button
            onClick={() => setShowConfigHelper(!showConfigHelper)}
            className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-semibold"
          >
            <Key className="w-3 h-3" />
            <span>Google Cloud OAuth 2.0 Credentials Guide</span>
          </button>
        </div>

        {/* Decorative ambient background mesh */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Google Cloud Setup Instructions Accordion */}
      <AnimatePresence>
        {showConfigHelper && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-xs text-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Google Cloud Console Setup Checklist</span>
              </div>
              <p className="text-slate-600">
                Configure your OAuth 2.0 Web Client ID in the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">Google Cloud Console</a>:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-amber-200/80 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block mb-1">Authorized JavaScript origins:</span>
                  <span className="text-blue-700 font-bold block">http://localhost:5173</span>
                  <span className="text-blue-700 font-bold block">http://127.0.0.1:5173</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Authorized redirect URIs:</span>
                  <span className="text-blue-700 font-bold block">http://localhost:5173</span>
                  <span className="text-blue-700 font-bold block">http://localhost:5173/auth/callback</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Paste your Client ID (e.g. xxxx.apps.googleusercontent.com)"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono"
                />
                <button
                  onClick={() => {
                    saveCustomGoogleClientId(inputClientId);
                    setShowConfigHelper(false);
                  }}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Save Client ID
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4-STEP LOGIN WORKFLOW CONTROLLER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
        
        {/* Step Indicator Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">AURIS Protocol Flow</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Real Multi-Role Google Authentication
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 1: Select Role → Step 2: Select Country → Step 3: Select City → Step 4: Continue with Google
          </p>
        </div>

        {/* Step 2 & 3: Country & City Jurisdiction Selection Bar */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Country Selector (Default: India) */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 2: Select Country (Default: India)</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name} {c.name === 'India' ? '(Default Sovereign Hub)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 3: Select Municipal City / Jurisdiction</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableCities.map((c) => (
                <option key={c.name} value={c.name}>
                  📍 {c.name} ({c.ward})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Step 1: Role Selection Grid with Category Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Step 1: Select AURIS Operational Role ({roleList.length} Available)
              </span>
              <p className="text-[11px] text-slate-500">
                Each role enforces specific clearance tiers, telemetry access, and dashboard routing.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'executive', 'operations', 'climate', 'civic'] as RoleCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, department, or clearance level..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:bg-white"
            />
          </div>

          {/* Roles Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {roleList.map((roleId) => {
              const prof = USER_ROLES[roleId];
              const isSelected = selectedRole === roleId;

              return (
                <div
                  key={roleId}
                  onClick={() => setSelectedRole(roleId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400 shadow-md'
                      : 'bg-white hover:bg-slate-50/60 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <SafeImage
                          src={prof.avatar}
                          alt={prof.name}
                          fallbackType="avatar"
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">{prof.roleBadge}</h3>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                            {prof.departmentName}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {prof.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">{prof.clearanceLevel || 'Tier-2 Access'}</span>
                    <span className="text-sky-600 font-mono font-bold">Google SSO</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Primary Google Authentication Action Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">
                Selected Jurisdiction: <span className="text-white font-extrabold">{selectedCity}, {selectedCountry}</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Ready to authenticate as {activeRoleData.roleBadge}
            </h3>
            <p className="text-xs text-slate-400">
              Triggers Google Identity Services OAuth 2.0 to authenticate your sovereign session.
            </p>
          </div>

          <button
            onClick={() => handleStartGoogleAuth()}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105 shrink-0"
          >
            <GoogleLogo className="w-4 h-4" />
            <span>Step 4: Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>

      {/* Google OAuth Execution Modal */}
      <AnimatePresence>
        {googlePopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GoogleLogo className="w-5 h-5" />
                  <span className="font-bold text-sm text-slate-900">Google Identity Services</span>
                </div>
                <button
                  onClick={() => setGooglePopupOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="text-center space-y-2 py-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                  <GoogleLogo className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">OAuth 2.0 Web Authentication</h4>
                  <p className="text-xs text-slate-500">
                    Signing in for <strong className="text-slate-800">{activeRoleData.roleBadge}</strong> ({selectedCity}, {selectedCountry})
                  </p>
                </div>
              </div>

              {/* Client ID Configuration Field */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Google Client ID:</span>
                  <span className="text-[10px] text-slate-400 font-normal">From Google Cloud Console</span>
                </label>
                <input
                  type="text"
                  placeholder="Paste Client ID (e.g. xxxx.apps.googleusercontent.com)"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-500">
                  Saved automatically to your session. Never exposes or requires any Client Secret.
                </p>
              </div>

              {/* Status or Error Display */}
              {authState === 'error' && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Authentication Notice</span>
                    <span>{authErrorMessage}</span>
                  </div>
                </div>
              )}

              {authState !== 'idle' && authState !== 'error' && (
                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span className="text-xs font-bold text-blue-900">{authStepText}</span>
                  </div>
                  <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-blue-600 transition-all duration-500 ${
                        authState === 'authorizing'
                          ? 'w-1/2'
                          : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setGooglePopupOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndAuthWithClientId}
                  disabled={authState === 'authorizing' || authState === 'verifying'}
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>Launch Google Sign-In</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
