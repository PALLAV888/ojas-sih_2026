import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Wind,
  Flame,
  Droplets,
  ShieldCheck,
  Heart,
  Calendar,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { ASSESSMENT_LAYERS, calculateDoshaResult } from '../data/assessmentData';
import { ASHTAVIDHA_QUESTIONS } from '../data/ashtavidhaData';
import { AssessmentAnswers, AshtavidhaAnswers, AssessmentResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveAssessmentResult, createAssessment } from '../firebase/firestoreService';
import confetti from 'canvas-confetti';

interface AssessmentFormProps {
  onComplete?: (result: AssessmentResult) => void;
  onCancel?: () => void;
  onBookAppointment?: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onComplete,
  onCancel,
  onBookAppointment
}) => {
  const { t } = useTranslation();
  const { user, saveResult } = useAuth();

  // Multi-step phases: 1 = Prakriti, 2 = Ashtavidha Pariksha, 3 = Summary & Recommendations
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  // Step 1: Prakriti index (0 to 7)
  const [prakritiIndex, setPrakritiIndex] = useState<number>(0);
  const [prakritiAnswers, setPrakritiAnswers] = useState<AssessmentAnswers>({});

  // Step 2: Ashtavidha index (0 to 9)
  const [ashtavidhaIndex, setAshtavidhaIndex] = useState<number>(0);
  const [ashtavidhaAnswers, setAshtavidhaAnswers] = useState<AshtavidhaAnswers>({});

  // Step 3: Calculation & Saving
  const [calculatedResult, setCalculatedResult] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Total questions = 8 (Prakriti) + 10 (Ashtavidha) = 18
  const totalQuestions = ASSESSMENT_LAYERS.length + ASHTAVIDHA_QUESTIONS.length;
  const answeredCount =
    Object.keys(prakritiAnswers).length + Object.keys(ashtavidhaAnswers).length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Handle Step 1 Prakriti selection
  const currentPrakritiLayer = ASSESSMENT_LAYERS[prakritiIndex];
  const selectedPrakritiValue = prakritiAnswers[currentPrakritiLayer?.id];

  const handleSelectPrakriti = (val: any) => {
    setValidationError(null);
    setPrakritiAnswers((prev) => ({
      ...prev,
      [currentPrakritiLayer.id]: val
    }));
  };

  const handleNextPrakriti = () => {
    if (!selectedPrakritiValue) {
      setValidationError('Please select an option to continue.');
      return;
    }
    setValidationError(null);

    if (prakritiIndex < ASSESSMENT_LAYERS.length - 1) {
      setPrakritiIndex((prev) => prev + 1);
    } else {
      // Transition to Step 2: Ashtavidha Pariksha
      setPhase(2);
      setAshtavidhaIndex(0);
    }
  };

  const handlePrevPrakriti = () => {
    setValidationError(null);
    if (prakritiIndex > 0) {
      setPrakritiIndex((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Handle Step 2 Ashtavidha selection
  const currentAshtavidhaQ = ASHTAVIDHA_QUESTIONS[ashtavidhaIndex];
  const selectedAshtavidhaVal = ashtavidhaAnswers[currentAshtavidhaQ?.id];

  const handleSelectAshtavidha = (val: string) => {
    setValidationError(null);
    setAshtavidhaAnswers((prev) => ({
      ...prev,
      [currentAshtavidhaQ.id]: val
    }));
  };

  const handleNextAshtavidha = () => {
    if (!selectedAshtavidhaVal) {
      setValidationError('Please select a response to continue.');
      return;
    }
    setValidationError(null);

    if (ashtavidhaIndex < ASHTAVIDHA_QUESTIONS.length - 1) {
      setAshtavidhaIndex((prev) => prev + 1);
    } else {
      // Compute final Prakriti and Ashtavidha synthesis
      computeFinalResults();
    }
  };

  const handlePrevAshtavidha = () => {
    setValidationError(null);
    if (ashtavidhaIndex > 0) {
      setAshtavidhaIndex((prev) => prev - 1);
    } else {
      // Back to Step 1
      setPhase(1);
      setPrakritiIndex(ASSESSMENT_LAYERS.length - 1);
    }
  };

  // Compute final doshas & recommendations
  const computeFinalResults = () => {
    const userId = user?.id || 'guest-' + Date.now();
    const patientId = user?.patientId || 'OJ-2026-TEMP';
    const userName = user?.name || 'Ayurvedic Seeker';

    // Base Prakriti result
    const base = calculateDoshaResult(prakritiAnswers, userId, userName, patientId, 1);

    // Adjust scores incorporating Ashtavidha findings
    let vataAsh = 0;
    let pittaAsh = 0;
    let kaphaAsh = 0;

    Object.entries(ashtavidhaAnswers).forEach(([qId, ansVal]) => {
      if (ansVal === 'vata') vataAsh += 1.5;
      else if (ansVal === 'pitta') pittaAsh += 1.5;
      else if (ansVal === 'kapha') kaphaAsh += 1.5;
    });

    const totalV = (base.vataScore || 3) + vataAsh;
    const totalP = (base.pittaScore || 3) + pittaAsh;
    const totalK = (base.kaphaScore || 3) + kaphaAsh;
    const totalSum = totalV + totalP + totalK;

    const vataPercentage = Math.round((totalV / totalSum) * 100);
    const pittaPercentage = Math.round((totalP / totalSum) * 100);
    const kaphaPercentage = 100 - vataPercentage - pittaPercentage;

    let primary: 'Vata' | 'Pitta' | 'Kapha' = 'Vata';
    if (pittaPercentage >= vataPercentage && pittaPercentage >= kaphaPercentage) {
      primary = 'Pitta';
    } else if (kaphaPercentage >= vataPercentage && kaphaPercentage >= pittaPercentage) {
      primary = 'Kapha';
    }

    const finalResult: AssessmentResult = {
      ...base,
      vataPercentage,
      pittaPercentage,
      kaphaPercentage,
      primaryDosha: primary,
      doshaLabel: `${primary} Constitutional Balance`,
      takenAt: new Date().toISOString()
    };

    setCalculatedResult(finalResult);
    setPhase(3);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Save to Firestore and finish
  const handleSaveAndRedirect = async () => {
    if (!calculatedResult) return;
    setIsSaving(true);

    try {
      // 1. Save via Context
      await saveResult(calculatedResult);

      // 2. Save via firestoreService
      await saveAssessmentResult(calculatedResult);
      await createAssessment(calculatedResult);

      if (onComplete) {
        onComplete(calculatedResult);
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="ojas-assessment-wrapper" className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Top Header & AYUSH Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f5233]/10 text-[#1f5233] text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AYUSH Standardized Case-Taking Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a]">
          {t('assessment.title')}
        </h1>
      </div>

      {/* Progress & Stepper Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#a8b5a8]/30 shadow-sm mb-6">
        <div className="flex items-center justify-between text-xs font-semibold mb-2 text-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded ${
                phase === 1
                  ? 'bg-[#1f5233] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Step 1: Prakriti
            </span>
            <span
              className={`px-2 py-0.5 rounded ${
                phase === 2
                  ? 'bg-[#1f5233] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Step 2: Ashtavidha Pariksha
            </span>
            <span
              className={`px-2 py-0.5 rounded ${
                phase === 3
                  ? 'bg-[#1f5233] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Step 3: Clinical Synthesis
            </span>
          </div>
          <span className="text-[#1f5233]">{progressPercentage}% Complete</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#1f5233]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* STEP 1: PRAKRITI ASSESSMENT */}
      {phase === 1 && currentPrakritiLayer && (
        <motion.div
          key={`prakriti-${currentPrakritiLayer.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2 font-medium">
            <span>
              Question {prakritiIndex + 1} of {ASSESSMENT_LAYERS.length}
            </span>
            <span className="text-[#1f5233] font-semibold">
              {currentPrakritiLayer.layerTag}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">
            {currentPrakritiLayer.question}
          </h2>
          <p className="text-xs text-[#6b7280] mb-6">
            {currentPrakritiLayer.explanation}
          </p>

          <div className="space-y-3 mb-6">
            {currentPrakritiLayer.options.map((opt) => {
              const isSelected = selectedPrakritiValue === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  id={`opt-prakriti-${opt.value}`}
                  onClick={() => handleSelectPrakriti(opt.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#1f5233] bg-[#1f5233]/5 ring-2 ring-[#1f5233]/20 shadow-sm'
                      : 'border-gray-200 hover:border-[#1f5233]/50 hover:bg-[#fef9f3]'
                  }`}
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#1a1a1a]">
                        {opt.label}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white border text-[#1a3d5c]">
                        {opt.dosha} Tendency
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#1f5233] bg-[#1f5233] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {validationError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrevPrakriti}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#1a3d5c] hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="btn-next-prakriti"
              onClick={handleNextPrakriti}
              className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#1f5233] text-white hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>
                {prakritiIndex === ASSESSMENT_LAYERS.length - 1
                  ? 'Proceed to Ashtavidha Pariksha'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: ASHTAVIDHA PARIKSHA */}
      {phase === 2 && currentAshtavidhaQ && (
        <motion.div
          key={`ashtavidha-${currentAshtavidhaQ.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-6 border border-[#a8b5a8]/30 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2 font-medium">
            <span>
              Clinical Exam {ashtavidhaIndex + 1} of {ASHTAVIDHA_QUESTIONS.length}
            </span>
            <span className="text-[#1f5233] font-semibold">
              {currentAshtavidhaQ.categoryLabel}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-1">
            {currentAshtavidhaQ.question}
          </h2>
          <p className="text-xs text-[#6b7280] mb-6">
            {currentAshtavidhaQ.explanation}
          </p>

          <div className="space-y-3 mb-6">
            {currentAshtavidhaQ.options.map((opt) => {
              const isSelected = selectedAshtavidhaVal === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  id={`opt-ashtavidha-${opt.value}`}
                  onClick={() => handleSelectAshtavidha(opt.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#1f5233] bg-[#1f5233]/5 ring-2 ring-[#1f5233]/20 shadow-sm'
                      : 'border-gray-200 hover:border-[#1f5233]/50 hover:bg-[#fef9f3]'
                  }`}
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#1a1a1a]">
                        {opt.label}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white border text-[#1f5233]">
                        {opt.dosha} Marker
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#1f5233] bg-[#1f5233] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {validationError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrevAshtavidha}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#1a3d5c] hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="btn-next-ashtavidha"
              onClick={handleNextAshtavidha}
              className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#1f5233] text-white hover:bg-[#1a3d5c] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>
                {ashtavidhaIndex === ASHTAVIDHA_QUESTIONS.length - 1
                  ? 'Generate Diagnostic Summary'
                  : 'Next Indicator'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: SUMMARY & RECOMMENDATIONS */}
      {phase === 3 && calculatedResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-[#a8b5a8]/30 shadow-md space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles className="w-8 h-8 text-[#d4a574]" />
            </div>
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Ayurvedic Diagnostic Synthesis
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mt-1">
              {calculatedResult.primaryDosha} Dominant Constitution
            </h2>
            <p className="text-xs text-[#1a3d5c] max-w-lg mx-auto mt-2 leading-relaxed">
              {calculatedResult.summary}
            </p>
          </div>

          {/* Dosha percentages: Vata = gold, Pitta = red-orange, Kapha = green */}
          <div className="bg-[#fef9f3] p-5 rounded-xl border border-[#a8b5a8]/30">
            <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 text-center">
              Tri-Dosha Constitutional Ratio
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Vata */}
              <div className="p-3 rounded-lg bg-white border border-[#d4a574]/40 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-[#d4a574] mb-1">
                  <Wind className="w-4 h-4" />
                  <span className="text-xs font-bold">Vata</span>
                </div>
                <div className="text-2xl font-bold text-[#d4a574]">
                  {calculatedResult.vataPercentage}%
                </div>
                <div className="text-[10px] text-gray-500">Air & Space</div>
              </div>

              {/* Pitta */}
              <div className="p-3 rounded-lg bg-white border border-[#c97a4a]/40 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-[#c97a4a] mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold">Pitta</span>
                </div>
                <div className="text-2xl font-bold text-[#c97a4a]">
                  {calculatedResult.pittaPercentage}%
                </div>
                <div className="text-[10px] text-gray-500">Fire & Water</div>
              </div>

              {/* Kapha */}
              <div className="p-3 rounded-lg bg-white border border-[#1f5233]/40 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-[#1f5233] mb-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs font-bold">Kapha</span>
                </div>
                <div className="text-2xl font-bold text-[#1f5233]">
                  {calculatedResult.kaphaPercentage}%
                </div>
                <div className="text-[10px] text-gray-500">Water & Earth</div>
              </div>
            </div>

            {/* Colored Segment Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex mt-4 border border-gray-200">
              <div
                style={{ width: `${calculatedResult.vataPercentage}%` }}
                className="bg-[#d4a574]"
                title={`Vata: ${calculatedResult.vataPercentage}%`}
              />
              <div
                style={{ width: `${calculatedResult.pittaPercentage}%` }}
                className="bg-[#c97a4a]"
                title={`Pitta: ${calculatedResult.pittaPercentage}%`}
              />
              <div
                style={{ width: `${calculatedResult.kaphaPercentage}%` }}
                className="bg-[#1f5233]"
                title={`Kapha: ${calculatedResult.kaphaPercentage}%`}
              />
            </div>
          </div>

          {/* AI-Generated Clinical Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <h4 className="text-xs font-bold text-emerald-900 mb-2 uppercase tracking-wide">
                Beneficial Foods (Pathya Ahara)
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {calculatedResult.favoriteFoods.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <h4 className="text-xs font-bold text-rose-900 mb-2 uppercase tracking-wide">
                Foods to Moderate (Apathya Ahara)
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {calculatedResult.avoidFoods.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions: Save & Book Appointment */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onBookAppointment && (
              <button
                type="button"
                id="btn-assessment-book"
                onClick={onBookAppointment}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#1a3d5c] text-[#1a3d5c] text-xs font-semibold hover:bg-[#1a3d5c]/5 flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Doctor Consultation</span>
              </button>
            )}

            <button
              type="button"
              id="btn-save-assessment-firestore"
              disabled={isSaving}
              onClick={handleSaveAndRedirect}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving to Records...</span>
              ) : (
                <>
                  <span>Save Record & View Full Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const PrakritiAssessment = AssessmentForm;
export default AssessmentForm;
