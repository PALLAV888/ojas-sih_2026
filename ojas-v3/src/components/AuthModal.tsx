import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, ArrowRight, CheckCircle, RefreshCw, Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'signin'
}) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail,
    verificationNoticeEmail,
    setVerificationNoticeEmail
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleClose = () => {
    setError(null);
    setResendStatus(null);
    onClose();
  };

  const handleCopyHostname = async () => {
    try {
      await navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch (e) {
      console.error('Failed to copy domain', e);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        if (res.error) {
          setError(res.error);
        }
      } else {
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError('Google sign-in could not be completed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendStatus(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const response = await signUpWithEmail(cleanEmail, password);
        if (!response.success) {
          setError(response.error || 'Failed to create account.');
        } else {
          // Verification screen will show because verificationNoticeEmail is set in AuthContext
        }
      } else {
        const response = await loginWithEmail(cleanEmail, password);
        if (!response.success) {
          if (response.unverified) {
            // Screen handles verification message
          } else {
            setError(response.error || 'Email or password is incorrect');
          }
        } else {
          handleClose();
          if (onSuccess) onSuccess();
        }
      }
    } catch (err: any) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLoginFromVerification = () => {
    setVerificationNoticeEmail(null);
    setIsSignUp(false);
    setError(null);
    setResendStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF6EF] border border-[#3E2C23]/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#C1502E]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#3B5D3A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#3E2C23]/60 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Verification Screen View */}
        {verificationNoticeEmail ? (
          <div className="text-center py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B5D3A]/15 text-[#3B5D3A] mb-4">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#3E2C23] mb-2">
              Verify Your Email
            </h2>

            <div className="p-4 rounded-2xl bg-white border border-[#3E2C23]/10 mb-6 text-left">
              <p className="text-sm text-[#3E2C23] leading-relaxed font-normal">
                We have sent you a verification email to{' '}
                <strong className="font-semibold text-[#C1502E] break-all">{verificationNoticeEmail}</strong>. 
                Please verify it and log in.
              </p>
            </div>

            {resendStatus && (
              <p className="text-xs text-[#3B5D3A] font-medium mb-4 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{resendStatus}</span>
              </p>
            )}

            <button
              id="btn-verification-login"
              type="button"
              onClick={handleBackToLoginFromVerification}
              className="w-full py-3.5 px-4 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-sm shadow-md shadow-[#C1502E]/25 transition-all flex items-center justify-center gap-2 mb-3 active:scale-[0.99]"
            >
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-verification-resend"
              type="button"
              onClick={() => {
                setResendStatus('Verification link refreshed. Please check your inbox & spam folders.');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#3E2C23]/70 hover:text-[#3E2C23] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Didn't receive email? Check spam or retry</span>
            </button>
          </div>
        ) : (
          <>
            {/* Title & Tagline */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C1502E] text-white shadow-sm shadow-[#C1502E]/30 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23]">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-1">
                {isSignUp 
                  ? 'Begin your personalized 8-layer Ayurvedic assessment.' 
                  : 'Sign in to access your assessments and daily balance.'}
              </p>
            </div>

            {error === 'UNAUTHORIZED_DOMAIN' ? (
              <div 
                id="auth-unauthorized-domain-banner"
                className="mb-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-[#3E2C23] text-xs space-y-2.5 animate-in fade-in duration-150 text-left"
              >
                <div className="flex items-start gap-2 text-amber-900 font-semibold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Google Sign-In: Domain Authorization Required</span>
                </div>
                
                <p className="text-[11px] text-[#3E2C23]/80 leading-relaxed">
                  Firebase requires your current preview domain to be whitelisted for Google OAuth popup:
                </p>

                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-amber-200">
                  <code className="text-[11px] font-mono text-[#3E2C23] truncate select-all">
                    {currentHostname}
                  </code>
                  <button
                    id="btn-copy-auth-domain"
                    type="button"
                    onClick={handleCopyHostname}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedDomain ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-amber-800" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[10px] text-[#3E2C23]/70 space-y-2 pt-0.5">
                  <button
                    type="button"
                    id="btn-modal-unauthorized-fallback"
                    onClick={async () => {
                      setError(null);
                      setGoogleLoading(true);
                      try {
                        const res = await loginWithGoogle();
                        if (res.success) {
                          handleClose();
                          if (onSuccess) onSuccess();
                        }
                      } finally {
                        setGoogleLoading(false);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-medium text-xs transition-colors text-center cursor-pointer shadow-xs"
                  >
                    Continue as Google Account (Instant Fallback)
                  </button>
                  <p><strong>To enable native Google OAuth:</strong> In Firebase Console → <em>Authentication</em> → <em>Settings</em> → <em>Authorized domains</em> → Add copied domain.</p>
                  <p className="text-[#C1502E] font-medium">
                    👇 <strong>Or sign in immediately with Email &amp; Password below!</strong>
                  </p>
                </div>
              </div>
            ) : error ? (
              <div 
                id="auth-error-message"
                className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-left"
              >
                {error}
              </div>
            ) : null}

            {/* Google OAuth Button */}
            <button
              id="btn-google-auth"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#3E2C23] font-medium border border-[#3E2C23]/15 shadow-xs transition-all hover:border-[#3E2C23]/30 active:scale-[0.99] mb-4 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
              <span>{googleLoading ? 'Connecting to Google...' : (isSignUp ? 'Sign up with Google' : 'Sign in with Google')}</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#3E2C23]/15" />
              <span className="text-[11px] uppercase tracking-wider text-[#3E2C23]/50 font-semibold">
                Or with email
              </span>
              <div className="flex-1 h-px bg-[#3E2C23]/15" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3E2C23]/80 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#3E2C23]/40 absolute left-3 top-3.5" />
                  <input
                    id="auth-input-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#3E2C23]/15 text-sm text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E] focus:ring-1 focus:ring-[#C1502E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E2C23]/80 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#3E2C23]/40 absolute left-3 top-3.5" />
                  <input
                    id="auth-input-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#3E2C23]/15 text-sm text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E] focus:ring-1 focus:ring-[#C1502E]"
                  />
                </div>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-sm shadow-md shadow-[#C1502E]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : isSignUp ? (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center mt-4 pt-3 border-t border-[#3E2C23]/10">
              <button
                id="toggle-signup-mode-btn"
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-xs text-[#3E2C23]/80 hover:text-[#C1502E] font-medium transition-colors"
              >
                {isSignUp ? (
                  <span>Already have an account? <strong className="text-[#C1502E]">Sign In</strong></span>
                ) : (
                  <span>Don't have an account? <strong className="text-[#C1502E]">Sign Up</strong></span>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
