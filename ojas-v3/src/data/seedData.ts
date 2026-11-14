import { Practitioner } from '../types';

export const PRACTITIONERS: Practitioner[] = [
  {
    id: 'dr-anjali-rao',
    name: 'Dr. Anjali Rao',
    title: 'BAMS, MD (Ayurveda) — Dietitian & Wellness Coach',
    location: 'Delhi / Online Consultations',
    rating: 4.8,
    reviewCount: 120,
    specialties: ['Digestion & Agni', 'Stress & Anxiety', 'Sleep Optimization', 'Vata Imbalances'],
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    experienceYears: 14,
    consultationFee: '$45 / consultation',
    bio: 'Specializing in personalized Ayurvedic nutrition plans, pulse assessment, and holistic stress relief protocols.',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat']
  },
  {
    id: 'dr-ravi-kumar',
    name: 'Dr. Ravi Kumar',
    title: 'Ayurvedic Physician & Panchakarma Specialist',
    location: 'Bangalore / Telehealth Worldwide',
    rating: 4.9,
    reviewCount: 95,
    specialties: ['Chronic Inflammation', 'Metabolism & Weight', 'Pitta Cooling', 'Joint Mobility'],
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    experienceYears: 18,
    consultationFee: '$50 / consultation',
    bio: 'Former senior physician at Arya Vaidya Sala with over 18 years of clinical expertise in restorative therapies.',
    availableDays: ['Wed', 'Thu', 'Fri', 'Sun']
  },
  {
    id: 'dr-meera-nambiar',
    name: 'Dr. Meera Nambiar',
    title: 'Ayurvedic Herbalist & Women’s Health Expert',
    location: 'Kerala / Global Online Care',
    rating: 4.9,
    reviewCount: 142,
    specialties: ['Hormonal Balance', 'Skin & Hair Health', 'Kapha Detox', 'Postpartum Care'],
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1594824813598-e7b3e8c2534a?w=200&auto=format&fit=crop&q=80',
    experienceYears: 12,
    consultationFee: '$40 / consultation',
    bio: 'Dedicated to traditional Kerala Ayurvedic lineage combined with modern integrative lifestyle coaching.',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat']
  },
  {
    id: 'dr-vikram-vaidya',
    name: 'Dr. Vikram Vaidya',
    title: 'Senior Ayurvedic Master & Yoga Acharya',
    location: 'Mumbai / Video Appointments',
    rating: 4.7,
    reviewCount: 88,
    specialties: ['Dinacharya Coaching', 'Meditation & Pranayama', 'Digestive Fire Reset', 'Immunity Boost'],
    verified: true,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
    experienceYears: 22,
    consultationFee: '$55 / consultation',
    bio: 'Integrates classical Ashtanga Hridayam teachings with practical, busy-schedule lifestyle habits for modern living.',
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun']
  }
];

export const AYURVEDA_LEARNING_CONTENT = [
  {
    id: 'intro-doshas',
    title: 'The Three Doshas: Nature’s Biological Blueprint',
    category: 'Foundations',
    readTime: '4 min read',
    videoLength: '6:15 min',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80',
    summary: 'Everything in the universe is composed of the five elements: Space, Air, Fire, Water, and Earth. In the human body, these combine into three dynamic forces known as Doshas: Vata, Pitta, and Kapha.',
    keyPoints: [
      'Vata (Space + Air): Principle of movement, nerve impulses, breath, and creativity.',
      'Pitta (Fire + Water): Principle of transformation, digestion, metabolism, and intellect.',
      'Kapha (Water + Earth): Principle of cohesion, lubrication, physical structure, and stability.'
    ]
  },
  {
    id: 'dinacharya-clock',
    title: 'Dinacharya: The Sacred Ayurvedic Daily Rhythm',
    category: 'Daily Routine',
    readTime: '5 min read',
    videoLength: '8:40 min',
    thumbnail: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=80',
    summary: 'According to Ayurveda, every 4-hour window of the day is governed by a distinct dosha. Aligning your sleep, meals, and work with this natural clock creates effortless vitality.',
    keyPoints: [
      '6:00 AM – 10:00 AM (Kapha): Earthy, slow time. Wake early, exercise briskly, enjoy a light breakfast.',
      '10:00 AM – 2:00 PM (Pitta): Peak digestive fire. Eat your largest meal when the sun is highest.',
      '2:00 PM – 6:00 PM (Vata): Creative, agile hours. Great for mental focus and brainstorming.',
      '6:00 PM – 10:00 PM (Kapha): Winding down. Light dinner, gentle reading, sleep before 10:00 PM.',
      '10:00 PM – 2:00 AM (Pitta): Cellular repair and liver detoxification while sleeping.'
    ]
  },
  {
    id: 'agni-digestion',
    title: 'Agni: The Sacred Fire of Digestion and Immunity',
    category: 'Nutrition',
    readTime: '4 min read',
    videoLength: '5:30 min',
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    summary: 'In Ayurveda, health begins in the gut. Agni is the biological fire responsible for digesting food, emotions, and sensory experiences into vibrant Ojas (vitality).',
    keyPoints: [
      'Eat freshly cooked, warm foods rather than cold or leftover meals.',
      'Leave 1/3 of your stomach empty for digestive gases and fluids to circulate.',
      'Sip warm water with meals, avoiding icy cold drinks that extinguish Agni.',
      'Use culinary digestive spices like cumin, coriander, fennel, and ginger daily.'
    ]
  }
];
