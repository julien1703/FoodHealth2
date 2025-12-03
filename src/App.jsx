import React, { useState, useEffect } from 'react';
import { Search, Scan, ArrowLeft, Share2, AlertTriangle, ChevronDown, Check, Info } from 'lucide-react';



// Processing Slider - wie im Referenzbild
const ProcessingSlider = ({ score }) => {
  // Dynamische Farbe für den inneren Kreis basierend auf Score
  const getInnerCircleColor = (score) => {
    if (score >= 70) {
      return '#00E199'; // Grün für gute Produkte
    } else if (score >= 40) {
      return '#FCBE25'; // Orange für mittlere Produkte  
    } else {
      return '#F65972'; // Rot für schlechte Produkte
    }
  };

  return (
    <div className="w-full mt-5 mb-2 px-2">
      <div className="flex justify-between text-xs font-bold text-white/80 mb-2 uppercase tracking-wide">
        <span>Ultra-Processed</span>
        <span>Natural</span>
      </div>
      <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full relative border border-white/10">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-xl flex items-center justify-center transition-all duration-700 ease-out"
          style={{ left: `${score}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div 
            className="w-2.5 h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ backgroundColor: getInnerCircleColor(score) }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const FoodSafetyApp = () => {
  const [currentView, setCurrentView] = useState('scan'); // Startseite ist jetzt Scan
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [healthFilter, setHealthFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Kamera initialisieren
  useEffect(() => {
    const initCamera = async () => {
      if (currentView !== 'home') return;
      
      try {
        const video = document.getElementById('camera-feed');
        const fallback = document.getElementById('fallback-image');
        
        if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment', // Rückkamera bevorzugen
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          video.srcObject = stream;
          video.style.display = 'block';
          if (fallback) fallback.style.display = 'none';
        } else {
          throw new Error('Camera not supported');
        }
      } catch (error) {
        console.log('Camera access failed, using fallback image:', error);
        const video = document.getElementById('camera-feed');
        const fallback = document.getElementById('fallback-image');
        if (video && fallback) {
          video.style.display = 'none';
          fallback.style.display = 'block';
          fallback.classList.remove('hidden');
        }
      }
    };

    // Kleine Verzögerung für DOM-Rendering
    const timer = setTimeout(initCamera, 100);
    return () => clearTimeout(timer);
  }, [currentView]);

  // Dynamische Gradient-Farben basierend auf Produktscore
  const getGradientColors = (score) => {
    if (score >= 70) {
      return 'from-[#00E199] to-[#0FA483]'; // Grün für gute Produkte
    } else if (score >= 40) {
      return 'from-[#FCBE25] to-[#F87617]'; // Orange für mittlere Produkte
    } else {
      return 'from-[#F65972] to-[#DC2728]'; // Rot für schlechte Produkte
    }
  };

  const products = [
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
      
      mainVerdict: {
        headline: "Excellent Choice",
        subline: "Clean ingredients, 18g protein, authentic Greek yogurt"
      },
      
      quickFacts: [
        { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
        { label: "PROTEIN", value: "18g per 170g", icon: "💪", type: "good" },
        { label: "PROCESSING", value: "NOVA 1", icon: "🏭", type: "good" },
        { label: "SUGAR", value: "6g (natural)", icon: "🍬", type: "good" }
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
      date: "Nov 28, 2024"
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
      date: "Nov 27, 2024"
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
      date: "Nov 26, 2024"
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
      date: "Nov 25, 2024"
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
      date: "Nov 24, 2024"
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
      date: "Nov 23, 2024"
    }
  ];

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    setExpandedSection(null);
  };

  const goBack = () => {
    setCurrentView('scan'); // Zurück zur Scan-Seite
    setSelectedProduct(null);
  };

  // ==================== SCAN SCREEN (Startseite) ====================
  if (currentView === 'scan') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div className="bg-white px-6 pt-14 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black">Hello, Julien</h1>
              <p className="text-gray-400 text-sm mt-1">What are we shopping today ?</p>
            </div>
            <button className="text-gray-800 text-xl mt-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Camera Scan Area */}
          <div className="w-full relative rounded-2xl overflow-hidden shadow-sm mb-3 group cursor-pointer">
            <video 
              id="camera-feed"
              className="w-full h-48 object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Fallback image if camera fails */}
            <img 
              id="fallback-image"
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-48 object-cover opacity-90 hidden" 
              alt="Shelf"
            />
            
            {/* Scan Corners */}
            <div className="absolute top-5 left-5 w-10 h-10 border-white border-t-4 border-l-4 rounded-tl"></div>
            <div className="absolute top-5 right-5 w-10 h-10 border-white border-t-4 border-r-4 rounded-tr"></div>
            <div className="absolute bottom-5 left-5 w-10 h-10 border-white border-b-4 border-l-4 rounded-bl"></div>
            <div className="absolute bottom-5 right-5 w-10 h-10 border-white border-b-4 border-r-4 rounded-br"></div>
            
            {/* Camera Status Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
          <p className="text-center text-black font-medium mb-8">Scan a Barcode</p>
        </div>

        <div className="px-6 pt-6 pb-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Scans</h2>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
              >
                <span>
                  {healthFilter === 'all' ? 'All Scans' : 
                   healthFilter === 'good' ? 'Good Only' :
                   healthFilter === 'moderate' ? 'Moderate Only' : 'Poor Only'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px] z-10">
                  <button
                    onClick={() => {
                      setHealthFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      healthFilter === 'all' ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    All Scans
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('good');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'good' ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Good Only
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('moderate');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'moderate' ? 'text-amber-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Moderate Only
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('poor');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'poor' ? 'text-red-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Poor Only
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {products.filter(p => {
              // Text search filter
              const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  p.brand.toLowerCase().includes(searchQuery.toLowerCase());
              
              // Health filter
              const matchesHealthFilter = healthFilter === 'all' || 
                                        (healthFilter === 'good' && p.score >= 70) ||
                                        (healthFilter === 'moderate' && p.score >= 40 && p.score < 70) ||
                                        (healthFilter === 'poor' && p.score < 40);
              
              return matchesSearch && matchesHealthFilter;
            }).slice(0, 3).map((product) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-bold text-gray-900 text-base truncate">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: product.color }}
                >
                  <span className="text-white font-black text-sm">{product.score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-8 left-0 w-full px-8 flex justify-between items-center z-50">
          {/* Left Side: Saved + Search */}
          <div className="bg-gray-200 rounded-full h-14 px-4 flex items-center gap-3 shadow-md">
            {/* Saved Button */}
            <button 
              onClick={() => setCurrentView('home')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'home' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              {currentView === 'home' && (
                <span className="text-sm font-medium whitespace-nowrap">Saved</span>
              )}
            </button>
            
            {/* Search Button */}
            <button 
              onClick={() => setCurrentView('search')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'search' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <Search className="w-5 h-5" />
              {currentView === 'search' && (
                <span className="text-sm font-medium whitespace-nowrap">Search</span>
              )}
            </button>
          </div>
          
          {/* Right Side: Scan Button */}
          <button 
            onClick={() => setCurrentView('scan')}
            className={`h-14 rounded-full flex items-center gap-2 shadow-md transition-all duration-300 ${
              currentView === 'scan' 
                ? 'bg-green-600 text-white px-6' 
                : 'bg-gray-200 text-gray-600 px-4 hover:bg-gray-300'
            }`}
          >
            <Scan className="w-5 h-5" />
            {currentView === 'scan' && (
              <span className="text-sm font-medium whitespace-nowrap">Scan</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==================== SEARCH SCREEN ====================
  if (currentView === 'search') {
    const stores = [
      { name: 'Safeway', logo: '🏪', color: 'bg-red-500' },
      { name: 'Costco', logo: '🏬', color: 'bg-blue-500' },
      { name: 'Sprouts Farmers Market', logo: '🌿', color: 'bg-green-600' },
      { name: 'Rainbow Grocery', logo: '🌈', color: 'bg-green-700' },
      { name: 'Walgreens', logo: '💊', color: 'bg-red-600' },
      { name: 'Woodlands', logo: '🌳', color: 'bg-green-500' },
      { name: 'Mollie Stone\'s', logo: '🏪', color: 'bg-black' },
      { name: 'Show all', logo: '→', color: 'bg-gray-400', special: true, count: '69 stores' }
    ];

    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        {/* Header */}
        <div className="bg-white px-6 pt-14 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-black">chec</span>
              <span className="text-2xl font-bold text-green-600">K</span>
              <span className="text-2xl font-bold text-black">it</span>
            </div>
            <button className="text-gray-800 text-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products and stores"
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-12 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-lg font-medium">94105</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="px-6 pt-6 pb-6">
          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-white text-gray-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center" 
                  alt="All Stores" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">All Stores</div>
                <div className="text-xs text-gray-500">69 nearby</div>
              </div>
            </button>
            <button className="flex-1 bg-white text-gray-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center" 
                  alt="Popular" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Popular</div>
                <div className="text-xs text-gray-500">Top picks</div>
              </div>
            </button>
          </div>
          
          {/* Top Stores Carousel */}
          <h3 className="text-lg font-bold text-black mb-4">Popular Stores</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button className="min-w-[120px] bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=60&h=60&fit=crop&crop=center" 
                  alt="Safeway" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs">Safeway</div>
                <div className="text-xs text-gray-500">2.1 mi</div>
              </div>
            </button>
            <button className="min-w-[120px] bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop&crop=center" 
                  alt="Costco" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs">Costco</div>
                <div className="text-xs text-gray-500">3.2 mi</div>
              </div>
            </button>
            <button className="min-w-[120px] bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&crop=center" 
                  alt="Sprouts" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs">Sprouts</div>
                <div className="text-xs text-gray-500">1.8 mi</div>
              </div>
            </button>
            <button className="min-w-[120px] bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=60&h=60&fit=crop&crop=center" 
                  alt="Rainbow Grocery" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs">Rainbow</div>
                <div className="text-xs text-gray-500">2.5 mi</div>
              </div>
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="px-6 pb-32">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Browse Categories</h3>
            <button className="text-sm text-green-600 font-medium">See all</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Drinks */}
            <button className="min-w-[280px] h-24 bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=60&h=60&fit=crop&crop=center" 
                  alt="Drinks" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-gray-900 text-base">Drinks & Beverages</div>
                <div className="text-sm text-gray-500 mb-1">Energy drinks, Soft drinks</div>
                <div className="text-xs text-gray-400">124 products</div>
              </div>
            </button>

            {/* Snacks */}
            <button className="min-w-[280px] h-24 bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=60&h=60&fit=crop&crop=center" 
                  alt="Snacks" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-gray-900 text-base">Snacks & Treats</div>
                <div className="text-sm text-gray-500 mb-1">Chocolate, Chips, Cookies</div>
                <div className="text-xs text-gray-400">89 products</div>
              </div>
            </button>

            {/* Packaged Foods */}
            <button className="min-w-[280px] h-24 bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=60&h=60&fit=crop&crop=center" 
                  alt="Packaged" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-gray-900 text-base">Packaged Foods</div>
                <div className="text-sm text-gray-500 mb-1">Canned, Frozen, Seafood</div>
                <div className="text-xs text-gray-400">156 products</div>
              </div>
            </button>

            {/* Dairy */}
            <button className="min-w-[280px] h-24 bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=60&h=60&fit=crop&crop=center" 
                  alt="Dairy" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-gray-900 text-base">Dairy Products</div>
                <div className="text-sm text-gray-500 mb-1">Milk, Yogurt, Cheese</div>
                <div className="text-xs text-gray-400">73 products</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-8 left-0 w-full px-8 flex justify-between items-center z-50">
          {/* Left Side: Saved + Search */}
          <div className="bg-gray-200 rounded-full h-14 px-4 flex items-center gap-3 shadow-md">
            {/* Saved Button */}
            <button 
              onClick={() => setCurrentView('home')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'home' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              {currentView === 'home' && (
                <span className="text-sm font-medium whitespace-nowrap">Saved</span>
              )}
            </button>
            
            {/* Search Button */}
            <button 
              onClick={() => setCurrentView('search')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'search' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <Search className="w-5 h-5" />
              {currentView === 'search' && (
                <span className="text-sm font-medium whitespace-nowrap">Search</span>
              )}
            </button>
          </div>
          
          {/* Right Side: Scan Button */}
          <button 
            onClick={() => setCurrentView('scan')}
            className={`h-14 rounded-full flex items-center gap-2 shadow-md transition-all duration-300 ${
              currentView === 'scan' 
                ? 'bg-green-600 text-white px-6' 
                : 'bg-gray-200 text-gray-600 px-4 hover:bg-gray-300'
            }`}
          >
            <Scan className="w-5 h-5" />
            {currentView === 'scan' && (
              <span className="text-sm font-medium whitespace-nowrap">Scan</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==================== HOME SCREEN (Gespeicherte Produkte) ====================
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        {/* Header */}
        <div className="bg-white px-6 pt-14 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black">My Products</h1>
              <p className="text-gray-400 text-sm mt-1">Your saved food analysis</p>
            </div>
            <button className="text-gray-800 text-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="px-6 pt-6 pb-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Saved Products</h2>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
              >
                <span>
                  {healthFilter === 'all' ? 'All Products' : 
                   healthFilter === 'good' ? 'Good Only' :
                   healthFilter === 'moderate' ? 'Moderate Only' : 'Poor Only'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px] z-10">
                  <button
                    onClick={() => {
                      setHealthFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      healthFilter === 'all' ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('good');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'good' ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Good Only
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('moderate');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'moderate' ? 'text-amber-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Moderate Only
                  </button>
                  <button
                    onClick={() => {
                      setHealthFilter('poor');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                      healthFilter === 'poor' ? 'text-red-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Poor Only
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Health Progress Bar */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            {(() => {
              const goodCount = products.filter(p => p.score >= 70).length;
              const moderateCount = products.filter(p => p.score >= 40 && p.score < 70).length;
              const poorCount = products.filter(p => p.score < 40).length;
              const total = products.length;
              
              if (total === 0) return null;
              
              const goodPercent = (goodCount / total) * 100;
              const moderatePercent = (moderateCount / total) * 100;
              const poorPercent = (poorCount / total) * 100;
              
              return (
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    {goodCount > 0 && (
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${goodPercent}%` }}
                      ></div>
                    )}
                    {moderateCount > 0 && (
                      <div 
                        className="h-full bg-amber-500 transition-all duration-500" 
                        style={{ width: `${moderatePercent}%` }}
                      ></div>
                    )}
                    {poorCount > 0 && (
                      <div 
                        className="h-full bg-red-500 transition-all duration-500" 
                        style={{ width: `${poorPercent}%` }}
                      ></div>
                    )}
                  </div>
                  
                  {/* Clickable Labels with Counts */}
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setHealthFilter(healthFilter === 'good' ? 'all' : 'good')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        healthFilter === 'good' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{goodCount} Good</span>
                    </button>
                    
                    <button 
                      onClick={() => setHealthFilter(healthFilter === 'moderate' ? 'all' : 'moderate')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        healthFilter === 'moderate' 
                          ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>{moderateCount} Moderate</span>
                    </button>
                    
                    <button 
                      onClick={() => setHealthFilter(healthFilter === 'poor' ? 'all' : 'poor')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        healthFilter === 'poor' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{poorCount} Poor</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="space-y-3">
            {products.filter(p => {
              // Text search filter
              const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  p.brand.toLowerCase().includes(searchQuery.toLowerCase());
              
              // Health filter
              const matchesHealthFilter = healthFilter === 'all' || 
                                        (healthFilter === 'good' && p.score >= 70) ||
                                        (healthFilter === 'moderate' && p.score >= 40 && p.score < 70) ||
                                        (healthFilter === 'poor' && p.score < 40);
              
              return matchesSearch && matchesHealthFilter;
            }).map((product) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center p-2">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-bold text-gray-900 text-base truncate">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: product.color }}
                >
                  <span className="text-white font-black text-sm">{product.score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-8 left-0 w-full px-8 flex justify-between items-center z-50">
          {/* Left Side: Saved + Search */}
          <div className="bg-gray-200 rounded-full h-14 px-4 flex items-center gap-3 shadow-md">
            {/* Saved Button */}
            <button 
              onClick={() => setCurrentView('home')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'home' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              {currentView === 'home' && (
                <span className="text-sm font-medium whitespace-nowrap">Saved</span>
              )}
            </button>
            
            {/* Search Button */}
            <button 
              onClick={() => setCurrentView('search')}
              className={`h-10 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'search' 
                  ? 'bg-green-600 text-white px-4' 
                  : 'text-gray-400 px-2 hover:text-gray-600'
              }`}
            >
              <Search className="w-5 h-5" />
              {currentView === 'search' && (
                <span className="text-sm font-medium whitespace-nowrap">Search</span>
              )}
            </button>
          </div>
          
          {/* Right Side: Scan Button */}
          <button 
            onClick={() => setCurrentView('scan')}
            className={`h-14 rounded-full flex items-center gap-2 shadow-md transition-all duration-300 ${
              currentView === 'scan' 
                ? 'bg-green-600 text-white px-6' 
                : 'bg-gray-200 text-gray-600 px-4 hover:bg-gray-300'
            }`}
          >
            <Scan className="w-5 h-5" />
            {currentView === 'scan' && (
              <span className="text-sm font-medium whitespace-nowrap">Scan</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==================== PRODUCT DETAIL SCREEN ====================
  const product = selectedProduct;
  
  const typeStyles = {
    good: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    danger: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- TOP SECTION (Dynamic Gradient) --- */}
      <div className={`bg-gradient-to-br ${getGradientColors(product.score)} pb-8 pt-6 px-6 text-white shadow-lg relative z-10`}>
        
        {/* Header: Back Button - Glasmorphism */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={goBack} className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg">
            <ArrowLeft size={20} color="white" />
          </button>
        </div>

        {/* Product Image Card */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-[30px] p-6 shadow-xl w-48 h-48 flex items-center justify-center relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-32 h-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Product Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            {product.mainVerdict.subline}
          </p>
        </div>

        {/* Slider / Meter */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium mb-2 text-white/90">
            <span>Ultra-processed</span>
            <span>Natural</span>
          </div>
          {/* Custom Range Track - Glasmorphism */}
          <div className="h-3 w-full bg-white/20 rounded-full relative" style={{ border: '1px solid #F4F5F7' }}>
            <div className="absolute top-0 left-0 h-full bg-white/30 backdrop-blur-sm rounded-full" style={{width: `${product.score}%`}}></div>
            {/* The Thumb/Knob - Glasmorphism */}
            <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg z-10 flex items-center justify-center" style={{left: `${product.score}%`, transform: 'translate(-50%, -50%)', border: '1px solid #F4F5F7'}}>
              <div 
                className="w-2.5 h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{
                  backgroundColor: product.score >= 70 ? '#00E199' : product.score >= 40 ? '#FCBE25' : '#F65972'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-semibold">{product.mainVerdict.headline}</span>
          <span className="text-4xl font-bold">{product.score}</span>
        </div>
      </div>

      {/* --- BOTTOM SECTION (White/Grey Content) --- */}
      <div className="px-5 -mt-6 pb-10 relative z-20">
        
        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {product.quickFacts.map((fact, i) => {
            const style = typeStyles[fact.type];
            return (
              <div 
                key={i} 
                className="bg-white p-3 rounded-2xl shadow-sm border flex flex-col items-center justify-center text-center min-h-[88px]"
                style={{ borderColor: '#F4F5F7' }}
              >
                <span className="text-lg mb-1">{fact.icon}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{fact.label}</span>
                <span className={`font-bold text-xs mt-0.5 ${style.text}`}>{fact.value}</span>
              </div>
            );
          })}
        </div>

        {/* DETAILED ANALYSIS SECTION */}
        <div className="px-5 mt-6 space-y-3 pb-8">
          <h3 className="font-bold text-gray-900 text-base mb-3">Detailed Analysis</h3>

        {/* Harmful Additives Accordion */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#F4F5F7' }}>
            <button 
              onClick={() => toggleSection('additives')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  product.harmfulAdditives.length > 0 ? 'bg-red-50' : 'bg-emerald-50'
                }`}>
                  {product.harmfulAdditives.length > 0 
                    ? <AlertTriangle className="w-5 h-5 text-red-500" />
                    : <Check className="w-5 h-5 text-emerald-500" />
                  }
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Additives</div>
                  <div className="text-xs text-gray-500">
                    {product.harmfulAdditives.length === 0 
                      ? "No harmful additives" 
                      : `${product.harmfulAdditives.length} to avoid`}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expandedSection === 'additives' ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSection === 'additives' && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                {product.harmfulAdditives.length === 0 ? (
                  <div className="text-sm text-emerald-600 flex items-center gap-2 bg-emerald-50 p-3 rounded-xl">
                    <Check className="w-4 h-4" />
                    Clean label - no harmful additives detected
                  </div>
                ) : (
                  <div className="space-y-2">
                    {product.harmfulAdditives.map((a, i) => (
                      <div key={i} className="bg-red-50 p-3 rounded-xl">
                        <div className="font-bold text-red-800 text-sm">{a.name}</div>
                        <div className="text-xs text-red-600 mt-0.5">{a.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        {/* Ingredients Accordion - Ausführliche Liste */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#F4F5F7' }}>
            <button 
              onClick={() => toggleSection('ingredients')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">{product.ingredients.length}</span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Ingredients</div>
                  <div className="text-xs text-gray-500">Full analysis & nutritional breakdown</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expandedSection === 'ingredients' ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSection === 'ingredients' && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                {/* Info Box für Power-User */}
                <div className="bg-blue-50 p-3 rounded-xl mb-3 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <div className="font-bold mb-1">💡 Expert Tip</div>
                      Ingredients are listed by weight (heaviest first). The first 3 ingredients make up ~70% of the product.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {product.ingredients.map((ing, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        ing.safe ? 'bg-gray-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ing.safe ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs text-gray-400 font-mono mt-1">#{i + 1}</span>
                        </div>
                        <div>
                          <span className={`font-medium text-sm ${ing.safe ? 'text-gray-900' : 'text-red-900'}`}>
                            {ing.name}
                          </span>
                          {ing.desc && (
                            <div className={`text-xs ${ing.safe ? 'text-gray-500' : 'text-red-600'}`}>
                              {ing.desc}
                            </div>
                          )}
                        </div>
                      </div>
                      {ing.safe ? (
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        {/* Scientific Evidence Accordion für Power-User */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#F4F5F7' }}>
            <button 
              onClick={() => toggleSection('evidence')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Scientific Evidence</div>
                  <div className="text-xs text-gray-500">Research studies & health data</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expandedSection === 'evidence' ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSection === 'evidence' && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                <div className="space-y-3">
                  {product.scientificEvidence.map((study, i) => (
                    <div key={i} className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <div className="font-bold text-purple-900 text-sm">{study.title}</div>
                      <div className="text-xs text-purple-700 mt-1">{study.org}</div>
                    </div>
                  ))}
                  
                  {/* Zusätzliche Power-User Infos */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-900 text-sm mb-2">📊 Data Sources</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• FDA GRAS Database (Generally Recognized as Safe)</div>
                      <div>• EFSA Scientific Opinions (European Food Safety Authority)</div>
                      <div>• WHO/FAO Joint Expert Committee evaluations</div>
                      <div>• Peer-reviewed nutritional studies (PubMed indexed)</div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <div className="font-bold text-amber-900 text-sm mb-1">⚖️ Regulatory Status</div>
                    <div className="text-xs text-amber-700">
                      This product meets FDA standards but contains ingredients under review by EFSA for potential health impacts.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* How we calculate link */}
          <div className="text-center pt-4">
            <button 
              onClick={() => toggleSection('methodology')}
              className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2 w-full hover:text-gray-600 transition"
            >
              <Info className="w-4 h-4" />
              How we calculate this score
            </button>
            
            {expandedSection === 'methodology' && (
              <div className="mt-4 bg-white rounded-2xl border p-4 text-left" style={{ borderColor: '#F4F5F7' }}>
                <div className="space-y-3">
                  <div className="font-bold text-gray-900 text-sm">🧮 Scoring Methodology</div>
                  
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <div className="font-bold text-blue-900 text-xs mb-1">NOVA Classification (40% weight)</div>
                    <div className="text-xs text-blue-700">
                      • NOVA 1 (Unprocessed): 90-100 points<br/>
                      • NOVA 2 (Processed culinary): 70-89 points<br/>
                      • NOVA 3 (Processed foods): 40-69 points<br/>
                      • NOVA 4 (Ultra-processed): 0-39 points
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-xl">
                    <div className="font-bold text-green-900 text-xs mb-1">Additives Assessment (35% weight)</div>
                    <div className="text-xs text-green-700">
                      Deductions based on: Artificial colors (-10), Preservatives (-5), Flavor enhancers (-8), Banned substances (-25)
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <div className="font-bold text-orange-900 text-xs mb-1">Nutritional Profile (25% weight)</div>
                    <div className="text-xs text-orange-700">
                      Sugar, sodium, saturated fat content vs WHO daily recommendations
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSafetyApp;