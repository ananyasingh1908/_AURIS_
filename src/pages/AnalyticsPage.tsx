import React from 'react';
import { useAuris } from '../store/AurisContext';
import {
  TrendingUp,
  Activity,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  Coins,
  CheckCircle2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { incidents, complaints, carbonPortfolio, overallCityHealth } = useAuris();

  // Resolution time trend data
  const resolutionTrendData = [
    { month: 'Apr', avgHours: 19.4, tickets: 320 },
    { month: 'May', avgHours: 17.8, tickets: 410 },
    { month: 'Jun', avgHours: 16.2, tickets: 490 },
    { month: 'Jul', avgHours: 14.1, tickets: 580 },
    { month: 'Aug', avgHours: 12.5, tickets: 620 },
    { month: 'Sep', avgHours: 11.4, tickets: 740 }
  ];

  // Incidents by department
  const deptDistributionData = [
    { dept: 'Water', count: 18, resolved: 14 },
    { dept: 'Mobility', count: 24, resolved: 21 },
    { dept: 'Waste', count: 12, resolved: 11 },
    { dept: 'Environment', count: 9, resolved: 8 },
    { dept: 'Infrastructure', count: 22, resolved: 18 },
    { dept: 'Energy', count: 8, resolved: 7 },
    { dept: 'Health', count: 5, resolved: 5 }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Municipal & Climate Analytics Hub
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Cross-jurisdictional municipal KPI performance, AI detection latencies, and ESG abatement metrics
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Mean Time to Resolve (MTTR)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-black text-slate-900">11.4 hrs</span>
            <span className="text-xs font-bold text-emerald-600">-41% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From automated AI dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AI Classification Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-black text-sky-700">94.8%</span>
            <span className="text-xs font-bold text-sky-600">Zero-Shot</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Citizen multi-modal inputs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Citizen Satisfaction (CSAT)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-black text-emerald-600">89.2%</span>
            <span className="text-xs font-bold text-emerald-600">+4.8%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on post-ticket feedback</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Permanent CO₂ Abatement
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-2xl font-black text-emerald-700">
              {carbonPortfolio.co2ImpactTons.toLocaleString()} t
            </span>
            <span className="text-xs font-bold text-emerald-600">Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Audited via Gold Standard</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: MTTR Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Average Resolution Time Trajectory</h3>
              <p className="text-[11px] text-slate-400">Hours from citizen submission to resolution</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
              Faster Response
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="avgHours" name="Avg Hours to Resolve" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department Incident Volume & Clearance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Department Workload & Clearance Rate</h3>
              <p className="text-[11px] text-slate-400">Total assigned vs. successfully resolved tickets</p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg">
              Active Teams
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptDistributionData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Total Assigned" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
