import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AssessmentResult, UserRole, VerificationStatus } from '../types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from '../firebase/config';
import {
  generatePatientId
} from '../firebase/firestoreService';
import { formatNameFromEmail } from '../firebase/authService';

export interface AuthResponse {
  success: boolean;
  error?: string;
  unverified?: boolean;
  emailSent?: boolean;
  requiresVerification?: boolean;
  unverifiedEmail?: string;
  message?: string;
}

export interface PractitionerSetupData {
  name: string;
  qualification: string;
  ncismNumber: string;
  clinicName: string;
  clinicLocation: string;
  bio: string;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  profile: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  needsRoleSelection: boolean;
  needsPractitionerSetup: boolean;
  verificationNoticeEmail: string | null;
  setVerificationNoticeEmail: (email: string | null) => void;
  results: AssessmentResult[];
  login: (emailOrUid: string, role?: UserRole, name?: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loginWithGoogle: (preferredRole?: UserRole, customEmail?: string) => Promise<AuthResponse>;
  loginWithEmail: (email: string, password: string, preferredRole?: UserRole) => Promise<AuthResponse>;
  signUpWithEmail: (email: string, password: string, role?: UserRole, name?: string) => Promise<AuthResponse>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  completePractitionerProfile: (data: PractitionerSetupData) => Promise<void>;
  saveResult: (result: AssessmentResult) => Promise<void>;
  deleteResult: (resultId: string) => void;
  latestResult: AssessmentResult | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [needsPractitionerSetup, setNeedsPractitionerSetup] = useState(false);
  const [verificationNoticeEmail, setVerificationNoticeEmail] = useState<string | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  // Derived role
  const role: UserRole = user?.role || 'patient';

  // Function to load authenticated user state in memory without saving to Firestore
  const loadUserProfile = async (
    firebaseUid: string,
    defaultName: string,
    email: string,
    avatar?: string,
    preferredRole?: UserRole
  ) => {
    let resolvedRole: UserRole = preferredRole || 'patient';
    try {
      const storedRole = localStorage.getItem('ojas_user_role') as UserRole;
      if (storedRole === 'patient' || storedRole === 'practitioner') {
        resolvedRole = storedRole;
      }
    } catch (e) {
      // ignore
    }

    const authUser: User = {
      id: firebaseUid,
      name: defaultName,
      email,
      avatar,
      createdAt: new Date().toISOString(),
      role: resolvedRole,
      patientId: resolvedRole === 'patient' ? generatePatientId() : undefined,
      verificationStatus: resolvedRole === 'practitioner' ? 'verified' : undefined,
      qualification: resolvedRole === 'practitioner' ? 'BAMS, MD (Ayurveda)' : undefined,
      clinicName: resolvedRole === 'practitioner' ? 'Sanjeevani Ayurvedic Clinic' : undefined
    };

    setUser(authUser);
    setNeedsRoleSelection(false);
    setNeedsPractitionerSetup(false);
  };

  // Listen directly to Firebase Auth state
  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      setLoading(true);

      if (firebaseUser) {
        // If account was created with email/password and is not yet verified, block access
        const isPasswordAuth = firebaseUser.providerData.some(p => p.providerId === 'password');
        if (isPasswordAuth && !firebaseUser.emailVerified) {
          await signOut(auth);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const rawName = firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        await loadUserProfile(
          firebaseUser.uid,
          formattedName,
          firebaseUser.email || '',
          firebaseUser.photoURL || undefined
        );
      } else {
        // If not logged in through Firebase Auth SDK, check demo session if any
        try {
          const stored = localStorage.getItem('ojas_demo_session');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.uid && mounted) {
              const fallbackName = parsed.role === 'practitioner' ? 'Dr. Radha Sharma' : 'Arjun Singh';
              setUser({
                id: parsed.uid,
                name: fallbackName,
                email: `${parsed.uid}@ojas.ayush.gov.in`,
                role: parsed.role || 'patient',
                createdAt: new Date().toISOString(),
                patientId: parsed.role === 'patient' ? generatePatientId() : undefined,
                verificationStatus: parsed.role === 'practitioner' ? 'verified' : undefined
              });
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          // ignore
        }

        if (mounted) {
          setUser(null);
          setNeedsRoleSelection(false);
          setNeedsPractitionerSetup(false);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Load results whenever authenticated patient changes
  useEffect(() => {
    if (!user || user.role === 'practitioner') {
      if (user?.role === 'practitioner') {
        setResults([]);
      }
      return;
    }

    const fetchResults = async () => {
      try {
        const stored = localStorage.getItem(`ojas_results_${user.id}`);
        if (stored) {
          setResults(JSON.parse(stored));
        } else {
          setResults([]);
        }
      } catch (e) {
        setResults([]);
      }
    };

    fetchResults();
  }, [user]);

  // Demo / local test login helper
  const login = async (emailOrUid: string, targetRole: UserRole = 'patient', preferredName?: string) => {
    setLoading(true);
    try {
      let uid = emailOrUid.replace(/[^a-zA-Z0-9_-]/g, '_');
      const isDoc = targetRole === 'practitioner';

      if (emailOrUid.includes('arjun') || (!isDoc && emailOrUid.includes('demo'))) {
        uid = 'demo-patient-arjun';
      } else if (emailOrUid.includes('radha') || (isDoc && emailOrUid.includes('demo'))) {
        uid = 'demo-practitioner-radha';
      }

      const mockUser: User = {
        id: uid,
        email: emailOrUid.includes('@') ? emailOrUid : `${emailOrUid}@ojas.ayush.gov.in`,
        name: preferredName || (isDoc ? 'Dr. Radha Sharma' : 'Arjun Singh'),
        role: targetRole,
        createdAt: new Date().toISOString(),
        patientId: !isDoc ? generatePatientId() : undefined,
        verificationStatus: isDoc ? 'verified' : undefined,
        qualification: isDoc ? 'BAMS, MD (Ayurveda - Kayachikitsa)' : undefined,
        clinicName: isDoc ? 'Sanjeevani Ayurvedic Clinic & Research' : undefined,
        ncismNumber: isDoc ? 'NCISM/AYU/2022/19482' : undefined
      };

      setUser(mockUser);
      try {
        localStorage.setItem('ojas_user_role', targetRole);
        localStorage.setItem('ojas_demo_session', JSON.stringify({ uid: mockUser.id, role: mockUser.role }));
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch role between patient and practitioner
  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    try {
      localStorage.setItem('ojas_user_role', newRole);
    } catch (e) {}
    setUser({
      ...user,
      role: newRole,
      patientId: newRole === 'patient' ? (user.patientId || generatePatientId()) : user.patientId,
      verificationStatus: newRole === 'practitioner' ? (user.verificationStatus || 'verified') : undefined
    });
  };

  // Update profile attributes
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...updates
    });
  };

  const selectRole = async (selectedRole: UserRole) => {
    if (!user) return;
    try {
      localStorage.setItem('ojas_user_role', selectedRole);
    } catch (e) {}

    if (selectedRole === 'patient') {
      setUser({
        ...user,
        role: 'patient',
        patientId: user.patientId || generatePatientId()
      });
      setNeedsRoleSelection(false);
      setNeedsPractitionerSetup(false);
    } else {
      setNeedsRoleSelection(false);
      setNeedsPractitionerSetup(true);
    }
  };

  const completePractitionerProfile = async (data: PractitionerSetupData) => {
    if (!user) return;

    setUser({
      ...user,
      name: data.name || user.name,
      role: 'practitioner',
      qualification: data.qualification,
      ncismNumber: data.ncismNumber,
      clinicName: data.clinicName,
      clinicLocation: data.clinicLocation,
      bio: data.bio,
      verificationStatus: 'verified'
    });

    setNeedsPractitionerSetup(false);
  };

  /**
   * Genuine Google OAuth popup using Firebase Authentication SDK
   */
  const loginWithGoogle = async (
    preferredRole: UserRole = 'patient'
  ): Promise<AuthResponse> => {
    try {
      if (preferredRole) {
        try {
          localStorage.setItem('ojas_user_role', preferredRole);
        } catch (e) {}
      }
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const defaultName = fbUser.displayName || (preferredRole === 'practitioner' ? 'Dr. Vaidya' : 'Seeker');
      await loadUserProfile(
        fbUser.uid,
        defaultName,
        fbUser.email || '',
        fbUser.photoURL || undefined,
        preferredRole
      );
      return { success: true };
    } catch (error: any) {
      console.warn('Firebase Google Auth Sign-In Error:', error);
      const code = error?.code || '';

      if (code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'UNAUTHORIZED_DOMAIN'
        };
      }

      if (code === 'auth/operation-not-allowed') {
        return {
          success: false,
          error: 'Google Sign-In is not enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Google.'
        };
      }

      if (code === 'auth/popup-blocked') {
        return {
          success: false,
          error: 'Sign-in popup was blocked by your browser. Please allow popups or open this app in a new tab.'
        };
      }

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return {
          success: false,
          error: 'Google Sign-in was cancelled before completing.'
        };
      }

      return {
        success: false,
        error: error?.message || 'Google sign-in could not be completed with Firebase.'
      };
    }
  };

  /**
   * Genuine Email/Password sign-in using Firebase Authentication SDK
   */
  const loginWithEmail = async (
    email: string,
    password: string,
    preferredRole?: UserRole
  ): Promise<AuthResponse> => {
    try {
      if (preferredRole) {
        try {
          localStorage.setItem('ojas_user_role', preferredRole);
        } catch (e) {}
      }
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Check if email is verified
      if (!cred.user.emailVerified) {
        const targetEmail = cred.user.email || email.trim();
        try {
          await sendEmailVerification(cred.user);
        } catch (verErr) {
          console.warn('Auto-resend verification error on login attempt:', verErr);
        }
        // Block access & sign out immediately
        await signOut(auth);
        setUser(null);
        setVerificationNoticeEmail(targetEmail);
        return {
          success: false,
          requiresVerification: true,
          unverified: true,
          unverifiedEmail: targetEmail,
          error: `We have sent you a verification email to ${targetEmail}. Please verify it and log in.`
        };
      }

      setVerificationNoticeEmail(null);
      if (cred.user) {
        await loadUserProfile(
          cred.user.uid,
          cred.user.displayName || email.split('@')[0],
          cred.user.email || email,
          undefined,
          preferredRole
        );
      }
      return { success: true };
    } catch (error: any) {
      console.warn('Firebase Email Sign-In Notice:', error);
      // Requirements: If credentials are incorrect, show: "Email or password is incorrect"
      return { success: false, error: 'Email or password is incorrect' };
    }
  };

  /**
   * Genuine Email/Password sign-up using Firebase Authentication SDK
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    roleToAssign: UserRole = 'patient',
    name?: string
  ): Promise<AuthResponse> => {
    try {
      if (roleToAssign) {
        try {
          localStorage.setItem('ojas_user_role', roleToAssign);
        } catch (e) {}
      }
      const trimmedEmail = email.trim();
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

      // Send verification email
      try {
        await sendEmailVerification(cred.user);
      } catch (verErr) {
        console.warn('sendEmailVerification error:', verErr);
      }

      // Requirement: When a user registers with email/password, do not sign them in automatically.
      await signOut(auth);
      setUser(null);
      setVerificationNoticeEmail(trimmedEmail);

      return {
        success: true,
        requiresVerification: true,
        unverified: true,
        unverifiedEmail: trimmedEmail,
        message: `We have sent you a verification email to ${trimmedEmail}. Please verify it and log in.`
      };
    } catch (error: any) {
      const code = error?.code || '';
      // Requirements: If the email already exists, show: "User already exists. Please sign in"
      if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'User already exists. Please sign in' };
      }
      if (code === 'auth/weak-password') {
        return { success: false, error: 'Password should be at least 6 characters long.' };
      }
      console.warn('Firebase Email Sign-Up Notice:', error);
      return { success: false, error: error.message || 'Failed to create account.' };
    }
  };

  const resendVerificationEmail = async (targetEmail: string): Promise<boolean> => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return true;
      }
      return true;
    } catch (e) {
      console.warn('resendVerificationEmail notice:', e);
      return false;
    }
  };

  /**
   * Genuine Sign-out using Firebase Authentication SDK
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase Sign-Out Notice:', e);
    }
    try {
      localStorage.removeItem('ojas_demo_session');
      localStorage.removeItem('ojas_user_role');
      localStorage.removeItem('ojas_google_email');
    } catch (e) {
      // ignore
    }
    setUser(null);
    setResults([]);
    setNeedsRoleSelection(false);
    setNeedsPractitionerSetup(false);
    setVerificationNoticeEmail(null);
  };

  const saveResult = async (newResult: AssessmentResult) => {
    if (!user) return;

    const resultToSave: AssessmentResult = {
      ...newResult,
      userId: user.id,
      patientId: user.patientId || newResult.patientId,
      userName: user.name
    };

    try {
      const key = `ojas_results_${user.id}`;
      const existingRaw = localStorage.getItem(key);
      const existingList: AssessmentResult[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [resultToSave, ...existingList.filter(r => r.id !== resultToSave.id)];
      localStorage.setItem(key, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Error caching assessment result:', e);
    }
    
    const updatedResults = [resultToSave, ...results.filter(r => r.id !== resultToSave.id)];
    setResults(updatedResults);

    setUser(prev => prev ? {
      ...prev,
      lastAssessmentDate: resultToSave.date
    } : null);
  };

  const deleteResult = (resultId: string) => {
    if (!user) return;
    const updated = results.filter((r) => r.id !== resultId);
    setResults(updated);
    try {
      localStorage.setItem(`ojas_results_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting assessment result', e);
    }
  };

  const refreshUserData = async () => {
    // Authenticate users only - no profile data from Firestore
  };

  const latestResult = results.length > 0 ? results[0] : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        profile: user,
        isAuthenticated: !!user,
        loading,
        needsRoleSelection,
        needsPractitionerSetup,
        verificationNoticeEmail,
        setVerificationNoticeEmail,
        results,
        login,
        switchRole,
        updateProfile,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        resendVerificationEmail,
        logout,
        selectRole,
        completePractitionerProfile,
        saveResult,
        deleteResult,
        latestResult,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
