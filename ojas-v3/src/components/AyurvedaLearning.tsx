import React, { useState } from 'react';
import { 
  BookOpen, Play, CheckCircle, Clock, Sparkles, Wind, Flame, 
  Droplets, Sun, Moon, Utensils, Award, ChevronRight, X
} from 'lucide-react';
import { AYURVEDA_LEARNING_CONTENT } from '../data/seedData';

export const AyurvedaLearning: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState(AYURVEDA_LEARNING_CONTENT[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B5D3A]/10 text-[#3B5D3A] text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ayurvedic Wisdom & Video Library</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2C23]">
          Learn the Science of Life (Ayur-Veda)
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-2">
          Discover traditional 5,000-year-old Vedic principles made simple, practical, and intuitive for modern daily living.
        </p>
      </div>

      {/* Main Video & Content Spotlight */}
      <div className="bg-white rounded-3xl border border-[#3E2C23]/15 overflow-hidden shadow-sm mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Video Mockup Column */}
          <div className="lg:col-span-7 bg-[#1A1412] relative flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
            {isVideoPlaying ? (
              <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center text-white relative">
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 rounded-full bg-[#C1502E] flex items-center justify-center text-white mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold mb-1">
                  {activeArticle.title}
                </h4>
                <p className="text-xs text-white/70 max-w-md">
                  Playing lesson stream • High Definition 1080p
                </p>
                <div className="w-full max-w-sm bg-white/20 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="bg-[#D4A017] h-full w-2/5 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src={activeArticle.thumbnail}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 min-h-[320px]"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    id="btn-play-ayurveda-video"
                    onClick={() => setIsVideoPlaying(true)}
                    className="w-16 h-16 rounded-full bg-[#C1502E] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group/btn"
                  >
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-medium">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs">
                    {activeArticle.videoLength} Video Lesson
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs">
                    {activeArticle.category}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Article Info Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C1502E] uppercase tracking-wider mb-2">
                <span>{activeArticle.category}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#3E2C23] mb-3">
                {activeArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#3E2C23]/80 leading-relaxed mb-6">
                {activeArticle.summary}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B5D3A] mb-3">
                Core Wisdom Takeaways
              </h4>
              <ul className="space-y-2.5">
                {activeArticle.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#3E2C23]/85 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-[#3B5D3A] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-[#3E2C23]/10 mt-6">
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="w-full py-3 rounded-xl bg-[#3E2C23] hover:bg-[#2A1E18] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Watch Video Class ({activeArticle.videoLength})</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* More Lessons List */}
      <h3 className="font-serif text-2xl font-bold text-[#3E2C23] mb-6">
        Explore Vedic Modules
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {AYURVEDA_LEARNING_CONTENT.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveArticle(item);
              setIsVideoPlaying(false);
            }}
            className={`rounded-3xl border p-5 cursor-pointer transition-all ${
              activeArticle.id === item.id
                ? 'bg-white border-[#C1502E] ring-2 ring-[#C1502E]/20 shadow-md'
                : 'bg-white/80 border-[#3E2C23]/10 hover:border-[#3E2C23]/30 hover:bg-white'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden mb-4 h-40">
              <img
                src={item.thumbnail}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                {item.videoLength}
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C1502E]">
              {item.category}
            </span>
            <h4 className="font-serif font-bold text-base text-[#3E2C23] mt-1 mb-2 line-clamp-2">
              {item.title}
            </h4>
            <p className="text-xs text-[#3E2C23]/70 line-clamp-2">
              {item.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Dinacharya Clock Section */}
      <div className="bg-[#FAF6EF] rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-10 text-center">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2C23] mb-2">
          The 24-Hour Ayurvedic Biological Clock
        </h3>
        <p className="text-xs sm:text-sm text-[#3E2C23]/70 max-w-xl mx-auto mb-8">
          Every 4-hour circadian window is governed by a dosha cycle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          
          <div className="bg-white p-5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-[#C1502E] font-bold text-sm mb-2">
              <Wind className="w-4 h-4" />
              <span>Vata Hours (2-6)</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 mb-2">
              <strong>2:00 AM – 6:00 AM:</strong> Subtle, spiritual ether. Ideal for meditation before sunrise.
            </p>
            <p className="text-xs text-[#3E2C23]/80">
              <strong>2:00 PM – 6:00 PM:</strong> Agile mental focus, creativity, communication.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-2 text-[#D4A017] font-bold text-sm mb-2">
              <Flame className="w-4 h-4" />
              <span>Pitta Hours (10-2)</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 mb-2">
              <strong>10:00 AM – 2:00 PM:</strong> Solar fire peak. Eat your largest, richest meal.
            </p>
            <p className="text-xs text-[#3E2C23]/80">
              <strong>10:00 PM – 2:00 AM:</strong> Internal cellular cleaning and liver regeneration.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2 text-[#3B5D3A] font-bold text-sm mb-2">
              <Droplets className="w-4 h-4" />
              <span>Kapha Hours (6-10)</span>
            </div>
            <p className="text-xs text-[#3E2C23]/80 mb-2">
              <strong>6:00 AM – 10:00 AM:</strong> Earth & water. Wake early and engage in physical exercise.
            </p>
            <p className="text-xs text-[#3E2C23]/80">
              <strong>6:00 PM – 10:00 PM:</strong> Relaxation, light meal, and sleep by 10 PM.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
