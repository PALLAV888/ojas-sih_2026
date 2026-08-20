// RECOMMENDATION DATA FOR ALL DOSHAS
// PRAGMATIC APPROACH: Simple, clear, results-focused

export const RECOMMENDATIONS = {
  pitta: {
    // WHAT USER SEES
    title: "Pitta (Fire Type)",
    description: "You are naturally hot, sharp, and intense",
    
    foods: [
      {name: "Coconut milk", emoji: "🥥"},
      {name: "Milk", emoji: "🥛"},
      {name: "Cucumber", emoji: "🥒"},
      {name: "Ghee", emoji: "🍶"},
      {name: "Watermelon", emoji: "🍉"},
      {name: "Sweet potato", emoji: "🍠"},
      {name: "Barley", emoji: "🌾"},
      {name: "Cilantro", emoji: "🌿"},
      {name: "Mint", emoji: "🌱"},
      {name: "Almonds", emoji: "🌰"}
    ],
    
    avoid: [
      {name: "Chili", reason: "Too hot"},
      {name: "Spicy foods", reason: "Increases heat"},
      {name: "Too much tea/coffee", reason: "Stimulating"},
      {name: "Sour foods in excess", reason: "Increases intensity"},
      {name: "Fried foods", reason: "Heavy + heating"}
    ],
    
    benefits: [
      "Better digestion",
      "Less anger/irritability",
      "Better sleep",
      "Less skin issues",
      "More calm"
    ],
    
    // HIDDEN: What you know (for education later)
    ayurvedic: {
      rasa: "Sweet, Bitter (calming)",
      virya: "Cooling (reduces heat)",
      vipaka: "Sweet vipaka (grounding)",
      guna: "Light, Cold, Dry",
      why: "Pitta is fire element. Cooling foods bring balance."
    }
  },
  
  vata: {
    title: "Vata (Air Type)",
    description: "You are naturally light, mobile, and changeable",
    
    foods: [
      {name: "Sesame oil", emoji: "🌾"},
      {name: "Warm milk", emoji: "🥛"},
      {name: "Ghee", emoji: "🍶"},
      {name: "Dates", emoji: "📅"},
      {name: "Cooked vegetables", emoji: "🥬"},
      {name: "Rice", emoji: "🍚"},
      {name: "Lentils (mung)", emoji: "🫘"},
      {name: "Nuts", emoji: "🌰"},
      {name: "Ginger", emoji: "🌿"},
      {name: "Honey", emoji: "🍯"}
    ],
    
    avoid: [
      {name: "Raw foods", reason: "Too cold/dry"},
      {name: "Too many salads", reason: "Increases lightness"},
      {name: "Cold foods", reason: "Aggravates vata"},
      {name: "Caffeine", reason: "Increases anxiety"},
      {name: "Light meals", reason: "Need grounding"}
    ],
    
    benefits: [
      "Less anxiety",
      "Better focus",
      "Stable energy",
      "Better digestion",
      "Better sleep"
    ],
    
    ayurvedic: {
      rasa: "Sweet, Salty, Sour (grounding)",
      virya: "Warming (supports energy)",
      vipaka: "Sweet vipaka (nourishing)",
      guna: "Heavy, Warm, Wet",
      why: "Vata is air element. Grounding foods bring stability."
    }
  },
  
  kapha: {
    title: "Kapha (Water Type)",
    description: "You are naturally stable, calm, and steady",
    
    foods: [
      {name: "Ginger (fresh)", emoji: "🌿"},
      {name: "Black pepper", emoji: "🌶️"},
      {name: "Turmeric", emoji: "🌾"},
      {name: "Leafy greens", emoji: "🥬"},
      {name: "Honey", emoji: "🍯"},
      {name: "Mung beans", emoji: "🫘"},
      {name: "Barley", emoji: "🌾"},
      {name: "Apples", emoji: "🍎"},
      {name: "Pomegranate", emoji: "🍎"},
      {name: "Chili", emoji: "🌶️"}
    ],
    
    avoid: [
      {name: "Heavy foods", reason: "Increases heaviness"},
      {name: "Too much ghee", reason: "Too oily"},
      {name: "Cold foods", reason: "Slows digestion"},
      {name: "Sweets in excess", reason: "Increases sluggishness"},
      {name: "Dairy in excess", reason: "Too heavy"}
    ],
    
    benefits: [
      "More energy",
      "Better metabolism",
      "Better focus",
      "Less depression",
      "Better digestion"
    ],
    
    ayurvedic: {
      rasa: "Pungent, Bitter, Astringent (stimulating)",
      virya: "Heating (increases fire)",
      vipaka: "Pungent vipaka (stimulating)",
      guna: "Light, Hot, Dry",
      why: "Kapha is water element. Stimulating foods bring energy."
    }
  }
};

export const DOSHAS = ["pitta", "vata", "kapha"];