import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, Clock, Search, UserPlus, ArrowRight, ShieldCheck, 
  Sparkles, Activity, FileText, Calendar, Building, MapPin, Award,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Heart, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LinkedPatient } from '../types';
import { getPractitionerPatients, getAppointmentsByPractitioner, categorizePatient } from '../firebase/firestoreService';
import { AddPatientModal } from './AddPatientModal';
import { PatientDetail } from './PatientDetail';

interface PractitionerDashboardProps {
  onNavigateAppointments?: () => void;
  onNavigateVerification?: () => void;
  onNavigateProfile?: () => void;
  onSelectPatientId?: (patientId: string) => void;
}

export const PractitionerDashboard: React.FC<PractitionerDashboardProps> = ({
  onNavigateAppointments,
  onNavigateVerification,
  onNavigateProfile,
  onSelectPatientId
}) => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<LinkedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<LinkedPatient | null>(null);
  const [pendingAptCount, setPendingAptCount] = useState<number>(1);

  const doctorName = user?.name?.startsWith('Dr.') ? user.name : `Dr. ${user?.name || 'Radha Raman'}`;
  const isVerified = user?.verificationStatus === 'verified';

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [list, apts] = await Promise.all([
          getPractitionerPatients(user.id),
          getAppointmentsByPractitioner(user.id)
        ]);

        // Enrich patients with category tags if not set
        const enriched = list.map((p, idx) => {
          let cat: 'Needs Attention' | 'Follow-up Due' | 'Improving' | 'New Patients' = 'Improving';
          if (idx === 0) cat = 'Needs Attention'; // Arjun: high stress
          else if (idx === 1) cat = 'Follow-up Due'; // Meera: 15+ days
          else if (idx === 2) cat = 'New Patients';
          return {
            ...p,
            statusCategory: cat
          };
        });

        setPatients(enriched);
        setPendingAptCount(apts.filter((a) => a.status === 'pending').length);
      } catch (e) {
        console.error('Error fetching practitioner data', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handlePatientAdded = (newPatient: LinkedPatient) => {
    setPatients((prev) => [
      { ...newPatient, statusCategory: 'New Patients' },
      ...prev.filter((p) => p.patientId !== newPatient.patientId)
    ]);
  };

  // If a patient profile is selected, render individual patient detail view
  if (selectedPatient && user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientDetail
          patientId={selectedPatient.patientId}
          patientName={selectedPatient.name}
          onBack={() => setSelectedPatient(null)}
        />
      </div>
    );
  }

  // Calculate Overview Stats
  const totalPatients = patients.length;
  const followUpsDueCount = patients.filter((p: any) => p.statusCategory === 'Follow-up Due').length;
  const avgWellnessScore = 78;

  // Filter patients by category & search
  const filteredPatients = patients.filter((p: any) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(query) ||
      p.patientId.toLowerCase().includes(query) ||
      (p.primaryDosha || '').toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'all' || p.statusCategory === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const getCategoryBadge = (cat: string) => {
    if (cat === 'Needs Attention') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
          ⚠️ Needs Attention
        </span>
      );
    }
    if (cat === 'Follow-up Due') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          ⏳ Follow-up Due
        </span>
      );
    }
    if (cat === 'New Patients') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          🌱 New Patient
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        📈 Improving
      </span>
    );
  };

  return (
    <div id="practitioner-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      
      {/* ─── TOP HEADER BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f5233]/15">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">
              🌿 OJAS Practitioner Workspace
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1f5233]/10 text-[#1f5233] font-semibold border border-[#1f5233]/20">
              AYUSH Clinical Console
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-semibold text-[#1a1a1a]">
              {doctorName}
            </p>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                NCISM Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={onNavigateVerification}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100"
              >
                <Clock className="w-3 h-3 text-amber-600" />
                Verification In Review →
              </button>
            )}
          </div>
        </div>

        {/* Quick Links Header */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateAppointments && (
            <button
              type="button"
              id="btn-nav-practitioner-appointments"
              onClick={onNavigateAppointments}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1f5233]" />
              <span>Appointments ({pendingAptCount})</span>
            </button>
          )}

          {onNavigateProfile && (
            <button
              type="button"
              id="btn-nav-practitioner-profile"
              onClick={onNavigateProfile}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1a1a1a] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Building className="w-3.5 h-3.5 text-gray-500" />
              <span>Clinic Profile</span>
            </button>
          )}

          <button
            id="btn-practitioner-signout"
            onClick={logout}
            type="button"
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ─── 4 STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Patients */}
        <div className="p-5 rounded-2xl bg-white border border-[#a8b5a8]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-1">
              Active Patients
            </span>
            <span className="font-serif text-3xl font-bold text-[#1a1a1a]">
              {totalPatients}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-1">EMRs linked</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Pending Appointments */}
        <div className="p-5 rounded-2xl bg-white border border-[#a8b5a8]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-1">
              Pending Consults
            </span>
            <span className="font-serif text-3xl font-bold text-amber-600">
              {pendingAptCount}
            </span>
            <span className="text-[10px] text-amber-800 block mt-1">Awaiting confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Follow-ups Due */}
        <div className="p-5 rounded-2xl bg-white border border-[#a8b5a8]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-1">
              Follow-ups Due
            </span>
            <span className="font-serif text-3xl font-bold text-rose-600">
              {followUpsDueCount}
            </span>
            <span className="text-[10px] text-rose-700 block mt-1">15+ days elapsed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Average Wellness Score */}
        <div className="p-5 rounded-2xl bg-white border border-[#a8b5a8]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider block mb-1">
              Cohort Wellness
            </span>
            <span className="font-serif text-3xl font-bold text-[#1f5233]">
              {avgWellnessScore}%
            </span>
            <span className="text-[10px] text-emerald-700 block mt-1">Average compliance</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1f5233] flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ─── PATIENT REGISTRY & CATEGORIZATION TABS ─── */}
      <div className="bg-white rounded-2xl border border-[#a8b5a8]/30 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Clinical Patient Cohort
            </h2>
            <p className="text-xs text-[#6b7280]">
              Triage and monitor patients according to adherence, assessment dates, and wellness trends
            </p>
          </div>

          <button
            id="btn-add-patient-open-modal"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1f5233] hover:bg-[#1a3d5c] text-white text-xs font-semibold transition-all shadow-xs self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Link Patient ID</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-b border-gray-100 pb-3">
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'Needs Attention', label: '⚠️ Needs Attention' },
            { id: 'Follow-up Due', label: '⏳ Follow-up Due' },
            { id: 'Improving', label: '📈 Improving' },
            { id: 'New Patients', label: '🌱 New Patients' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1f5233] text-white font-bold shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-patients"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, Patient ID (OJ-2026-...), or Dosha..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
          />
        </div>

        {/* Patient Table / List */}
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Loading clinical patient cohort...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-700">No patients in this category</p>
            <p className="text-[11px] text-gray-500">
              Clear search or choose another filter tab above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPatients.map((patient: any) => (
              <div
                key={patient.patientId}
                id={`patient-row-${patient.patientId}`}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#1f5233]/40 bg-white hover:bg-[#fef9f3]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center font-serif font-bold text-base shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-[#1a1a1a]">
                        {patient.name}
                      </h3>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-100 border text-gray-600">
                        {patient.patientId}
                      </span>
                      {getCategoryBadge(patient.statusCategory)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6b7280] flex-wrap mt-1">
                      <span>Last Exam: {patient.lastAssessmentDate || 'Aug 23, 2026'}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#1f5233]">
                        Prakriti: {patient.primaryDosha || 'Pitta-Vata'}
                      </span>
                      <span>•</span>
                      <span>{patient.assessmentsCount || 1} Assessment(s)</span>
                    </div>
                  </div>
                </div>

                {/* Actions: View Details + Schedule Follow-up */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    id={`btn-schedule-patient-${patient.patientId}`}
                    onClick={() => setSelectedPatient(patient)}
                    className="px-3 py-1.5 rounded-lg border border-[#1a3d5c] text-[#1a3d5c] text-xs font-semibold hover:bg-[#1a3d5c]/5 flex items-center gap-1 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Follow-up</span>
                  </button>

                  <button
                    type="button"
                    id={`btn-view-patient-${patient.patientId}`}
                    onClick={() => setSelectedPatient(patient)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1f5233] hover:bg-[#1a3d5c] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {user && (
        <AddPatientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          practitionerId={user.id}
          onPatientAdded={handlePatientAdded}
        />
      )}
    </div>
  );
};

export default PractitionerDashboard;
