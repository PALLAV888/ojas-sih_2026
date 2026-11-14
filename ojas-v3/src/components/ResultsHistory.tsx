import React, { useState } from 'react';
import { 
  History, Calendar, Wind, Flame, Droplets, ArrowRight, 
  RotateCcw, Sparkles, Trash2, Eye, TrendingUp, CheckCircle 
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { useAuth } from '../context/AuthContext';

interface ResultsHistoryProps {
  onSelectResult: (result: AssessmentResult) => void;
  onRetake: () => void;
}

export const ResultsHistory: React.FC<ResultsHistoryProps> = ({
  onSelectResult,
  onRetake
}) => {
  const { results, deleteResult, user } = useAuth();
  const [selectedForComparison, setSelectedForComparison] = useState<string | null>(null);

  const latest = results.length > 0 ? results[0] : null;
  const previousList = results.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3B5D3A] mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Ayurvedic Progression</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2C23]">
            My Assessment History
          </h1>
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
            Track how your natural constitution and vikriti (current state) evolves across seasons.
          </p>
        </div>

        <button
          id="btn-history-retake"
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#3E2C23]/15 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#C1502E]/10 text-[#C1502E] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#3E2C23] mb-2">
            No Assessments Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 mb-6">
            Take your first 8-layer Ayurvedic assessment to discover your baseline dosha profile.
          </p>
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-xl bg-[#C1502E] text-white font-semibold text-xs sm:text-sm hover:bg-[#a84224] transition-colors"
          >
            Start Assessment Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Latest Assessment Feature Card */}
          {latest && (
            <div className="bg-white rounded-3xl border-2 border-[#C1502E]/30 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C1502E]/10 text-[#C1502E] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Most Recent Assessment</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3E2C23]/10">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23]">
                    Type: {latest.doshaLabel}
                  </h3>
                  <p className="text-xs text-[#3E2C23]/60 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Completed on {latest.date}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id="btn-view-latest-full"
                    onClick={() => onSelectResult(latest)}
                    className="px-5 py-2.5 rounded-xl bg-[#3E2C23] hover:bg-[#2A1E18] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Result</span>
                  </button>
                  <button
                    onClick={onRetake}
                    className="px-4 py-2.5 rounded-xl border border-[#3E2C23]/20 text-[#3E2C23] text-xs sm:text-sm font-semibold hover:bg-[#FAF6EF] transition-colors"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>

              {/* Composition Breakdown */}
              <div className="mt-6">
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-neutral-100 mb-3">
                  <div style={{ width: `${latest.vataPercentage}%` }} className="bg-[#C1502E] h-full" />
                  <div style={{ width: `${latest.pittaPercentage}%` }} className="bg-[#D4A017] h-full" />
                  <div style={{ width: `${latest.kaphaPercentage}%` }} className="bg-[#3B5D3A] h-full" />
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#C1502E]">Vata: {latest.vataPercentage}%</span>
                  <span className="text-[#D4A017]">Pitta: {latest.pittaPercentage}%</span>
                  <span className="text-[#3B5D3A]">Kapha: {latest.kaphaPercentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Historical Progression Timeline */}
          {previousList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#3B5D3A]" />
                <h3 className="font-serif text-xl font-bold text-[#3E2C23]">
                  Previous Assessments
                </h3>
              </div>

              <div className="space-y-3">
                {previousList.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#3E2C23]/15 p-5 hover:border-[#3E2C23]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] border border-[#3E2C23]/10 flex items-center justify-center font-serif font-bold text-sm text-[#3E2C23]">
                        {item.doshaLabel.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-[#3E2C23]">
                            {item.doshaLabel}
                          </h4>
                          <span className="text-[11px] text-[#3E2C23]/50">
                            • {item.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#3E2C23]/70 mt-1">
                          <span>Vata: {item.vataPercentage}%</span>
                          <span>Pitta: {item.pittaPercentage}%</span>
                          <span>Kapha: {item.kaphaPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectResult(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#3E2C23] hover:text-white text-xs font-semibold text-[#3E2C23] transition-colors flex items-center gap-1"
                      >
                        <span>View Result</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteResult(item.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete this record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Track how your balance changes over time note */}
          <div className="p-6 rounded-3xl bg-[#FAF6EF] border border-[#3E2C23]/15">
            <h4 className="font-serif font-bold text-base text-[#3E2C23] mb-1">
              🌿 Tracking Your Prakriti & Vikriti Over Time
            </h4>
            <p className="text-xs text-[#3E2C23]/75 leading-relaxed">
              In Ayurveda, your baseline constitution (Prakriti) remains constant, while your current physiological state (Vikriti) naturally shifts with weather, stress, seasonal transitions, and diet. Retaking the assessment at the start of every season helps you adjust your daily Dinacharya rhythm and nutritional choices accordingly.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
