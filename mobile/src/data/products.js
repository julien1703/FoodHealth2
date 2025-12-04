export const products = [
  {
    // 🥛 EXCELLENT: Fage Total 0% Greek Yogurt - Real product
    id: 'fage-yogurt',
    name: "Total 0% Greek Yogurt",
    brand: "Fage",
    image: "https://i5.walmartimages.com/seo/DANN-OIKOS-TZ-PLAIN-32OZ_d2bf48e3-1ee6-4dd2-8c91-b22292037728.ff3a1c0ba220f87c5bee5cefb3303b5c.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF",
    score: 85,
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
  },
  {
    id: 'apples',
    name: "Organic Gala Apples",
    brand: "Whole Foods",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&auto=format",
    score: 95,
    scoreLabel: "Excellent",
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669",
    gradientColors: ['#00E199', '#0FA483'],
    date: "Nov 28, 2024",
    
    mainVerdict: {
      headline: "Natural Superfood",
      subline: "Pure, organic fruit with no processing or additives"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
      { label: "SUGAR", value: "19g (natural)", icon: "🍬", type: "good" },
      { label: "PROCESSING", value: "NOVA 1", icon: "🏭", type: "good" },
      { label: "FIBER", value: "4.4g per apple", icon: "🌾", type: "good" }
    ],
    
    harmfulAdditives: [],
    
    ingredients: [
      { name: "Organic Apple", safe: true, desc: "100% pure organic apple, no additives" }
    ],
    
    scientificEvidence: [
      { title: "Apple Consumption and Health Benefits", org: "Nutrients, 2023" }
    ]
  },
  {
    id: 'granola',
    name: "Honey Almond Granola",
    brand: "Nature Valley",
    image: "https://images.unsplash.com/photo-1571197829717-0ca3207a2f0d?w=400&h=400&fit=crop&auto=format",
    score: 55,
    scoreLabel: "Moderate",
    gradient: "from-amber-400 to-orange-500",
    color: "#d97706",
    gradientColors: ['#FCBE25', '#F87617'],
    date: "Nov 27, 2024",
    
    mainVerdict: {
      headline: "Moderately Processed",
      subline: "Good ingredients but high in added sugars and calories"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "3 Detected", icon: "⚠️", type: "warning" },
      { label: "SUGAR", value: "12g per serving", icon: "🍬", type: "warning" },
      { label: "PROCESSING", value: "NOVA 3", icon: "🏭", type: "warning" },
      { label: "CALORIES", value: "190 per serving", icon: "🔥", type: "warning" }
    ],
    
    harmfulAdditives: [
      { name: "Natural Flavor", reason: "Undisclosed flavoring compounds" },
      { name: "Canola Oil", reason: "Highly processed vegetable oil" }
    ],
    
    ingredients: [
      { name: "Whole Grain Oats", safe: true, desc: "Good source of fiber" },
      { name: "Sugar", safe: false, desc: "Added refined sugar" },
      { name: "Almonds", safe: true, desc: "Healthy nuts and fats" },
      { name: "Honey", safe: true, desc: "Natural sweetener" }
    ],
    
    scientificEvidence: [
      { title: "Oats and Heart Health", org: "American Journal of Clinical Nutrition, 2022" }
    ]
  },
  {
    id: 'chips',
    name: "Classic Potato Chips",
    brand: "Lay's",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format",
    score: 25,
    scoreLabel: "Poor",
    gradient: "from-rose-500 to-red-600",
    color: "#dc2626",
    gradientColors: ['#F65972', '#DC2728'],
    date: "Nov 26, 2024",
    
    mainVerdict: {
      headline: "Ultra-Processed Snack",
      subline: "High in salt, unhealthy oils, and artificial additives"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "5 Detected", icon: "🚨", type: "danger" },
      { label: "SODIUM", value: "170mg per serving", icon: "🧂", type: "danger" },
      { label: "PROCESSING", value: "NOVA 4", icon: "🏭", type: "danger" },
      { label: "FAT", value: "10g per serving", icon: "🧈", type: "danger" }
    ],
    
    harmfulAdditives: [
      { name: "Natural Flavor", reason: "Artificial taste enhancers" },
      { name: "Vegetable Oil", reason: "High omega-6 inflammatory oils" }
    ],
    
    ingredients: [
      { name: "Potatoes", safe: true, desc: "Base ingredient" },
      { name: "Vegetable Oil", safe: false, desc: "Sunflower, corn, and/or canola oil" },
      { name: "Salt", safe: false, desc: "High sodium content" }
    ],
    
    scientificEvidence: [
      { title: "Ultra-processed Snacks and Health", org: "Public Health Nutrition, 2021" }
    ]
  },
  {
    id: 'quinoa',
    name: "Organic Tri-Color Quinoa",
    brand: "Bob's Red Mill",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format",
    score: 88,
    scoreLabel: "Excellent",
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669",
    gradientColors: ['#00E199', '#0FA483'],
    date: "Nov 25, 2024",
    
    mainVerdict: {
      headline: "Superfood Grain",
      subline: "Complete protein, organic, minimally processed"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
      { label: "PROTEIN", value: "8g per serving", icon: "💪", type: "good" },
      { label: "PROCESSING", value: "NOVA 1", icon: "🏭", type: "good" },
      { label: "FIBER", value: "5g per serving", icon: "🌾", type: "good" }
    ],
    
    harmfulAdditives: [],
    
    ingredients: [
      { name: "Organic Quinoa", safe: true, desc: "100% pure organic quinoa" }
    ],
    
    scientificEvidence: [
      { title: "Quinoa Nutritional Profile", org: "Food Chemistry, 2023" }
    ]
  },
  {
    id: 'cereal',
    name: "Frosted Flakes Cereal",
    brand: "Kellogg's",
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=400&fit=crop&auto=format",
    score: 12,
    scoreLabel: "Avoid",
    gradient: "from-rose-500 to-red-600",
    color: "#dc2626",
    gradientColors: ['#F65972', '#DC2728'],
    date: "Nov 24, 2024",
    
    mainVerdict: {
      headline: "Sugar Breakfast",
      subline: "Ultra-processed with excessive sugar and artificial additives"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "12 Detected", icon: "🚨", type: "danger" },
      { label: "SUGAR", value: "12g per serving", icon: "🍬", type: "danger" },
      { label: "PROCESSING", value: "NOVA 4", icon: "🏭", type: "danger" },
      { label: "SODIUM", value: "140mg per serving", icon: "🧂", type: "danger" }
    ],
    
    harmfulAdditives: [
      { name: "High Fructose Corn Syrup", reason: "Linked to metabolic issues" },
      { name: "BHT", reason: "Petroleum-derived preservative" },
      { name: "Yellow 6", reason: "Artificial food dye" }
    ],
    
    ingredients: [
      { name: "Milled Corn", safe: true, desc: "Base grain ingredient" },
      { name: "Sugar", safe: false, desc: "12g added sugar per serving" },
      { name: "High Fructose Corn Syrup", safe: false, desc: "Additional sweetener" },
      { name: "Salt", safe: false, desc: "140mg sodium" }
    ],
    
    scientificEvidence: [
      { title: "Breakfast Cereals and Child Nutrition", org: "Pediatrics, 2022" }
    ]
  },
  {
    id: 'nuts',
    name: "Mixed Raw Almonds",
    brand: "Blue Diamond",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop&auto=format",
    score: 82,
    scoreLabel: "Good",
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669",
    gradientColors: ['#00E199', '#0FA483'],
    date: "Nov 23, 2024",
    
    mainVerdict: {
      headline: "Healthy Snack",
      subline: "Raw nuts with healthy fats and protein, minimally processed"
    },
    
    quickFacts: [
      { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
      { label: "PROTEIN", value: "6g per serving", icon: "💪", type: "good" },
      { label: "PROCESSING", value: "NOVA 1", icon: "🏭", type: "good" },
      { label: "HEALTHY FATS", value: "14g per serving", icon: "🥜", type: "good" }
    ],
    
    harmfulAdditives: [],
    
    ingredients: [
      { name: "Raw Almonds", safe: true, desc: "100% pure raw almonds, no additives" }
    ],
    
    scientificEvidence: [
      { title: "Almonds and Heart Health", org: "Circulation, 2023" }
    ]
  }
];


