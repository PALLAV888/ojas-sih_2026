import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EmailVerificationScreenProps {
  email: string;
  onNavigateLogin: () => void;
  onNavigateSignup?: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  email,
  onNavigateLogin,
  onNavigateSignup
}) => {
  const { resendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setResendStatus(null);

    try {
      const ok = await resendVerificationEmail(email);
      if (ok) {
        setResendStatus({
          success: true,
          message: `A fresh verification link has been sent to ${email}. Please check your inbox and spam folder.`
        });
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendStatus({
          success: false,
          message: 'Unable to resend at this moment. You can also re-enter your credentials on the Login page to trigger a new link.'
        });
      }
    } catch (e: any) {
      setResendStatus({
        success: false,
        message: e?.message || 'Failed to resend email. Please try again in a few moments.'
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div id="email-verification-screen" className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-[#a8b5a8]/40 shadow-xl text-center relative overflow-hidden"
      >
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1f5233] via-[#d4a574] to-[#1f5233]" />

        {/* AYUSH & SIH Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f5233]/10 text-[#1f5233] text-[11px] font-semibold mb-5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ministry of AYUSH • Identity Verification</span>
        </div>

        {/* Animated Mail Icon with green accent */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center mb-5 shadow-inner">
          <Mail className="w-8 h-8 text-[#1f5233]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
            !
          </span>
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2">
          Verify Your Email
        </h1>

        {/* Primary Required Notice Message */}
        <div
          id="verification-message-banner"
          className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-[#2c3e2d] text-sm leading-relaxed mb-6 font-medium text-center"
        >
          We have sent you a verification email to{' '}
          <span className="font-bold text-[#1f5233] underline decoration-amber-300 underline-offset-2 break-all">
            {email || 'your email'}
          </span>
          . Please verify it and log in.
        </div>

        {/* Step by step guidance */}
        <div className="text-left bg-gray-50/80 rounded-xl p-3.5 border border-gray-200/70 mb-6 space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#1f5233] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <span>Open your email client and find the verification message from Firebase.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#1f5233] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <span>Click the verification link in the message to activate your OJAS account.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#1f5233] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </span>
            <span>Return to this tab and click the <strong>Log In</strong> button below.</span>
          </div>
        </div>

        {/* Status feedback */}
        {resendStatus && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 text-left ${
              resendStatus.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {resendStatus.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{resendStatus.message}</span>
          </div>
        )}

        {/* Required Primary Action: Login Button */}
        <div className="space-y-3">
          <button
            type="button"
            id="btn-verification-login"
            onClick={onNavigateLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1f5233] hover:bg-[#163c25] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Action: Resend email */}
          <button
            type="button"
            id="btn-verification-resend"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {resending
                ? 'Sending fresh email...'
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend Verification Email'}
            </span>
          </button>
        </div>

        {/* Typo / Switch account link */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Entered the wrong email?</span>
          {onNavigateSignup && (
            <button
              type="button"
              id="btn-link-re-register"
              onClick={onNavigateSignup}
              className="text-[#1f5233] font-bold hover:underline cursor-pointer"
            >
              Sign Up Again
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationScreen;
