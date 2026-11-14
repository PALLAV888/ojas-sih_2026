import React from 'react';
import { motion } from 'motion/react';
import { User, Stethoscope, ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RoleSelectionScreen: React.FC = () => {
  const { selectRole, user } = useAuth();

  return (
    <div 
      id="role-selection-screen"
      className="min-h-[85vh] flex items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl w-full bg-white rounded-3xl border border-[#3E2C23]/15 shadow-2xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#C1502E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#3B5D3A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EF] border border-[#3E2C23]/15 text-[#3E2C23] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C1502E]" />
            <span>Welcome to Ojas, {user?.name || 'Friend'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3E2C23]">
            Who are you joining as?
          </h2>
          <p className="text-sm text-[#3E2C23]/70 max-w-lg mx-auto">
            Choose your account type to personalize your experience. This is set once for your profile.
          </p>
        </div>

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-left">
          {/* Card 1: Patient */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            id="card-role-patient"
            className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] border-2 border-[#3E2C23]/15 hover:border-[#C1502E] transition-all group shadow-sm"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#C1502E]/10 text-[#C1502E] flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                🧑
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3E2C23] mb-2 flex items-center gap-2">
                <span>I am a Patient</span>
              </h3>
              <p className="text-sm text-[#3E2C23]/75 leading-relaxed mb-6">
                "I want to discover my Ayurvedic type and track my health journey."
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#3E2C23]/70">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#C1502E]" />
                  <span>8-Layer Constitutional Dosha Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C1502E]" />
                  <span>Personalized Nutrition, Clock & Seasonal Tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#C1502E]" />
                  <span>Connect seamlessly with qualified practitioners</span>
                </div>
              </div>
            </div>

            <button
              id="btn-join-as-patient"
              type="button"
              onClick={() => selectRole('patient')}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C1502E] hover:bg-[#A84324] text-white text-sm font-semibold transition-all shadow-md cursor-pointer group-hover:shadow-lg"
            >
              <span>Join as Patient</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card 2: Practitioner */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            id="card-role-practitioner"
            className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] border-2 border-[#3E2C23]/15 hover:border-[#3B5D3A] transition-all group shadow-sm"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#3B5D3A]/10 text-[#3B5D3A] flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                👨‍⚕️
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3E2C23] mb-2 flex items-center gap-2">
                <span>I am a Practitioner</span>
              </h3>
              <p className="text-sm text-[#3E2C23]/75 leading-relaxed mb-6">
                "I am a qualified Ayurvedic doctor or health professional."
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#3E2C23]/70">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-[#3B5D3A]" />
                  <span>Clinical Patient Management Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B5D3A]" />
                  <span>Full 8-Layer Answers & Dosha Progress Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#3B5D3A]" />
                  <span>Private Clinical Consult Notes & Records</span>
                </div>
              </div>
            </div>

            <button
              id="btn-join-as-practitioner"
              type="button"
              onClick={() => selectRole('practitioner')}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3B5D3A] hover:bg-[#2F4A2E] text-white text-sm font-semibold transition-all shadow-md cursor-pointer group-hover:shadow-lg"
            >
              <span>Join as Practitioner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        <p className="text-xs text-[#3E2C23]/50 mt-8">
          🔒 Your role determines your workspace tools and data access permissions.
        </p>
      </motion.div>
    </div>
  );
};
