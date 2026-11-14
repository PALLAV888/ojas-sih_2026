import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Globe2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageSelected?: (lang: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelected,
  isModal = false,
  onClose
}) => {
  const { i18n } = useTranslation();

  const handleSelectLanguage = (lang: string) => {
    localStorage.setItem('ojas_language_selected', lang);
    i18n.changeLanguage(lang);
    if (onLanguageSelected) {
      onLanguageSelected(lang);
    }
  };

  const languages = [
    {
      code: 'en',
      nativeName: 'English',
      englishName: 'English',
      subtitle: 'Ayurvedic Clinical Case-Taking & Practice Management',
      scriptSample: 'Holistic healing rooted in Charaka & Sushruta Samhita',
      badge: 'National & Global'
    },
    {
      code: 'hi',
      nativeName: 'हिन्दी',
      englishName: 'Hindi',
      subtitle: 'आयुर्वेदिक रोगी निदान एवं चिकित्सालय प्रबंधन प्रणाली',
      scriptSample: 'चरक एवं सुश्रुत संहिता पर आधारित सम्पूर्ण स्वास्थ्य समाधान',
      badge: 'राष्ट्रीय आयुष पोर्टल'
    },
    {
      code: 'mr',
      nativeName: 'मराठी',
      englishName: 'Marathi',
      subtitle: 'आयुर्वेदिक रुग्ण निदान आणि प्रॅक्टिस मॅनेजमेंट',
      scriptSample: 'अष्टांग हृदय व पारंपरिक आयुर्वेद तत्त्वांवर आधारित सेवा',
      badge: 'राज्य आयुष समन्वय'
    }
  ];

  return (
    <div
      id="language-selector-screen"
      className={`${
        isModal
          ? 'relative w-full max-w-2xl bg-[#fef9f3] p-6 rounded-2xl shadow-xl'
          : 'min-h-screen bg-[#fef9f3] flex flex-col justify-center items-center px-4 py-12'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-3xl text-center"
      >
        {/* Ministry of AYUSH & SIH Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1f5233]/10 border border-[#1f5233]/20 text-[#1f5233] text-xs font-semibold tracking-wide mb-6">
          <ShieldCheck className="w-4 h-4 text-[#1f5233]" />
          <span>Ministry of AYUSH • Smart India Hackathon 2026</span>
        </div>

        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#1f5233] flex items-center justify-center text-white shadow-md">
            <span className="font-serif text-2xl font-bold text-[#d4a574]">ॐ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1a1a] tracking-tight">
            OJAS <span className="text-[#1f5233] font-normal text-2xl">ओजस</span>
          </h1>
        </div>

        {/* Simultaneous multilingual titles */}
        <div className="mb-8 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
            Choose Your Language
          </h2>
          <p className="text-lg text-[#1f5233] font-medium font-serif">
            अपनी भाषा चुनें • तुमची भाषा निवडा
          </p>
          <p className="text-xs sm:text-sm text-[#6b7280] max-w-md mx-auto pt-1">
            Please select your preferred language for clinical forms, diagnosis, and consultations. You can change this anytime from the navigation bar.
          </p>
        </div>

        {/* 3 Large Tappable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          {languages.map((item) => {
            const isCurrent = i18n.language === item.code;
            return (
              <motion.button
                key={item.code}
                id={`btn-lang-${item.code}`}
                onClick={() => handleSelectLanguage(item.code)}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-md ${
                  isCurrent
                    ? 'border-[#1f5233] ring-2 ring-[#1f5233]/20 bg-[#1f5233]/5'
                    : 'border-[#a8b5a8]/40 hover:border-[#1f5233]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#fef9f3] text-[#1f5233] border border-[#a8b5a8]/30">
                      {item.badge}
                    </span>
                    {isCurrent && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1f5233]" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-[#1a1a1a] mb-1 font-serif">
                    {item.nativeName}
                  </div>
                  <div className="text-xs text-[#6b7280] font-medium mb-3">
                    {item.englishName}
                  </div>
                  <p className="text-xs text-[#1a3d5c] line-clamp-2 leading-relaxed mb-3">
                    {item.scriptSample}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-medium text-[#1f5233] group-hover:text-[#1f5233]">
                  <span>Select & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-xs text-[#6b7280] hover:text-[#1a1a1a] underline"
          >
            Close without changing
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
