import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  Wind,
  Flame,
  Droplets,
  Calendar,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Leaf,
  Clock,
  Heart
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { ShareModal } from './ShareModal';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onBookAppointment?: () => void;
  onRetake?: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  onBookAppointment,
  onRetake
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [expandedReview, setExpandedReview] = useState<boolean>(false);

  const getDoshaEmoji = (dosha: string) => {
    if (dosha.includes('Vata')) return '🌬️';
    if (dosha.includes('Pitta')) return '🔥';
    return '🌊';
  };

  const chartData = [
    { name: 'Vata', value: result.vataPercentage, color: '#d4a574' },
    { name: 'Pitta', value: result.pittaPercentage, color: '#c97a4a' },
    { name: 'Kapha', value: result.kaphaPercentage, color: '#1f5233' }
  ];

  const handleDownloadPDF = () => {
    window.print();
  };

  // Specific herbs per dosha
  const getHerbalRecommendations = (dosha: string) => {
    if (dosha === 'Vata') {
      return [
        { name: 'Ashwagandha (Withania somnifera)', role: 'Nervine tonic & deep grounding adaptogen' },
        { name: 'Brahmi (Bacopa monnieri)', role: 'Soothes restless thoughts & stabilizes prana' },
        { name: 'Haritaki', role: 'Gentle colon lubrication and Apana Vayu regulation' }
      ];
    } else if (dosha === 'Pitta') {
      return [
        { name: 'Shatavari (Asparagus racemosus)', role: 'Deeply cooling, mucosal rejuvenator' },
        { name: 'Guduchi (Tinospora cordifolia)', role: 'Clears metabolic heat & detoxifies liver' },
        { name: 'Amalaki (Emblica officinalis)', role: 'Potent vitamin C, pacifies fiery Agni' }
      ];
    } else {
      return [
        { name: 'Trikatu (Ginger, Black Pepper, Pippali)', role: 'Kindles sluggish metabolic fire (Deepana)' },
        { name: 'Tulsi (Holy Basil)', role: 'Clears respiratory mucus and seasonal heaviness' },
        { name: 'Guggulu (Commiphora mukul)', role: 'Mobilizes stagnant lymph and clears excess tissue' }
      ];
    }
  };

  const herbs = getHerbalRecommendations(result.primaryDosha);

  return (
    <div id="assessment-results-page" className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & AYUSH Identification */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f5233]/10 text-[#1f5233] text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry of AYUSH • Diagnostic Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
            Clinical Assessment Report
          </h1>
          <p className="text-xs text-[#6b7280]">
            Generated on {result.date} • Patient ID: {result.patientId || 'OJ-2026'}
          </p>
        </div>

        {/* 3 Prominent Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-share-practitioner"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#1f5233] text-[#1f5233] hover:bg-[#1f5233]/5 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share with Doctor</span>
          </button>

          <button
            type="button"
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#1a3d5c] text-[#1a3d5c] hover:bg-[#1a3d5c]/5 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>

          {onBookAppointment && (
            <button
              type="button"
              id="btn-book-appointment-results"
              onClick={onBookAppointment}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1f5233] text-white hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          )}
        </div>
      </div>

      {/* Large Prakriti Display Card with Recharts Donut */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#a8b5a8]/30 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left info */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getDoshaEmoji(result.primaryDosha)}</span>
              <div>
                <span className="text-xs font-bold text-[#1f5233] uppercase tracking-wider">
                  Primary Constitution (Prakriti)
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                  {result.primaryDosha} {result.secondaryDosha ? `— ${result.secondaryDosha}` : ''}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#1a1a1a] leading-relaxed">
              {result.summary}
            </p>

            {/* Percentages bar indicator */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#fef9f3] border border-[#d4a574]/40">
                <div className="flex items-center gap-1 text-[#d4a574] text-xs font-bold mb-1">
                  <Wind className="w-3.5 h-3.5" /> Vata
                </div>
                <div className="text-2xl font-bold text-[#d4a574]">{result.vataPercentage}%</div>
                <div className="text-[10px] text-gray-500">Air & Space</div>
              </div>

              <div className="p-3 rounded-xl bg-[#fef9f3] border border-[#c97a4a]/40">
                <div className="flex items-center gap-1 text-[#c97a4a] text-xs font-bold mb-1">
                  <Flame className="w-3.5 h-3.5" /> Pitta
                </div>
                <div className="text-2xl font-bold text-[#c97a4a]">{result.pittaPercentage}%</div>
                <div className="text-[10px] text-gray-500">Fire & Water</div>
              </div>

              <div className="p-3 rounded-xl bg-[#fef9f3] border border-[#1f5233]/40">
                <div className="flex items-center gap-1 text-[#1f5233] text-xs font-bold mb-1">
                  <Droplets className="w-3.5 h-3.5" /> Kapha
                </div>
                <div className="text-2xl font-bold text-[#1f5233]">{result.kaphaPercentage}%</div>
                <div className="text-[10px] text-gray-500">Water & Earth</div>
              </div>
            </div>
          </div>

          {/* Right: Recharts Donut Chart */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="h-52 w-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-medium">Dominant</span>
                <span className="text-base font-serif font-bold text-[#1a1a1a]">
                  {result.primaryDosha}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations: Diet, Lifestyle, Herbs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 1. Dietary Protocol */}
        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Dietary Protocol (Ahara)</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-3">
              Targeted nourishment to balance your active constitutional fires:
            </p>
            <ul className="space-y-2 text-xs text-[#1a1a1a]">
              {result.favoriteFoods.slice(0, 4).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-rose-700">
            <strong>Avoid:</strong> {result.avoidFoods.slice(0, 2).join(', ')}
          </div>
        </div>

        {/* 2. Daily Regimen (Dinacharya) */}
        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a3d5c] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Daily Regimen (Dinacharya)</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-3">
              Optimal daily timing tailored to your metabolic rhythm:
            </p>
            <div className="space-y-2.5 text-xs text-[#1a1a1a]">
              <div className="p-2 rounded-lg bg-gray-50">
                <span className="font-bold text-[#1a3d5c] block">
                  Morning ({result.dailyRoutine.morning.time})
                </span>
                <span className="text-[11px] text-gray-600">
                  {result.dailyRoutine.morning.items[0]}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <span className="font-bold text-[#1a3d5c] block">
                  Midday ({result.dailyRoutine.midday.time})
                </span>
                <span className="text-[11px] text-gray-600">
                  {result.dailyRoutine.midday.items[0]}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <span className="font-bold text-[#1a3d5c] block">
                  Evening ({result.dailyRoutine.evening.time})
                </span>
                <span className="text-[11px] text-gray-600">
                  {result.dailyRoutine.evening.items[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Herbal Formulations (Dravya) */}
        <div className="bg-white p-5 rounded-xl border border-[#a8b5a8]/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Classical Herbs (Dravya)</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-3">
              Classical Rasayana and balancing herbals to discuss with your practitioner:
            </p>
            <div className="space-y-2.5">
              {herbs.map((h, i) => (
                <div key={i} className="p-2 rounded-lg bg-[#fef9f3] border border-[#a8b5a8]/20 text-xs">
                  <div className="font-bold text-[#1f5233]">{h.name}</div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">{h.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Question-by-Question Diagnostic Review */}
      <div className="bg-white rounded-xl border border-[#a8b5a8]/30 shadow-sm overflow-hidden mb-8">
        <button
          type="button"
          id="btn-toggle-qna-review"
          onClick={() => setExpandedReview(!expandedReview)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1f5233]" />
            <h4 className="text-sm font-bold text-[#1a1a1a]">
              Full Clinical Question-by-Question Review
            </h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#6b7280]">
            <span>{expandedReview ? 'Hide Details' : 'View Recorded Answers'}</span>
            {expandedReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {expandedReview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-5 border-t border-gray-100 bg-[#fef9f3]/40"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Body Frame</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer1_bodyFrame || 'Standard'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Skin Type</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer2_skinType || 'Balanced'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Hair & Scalp</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer3_hairType || 'Normal'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Digestion (Agni)</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer4_digestion || 'Regular'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Appetite (Kshudha)</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer5_appetite || 'Steady'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Sleep (Nidra)</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer6_sleepPattern || 'Restful'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Energy (Utsaha)</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer7_energy || 'Sustained'}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Temperament (Manas)</span>
                  <div className="font-bold text-[#1a1a1a] mt-0.5">{result.layer8_temperament || 'Centred'}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          result={result}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default AssessmentResults;
