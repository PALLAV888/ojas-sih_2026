export type DoshaType = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';

export type UserRole = 'patient' | 'practitioner';
export type VerificationStatus = 'pending' | 'verified';

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  patientId?: string; // e.g. "OJ-2026-A4B7" (patients only)
  createdAt: string;
  lastActiveAt?: string;
  lastAssessmentDate?: string;
  
  // Practitioner specific fields:
  qualification?: string; // "BAMS", "MD Ayurveda", "PhD Ayurveda", "Diploma in Ayurveda", "Other"
  ncismNumber?: string;
  clinicName?: string;
  clinicLocation?: string;
  verificationStatus?: VerificationStatus;
  bio?: string;
}

export type BodyFrame = 'thin' | 'medium' | 'heavy';
export type SkinType = 'dry' | 'warm' | 'oily';
export type HairType = 'thin' | 'fine' | 'thick';
export type DigestionType = 'variable' | 'strong' | 'slow';
export type AppetiteType = 'irregular' | 'strong' | 'steady';
export type SleepType = 'light' | 'medium' | 'deep';
export type EnergyType = 'variable' | 'focused' | 'calm';
export type TemperamentType = 'anxious' | 'sharp' | 'calm';

export interface AssessmentAnswers {
  bodyFrame?: BodyFrame;
  skinType?: SkinType;
  hairType?: HairType;
  digestion?: DigestionType;
  appetite?: AppetiteType;
  sleepPattern?: SleepType;
  energy?: EnergyType;
  temperament?: TemperamentType;
}

export interface DailyRoutineSchedule {
  time: string;
  title: string;
  items: string[];
}

export interface SeasonalGuide {
  season: string;
  doshaSeason: string;
  tips: string[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  patientId?: string;
  userName?: string;
  date: string;
  takenAt?: string;
  attemptNumber?: number;
  answers: AssessmentAnswers;
  
  // Raw 8 layer answers for practitioner diagnostics
  layer1_bodyFrame?: string;
  layer2_skinType?: string;
  layer3_hairType?: string;
  layer4_digestion?: string;
  layer5_appetite?: string;
  layer6_sleepPattern?: string;
  layer7_energy?: string;
  layer8_temperament?: string;

  // Calculated Scores & Percentages
  vataScore?: number;
  pittaScore?: number;
  kaphaScore?: number;
  primaryDosha: 'Vata' | 'Pitta' | 'Kapha';
  secondaryDosha?: 'Vata' | 'Pitta' | 'Kapha';
  doshaLabel: string;
  vataPercentage: number;
  pittaPercentage: number;
  kaphaPercentage: number;

  // Guidance
  summary: string;
  bodyAndHealth: string[];
  personality: string[];
  strengths: string[];
  challenges: string[];
  favoriteFoods: string[];
  avoidFoods: string[];
  dailyRoutine: {
    morning: DailyRoutineSchedule;
    midday: DailyRoutineSchedule;
    evening: DailyRoutineSchedule;
  };
  seasonalTips: SeasonalGuide[];
}

export interface LinkedPatient {
  patientId: string;
  patientUserId: string;
  name: string;
  email: string;
  joinedDate: string;
  lastAssessmentDate?: string;
  primaryDosha?: string;
  assessmentsCount: number;
  assessments: AssessmentResult[];
  notes?: string;
}

export interface Practitioner {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  verified: boolean;
  photoUrl: string;
  experienceYears: number;
  consultationFee: string;
  bio: string;
  availableDays: string[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientUserId?: string;
  patientName?: string;
  patientContact?: string;
  practitionerId: string;
  practitionerName?: string;
  clinicName?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  rejectedReason?: string;
}

export interface DailyCheckIn {
  id: string;
  checkInId?: string;
  patientId: string;
  assessmentId?: string;
  date: string; // ISO or YYYY-MM-DD
  sleep: number; // 1-5 (1=Excellent, 5=Very Poor)
  energy: number; // 1-5 (1=Excellent, 5=Very Poor)
  stress: number; // 1-5 (1=Very Low, 5=Very High)
  digestion: number; // 1-5 (1=Excellent, 5=Very Poor)
  mood: number; // 1-5 (1=Excellent, 5=Very Poor)
  treatmentFollowed: 'yes' | 'partially' | 'no';
  createdAt: string;
  wellnessScore?: number; // 0-100
}

export interface PatientProfileData {
  patientId: string;
  userId: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  contact?: string;
  chronicConditions?: string;
  allergies?: string;
  currentMedications?: string;
  treatmentStartDate?: string;
  treatmentDurationDays?: number;
  createdAt: string;
}

export interface PractitionerData {
  practitionerId: string;
  userId: string;
  name?: string;
  clinicName: string;
  ccimNumber?: string;
  ncismNumber?: string;
  nistaadsNumber?: string;
  stateLicenseNumber: string;
  clinicAddress: string;
  clinicPhone: string;
  yearsOfExperience: number;
  specializations: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  createdAt: string;
}

export type PatientCategory = 'Needs Attention' | 'Follow-up Due' | 'Improving' | 'New Patients' | 'All';

export interface AshtavidhaQuestion {
  id: string;
  category: 'Nadi' | 'Jihva' | 'Mala' | 'Mutra' | 'Shabda' | 'Sparsha' | 'Drik' | 'Akriti';
  categoryLabel: string;
  sanskritName: string;
  question: string;
  explanation: string;
  options: {
    value: string;
    dosha: 'Vata' | 'Pitta' | 'Kapha';
    label: string;
    description: string;
  }[];
}

export interface AshtavidhaAnswers {
  [questionId: string]: string;
}

export interface AssessmentLayer {
  layerNumber: number;
  id: keyof AssessmentAnswers;
  title: string;
  layerTag: string;
  question: string;
  explanation: string;
  options: {
    value: string;
    dosha: 'Vata' | 'Pitta' | 'Kapha';
    label: string;
    description: string;
    iconName: string;
  }[];
}
