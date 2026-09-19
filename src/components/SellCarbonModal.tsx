import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { CarbonProjectType, VerificationStatus } from '../types';
import {
  X,
  Plus,
  Coins,
  ShieldCheck,
  MapPin,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SellCarbonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellCarbonModal: React.FC<SellCarbonModalProps> = ({ isOpen, onClose }) => {
  const { listCarbonProject, userProfile } = useAuris();

  const [projectName, setProjectName] = useState('');
  const [country, setCountry] = useState('India');
  const [cityRegion, setCityRegion] = useState('Gujarat Coastal Belt');
  const [developer, setDeveloper] = useState(userProfile.departmentName || 'Nordic Carbon Solutions');
  const [type, setType] = useState<CarbonProjectType>('Solar');
  const [creditsAvailable, setCreditsAvailable] = useState<number>(50000);
  const [pricePerCredit, setPricePerCredit] = useState<number>(18.00);
  const [standardsBody, setStandardsBody] = useState('Gold Standard & Verra');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number>(22.2587);
  const [longitude, setLongitude] = useState<number>(71.1924);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!projectName.trim()) {
      nextErrors.projectName = 'Project name is required.';
    }

    if (!description.trim()) {
      nextErrors.description = 'Add a project description and proof of additionality.';
    } else if (description.trim().length < 25) {
      nextErrors.description = 'Please share more detail so the listing is credible and verifiable.';
    }

    if (!Number.isFinite(creditsAvailable) || creditsAvailable <= 0) {
      nextErrors.creditsAvailable = 'Credits available must be greater than zero.';
    }

    if (!Number.isFinite(pricePerCredit) || pricePerCredit <= 0) {
      nextErrors.pricePerCredit = 'Price per credit must be greater than zero.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    listCarbonProject({
      name: projectName,
      country,
      cityRegion,
      developer,
      type,
      co2ReductionTons: creditsAvailable * 1.5,
      creditsAvailable,
      pricePerCredit,
      verificationStatus: 'Verified',
      projectStatus: 'Active',
      description,
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      latitude,
      longitude,
      vintage: '2026',
      standardsBody,
      integrityScore: 92,
      mrvEvents: [
        {
          date: new Date().toISOString().split('T')[0],
          stage: 'Project Listed on AURIS Exchange',
          verifier: standardsBody,
          note: 'Initial registry submission & integrity baseline recorded.'
        }
      ],
      impactMetrics: {
        cleanPowerMWh: '1,200,000 MWh/yr',
        familiesImpacted: '45,000 Families'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-floating border border-slate-200 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
              Carbon Developer Portal
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">List Verified Carbon Project</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (formErrors.projectName) {
                  setFormErrors((prev) => ({ ...prev, projectName: '' }));
                }
              }}
              placeholder="e.g. Thar Desert High-Efficiency Solar Microgrid"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:bg-white"
            />
            {formErrors.projectName && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{formErrors.projectName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none"
              >
                <option>Solar</option>
                <option>Wind</option>
                <option>Reforestation</option>
                <option>Clean Cooking</option>
                <option>Waste-to-Energy</option>
                <option>EV Infrastructure</option>
                <option>Energy Efficiency</option>
                <option>Sustainable Agriculture</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standards Body</label>
              <select
                value={standardsBody}
                onChange={(e) => setStandardsBody(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none"
              >
                <option>Gold Standard & Verra</option>
                <option>Verra VCS + CCB Gold</option>
                <option>American Carbon Registry (ACR)</option>
                <option>Australian ACCU</option>
                <option>UK Peatland Code</option>
                <option>J-Credit Scheme</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Region / Basin</label>
              <input
                type="text"
                required
                value={cityRegion}
                onChange={(e) => setCityRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Credits Available (Tons)</label>
              <input
                type="number"
                min="100"
                required
                value={creditsAvailable}
                onChange={(e) => {
                  setCreditsAvailable(Number(e.target.value));
                  if (formErrors.creditsAvailable) {
                    setFormErrors((prev) => ({ ...prev, creditsAvailable: '' }));
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
              />
              {formErrors.creditsAvailable && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{formErrors.creditsAvailable}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Price Per Credit ($ USD)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={pricePerCredit}
                onChange={(e) => {
                  setPricePerCredit(Number(e.target.value));
                  if (formErrors.pricePerCredit) {
                    setFormErrors((prev) => ({ ...prev, pricePerCredit: '' }));
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
              />
              {formErrors.pricePerCredit && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{formErrors.pricePerCredit}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Additionality Proof *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (formErrors.description) {
                  setFormErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Describe permanence, community benefits, and baseline displacement..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none"
            />
            {formErrors.description && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{formErrors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
            >
              Publish to Global Exchange
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};
