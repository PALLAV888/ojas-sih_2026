/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LanguageSelector } from './components/LanguageSelector';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { EmailVerificationScreen } from './components/EmailVerificationScreen';
import { PatientDashboard } from './components/PatientDashboard';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResults } from './components/AssessmentResults';
import { PatientAppointments } from './components/PatientAppointments';
import { PatientProfile } from './components/PatientProfile';
import { DoctorDirectory } from './components/DoctorDirectory';
import { PractitionerDashboard } from './components/PractitionerDashboard';
import { PractitionerVerification } from './components/PractitionerVerification';
import { PractitionerAppointments } from './components/PractitionerAppointments';
import { PractitionerProfile } from './components/PractitionerProfile';
import { PatientDetail } from './components/PatientDetail';
import { NotFoundPage } from './components/NotFoundPage';
import { PageTransition } from './components/PageTransition';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AssessmentResult } from './types';
import { ShieldCheck, Heart, Leaf } from 'lucide-react';

function RouterApp() {
  const { user, role, loading, latestResult } = useAuth();

  // Get initial route from hash or pathname
  const getInitialRoute = (): string => {
    // If first time visit (no language selected in localStorage), prompt language
    const langSet = localStorage.getItem('ojas_language');
    const hash = window.location.hash.replace(/^#/, '');
    const current = hash || window.location.pathname || '/';

    if (!langSet && (current === '/' || current === '')) {
      return '/language';
    }
    return current;
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialRoute);
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<{ id: string; name: string } | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('ojas_verification_email') || '';
    } catch {
      return '';
    }
  });
  const [authInitialEmail, setAuthInitialEmail] = useState<string>('');

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', '#' + path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Root `/` redirection
  useEffect(() => {
    if (loading) return;

    if (currentPath === '/' || currentPath === '') {
      const lang = localStorage.getItem('ojas_language');
      if (!lang) {
        navigate('/language');
      } else if (!user) {
        navigate('/login');
      } else if (role === 'patient') {
        navigate('/patient');
      } else if (role === 'practitioner') {
        navigate('/practitioner');
      }
    }
  }, [currentPath, user, role, loading]);

  // When assessment completes
  const handleAssessmentCompleted = (res: AssessmentResult) => {
    setActiveResult(res);
    navigate(`/patient/results/${res.id || 'latest'}`);
  };

  // When booking with doctor from directory
  const handleBookFromDirectory = (docName: string, docId: string) => {
    setPreselectedDoctor({ id: docId, name: docName });
    navigate('/patient/appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fef9f3] text-[#1a1a1a]">
        <div className="w-14 h-14 rounded-2xl bg-[#1f5233] flex items-center justify-center text-[#d4a574] font-serif text-2xl font-bold shadow-lg mb-4 animate-pulse">
          ॐ
        </div>
        <p className="font-serif text-lg font-bold text-[#1a1a1a]">OJAS • ओजस्</p>
        <p className="text-xs uppercase tracking-widest text-[#1f5233] font-semibold mt-1">
          Ministry of AYUSH • Grid Node Initializing
        </p>
      </div>
    );
  }

  // Parse path & params
  // Examples:
  // /patient/results/:id
  // /practitioner/patients/:id
  const isResultsRoute = currentPath.startsWith('/patient/results');
  const isPractitionerPatientDetail = currentPath.startsWith('/practitioner/patients/') && currentPath !== '/practitioner/patients';
  const patientDetailId = isPractitionerPatientDetail ? currentPath.replace('/practitioner/patients/', '') : null;

  // Render view
  const renderRoute = () => {
    switch (true) {
      // Language Selector
      case currentPath === '/language':
        return (
          <LanguageSelector
            onLanguageSelected={() => {
              if (!user) {
                navigate('/login');
              } else if (role === 'patient') {
                navigate('/patient');
              } else {
                navigate('/practitioner');
              }
            }}
          />
        );

      // Login
      case currentPath === '/login':
        return (
          <LoginPage
            initialEmail={authInitialEmail}
            onNavigateSignup={(prefilledEmail) => {
              if (prefilledEmail) setAuthInitialEmail(prefilledEmail);
              navigate('/signup');
            }}
            onNavigateVerification={(email) => {
              setPendingVerificationEmail(email);
              try {
                localStorage.setItem('ojas_verification_email', email);
              } catch (e) {}
              navigate('/verify-email');
            }}
            onLoginSuccess={(chosenRole) => {
              navigate(chosenRole === 'patient' ? '/patient' : '/practitioner');
            }}
          />
        );

      // Signup
      case currentPath === '/signup':
        return (
          <SignupPage
            initialEmail={authInitialEmail}
            onNavigateLogin={(prefilledEmail) => {
              if (prefilledEmail) setAuthInitialEmail(prefilledEmail);
              navigate('/login');
            }}
            onNavigateVerification={(email) => {
              setPendingVerificationEmail(email);
              try {
                localStorage.setItem('ojas_verification_email', email);
              } catch (e) {}
              navigate('/verify-email');
            }}
            onSignupSuccess={(chosenRole) => {
              navigate(chosenRole === 'patient' ? '/patient' : '/practitioner');
            }}
          />
        );

      // Email Verification Screen
      case currentPath === '/verify-email':
        return (
          <EmailVerificationScreen
            email={pendingVerificationEmail || 'your email'}
            onNavigateLogin={() => {
              if (pendingVerificationEmail) {
                setAuthInitialEmail(pendingVerificationEmail);
              }
              navigate('/login');
            }}
            onNavigateSignup={() => navigate('/signup')}
          />
        );

      // Patient Dashboard
      case currentPath === '/patient':
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <PatientDashboard
              onStartAssessment={() => navigate('/patient/assessment')}
              onNavigateAppointments={() => navigate('/patient/appointments')}
              onNavigateProfile={() => navigate('/patient/profile')}
              onNavigateDirectory={() => navigate('/patient/directory')}
            />
          </ProtectedRoute>
        );

      // Patient Assessment Form (8 layers + Ashtavidha)
      case currentPath === '/patient/assessment':
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <AssessmentForm
              onComplete={handleAssessmentCompleted}
              onCancel={() => navigate('/patient')}
              onBookAppointment={() => navigate('/patient/appointments')}
            />
          </ProtectedRoute>
        );

      // Patient Assessment Results
      case isResultsRoute: {
        const res = activeResult || latestResult;
        if (!res) {
          return (
            <div className="max-w-md mx-auto py-16 px-4 text-center">
              <p className="text-sm font-semibold text-[#1a1a1a]">No completed assessment found.</p>
              <button
                type="button"
                onClick={() => navigate('/patient/assessment')}
                className="mt-4 px-4 py-2 bg-[#1f5233] text-white text-xs font-semibold rounded-lg"
              >
                Take Prakriti Assessment
              </button>
            </div>
          );
        }
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <AssessmentResults
              result={res}
              onRetake={() => navigate('/patient/assessment')}
              onBookAppointment={() => navigate('/patient/appointments')}
            />
          </ProtectedRoute>
        );
      }

      // Patient Appointments
      case currentPath === '/patient/appointments':
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <PatientAppointments
              preselectedDoctorId={preselectedDoctor?.id}
              preselectedDoctorName={preselectedDoctor?.name}
              onAppointmentBooked={() => setPreselectedDoctor(null)}
            />
          </ProtectedRoute>
        );

      // Patient Profile
      case currentPath === '/patient/profile':
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <PatientProfile onStartAssessment={() => navigate('/patient/assessment')} />
          </ProtectedRoute>
        );

      // Doctor Directory
      case currentPath === '/patient/directory':
        return (
          <ProtectedRoute requiredRole="patient" currentPath={currentPath} onRedirect={navigate}>
            <DoctorDirectory onBookWithDoctor={handleBookFromDirectory} />
          </ProtectedRoute>
        );

      // Practitioner Dashboard & Patients List
      case currentPath === '/practitioner' || currentPath === '/practitioner/patients':
        return (
          <ProtectedRoute requiredRole="practitioner" currentPath={currentPath} onRedirect={navigate}>
            <PractitionerDashboard
              onNavigateAppointments={() => navigate('/practitioner/appointments')}
              onNavigateVerification={() => navigate('/practitioner/verification')}
              onNavigateProfile={() => navigate('/practitioner/profile')}
              onSelectPatientId={(pId) => navigate(`/practitioner/patients/${pId}`)}
            />
          </ProtectedRoute>
        );

      // Individual Patient Detail (for doctor)
      case Boolean(isPractitionerPatientDetail && patientDetailId):
        return (
          <ProtectedRoute requiredRole="practitioner" currentPath={currentPath} onRedirect={navigate}>
            <PatientDetail
              patientId={patientDetailId!}
              onBack={() => navigate('/practitioner')}
              onViewAssessmentReport={(res) => {
                setActiveResult(res);
                navigate(`/patient/results/${res.id}`);
              }}
            />
          </ProtectedRoute>
        );

      // Practitioner Verification
      case currentPath === '/practitioner/verification':
        return (
          <ProtectedRoute requiredRole="practitioner" currentPath={currentPath} onRedirect={navigate}>
            <PractitionerVerification
              onVerificationComplete={() => navigate('/practitioner')}
            />
          </ProtectedRoute>
        );

      // Practitioner Appointments
      case currentPath === '/practitioner/appointments':
        return (
          <ProtectedRoute requiredRole="practitioner" currentPath={currentPath} onRedirect={navigate}>
            <PractitionerAppointments
              onSelectPatient={(pId) => navigate(`/practitioner/patients/${pId}`)}
            />
          </ProtectedRoute>
        );

      // Practitioner Profile
      case currentPath === '/practitioner/profile':
        return (
          <ProtectedRoute requiredRole="practitioner" currentPath={currentPath} onRedirect={navigate}>
            <PractitionerProfile
              onNavigateVerification={() => navigate('/practitioner/verification')}
            />
          </ProtectedRoute>
        );

      // 404
      default:
        return <NotFoundPage onGoHome={() => navigate(role === 'practitioner' ? '/practitioner' : '/patient')} />;
    }
  };

  const showNavbar = currentPath !== '/language' && currentPath !== '/login' && currentPath !== '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-[#fef9f3] text-[#1a1a1a] font-sans">
      {/* Top Navbar */}
      {showNavbar && (
        <Navbar currentPath={currentPath} onNavigate={navigate} />
      )}

      {/* Main Routed Content with Animated Transition */}
      <main className="flex-1">
        <PageTransition routeKey={currentPath}>
          {renderRoute()}
        </PageTransition>
      </main>

      {/* Government of India / AYUSH Footer */}
      <footer className="bg-white border-t border-[#a8b5a8]/30 py-8 text-xs text-[#6b7280] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1f5233] text-[#d4a574] flex items-center justify-center font-serif text-xs font-bold">
              ॐ
            </div>
            <div>
              <span className="font-serif font-bold text-[#1a1a1a]">OJAS (ओजस्)</span>
              <span className="text-[11px] text-[#6b7280] block sm:inline sm:ml-2">
                • Ministry of AYUSH, Government of India • Smart India Hackathon 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>CCIM &amp; NCISM Standard Compliant</span>
            <span>•</span>
            <span>Tridosha Clinical Informatics</span>
            <span>•</span>
            <span>Privacy &amp; EMR Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterApp />
    </AuthProvider>
  );
}
