import {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from './config';
import { User, AssessmentResult, LinkedPatient, UserRole, VerificationStatus } from '../types';

// Generate a random 4-character alphanumeric string (e.g. A4B7)
export const generatePatientId = (): string => {
  const currentYear = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OJ-${currentYear}-${randomPart}`;
};

// Seed demo patients that can be immediately linked or viewed in Practitioner Dashboard
export const INITIAL_DEMO_PATIENTS: LinkedPatient[] = [
  {
    patientId: 'OJ-2026-A4B7',
    patientUserId: 'demo-patient-arjun',
    name: 'Arjun Singh',
    email: 'arjun@example.com',
    joinedDate: 'August 10, 2026',
    lastAssessmentDate: 'August 23, 2026',
    primaryDosha: 'Pitta-Kapha',
    assessmentsCount: 3,
    notes: 'Patient reports high stress at work. Emphasized sleep schedule. Brahmi supplement recommended since last visit.',
    assessments: [
      {
        id: 'res-arjun-1',
        userId: 'demo-patient-arjun',
        patientId: 'OJ-2026-A4B7',
        userName: 'Arjun Singh',
        date: 'March 5, 2026',
        takenAt: '2026-03-05T10:00:00Z',
        attemptNumber: 1,
        primaryDosha: 'Pitta',
        doshaLabel: 'Pitta',
        vataPercentage: 10,
        pittaPercentage: 60,
        kaphaPercentage: 30,
        answers: {
          bodyFrame: 'medium',
          skinType: 'warm',
          hairType: 'fine',
          digestion: 'strong',
          appetite: 'strong',
          sleepPattern: 'medium',
          energy: 'focused',
          temperament: 'sharp'
        },
        layer1_bodyFrame: 'Medium and athletic',
        layer2_skinType: 'Warm and sensitive',
        layer3_hairType: 'Fine, reddish tones',
        layer4_digestion: 'Strong and quick',
        layer5_appetite: 'Strong and sharp',
        layer6_sleepPattern: 'Moderate, wakes easily',
        layer7_energy: 'High stamina, driven',
        layer8_temperament: 'Sharp, ambitious',
        summary: 'Pitta dominant constitutional profile with strong metabolic fire.',
        bodyAndHealth: ['Medium athletic frame', 'Strong digestion'],
        personality: ['Articulate and focused'],
        strengths: ['Decisive leadership'],
        challenges: ['Irritability under stress'],
        favoriteFoods: ['Cooling cucumber', 'Ghee', 'Basmati rice', 'Coconut water'],
        avoidFoods: ['Hot spicy peppers', 'Excess coffee', 'Deep fried food'],
        dailyRoutine: {
          morning: { time: '6:00 AM', title: 'Cooling Awakening', items: ['Cool water', 'Coconut oil massage'] },
          midday: { time: '12:30 PM', title: 'Main Lunch', items: ['Nourishing cooling meal'] },
          evening: { time: '9:30 PM', title: 'Rest & Unwind', items: ['Moonlight walk', 'Sleep by 10 PM'] }
        },
        seasonalTips: [{ season: 'Summer', doshaSeason: 'Cool down', tips: ['Avoid peak noon sun'] }]
      },
      {
        id: 'res-arjun-2',
        userId: 'demo-patient-arjun',
        patientId: 'OJ-2026-A4B7',
        userName: 'Arjun Singh',
        date: 'June 10, 2026',
        takenAt: '2026-06-10T14:30:00Z',
        attemptNumber: 2,
        primaryDosha: 'Pitta',
        doshaLabel: 'Pitta',
        vataPercentage: 10,
        pittaPercentage: 55,
        kaphaPercentage: 35,
        answers: {
          bodyFrame: 'medium',
          skinType: 'warm',
          hairType: 'fine',
          digestion: 'strong',
          appetite: 'strong',
          sleepPattern: 'medium',
          energy: 'focused',
          temperament: 'sharp'
        },
        layer1_bodyFrame: 'Medium and athletic',
        layer2_skinType: 'Warm and sensitive',
        layer3_hairType: 'Fine, reddish tones',
        layer4_digestion: 'Strong and quick',
        layer5_appetite: 'Strong and sharp',
        layer6_sleepPattern: 'Moderate, wakes easily',
        layer7_energy: 'High stamina, driven',
        layer8_temperament: 'Sharp, ambitious',
        summary: 'Pitta dominant constitutional profile with increased Kapha stability.',
        bodyAndHealth: ['Medium athletic frame', 'Strong digestion'],
        personality: ['Articulate and focused'],
        strengths: ['Decisive leadership'],
        challenges: ['Irritability under stress'],
        favoriteFoods: ['Cooling cucumber', 'Ghee', 'Basmati rice', 'Coconut water'],
        avoidFoods: ['Hot spicy peppers', 'Excess coffee', 'Deep fried food'],
        dailyRoutine: {
          morning: { time: '6:00 AM', title: 'Cooling Awakening', items: ['Cool water', 'Coconut oil massage'] },
          midday: { time: '12:30 PM', title: 'Main Lunch', items: ['Nourishing cooling meal'] },
          evening: { time: '9:30 PM', title: 'Rest & Unwind', items: ['Moonlight walk', 'Sleep by 10 PM'] }
        },
        seasonalTips: [{ season: 'Summer', doshaSeason: 'Cool down', tips: ['Avoid peak noon sun'] }]
      },
      {
        id: 'res-arjun-3',
        userId: 'demo-patient-arjun',
        patientId: 'OJ-2026-A4B7',
        userName: 'Arjun Singh',
        date: 'August 23, 2026',
        takenAt: '2026-08-23T09:15:00Z',
        attemptNumber: 3,
        primaryDosha: 'Pitta',
        secondaryDosha: 'Kapha',
        doshaLabel: 'Pitta-Kapha',
        vataPercentage: 10,
        pittaPercentage: 50,
        kaphaPercentage: 40,
        answers: {
          bodyFrame: 'medium',
          skinType: 'warm',
          hairType: 'fine',
          digestion: 'strong',
          appetite: 'strong',
          sleepPattern: 'medium',
          energy: 'focused',
          temperament: 'sharp'
        },
        layer1_bodyFrame: 'Medium and athletic',
        layer2_skinType: 'Warm and sensitive',
        layer3_hairType: 'Fine, some early greying',
        layer4_digestion: 'Strong and quick',
        layer5_appetite: 'Strong and consistent',
        layer6_sleepPattern: 'Moderate, wakes early',
        layer7_energy: 'Focused and intense',
        layer8_temperament: 'Sharp and passionate',
        summary: 'Pitta-Kapha dual constitutional balance. Dynamic metabolic vitality balanced by steady endurance.',
        bodyAndHealth: ['Athletic muscle tone', 'Strong, rapid Agni digestive fire', 'High endurance'],
        personality: ['Articulate leader', 'Determined and purposeful', 'Organized'],
        strengths: ['Inspiring focus', 'Resilient stamina'],
        challenges: ['Occasional workaholic stress', 'Heat sensitivity'],
        favoriteFoods: [
          'Cooling foods (coconut, cucumber, leafy greens)',
          'Ghee & Basmati rice',
          'Astringent and sweet fruits (pomegranate, sweet apples)',
          'Fennel and coriander herbal infusion'
        ],
        avoidFoods: [
          'Spicy chili peppers and pungent sauces',
          'Excess black coffee and energy drinks',
          'Heavy fried, overly salty food'
        ],
        dailyRoutine: {
          morning: { time: '6:00 AM – 7:00 AM', title: 'Cooling Routine', items: ['Cool oil massage (Coconut/Brahmi)', 'Sheetali pranayama breathing'] },
          midday: { time: '12:00 PM – 1:00 PM', title: 'Midday Agni', items: ['Substantial balanced lunch', '10-minute quiet walking'] },
          evening: { time: '7:00 PM – 10:00 PM', title: 'Release & Recharge', items: ['Light dinner by 7:30 PM', 'Disconnect from screens 1 hr prior to sleep'] }
        },
        seasonalTips: [
          { season: 'Summer / Late Summer', doshaSeason: 'Pitta-pacifying', tips: ['Reduce midday sun exposure', 'Hydrate with fresh tender coconut water'] }
        ]
      }
    ]
  },
  {
    patientId: 'OJ-2026-M8K2',
    patientUserId: 'demo-patient-meera',
    name: 'Meera Joshi',
    email: 'meera@example.com',
    joinedDate: 'July 5, 2026',
    lastAssessmentDate: 'August 18, 2026',
    primaryDosha: 'Vata',
    assessmentsCount: 2,
    notes: 'Followed sesame oil Abhyanga regularly. Noticed less digestive bloating and improved sleep consistency.',
    assessments: [
      {
        id: 'res-meera-1',
        userId: 'demo-patient-meera',
        patientId: 'OJ-2026-M8K2',
        userName: 'Meera Joshi',
        date: 'July 5, 2026',
        takenAt: '2026-07-05T11:00:00Z',
        attemptNumber: 1,
        primaryDosha: 'Vata',
        doshaLabel: 'Vata',
        vataPercentage: 55,
        pittaPercentage: 25,
        kaphaPercentage: 20,
        answers: {
          bodyFrame: 'thin',
          skinType: 'dry',
          hairType: 'thin',
          digestion: 'variable',
          appetite: 'irregular',
          sleepPattern: 'light',
          energy: 'variable',
          temperament: 'anxious'
        },
        layer1_bodyFrame: 'Thin and light',
        layer2_skinType: 'Dry and thin',
        layer3_hairType: 'Thin, dry, easy to tangle',
        layer4_digestion: 'Variable, prone to bloating',
        layer5_appetite: 'Irregular hunger',
        layer6_sleepPattern: 'Light sleeper, easily awakened',
        layer7_energy: 'Burst of energy, then tired',
        layer8_temperament: 'Creative, imaginative, anxious when rushed',
        summary: 'Vata dominant constitutional profile. Fast moving, imaginative, benefits from warm grounding routines.',
        bodyAndHealth: ['Light bone structure', 'Sensitive digestion'],
        personality: ['Expressive and intuitive'],
        strengths: ['Artistic intuition', 'High creativity'],
        challenges: ['Prone to dry skin and worry'],
        favoriteFoods: ['Warm soups and stews', 'Cooked oats', 'Pure ghee', 'Warming ginger tea'],
        avoidFoods: ['Raw salads', 'Iced drinks', 'Dry crackers', 'Caffeine'],
        dailyRoutine: {
          morning: { time: '6:30 AM', title: 'Grounding Morning', items: ['Warm water with ginger', 'Sesame oil Abhyanga'] },
          midday: { time: '12:30 PM', title: 'Warm Lunch', items: ['Hot Kitchari with ghee'] },
          evening: { time: '8:00 PM', title: 'Wind Down', items: ['Warm spiced milk with nutmeg', 'Sleep by 10 PM'] }
        },
        seasonalTips: [{ season: 'Autumn', doshaSeason: 'Vata season', tips: ['Wear warm scarves', 'Stay out of cold wind'] }]
      },
      {
        id: 'res-meera-2',
        userId: 'demo-patient-meera',
        patientId: 'OJ-2026-M8K2',
        userName: 'Meera Joshi',
        date: 'August 18, 2026',
        takenAt: '2026-08-18T16:20:00Z',
        attemptNumber: 2,
        primaryDosha: 'Vata',
        doshaLabel: 'Vata',
        vataPercentage: 48,
        pittaPercentage: 30,
        kaphaPercentage: 22,
        answers: {
          bodyFrame: 'thin',
          skinType: 'dry',
          hairType: 'thin',
          digestion: 'variable',
          appetite: 'irregular',
          sleepPattern: 'light',
          energy: 'variable',
          temperament: 'anxious'
        },
        layer1_bodyFrame: 'Thin and light',
        layer2_skinType: 'Dry and thin',
        layer3_hairType: 'Thin, dry, easy to tangle',
        layer4_digestion: 'Variable, slightly improved',
        layer5_appetite: 'More regular with schedule',
        layer6_sleepPattern: 'Sleeping deeper',
        layer7_energy: 'Steadier through afternoon',
        layer8_temperament: 'Calmer with daily grounding',
        summary: 'Vata dominant constitutional profile with improved digestive stability.',
        bodyAndHealth: ['Light bone structure', 'Sensitive digestion'],
        personality: ['Expressive and intuitive'],
        strengths: ['Artistic intuition', 'High creativity'],
        challenges: ['Prone to dry skin and worry'],
        favoriteFoods: ['Warm soups and stews', 'Cooked oats', 'Pure ghee', 'Warming ginger tea'],
        avoidFoods: ['Raw salads', 'Iced drinks', 'Dry crackers', 'Caffeine'],
        dailyRoutine: {
          morning: { time: '6:30 AM', title: 'Grounding Morning', items: ['Warm water with ginger', 'Sesame oil Abhyanga'] },
          midday: { time: '12:30 PM', title: 'Warm Lunch', items: ['Hot Kitchari with ghee'] },
          evening: { time: '8:00 PM', title: 'Wind Down', items: ['Warm spiced milk with nutmeg', 'Sleep by 10 PM'] }
        },
        seasonalTips: [{ season: 'Autumn', doshaSeason: 'Vata season', tips: ['Wear warm scarves', 'Stay out of cold wind'] }]
      }
    ]
  }
];

/**
 * Reads user profile from Firestore (or localStorage cache)
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data() as User;
      // Cache locally
      localStorage.setItem(`ojas_user_${userId}`, JSON.stringify(data));
      return { id: userId, ...data };
    }
  } catch (error) {
    console.warn('Firestore read user profile notice:', error);
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`ojas_user_${userId}`);
    if (cached) {
      return JSON.parse(cached) as User;
    }
  } catch (e) {
    // ignore
  }

  return null;
};

/**
 * Saves/Updates user profile in Firestore and local cache
 */
export const saveUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  const existing = await getUserProfile(userId);
  const updatedUser: User = {
    id: userId,
    name: data.name || existing?.name || 'Seeker',
    email: data.email || existing?.email || '',
    avatar: data.avatar || existing?.avatar,
    role: data.role || existing?.role || 'patient',
    patientId: data.role === 'patient' ? (existing?.patientId || data.patientId || generatePatientId()) : undefined,
    createdAt: existing?.createdAt || data.createdAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    lastAssessmentDate: data.lastAssessmentDate || existing?.lastAssessmentDate,
    qualification: data.qualification || existing?.qualification,
    ncismNumber: data.ncismNumber || existing?.ncismNumber,
    clinicName: data.clinicName || existing?.clinicName,
    clinicLocation: data.clinicLocation || existing?.clinicLocation,
    verificationStatus: data.verificationStatus || existing?.verificationStatus || (data.role === 'practitioner' ? 'pending' : undefined),
    bio: data.bio || existing?.bio
  };

  // Cache locally
  localStorage.setItem(`ojas_user_${userId}`, JSON.stringify(updatedUser));

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, updatedUser, { merge: true });
  } catch (error) {
    console.warn('Firestore save user profile notice:', error);
  }

  return updatedUser;
};

/**
 * Saves an assessment result to Firestore and local history
 */
export const saveAssessmentResult = async (result: AssessmentResult): Promise<void> => {
  // Update local cache
  try {
    const key = `ojas_results_${result.userId}`;
    const existingRaw = localStorage.getItem(key);
    let existingList: AssessmentResult[] = existingRaw ? JSON.parse(existingRaw) : [];
    existingList = [result, ...existingList.filter(r => r.id !== result.id)];
    localStorage.setItem(key, JSON.stringify(existingList));
  } catch (e) {
    console.error('Error saving to local storage:', e);
  }

  // Update user's lastAssessmentDate
  try {
    await saveUserProfile(result.userId, {
      lastAssessmentDate: result.date
    });
  } catch (e) {
    // ignore
  }

  // Save to Firestore collection "assessmentResults"
  try {
    const resultDocRef = doc(db, 'assessmentResults', result.id);
    await setDoc(resultDocRef, {
      ...result,
      takenAt: result.takenAt || new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore save assessment result notice:', error);
  }
};

/**
 * Links a patient to a practitioner using the patient's Patient ID (e.g. OJ-2026-A4B7)
 */
export const linkPatientToPractitioner = async (
  pracId: string,
  patientIdInput: string
): Promise<{ success: boolean; error?: string; patient?: LinkedPatient }> => {
  const cleanId = patientIdInput.trim().toUpperCase();

  // 1. Check if matches any demo patients
  const demoMatch = INITIAL_DEMO_PATIENTS.find(p => p.patientId.toUpperCase() === cleanId);

  // 2. Query Firestore / local users
  let matchedUser: User | null = null;

  try {
    const q = query(
      collection(db, 'users'),
      where('patientId', '==', cleanId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data() as User;
      matchedUser = { id: snap.docs[0].id, ...docData };
    }
  } catch (e) {
    console.warn('Could not query users by patientId:', e);
  }

  // Check local users if not found in Firestore
  if (!matchedUser) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ojas_user_')) {
        try {
          const u = JSON.parse(localStorage.getItem(key) || '') as User;
          if (u.patientId && u.patientId.toUpperCase() === cleanId) {
            matchedUser = u;
            break;
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }

  if (!matchedUser && !demoMatch) {
    return {
      success: false,
      error: `No registered patient found with ID "${cleanId}". Please check the ID and try again.`
    };
  }

  const patientUserId = matchedUser?.id || demoMatch?.patientUserId || 'unknown';
  const patientName = matchedUser?.name || demoMatch?.name || 'Patient';
  const patientEmail = matchedUser?.email || demoMatch?.email || '';
  const joinedDate = matchedUser?.createdAt 
    ? new Date(matchedUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : demoMatch?.joinedDate || 'Recently';

  // Fetch assessments for this patient
  let assessments: AssessmentResult[] = [];
  try {
    const q = query(
      collection(db, 'assessmentResults'),
      where('patientId', '==', cleanId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      assessments = snap.docs.map(d => ({ id: d.id, ...d.data() })) as AssessmentResult[];
    }
  } catch (e) {
    // fallback
  }

  if (assessments.length === 0) {
    // Check local storage
    try {
      const saved = localStorage.getItem(`ojas_results_${patientUserId}`);
      if (saved) {
        assessments = JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
  }

  if (assessments.length === 0 && demoMatch) {
    assessments = demoMatch.assessments;
  }

  const latestAssessment = assessments[0];

  const linkedPatient: LinkedPatient = {
    patientId: cleanId,
    patientUserId,
    name: patientName,
    email: patientEmail,
    joinedDate,
    lastAssessmentDate: latestAssessment?.date || demoMatch?.lastAssessmentDate || 'No assessment yet',
    primaryDosha: latestAssessment?.doshaLabel || latestAssessment?.primaryDosha || demoMatch?.primaryDosha || 'Pending',
    assessmentsCount: assessments.length,
    assessments,
    notes: demoMatch?.notes || ''
  };

  // Save link to Firestore
  try {
    const linkRef = doc(db, 'practitionerPatients', pracId, 'patients', cleanId);
    await setDoc(linkRef, {
      linkedAt: new Date().toISOString(),
      patientUserId,
      patientId: cleanId,
      patientName,
      patientEmail
    });
  } catch (e) {
    console.warn('Firestore link save notice:', e);
  }

  // Save to local linked cache
  try {
    const key = `ojas_linked_patients_${pracId}`;
    const existingRaw = localStorage.getItem(key);
    let list: LinkedPatient[] = existingRaw ? JSON.parse(existingRaw) : [];
    if (!list.some(p => p.patientId === cleanId)) {
      list.push(linkedPatient);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    // ignore
  }

  return {
    success: true,
    patient: linkedPatient
  };
};

/**
 * Gets all linked patients for a practitioner
 */
export const getPractitionerPatients = async (pracId: string): Promise<LinkedPatient[]> => {
  const patientsMap = new Map<string, LinkedPatient>();

  // Include default demo patients so the dashboard is immediately rich and testable
  INITIAL_DEMO_PATIENTS.forEach(p => {
    patientsMap.set(p.patientId, { ...p });
  });

  // Read from local linked cache
  try {
    const key = `ojas_linked_patients_${pracId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as LinkedPatient[];
      parsed.forEach(p => patientsMap.set(p.patientId, p));
    }
  } catch (e) {
    // ignore
  }

  // Read from Firestore practitionerPatients/{pracId}/patients
  try {
    const snap = await getDocs(collection(db, 'practitionerPatients', pracId, 'patients'));
    for (const d of snap.docs) {
      const pData = d.data();
      const patientId = d.id;
      if (!patientsMap.has(patientId)) {
        // Fetch patient profile
        const u = await getUserProfile(pData.patientUserId);
        // Fetch assessments
        let assessments: AssessmentResult[] = [];
        try {
          const q = query(
            collection(db, 'assessmentResults'),
            where('patientId', '==', patientId)
          );
          const aSnap = await getDocs(q);
          assessments = aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AssessmentResult[];
        } catch (err) {
          // ignore
        }

        patientsMap.set(patientId, {
          patientId,
          patientUserId: pData.patientUserId || 'unknown',
          name: u?.name || pData.patientName || 'Patient',
          email: u?.email || pData.patientEmail || '',
          joinedDate: u?.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
          lastAssessmentDate: assessments[0]?.date || 'None',
          primaryDosha: assessments[0]?.doshaLabel || 'Pending',
          assessmentsCount: assessments.length,
          assessments,
          notes: ''
        });
      }
    }
  } catch (e) {
    console.warn('Firestore get linked patients notice:', e);
  }

  // Load private notes for each patient
  const list = Array.from(patientsMap.values());
  for (const patient of list) {
    try {
      const savedNote = localStorage.getItem(`ojas_notes_${pracId}_${patient.patientId}`);
      if (savedNote) {
        patient.notes = savedNote;
      }
    } catch (e) {
      // ignore
    }
  }

  return list;
};

/**
 * Gets private notes for a patient
 */
export const getPractitionerNotes = async (
  pracId: string,
  patientId: string
): Promise<{ notes: string; updatedAt: string } | null> => {
  // Try local first
  try {
    const local = localStorage.getItem(`ojas_notes_${pracId}_${patientId}`);
    if (local !== null) {
      return { notes: local, updatedAt: new Date().toISOString() };
    }
  } catch (e) {
    // ignore
  }

  // Try Firestore
  try {
    const noteSnap = await getDoc(doc(db, 'practitionerNotes', pracId, 'notes', patientId));
    if (noteSnap.exists()) {
      const data = noteSnap.data();
      return {
        notes: data.content || '',
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    }
  } catch (e) {
    console.warn('Firestore get notes notice:', e);
  }

  return null;
};

/**
 * Gets all assessments for a patient
 */
export const getPatientAssessments = async (
  patientUserId: string,
  patientId?: string
): Promise<AssessmentResult[]> => {
  // Check demo patients first if matching
  if (patientId) {
    const demo = INITIAL_DEMO_PATIENTS.find(d => d.patientId === patientId);
    if (demo && demo.assessments) {
      return demo.assessments;
    }
  }

  // Load from local storage or Firestore
  try {
    const localResults = localStorage.getItem(`ojas_results_${patientUserId}`);
    if (localResults) {
      return JSON.parse(localResults) as AssessmentResult[];
    }
  } catch (e) {
    // ignore
  }

  try {
    const q = patientId 
      ? query(collection(db, 'assessmentResults'), where('patientId', '==', patientId))
      : query(collection(db, 'assessmentResults'), where('userId', '==', patientUserId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AssessmentResult[];
    }
  } catch (e) {
    console.warn('Firestore get patient assessments notice:', e);
  }

  return [];
};

/**
 * Saves practitioner's private notes for a patient
 */
export const savePractitionerNotes = async (
  pracId: string,
  patientId: string,
  content: string
): Promise<void> => {
  // Local cache
  try {
    localStorage.setItem(`ojas_notes_${pracId}_${patientId}`, content);
  } catch (e) {
    // ignore
  }

  // Firestore save
  try {
    const noteRef = doc(db, 'practitionerNotes', pracId, 'notes', patientId);
    await setDoc(noteRef, {
      content,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Firestore save note notice:', e);
  }
};

// ==========================================
// PART 6: DAILY CHECK-INS & ADHERENCE
// ==========================================

export const calculateWellnessScore = (
  sleep: number,
  energy: number,
  stress: number,
  digestion: number,
  mood: number
): number => {
  const avg = (sleep + energy + stress + digestion + mood) / 5;
  const score = Math.round(100 - (avg - 1) * 25);
  return Math.max(0, Math.min(100, score));
};

export const submitDailyCheckIn = async (data: {
  patientId: string;
  assessmentId?: string;
  sleep: number;
  energy: number;
  stress: number;
  digestion: number;
  mood: number;
  treatmentFollowed: 'yes' | 'partially' | 'no';
}): Promise<any> => {
  const checkInId = 'chk-' + Date.now();
  const todayStr = new Date().toISOString().split('T')[0];
  const wellnessScore = calculateWellnessScore(
    data.sleep,
    data.energy,
    data.stress,
    data.digestion,
    data.mood
  );

  const checkInRecord = {
    id: checkInId,
    checkInId,
    patientId: data.patientId,
    assessmentId: data.assessmentId || '',
    date: todayStr,
    sleep: data.sleep,
    energy: data.energy,
    stress: data.stress,
    digestion: data.digestion,
    mood: data.mood,
    treatmentFollowed: data.treatmentFollowed,
    wellnessScore,
    createdAt: new Date().toISOString()
  };

  // Local storage cache
  try {
    const key = `ojas_checkins_${data.patientId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((c: any) => c.date !== todayStr);
    localStorage.setItem(key, JSON.stringify([checkInRecord, ...filtered]));
    localStorage.setItem(`ojas_last_checkin_${data.patientId}`, todayStr);
  } catch (e) {
    console.warn('Local checkin save error:', e);
  }

  // Firestore save
  try {
    const docRef = doc(db, 'daily_checkins', checkInId);
    await setDoc(docRef, checkInRecord);
  } catch (err) {
    console.warn('Firestore daily_checkin error:', err);
  }

  return checkInRecord;
};

export const hasCheckedInToday = (patientId: string): boolean => {
  const todayStr = new Date().toISOString().split('T')[0];
  const last = localStorage.getItem(`ojas_last_checkin_${patientId}`);
  if (last === todayStr) return true;

  try {
    const list = JSON.parse(localStorage.getItem(`ojas_checkins_${patientId}`) || '[]');
    return list.some((c: any) => c.date === todayStr);
  } catch (e) {
    return false;
  }
};

export const getCheckInsByPatient = async (patientId: string): Promise<any[]> => {
  // Demo checkins if arjun or meera
  if (patientId === 'OJ-2026-A4B7') {
    return [
      { id: 'c1', patientId, date: '2026-08-28', sleep: 2, energy: 2, stress: 3, digestion: 2, mood: 2, treatmentFollowed: 'yes', wellnessScore: 78, createdAt: '2026-08-28T09:00:00Z' },
      { id: 'c2', patientId, date: '2026-08-29', sleep: 2, energy: 3, stress: 3, digestion: 2, mood: 3, treatmentFollowed: 'yes', wellnessScore: 72, createdAt: '2026-08-29T09:00:00Z' },
      { id: 'c3', patientId, date: '2026-08-30', sleep: 3, energy: 3, stress: 4, digestion: 3, mood: 3, treatmentFollowed: 'partially', wellnessScore: 60, createdAt: '2026-08-30T09:00:00Z' },
      { id: 'c4', patientId, date: '2026-08-31', sleep: 3, energy: 2, stress: 3, digestion: 2, mood: 2, treatmentFollowed: 'yes', wellnessScore: 75, createdAt: '2026-08-31T09:00:00Z' },
      { id: 'c5', patientId, date: '2026-09-01', sleep: 2, energy: 2, stress: 2, digestion: 1, mood: 2, treatmentFollowed: 'yes', wellnessScore: 85, createdAt: '2026-09-01T09:00:00Z' },
      { id: 'c6', patientId, date: '2026-09-02', sleep: 1, energy: 2, stress: 2, digestion: 1, mood: 1, treatmentFollowed: 'yes', wellnessScore: 92, createdAt: '2026-09-02T09:00:00Z' },
      { id: 'c7', patientId, date: '2026-09-03', sleep: 1, energy: 1, stress: 2, digestion: 1, mood: 1, treatmentFollowed: 'yes', wellnessScore: 95, createdAt: '2026-09-03T09:00:00Z' }
    ];
  }

  // Load from local storage
  try {
    const list = JSON.parse(localStorage.getItem(`ojas_checkins_${patientId}`) || '[]');
    if (list.length > 0) return list;
  } catch (e) {
    // ignore
  }

  // Load from Firestore
  try {
    const q = query(
      collection(db, 'daily_checkins'),
      where('patientId', '==', patientId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn('Firestore get daily_checkins error:', e);
  }

  return [];
};

// ==========================================
// PART 6: APPOINTMENTS
// ==========================================

export const createAppointment = async (data: {
  patientId: string;
  patientUserId?: string;
  patientName?: string;
  patientContact?: string;
  practitionerId: string;
  practitionerName?: string;
  clinicName?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}): Promise<any> => {
  const appointmentId = 'apt-' + Date.now();
  const appointment = {
    id: appointmentId,
    appointmentId,
    patientId: data.patientId,
    patientUserId: data.patientUserId || '',
    patientName: data.patientName || 'Patient',
    patientContact: data.patientContact || '',
    practitionerId: data.practitionerId,
    practitionerName: data.practitionerName || 'Ayurvedic Practitioner',
    clinicName: data.clinicName || 'Ojas Ayurvedic Center',
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: 'pending',
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  // Local storage
  try {
    const allApts = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    localStorage.setItem('ojas_all_appointments', JSON.stringify([appointment, ...allApts]));
  } catch (e) {
    console.warn('Local save appointment error:', e);
  }

  // Firestore
  try {
    await setDoc(doc(db, 'appointments', appointmentId), appointment);
  } catch (e) {
    console.warn('Firestore save appointment error:', e);
  }

  return appointment;
};

export const getAppointmentsByPatient = async (patientId: string): Promise<any[]> => {
  // Load local
  let list: any[] = [];
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    list = all.filter((a: any) => a.patientId === patientId);
  } catch (e) {}

  if (list.length === 0) {
    // Check Firestore
    try {
      const q = query(collection(db, 'appointments'), where('patientId', '==', patientId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }

  return list;
};

export const getAppointmentsByPractitioner = async (practitionerId: string): Promise<any[]> => {
  let list: any[] = [];
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    list = all.filter((a: any) => a.practitionerId === practitionerId);
  } catch (e) {}

  if (list.length === 0) {
    // Provide default initial demo appointments if practitioner
    const demoApts = [
      {
        id: 'apt-demo-1',
        patientId: 'OJ-2026-A4B7',
        patientName: 'Arjun Singh',
        patientContact: '+91 98201 44521',
        practitionerId,
        appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        appointmentTime: '10:30 AM',
        status: 'pending',
        notes: 'Follow-up on Pitta pacification and sleep routine review.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'apt-demo-2',
        patientId: 'OJ-2026-M8K2',
        patientName: 'Meera Joshi',
        patientContact: '+91 98450 11299',
        practitionerId,
        appointmentDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        appointmentTime: '02:00 PM',
        status: 'confirmed',
        notes: 'Vata digestive review and winter herbal formulations.',
        createdAt: new Date().toISOString()
      }
    ];
    return demoApts;
  }

  return list;
};

export const confirmAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    const updated = all.map((a: any) => 
      a.id === appointmentId ? { ...a, status: 'confirmed', confirmedAt: new Date().toISOString() } : a
    );
    localStorage.setItem('ojas_all_appointments', JSON.stringify(updated));
  } catch (e) {}

  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'confirmed',
      confirmedAt: new Date().toISOString()
    });
  } catch (e) {}
};

export const rejectAppointment = async (appointmentId: string, reason?: string): Promise<void> => {
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    const updated = all.map((a: any) => 
      a.id === appointmentId ? { ...a, status: 'rejected', rejectedReason: reason || 'Practitioner unavailable at requested time' } : a
    );
    localStorage.setItem('ojas_all_appointments', JSON.stringify(updated));
  } catch (e) {}

  try {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'rejected',
      rejectedReason: reason || 'Practitioner unavailable'
    });
  } catch (e) {}
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    const updated = all.map((a: any) => 
      a.id === appointmentId ? { ...a, status: 'cancelled' } : a
    );
    localStorage.setItem('ojas_all_appointments', JSON.stringify(updated));
  } catch (e) {}

  try {
    await updateDoc(doc(db, 'appointments', appointmentId), { status: 'cancelled' });
  } catch (e) {}
};

export const completeAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const all = JSON.parse(localStorage.getItem('ojas_all_appointments') || '[]');
    const updated = all.map((a: any) => 
      a.id === appointmentId ? { ...a, status: 'completed' } : a
    );
    localStorage.setItem('ojas_all_appointments', JSON.stringify(updated));
  } catch (e) {}

  try {
    await updateDoc(doc(db, 'appointments', appointmentId), { status: 'completed' });
  } catch (e) {}
};

// ==========================================
// PART 3: PRACTITIONER VERIFICATION & DIRECTORY
// ==========================================

export const createPractitioner = async (data: any): Promise<any> => {
  const pracId = data.practitionerId || data.userId || 'prac-' + Date.now();
  const record = {
    ...data,
    practitionerId: pracId,
    verificationStatus: data.verificationStatus || 'pending',
    createdAt: data.createdAt || new Date().toISOString()
  };

  localStorage.setItem(`ojas_practitioner_${pracId}`, JSON.stringify(record));
  try {
    await setDoc(doc(db, 'practitioners', pracId), record);
  } catch (e) {}

  return record;
};

export const updatePractitionerVerification = async (
  practitionerId: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<void> => {
  try {
    const key = `ojas_practitioner_${practitionerId}`;
    const cached = JSON.parse(localStorage.getItem(key) || '{}');
    const updated = { ...cached, verificationStatus: status, verifiedAt: status === 'verified' ? new Date().toISOString() : undefined };
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {}

  try {
    await updateDoc(doc(db, 'practitioners', practitionerId), {
      verificationStatus: status,
      verifiedAt: status === 'verified' ? new Date().toISOString() : null
    });
  } catch (e) {}
};

export const getPractitionersByVerification = async (verified: boolean = true): Promise<any[]> => {
  // Built-in verified Ayurvedic specialists
  const defaultPractitioners = [
    {
      id: 'doc-radha',
      userId: 'doc-radha',
      name: 'Dr. Radha Raman',
      title: 'BAMS, MD (Ayu) • Kayachikitsa & Panchakarma',
      clinicName: 'AyurVeda Sanjeevani Clinic',
      location: 'New Delhi / Connaught Place',
      ccimNumber: 'CCIM-DL-19842',
      ncismNumber: 'NCISM/2021/4892',
      experienceYears: 16,
      rating: 4.9,
      reviewCount: 142,
      specialties: ['Digestive Health', 'Panchakarma', 'Stress & Insomnia', 'Metabolic Balance'],
      verified: true,
      verificationStatus: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1594824813589-32e67a99f17a?w=150&auto=format&fit=crop&q=80',
      consultationFee: '₹800',
      bio: 'Former Senior Physician at National Institute of Ayurveda (NIA), Jaipur. Specializes in chronic autoimmune imbalances, Agni optimization, and seasonal detoxification.',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat']
    },
    {
      id: 'doc-priya',
      userId: 'doc-priya',
      name: 'Dr. Priya Deshmukh',
      title: 'BAMS • Nadi Pariksha & Stree Roga Specialist',
      clinicName: 'Ojas Ayurveda & Wellness Center',
      location: 'Pune / Shivajinagar',
      ccimNumber: 'CCIM-MH-22310',
      ncismNumber: 'NCISM/2022/1039',
      experienceYears: 11,
      rating: 4.8,
      reviewCount: 98,
      specialties: ['Nadi Pariksha', 'Women\'s Health', 'Skin & Hair', 'Dietetics & Pathya'],
      verified: true,
      verificationStatus: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      consultationFee: '₹650',
      bio: 'Expert in classical pulse diagnostics and personalized Ahara-Vihara (diet and lifestyle) protocols rooted in Charaka Samhita.',
      availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    {
      id: 'doc-vikram',
      userId: 'doc-vikram',
      name: 'Dr. Vikramaditya Joshi',
      title: 'BAMS, PhD • Rasa Shastra & Dravyaguna',
      clinicName: 'Dhanwantari Holistic Healing',
      location: 'Bengaluru / Indiranagar',
      ccimNumber: 'CCIM-KA-33821',
      ncismNumber: 'NCISM/2020/7741',
      experienceYears: 19,
      rating: 4.9,
      reviewCount: 215,
      specialties: ['Classical Herbology', 'Joint Care & Vata', 'Respiratory Health', 'Geriatric Care'],
      verified: true,
      verificationStatus: 'verified',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      consultationFee: '₹950',
      bio: 'Leading researcher in authentic herbal preparations and Rasayana therapy. Consulted for over 10,000 patients across India.',
      availableDays: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun']
    }
  ];

  return defaultPractitioners.filter(p => !verified || p.verified);
};

// ==========================================
// PART 3: PATIENT CATEGORIZATION LOGIC
// ==========================================

export const categorizePatient = (
  patientId: string,
  assessments: any[] = [],
  checkIns: any[] = []
): 'Needs Attention' | 'Follow-up Due' | 'Improving' | 'New Patients' => {
  const now = Date.now();

  // Check 1: New Patients (assessed within last 3 days)
  if (assessments.length > 0) {
    const latest = assessments[0];
    const latestDate = new Date(latest.takenAt || latest.date).getTime();
    const daysSinceAssessment = (now - latestDate) / (1000 * 60 * 60 * 24);
    if (daysSinceAssessment <= 3 && assessments.length === 1) {
      return 'New Patients';
    }
  }

  // Check 2: Needs Attention (poor adherence or declining check-in scores)
  if (checkIns.length >= 2) {
    const recent = checkIns.slice(0, 3);
    const hasPoorAdherence = recent.some(c => c.treatmentFollowed === 'no');
    const scores = recent.map(c => c.wellnessScore || 70);
    const isDeclining = scores.length >= 2 && scores[0] < scores[scores.length - 1] - 8;
    if (hasPoorAdherence || isDeclining || scores[0] < 55) {
      return 'Needs Attention';
    }
  }

  // Check 3: Follow-up Due (last assessment 15+ days ago, no new one)
  if (assessments.length > 0) {
    const latest = assessments[0];
    const latestDate = new Date(latest.takenAt || latest.date).getTime();
    const daysSince = (now - latestDate) / (1000 * 60 * 60 * 24);
    if (daysSince >= 15) {
      return 'Follow-up Due';
    }
  }

  // Check 4: Improving (upward trend in check-in scores or good adherence)
  if (checkIns.length >= 2) {
    const scores = checkIns.slice(0, 4).map(c => c.wellnessScore || 70);
    if (scores[0] >= scores[scores.length - 1] || scores[0] >= 75) {
      return 'Improving';
    }
  }

  return 'Improving';
};

export const createAssessment = async (data: any): Promise<any> => {
  await saveAssessmentResult(data);
  return data;
};

export const getAssessmentsByPatient = async (patientId: string): Promise<any[]> => {
  return getPatientAssessments(patientId, patientId);
};

