import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, ShieldCheck, Clock, ArrowRight, Building, MapPin, Award, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PractitionerProfileSetup: React.FC = () => {
  const { user, completePractitionerProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [qualification, setQualification] = useState('BAMS');
  const [ncismNumber, setNcismNumber] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!ncismNumber.trim()) {
      setError('Please enter your NCISM / State registration number');
      return;
    }
    if (!clinicName.trim()) {
      setError('Please enter your clinic or hospital name');
      return;
    }
    if (!clinicLocation.trim()) {
      setError('Please enter your clinic city/location');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await completePractitionerProfile({
        name: fullName.trim(),
        qualification,
        ncismNumber: ncismNumber.trim(),
        clinicName: clinicName.trim(),
        clinicLocation: clinicLocation.trim(),
        bio: bio.trim()
      });
    } catch (err: any) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      id="practitioner-profile-setup-screen"
      className="min-h-[85vh] flex items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-3xl border border-[#3E2C23]/15 shadow-2xl p-6 sm:p-10 text-left relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#3B5D3A]/10 text-[#3B5D3A] flex items-center justify-center text-2xl shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3E2C23]">
              Set up your practitioner profile
            </h2>
            <p className="text-xs sm:text-sm text-[#3E2C23]/70">
              This helps patients trust you and verifies your clinical credentials.
            </p>
          </div>
        </div>

        {error && (
          <div 
            id="practitioner-setup-error"
            className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="prac-fullname" className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="prac-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Sharma"
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23]"
              />
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label htmlFor="prac-qualification" className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
              Qualification *
            </label>
            <div className="relative">
              <select
                id="prac-qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23] cursor-pointer"
              >
                <option value="BAMS">BAMS (Bachelor of Ayurvedic Medicine &amp; Surgery)</option>
                <option value="MD Ayurveda">MD Ayurveda</option>
                <option value="PhD Ayurveda">PhD Ayurveda</option>
                <option value="Diploma in Ayurveda">Diploma in Ayurveda</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* NCISM Registration Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="prac-ncism" className="block text-xs font-semibold text-[#3E2C23]">
                NCISM / State Registration Number *
              </label>
            </div>
            <input
              id="prac-ncism"
              type="text"
              required
              value={ncismNumber}
              onChange={(e) => setNcismNumber(e.target.value)}
              placeholder="e.g. NCISM/AYUR/2021/8842 or State Reg # 14529"
              className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23]"
            />
            <p className="text-[11px] text-[#3E2C23]/60 mt-1">
              Your official registration number from NCISM or state council
            </p>
          </div>

          {/* Clinic Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prac-clinic-name" className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
                Clinic Name *
              </label>
              <input
                id="prac-clinic-name"
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="AyurVeda Wellness Center"
                className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23]"
              />
            </div>

            <div>
              <label htmlFor="prac-clinic-location" className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
                Clinic Location (City) *
              </label>
              <input
                id="prac-clinic-location"
                type="text"
                required
                value={clinicLocation}
                onChange={(e) => setClinicLocation(e.target.value)}
                placeholder="Bengaluru, India"
                className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23]"
              />
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="prac-bio" className="block text-xs font-semibold text-[#3E2C23]">
                Short Bio
              </label>
              <span className="text-[11px] text-[#3E2C23]/50">
                {bio.length}/200 characters
              </span>
            </div>
            <textarea
              id="prac-bio"
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="E.g. 10+ years in Ayurvedic medicine, specializing in digestive health and metabolic disorders."
              className="w-full px-4 py-3 rounded-xl border border-[#3E2C23]/20 bg-[#FAF6EF]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5D3A] text-sm text-[#3E2C23] resize-none"
            />
          </div>

          <button
            id="btn-complete-practitioner-profile"
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#3B5D3A] hover:bg-[#2F4A2E] text-white text-sm font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Setting up profile...' : 'Complete Profile & Enter →'}</span>
          </button>
        </form>

        {/* Note below form */}
        <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>⏳ Verification Pending:</strong> Your profile will be reviewed and verified by our team.
            You can still use all features while verification is pending.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
