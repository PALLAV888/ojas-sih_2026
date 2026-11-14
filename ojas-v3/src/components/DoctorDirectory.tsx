import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MapPin,
  Award,
  ShieldCheck,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Filter,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DoctorDirectoryProps {
  onBookWithDoctor: (doctorName: string, doctorId: string) => void;
}

interface DoctorCardData {
  id: string;
  name: string;
  qualification: string;
  ncismNumber: string;
  clinicName: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  consultationFee: string;
  availableNext: string;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  onBookWithDoctor
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const doctorsList: DoctorCardData[] = [
    {
      id: 'doc-radha',
      name: 'Dr. Radha Raman Sharma',
      qualification: 'BAMS, MD (Kayachikitsa), PhD (NIA Jaipur)',
      ncismNumber: 'NCISM/AYU/2021/4892',
      clinicName: 'AyurVeda Sanjeevani Clinic',
      city: 'New Delhi, Delhi',
      experienceYears: 16,
      rating: 4.9,
      reviewCount: 142,
      specialties: ['Kayachikitsa (Internal Medicine)', 'Panchakarma', 'Rasayana & Agni Care'],
      consultationFee: '₹800',
      availableNext: 'Today, 4:00 PM'
    },
    {
      id: 'doc-vinay',
      name: 'Dr. Vinay K. Shastri',
      qualification: 'BAMS, MS (Shalya Tantra - BHU Varanasi)',
      ncismNumber: 'NCISM/AYU/2019/1244',
      clinicName: 'Shree Dhanvantari Ayurvedic Hospital',
      city: 'Pune, Maharashtra',
      experienceYears: 12,
      rating: 4.8,
      reviewCount: 98,
      specialties: ['Shalya Tantra (Surgical)', 'Ksharasutra', 'Marma Chikitsa'],
      consultationFee: '₹750',
      availableNext: 'Tomorrow, 10:30 AM'
    },
    {
      id: 'doc-priya',
      name: 'Dr. Priya Nambiar',
      qualification: 'BAMS (Kerala Ayurveda Academy), Fellowship in Nadi Pariksha',
      ncismNumber: 'NCISM/AYU/2022/8821',
      clinicName: 'Keraleeya Ayurveda Nilayam',
      city: 'Bengaluru, Karnataka',
      experienceYears: 9,
      rating: 4.9,
      reviewCount: 84,
      specialties: ['Nadi Pariksha', 'Prasuti & Stri Roga', 'Dinacharya Coaching'],
      consultationFee: '₹900',
      availableNext: 'Wednesday, 2:30 PM'
    },
    {
      id: 'doc-anand',
      name: 'Dr. Anand Joshi',
      qualification: 'BAMS, MD (Kaumarbhritya)',
      ncismNumber: 'NCISM/AYU/2018/6712',
      clinicName: 'Prakriti Child & Family AyurCare',
      city: 'Mumbai, Maharashtra',
      experienceYears: 14,
      rating: 4.7,
      reviewCount: 65,
      specialties: ['Kaumarbhritya (Pediatrics)', 'Immunity & Swarnaprashan', 'Digestive Disorders'],
      consultationFee: '₹700',
      availableNext: 'Thursday, 11:00 AM'
    }
  ];

  const filteredDoctors = doctorsList.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.name.toLowerCase().includes(q) ||
      doc.clinicName.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q) ||
      doc.specialties.some((s) => s.toLowerCase().includes(q));

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      doc.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesQuery && matchesSpecialty;
  });

  return (
    <div id="doctor-directory-container" className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#1f5233] to-[#1a3d5c] rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4a574]" />
          <span>Ministry of AYUSH • National Practitioner Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Verified Ayurvedic Physicians & Clinics
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-2xl">
          Consult board-certified Vaidyas with authenticated NCISM and CCIM credentials. Book in-person and tele-consultations directly linked to your Prakriti EMR.
        </p>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by physician name, specialty, clinic, or city (e.g., Delhi, Panchakarma)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden w-full sm:w-auto"
          >
            <option value="all">All Ayurvedic Branches</option>
            <option value="Kayachikitsa">Kayachikitsa (Internal Medicine)</option>
            <option value="Panchakarma">Panchakarma (Detoxification)</option>
            <option value="Nadi Pariksha">Nadi Pariksha (Pulse Science)</option>
            <option value="Shalya">Shalya Tantra</option>
            <option value="Kaumarbhritya">Kaumarbhritya (Pediatrics)</option>
            <option value="Prasuti">Prasuti & Women's Health</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-[#a8b5a8]/30 shadow-xs hover:border-[#1f5233]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Doctor Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1a1a1a]">
                      {doc.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#1a3d5c] font-medium mt-0.5">
                    {doc.qualification}
                  </p>
                  <span className="text-[10px] font-mono text-gray-500">
                    Reg: {doc.ncismNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-bold text-amber-900">{doc.rating}</span>
                  <span className="text-[10px] text-gray-500">({doc.reviewCount})</span>
                </div>
              </div>

              {/* Clinic & Location */}
              <div className="text-xs text-[#6b7280] space-y-1">
                <div className="font-semibold text-[#1a1a1a]">{doc.clinicName}</div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{doc.city}</span>
                  <span>•</span>
                  <span>{doc.experienceYears} Years Clinical Exp</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#1f5233]/5 text-[#1f5233] font-medium border border-[#1f5233]/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Fee, Next Available & Book Button */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-gray-400 block">Consultation Fee</span>
                <span className="text-sm font-bold text-[#1a1a1a]">{doc.consultationFee}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-emerald-700 block font-medium">
                    Next Slot Available
                  </span>
                  <span className="text-xs text-gray-600">{doc.availableNext}</span>
                </div>

                <button
                  type="button"
                  id={`btn-book-${doc.id}`}
                  onClick={() => onBookWithDoctor(doc.name, doc.id)}
                  className="px-4 py-2 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDirectory;
