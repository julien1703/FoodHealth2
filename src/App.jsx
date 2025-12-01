import React, { useState } from 'react';
import { Search, Scan, ArrowLeft, Share2, AlertTriangle, ChevronDown, Check, Info } from 'lucide-react';

// Processing Slider - wie im Referenzbild
const ProcessingSlider = ({ score }) => {
  return (
    <div className="w-full mt-5 mb-2 px-2">
      <div className="flex justify-between text-xs font-bold text-white/80 mb-2 uppercase tracking-wide">
        <span>Ultra-Processed</span>
        <span>Natural</span>
      </div>
      <div className="h-2.5 bg-white/20 rounded-full relative">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-700 ease-out"
          style={{ left: `${score}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-2 h-2 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

const FoodSafetyApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const products = [
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
      
      mainVerdict: {
        headline: "Excellent Choice",
        subline: "Clean ingredients, 20g protein, authentic Greek yogurt"
      },
      
      quickFacts: [
        { label: "ADDITIVES", value: "0 Detected", icon: "🛡️", type: "good" },
        { label: "PROTEIN", value: "20g per 170g", icon: "💪", type: "good" },
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
    }
  ];

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    setExpandedSection(null);
  };

  const goBack = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  // ==================== HOME SCREEN ====================
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div className="bg-white px-6 pt-14 pb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Hello, User 👋</h1>
          <p className="text-gray-500 text-base">What are we eating today?</p>
          
          <div className="mt-6 bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-base outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400">⚡</span>
              <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">DAILY TIP</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Watch out for E171</h3>
            <p className="text-gray-400 text-sm">Titanium Dioxide is banned in Europe since 2022.</p>
          </div>
        </div>

        <div className="px-6 pb-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Scans</h2>
            <button className="text-gray-500 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {products.filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((product) => (
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

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button className="bg-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-transform">
            <Scan className="w-7 h-7" />
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
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* HERO HEADER - Farbiger Header wie im Referenzbild */}
      <div className={`relative bg-gradient-to-br ${product.gradient} text-white pt-12 pb-8 rounded-b-[2rem]`}>
        
        {/* Navigation */}
        <div className="px-5 flex justify-between items-center mb-6">
          <button onClick={goBack} className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Optimized Header Layout */}
        <div className="px-5">
          {/* Header: Product Name + Score Badge */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <h2 className="text-base font-medium text-white/80 mb-1">{product.brand}</h2>
              <h1 className="text-2xl font-black pr-4">{product.name}</h1>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 min-w-[80px]">
              <div className="text-center">
                <div className="text-white text-2xl font-black leading-none">{product.score}</div>
                <div className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">Score</div>
              </div>
            </div>
          </div>
          
          {/* Centered Product Image */}
          <div className="flex justify-center mb-5">
            <div className="w-32 h-32 bg-white rounded-3xl p-4 shadow-lg flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Verdict - Centered for visual balance */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold mb-2">{product.mainVerdict.headline}</h3>
            <p className="text-white/80 text-sm max-w-[280px] mx-auto leading-relaxed">
              {product.mainVerdict.subline}
            </p>
          </div>

          {/* Processing Slider */}
          <ProcessingSlider score={product.score} />
        </div>
      </div>

      {/* 4 QUICK STAT CARDS - 2x2 Grid */}
      <div className="px-5 -mt-5 grid grid-cols-2 gap-2.5 relative z-10">
        {product.quickFacts.map((fact, i) => {
          const style = typeStyles[fact.type];
          return (
            <div 
              key={i} 
              className={`bg-white p-3 rounded-2xl shadow-sm border ${style.border} flex flex-col items-center justify-center text-center min-h-[88px]`}
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4 text-left">
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
  );
};

export default FoodSafetyApp;
