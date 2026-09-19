import React, { useState, useMemo, useEffect } from 'react';
import { useAuris } from '../store/AurisContext';
import { USER_ROLES, SUPPORTED_COUNTRIES, CITIES_BY_COUNTRY } from '../data/mockData';
import { RoleId } from '../types';
import { GoogleLogo } from '../pages/GoogleAuthPage';
import {
  triggerRealGoogleOAuth,
  getGoogleClientId,
  saveCustomGoogleClientId
} from '../services/googleAuthService';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  Fingerprint,
  Radio,
  Check,
  Sparkles,
  Globe,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SafeImage } from './SafeImage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, currentCountry, currentCity, setCountry, setCity, loginWithGoogle } = useAuris() as any;
  const [selectedRole, setSelectedRole] = useState<RoleId>(currentRole || 'CITY_ADMIN');
  const [selectedCountry, setSelectedCountry] = useState<string>(currentCountry || 'India');
  const [selectedCity, setSelectedCity] = useState<string>(currentCity || 'Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'executive' | 'operations' | 'climate' | 'civic'>('all');
  const [authState, setAuthState] = useState<'idle' | 'authorizing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [inputClientId, setInputClientId] = useState(() => getGoogleClientId());

  const targetUser = USER_ROLES[selectedRole] || USER_ROLES.CITY_ADMIN;

  const availableCities = useMemo(() => {
    return CITIES_BY_COUNTRY[selectedCountry] || [{ name: 'Central City', ward: 'Main Ward', lat: 20, lng: 78 }];
  }, [selectedCountry]);

  useEffect(() => {
    if (!availableCities.some((c) => c.name === selectedCity)) {
      setSelectedCity(availableCities[0]?.name || 'Mumbai');
    }
  }, [selectedCountry, availableCities, selectedCity]);

  if (!isOpen) return null;

  const roleCategories: Record<RoleId, 'executive' | 'operations' | 'climate' | 'civic'> = {
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
  };

  const filteredRoles = (Object.keys(USER_ROLES) as RoleId[]).filter((roleId) => {
    const role = USER_ROLES[roleId];
    const matchesCat = selectedCategory === 'all' || roleCategories[roleId] === selectedCategory;
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.roleBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.departmentName && role.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleGoogleLogin = async () => {
    const activeClientId = inputClientId.trim() || getGoogleClientId();

    if (!activeClientId) {
      setAuthErrorMessage('Please enter your Google OAuth 2.0 Client ID below to trigger real Google Sign-In.');
      return;
    }

    setAuthState('authorizing');
    setStatusMessage('Launching official Google Identity Services popup...');
    setAuthErrorMessage('');

    try {
      if (inputClientId.trim()) {
        saveCustomGoogleClientId(inputClientId.trim());
      }

      const { profile } = await triggerRealGoogleOAuth(activeClientId);

      setStatusMessage(`Authenticated as ${profile.name} (${profile.email}). Assigning ${targetUser.roleBadge}...`);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setCountry(selectedCountry);
      setCity(selectedCity);

      await loginWithGoogle(selectedRole, selectedCountry, selectedCity, {
        email: profile.email,
        name: profile.name,
        avatar: profile.picture || targetUser.avatar,
        googleSub: profile.sub
      });

      setAuthState('idle');
      onClose();
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setAuthState('error');
      setAuthErrorMessage(err.message || 'Google OAuth prompt was closed or failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <GoogleLogo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">AURIS Single Sign-On</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Google OAuth 2.0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Select Role, Country, and City Jurisdiction to establish authorized session.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Country & City Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Country (Default: India)</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>City Jurisdiction</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {availableCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    📍 {c.name} ({c.ward})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'executive', 'operations', 'climate', 'civic'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Roles List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {filteredRoles.map((roleId) => {
              const role = USER_ROLES[roleId];
              const isSelected = selectedRole === roleId;

              return (
                <div
                  key={roleId}
                  onClick={() => setSelectedRole(roleId)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400 shadow-sm'
                      : 'bg-white hover:bg-slate-50/70 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SafeImage
                      src={role.avatar}
                      alt={role.name}
                      fallbackType="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{role.roleBadge}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        {role.departmentName}
                      </div>
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
              );
            })}
          </div>

          {/* Client ID Input Field */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
              <span>Google OAuth 2.0 Client ID:</span>
              <span className="text-[10px] text-slate-400">Google Cloud Console</span>
            </label>
            <input
              type="text"
              placeholder="Paste Client ID (e.g. xxxx.apps.googleusercontent.com)"
              value={inputClientId}
              onChange={(e) => setInputClientId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-[11px]"
            />
          </div>

          {/* Status Message or Error */}
          {authState === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{authErrorMessage}</span>
            </div>
          )}

          {authState !== 'idle' && authState !== 'error' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-900">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{statusMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={authState === 'authorizing'}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
          >
            <GoogleLogo className="w-4 h-4" />
            <span>Continue with Google</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
