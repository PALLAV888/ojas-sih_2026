import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  Building,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileText,
  Calendar,
  Edit3,
  Save,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PractitionerProfileProps {
  onNavigateVerification?: () => void;
}

export const PractitionerProfile: React.FC<PractitionerProfileProps> = ({
  onNavigateVerification
}) => {
  const { user, profile } = useAuth();

  const isVerified = user?.verificationStatus === 'verified';
  const doctorName = user?.name?.startsWith('Dr.') ? user.name : `Dr. ${user?.name || 'Radha Raman'}`;

  // Editable fields
  const [clinicName, setClinicName] = useState('AyurVeda Sanjeevani Clinic');
  const [address, setAddress] = useState('Plot 42, Health Enclave, Sector 12, New Delhi 110001');
  const [consultationHours, setConsultationHours] = useState('Mon - Sat: 9:00 AM – 1:00 PM, 4:00 PM – 7:30 PM');
  const [phone, setPhone] = useState('+91 98112 34567');
  const [degrees, setDegrees] = useState('BAMS, MD (Ayurveda - Kayachikitsa), PhD (NIA Jaipur)');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="practitioner-profile-page" className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Verification Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
              {doctorName}
            </h1>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Physician</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Verification In Review</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#6b7280]">
            Senior Consultant • Kayachikitsa & Panchakarma Specialty
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-[#1f5233] text-[#1f5233] hover:bg-[#1f5233]/5 flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Practice Details'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Practice profile updated successfully.</span>
        </div>
      )}

      {/* Practice Stats (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Total Active Patients</span>
            <Users className="w-4 h-4 text-[#1f5233]" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a]">48</div>
          <div className="text-[11px] text-emerald-700 mt-1">Enrolled on practice registry</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Assessments Reviewed</span>
            <FileText className="w-4 h-4 text-[#1a3d5c]" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a]">114</div>
          <div className="text-[11px] text-[#1a3d5c] mt-1">Prakriti & Ashtavidha reports</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2">
            <span>Completed Consultations</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#1a1a1a]">96</div>
          <div className="text-[11px] text-gray-500 mt-1">AYUSH clinical encounters</div>
        </div>
      </div>

      {/* Clinic Information Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#1f5233]" />
          <span>Clinical Establishment & Hours</span>
        </h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">Clinic Name</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">Clinic Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">Consultation Hours</label>
              <input
                type="text"
                value={consultationHours}
                onChange={(e) => setConsultationHours(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c]"
              >
                Save Clinic Info
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 font-medium block">Clinic / Hospital</span>
              <div className="font-bold text-[#1a1a1a] mt-0.5">{clinicName}</div>
            </div>
            <div>
              <span className="text-gray-400 font-medium block">Official Reception</span>
              <div className="font-bold text-[#1a1a1a] mt-0.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {phone}
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-400 font-medium block">Physical Address</span>
              <div className="font-medium text-[#1a1a1a] mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                {address}
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-400 font-medium block">Outpatient Consultation Hours</span>
              <div className="font-medium text-[#1a1a1a] mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#1f5233]" />
                {consultationHours}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Credentials Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1f5233]" />
            <span>Professional Credentials & Statutory Licensing</span>
          </h2>
          {onNavigateVerification && (
            <button
              type="button"
              onClick={onNavigateVerification}
              className="text-xs font-semibold text-[#1f5233] hover:underline"
            >
              Manage Credentialing →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-gray-400 font-medium block">CCIM Registration</span>
            <div className="font-bold text-[#1a1a1a] mt-0.5">CCIM-DL-19842</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-gray-400 font-medium block">NCISM Central Registry</span>
            <div className="font-bold text-[#1a1a1a] mt-0.5">NCISM/2021/4892</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 sm:col-span-2">
            <span className="text-gray-400 font-medium block">Degrees & Fellowships</span>
            <div className="font-bold text-[#1a1a1a] mt-0.5">{degrees}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerProfile;
