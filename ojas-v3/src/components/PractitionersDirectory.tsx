import React, { useState } from 'react';
import { 
  CheckCircle, Star, MapPin, Calendar, Clock, MessageSquare, 
  Award, Filter, ShieldCheck, X, Send, Sparkles, Phone, Video
} from 'lucide-react';
import { PRACTITIONERS } from '../data/seedData';
import { Practitioner } from '../types';
import { useAuth } from '../context/AuthContext';

export const PractitionersDirectory: React.FC = () => {
  const { latestResult, user } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [bookingPractitioner, setBookingPractitioner] = useState<Practitioner | null>(null);
  const [messagingPractitioner, setMessagingPractitioner] = useState<Practitioner | null>(null);

  // Booking form state
  const [bookingDate, setBookingDate] = useState('2026-08-26');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('video');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Message chat state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'doc'; text: string; time: string }[]>([
    { sender: 'doc', text: 'Namaste! How may I assist you with your Ayurvedic health journey today?', time: '10:00 AM' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  const allSpecialties = ['all', 'Digestion & Agni', 'Stress & Anxiety', 'Pitta Cooling', 'Vata Imbalances', 'Skin & Hair Health'];

  const filteredPractitioners = PRACTITIONERS.filter(p => {
    if (selectedSpecialty === 'all') return true;
    return p.specialties.includes(selectedSpecialty);
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingPractitioner(null);
    }, 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setMessageInput('');

    // Doctor auto-reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'doc',
          text: `Thank you for sharing. Based on your ${latestResult?.doshaLabel || 'dosha'} profile, we can arrange a comprehensive pulse and nutrition assessment. Please feel free to book a consultation time!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B5D3A]/10 text-[#3B5D3A] text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Clinical Network</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2C23]">
          Find an Ayurvedic Practitioner
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2C23]/70 mt-2">
          {latestResult 
            ? `Based on your ${latestResult.doshaLabel} constitution, here are verified Ayurvedic physicians ready for consultation.`
            : 'Consult certified Ayurvedic doctors (BAMS, MD) for custom herbs, Panchakarma, and pulse diagnosis.'}
        </p>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {allSpecialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedSpecialty === spec
                ? 'bg-[#3E2C23] text-white shadow-xs'
                : 'bg-white text-[#3E2C23]/80 border border-[#3E2C23]/15 hover:border-[#3E2C23]/40'
            }`}
          >
            {spec === 'all' ? 'All Specialties' : spec}
          </button>
        ))}
      </div>

      {/* Practitioners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPractitioners.map((doc) => (
          <div
            key={doc.id}
            id={`practitioner-card-${doc.id}`}
            className="bg-white rounded-3xl border border-[#3E2C23]/15 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={doc.photoUrl}
                  alt={doc.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FAF6EF] shadow-xs shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E2C23] truncate">
                      {doc.name}
                    </h3>
                    {doc.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3B5D3A]/10 text-[#3B5D3A] text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-[#3B5D3A]" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#3E2C23]/70 mt-0.5 line-clamp-1">
                    {doc.title}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#3E2C23]/60 mt-1.5">
                    <span className="flex items-center gap-1 text-[#D4A017] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
                      <span>{doc.rating}</span>
                      <span className="text-[#3E2C23]/40 font-normal">({doc.reviewCount} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{doc.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#3E2C23]/80 leading-relaxed mb-4">
                {doc.bio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {doc.specialties.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF6EF] border border-[#3E2C23]/10 text-[11px] text-[#3E2C23]/80 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Fee & Actions */}
            <div className="pt-4 border-t border-[#3E2C23]/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#3E2C23]/50 uppercase tracking-wider block">Consultation</span>
                <span className="font-serif font-bold text-sm text-[#3E2C23]">{doc.consultationFee}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id={`btn-message-${doc.id}`}
                  onClick={() => setMessagingPractitioner(doc)}
                  className="px-3.5 py-2 rounded-xl border border-[#3E2C23]/20 text-[#3E2C23] hover:bg-[#FAF6EF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                <button
                  id={`btn-book-${doc.id}`}
                  onClick={() => setBookingPractitioner(doc)}
                  className="px-4 py-2 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingPractitioner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF6EF] border border-[#3E2C23]/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setBookingPractitioner(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#3E2C23]/60 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#3B5D3A] text-white flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#3E2C23] mb-2">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-[#3E2C23]/70 max-w-sm mx-auto">
                  Your appointment with {bookingPractitioner.name} for {bookingDate} at {bookingTime} ({consultationType}) has been scheduled. A confirmation email has been sent to {user?.email || 'your email'}.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3E2C23]/10">
                  <img
                    src={bookingPractitioner.photoUrl}
                    alt={bookingPractitioner.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3E2C23]">
                      Book with {bookingPractitioner.name}
                    </h3>
                    <p className="text-xs text-[#3E2C23]/60">{bookingPractitioner.consultationFee}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3E2C23] mb-1.5">
                      Consultation Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConsultationType('video')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                          consultationType === 'video' 
                            ? 'bg-[#3E2C23] text-white border-[#3E2C23]' 
                            : 'bg-white text-[#3E2C23] border-[#3E2C23]/15'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>Online Video Call</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType('in-person')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                          consultationType === 'in-person' 
                            ? 'bg-[#3E2C23] text-white border-[#3E2C23]' 
                            : 'bg-white text-[#3E2C23] border-[#3E2C23]/15'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>In-Clinic Visit</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3E2C23] mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3E2C23] mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23]"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3E2C23] mb-1">
                      Health Goals / Symptoms
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Digestion issues, insomnia, stress management..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E]"
                    />
                  </div>

                  <button
                    id="btn-confirm-appointment"
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#C1502E] hover:bg-[#a84224] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#C1502E]/25 transition-all"
                  >
                    Confirm & Reserve Appointment
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Chat Drawer Modal */}
      {messagingPractitioner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF6EF] border border-[#3E2C23]/15 rounded-3xl p-6 shadow-2xl flex flex-col h-[500px]">
            <button
              onClick={() => setMessagingPractitioner(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#3E2C23]/60 hover:text-[#3E2C23] hover:bg-[#3E2C23]/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Chat header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#3E2C23]/10">
              <img
                src={messagingPractitioner.photoUrl}
                alt={messagingPractitioner.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-serif text-base font-bold text-[#3E2C23]">
                  {messagingPractitioner.name}
                </h3>
                <span className="text-[10px] text-[#3B5D3A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B5D3A]" />
                  Online for Inquiries
                </span>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#C1502E] text-white rounded-br-xs'
                        : 'bg-white text-[#3E2C23] border border-[#3E2C23]/10 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#3E2C23]/40 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Send input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-[#3E2C23]/10">
              <input
                type="text"
                placeholder="Type your question..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#3E2C23]/15 text-xs text-[#3E2C23] placeholder-[#3E2C23]/40 focus:outline-none focus:border-[#C1502E]"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-xl bg-[#C1502E] text-white text-xs font-semibold hover:bg-[#a84224] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
