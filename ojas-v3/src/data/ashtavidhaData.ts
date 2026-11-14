import { AshtavidhaQuestion } from '../types';

export const ASHTAVIDHA_QUESTIONS: AshtavidhaQuestion[] = [
  {
    id: 'nadi_pulse',
    category: 'Nadi',
    categoryLabel: 'Pulse Quality (नाड़ी परीक्षा)',
    sanskritName: 'Nadi Pariksha',
    question: 'How does your resting pulse feel at the radial wrist?',
    explanation: 'Classical Ayurveda assesses pulse rhythm: Sarpa (snake/Vata), Manduka (frog/Pitta), and Hamsa (swan/Kapha).',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Sarpa Gati (Snake-like): Quick, thin, irregular',
        description: 'Vata pulse is light, rapid, easily compressible, moving like a slender serpent.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Manduka Gati (Frog-like): Strong, bounding, rhythmic',
        description: 'Pitta pulse is forceful, warm, energetic, and jumping like a frog.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Hamsa Gati (Swan-like): Slow, deep, steady, wave-like',
        description: 'Kapha pulse is broad, full, slow, and gliding smoothly like a swan on water.'
      }
    ]
  },
  {
    id: 'jihva_tongue',
    category: 'Jihva',
    categoryLabel: 'Tongue Examination (जिह्वा परीक्षा)',
    sanskritName: 'Jihva Pariksha',
    question: 'What is the morning appearance and coating of your tongue?',
    explanation: 'The tongue reveals the state of Agni (digestive fire) and Ama (metabolic toxins).',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Dry, rough, thin with cracks or greyish-brown tinge',
        description: 'Vata signs include roughness, trembling, fissures, and minimal saliva.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Reddish, sensitive, with a light yellow/greenish coating',
        description: 'Pitta signs include inflamed papillae, redness along the edges, and warmth.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Pale, moist, swollen with thick white slippery coating',
        description: 'Kapha signs include tooth marks along edges, excess mucus, and heavy coating.'
      }
    ]
  },
  {
    id: 'mala_elimination',
    category: 'Mala',
    categoryLabel: 'Stool & Bowel Dynamics (मल परीक्षा)',
    sanskritName: 'Mala Pariksha',
    question: 'What is your typical pattern of bowel elimination?',
    explanation: 'Healthy elimination in Ayurveda sinks or floats based on the presence of Ama (undigested residue).',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Irregular, dry, hard or pelleted (tends toward constipation)',
        description: 'Difficult evacuation with gas or bloating; takes effort.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Frequent (2-3 times/day), soft or loose, yellowish, occasional burning',
        description: 'Prompt evacuation, sharp urgency, loose consistency.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Heavy, regular (once daily), bulky, slow with occasional mucus',
        description: 'Predictable, sticky, takes time to finish; feels heavy.'
      }
    ]
  },
  {
    id: 'mutra_urine',
    category: 'Mutra',
    categoryLabel: 'Urine Characteristics (मूत्र परीक्षा)',
    sanskritName: 'Mutra Pariksha',
    question: 'What is the usual color, clarity, and frequency of your urination?',
    explanation: 'Mutra reflects the kidneys, bladder, Pitta heat, and hydration equilibrium.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Clear or pale, frequent, scanty in volume',
        description: 'Urine is light, watery, occasionally erratic with cool sensation.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Dark yellow, amber, or reddish with warm sensation',
        description: 'Concentrated, strong odor, occasional mild burning after spicy meals.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Cloudy, whitish, copious, steady stream',
        description: 'Frothy or oily surface sheen, slow easy flow.'
      }
    ]
  },
  {
    id: 'shabda_voice',
    category: 'Shabda',
    categoryLabel: 'Voice & Speech Cadence (शब्द परीक्षा)',
    sanskritName: 'Shabda Pariksha',
    question: 'How do others characterize the sound, tone, and pace of your voice?',
    explanation: 'Shabda reflects the respiratory tract (Prana Vayu) and throat chakra (Udana Vayu).',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Fast, variable pitch, hoarse or cracking when tired',
        description: 'Talks rapidly, wanders between topics, expressive and animated.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Sharp, clear, penetrating, authoritative and direct',
        description: 'Precise articulation, commanding presence, clear volume.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Deep, resonant, melodious, slow and soothing',
        description: 'Calm rhythm, speaks only when necessary, pleasant low tone.'
      }
    ]
  },
  {
    id: 'sparsha_touch',
    category: 'Sparsha',
    categoryLabel: 'Skin Temperature & Touch (स्पर्श परीक्षा)',
    sanskritName: 'Sparsha Pariksha',
    question: 'How does your skin feel when touched by another person?',
    explanation: 'Sparsha assesses circulating Vyana Vayu, Bhrajaka Pitta, and Tarpaka Kapha.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Cool, dry, rough, with prominent veins or tendons',
        description: 'Hands and feet are often cold; skin requires frequent oiling.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Warm, slightly moist, sensitive, prone to reddish flushing',
        description: 'Generates internal heat; easily turns pink or develops hives.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Cool, soft, smooth, oily, thick and supple',
        description: 'Naturally cushioned, rarely develops wrinkles or dryness.'
      }
    ]
  },
  {
    id: 'drik_eyes',
    category: 'Drik',
    categoryLabel: 'Eyes & Gaze (दृक् परीक्षा)',
    sanskritName: 'Drik Pariksha',
    question: 'How would you describe your eyes and visual sensitivity?',
    explanation: 'The eyes are governed by Alochaka Pitta and reveal overall neurological calm.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Small, dry, blinking frequently, darting or restless gaze',
        description: 'Prone to dryness, eye fatigue after screens, dark undereye circles.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Sharp, piercing, sensitive to bright sunlight, reddish sclera',
        description: 'Intense focus, prone to eye burning or irritation in hot weather.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Large, luminous, white sclera, thick lashes, calm loving gaze',
        description: 'Deep and clear, rarely irritated, peaceful expression.'
      }
    ]
  },
  {
    id: 'akriti_posture',
    category: 'Akriti',
    categoryLabel: 'Gait, Posture & Physique (आकृति परीक्षा)',
    sanskritName: 'Akriti Pariksha',
    question: 'How is your general physical build, posture, and natural walking pace?',
    explanation: 'Akriti reflects structural tissue (Asthi Dhatu, Mamsa Dhatu) and vitality.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Slender, asymmetric joints, light steps, hasty brisk walk',
        description: 'Moves erratically, changes posture often, light on their feet.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Moderate, athletic posture, decisive purposeful walk',
        description: 'Balanced musculature, confident stride, symmetrical frame.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Broad, sturdy, well-grounded, slow graceful steady walk',
        description: 'Heavy bone structure, solid center of gravity, relaxed stance.'
      }
    ]
  },
  {
    id: 'sveda_sweat',
    category: 'Sparsha',
    categoryLabel: 'Perspiration & Odor (स्वेद परीक्षा)',
    sanskritName: 'Sveda Pariksha',
    question: 'What is your natural sweating pattern and body scent?',
    explanation: 'Sveda is a secondary waste product (Upadhatu) linked to Meda (adipose tissue) and Pitta.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Scanty or variable perspiration, minimal odor',
        description: 'Rarely sweats even with exertion, skin remains dry.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Profuse sweating, hot sensation, sharp or sour odor',
        description: 'Sweats easily even in mild warmth, especially forehead and palms.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Moderate, steady sweat with heavy exercise, sweetish or neutral odor',
        description: 'Cool, slow to begin sweating, damp rather than dripping.'
      }
    ]
  },
  {
    id: 'manas_mind',
    category: 'Shabda',
    categoryLabel: 'Psychological Temperament (मानस प्रकृति)',
    sanskritName: 'Manas Pariksha',
    question: 'Under acute pressure or unexpected change, what is your initial reflex?',
    explanation: 'The mental doshas (Rajas and Tamas) interact dynamically with bodily humors.',
    options: [
      {
        value: 'vata',
        dosha: 'Vata',
        label: 'Overthinking, anxiety, restlessness, insomnia, needing reassurance',
        description: 'Mind races with scenarios; tendency to scatter focus.'
      },
      {
        value: 'pitta',
        dosha: 'Pitta',
        label: 'Frustration, irritability, wanting to take immediate control, anger',
        description: 'Demands quick resolutions; impatient with incompetence.'
      },
      {
        value: 'kapha',
        dosha: 'Kapha',
        label: 'Withdrawal, hesitation, avoidance of confrontation, comfort eating',
        description: 'Takes time to process; emotionally resilient but resistant to disruption.'
      }
    ]
  }
];
