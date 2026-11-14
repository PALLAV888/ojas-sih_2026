import React from 'react';
import { ShieldCheck, Compass, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div id="not-found-page" className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1f5233]/10 text-[#1f5233] flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-[#d4a574] uppercase tracking-widest mb-1">
        Error 404 • Path Uncharted
      </span>
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] mb-2">
        Clinical Section Not Found
      </h1>
      <p className="text-xs text-[#6b7280] max-w-md mb-6 leading-relaxed">
        The requested record or view does not exist on this node of the National AYUSH Grid. Return to your primary dashboard to continue.
      </p>
      <button
        type="button"
        id="btn-return-home"
        onClick={onGoHome}
        className="px-5 py-2.5 rounded-xl bg-[#1f5233] text-white text-xs font-semibold hover:bg-[#1a3d5c] flex items-center gap-2 transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};

export default NotFoundPage;
