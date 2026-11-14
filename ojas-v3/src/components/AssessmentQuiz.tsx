import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Check, Sparkles, Wind, Flame, Droplets, 
  HelpCircle, ShieldCheck, Heart, Moon, Compass, Activity, Brain, Clock, Zap
} from 'lucide-react';
import { ASSESSMENT_LAYERS, calculateDoshaResult } from '../data/assessmentData';
import { AssessmentAnswers, AssessmentResult } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface AssessmentQuizProps {
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ onComplete, onCancel }) => {
  const { user, saveResult, results } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // 0 to 7 (Layers 1 to 8)
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStage, setAnalyzingStage] = useState<'calculating' | 'done'>('calculating');

  const currentLayer = ASSESSMENT_LAYERS[currentStep];
  const currentAnswerKey = currentLayer.id;
  const currentSelectedValue = answers[currentAnswerKey];

  const handleSelectOption = (val: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentAnswerKey]: val
    }));
  };

  const handleNext = () => {
    if (!currentSelectedValue) return;

    if (currentStep < ASSESSMENT_LAYERS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed all 8 layers! Start analyzing animation
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const finishAssessment = () => {
    setIsAnalyzing(true);
    setAnalyzingStage('calculating');

    // Smooth multi-step transition
    setTimeout(() => {
      setAnalyzingStage('done');
      
      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C1502E', '#D4A017', '#3B5D3A', '#FAF6EF']
        });
      } catch (e) {
        // Safe fallback
      }

      setTimeout(() => {
        const attemptNumber = (results?.length || 0) + 1;
        const calculatedResult = calculateDoshaResult(
          answers, 
          user?.id || 'guest-' + Date.now(), 
          user?.name || 'Seeker',
          user?.patientId || 'OJ-2026-A4B7',
          attemptNumber
        );
        saveResult(calculatedResult);
        onComplete(calculatedResult);
      }, 1200);
    }, 1800);
  };

  // Icon selector helper
  const renderOptionIcon = (dosha: string) => {
    if (dosha === 'Vata') return <Wind className="w-5 h-5 text-[#C1502E]" />;
    if (dosha === 'Pitta') return <Flame className="w-5 h-5 text-[#D4A017]" />;
    return <Droplets className="w-5 h-5 text-[#3B5D3A]" />;
  };

  // If analyzing state is active
  if (isAnalyzing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-[#3E2C23]/15 p-8 sm:p-12 shadow-xl max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Pulsing mandala glow */}
          <div className="w-24 h-24 mx-auto mb-6 relative flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#C1502E]/40"
            />
            <motion.div 
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C1502E] to-[#D4A017] flex items-center justify-center text-white shadow-md shadow-[#C1502E]/30"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#3E2C23] mb-2">
            {analyzingStage === 'calculating' ? 'Analyzing your answers...' : 'Got it!'}
          </h3>
          
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 mb-6">
            {analyzingStage === 'calculating' 
              ? 'Computing your unique Vata, Pitta, and Kapha biological distribution across the 8 diagnostic layers...' 
              : "Here's your personalized mind-body balance profile..."}
          </p>

          <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden border border-[#3E2C23]/10">
            <motion.div 
              initial={{ width: '10%' }}
              animate={{ width: analyzingStage === 'done' ? '100%' : '80%' }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-[#C1502E] via-[#D4A017] to-[#3B5D3A] rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const remainingQuestions = ASSESSMENT_LAYERS.length - (currentStep + 1);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Top Navigation & Layer Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            id="btn-quiz-prev"
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#3E2C23]/70 hover:text-[#3E2C23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 0 ? 'Back to Overview' : 'Previous Question'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C1502E]">
              Layer {currentStep + 1} of {ASSESSMENT_LAYERS.length}
            </span>
            <span className="text-xs text-[#3E2C23]/50">
              ({Math.round(((currentStep + 1) / ASSESSMENT_LAYERS.length) * 100)}%)
            </span>
          </div>
        </div>

        {/* Multi-step Visual Progress Bar */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
          {ASSESSMENT_LAYERS.map((l, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <div 
                key={l.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#3B5D3A]' 
                    : isCurrent 
                    ? 'bg-[#C1502E]' 
                    : 'bg-[#3E2C23]/10'
                }`}
                title={`Layer ${index + 1}: ${l.title}`}
              />
            );
          })}
        </div>

        {/* Motivational sub-copy requested by prompt */}
        <div className="flex items-center justify-between mt-2 text-[11px] text-[#3E2C23]/60">
          <span>{currentLayer.title}</span>
          <span>
            {remainingQuestions === 0 
              ? 'Final question!' 
              : `${remainingQuestions} more question${remainingQuestions > 1 ? 's' : ''} to go...`}
          </span>
        </div>
      </div>

      {/* Main Question Card with Animated Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-sm"
        >
          {/* Layer Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#3E2C23]/10 text-[#3E2C23] text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#C1502E]" />
            <span>{currentLayer.layerTag} — {currentLayer.title}</span>
          </div>

          {/* Question Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mb-3 leading-snug">
            {currentLayer.question}
          </h2>

          {/* Simple Explanation Note */}
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#FAF6EF] border border-[#3E2C23]/10 text-xs text-[#3E2C23]/75 mb-6">
            <HelpCircle className="w-4 h-4 text-[#3B5D3A] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#3E2C23] font-medium">Ayurvedic guidance: </strong>
              {currentLayer.explanation}
            </p>
          </div>

          {/* 3 Interactive Options */}
          <div className="space-y-3 mb-8">
            {currentLayer.options.map((option) => {
              const isSelected = currentSelectedValue === option.value;
              return (
                <button
                  key={option.value}
                  id={`option-${currentLayer.id}-${option.value}`}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer group ${
                    isSelected
                      ? 'bg-[#FAF6EF] border-[#C1502E] ring-2 ring-[#C1502E]/20 shadow-xs'
                      : 'bg-white border-[#3E2C23]/15 hover:border-[#C1502E]/50 hover:bg-[#FAF6EF]/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-[#C1502E] text-white' 
                        : 'bg-[#FAF6EF] border border-[#3E2C23]/20 text-[#3E2C23]/40 group-hover:border-[#C1502E]'
                    }`}>
                      {isSelected ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#C1502E]/40" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#3E2C23] group-hover:text-[#C1502E] transition-colors">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {renderOptionIcon(option.dosha)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Action bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#3E2C23]/10">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#3E2C23]/70 hover:text-[#3E2C23] transition-colors"
            >
              Previous
            </button>

            <button
              id="btn-quiz-next"
              type="button"
              disabled={!currentSelectedValue}
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
                currentSelectedValue
                  ? 'bg-[#C1502E] hover:bg-[#a84224] text-white shadow-[#C1502E]/25 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-[#3E2C23]/20 text-[#3E2C23]/40 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === ASSESSMENT_LAYERS.length - 1 ? 'Analyze My Dosha' : 'Continue to Next Layer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Gentle reassurance copy */}
      <p className="text-center text-xs text-[#3E2C23]/50 mt-4">
        Answer about your natural, long-term default traits. There are no right or wrong answers.
      </p>

    </div>
  );
};
