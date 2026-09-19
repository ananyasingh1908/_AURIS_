import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { USER_ROLES } from '../data/mockData';
import { RoleId, Incident, NotificationItem } from '../types';
import { GoogleLogo } from '../pages/GoogleAuthPage';
import {
  Sparkles,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Radio,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './SafeImage';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    userProfile,
    setRole,
    activeTab,
    setActiveTab,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    markAllNotificationsRead,
    searchOpen,
    setSearchOpen,
    aiDrawerOpen,
    setAiDrawerOpen,
    setSelectedIncident,
    incidents,
    setLoginModalOpen,
    setSimulateModalOpen,
    currentCity,
    currentCountry,
    logout,
    isAuthenticated
  } = useAuris() as any;

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'urban-command', label: 'Urban Command' },
    { id: 'city-health', label: 'City Health' },
    { id: 'citizen', label: 'Citizen Intelligence' },
    { id: 'carbon', label: 'Carbon Exchange' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'agents', label: 'AI Center' },
    { id: 'departments', label: 'Departments' }
  ];

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.targetModule) {
      setActiveTab(notif.targetModule);
    }
    if (notif.actionId && notif.targetModule === 'urban-command') {
      const match = incidents.find((i: Incident) => i.id === notif.actionId);
      if (match) setSelectedIncident(match);
    }
    setNotifDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">

        {/* Left: Brand Logo */}
        <div className="min-w-0 justify-self-start">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-sky-600"></div>
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                AURIS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                {currentCity || 'Mumbai'}, {currentCountry || 'India'}
              </span>
            </div>
          </button>

        </div>

        {/* Center: desktop navigation occupies its own centered grid track. */}
        <nav className="hidden xl:flex items-center justify-self-center gap-0.5 whitespace-nowrap">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2 py-1.5 2xl:px-2.5 rounded-xl text-xs font-semibold leading-none transition-all duration-150 ${isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Notifications & Login Section */}
        <div className="flex min-w-0 items-center justify-self-end gap-1 xl:gap-1.5">

          {/* Quick Simulate Incident Button */}
          <button
            onClick={() => setSimulateModalOpen(true)}
            className="hidden xl:flex items-center justify-center w-7 h-7 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-all shadow-subtle hover:scale-105"
            title="Simulate Water Contamination & Multi-Agent Response"
            aria-label="Simulate Incident"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="sr-only">Simulate Incident</span>
          </button>

          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 transition-colors"
            title="Search incidents, tickets, carbon projects (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="sr-only">Search AURIS</span>
            <kbd className="hidden text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Talk to AURIS AI Button */}
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-all shadow-subtle hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="sr-only">Talk to AURIS</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Drawer */}
            <AnimatePresence>
              {notifDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-floating p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                    ) : (
                      notifications.map((notif: NotificationItem) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${!notif.read
                              ? 'bg-sky-50/50 border-sky-100 hover:bg-sky-50'
                              : 'bg-white border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-800 leading-snug">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-slate-200"></div>

          {/* DEDICATED GOOGLE LOGIN & ROLE SECTION */}
          <div className="flex items-center gap-2">

            {/* Quick Login Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center justify-center w-8 h-8 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl text-xs font-bold text-sky-900 transition-all hover:scale-105 shadow-sm"
              title="Select Role & Sign In with Google Mail (ananyasingh561329@gmail.com)"
            >
              <GoogleLogo className="w-4 h-4" />
              <span className="sr-only">Login</span>
            </button>

            {/* Active User / Role Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-subtle"
              >
                <div className="text-left hidden">
                  <p className="text-[11px] font-bold text-slate-900 leading-none truncate max-w-[120px]">
                    Ananya Singh
                  </p>
                  <p className="text-[10px] text-sky-600 font-semibold leading-tight mt-0.5 truncate max-w-[120px]">
                    {userProfile.roleBadge}
                  </p>
                </div>
                <div className="relative">
                  <SafeImage
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    fallbackType="avatar"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full p-[1px] shadow">
                    <GoogleLogo className="w-full h-full" />
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher & Google Login Menu */}
              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-floating p-3 z-[1200]"
                  >
                    {/* Active Google Account Header */}
                    <div className="px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Google Identity
                        </span>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1">Ananya Singh</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate">ananyasingh561329@gmail.com</p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Current Role:</span>
                        <span className="font-bold text-sky-700">{userProfile.roleBadge}</span>
                      </div>
                    </div>

                    {/* Primary Trigger: Login modal */}
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        setLoginModalOpen(true);
                      }}
                      className="w-full mb-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <GoogleLogo className="w-3.5 h-3.5" />
                      <span>Select Role & Sign In with Google</span>
                    </button>

                    {/* Role quick list */}
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
                      Quick Switch (13 Roles):
                    </div>
                    <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                      {(Object.keys(USER_ROLES) as RoleId[]).map((roleKey) => {
                        const profile = USER_ROLES[roleKey];
                        const isCurrent = currentRole === roleKey;
                        return (
                          <button
                            key={roleKey}
                            onClick={() => {
                              setRole(roleKey);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors ${isCurrent
                                ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                                : 'hover:bg-slate-100 text-slate-700 font-medium'
                              }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <SafeImage
                                src={profile.avatar}
                                alt={profile.name}
                                fallbackType="avatar"
                                className="w-5 h-5 rounded-md object-cover"
                              />
                              <span className="truncate">{profile.roleBadge}</span>
                            </div>
                            {isCurrent && <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Reset & Sign Out */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setRole('CITY_ADMIN');
                          setActiveTab('overview');
                          setRoleDropdownOpen(false);
                        }}
                        className="flex-1 py-1.5 px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 rounded-lg text-center transition-colors"
                      >
                        Reset to Admin
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="py-1.5 px-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile navigation tab bar */}
      <div className="xl:hidden border-t border-slate-100 bg-white/95">
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
