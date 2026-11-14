import React, { useState } from 'react';
import { Leaf, Sparkles, ArrowRight, Wind, Flame, Droplets, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingHeroProps {
  onStartQuiz: () => void;
  onOpenAuth: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartQuiz, onOpenAuth }) => {
  const { loginWithGoogle, signUpWithEmail, isAuthenticated } = useAuth();
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleStartFlow = () => {
    if (isAuthenticated) {
      onStartQuiz();
    } else {
      onOpenAuth();
    }
  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success && res.error) {
        onOpenAuth();
      }
    } catch (e) {
      onOpenAuth();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError(null);
    if (!quickEmail || !quickPassword) {
      setQuickError('Please enter your email and password.');
      return;
    }

    setQuickLoading(true);
    try {
      const res = await signUpWithEmail(quickEmail, quickPassword);
      if (!res.success) {
        setQuickError(res.error || 'Failed to sign up');
      } else {
        // Open auth modal to show verification notice
        onOpenAuth();
      }
    } catch (err: any) {
      setQuickError('Failed to create account.');
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      
      {/* Subtle botanical background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#C1502E]/10 via-[#D4A017]/10 to-[#3B5D3A]/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B5D3A]/10 border border-[#3B5D3A]/20 text-[#3B5D3A] text-xs font-semibold uppercase tracking-widest mb-6">
            <Leaf className="w-4 h-4 text-[#3B5D3A]" />
            <span>Discover Your Balance</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3E2C23] tracking-tight leading-[1.15] mb-6">
            Understand your Ayurvedic type in <span className="text-[#C1502E] underline decoration-[#D4A017]/40 decoration-wavy">8 simple steps</span>
          </h1>

          <p className="text-base sm:text-lg text-[#3E2C23]/80 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            Your body is unique. Your health guidance should be too. Take the 8-layer Ayurvedic assessment and get a plan built around you.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              id="hero-cta-get-started"
              onClick={handleStartFlow}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-base shadow-lg shadow-[#C1502E]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-cta-google-login"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-[#3E2C23] font-medium text-sm border border-[#3E2C23]/15 shadow-xs transition-all hover:border-[#3E2C23]/30 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-[#C1502E] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
            </button>
          </div>

          {/* Inline Email Sign Up Form */}
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xs border border-[#3E2C23]/10 rounded-2xl p-4 shadow-xs">
            {quickError && (
              <div className="mb-2 text-xs text-red-600 font-medium">
                {quickError}
              </div>
            )}
            <form onSubmit={handleQuickSignUp} className="flex flex-col sm:flex-row gap-2">
              <input
                id="hero-quick-email-input"
                type="email"
                required
                placeholder="Enter email"
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E]"
              />
              <input
                id="hero-quick-pass-input"
                type="password"
                required
                placeholder="Password"
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E]"
              />
              <button
                id="hero-quick-signup-btn"
                type="submit"
                disabled={quickLoading}
                className="px-4 py-2 rounded-xl bg-[#3E2C23] hover:bg-[#2A1E18] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {quickLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-[#3E2C23]/70">
              <button
                type="button"
                onClick={onOpenAuth}
                className="underline hover:text-[#C1502E] cursor-pointer"
              >
                Login with existing account
              </button>
            </div>
          </div>

        </div>

        {/* 3 Doshas Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Vata Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#3E2C23]/10 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C1502E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Wind className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Vata (Air & Space)</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">Kinetic</span>
            </div>
            <p className="text-xs text-[#3E2C23]/70 mb-4 leading-relaxed">
              Governs all biological movement, nerve impulses, circulation, respiration, and imaginative intuition.
            </p>
            <ul className="space-y-1.5 text-xs text-[#3E2C23]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Naturally creative, light, and enthusiastic</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Balanced by warm, grounding, cooked foods</span>
              </li>
            </ul>
          </div>

          {/* Pitta Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#3E2C23]/10 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#C1502E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Pitta (Fire & Water)</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-medium">Metabolic</span>
            </div>
            <p className="text-xs text-[#3E2C23]/70 mb-4 leading-relaxed">
              Governs metabolic digestion, nutrient assimilation, body temperature, and sharp decision-making.
            </p>
            <ul className="space-y-1.5 text-xs text-[#3E2C23]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Sharp intellect, courageous, leadership-driven</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Balanced by cooling, fresh, hydrating foods</span>
              </li>
            </ul>
          </div>

          {/* Kapha Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#3E2C23]/10 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3B5D3A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-bold text-[#3E2C23]">Kapha (Water & Earth)</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-medium">Structural</span>
            </div>
            <p className="text-xs text-[#3E2C23]/70 mb-4 leading-relaxed">
              Governs cellular structure, joint lubrication, immune strength, patience, and emotional stability.
            </p>
            <ul className="space-y-1.5 text-xs text-[#3E2C23]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Grounded, loyal, enduring, and nurturing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D3A]" />
                <span>Balanced by light, spicy, and active routines</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 8 Assessment Layers Step Roadmap */}
        <div className="bg-[#FAF6EF] rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mb-2">
            The 8 Diagnostic Layers of Ojas
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2C23]/70 max-w-xl mx-auto mb-8">
            Our evidence-grounded Ayurvedic rubric examines your baseline constitutional traits across 8 physiological domains:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { num: '1', title: 'Body Frame', desc: 'Skeletal & bone structure' },
              { num: '2', title: 'Skin Type', desc: 'Natural moisture & tone' },
              { num: '3', title: 'Hair Texture', desc: 'Thickness & follicles' },
              { num: '4', title: 'Digestion', desc: 'Agni metabolic speed' },
              { num: '5', title: 'Appetite', desc: 'Hunger & meal rhythm' },
              { num: '6', title: 'Sleep Pattern', desc: 'Depth & waking cycle' },
              { num: '7', title: 'Energy Drive', desc: 'Stamina & endurance' },
              { num: '8', title: 'Temperament', desc: 'Mind & emotional default' }
            ].map((layer) => (
              <div 
                key={layer.num}
                className="bg-white/80 rounded-2xl p-3 sm:p-4 border border-[#3E2C23]/10 text-left"
              >
                <span className="inline-block w-6 h-6 rounded-full bg-[#C1502E]/15 text-[#C1502E] text-xs font-bold text-center leading-6 mb-2">
                  {layer.num}
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-[#3E2C23]">{layer.title}</h4>
                <p className="text-[11px] text-[#3E2C23]/60">{layer.desc}</p>
              </div>
            ))}
          </div>

          <button
            id="btn-start-layers-flow"
            onClick={handleStartFlow}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#3B5D3A] hover:bg-[#2f4a2e] text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <span>Begin Layer 1: Body Frame</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
