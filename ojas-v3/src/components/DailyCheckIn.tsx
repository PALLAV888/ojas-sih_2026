import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Zap,
  Flame,
  Smile,
  HeartPulse,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Activity
} from 'lucide-react';
import { submitDailyCheckIn, hasCheckedInToday, getCheckInsByPatient } from '../firebase/firestoreService';

interface DailyCheckInProps {
  patientId: string;
  assessmentId?: string;
  onCheckInCompleted?: () => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  patientId,
  assessmentId,
  onCheckInCompleted
}) => {
  const { t } = useTranslation();
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState<boolean>(false);
  const [showPastModal, setShowPastModal] = useState<boolean>(false);
  const [pastCheckIns, setPastCheckIns] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states (1-5 scales)
  const [sleep, setSleep] = useState<number>(2);
  const [energy, setEnergy] = useState<number>(2);
  const [stress, setStress] = useState<number>(2);
  const [digestion, setDigestion] = useState<number>(2);
  const [mood, setMood] = useState<number>(2);
  const [treatmentFollowed, setTreatmentFollowed] = useState<'yes' | 'partially' | 'no'>('yes');

  useEffect(() => {
    const isDone = hasCheckedInToday(patientId);
    setAlreadyCheckedIn(isDone);
    loadPastCheckIns();
  }, [patientId]);

  const loadPastCheckIns = async () => {
    try {
      const records = await getCheckInsByPatient(patientId);
      setPastCheckIns(records);
    } catch (e) {
      console.warn('Error loading past check-ins:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitDailyCheckIn({
        patientId,
        assessmentId,
        sleep,
        energy,
        stress,
        digestion,
        mood,
        treatmentFollowed
      });
      setAlreadyCheckedIn(true);
      setSuccessMessage(t('patient.checkInCompletedToday'));
      loadPastCheckIns();
      if (onCheckInCompleted) {
        onCheckInCompleted();
      }
    } catch (err) {
      console.error('Submit check-in error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const scaleOptions = [
    { value: 1, label: 'Excellent / Very Low', emoji: '🌟', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    { value: 2, label: 'Good / Low', emoji: '🙂', color: 'bg-green-50 text-green-700 border-green-300' },
    { value: 3, label: 'Moderate', emoji: '😐', color: 'bg-amber-50 text-amber-700 border-amber-300' },
    { value: 4, label: 'Poor / High', emoji: '🙁', color: 'bg-orange-50 text-orange-700 border-orange-300' },
    { value: 5, label: 'Very Poor / Severe', emoji: '⚠️', color: 'bg-red-50 text-red-700 border-red-300' }
  ];

  if (alreadyCheckedIn) {
    return (
      <div id="daily-checkin-completed-card" className="bg-white rounded-xl p-5 border border-[#1f5233]/20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a]">
                {t('patient.checkInCompletedToday')}
              </h4>
              <p className="text-xs text-[#6b7280]">
                {t('patient.checkInCompletedDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-view-past-checkins"
              type="button"
              onClick={() => setShowPastModal(!showPastModal)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#fef9f3] text-[#1f5233] border border-[#1f5233]/30 hover:bg-[#1f5233]/5 transition-colors w-full sm:w-auto"
            >
              {t('patient.viewPastCheckIns')} ({pastCheckIns.length})
            </button>
          </div>
        </div>

        {/* Past checkins drawer */}
        {showPastModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <h5 className="text-xs font-bold text-[#1a3d5c] uppercase tracking-wider mb-2">
              Recent Wellness Entries
            </h5>
            {pastCheckIns.length === 0 ? (
              <p className="text-xs text-gray-500">No previous check-ins logged.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {pastCheckIns.slice(0, 7).map((chk: any) => (
                  <div
                    key={chk.id || chk.date}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#fef9f3] border border-[#a8b5a8]/20 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1f5233]" />
                      <span className="font-semibold text-[#1a1a1a]">{chk.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#6b7280]">
                        Adherence: <strong className="capitalize">{chk.treatmentFollowed}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1f5233]/10 text-[#1f5233]">
                        Wellness {chk.wellnessScore || 75}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div id="daily-checkin-form-card" className="bg-white rounded-xl p-5 border border-[#a8b5a8]/30 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#1f5233]" />
            <h3 className="text-lg font-bold text-[#1a1a1a]">
              {t('patient.dailyCheckInTitle')}
            </h3>
          </div>
          <p className="text-xs text-[#6b7280]">
            {t('patient.dailyCheckInSubtitle')}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d4a574]/20 text-[#1a1a1a]">
          Daily Reflection
        </span>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Sleep Quality */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#1a3d5c]" />
              {t('patient.sleepQuality')}
            </label>
            <span className="text-[11px] text-[#6b7280]">
              Selected: {scaleOptions.find((o) => o.value === sleep)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {scaleOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                id={`btn-sleep-${opt.value}`}
                onClick={() => setSleep(opt.value)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                  sleep === opt.value
                    ? 'border-[#1f5233] bg-[#1f5233] text-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm">{opt.emoji}</div>
                <div className="text-[10px] truncate">{opt.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {t('patient.energyLevel')}
            </label>
            <span className="text-[11px] text-[#6b7280]">
              Selected: {scaleOptions.find((o) => o.value === energy)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {scaleOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                id={`btn-energy-${opt.value}`}
                onClick={() => setEnergy(opt.value)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                  energy === opt.value
                    ? 'border-[#1f5233] bg-[#1f5233] text-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm">{opt.emoji}</div>
                <div className="text-[10px] truncate">{opt.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Stress Level */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-red-500" />
              {t('patient.stressLevel')}
            </label>
            <span className="text-[11px] text-[#6b7280]">
              Selected: {scaleOptions.find((o) => o.value === stress)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {scaleOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                id={`btn-stress-${opt.value}`}
                onClick={() => setStress(opt.value)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                  stress === opt.value
                    ? 'border-[#1f5233] bg-[#1f5233] text-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm">{opt.emoji}</div>
                <div className="text-[10px] truncate">{opt.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Digestion */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {t('patient.digestionQuality')}
            </label>
            <span className="text-[11px] text-[#6b7280]">
              Selected: {scaleOptions.find((o) => o.value === digestion)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {scaleOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                id={`btn-digestion-${opt.value}`}
                onClick={() => setDigestion(opt.value)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                  digestion === opt.value
                    ? 'border-[#1f5233] bg-[#1f5233] text-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm">{opt.emoji}</div>
                <div className="text-[10px] truncate">{opt.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Mood */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-teal-600" />
              {t('patient.moodState')}
            </label>
            <span className="text-[11px] text-[#6b7280]">
              Selected: {scaleOptions.find((o) => o.value === mood)?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {scaleOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                id={`btn-mood-${opt.value}`}
                onClick={() => setMood(opt.value)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                  mood === opt.value
                    ? 'border-[#1f5233] bg-[#1f5233] text-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm">{opt.emoji}</div>
                <div className="text-[10px] truncate">{opt.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 7th field: Treatment Followed */}
        <div className="pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-[#1a1a1a] block mb-2">
            {t('patient.treatmentAdherence')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 'yes', label: t('common.yes'), desc: 'Full adherence', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
              { val: 'partially', label: t('common.partially'), desc: 'Minor deviations', color: 'border-amber-500 bg-amber-50 text-amber-800' },
              { val: 'no', label: t('common.no'), desc: 'Skipped today', color: 'border-red-500 bg-red-50 text-red-800' }
            ].map((item) => (
              <label
                key={item.val}
                className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                  treatmentFollowed === item.val
                    ? `${item.color} font-bold ring-1 ring-offset-1 ring-[#1f5233]`
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="treatmentFollowed"
                  value={item.val}
                  checked={treatmentFollowed === item.val}
                  onChange={() => setTreatmentFollowed(item.val as any)}
                  className="sr-only"
                />
                <div className="text-xs">{item.label}</div>
                <div className="text-[10px] text-gray-500 font-normal">{item.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="btn-save-checkin"
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1f5233] text-white font-semibold text-xs tracking-wide hover:bg-[#1a3d5c] transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? t('common.loading') : t('patient.saveCheckIn')}
        </button>
      </form>
    </div>
  );
};

export default DailyCheckIn;
