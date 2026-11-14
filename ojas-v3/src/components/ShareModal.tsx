import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, Wind, Flame, Droplets } from 'lucide-react';
import { AssessmentResult } from '../types';

interface ShareModalProps {
  result: AssessmentResult;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🌿 I discovered my Ayurvedic type on Ojas! I am ${result.doshaLabel} (Vata: ${result.vataPercentage}%, Pitta: ${result.pittaPercentage}%, Kapha: ${result.kaphaPercentage}%). Take the 8-layer assessment to find your balance: ${window.location.origin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF6EF] border border-[#3E2C23]/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#3E2C23]/60 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C1502E] text-white shadow-sm mb-3">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#3E2C23]">
            Share Your Ayurvedic Balance
          </h3>
          <p className="text-xs text-[#3E2C23]/70 mt-1">
            Share your constitution card with friends and family.
          </p>
        </div>

        {/* Card Preview */}
        <div className="bg-white rounded-2xl p-5 border border-[#3E2C23]/15 shadow-xs mb-6 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5D3A]">
            Ojas Ayurvedic Assessment
          </span>
          <h4 className="font-serif text-2xl font-bold text-[#3E2C23] mt-1 mb-2">
            {result.doshaLabel} Dominant
          </h4>
          <div className="flex justify-center gap-4 text-xs font-semibold my-3">
            <span className="text-[#C1502E]">Vata: {result.vataPercentage}%</span>
            <span className="text-[#D4A017]">Pitta: {result.pittaPercentage}%</span>
            <span className="text-[#3B5D3A]">Kapha: {result.kaphaPercentage}%</span>
          </div>
          <p className="text-xs text-[#3E2C23]/75 line-clamp-2 italic">
            "{result.summary}"
          </p>
        </div>

        {/* Copy Button */}
        <button
          id="btn-copy-share-text"
          onClick={handleCopy}
          className="w-full py-3 px-4 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C1502E]/25"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Text & Link'}</span>
        </button>

      </div>
    </div>
  );
};
