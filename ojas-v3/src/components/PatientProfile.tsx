import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  AlertCircle,
  Pill,
  FileText,
  Save,
  Edit2,
  CheckCircle2,
  Wind,
  Flame,
  Droplets
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PatientProfileData, AssessmentResult } from '../types';
import { getPatientAssessments } from '../firebase/firestoreService';

interface PatientProfileProps {
  onSelectAssessment?: (result: AssessmentResult) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ onSelectAssessment }) => {
  const { t } = useTranslation();
  const { user, profile, updateProfile, results } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>(profile?.name || user?.name || '');
  const [age, setAge] = useState<number | string>(profile?.age || 32);
  const [gender, setGender] = useState<string>(profile?.gender || 'male');
  const [contactNumber, setContactNumber] = useState<string>(profile?.contactNumber || '+91 98201 44521');
  const [chronicConditions, setChronicConditions] = useState<string>(
    (profile?.chronicConditions || ['Mild Acid Reflux (Amlapitta)', 'Occasional Insomnia']).join(', ')
  );
  const [allergies, setAllergies] = useState<string>(
    (profile?.allergies || ['Dust / Pollen', 'Excess Mustard Oil']).join(', ')
  );
  const [currentMedications, setCurrentMedications] = useState<string>(
    (profile?.currentMedications || ['Triphala Churna at bedtime', 'Brahmi Ghrita drops']).join(', ')
  );

  const [pastAssessments, setPastAssessments] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    if (results && results.length > 0) {
      setPastAssessments(results);
    } else {
      // Fallback load
      const patientId = user?.patientId || 'OJ-2026-A4B7';
      getPatientAssessments(patientId, user?.id || patientId).then((res) => {
        setPastAssessments(res);
      });
    }
  }, [user, results]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const condList = chronicConditions.split(',').map((s) => s.trim()).filter(Boolean);
      const allgList = allergies.split(',').map((s) => s.trim()).filter(Boolean);
      const medList = currentMedications.split(',').map((s) => s.trim()).filter(Boolean);

      await updateProfile({
        name,
        age: Number(age) || 0,
        gender: gender as any,
        contactNumber,
        chronicConditions: condList,
        allergies: allgList,
        currentMedications: medList
      });

      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error updating patient profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const getDoshaIcon = (dosha: string) => {
    if (dosha === 'Vata') return <Wind className="w-4 h-4 text-[#d4a574]" />;
    if (dosha === 'Pitta') return <Flame className="w-4 h-4 text-[#c97a4a]" />;
    return <Droplets className="w-4 h-4 text-[#1f5233]" />;
  };

  return (
    <div id="patient-profile-page" className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
            Patient Health Profile
          </h1>
          <p className="text-xs text-[#6b7280]">
            Ayurvedic electronic medical record (EMR) and personal clinical history
          </p>
        </div>

        <button
          type="button"
          id="btn-edit-profile-toggle"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
            isEditing
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-[#1f5233] text-white hover:bg-[#1a3d5c]'
          }`}
        >
          {isEditing ? (
            <span>Cancel Editing</span>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Patient record successfully updated in Firestore database.</span>
        </div>
      )}

      {/* Profile Form / View */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                  required
                />
              ) : (
                <div className="text-sm font-bold text-[#1a1a1a] py-1">{name}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Email Address
              </label>
              <div className="text-xs text-[#1a1a1a] py-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user?.email || 'patient@ojas.ayush.gov.in'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                  required
                />
              ) : (
                <div className="text-sm font-bold text-[#1a1a1a] py-1">{age} years</div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden capitalize"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-[#1a1a1a] py-1 capitalize">
                  {gender}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              ) : (
                <div className="text-xs text-[#1a1a1a] py-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{contactNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical History Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            Clinical History & Sensitivities
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Chronic Health Conditions (Roga Itihasa)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  placeholder="Comma separated: Mild Acid Reflux, Joint Pain..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chronicConditions.split(',').map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs border border-rose-200"
                    >
                      {c.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Allergies & Incompatibilities (Viruddha Ahara)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Comma separated: Pollen, Excess Dairy..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {allergies.split(',').map((a, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs border border-amber-200"
                    >
                      {a.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Current Herbs & Medications (Aushadhi)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="Comma separated: Triphala, Ashwagandha..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
                />
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentMedications.split(',').map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200"
                    >
                      {m.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                id="btn-save-profile"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Saved Assessments History Section */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm">
        <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>Prakriti Assessment History ({pastAssessments.length})</span>
        </h2>

        {pastAssessments.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#6b7280]">
            No assessments saved yet. Take your first Prakriti & Ashtavidha exam to record baseline constitution.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pastAssessments.map((res, i) => (
              <div
                key={res.id || i}
                onClick={() => onSelectAssessment && onSelectAssessment(res)}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-[#1f5233] bg-[#fef9f3]/50 hover:bg-[#fef9f3] transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getDoshaIcon(res.primaryDosha)}
                    <span className="text-xs font-bold text-[#1a1a1a]">
                      {res.primaryDosha}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{res.date}</span>
                </div>

                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex mb-2">
                  <div style={{ width: `${res.vataPercentage}%` }} className="bg-[#d4a574]" />
                  <div style={{ width: `${res.pittaPercentage}%` }} className="bg-[#c97a4a]" />
                  <div style={{ width: `${res.kaphaPercentage}%` }} className="bg-[#1f5233]" />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6b7280]">
                  <span>V:{res.vataPercentage}% P:{res.pittaPercentage}% K:{res.kaphaPercentage}%</span>
                  <span className="text-[#1f5233] font-semibold group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
