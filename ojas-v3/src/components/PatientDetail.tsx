import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Save,
  CheckCircle2,
  FileText,
  Wind,
  Flame,
  Droplets,
  Activity,
  Plus,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { ImprovementChart } from './ImprovementChart';
import {
  getPatientAssessments,
  getCheckInsByPatient,
  getPractitionerNotes,
  savePractitionerNotes,
  createAppointment
} from '../firebase/firestoreService';
import { AssessmentResult } from '../types';

interface PatientDetailProps {
  patientId: string;
  patientName?: string;
  onBack: () => void;
  onViewAssessmentReport?: (result: AssessmentResult) => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patientId,
  patientName,
  onBack,
  onViewAssessmentReport
}) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [notesSaving, setNotesSaving] = useState<boolean>(false);
  const [notesSaved, setNotesSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Follow-up scheduling modal state
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [followUpDate, setFollowUpDate] = useState<string>(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [followUpTime, setFollowUpTime] = useState<string>('11:00 AM');
  const [followUpReason, setFollowUpReason] = useState<string>('Follow-up Agni review & pulse check');
  const [followUpSuccess, setFollowUpSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [assList, chkList, savedNotes] = await Promise.all([
        getPatientAssessments(patientId, patientId),
        getCheckInsByPatient(patientId),
        getPractitionerNotes('prac-current', patientId)
      ]);
      setAssessments(assList);
      setCheckIns(chkList);
      setNotes(savedNotes || '');
    } catch (e) {
      console.error('Error loading patient detail:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setNotesSaving(true);
    try {
      await savePractitionerNotes('prac-current', patientId, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (e) {
      console.error('Error saving notes:', e);
    } finally {
      setNotesSaving(false);
    }
  };

  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({
        patientId,
        patientName: patientName || 'Patient',
        practitionerId: 'prac-current',
        appointmentDate: followUpDate,
        appointmentTime: followUpTime,
        notes: followUpReason
      });
      setShowFollowUpModal(false);
      setFollowUpSuccess(true);
      setTimeout(() => setFollowUpSuccess(false), 4000);
    } catch (e) {
      console.error('Error scheduling follow-up:', e);
    }
  };

  const latestAssessment = assessments[0];
  const primaryDosha = latestAssessment?.primaryDosha || 'Pitta';

  return (
    <div id="patient-detail-view" className="w-full max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d5c] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Registry</span>
      </button>

      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {patientName || 'Arjun Singh'}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border">
                {patientId}
              </span>
            </div>
            <div className="text-xs text-[#6b7280] flex flex-wrap items-center gap-3 mt-1">
              <span>Age: 34 Yrs</span>
              <span>•</span>
              <span className="capitalize">Gender: Male</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                +91 98201 44521
              </span>
            </div>
          </div>
        </div>

        {/* Prakriti Badge & Follow-up Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#fef9f3] border border-[#d4a574]/40 flex items-center gap-2">
            {primaryDosha === 'Vata' ? (
              <Wind className="w-4 h-4 text-[#d4a574]" />
            ) : primaryDosha === 'Pitta' ? (
              <Flame className="w-4 h-4 text-[#c97a4a]" />
            ) : (
              <Droplets className="w-4 h-4 text-[#1f5233]" />
            )}
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold">Prakriti</div>
              <div className="text-xs font-bold text-[#1a1a1a]">{primaryDosha} Dominant</div>
            </div>
          </div>

          <button
            type="button"
            id="btn-schedule-follow-up"
            onClick={() => setShowFollowUpModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {followUpSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Follow-up appointment successfully registered on clinic calendar.</span>
        </div>
      )}

      {/* Section 1: Clinical Assessment History */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
        <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#1f5233]" />
          <span>Diagnostic Assessment History ({assessments.length})</span>
        </h2>

        {assessments.length === 0 ? (
          <p className="text-xs text-[#6b7280]">No clinical assessments found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assessments.map((a, idx) => (
              <div
                key={a.id || idx}
                className="p-4 rounded-xl border border-gray-200 bg-[#fef9f3]/40 hover:bg-[#fef9f3] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#1a1a1a]">{a.primaryDosha} Type</span>
                    <span className="text-[10px] text-gray-500">{a.date || a.takenAt?.slice(0, 10)}</span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex mb-2">
                    <div style={{ width: `${a.vataPercentage}%` }} className="bg-[#d4a574]" />
                    <div style={{ width: `${a.pittaPercentage}%` }} className="bg-[#c97a4a]" />
                    <div style={{ width: `${a.kaphaPercentage}%` }} className="bg-[#1f5233]" />
                  </div>

                  <div className="text-[10px] text-[#6b7280] mb-3">
                    Vata {a.vataPercentage}% • Pitta {a.pittaPercentage}% • Kapha {a.kaphaPercentage}%
                  </div>
                </div>

                {onViewAssessmentReport && (
                  <button
                    type="button"
                    onClick={() => onViewAssessmentReport(a)}
                    className="text-xs font-semibold text-[#1f5233] hover:underline flex items-center gap-1 pt-2 border-t border-gray-100"
                  >
                    <span>View Full Clinical Report</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Daily Check-in Trajectory (ImprovementChart) */}
      <div>
        <ImprovementChart checkIns={checkIns} patientName={patientName} />
      </div>

      {/* Section 3: Practitioner Notes */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
              Confidential Practitioner Clinical Notes
            </h2>
            <p className="text-[11px] text-[#6b7280]">
              Private clinical observations, pulse attributes (Gati, Sparsha), and formulated RX.
            </p>
          </div>
          {notesSaved && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Enter diagnosis notes, Nadi pulse findings, tongue coating specifics, or prescribed Rasayana formulas..."
          className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden leading-relaxed"
        />

        <div className="flex justify-end mt-3">
          <button
            type="button"
            id="btn-save-practitioner-notes"
            disabled={notesSaving}
            onClick={handleSaveNotes}
            className="px-5 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{notesSaving ? 'Saving Notes...' : 'Save Notes to Patient EMR'}</span>
          </button>
        </div>
      </div>

      {/* Section 4: Schedule Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#1a1a1a]">
                Schedule Follow-up for {patientName || 'Patient'}
              </h3>
              <button
                type="button"
                onClick={() => setShowFollowUpModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleFollowUp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                  Follow-up Consultation Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                  Appointment Time
                </label>
                <select
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                  Clinical Objective / Reminder
                </label>
                <input
                  type="text"
                  value={followUpReason}
                  onChange={(e) => setFollowUpReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c]"
                >
                  Confirm Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
