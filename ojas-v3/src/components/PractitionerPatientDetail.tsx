import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Calendar, Mail, FileText, CheckCircle2, ChevronDown, 
  ChevronUp, Sparkles, Save, Clock, Wind, Flame, Droplets, Utensils, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { LinkedPatient, AssessmentResult } from '../types';
import { getPatientAssessments, getPractitionerNotes, savePractitionerNotes } from '../firebase/firestoreService';
import { generateProgressInsight } from '../utils/progressTracker';

interface PractitionerPatientDetailProps {
  patient: LinkedPatient;
  practitionerId: string;
  onBack: () => void;
}

export const PractitionerPatientDetail: React.FC<PractitionerPatientDetailProps> = ({
  patient,
  practitionerId,
  onBack
}) => {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientAssessments, existingNotes] = await Promise.all([
          getPatientAssessments(patient.patientUserId, patient.patientId),
          getPractitionerNotes(practitionerId, patient.patientId)
        ]);

        setAssessments(patientAssessments);
        if (patientAssessments.length > 0) {
          // Default expand the latest assessment
          setExpandedAttempt(patientAssessments[patientAssessments.length - 1].attemptNumber || 1);
        }

        if (existingNotes) {
          setNotes(existingNotes.notes);
          setLastSavedTime(new Date(existingNotes.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (e) {
        console.error('Error loading patient detail data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patient, practitionerId]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await savePractitionerNotes(practitionerId, patient.patientId, notes);
      setNotesSavedNotice(true);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setNotesSavedNotice(false), 3000);
    } catch (e) {
      console.error('Error saving notes', e);
    } finally {
      setSavingNotes(false);
    }
  };

  const progressInsight = generateProgressInsight(assessments);

  return (
    <div id="practitioner-patient-detail" className="space-y-8 text-left">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-patients"
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-[#3E2C23] hover:bg-[#FAF6EF] text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Patients</span>
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3E2C23]/10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C1502E]/10 text-[#C1502E] flex items-center justify-center text-3xl font-serif font-bold shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3E2C23]">
                  {patient.name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#FAF6EF] border border-[#3E2C23]/15 text-[#3E2C23] font-semibold">
                  {patient.patientId}
                </span>
              </div>
              <p className="text-xs text-[#3E2C23]/60 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{patient.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="px-4 py-2 rounded-xl bg-[#FAF6EF] border border-[#3E2C23]/10">
              <span className="text-[#3E2C23]/60 block text-[11px]">Joined</span>
              <span className="font-semibold text-[#3E2C23]">{patient.joinedDate}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#FAF6EF] border border-[#3E2C23]/10">
              <span className="text-[#3E2C23]/60 block text-[11px]">Total Assessments</span>
              <span className="font-semibold text-[#3E2C23]">{assessments.length || patient.assessmentCount}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#3B5D3A]/10 text-[#3B5D3A] font-semibold">
              <span className="block text-[11px] opacity-75">Current Type</span>
              <span>{patient.latestDosha || (assessments.length > 0 ? assessments[assessments.length - 1].doshaLabel : 'Pending')}</span>
            </div>
          </div>
        </div>

        {/* Auto Progress Insight if 2+ assessments */}
        {assessments.length >= 2 && progressInsight && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm text-[#3E2C23] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#C1502E] text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Diagnostic Progress Insight</span>
            </div>
            <p className="leading-relaxed text-[#3E2C23]/85">
              "{patient.name}'s {progressInsight.charAt(0).toLowerCase() + progressInsight.slice(1)}"
            </p>
          </div>
        )}
      </div>

      {/* Assessment History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3E2C23]">
            Assessment History &amp; 8-Layer Diagnostics
          </h2>
          <span className="text-xs text-[#3E2C23]/60 font-medium">
            {assessments.length} Record{assessments.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#3E2C23]/15 text-xs text-[#3E2C23]/60">
            Loading assessment logs...
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#3E2C23]/15 text-xs text-[#3E2C23]/60">
            No assessment results submitted yet by this patient.
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((result, idx) => {
              const attemptNumber = result.attemptNumber || idx + 1;
              const isExpanded = expandedAttempt === attemptNumber;
              const isLatest = idx === assessments.length - 1;

              return (
                <div 
                  key={result.id || idx}
                  className="bg-white rounded-3xl border border-[#3E2C23]/15 shadow-xs overflow-hidden transition-all"
                >
                  {/* Card Header Accordion Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedAttempt(isExpanded ? null : attemptNumber)}
                    className="w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF6EF]/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base sm:text-lg text-[#3E2C23]">
                          Attempt {attemptNumber}
                        </span>
                        {isLatest && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#C1502E] text-white text-[10px] font-bold">
                            LATEST
                          </span>
                        )}
                        <span className="text-xs text-[#3E2C23]/50">
                          • {result.date}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-[#3B5D3A] mt-1">
                        Primary Dosha: {result.doshaLabel}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Percentages badge */}
                      <div className="flex items-center gap-2 text-xs font-medium text-[#3E2C23]/80 bg-[#FAF6EF] px-3 py-1.5 rounded-xl border border-[#3E2C23]/10">
                        <span className="text-[#C1502E] font-bold">V: {result.vataPercentage}%</span>
                        <span>|</span>
                        <span className="text-[#D4A017] font-bold">P: {result.pittaPercentage}%</span>
                        <span>|</span>
                        <span className="text-[#3B5D3A] font-bold">K: {result.kaphaPercentage}%</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#FAF6EF] flex items-center justify-center text-[#3E2C23]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content: 8-Layer Answers & System Recommendations */}
                  {isExpanded && (
                    <div className="p-5 sm:p-8 border-t border-[#3E2C23]/10 bg-[#FAF6EF]/20 space-y-6">
                      
                      {/* 8-Layer Answers Grid */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C1502E] mb-3">
                          Patient's 8-Layer Diagnostic Answers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 1 (Body Frame)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer1_bodyFrame || 'Slim & flexible'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 2 (Skin Type)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer2_skin || 'Sensitive / Warm'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 3 (Hair Quality)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer3_hair || 'Fine / Medium texture'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 4 (Agni / Digestion)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer4_digestion || 'Fast & efficient'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 5 (Appetite & Thirst)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer5_appetite || 'Regular & strong'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 6 (Sleep Pattern)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer6_sleep || 'Moderate (6-7 hrs)'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 7 (Energy Rhythm)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer7_energy || 'Active & sustained'}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#3E2C23]/10">
                            <span className="text-[11px] text-[#3E2C23]/60 block font-medium">Layer 8 (Temperament)</span>
                            <span className="font-semibold text-[#3E2C23] mt-0.5 block">{result.layer8_temperament || 'Focused & passionate'}</span>
                          </div>
                        </div>
                      </div>

                      {/* System Recommendations Given */}
                      <div className="bg-white rounded-2xl border border-[#3E2C23]/10 p-5 space-y-3 text-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B5D3A]">
                          System Recommendations Given To Patient
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[#3B5D3A] font-semibold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Recommended Diet:</span>
                            </div>
                            <p className="text-[#3E2C23]/80 pl-5">
                              {result.favoriteFoods?.slice(0, 3).join(', ') || 'Warm, nourishing foods, whole grains, and healthy oils.'}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Foods To Minimize:</span>
                            </div>
                            <p className="text-[#3E2C23]/80 pl-5">
                              {result.avoidFoods?.slice(0, 3).join(', ') || 'Excessive cold, raw, or heavily processed items.'}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[#3E2C23] font-semibold">
                              <Clock className="w-4 h-4 text-[#C1502E]" />
                              <span>Dinacharya / Daily Clock:</span>
                            </div>
                            <p className="text-[#3E2C23]/80 pl-5">
                              Morning: {result.dailyRoutine?.morning?.title || 'Gentle awakening & hydration'}, Midday Agni peak, Evening unwind by 10:00 PM.
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[#3E2C23] font-semibold">
                              <Sparkles className="w-4 h-4 text-[#D4A017]" />
                              <span>Seasonal Strategy:</span>
                            </div>
                            <p className="text-[#3E2C23]/80 pl-5">
                              {result.seasonalTips?.[0]?.doshaSeason || 'Maintain consistent warmth and digestive balance.'}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Practitioner Private Notes Section */}
      <div 
        id="practitioner-notes-card"
        className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#3E2C23]">
              Practitioner Clinical Notes
            </h3>
            <p className="text-xs text-[#3E2C23]/60">
              Private consultation notes for {patient.name}. Only visible to you.
            </p>
          </div>

          {lastSavedTime && (
            <span className="text-[11px] text-[#3E2C23]/50">
              Last saved today at {lastSavedTime}
            </span>
          )}
        </div>

        <textarea
          id="textarea-practitioner-notes"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Patient reports high stress at work. Emphasized regular dinner schedule before 7:30 PM. Recommended Brahmi and Ashwagandha herbal tea. Follow-up assessment scheduled for next month."
          className="w-full p-4 rounded-2xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-xs sm:text-sm text-[#3E2C23] leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          {notesSavedNotice ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Notes saved successfully!</span>
            </span>
          ) : <span />}

          <button
            id="btn-save-practitioner-notes"
            type="button"
            disabled={savingNotes}
            onClick={handleSaveNotes}
            className="px-6 py-2.5 rounded-xl bg-[#3B5D3A] hover:bg-[#2F4A2E] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
