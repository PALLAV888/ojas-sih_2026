import { db, collection, query, where, orderBy, getDocs } from '../firebase/config';
import { AssessmentResult } from '../types';

/**
 * Gets all assessments for a user, sorted oldest to newest
 */
export const getPatientProgress = async (userId: string): Promise<AssessmentResult[]> => {
  try {
    const q = query(
      collection(db, "assessmentResults"),
      where("userId", "==", userId),
      orderBy("takenAt", "asc")
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentResult[];
    }
  } catch (error) {
    console.warn('Could not fetch assessments from Firestore directly, checking localStorage cache:', error);
  }

  // Fallback to locally saved results for this user
  try {
    const saved = localStorage.getItem(`ojas_results_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved) as AssessmentResult[];
      return parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  } catch (e) {
    console.error('Error reading localStorage assessments:', e);
  }

  return [];
};

/**
 * Auto-generates a progress insight message across 2+ assessments
 */
export const generateProgressInsight = (assessments: AssessmentResult[]): string | null => {
  if (!assessments || assessments.length < 2) return null;

  const first = assessments[0];
  const latest = assessments[assessments.length - 1];

  const vataChange = latest.vataPercentage - first.vataPercentage;
  const pittaChange = latest.pittaPercentage - first.pittaPercentage;
  const kaphaChange = latest.kaphaPercentage - first.kaphaPercentage;

  const insights: string[] = [];

  if (Math.abs(vataChange) >= 10) {
    insights.push(
      vataChange > 0
        ? `Your Vata has increased by ${vataChange}% — try adding more routine and warmth.`
        : `Your Vata has reduced by ${Math.abs(vataChange)}% — your routine seems to be helping.`
    );
  }

  if (Math.abs(pittaChange) >= 10) {
    insights.push(
      pittaChange > 0
        ? `Your Pitta has increased by ${pittaChange}% — consider reducing stress and spicy food.`
        : `Your Pitta has balanced by ${Math.abs(pittaChange)}% — cooling practices are working.`
    );
  }

  if (Math.abs(kaphaChange) >= 10) {
    insights.push(
      kaphaChange > 0
        ? `Your Kapha has increased by ${kaphaChange}% — increase exercise and lighter foods.`
        : `Your Kapha has reduced by ${Math.abs(kaphaChange)}% — your activity levels are improving.`
    );
  }

  if (insights.length === 0) {
    return `Your dosha balance has been consistent across ${assessments.length} assessments.`;
  }

  return insights.join(" ");
};

/**
 * Auto-increments attempt number for each patient
 */
export const getNextAttemptNumber = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, "assessmentResults"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size + 1; // e.g. if 2 past results exist, this is attempt 3
  } catch (error) {
    // Fallback: check local storage
    try {
      const saved = localStorage.getItem(`ojas_results_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.length + 1;
        }
      }
    } catch (e) {
      // ignore
    }
    return 1;
  }
};
