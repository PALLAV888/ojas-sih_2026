import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Search, Check, AlertCircle, Sparkles } from 'lucide-react';
import { linkPatientToPractitioner } from '../firebase/firestoreService';
import { LinkedPatient } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  practitionerId: string;
  onPatientAdded: (newPatient: LinkedPatient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  practitionerId,
  onPatientAdded
}) => {
  const [patientIdInput, setPatientIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientIdInput.trim()) {
      setError('Please enter a valid Patient ID');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await linkPatientToPractitioner(practitionerId, patientIdInput.trim());
      if (res.success && res.patient) {
        setSuccessMsg(`Successfully linked patient ${res.patient.name}!`);
        onPatientAdded(res.patient);
        setTimeout(() => {
          onClose();
          setPatientIdInput('');
          setSuccessMsg(null);
        }, 1200);
      } else {
        setError(res.error || 'Patient not found. Please verify the ID.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to link patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-add-patient-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-[#3E2C23]/15 shadow-2xl max-w-md w-full p-6 sm:p-8 text-left relative overflow-hidden"
        >
          {/* Close button */}
          <button
            id="btn-close-add-patient-modal"
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-[#3B5D3A]/10 text-[#3B5D3A] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#3E2C23]">
                Add a Patient
              </h3>
              <p className="text-xs text-[#3E2C23]/60">
                Link a patient using their unique Patient ID
              </p>
            </div>
          </div>

          {error && (
            <div 
              id="add-patient-error"
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div 
              id="add-patient-success"
              className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input-patient-id" className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
                Enter Patient ID *
              </label>
              <input
                id="input-patient-id"
                type="text"
                required
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. OJ-2026-A4B7"
                className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] font-mono text-sm uppercase tracking-wider text-[#3E2C23]"
              />
              <p className="text-[11px] text-[#3E2C23]/60 mt-1.5">
                Ask your patient for the Patient ID shown on their dashboard.
              </p>
            </div>

            {/* Quick Demo ID hint */}
            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#3E2C23]/10 text-xs text-[#3E2C23]/80 space-y-1">
              <span className="font-semibold text-[11px] text-[#C1502E]">💡 Try Demo Patient IDs:</span>
              <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setPatientIdInput('OJ-2026-A4B7')}
                  className="px-2 py-0.5 rounded-lg bg-white border border-[#3E2C23]/15 hover:bg-neutral-50 cursor-pointer"
                >
                  OJ-2026-A4B7 (Arjun)
                </button>
                <button
                  type="button"
                  onClick={() => setPatientIdInput('OJ-2026-M8K2')}
                  className="px-2 py-0.5 rounded-lg bg-white border border-[#3E2C23]/15 hover:bg-neutral-50 cursor-pointer"
                >
                  OJ-2026-M8K2 (Meera)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#3E2C23]/20 text-[#3E2C23] text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-add-patient"
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#3B5D3A] hover:bg-[#2F4A2E] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <span>{loading ? 'Linking...' : 'Add Patient →'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
