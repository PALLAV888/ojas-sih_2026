import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Stethoscope,
  Building,
  Phone,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SignupPageProps {
  onNavigateLogin: (prefilledEmail?: string) => void;
  onNavigateVerification: (email: string) => void;
  onSignupSuccess: (role: UserRole) => void;
  initialEmail?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateLogin,
  onNavigateVerification,
  onSignupSuccess,
  initialEmail = ''
}) => {
  const { loginWithGoogle, signUpWithEmail, switchRole } = useAuth();

  const [role, setRole] = useState<UserRole>('patient');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [clinicOrAge, setClinicOrAge] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle(role);
      if (res.success) {
        await switchRole(role);
        onSignupSuccess(role);
      } else {
        setError(res.error || 'Google sign-up failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpWithEmail(email, password, role, fullName);
      if (res.requiresVerification || res.unverified) {
        // Requirement: Do not sign them in automatically.
        // Send a verification email and show verification screen.
        onNavigateVerification(res.unverifiedEmail || email.trim());
      } else if (res.success) {
        await switchRole(role);
        onSignupSuccess(role);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in');
      } else {
        setError(err.message || 'Registration error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-page-container" className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-[#a8b5a8]/30 shadow-lg text-left"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f5233]/10 text-[#1f5233] text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry of AYUSH • SIH 2026</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1a1a1a]">
            Create an OJAS Account
          </h1>
          <p className="text-xs text-[#6b7280] mt-1">
            Standardized Ayurvedic Healthcare Ecosystem
          </p>
        </div>

        {/* Distinct Segmented Tabs: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
          <button
            type="button"
            id="tab-auth-login"
            onClick={() => onNavigateLogin(email)}
            className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            id="tab-auth-signup"
            className="py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-white text-[#1f5233] shadow-xs cursor-default"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register / Sign Up</span>
          </button>
        </div>

        {/* Role Toggle */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[#1a1a1a] block mb-2">
            I am joining as
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              id="btn-signup-role-patient"
              onClick={() => setRole('patient')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'patient'
                  ? 'bg-white text-[#1f5233] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              id="btn-signup-role-practitioner"
              onClick={() => setRole('practitioner')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'practitioner'
                  ? 'bg-white text-[#1f5233] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor / Vaidya</span>
            </button>
          </div>
        </div>

        {/* Domain Notice or Error Alert */}
        {error === 'UNAUTHORIZED_DOMAIN' ? (
          <div 
            id="auth-unauthorized-domain-banner"
            className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-300 text-[#3E2C23] text-xs space-y-2.5 text-left"
          >
            <div className="flex items-start gap-2 text-amber-900 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Google Sign-In: Firebase Domain Authorization Required</span>
            </div>
            
            <p className="text-[11px] text-[#3E2C23]/80 leading-relaxed">
              Firebase Authentication requires your current preview domain to be whitelisted for Google OAuth popups (Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized Domains):
            </p>

            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-amber-200">
              <code className="text-[11px] font-mono text-[#3E2C23] truncate select-all">
                {currentHostname}
              </code>
              <button
                id="btn-copy-auth-domain"
                type="button"
                onClick={handleCopyHostname}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
              >
                {copiedDomain ? <Check className="w-3 h-3 text-green-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                id="btn-retry-google-signup"
                onClick={handleGoogleSignUp}
                className="w-full py-2 px-3 rounded-lg bg-[#1f5233] hover:bg-[#163c25] text-white font-semibold text-xs transition-colors text-center cursor-pointer shadow-xs"
              >
                Retry Google Sign-Up
              </button>
              <p className="text-[10px] text-amber-900/80">
                Or create your account using email and password below.
              </p>
            </div>
          </div>
        ) : error === 'User already exists. Please sign in' ? (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span className="font-bold">User already exists. Please sign in</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This email is already registered on OJAS. You can sign in directly with your password.
            </p>
            <button
              type="button"
              id="btn-switch-to-login-from-error"
              onClick={() => onNavigateLogin(email)}
              className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f5233] hover:bg-[#163c25] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Switch to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : error ? (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Google Sign Up */}
        <button
          type="button"
          id="btn-google-signup"
          disabled={loading}
          onClick={handleGoogleSignUp}
          className="w-full py-2.5 px-4 mb-5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1a1a1a] flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>Sign up with Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-[#6b7280] uppercase tracking-wider relative">
            or sign up with email
          </span>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#6b7280] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="input-signup-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={role === 'practitioner' ? 'Dr. Radha Raman' : 'Arjun Sharma'}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6b7280] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="input-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@ayush.gov.in"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6b7280] block mb-1">
              Password (min 6 characters)
            </label>
            <input
              type="password"
              id="input-signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="input-signup-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 44521"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                {role === 'practitioner' ? 'Clinic Name' : 'Age'}
              </label>
              <input
                type="text"
                id="input-signup-extra"
                value={clinicOrAge}
                onChange={(e) => setClinicOrAge(e.target.value)}
                placeholder={role === 'practitioner' ? 'Sanjeevani Clinic' : '32'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1f5233] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-signup-submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1f5233] text-white text-xs font-bold hover:bg-[#163c25] transition-colors shadow-xs disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? 'Creating Account & Sending Email...' : 'Create Account & Send Verification Email'}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center mt-6 text-xs text-[#6b7280]">
          <span>Already registered on OJAS? </span>
          <button
            type="button"
            id="btn-link-login"
            onClick={() => onNavigateLogin(email)}
            className="font-bold text-[#1f5233] hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
