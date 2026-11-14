import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Globe,
  LogOut,
  User,
  Stethoscope,
  Calendar,
  Sparkles,
  Award,
  Menu,
  X,
  FileText,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('ojas_language', lng);
    setLangDropdownOpen(false);
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'hi':
        return 'हिन्दी';
      case 'mr':
        return 'मराठी';
      default:
        return 'English';
    }
  };

  const isPatient = role === 'patient';

  const patientNavLinks = [
    { label: 'Dashboard', path: '/patient' },
    { label: 'Prakriti Assessment', path: '/patient/assessment' },
    { label: 'Appointments', path: '/patient/appointments' },
    { label: 'Doctor Directory', path: '/patient/directory' },
    { label: 'Health Profile', path: '/patient/profile' }
  ];

  const practitionerNavLinks = [
    { label: 'Dashboard', path: '/practitioner' },
    { label: 'Appointments', path: '/practitioner/appointments' },
    { label: 'Verification', path: '/practitioner/verification' },
    { label: 'Clinic Profile', path: '/practitioner/profile' }
  ];

  const navLinks = isPatient ? patientNavLinks : practitionerNavLinks;

  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#a8b5a8]/30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: OJAS Brand + Ministry of AYUSH & SIH Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(isPatient ? '/patient' : '/practitioner')}>
            <div className="w-10 h-10 rounded-xl bg-[#1f5233] text-[#d4a574] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              ॐ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1a1a1a]">
                  OJAS <span className="text-[#1f5233] text-sm font-sans font-semibold">ओजस्</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1f5233]/10 text-[#1f5233] border border-[#1f5233]/20">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-[#6b7280] hidden md:block">
                Ministry of AYUSH • National Ayurvedic Health Grid
              </p>
            </div>
          </div>

          {/* Center: Desktop Nav Links based on Role */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1f5233] text-white shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#1a1a1a]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: User Profile, Role Badge, Language Switcher & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="btn-nav-language"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#1f5233]" />
                <span className="hidden sm:inline">{getLanguageLabel(i18n.language)}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => changeLanguage('en')}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>English</span>
                    {i18n.language === 'en' && <span className="text-[#1f5233]">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage('hi')}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>हिन्दी</span>
                    {i18n.language === 'hi' && <span className="text-[#1f5233]">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage('mr')}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>मराठी</span>
                    {i18n.language === 'mr' && <span className="text-[#1f5233]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Info & Role */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-[#1a1a1a] truncate max-w-[130px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1f5233]">
                    {isPatient ? 'Patient Portal' : 'Doctor Console'}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#1f5233] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {user.name.charAt(0)}
                </div>

                <button
                  type="button"
                  id="btn-navbar-logout"
                  onClick={async () => {
                    await logout();
                    onNavigate('/login');
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-navbar-signin"
                  onClick={() => onNavigate('/login')}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="btn-navbar-signup"
                  onClick={() => onNavigate('/signup')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#163c25] transition-colors shadow-xs cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentPath === link.path
                    ? 'bg-[#1f5233] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              id="btn-mobile-logout"
              onClick={async () => {
                await logout();
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
