import { AssessmentLayer, AssessmentAnswers, AssessmentResult } from '../types';

export const ASSESSMENT_LAYERS: AssessmentLayer[] = [
  {
    layerNumber: 1,
    id: 'bodyFrame',
    title: 'Body Frame',
    layerTag: 'Layer 1 of 8',
    question: 'How would you describe your natural body frame?',
    explanation: 'This is about your natural body type, not current weight.',
    options: [
      {
        value: 'thin',
        dosha: 'Vata',
        label: 'Thin and light',
        description: 'I stay slim even when eating well, narrow shoulders/hips.',
        iconName: 'Wind'
      },
      {
        value: 'medium',
        dosha: 'Pitta',
        label: 'Medium and athletic',
        description: 'I build muscle and stay warm easily, balanced proportions.',
        iconName: 'Flame'
      },
      {
        value: 'heavy',
        dosha: 'Kapha',
        label: 'Heavy and sturdy',
        description: 'I hold weight, feel grounded, broad bone structure.',
        iconName: 'Droplets'
      }
    ]
  },
  {
    layerNumber: 2,
    id: 'skinType',
    title: 'Skin Type',
    layerTag: 'Layer 2 of 8',
    question: "What's your skin like naturally?",
    explanation: 'Think about your skin when you were younger, not weather-affected.',
    options: [
      {
        value: 'dry',
        dosha: 'Vata',
        label: 'Dry and thin',
        description: 'Needs moisturizer often, cool to touch, prone to roughness.',
        iconName: 'Feather'
      },
      {
        value: 'warm',
        dosha: 'Pitta',
        label: 'Warm and sensitive',
        description: 'Gets red, reacts to sun, freckles or warm undertones.',
        iconName: 'Sun'
      },
      {
        value: 'oily',
        dosha: 'Kapha',
        label: 'Oily and thick',
        description: 'Rarely feels dry, soft, smooth, slow to wrinkle.',
        iconName: 'Sparkles'
      }
    ]
  },
  {
    layerNumber: 3,
    id: 'hairType',
    title: 'Hair Type',
    layerTag: 'Layer 3 of 8',
    question: "What's your natural hair like?",
    explanation: 'Describe your natural hair texture and growth pattern.',
    options: [
      {
        value: 'thin',
        dosha: 'Vata',
        label: 'Thin, dry, easy to tangle',
        description: 'Vata type — lighter strands, tends towards dryness or frizz.',
        iconName: 'Wind'
      },
      {
        value: 'fine',
        dosha: 'Pitta',
        label: 'Fine, premature grey/thinning',
        description: 'Pitta type — soft, fine texture, reddish/light tones, sensitive scalp.',
        iconName: 'Flame'
      },
      {
        value: 'thick',
        dosha: 'Kapha',
        label: 'Thick, oily, strong',
        description: 'Kapha type — lustrous, wavy or curly, deeply rooted and plentiful.',
        iconName: 'Droplets'
      }
    ]
  },
  {
    layerNumber: 4,
    id: 'digestion',
    title: 'Digestion',
    layerTag: 'Layer 4 of 8',
    question: "How's your digestion usually?",
    explanation: 'How quickly does food move through your system?',
    options: [
      {
        value: 'variable',
        dosha: 'Vata',
        label: 'Variable',
        description: 'Sometimes slow, sometimes fast, often gassy or bloated.',
        iconName: 'Activity'
      },
      {
        value: 'strong',
        dosha: 'Pitta',
        label: 'Strong',
        description: 'Food digests quickly, handles spice well, strong hunger pangs.',
        iconName: 'Flame'
      },
      {
        value: 'slow',
        dosha: 'Kapha',
        label: 'Slow',
        description: 'Takes time to digest, sluggish, can easily skip meals without discomfort.',
        iconName: 'Clock'
      }
    ]
  },
  {
    layerNumber: 5,
    id: 'appetite',
    title: 'Appetite & Eating',
    layerTag: 'Layer 5 of 8',
    question: "How's your appetite?",
    explanation: 'How often do you feel hungry and need to eat?',
    options: [
      {
        value: 'irregular',
        dosha: 'Vata',
        label: 'Irregular',
        description: 'Skip meals, forget to eat, snack often instead of full dishes.',
        iconName: 'Compass'
      },
      {
        value: 'strong',
        dosha: 'Pitta',
        label: 'Strong',
        description: 'Always hungry, can eat anytime, irritable when food is delayed.',
        iconName: 'Utensils'
      },
      {
        value: 'steady',
        dosha: 'Kapha',
        label: 'Steady',
        description: 'Satisfied with regular meals, emotional eating or comfort cravings.',
        iconName: 'Coffee'
      }
    ]
  },
  {
    layerNumber: 6,
    id: 'sleepPattern',
    title: 'Sleep Pattern',
    layerTag: 'Layer 6 of 8',
    question: "What's your natural sleep like?",
    explanation: 'How deeply do you sleep when you get full rest?',
    options: [
      {
        value: 'light',
        dosha: 'Vata',
        label: 'Light and restless',
        description: 'Wake often, need silence and warmth, light dreams, 6-7 hours.',
        iconName: 'Moon'
      },
      {
        value: 'medium',
        dosha: 'Pitta',
        label: 'Medium',
        description: 'Wake early, 5-6 hours feels enough, intense vivid dreams.',
        iconName: 'Clock'
      },
      {
        value: 'deep',
        dosha: 'Kapha',
        label: 'Deep and heavy',
        description: 'Sleep long (8+ hours), hard to wake in the morning, restful.',
        iconName: 'Bed'
      }
    ]
  },
  {
    layerNumber: 7,
    id: 'energy',
    title: 'Energy & Activity',
    layerTag: 'Layer 7 of 8',
    question: "What's your natural energy level?",
    explanation: 'Think about your default energy level on a normal day.',
    options: [
      {
        value: 'variable',
        dosha: 'Vata',
        label: 'Variable and creative',
        description: 'Energetic in quick bursts then suddenly exhausted, needs grounding.',
        iconName: 'Zap'
      },
      {
        value: 'focused',
        dosha: 'Pitta',
        label: 'Focused and intense',
        description: 'Like to push hard, high stamina, goal-driven physical drive.',
        iconName: 'TrendingUp'
      },
      {
        value: 'calm',
        dosha: 'Kapha',
        label: 'Calm and steady',
        description: 'Prefer slow, regular activity, high endurance once started.',
        iconName: 'Shield'
      }
    ]
  },
  {
    layerNumber: 8,
    id: 'temperament',
    title: 'Mood & Temperament',
    layerTag: 'Layer 8 of 8',
    question: "What's your natural temperament?",
    explanation: 'How do people usually describe your personality?',
    options: [
      {
        value: 'anxious',
        dosha: 'Vata',
        label: 'Anxious, quick-thinking, creative',
        description: 'Mind is always active, enthusiastic, sensitive, artistic.',
        iconName: 'Brain'
      },
      {
        value: 'sharp',
        dosha: 'Pitta',
        label: 'Sharp, intense, leader-like',
        description: 'Strong opinions, passionate, organized, direct communicator.',
        iconName: 'Award'
      },
      {
        value: 'calm',
        dosha: 'Kapha',
        label: 'Calm, grounded, content',
        description: 'Go-with-the-flow, patient, loyal, nurturing and supportive.',
        iconName: 'Heart'
      }
    ]
  }
];

export function calculateDoshaResult(
  answers: AssessmentAnswers,
  userId: string,
  userName?: string,
  patientId?: string,
  attemptNumber?: number
): AssessmentResult {
  let vataCount = 0;
  let pittaCount = 0;
  let kaphaCount = 0;

  // Layer 1
  if (answers.bodyFrame === 'thin') vataCount++;
  else if (answers.bodyFrame === 'medium') pittaCount++;
  else if (answers.bodyFrame === 'heavy') kaphaCount++;

  // Layer 2
  if (answers.skinType === 'dry') vataCount++;
  else if (answers.skinType === 'warm') pittaCount++;
  else if (answers.skinType === 'oily') kaphaCount++;

  // Layer 3
  if (answers.hairType === 'thin') vataCount++;
  else if (answers.hairType === 'fine') pittaCount++;
  else if (answers.hairType === 'thick') kaphaCount++;

  // Layer 4
  if (answers.digestion === 'variable') vataCount++;
  else if (answers.digestion === 'strong') pittaCount++;
  else if (answers.digestion === 'slow') kaphaCount++;

  // Layer 5
  if (answers.appetite === 'irregular') vataCount++;
  else if (answers.appetite === 'strong') pittaCount++;
  else if (answers.appetite === 'steady') kaphaCount++;

  // Layer 6
  if (answers.sleepPattern === 'light') vataCount++;
  else if (answers.sleepPattern === 'medium') pittaCount++;
  else if (answers.sleepPattern === 'deep') kaphaCount++;

  // Layer 7
  if (answers.energy === 'variable') vataCount++;
  else if (answers.energy === 'focused') pittaCount++;
  else if (answers.energy === 'calm') kaphaCount++;

  // Layer 8
  if (answers.temperament === 'anxious') vataCount++;
  else if (answers.temperament === 'sharp') pittaCount++;
  else if (answers.temperament === 'calm') kaphaCount++;

  const total = Math.max(1, vataCount + pittaCount + kaphaCount);
  const vataPercentage = Math.round((vataCount / total) * 100);
  const pittaPercentage = Math.round((pittaCount / total) * 100);
  // Ensure sum equals 100
  const kaphaPercentage = 100 - vataPercentage - pittaPercentage;

  // Determine Primary & Secondary
  const doshas = [
    { name: 'Vata' as const, pct: vataPercentage },
    { name: 'Pitta' as const, pct: pittaPercentage },
    { name: 'Kapha' as const, pct: kaphaPercentage }
  ].sort((a, b) => b.pct - a.pct);

  const primaryDosha: 'Vata' | 'Pitta' | 'Kapha' = doshas[0].name;
  let secondaryDosha: 'Vata' | 'Pitta' | 'Kapha' | undefined = undefined;
  
  let doshaLabel: string = primaryDosha;
  // If second dosha is within 15% or at least 25%
  if (doshas[1].pct >= 25 && doshas[0].pct - doshas[1].pct <= 25) {
    secondaryDosha = doshas[1].name;
    doshaLabel = `${primaryDosha}-${secondaryDosha}`;
  }

  // Map readable strings for layers
  const layer1_bodyFrame = answers.bodyFrame === 'thin' ? 'Thin and light' : answers.bodyFrame === 'medium' ? 'Medium and athletic' : 'Heavy and sturdy';
  const layer2_skinType = answers.skinType === 'dry' ? 'Dry and thin' : answers.skinType === 'warm' ? 'Warm and sensitive' : 'Oily and thick';
  const layer3_hairType = answers.hairType === 'thin' ? 'Thin, dry, easy to tangle' : answers.hairType === 'fine' ? 'Fine, premature grey/thinning' : 'Thick, oily, strong';
  const layer4_digestion = answers.digestion === 'variable' ? 'Variable (irregular, prone to gas)' : answers.digestion === 'strong' ? 'Strong and quick' : 'Slow and heavy';
  const layer5_appetite = answers.appetite === 'irregular' ? 'Irregular / Skippable' : answers.appetite === 'strong' ? 'Strong and consistent' : 'Steady / Can easily delay';
  const layer6_sleepPattern = answers.sleepPattern === 'light' ? 'Light & interrupted' : answers.sleepPattern === 'medium' ? 'Moderate, wakes early' : 'Deep & heavy';
  const layer7_energy = answers.energy === 'variable' ? 'Variable (bursts & fatigue)' : answers.energy === 'focused' ? 'Focused and intense' : 'Calm, high endurance';
  const layer8_temperament = answers.temperament === 'anxious' ? 'Enthusiastic, creative, prone to worry' : answers.temperament === 'sharp' ? 'Sharp and passionate' : 'Calm, patient, steady';

  const baseResult = {
    id: 'res-' + Date.now(),
    userId,
    patientId,
    userName: userName || 'Seeker',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    takenAt: new Date().toISOString(),
    attemptNumber: attemptNumber || 1,
    answers,
    layer1_bodyFrame,
    layer2_skinType,
    layer3_hairType,
    layer4_digestion,
    layer5_appetite,
    layer6_sleepPattern,
    layer7_energy,
    layer8_temperament,
    vataScore: vataCount,
    pittaScore: pittaCount,
    kaphaScore: kaphaCount,
    primaryDosha,
    secondaryDosha,
    doshaLabel,
    vataPercentage,
    pittaPercentage,
    kaphaPercentage,
  };

  // Generate Profile content based on Primary Dosha
  if (primaryDosha === 'Vata') {
    return {
      ...baseResult,
      summary: "You are a Vata dominant type governed by the elements of Air and Space (Ether). You are natural vitality, quick thinking, and radiant imagination in motion.",
      bodyAndHealth: [
        "You're naturally thin, light on your feet, and naturally flexible",
        "Your hands and feet tend to get cold easily; you love comforting warmth",
        "Your digestion is variable and sensitive to irregular meal times or stress",
        "You thrive when you have rhythm, soothing hydration, and grounding nourishment"
      ],
      personality: [
        "You're deeply creative, intuitive, and a fast learner",
        "You adore variety, exciting conversations, and spontaneous ideas",
        "Your mind moves quickly and can feel scattered if over-stimulated"
      ],
      strengths: [
        "Adaptable, imaginative, expressive, and brimming with infectious enthusiasm"
      ],
      challenges: [
        "Can become restless, prone to dry skin/fatigue, and vulnerable to anxiety under pressure"
      ],
      favoriteFoods: [
        "Warm, freshly cooked soups, stews, and porridges",
        "Grounding whole grains: Basmati rice, oats, wheat, and quinoa",
        "Healthy lubricating fats: Pure A2 ghee, cold-pressed sesame oil, avocado",
        "Warming aromatic spices: Fresh ginger, cumin, cinnamon, cardamom, nutmeg",
        "Sweet root vegetables: Roasted carrots, beets, sweet potatoes, parsnips",
        "Soaked and peeled almonds, walnuts, and warm spiced golden milk"
      ],
      avoidFoods: [
        "Cold, raw salads and iced drinks (dampens digestive fire)",
        "Excess caffeine, carbonated sodas, and energy drinks",
        "Dry, crunchy, airy snacks like crackers, popcorn, and rice cakes",
        "Excessive refined sugars and artificial additives",
        "Bitter, astringent, or excessively cold foods in cold weather"
      ],
      dailyRoutine: {
        morning: {
          time: '6:00 AM – 8:00 AM',
          title: 'Gentle Awakening & Grounding',
          items: [
            'Wake by 6:00 AM to align with natural Vata hours',
            'Drink 1-2 cups of warm water with lemon or gentle ginger slices',
            'Self-massage (Abhyanga) with warm sesame oil before a warm shower',
            'Savor a warm, grounding breakfast (e.g. spiced oatmeal with stewed apples)'
          ]
        },
        midday: {
          time: '12:00 PM – 1:30 PM',
          title: 'Mindful Sustenance',
          items: [
            'Make lunch your most substantial and nourishing meal of the day',
            'Eat in a peaceful environment without phone screens or multitasking',
            'Take a calm 10-minute stroll to facilitate digestion'
          ]
        },
        evening: {
          time: '7:00 PM – 10:00 PM',
          title: 'Soothing Wind Down',
          items: [
            'Enjoy a light, warm dinner by 7:30 PM (e.g. Kitchari or lentil soup)',
            'Disconnect from blue-light screens 1 hour prior to sleep',
            'Sip warm spiced nutmeg milk or chamomile tea',
            'Be in bed by 10:00 PM for deep, restorative cellular rejuvenation'
          ]
        }
      },
      seasonalTips: [
        {
          season: 'Summer (Pitta Season)',
          doshaSeason: 'Keep cool & hydrated',
          tips: [
            'Stay cool and avoid midday sun exposure',
            'Incorporate sweet juicy fruits like melons, sweet berries, and coconut water',
            'Use cooling herbs such as mint, coriander, and fennel'
          ]
        },
        {
          season: 'Fall & Early Winter (Vata Season — YOUR SEASON)',
          doshaSeason: 'Grounding, Warming & Nourishing',
          tips: [
            'Eat deeply warming, soupy, and oily comfort foods',
            'Protect ears, neck, and extremities from cold wind with scarves',
            'Maintain a strictly consistent daily rhythm for meals and sleep',
            'Daily warm oil massages provide an energetic shield against dry weather'
          ]
        },
        {
          season: 'Spring (Kapha Season)',
          doshaSeason: 'Gentle cleansing',
          tips: [
            'Introduce gentle digestive spices (black pepper, ginger) to clear spring sluggishness',
            'Enjoy moderate daily movement and pranayama breathing'
          ]
        }
      ]
    };
  } else if (primaryDosha === 'Pitta') {
    return {
      ...baseResult,
      summary: "You are a Pitta dominant type governed by Fire and Water. You possess incredible internal brilliance, sharp intellect, natural leadership, and dynamic digestive vitality.",
      bodyAndHealth: [
        "You have a medium, balanced athletic frame and build tone easily",
        "Your body naturally runs warm and you have a strong, rapid metabolism",
        "Your digestive fire (Agni) is potent — you digest meals quickly",
        "You enjoy physical vigor but must avoid internal heat accumulation"
      ],
      personality: [
        "You are articulate, purposeful, organized, and a decisive leader",
        "You have high standards, love problem-solving, and act with conviction",
        "You are ambitious and passionate about achieving excellence"
      ],
      strengths: [
        "Sharp intellect, courageous, highly focused, generous, and inspiring"
      ],
      challenges: [
        "Can become impatient, irritable when meals are late, and prone to perfectionist burnout"
      ],
      favoriteFoods: [
        "Cooling, hydrating foods: Cucumbers, sweet fruits, zucchini, leafy greens",
        "Cooling grains: Basmati rice, barley, oats, and wheat",
        "Healthy oils: Coconut oil, ghee, and sunflower oil",
        "Cooling spices: Fresh cilantro, coriander, fennel, cardamom, turmeric",
        "Sweet dairy: Fresh milk, coconut yogurt, paneer, and sweet lassi",
        "Sweet crisp apples, ripe sweet berries, pears, and pomegranates"
      ],
      avoidFoods: [
        "Excessively hot, spicy chilies and pungent peppers",
        "Deep-fried, overly salty, or sour fermented foods (pickles, vinegar)",
        "Excess alcohol, black coffee, and heavy red meat",
        "Eating when angry or stressed",
        "Sour citrus and acidic tomatoes in high summer"
      ],
      dailyRoutine: {
        morning: {
          time: '6:00 AM – 7:30 AM',
          title: 'Cooling Awakening',
          items: [
            'Wake pleasantly before sunrise with a clear mind',
            'Drink cool or room-temperature water infused with cucumber or mint',
            'Abhyanga massage with cooling coconut or brahmi oil',
            'Calming meditation or Sheetali cooling breathing practice'
          ]
        },
        midday: {
          time: '12:00 PM – 1:00 PM',
          title: 'Peak Agni Fulfillment',
          items: [
            'Eat your main lunch when the midday sun matches your highest metabolic fire',
            'Enjoy fresh vegetables, grains, and refreshing mint chutney',
            'Take a quiet 5-minute break away from work decisions'
          ]
        },
        evening: {
          time: '6:30 PM – 10:00 PM',
          title: 'Cool Down & Release',
          items: [
            'Eat a moderate cooling dinner by 7:00 PM',
            'Unwind with nature walks, moonlight strolls, or soothing instrumental music',
            'Avoid heated work discussions late in the evening',
            'Sleep by 10:00 PM to prevent late-night second wind burnout'
          ]
        }
      },
      seasonalTips: [
        {
          season: 'Summer (Pitta Season — YOUR VULNERABLE SEASON)',
          doshaSeason: 'Stay cool, calm, and hydrated',
          tips: [
            'Minimize direct midday sun exposure; swim in natural fresh water',
            'Drink refreshing coconut water and mint-infused herbal teas',
            'Wear breathable natural fabrics (cotton, linen) in cooling whites and blues',
            'Reduce spicy, salty, and sour flavors'
          ]
        },
        {
          season: 'Fall & Winter (Vata / Kapha)',
          doshaSeason: 'Balanced warmth without overheating',
          tips: [
            'Enjoy moderately warm spiced soups without excessive chili heat',
            'Channel your sharp focus into creative projects and study'
          ]
        },
        {
          season: 'Spring',
          doshaSeason: 'Refreshing revitalisation',
          tips: [
            'Enjoy bitter greens (dandelion, kale, arugula) to naturally cleanse the liver',
            'Engage in invigorating morning trail runs or outdoor cycling'
          ]
        }
      ]
    };
  } else {
    // Kapha Dominant
    return {
      ...baseResult,
      summary: "You are a Kapha dominant type governed by Water and Earth. You are the embodiment of stability, emotional warmth, endurance, loyalty, and deep natural resilience.",
      bodyAndHealth: [
        "You have a solid, sturdy frame, broad shoulders, and natural strength",
        "Your skin is soft, thick, and supple; your hair is thick and lustrous",
        "Your digestion is steady and methodical; you rarely suffer acute digestive distress",
        "You possess extraordinary physical endurance and robust immunity"
      ],
      personality: [
        "You are affectionate, calm, patient, and deeply grounded",
        "You offer a comforting presence and remain peaceful during crises",
        "You have an excellent long-term memory and cherish lifelong relationships"
      ],
      strengths: [
        "Loyal, compassionate, forgiving, emotionally stable, and deeply supportive"
      ],
      challenges: [
        "Can become resistant to change, slow to get moving in the morning, and prone to lethargy"
      ],
      favoriteFoods: [
        "Light, warm, dry, and stimulating meals with abundant aromatic spices",
        "Legumes: Moong dal, lentils, chickpeas, and black beans",
        "Astringent and bitter vegetables: Spinach, broccoli, cabbage, asparagus, kale",
        "Light grains: Quinoa, millet, buckwheat, and barley",
        "Pungent spices: Black pepper, ginger, mustard seed, cayenne, clove",
        "Raw local honey in moderation (great for clearing excess Kapha)",
        "Astringent fruits: Apples, pomegranates, cranberries, and berries"
      ],
      avoidFoods: [
        "Heavy, cold, creamy, and oily foods (cheese, ice cream, deep-fried foods)",
        "Excessive sweet baked desserts and refined white sugar",
        "Heavy red meats and saturated fat dishes",
        "Cold iced drinks and excessive snacking between meals",
        "Overeating at dinner time"
      ],
      dailyRoutine: {
        morning: {
          time: '5:30 AM – 7:00 AM',
          title: 'Invigorating Awakening',
          items: [
            'Wake before 6:00 AM to beat the heavy Kapha morning inertia',
            'Drink hot water with a teaspoon of raw honey and fresh ginger',
            'Dry brushing (Garshana) or vigorous towel rub to stimulate lymphatic flow',
            'Engage in brisk, energizing aerobic exercise or dynamic Sun Salutations'
          ]
        },
        midday: {
          time: '12:00 PM – 1:30 PM',
          title: 'Spiced Nutrition',
          items: [
            'Make lunch your only substantial meal; keep it well-spiced and colorful',
            'Skip daytime naps as they dramatically increase Kapha sluggishness',
            'Take a brisk 15-minute walk outdoors'
          ]
        },
        evening: {
          time: '6:30 PM – 10:30 PM',
          title: 'Light Nourishment & Motion',
          items: [
            'Keep dinner very light (e.g. spiced vegetable soup) eaten by 7:00 PM',
            'Engage in mentally stimulating activities, reading, or creative hobbies',
            'Retire by 10:30 PM (avoid oversleeping beyond 7-8 hours)'
          ]
        }
      },
      seasonalTips: [
        {
          season: 'Spring (Kapha Season — YOUR MOST CRITICAL SEASON)',
          doshaSeason: 'Detox, awaken, and invigorate',
          tips: [
            'Enjoy a gentle Ayurvedic spring cleanse (Kitchari reset)',
            'Increase pungent, bitter, and astringent spices (ginger, black pepper, turmeric)',
            'Elevate physical workouts to shake off winter heaviness',
            'Minimize dairy, heavy wheat, and cold desserts'
          ]
        },
        {
          season: 'Summer (Pitta Season)',
          doshaSeason: 'Active & vibrant',
          tips: [
            'Enjoy swimming, hiking, and active outdoor adventures',
            'Eat fresh garden salads with zesty ginger-lime dressings'
          ]
        },
        {
          season: 'Fall & Winter (Vata Season)',
          doshaSeason: 'Warming activity',
          tips: [
            'Stay warm and keep active indoors',
            'Enjoy warm spiced chai and roasted spiced root vegetables'
          ]
        }
      ]
    };
  }
}
