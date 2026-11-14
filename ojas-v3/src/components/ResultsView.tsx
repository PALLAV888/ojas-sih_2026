import React, { useState } from 'react';
import { 
  Wind, Flame, Droplets, CheckCircle2, XCircle, Clock, Sun, Moon, 
  Calendar, Share2, Printer, RotateCcw, Compass, BookmarkCheck, 
  Sparkles, Shield, Heart, ArrowRight, Check
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShareModal } from './ShareModal';

interface ResultsViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onFindPractitioner: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRetake,
  onFindPractitioner
}) => {
  const { saveResult } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSave = () => {
    saveResult(result);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getDoshaIcon = (dosha: string) => {
    if (dosha === 'Vata') return <Wind className="w-8 h-8 text-[#C1502E]" />;
    if (dosha === 'Pitta') return <Flame className="w-8 h-8 text-[#D4A017]" />;
    return <Droplets className="w-8 h-8 text-[#3B5D3A]" />;
  };

  const getDoshaColorClass = (dosha: string) => {
    if (dosha === 'Vata') return 'bg-[#C1502E] text-white';
    if (dosha === 'Pitta') return 'bg-[#D4A017] text-[#3E2C23]';
    return 'bg-[#3B5D3A] text-white';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#3B5D3A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurvedic Mind-Body Blueprint</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2C23] mt-1">
            Your Constitutional Balance
          </h1>
          <p className="text-xs text-[#3E2C23]/60 mt-1">
            Generated on {result.date} • Assessed for {result.userName || 'You'}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-save-result"
            onClick={handleSave}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              savedSuccess
                ? 'bg-[#3B5D3A] text-white'
                : 'bg-white hover:bg-[#FAF6EF] text-[#3E2C23] border border-[#3E2C23]/15'
            }`}
          >
            {savedSuccess ? <BookmarkCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved to Profile' : 'Save Result'}</span>
          </button>

          <button
            id="btn-share-result"
            onClick={() => setShowShareModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6EF] text-[#3E2C23] border border-[#3E2C23]/15 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-4 h-4 text-[#C1502E]" />
            <span>Share</span>
          </button>

          <button
            id="btn-print-result"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6EF] text-[#3E2C23] border border-[#3E2C23]/15 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#3E2C23]/70" />
            <span>Print Report</span>
          </button>

          <button
            id="btn-retake-quiz"
            onClick={onRetake}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#C1502E] hover:bg-[#C1502E]/10 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* Main Dosha Hero Card */}
      <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-10 shadow-sm mb-8 relative overflow-hidden">
        
        {/* Soft atmospheric gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C1502E]/10 via-[#D4A017]/10 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#3E2C23]/10">
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 flex items-center justify-center shrink-0 shadow-xs">
                {getDoshaIcon(result.primaryDosha)}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C1502E]">
                  Your Ayurvedic Type
                </span>
                <div className="flex flex-wrap items-baseline gap-3 mt-1">
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2C23]">
                    {result.doshaLabel}
                  </h2>
                  {result.secondaryDosha && (
                    <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-[#D4A017]/20 text-[#3E2C23] font-medium">
                      Primary: {result.primaryDosha} • Secondary: {result.secondaryDosha}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#3E2C23]/75 mt-2 max-w-xl leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Overall Status Badge */}
            <div className="shrink-0 p-4 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 text-center min-w-[160px]">
              <span className="text-[11px] font-semibold text-[#3E2C23]/60 uppercase tracking-wider block mb-1">
                Dominant Element
              </span>
              <span className="font-serif font-bold text-lg text-[#3E2C23]">
                {result.primaryDosha === 'Vata' ? 'Air & Space' : result.primaryDosha === 'Pitta' ? 'Fire & Water' : 'Earth & Water'}
              </span>
            </div>

          </div>

          {/* Percentage Breakdown (Vata, Pitta, Kapha) */}
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E2C23]/70 mb-4">
              Constitutional Percentage Breakdown
            </h4>

            {/* Stacked Visual Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-neutral-100 shadow-inner mb-4">
              <div 
                style={{ width: `${result.vataPercentage}%` }} 
                className="bg-[#C1502E] h-full transition-all duration-700" 
                title={`Vata: ${result.vataPercentage}%`}
              />
              <div 
                style={{ width: `${result.pittaPercentage}%` }} 
                className="bg-[#D4A017] h-full transition-all duration-700" 
                title={`Pitta: ${result.pittaPercentage}%`}
              />
              <div 
                style={{ width: `${result.kaphaPercentage}%` }} 
                className="bg-[#3B5D3A] h-full transition-all duration-700" 
                title={`Kapha: ${result.kaphaPercentage}%`}
              />
            </div>

            {/* Individual Stat Chips */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Wind className="w-4 h-4 text-[#C1502E]" />
                  <span className="text-xs font-semibold text-[#3E2C23]">Vata</span>
                </div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#C1502E]">
                  {result.vataPercentage}%
                </span>
                <span className="block text-[10px] text-[#3E2C23]/60 mt-0.5">Kinetic Energy</span>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200/60">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-[#D4A017]" />
                  <span className="text-xs font-semibold text-[#3E2C23]">Pitta</span>
                </div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4A017]">
                  {result.pittaPercentage}%
                </span>
                <span className="block text-[10px] text-[#3E2C23]/60 mt-0.5">Metabolic Heat</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Droplets className="w-4 h-4 text-[#3B5D3A]" />
                  <span className="text-xs font-semibold text-[#3E2C23]">Kapha</span>
                </div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#3B5D3A]">
                  {result.kaphaPercentage}%
                </span>
                <span className="block text-[10px] text-[#3E2C23]/60 mt-0.5">Structural Stability</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Grid: Body & Health, Personality, Strengths, Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Body & Health */}
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-[#C1502E]">
            <Heart className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Body & Health</h3>
          </div>
          <ul className="space-y-2.5">
            {result.bodyAndHealth.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3E2C23]/80">
                <CheckCircle2 className="w-4 h-4 text-[#3B5D3A] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personality */}
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-[#D4A017]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Personality</h3>
          </div>
          <ul className="space-y-2.5">
            {result.personality.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3E2C23]/80">
                <CheckCircle2 className="w-4 h-4 text-[#3B5D3A] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-[#3B5D3A]">
            <Shield className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Core Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {result.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3E2C23]/80">
                <span className="w-2 h-2 rounded-full bg-[#3B5D3A] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 mb-4 text-[#C1502E]">
            <Compass className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Vulnerabilities & Challenges</h3>
          </div>
          <ul className="space-y-2.5">
            {result.challenges.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3E2C23]/80">
                <span className="w-2 h-2 rounded-full bg-[#C1502E] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Foods for Your Balance (Favor & Avoid) */}
      <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs mb-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3B5D3A]">
            Ayurvedic Ahara (Nutrition)
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mt-1">
            Foods for Your Balance
          </h3>
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
            Food is medicine when aligned with your dominant digestive fire (Agni).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Favor Foods */}
          <div className="bg-[#FAF6EF] rounded-2xl p-5 sm:p-6 border border-[#3B5D3A]/20">
            <div className="flex items-center gap-2 mb-4 text-[#3B5D3A]">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-serif text-lg font-bold text-[#3E2C23]">
                Favor (Eat More)
              </h4>
            </div>
            <ul className="space-y-2.5">
              {result.favoriteFoods.map((food, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#3E2C23]/85">
                  <span className="text-[#3B5D3A] font-bold">✓</span>
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Avoid Foods */}
          <div className="bg-[#FAF6EF] rounded-2xl p-5 sm:p-6 border border-[#C1502E]/20">
            <div className="flex items-center gap-2 mb-4 text-[#C1502E]">
              <XCircle className="w-5 h-5" />
              <h4 className="font-serif text-lg font-bold text-[#3E2C23]">
                Avoid (Eat Less)
              </h4>
            </div>
            <ul className="space-y-2.5">
              {result.avoidFoods.map((food, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#3E2C23]/85">
                  <span className="text-[#C1502E] font-bold">✕</span>
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Daily Routine (Dinacharya) Schedule */}
      <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs mb-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017]">
            Dinacharya Protocol
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mt-1">
            Daily Routine for Your Balance
          </h3>
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
            Harmonize your circadian rhythm with Ayurvedic biological cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Morning */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#D4A017] mb-2">
                <Sun className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E2C23]">
                  {result.dailyRoutine.morning.time}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3E2C23] mb-3">
                {result.dailyRoutine.morning.title}
              </h4>
              <ul className="space-y-2">
                {result.dailyRoutine.morning.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#3E2C23]/80">
                    <span className="text-[#3B5D3A] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Midday */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#C1502E] mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E2C23]">
                  {result.dailyRoutine.midday.time}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3E2C23] mb-3">
                {result.dailyRoutine.midday.title}
              </h4>
              <ul className="space-y-2">
                {result.dailyRoutine.midday.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#3E2C23]/80">
                    <span className="text-[#3B5D3A] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evening */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#3B5D3A] mb-2">
                <Moon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E2C23]">
                  {result.dailyRoutine.evening.time}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3E2C23] mb-3">
                {result.dailyRoutine.evening.title}
              </h4>
              <ul className="space-y-2">
                {result.dailyRoutine.evening.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#3E2C23]/80">
                    <span className="text-[#3B5D3A] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Seasonal Tips (Ritucharya) */}
      {result.seasonalTips && result.seasonalTips.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs mb-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C1502E]">
              Ritucharya (Seasonal Wisdom)
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mt-1">
              Seasonal Tips for Your Dosha
            </h3>
            <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
              Navigate weather shifts smoothly without aggravating your primary dosha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.seasonalTips.map((seasonItem, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10">
                <div className="flex items-center gap-2 text-[#C1502E] mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-serif font-bold text-base text-[#3E2C23]">
                    {seasonItem.season}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#3B5D3A] font-semibold block mb-3">
                  {seasonItem.doshaSeason}
                </span>
                <ul className="space-y-2">
                  {seasonItem.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2 text-xs text-[#3E2C23]/80">
                      <span className="text-[#C1502E] font-bold">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practitioner CTA Box */}
      <div className="bg-[#3E2C23] text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017]">
            Integrative Ayurvedic Care
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            Need custom herbs & pulse diagnosis?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-2 leading-relaxed">
            Connect with certified Ayurvedic doctors (BAMS) who specialize in {result.primaryDosha} balance, digestion, sleep, and panchakarma healing.
          </p>
        </div>
        <button
          id="btn-results-find-practitioner"
          onClick={onFindPractitioner}
          className="px-6 py-3.5 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-[#C1502E]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>Find a Practitioner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
