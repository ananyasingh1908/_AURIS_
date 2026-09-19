import React, { useRef, useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { GeospatialMap } from '../maps/GeospatialMap';
import { Complaint, ComplaintStatus } from '../types';
import { SafeImage } from '../components/SafeImage';

import {
  FileText,
  MapPin,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  AlertCircle,
  BrainCircuit,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle,
  Search,
  Layers,
  Flame,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { sendGeminiMessage } from '../services/aiChatService';

export const CitizenPage: React.FC = () => {
  const {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    submitComplaint,
    updateComplaintStatus,
    complaintClusters,
    operationalizeCluster,
    userProfile,
    currentCity,
    currentCountry
  } = useAuris() as any;

  const [activeTab, setActiveTab] = useState<'report' | 'clusters' | 'my-complaints' | 'ask-auris'>('report');

  // Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [category, setCategory] = useState('Water & Drainage');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Hill Road, Bandra West, Mumbai');
  const [coords, setCoords] = useState<[number, number]>([19.0558, 72.8335]);
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [cvAnalysis, setCvAnalysis] = useState<string>('Upload a clear photo to create an evidence preview for the civic report.');
  const [photoName, setPhotoName] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [aiPreviewData, setAiPreviewData] = useState<{
    category: string;
    dept: string;
    severity: string;
    confidence: number;
    affected: string[];
  } | null>(null);

  // Ask AURIS quick chat inside citizen page
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatThread, setChatThread] = useState<Array<{ sender: 'user' | 'auris'; text: string; time: string }>>([
    {
      sender: 'auris',
      text: 'Hi Ananya! I am the AURIS Citizen Intelligence Assistant powered by Google Gemini. How can I help you today with your neighborhood signals, complaint status, or civic inquiries?',
      time: 'Just now'
    }
  ]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const query = chatInput.trim();
    const userMsg = { sender: 'user' as const, text: query, time: 'Just now' };
    setChatThread((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const history = chatThread.map((m) => ({ sender: m.sender, text: m.text }));
      const response = await sendGeminiMessage(query, history, {
        role: 'CITIZEN',
        city: currentCity,
        country: currentCountry
      });

      setChatThread((prev) => [
        ...prev,
        { sender: 'auris' as const, text: response.reply, time: 'Just now' }
      ]);
    } catch (err: any) {
      setChatThread((prev) => [
        ...prev,
        {
          sender: 'auris' as const,
          text: `⚠️ Error connecting to Gemini AI: ${err.message || 'Please check backend server connection.'}`,
          time: 'Just now'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 12) {
      const lower = text.toLowerCase();
      let dept = 'Infrastructure Department';
      let cat = 'Infrastructure';
      const affected = [];

      if (lower.includes('water') || lower.includes('drain') || lower.includes('flood') || lower.includes('pipe')) {
        dept = 'Water & Drainage Department';
        cat = 'Water & Drainage';
        affected.push('Water & Drainage', 'Public Safety');
      } else if (lower.includes('pothole') || lower.includes('road') || lower.includes('crack')) {
        dept = 'Infrastructure Department';
        cat = 'Roads & Infrastructure';
        affected.push('Mobility', 'Infrastructure');
      } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste')) {
        dept = 'Waste Management Department';
        cat = 'Waste Management';
        affected.push('Public Health', 'Environment');
      } else {
        affected.push('Citizen Services');
      }

      setAiPreviewData({
        category: cat,
        dept,
        severity: lower.includes('severe') || lower.includes('danger') || lower.includes('flood') ? 'High' : 'Medium',
        confidence: 95,
        affected
      });
    } else {
      setAiPreviewData(null);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(String(reader.result));
      setPhotoName(file.name);
      setCvAnalysis(`Photo received: ${file.name}. AI Computer Vision will use this evidence with the selected category and report description.`);
    };
    reader.readAsDataURL(file);
  };

  const validateComplaint = () => {
    const nextErrors: Record<string, string> = {};

    if (!issueTitle.trim()) {
      nextErrors.issueTitle = 'Please enter a short headline for the issue.';
    }

    if (!description.trim()) {
      nextErrors.description = 'Please describe the problem and any safety concerns.';
    } else if (description.trim().length < 20) {
      nextErrors.description = 'Please add a bit more detail so the AI can classify the issue correctly.';
    }

    if (!locationName.trim()) {
      nextErrors.locationName = 'Please enter a valid location or select one on the map.';
    }

    if (!Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) {
      nextErrors.locationName = 'The selected coordinates are invalid. Please click a location on the map.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateComplaint()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitComplaint({
        issue: issueTitle,
        category,
        description,
        location: locationName,
        latitude: coords[0],
        longitude: coords[1],
        severity,
        image: photoPreview
      });
      setSelectedComplaint(created);
      setIsSubmitting(false);
      setActiveTab('my-complaints');
      setIssueTitle('');
      setDescription('');
      setLocationName('Hill Road, Bandra West, Mumbai');
      setPhotoPreview('');
      setPhotoName('');
      setCvAnalysis('Upload a clear photo to create an evidence preview for the civic report.');
      setFormErrors({});
      setAiPreviewData(null);
    }, 600);
  };

  const activeComplaint = selectedComplaint || complaints[0];

  if (activeTab === 'my-complaints' && complaints.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-subtle">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">No complaints yet</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            You haven’t submitted any citizen reports yet. Start with a new issue to track status, AI verification, and department response.
          </p>
          <button
            onClick={() => setActiveTab('report')}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white"
          >
            File a new report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const lifecycleSteps: ComplaintStatus[] = [
    'Submitted',
    'AI Verified',
    'Assigned',
    'Inspection',
    'In Progress',
    'Resolved'
  ];

  const getStepIndex = (status: ComplaintStatus) => lifecycleSteps.indexOf(status);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Citizen Intelligence Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Report civic issues, track multi-signal spatial clusters, and view real-time resolution lifecycles
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-subtle overflow-x-auto">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'report' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report a Problem
          </button>
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'clusters' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Complaint Clusters (38 Signals)
          </button>
          <button
            onClick={() => setActiveTab('my-complaints')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'my-complaints' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('ask-auris')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
              activeTab === 'ask-auris' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Ask AURIS</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Report a Problem Form */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form (Left 6 Cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Submit New Civic Report</span>
              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                AI Powered NLP & Computer Vision
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Headline *</label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => {
                  setIssueTitle(e.target.value);
                  if (formErrors.issueTitle) {
                    setFormErrors((prev) => ({ ...prev, issueTitle: '' }));
                  }
                }}
                placeholder="e.g. Waterlogging near bus stop and failing storm drain"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white"
              />
              {formErrors.issueTitle && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.issueTitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                >
                  <option>Water & Drainage</option>
                  <option>Traffic & Mobility</option>
                  <option>Waste Management</option>
                  <option>Roads & Infrastructure</option>
                  <option>Air Quality & Environment</option>
                  <option>Power & Streetlights</option>
                  <option>Public Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                >
                  <option value="Low">Low (Minor issue)</option>
                  <option value="Medium">Medium (Moderate disruption)</option>
                  <option value="High">High (Impacting transit/safety)</option>
                  <option value="Critical">Critical (Hazard/Flash Flood)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Symptoms *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  handleDescriptionChange(e.target.value);
                  if (formErrors.description) {
                    setFormErrors((prev) => ({ ...prev, description: '' }));
                  }
                }}
                placeholder="Describe what is happening, duration, and safety hazards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white"
              />
              {formErrors.description && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Photo Upload & Simulated Computer Vision Classification */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Photo Evidence & AI Computer Vision</span>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {photoPreview ? 'Replace Photo' : 'Upload Photo'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {photoPreview ? (
                    <SafeImage src={photoPreview} alt="Citizen evidence preview" fallbackType="incident" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-700 space-y-0.5">
                  <span className="font-bold text-sky-900 block text-[11px]">AI Feature Extraction:</span>
                  <p className="text-[11px] text-slate-600 italic leading-snug">{cvAnalysis}</p>
                  {photoName && <span className="block max-w-[290px] truncate text-[10px] font-medium text-slate-400">{photoName}</span>}
                </div>
              </div>
            </div>

            {/* AI Realtime NLP Preview */}
            {aiPreviewData && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <BrainCircuit className="w-4 h-4 text-sky-600" />
                    <span>AURIS AI Classification Preview</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                    {aiPreviewData.confidence}% Match
                  </span>
                </div>
                <div className="text-xs text-slate-700 flex items-center justify-between pt-1">
                  <span>Routing to: <strong className="text-slate-900">{aiPreviewData.dept}</strong></span>
                  <span>Impacted: <strong className="text-slate-900">{aiPreviewData.affected.join(', ')}</strong></span>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selected Location (Click or drag pin on map)
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  if (formErrors.locationName) {
                    setFormErrors((prev) => ({ ...prev, locationName: '' }));
                  }
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
              />
              {formErrors.locationName && (
                <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.locationName}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-premium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Routing to Municipal Work Orders...</span>
              ) : (
                <>
                  <span>Submit Ticket to Municipal Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Map (Right 6 Cols) */}
          <div className="lg:col-span-6 min-w-0 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Interactive Geospatial Pinpoint</span>
                <span className="text-[11px] text-slate-400">Click or drag pin to select exact coordinates.</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-700">{coords[0].toFixed(4)}, {coords[1].toFixed(4)}</span>
            </div>

            <GeospatialMap
              isDraggableCitizenPin={true}
              citizenPinPosition={coords}
              onCitizenPinChange={(lat, lng) => {
                setCoords([lat, lng]);
                setLocationName(`Selected Coords (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              }}
              center={coords}
              zoom={13}
              height="clamp(360px, 58vh, 460px)"
            />
          </div>

        </div>
      )}

      {/* TAB 2: Citizen Complaint Clustering (38 Signals -> 1 Urban Issue) */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AURIS Differentiator: Spatial Signal Clustering
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">38 Citizen Signals → 1 Operational Urban Issue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Eliminates redundant ticket processing by aggregating localized citizen submissions into a single operational work order.
                </p>
              </div>

              {complaintClusters[0]?.status === 'Forming' ? (
                <button
                  onClick={() => operationalizeCluster(complaintClusters[0].id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
                >
                  Convert to Municipal Work Order
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Operational Work Order Dispatched
                </span>
              )}
            </div>

            {complaintClusters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm border border-slate-200">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No complaint clusters available yet</h4>
                <p className="mt-1 text-xs text-slate-500">Reports will appear here once citizens submit nearby issues in the same area.</p>
              </div>
            ) : (
              <>
                {complaintClusters.map((cluster: any) => (
                  <div key={cluster.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{cluster.title}</h4>
                      <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                        {cluster.signalsCount} Distinct Submissions
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {cluster.aiAnalysis}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Location Center</span>
                        <span className="font-bold text-slate-800">{cluster.centerLocation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Department</span>
                        <span className="font-bold text-slate-800">{cluster.department}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Status</span>
                        <span className="font-bold text-emerald-700">{cluster.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Track Complaints (Lifecycle View) */}
      {activeTab === 'my-complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-subtle space-y-3 max-h-[640px] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900">Your Civic Tickets</span>
              <span className="text-xs text-slate-400 font-semibold">{complaints.length} Total</span>
            </div>

            {complaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm border border-slate-200">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No civic tickets yet</h4>
                <p className="mt-1 text-xs text-slate-500">Submit your first report to track it here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {complaints.map((comp: any) => {
                  const isSelected = activeComplaint?.id === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComplaint(comp)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-400 shadow-premium'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-sky-700">#{comp.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          comp.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : comp.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{comp.issue}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {comp.location}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {activeComplaint ? (
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                      #{activeComplaint.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{activeComplaint.category}</span>
                    <span className="text-[11px] text-slate-400">• Created {activeComplaint.createdAt}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {activeComplaint.issue}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {activeComplaint.location}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned To</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{activeComplaint.department}</span>
                  <span className="text-[11px] text-emerald-600 font-medium">ETA: {activeComplaint.expectedResolution}</span>
                </div>
              </div>

              {/* Visual Interactive Lifecycle Tracker */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                  End-to-End Ticket Lifecycle
                </span>
                
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 z-0"></div>
                  <div
                    className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-sky-500 z-0 transition-all duration-500"
                    style={{
                      width: `${(getStepIndex(activeComplaint.status) / (lifecycleSteps.length - 1)) * 90}%`
                    }}
                  ></div>

                  {lifecycleSteps.map((step, idx) => {
                    const isPassed = getStepIndex(activeComplaint.status) >= idx;
                    const isCurrent = activeComplaint.status === step;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCurrent
                              ? 'bg-sky-600 border-white text-white ring-4 ring-sky-100 shadow-md'
                              : isPassed
                              ? 'bg-sky-500 border-white text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold mt-2 text-center whitespace-nowrap ${
                          isCurrent ? 'text-sky-700' : isPassed ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advance Ticket State Action Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Department Action Controls</span>
                  <p className="text-[11px] text-slate-500">
                    Advance this ticket through inspection to verified resolution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {['Inspection', 'In Progress', 'Resolved'].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() =>
                        updateComplaintStatus(
                          activeComplaint.id,
                          statusOption as ComplaintStatus,
                          `Status advanced to ${statusOption} by ${userProfile.roleBadge}.`
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        activeComplaint.status === statusOption
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Live Dispatch Activity Timeline
                </span>
                {activeComplaint.updates.map((update: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-800">{update.title}</span>
                        <span className="text-[10px] text-slate-400">{update.timestamp}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{update.note}</p>
                      <span className="text-[10px] text-sky-600 font-semibold block mt-1">
                        Actor: {update.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 4: Ask AURIS Conversational Assistant */}
      {activeTab === 'ask-auris' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 p-[2px]">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Citizen AI Consultation Hub</h3>
              <p className="text-xs text-slate-500">Ask questions about city operations, complaint lifecycles, and air quality</p>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {chatThread.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g. What is the status of my complaint?"
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
