import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Check,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAppointmentsByPractitioner,
  confirmAppointment,
  rejectAppointment,
  completeAppointment
} from '../firebase/firestoreService';

interface PractitionerAppointmentsProps {
  onSelectPatient?: (patientId: string) => void;
}

export const PractitionerAppointments: React.FC<PractitionerAppointmentsProps> = ({
  onSelectPatient
}) => {
  const { user } = useAuth();
  const pracId = user?.id || 'doc-radha';

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, [pracId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const list = await getAppointmentsByPractitioner(pracId);
      setAppointments(list);
    } catch (e) {
      console.error('Error loading practitioner appointments:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (aptId: string) => {
    await confirmAppointment(aptId);
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'confirmed' } : a))
    );
  };

  const handleReject = async (aptId: string) => {
    await rejectAppointment(aptId, rejectReason || 'Practitioner schedule conflict');
    setRejectingId(null);
    setRejectReason('');
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'rejected' } : a))
    );
  };

  const handleComplete = async (aptId: string) => {
    await completeAppointment(aptId);
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'completed' } : a))
    );
  };

  const pendingApts = appointments.filter((a) => a.status === 'pending');
  const confirmedApts = appointments.filter((a) => a.status === 'confirmed');
  const pastApts = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'rejected' || a.status === 'cancelled'
  );

  return (
    <div id="practitioner-appointments-page" className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
          Clinical Appointment Management
        </h1>
        <p className="text-xs text-[#6b7280]">
          Review intake requests, confirm consultation times, and record completed Ayurvedic visits
        </p>
      </div>

      {/* 1. Pending Appointments List */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
              Pending Consultation Requests ({pendingApts.length})
            </h2>
          </div>
          <span className="text-xs text-[#6b7280]">Requires Doctor Action</span>
        </div>

        {pendingApts.length === 0 ? (
          <p className="text-xs text-[#6b7280] py-4 text-center">
            No pending appointment requests at this moment.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">
                      {apt.patientName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-gray-600 border">
                      {apt.patientId}
                    </span>
                  </div>

                  <div className="text-xs text-[#6b7280] flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-[#1a1a1a]">
                      <Calendar className="w-3.5 h-3.5 text-[#1f5233]" />
                      {apt.appointmentDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1a3d5c]" />
                      {apt.appointmentTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {apt.patientContact || '+91 98201 44521'}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-gray-700 bg-white/80 p-2 rounded-lg border border-amber-200/60 mt-2">
                      <span className="font-semibold">Symptoms/Notes:</span> {apt.notes}
                    </p>
                  )}
                </div>

                {/* Actions: Confirm / Reject */}
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id={`btn-confirm-apt-${apt.id}`}
                    onClick={() => handleConfirm(apt.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm</span>
                  </button>

                  <button
                    type="button"
                    id={`btn-reject-apt-${apt.id}`}
                    onClick={() => setRejectingId(apt.id)}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-[#1a1a1a]">
              Reason for Declining Appointment
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Schedule fully booked, please select alternate afternoon slot..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(rejectingId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirmed Appointments List */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
              Confirmed Scheduled Appointments ({confirmedApts.length})
            </h2>
          </div>
          <span className="text-xs text-[#6b7280]">Active Consultations</span>
        </div>

        {confirmedApts.length === 0 ? (
          <p className="text-xs text-[#6b7280] py-4 text-center">
            No confirmed appointments currently booked.
          </p>
        ) : (
          <div className="space-y-4">
            {confirmedApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">
                      {apt.patientName}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <div className="text-xs text-[#6b7280] flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-[#1a1a1a]">
                      <Calendar className="w-3.5 h-3.5 text-[#1f5233]" />
                      {apt.appointmentDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1a3d5c]" />
                      {apt.appointmentTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {apt.patientContact || '+91 98450 11299'}
                    </span>
                  </div>
                </div>

                {/* Actions: Mark Completed + Patient Records link */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {onSelectPatient && (
                    <button
                      type="button"
                      id={`btn-view-records-${apt.patientId}`}
                      onClick={() => onSelectPatient(apt.patientId)}
                      className="px-3 py-1.5 rounded-lg border border-[#1a3d5c] text-[#1a3d5c] text-xs font-semibold hover:bg-[#1a3d5c]/5 flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Patient Records</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id={`btn-complete-apt-${apt.id}`}
                    onClick={() => handleComplete(apt.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Completed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Past Appointments */}
      {pastApts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            Consultation Archive ({pastApts.length})
          </h2>
          <div className="space-y-2">
            {pastApts.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#1a1a1a]">{apt.patientName}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-500">
                    {apt.appointmentDate} at {apt.appointmentTime}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    apt.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerAppointments;
