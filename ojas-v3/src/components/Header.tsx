import React, { useState } from 'react';
import { Leaf, Sparkles, BookOpen, Compass, History, LogOut, ChevronDown, User as UserIcon, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: 'home' | 'quiz' | 'results' | 'history' | 'learn' | 'practitioners';
  setCurrentTab: (tab: 'home' | 'quiz' | 'results' | 'history' | 'learn' | 'practitioners') => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, isAuthenticated, logout, latestResult, loginWithGoogle } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isPractitioner = user?.role === 'practitioner';

  const handleProtectedTab = (tab: 'quiz' | 'results' | 'history') => {
    if (!isAuthenticated) {
      onOpenAuth();
    } else {
      setCurrentTab(tab);
    }
  };

  const handleGoogleSignIn = async () => {
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

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    setCurrentTab('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#3E2C23]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div 
            id="brand-logo-button"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#C1502E] flex items-center justify-center text-[#FAF6EF] shadow-sm shadow-[#C1502E]/30 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3E2C23] group-hover:text-[#C1502E] transition-colors">
                Ojas
              </span>
              <span className="hidden sm:block text-xs uppercase tracking-widest text-[#3B5D3A] font-medium">
                Discover Your Balance
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-tab-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-[#3E2C23] text-[#FAF6EF] shadow-sm'
                  : 'text-[#3E2C23]/80 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5'
              }`}
            >
              {isPractitioner ? 'Practitioner Dashboard' : 'Dashboard'}
            </button>

            {!isPractitioner && (
              <button
                id="nav-tab-quiz"
                onClick={() => handleProtectedTab('quiz')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'quiz'
                    ? 'bg-[#C1502E] text-white shadow-sm shadow-[#C1502E]/30'
                    : 'text-[#C1502E] bg-[#C1502E]/10 hover:bg-[#C1502E]/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Take Assessment</span>
              </button>
            )}

            {!isPractitioner && isAuthenticated && latestResult && (
              <button
                id="nav-tab-results"
                onClick={() => setCurrentTab('results')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'results'
                    ? 'bg-[#3E2C23] text-[#FAF6EF]'
                    : 'text-[#3E2C23]/80 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5'
                }`}
              >
                My Dosha ({latestResult.doshaLabel})
              </button>
            )}

            {!isPractitioner && isAuthenticated && (
              <button
                id="nav-tab-history"
                onClick={() => setCurrentTab('history')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'history'
                    ? 'bg-[#3E2C23] text-[#FAF6EF]'
                    : 'text-[#3E2C23]/80 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
            )}

            <button
              id="nav-tab-learn"
              onClick={() => setCurrentTab('learn')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'learn'
                  ? 'bg-[#3E2C23] text-[#FAF6EF]'
                  : 'text-[#3E2C23]/80 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn Ayurveda</span>
            </button>

            <button
              id="nav-tab-practitioners"
              onClick={() => setCurrentTab('practitioners')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'practitioners'
                  ? 'bg-[#3B5D3A] text-white'
                  : 'text-[#3E2C23]/80 hover:text-[#3B5D3A] hover:bg-[#3B5D3A]/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Practitioners</span>
            </button>
          </nav>

          {/* User Profile / Auth Action */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white border border-[#3E2C23]/10 hover:border-[#C1502E]/40 shadow-xs transition-all cursor-pointer"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#C1502E]/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C1502E]/15 text-[#C1502E] flex items-center justify-center font-semibold text-xs">
                      {isPractitioner ? '👨‍⚕️' : (user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-semibold text-[#3E2C23] max-w-[120px] truncate block">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#3E2C23]/60 uppercase tracking-wider block">
                      {user.role === 'practitioner' ? 'Practitioner' : 'Patient'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#3E2C23]/50" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#3E2C23]/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-[#3E2C23]/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#3E2C23]/60 uppercase tracking-wider font-semibold">
                            Role: {user.role === 'practitioner' ? '👨‍⚕️ Practitioner' : '🧑 Patient'}
                          </span>
                          {user.patientId && (
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#FAF6EF] text-[#3E2C23]/80">
                              {user.patientId}
                            </span>
                          )}
                        </div>
                        <p className="font-serif font-bold text-[#3E2C23] text-base truncate">{user.name}</p>
                        <p className="text-xs text-[#3E2C23]/70 truncate">{user.email}</p>
                      </div>

                      <div className="pt-2">
                        <button
                          id="btn-header-logout"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-google-sign-in-btn"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-neutral-50 text-[#3E2C23] border border-[#3E2C23]/15 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-[#C1502E] border-t-transparent rounded-full animate-spin" />
                  ) : (
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
                  )}
                  <span>{googleLoading ? 'Signing in...' : 'Sign In with Google'}</span>
                </button>

                <button
                  id="header-sign-in-btn"
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#C1502E] text-white hover:bg-[#a84224] shadow-xs transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-[#3E2C23]/5 scrollbar-none">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'home' ? 'bg-[#3E2C23] text-white' : 'bg-white/80 text-[#3E2C23]'
            }`}
          >
            {isPractitioner ? 'Practitioner Dashboard' : 'Dashboard'}
          </button>
          {!isPractitioner && (
            <button
              onClick={() => handleProtectedTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                currentTab === 'quiz' ? 'bg-[#C1502E] text-white' : 'bg-[#C1502E]/15 text-[#C1502E]'
              }`}
            >
              Assessment (8 Layers)
            </button>
          )}
          {!isPractitioner && isAuthenticated && latestResult && (
            <button
              onClick={() => setCurrentTab('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                currentTab === 'results' ? 'bg-[#3E2C23] text-white' : 'bg-white/80 text-[#3E2C23]'
              }`}
            >
              My Result
            </button>
          )}
          {!isPractitioner && isAuthenticated && (
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                currentTab === 'history' ? 'bg-[#3E2C23] text-white' : 'bg-white/80 text-[#3E2C23]'
              }`}
            >
              History
            </button>
          )}
          <button
            onClick={() => setCurrentTab('learn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'learn' ? 'bg-[#3E2C23] text-white' : 'bg-white/80 text-[#3E2C23]'
            }`}
          >
            Learn Ayurveda
          </button>
          <button
            onClick={() => setCurrentTab('practitioners')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'practitioners' ? 'bg-[#3B5D3A] text-white' : 'bg-white/80 text-[#3B5D3A]'
            }`}
          >
            Practitioners
          </button>
        </div>
      </div>
    </header>
  );
};
