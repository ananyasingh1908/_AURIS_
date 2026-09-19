import React, { useState } from 'react';
import { useAuris } from '../store/AurisContext';
import { CarbonProject } from '../types';
import {
  X,
  ShieldCheck,
  MapPin,
  Coins,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TreePine,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BuyCarbonModalProps {
  project: CarbonProject | null;
  onClose: () => void;
}

export const BuyCarbonModal: React.FC<BuyCarbonModalProps> = ({ project, onClose }) => {
  const { buyCarbonCredits, userProfile } = useAuris();
  const [quantity, setQuantity] = useState<number>(10000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  if (!project) return null;

  const maxAvailable = project.creditsAvailable;
  const clampedQty = Math.min(Math.max(1, quantity), maxAvailable);
  const totalCost = clampedQty * project.pricePerCredit;

  const handleConfirm = () => {
    if (!Number.isFinite(quantity) || quantity < 1) {
      setValidationError('Please enter a valid quantity greater than zero.');
      return;
    }

    if (quantity > maxAvailable) {
      setValidationError(`Only ${maxAvailable.toLocaleString()} credits are available for this project.`);
      return;
    }

    setValidationError('');
    setIsProcessing(true);
    setTimeout(() => {
      const ok = buyCarbonCredits(project.id, clampedQty);
      setIsProcessing(false);
      if (ok) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setValidationError('This purchase could not be completed. Please check the remaining balance.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-floating border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {project.type} Offset Purchase
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{project.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {project.cityRegion}, {project.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {purchaseSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Purchase Confirmed!</h4>
            <p className="text-xs text-slate-500">
              {clampedQty.toLocaleString()} credits added to your portfolio.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">

            {/* Price & Available */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Price Per Credit</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  ${project.pricePerCredit.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ ton CO₂</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Available Inventory</span>
                <p className="text-base font-black text-emerald-700 mt-0.5">
                  {maxAvailable.toLocaleString()} <span className="text-xs font-normal text-slate-500">tons</span>
                </p>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span>Credit Quantity (Metric Tons)</span>
                <span className="font-mono text-emerald-700">{clampedQty.toLocaleString()} tCO₂</span>
              </div>
              <input
                type="number"
                min="1"
                max={maxAvailable}
                value={quantity}
                onChange={(e) => {
                  const nextValue = Number(e.target.value);
                  setQuantity(nextValue);
                  if (nextValue > maxAvailable) {
                    setValidationError(`Only ${maxAvailable.toLocaleString()} credits are available.`);
                  } else {
                    setValidationError('');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
              {validationError && (
                <p className="mt-2 text-[11px] font-medium text-rose-600">{validationError}</p>
              )}

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 mt-2">
                {[1000, 5000, 10000, 25000, 50000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQuantity(val)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-[11px] font-semibold text-slate-600"
                  >
                    +{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Calculation Card */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950">Total Settlement Value</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Registry verification fee & double-counting audit included
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-xl font-black text-emerald-800">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-emerald-600 block uppercase font-bold">USD</span>
              </div>
            </div>

            {/* Standards & Buyer */}
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
              <span>Standard: <strong className="text-slate-800">{project.standardsBody}</strong></span>
              <span>Buyer: <strong className="text-slate-800">{userProfile.name}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing || clampedQty <= 0}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-premium flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>{isProcessing ? 'Verifying on Ledger...' : 'Confirm Purchase'}</span>
              </button>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
};
