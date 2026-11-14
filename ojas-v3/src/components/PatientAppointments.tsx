import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import {
  getAppointmentsByPatient,
  getPractitionersByVerification,
  createAppointment,
  cancelAppointment
} from '../firebase/firestoreService';
import { useAuth } from '../context/AuthContext';

interface PatientAppointmentsProps {
  patientId?: string;
  preselectedDoctorId?: string;
  preselectedDoctorName?: string;
  onAppointmentBooked?: () => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  patientId,
  preselectedDoctorId,
  preselectedDoctorName,
  onAppointmentBooked
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const activePatientId = patientId || user?.patientId || 'OJ-2026-A4B7';

  const [appointments, setAppointments] = useState<any[]>([]);
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(Boolean(preselectedDoctorId));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Booking form states
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>(preselectedDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [symptomNotes, setSymptomNotes] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [activePatientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apts, docs] = await Promise.all([
        getAppointmentsByPatient(activePatientId),
        getPractitionersByVerification(true)
      ]);
      setAppointments(apts);
      setPractitioners(docs);
      if (preselectedDoctorId) {
        setSelectedPractitionerId(preselectedDoctorId);
        setShowBookingModal(true);
      } else if (docs.length > 0 && !selectedPractitionerId) {
        setSelectedPractitionerId(docs[0].id);
      }
      // Set default date to tomorrow
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setSelectedDate(tomorrow);
    } catch (e) {
      console.error('Error loading appointments data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPractitionerId || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    try {
      const docObj = practitioners.find((p) => p.id === selectedPractitionerId);
      const newApt = await createAppointment({
        patientId: activePatientId,
        patientUserId: user?.id,
        patientName: user?.name || 'Patient',
        patientContact: '+91 98201 44521',
        practitionerId: selectedPractitionerId,
        practitionerName: docObj?.name || 'Ayurvedic Practitioner',
        clinicName: docObj?.clinicName || 'Ojas Clinical Practice',
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: symptomNotes
      });

      setAppointments((prev) => [newApt, ...prev]);
      setShowBookingModal(false);
      setSuccessMessage('Appointment request sent to Ayurvedic Practitioner!');
      setTimeout(() => setSuccessMessage(null), 5000);
      if (onAppointmentBooked) onAppointmentBooked();
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (aptId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(aptId);
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  // Generate next 7 days for date picker
  const getNext7Days = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() + i * 86400000);
      dates.push({
        iso: d.toISOString().split('T')[0],
        display: d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  const timeSlots = [
    { label: 'Morning', slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
    { label: 'Afternoon', slots: ['02:00 PM', '03:00 PM', '04:00 PM'] },
    { label: 'Evening', slots: ['05:00 PM', '06:00 PM'] }
  ];

  const upcomingApts = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const pastApts = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'rejected'
  );

  return (
    <div id="patient-appointments-page" className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
            Ayurvedic Consultations & Visits
          </h1>
          <p className="text-xs text-[#6b7280]">
            Schedule and manage clinical appointments with AYUSH certified practitioners
          </p>
        </div>

        <button
          type="button"
          id="btn-open-book-modal"
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upcoming Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3">
          Upcoming Appointments ({upcomingApts.length})
        </h2>

        {upcomingApts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#a8b5a8]/30">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-[#6b7280]">You have no upcoming consultations scheduled.</p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="mt-3 text-xs font-semibold text-[#1f5233] hover:underline"
            >
              Book with a verified Ayurvedic physician →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingApts.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1a1a1a]">
                        {apt.practitionerName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#6b7280] flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 font-medium text-[#1a1a1a]">
                        <Calendar className="w-3.5 h-3.5 text-[#1f5233]" />
                        {apt.appointmentDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1a3d5c]" />
                        {apt.appointmentTime}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {apt.clinicName}
                    </div>
                    {apt.notes && (
                      <p className="text-xs text-gray-600 mt-2 p-2 rounded bg-gray-50">
                        <span className="font-semibold text-gray-700">Notes:</span> {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleCancel(apt.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors w-full sm:w-auto"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastApts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3">
            Consultation History ({pastApts.length})
          </h2>
          <div className="space-y-3">
            {pastApts.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-xl border border-gray-200 opacity-90 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#1a1a1a]">{apt.practitionerName}</div>
                  <div className="text-gray-500">
                    {apt.appointmentDate} at {apt.appointmentTime} • {apt.clinicName}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full capitalize font-semibold ${
                    apt.status === 'completed'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1f5233]" />
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  Book Ayurvedic Consultation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              {/* Select Doctor */}
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] block mb-1">
                  Select Certified Practitioner
                </label>
                <select
                  value={selectedPractitionerId}
                  onChange={(e) => setSelectedPractitionerId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                  required
                >
                  {practitioners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.title} ({p.clinicName}, {p.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date selection */}
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] block mb-1">
                  Select Date (Next 7 Days)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {getNext7Days().map((d) => (
                    <button
                      type="button"
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-2 rounded-lg border text-center text-xs transition-all ${
                        selectedDate === d.iso
                          ? 'border-[#1f5233] bg-[#1f5233] text-white font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {d.display}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] block mb-1">
                  Select Time Slot
                </label>
                <div className="space-y-2">
                  {timeSlots.map((group) => (
                    <div key={group.label}>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                        {group.label}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {group.slots.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-1.5 px-2 rounded-lg border text-center text-xs transition-all ${
                              selectedTime === slot
                                ? 'border-[#1f5233] bg-[#1f5233]/10 text-[#1f5233] font-bold ring-1 ring-[#1f5233]'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symptom / Consultation Notes */}
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] block mb-1">
                  Chief Complaints / Symptoms (Optional)
                </label>
                <textarea
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="e.g. Digestive bloating after meals, restless sleep, joint stiffness..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1f5233] text-white hover:bg-[#1a3d5c] disabled:opacity-50"
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
