import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
  Wind,
  Droplets,
  Activity,
  User,
  Heart,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DailyCheckIn } from './DailyCheckIn';
import { getAppointmentsByPatient, getCheckInsByPatient } from '../firebase/firestoreService';

interface PatientDashboardProps {
  onStartAssessment: () => void;
  onNavigateAppointments: () => void;
  onNavigateProfile: () => void;
  onNavigateDirectory: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onStartAssessment,
  onNavigateAppointments,
  onNavigateProfile,
  onNavigateDirectory
}) => {
  const { t } = useTranslation();
  const { user, profile, latestResult } = useAuth();
  const patientId = user?.patientId || 'OJ-2026-A4B7';

  const [appointments, setAppointments] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [streakCount, setStreakCount] = useState<number>(5);

  useEffect(() => {
    loadDashboardData();
  }, [patientId]);

  const loadDashboardData = async () => {
    try {
      const [apts, chks] = await Promise.all([
        getAppointmentsByPatient(patientId),
        getCheckInsByPatient(patientId)
      ]);
      setAppointments(apts);
      setCheckIns(chks);
      setStreakCount(Math.max(1, chks.length));
    } catch (e) {
      console.warn('Dashboard data load warning:', e);
    }
  };

  // Calculate days since last assessment
  let daysSinceAssessment = 0;
  let retakeRecommended = false;
  if (latestResult?.date) {
    const lastDate = new Date(latestResult.date).getTime();
    daysSinceAssessment = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
    if (daysSinceAssessment > 30) {
      retakeRecommended = true;
    }
  }

  // Next appointment
  const nextApt = appointments.find(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  const getDoshaIcon = (dosha?: string) => {
    if (dosha === 'Vata') return <Wind className="w-4 h-4 text-[#d4a574]" />;
    if (dosha === 'Pitta') return <Flame className="w-4 h-4 text-[#c97a4a]" />;
    return <Droplets className="w-4 h-4 text-[#1f5233]" />;
  };

  return (
    <div id="patient-dashboard-container" className="w-full max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-linear-to-r from-[#1f5233] to-[#1a3d5c] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4a574]" />
              <span>National AYUSH Health Grid • Citizen Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Seeker'}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-xl">
              Track your doshic balance, maintain daily dinacharya reflections, and connect with certified Ayurvedic practitioners.
            </p>
          </div>

          {/* Prakriti badge */}
          {latestResult ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4a574] text-white flex items-center justify-center font-bold text-lg">
                {latestResult.primaryDosha[0]}
              </div>
              <div>
                <span className="text-[10px] text-gray-200 uppercase font-semibold block">
                  Constitutional Prakriti
                </span>
                <span className="text-sm font-bold text-white">
                  {latestResult.primaryDosha}
                  {latestResult.secondaryDosha ? `-${latestResult.secondaryDosha}` : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs">
              <span className="text-gray-300">Prakriti Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stat Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Dosha balance */}
        <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Dosha Balance</span>
            {getDoshaIcon(latestResult?.primaryDosha)}
          </div>
          <div className="text-lg font-bold text-[#1a1a1a]">
            {latestResult?.primaryDosha || 'Not Evaluated'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {latestResult ? `Examined on ${latestResult.date}` : 'Assessment required'}
          </div>
        </div>

        {/* Card 2: Days since last assessment */}
        <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Assessment Age</span>
            <Clock className="w-4 h-4 text-[#1a3d5c]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#1a1a1a]">
              {latestResult ? `${daysSinceAssessment} days` : '0 days'}
            </span>
            {retakeRecommended && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Retake Due
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {retakeRecommended ? 'Seasonal recalibration needed' : 'Up to date'}
          </div>
        </div>

        {/* Card 3: Next appointment */}
        <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Next Visit</span>
            <Calendar className="w-4 h-4 text-[#1f5233]" />
          </div>
          <div className="text-sm font-bold text-[#1a1a1a] truncate">
            {nextApt ? nextApt.practitionerName : 'No Upcoming'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 truncate">
            {nextApt ? `${nextApt.appointmentDate} at ${nextApt.appointmentTime}` : 'All caught up'}
          </div>
        </div>

        {/* Card 4: Daily check-in streak */}
        <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Wellness Streak</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-bold text-[#1a1a1a]">
            {streakCount} Days Active
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Consistent Dinacharya log
          </div>
        </div>
      </div>

      {/* Primary CTA Banner */}
      <div className="bg-[#fef9f3] p-5 rounded-2xl border border-[#d4a574]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1f5233] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#d4a574]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a1a1a]">
              {latestResult ? 'Retake Clinical Prakriti Assessment' : 'Take Clinical Prakriti Assessment'}
            </h3>
            <p className="text-xs text-[#6b7280]">
              Complete the standardized 8-layer Prakriti + 8-fold Ashtavidha examination for personalized clinical care.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-cta-take-assessment"
          onClick={onStartAssessment}
          className="px-6 py-2.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-2 transition-colors shadow-sm shrink-0 w-full sm:w-auto justify-center"
        >
          <span>{latestResult ? 'Retake Assessment' : 'Start Assessment'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Daily Check-In & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily check-in widget */}
        <div className="lg:col-span-7">
          <DailyCheckIn
            patientId={patientId}
            onCheckInCompleted={loadDashboardData}
          />
        </div>

        {/* Right: Appointments Card & Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          {/* Appointments Card */}
          <div className="bg-white rounded-xl p-5 border border-[#a8b5a8]/30 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1f5233]" />
                <h3 className="text-sm font-bold text-[#1a1a1a]">Appointments</h3>
              </div>
              <button
                type="button"
                onClick={onNavigateAppointments}
                className="text-xs font-semibold text-[#1f5233] hover:underline"
              >
                View All
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#6b7280]">
                <p>No active consultations booked.</p>
                <button
                  type="button"
                  onClick={onNavigateAppointments}
                  className="mt-3 px-4 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] transition-colors"
                >
                  Book with a Verified Doctor
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-lg bg-[#fef9f3] border border-gray-100 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#1a1a1a]">{apt.practitionerName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-[#6b7280] flex items-center gap-2">
                      <span>{apt.appointmentDate}</span>
                      <span>•</span>
                      <span>{apt.appointmentTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-xl p-5 border border-[#a8b5a8]/30 shadow-sm">
            <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                id="btn-quick-nav-appointments"
                onClick={onNavigateAppointments}
                className="w-full p-2.5 rounded-lg border border-gray-200 hover:border-[#1f5233] hover:bg-gray-50 flex items-center justify-between text-xs text-left transition-colors"
              >
                <span className="font-semibold text-[#1a1a1a]">My Appointments</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                type="button"
                id="btn-quick-nav-profile"
                onClick={onNavigateProfile}
                className="w-full p-2.5 rounded-lg border border-gray-200 hover:border-[#1f5233] hover:bg-gray-50 flex items-center justify-between text-xs text-left transition-colors"
              >
                <span className="font-semibold text-[#1a1a1a]">My Health Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                type="button"
                id="btn-quick-nav-directory"
                onClick={onNavigateDirectory}
                className="w-full p-2.5 rounded-lg border border-gray-200 hover:border-[#1f5233] hover:bg-gray-50 flex items-center justify-between text-xs text-left transition-colors"
              >
                <span className="font-semibold text-[#1a1a1a]">Ayurvedic Doctor Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
