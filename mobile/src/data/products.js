export const products = [
  {
    // 🥛 EXCELLENT: Fage Total 0% Greek Yogurt - Real product
    id: 'fage-yogurt',
    name: "Total 0% Greek Yogurt",
    brand: "Fage",
    image: "https://images.unsplash.com/photo-1571212515416-87748d4f0b69?w=400&h=400&fit=crop&auto=format",
    score: 92,
    scoreLabel: "Excellent",
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669",
    gradientColors: ['#00E199', '#0FA483'],
    
    mainVerdict: {
      headline: "Excellent Choice",
      subline: "Clean label product with high nutritional value and no harmful additives"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
      { label: "SUGAR", value: "6g (natural)", icon: "🍬", type: "good" },
      { label: "PROCESSING", value: "NOVA 1", icon: "🏭", type: "good" },
      { label: "PROTEIN", value: "20g per 170g", icon: "💪", type: "good" }
    ],
    
    harmfulAdditives: [],
    
    ingredients: [
      { name: "Grade A Pasteurized Skimmed Milk", safe: true, desc: "Primary ingredient, sourced from grass-fed cows" },
      { name: "Live Active Yogurt Cultures", safe: true, desc: "L. bulgaricus, S. thermophilus - authentic Greek cultures" }
    ],
    
    scientificEvidence: [
      { title: "Greek Yogurt Protein Bioavailability", org: "Journal of Dairy Science, 2023" },
      { title: "Probiotic Strains and Gut Health", org: "Nature Reviews Gastroenterology, 2022" }
    ]
  },
  {
    // ⚠️ MODERATE: Kind Dark Chocolate Nuts & Sea Salt Bar - Real product
    id: 'kind-bar',
    name: "Dark Chocolate Nuts & Sea Salt",
    brand: "Kind",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop&auto=format",
    score: 67,
    scoreLabel: "Moderate",
    gradient: "from-amber-400 to-orange-500",
    color: "#d97706",
    gradientColors: ['#FCBE25', '#F87617'],
    
    mainVerdict: {
      headline: "Good Snack Choice",
      subline: "Whole nuts and minimal processing, but high calories"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "2 Detected", icon: "⚠️", type: "warning" },
      { label: "SUGAR", value: "5g per bar", icon: "🍬", type: "good" },
      { label: "PROCESSING", value: "NOVA 2", icon: "🏭", type: "good" },
      { label: "CALORIES", value: "200 per bar", icon: "🔥", type: "warning" }
    ],
    
    harmfulAdditives: [
      { name: "Natural Flavor", reason: "Undisclosed vanilla flavoring compounds" },
      { name: "Soy Lecithin", reason: "Emulsifier, may contain traces of hexane from processing" }
    ],
    
    ingredients: [
      { name: "Almonds", safe: true, desc: "26% - primary ingredient, good source of vitamin E" },
      { name: "Peanuts", safe: true, desc: "20% - protein and healthy fats" },
      { name: "Dark Chocolate", safe: true, desc: "15% - contains cocoa, sugar, cocoa butter" },
      { name: "Honey", safe: true, desc: "Natural sweetener and binding agent" },
      { name: "Sea Salt", safe: true, desc: "0.5% - flavor enhancer" },
      { name: "Natural Vanilla Flavor", safe: false, desc: "Proprietary flavoring blend" },
      { name: "Soy Lecithin", safe: false, desc: "Emulsifier from soy processing" }
    ],
    
    scientificEvidence: [
      { title: "Nuts and Cardiovascular Health", org: "New England Journal of Medicine, 2013" },
      { title: "Dark Chocolate Antioxidant Properties", org: "Journal of Nutrition, 2022" }
    ]
  },
  {
    // 🚨 POOR: Pop-Tarts Frosted Strawberry - Real product
    id: 'pop-tarts',
    name: "Frosted Strawberry Pop-Tarts",
    brand: "Kellogg's",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format",
    score: 18,
    scoreLabel: "Avoid",
    gradient: "from-rose-500 to-red-600",
    color: "#dc2626",
    gradientColors: ['#F65972', '#DC2728'],
    
    mainVerdict: {
      headline: "Ultra-Processed",
      subline: "High sugar, artificial dyes, trans fats, minimal nutrition"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "8 Detected", icon: "🚨", type: "danger" },
      { label: "SUGAR", value: "16g per pastry", icon: "🍬", type: "danger" },
      { label: "PROCESSING", value: "NOVA 4", icon: "🏭", type: "danger" },
      { label: "TRANS FAT", value: "0g (hidden)", icon: "🧈", type: "danger" }
    ],
    
    harmfulAdditives: [
      { name: "Red 40", reason: "Artificial dye linked to hyperactivity in children (FDA warning)" },
      { name: "Yellow 6", reason: "May cause allergic reactions, banned in Norway" },
      { name: "TBHQ (E319)", reason: "Petroleum-derived preservative, 5g can be lethal" },
      { name: "High Fructose Corn Syrup", reason: "Linked to obesity and metabolic syndrome" },
      { name: "Partially Hydrogenated Soybean Oil", reason: "Source of trans fats" },
      { name: "Sodium Stearoyl Lactylate", reason: "Synthetic emulsifier" },
      { name: "Natural & Artificial Strawberry Flavor", reason: "Contains dozens of synthetic compounds" },
      { name: "Gelatin", reason: "Animal-derived thickening agent" }
    ],
    
    ingredients: [
      { name: "Enriched Flour", safe: true, desc: "Bleached wheat flour with synthetic vitamins added back" },
      { name: "Corn Syrup", safe: false, desc: "16g sugar per pastry - 64% of daily limit" },
      { name: "High Fructose Corn Syrup", safe: false, desc: "Metabolized differently than regular sugar" },
      { name: "Dextrose", safe: false, desc: "Additional sugar source" },
      { name: "Soybean and Palm Oil", safe: false, desc: "May contain trans fats from processing" },
      { name: "Sugar", safe: false, desc: "Third sugar source in ingredient list" },
      { name: "Wheat Flour", safe: true, desc: "Additional flour for texture" },
      { name: "Salt", safe: true, desc: "230mg sodium per serving" },
      { name: "Dried Strawberries", safe: true, desc: "Less than 2% - minimal real fruit" },
      { name: "Red 40", safe: false, desc: "FD&C Red No. 40 - petroleum-derived dye" },
      { name: "Yellow 6", safe: false, desc: "Artificial coloring agent" },
      { name: "TBHQ", safe: false, desc: "Tertiary butylhydroquinone preservative" }
    ],
    
    scientificEvidence: [
      { title: "Ultra-processed Foods and Health Outcomes", org: "BMJ, 2019" },
      { title: "Artificial Food Dyes and Hyperactivity", org: "The Lancet, 2007" },
      { title: "High Fructose Corn Syrup vs. Sugar", org: "American Journal of Clinical Nutrition, 2008" }
    ]
  }
];