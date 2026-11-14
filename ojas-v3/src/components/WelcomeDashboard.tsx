import React, { useState } from 'react';
import { 
  Sparkles, History, BookOpen, ArrowRight, Wind, Flame, Droplets, 
  Calendar, Award, Copy, Check, TrendingUp, Stethoscope, Clock, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateProgressInsight } from '../utils/progressTracker';
import { AssessmentResult } from '../types';

interface WelcomeDashboardProps {
  onStartQuiz: () => void;
  onViewResults: (specificResult?: AssessmentResult) => void;
  onViewHistory: () => void;
  onViewLearn: () => void;
  onViewPractitioners: () => void;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  onStartQuiz,
  onViewResults,
  onViewHistory,
  onViewLearn,
  onViewPractitioners
}) => {
  const { user, latestResult, results, logout } = useAuth();
  const [copiedId, setCopiedId] = useState(false);

  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Friend');
  const patientId = user?.patientId || 'OJ-2026-A4B7';

  // Sort assessments from oldest to newest for progress tracking and reverse for recent list
  const chronologicalAssessments = [...results].sort(
    (a, b) => new Date(a.takenAt || a.date).getTime() - new Date(b.takenAt || b.date).getTime()
  );

  const progressInsight = generateProgressInsight(chronologicalAssessments);

  const handleCopyPatientId = async () => {
    try {
      await navigator.clipboard.writeText(patientId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch (e) {
      console.error('Failed to copy ID', e);
    }
  };

  return (
    <div id="patient-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* ─── HEADER BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3E2C23]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#3E2C23]">
              🌿 Ojas
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C1502E]/10 text-[#C1502E] font-medium">
              Patient Portal
            </span>
          </div>
          <p className="text-sm font-medium text-[#3E2C23]/80 mt-0.5">
            Hi, <span className="font-semibold text-[#3E2C23]">{userName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-patient-signout"
            onClick={logout}
            type="button"
            className="px-4 py-2 rounded-xl border border-[#3E2C23]/20 bg-white hover:bg-neutral-50 text-[#3E2C23] text-xs font-semibold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ─── IF FIRST TIME (no assessment taken) ─── */}
      {!latestResult && (
        <div 
          id="patient-first-time-welcome"
          className="bg-gradient-to-br from-[#FAF6EF] via-white to-[#FAF6EF] rounded-3xl border border-[#3E2C23]/15 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden"
        >
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-[#C1502E]/10 text-[#C1502E] flex items-center justify-center mx-auto text-3xl">
              🌿
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3E2C23]">
              Welcome, {userName}! 🌿
            </h2>

            <p className="text-base text-[#3E2C23]/80 leading-relaxed">
              You haven't discovered your Ayurvedic type yet.
            </p>

            <p className="text-sm text-[#3E2C23]/70">
              Take your first 8-layer assessment — it only takes 5 minutes to reveal your natural mind-body blueprint, nutrition guide, and biological clock.
            </p>

            <div className="pt-4">
              <button
                id="btn-take-first-assessment"
                onClick={onStartQuiz}
                type="button"
                className="inline-flex items-center gap-2.5 py-4 px-8 rounded-2xl bg-[#C1502E] hover:bg-[#A84324] text-white text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Take Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── IF HAS TAKEN ASSESSMENT ─── */}
      {latestResult && (
        <>
          {/* Welcome Back Header */}
          <div className="bg-gradient-to-r from-[#FAF6EF] via-white to-[#FAF6EF] rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3E2C23]">
                  Welcome back, {userName}! 🌿
                </h1>
                <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
                  Your constitutional mind-body profile is actively tracked. Review your balance or retake to monitor seasonal shifts.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  id="btn-retake-assessment-top"
                  onClick={onStartQuiz}
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#C1502E] hover:bg-[#A84324] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>
          </div>

          {/* YOUR AYURVEDIC PROFILE CARD */}
          <div 
            id="card-patient-ayurvedic-profile"
            className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3E2C23]/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C1502E]">
                  Your Ayurvedic Profile
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#3E2C23] mt-0.5">
                  Constitutional Balance: {latestResult.doshaLabel}
                </h2>
              </div>

              <button
                id="btn-view-full-results-card"
                onClick={() => onViewResults(latestResult)}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#3E2C23] text-white text-xs font-semibold hover:bg-[#2A1E18] transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>View Full Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#3E2C23]/10">
                <span className="text-xs text-[#3E2C23]/60 block mb-1">Primary Type</span>
                <span className="font-serif text-xl font-bold text-[#C1502E] flex items-center gap-1.5">
                  {latestResult.primaryDosha === 'Vata' && <Wind className="w-5 h-5 text-[#C1502E]" />}
                  {latestResult.primaryDosha === 'Pitta' && <Flame className="w-5 h-5 text-[#D4A017]" />}
                  {latestResult.primaryDosha === 'Kapha' && <Droplets className="w-5 h-5 text-[#3B5D3A]" />}
                  {latestResult.primaryDosha.toUpperCase()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#3E2C23]/10">
                <span className="text-xs text-[#3E2C23]/60 block mb-1">Secondary</span>
                <span className="font-serif text-xl font-bold text-[#3E2C23]">
                  {latestResult.secondaryDosha ? latestResult.secondaryDosha.toUpperCase() : 'None (Single-Dominant)'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#3E2C23]/10">
                <span className="text-xs text-[#3E2C23]/60 block mb-1">Last Assessed</span>
                <span className="font-serif text-lg font-bold text-[#3E2C23] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#3E2C23]/60" />
                  {latestResult.date}
                </span>
              </div>
            </div>

            {/* Dosha Breakdown Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#3E2C23] flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-[#C1502E]" />
                    <span>Vata (Air &amp; Ether)</span>
                  </span>
                  <span className="font-serif font-bold text-sm text-[#C1502E]">
                    {latestResult.vataPercentage}%
                  </span>
                </div>
                <div className="w-full bg-amber-200/50 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#C1502E] h-full rounded-full" style={{ width: `${latestResult.vataPercentage}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#3E2C23] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#D4A017]" />
                    <span>Pitta (Fire &amp; Water)</span>
                  </span>
                  <span className="font-serif font-bold text-sm text-[#D4A017]">
                    {latestResult.pittaPercentage}%
                  </span>
                </div>
                <div className="w-full bg-orange-200/50 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#D4A017] h-full rounded-full" style={{ width: `${latestResult.pittaPercentage}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#3E2C23] flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-[#3B5D3A]" />
                    <span>Kapha (Earth &amp; Water)</span>
                  </span>
                  <span className="font-serif font-bold text-sm text-[#3B5D3A]">
                    {latestResult.kaphaPercentage}%
                  </span>
                </div>
                <div className="w-full bg-emerald-200/50 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#3B5D3A] h-full rounded-full" style={{ width: `${latestResult.kaphaPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ─── YOUR PROGRESS OVER TIME (Shows only if 2+ assessments exist) ─── */}
          {chronologicalAssessments.length >= 2 && (
            <div 
              id="card-patient-progress-over-time"
              className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#3E2C23]/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-[#3B5D3A]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3E2C23]">
                    Your Progress Over Time
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#3B5D3A] bg-[#3B5D3A]/10 px-3 py-1 rounded-full">
                  {chronologicalAssessments.length} Assessments Logged
                </span>
              </div>

              {/* Assessment List */}
              <div className="space-y-3">
                {chronologicalAssessments.map((item, idx) => {
                  const isLatest = idx === chronologicalAssessments.length - 1;
                  const attemptNumber = item.attemptNumber || idx + 1;
                  return (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isLatest 
                          ? 'bg-[#FAF6EF] border-[#C1502E]/40 shadow-xs' 
                          : 'bg-white border-[#3E2C23]/10 hover:border-[#3E2C23]/25'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#3E2C23]">
                            Assessment {attemptNumber} — {item.date}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 rounded-full bg-[#C1502E] text-white text-[10px] font-bold">
                              LATEST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#3E2C23]/75 mt-1 font-medium">
                          Type: <span className="font-semibold text-[#3E2C23]">{item.doshaLabel}</span>{' '}
                          <span className="text-[#3E2C23]/60">
                            (Vata {item.vataPercentage}%, Pitta {item.pittaPercentage}%, Kapha {item.kaphaPercentage}%)
                          </span>
                        </p>
                      </div>

                      <button
                        id={`btn-view-details-attempt-${attemptNumber}`}
                        onClick={() => onViewResults(item)}
                        type="button"
                        className="text-xs font-semibold text-[#C1502E] hover:underline inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Progress Insight */}
              {progressInsight && (
                <div 
                  id="patient-progress-insight-box"
                  className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm text-[#3E2C23] space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-bold text-[#C1502E] text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Progress Insight</span>
                  </div>
                  <p className="leading-relaxed text-[#3E2C23]/85">
                    "{progressInsight}"
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  id="btn-retake-assessment-bottom"
                  onClick={onStartQuiz}
                  type="button"
                  className="px-5 py-2.5 rounded-xl border border-[#3E2C23]/20 bg-white hover:bg-[#FAF6EF] text-[#3E2C23] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C1502E]" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── FEATURE 4: CONNECT WITH A PRACTITIONER ─── */}
      <div 
        id="card-connect-with-practitioner"
        className="bg-gradient-to-br from-[#3B5D3A] to-[#2B462A] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold tracking-wide">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Connect with a Practitioner</span>
            </div>

            <h3 className="font-serif text-2xl font-bold">
              Share Your Records With Your Ayurvedic Doctor
            </h3>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Share this unique Patient ID with your Ayurvedic practitioner. They will add you to their clinical dashboard and can then review all your 8-layer diagnostic answers and progress over time.
            </p>
          </div>

          {/* Patient ID Display Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 min-w-[240px]">
            <span className="text-[11px] uppercase tracking-wider text-white/70 block mb-1">
              Your Patient ID
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-amber-200 block mb-3 select-all">
              {patientId}
            </span>

            <button
              id="btn-copy-patient-id"
              onClick={handleCopyPatientId}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#3B5D3A] hover:bg-amber-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-700">ID Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Patient ID</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── QUICK EXPLORE WISDOM CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          id="btn-explore-wisdom-bottom"
          onClick={onViewLearn}
          type="button"
          className="p-5 rounded-2xl bg-white hover:bg-[#FAF6EF] border border-[#3E2C23]/15 text-left transition-all group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#3B5D3A]/15 text-[#3B5D3A] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#3E2C23] text-sm">Ayurvedic Wisdom &amp; Dinacharya</h4>
              <p className="text-xs text-[#3E2C23]/60">Learn daily circadian routines and natural healing principles</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3E2C23]/40 group-hover:text-[#3E2C23] group-hover:translate-x-1 transition-all" />
        </button>

        <button
          id="btn-browse-directory-bottom"
          onClick={onViewPractitioners}
          type="button"
          className="p-5 rounded-2xl bg-white hover:bg-[#FAF6EF] border border-[#3E2C23]/15 text-left transition-all group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C1502E]/15 text-[#C1502E] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#3E2C23] text-sm">Find Qualified Doctors</h4>
              <p className="text-xs text-[#3E2C23]/60">Browse verified BAMS &amp; MD Ayurveda specialists</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3E2C23]/40 group-hover:text-[#3E2C23] group-hover:translate-x-1 transition-all" />
        </button>
      </div>

    </div>
  );
};
