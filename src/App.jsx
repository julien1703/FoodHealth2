import React, { useState } from 'react';
import { Search, Scan, ArrowLeft, Share2, ChevronDown, ChevronRight, AlertTriangle, Factory, Wheat, Droplet } from 'lucide-react';

const FoodSafetyApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (id) => {
    setExpandedSections(prev => ({...prev, [id]: !prev[id]}));
  };

  // PRODUCT DATABASE
  const products = [
    {
      id: 'yogurt',
      name: "Organic Greek Yogurt",
      brand: "Pure Valley Farms",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      score: 87,
      scoreLabel: "Excellent",
      scoreColor: "#10b981",
      badges: ["USDA Organic", "Non-GMO"],
      
      overview: {
        additives: {
          count: 0,
          list: []
        },
        processing: {
          nova: 2,
          text: "Minimal processing with traditional fermentation methods"
        },
        allergens: ["Milk"],
        nutritionalConcerns: [
          { label: "Sugar", value: "6g per serving", note: "Naturally occurring lactose" },
          { label: "Sodium", value: "75mg per serving", note: "Low sodium content" }
        ]
      },

      ingredients: {
        total: 3,
        breakdown: { excellent: 3, good: 0, moderate: 0, poor: 0 },
        list: [
          { 
            name: "Organic Whole Milk", 
            status: "excellent",
            description: "From grass-fed cows, rich in omega-3 fatty acids"
          },
          { 
            name: "Live Active Cultures", 
            status: "excellent",
            description: "Probiotics for digestive health (L. bulgaricus, S. thermophilus)"
          },
          { 
            name: "Natural Cream", 
            status: "excellent",
            description: "Unprocessed dairy cream for texture"
          }
        ]
      },

      details: {
        howItsMade: "Traditional fermentation process with minimal industrial intervention. Milk is cultured with live bacteria and strained to create thick texture.",
        scientificEvidence: [
          "USDA Organic Certification Standards (2023)",
          "Probiotic Health Benefits Research (NIH)"
        ],
        novaInfo: "NOVA 2 classification indicates minimal processing with added culinary ingredients like salt or sugar, but no ultra-processed additives."
      }
    },
    {
      id: 'granola',
      name: "Honey Almond Granola",
      brand: "Nature's Harvest",
      image: "https://images.unsplash.com/photo-1625869016774-3ba4a083dcc4?w=400",
      score: 62,
      scoreLabel: "Moderate",
      scoreColor: "#f59e0b",
      badges: ["Gluten-Free"],
      
      overview: {
        additives: {
          count: 1,
          list: [
            { name: "Natural Flavor", reason: "Proprietary blend - ingredients undisclosed" }
          ]
        },
        processing: {
          nova: 3,
          text: "Moderate industrial processing with added ingredients"
        },
        allergens: ["Almonds", "Tree Nuts"],
        nutritionalConcerns: [
          { label: "Sugar", value: "12g per serving", note: "Combined from honey and brown sugar - moderate amount" },
          { label: "Sodium", value: "85mg per serving", note: "Low sodium content" }
        ]
      },

      ingredients: {
        total: 6,
        breakdown: { excellent: 2, good: 2, moderate: 2, poor: 0 },
        list: [
          { name: "Whole Grain Oats", status: "excellent", description: "High in fiber and essential nutrients" },
          { name: "Honey", status: "moderate", description: "Natural sweetener - 8g sugar per serving" },
          { name: "Almonds", status: "excellent", description: "Heart-healthy fats and protein" },
          { name: "Coconut Oil", status: "moderate", description: "High in saturated fat" },
          { name: "Brown Sugar", status: "moderate", description: "Added sweetener - 4g per serving" },
          { name: "Natural Flavor", status: "good", description: "Proprietary flavoring blend" }
        ]
      },

      details: {
        howItsMade: "Oats are mixed with honey, oils, and sweeteners, then baked at controlled temperatures. Natural flavoring is added post-baking.",
        scientificEvidence: [
          "Whole Grain Health Benefits (Harvard T.H. Chan)",
          "Natural vs Added Sugars Research (AHA)"
        ],
        novaInfo: "NOVA 3 classification means processed foods with added ingredients like sugar, oils, and preservatives, but not ultra-processed."
      }
    },
    {
      id: 'cereal',
      name: "Rainbow Crunch Cereal",
      brand: "Sugar Rush Co.",
      image: "https://images.unsplash.com/photo-1590137876181-4ca0b00a8cba?w=400",
      score: 24,
      scoreLabel: "Avoid",
      scoreColor: "#ef4444",
      badges: [],
      
      overview: {
        additives: {
          count: 4,
          list: [
            { name: "Titanium Dioxide (E171)", reason: "Banned in EU - potential DNA damage", tag: "Banned in EU" },
            { name: "Red 40 & Yellow 5", reason: "Linked to hyperactivity in children", tag: "Artificial dye" }
          ]
        },
        processing: {
          nova: 4,
          text: "Highly industrial process involving extrusion, artificial coloring, and synthetic preservation. NOVA 4 classification."
        },
        allergens: ["Wheat", "Soy"],
        nutritionalConcerns: [
          { label: "Sugar", value: "18g per serving", note: "Exceeds daily limit for children - high amount linked to metabolic issues" },
          { label: "Sodium", value: "210mg per serving", note: "Moderate sodium content" }
        ]
      },

      ingredients: {
        total: 8,
        breakdown: { excellent: 0, good: 1, moderate: 2, poor: 5 },
        list: [
          { name: "Refined Wheat Flour", status: "moderate", description: "Processed grain stripped of fiber and nutrients" },
          { name: "Sugar", status: "poor", description: "18g per serving - exceeds daily limit for children", tag: "Avoid", warning: "High amount linked to metabolic issues" },
          { name: "Corn Syrup", status: "poor", description: "High fructose sweetener, linked to metabolic issues", tag: "Avoid" },
          { name: "Titanium Dioxide (E171)", status: "poor", description: "Banned in EU - potential DNA damage", tag: "Avoid", warning: "Banned in EU" },
          { name: "Red 40 (Allura Red)", status: "poor", description: "Linked to hyperactivity in children", tag: "Avoid", warning: "Artificial dye" },
          { name: "Yellow 5 (Tartrazine)", status: "poor", description: "Artificial coloring, may cause allergic reactions", tag: "Avoid", warning: "Artificial dye" },
          { name: "BHT (E321)", status: "moderate", description: "Synthetic preservative with potential hormone effects" },
          { name: "Natural Flavors", status: "good", description: "Proprietary blend, generally safe" }
        ]
      },

      details: {
        howItsMade: "Highly industrial process involving extrusion, artificial coloring, and synthetic preservation. NOVA 4 classification.",
        scientificEvidence: [
          "EFSA Panel on Food Additives (2021)",
          "Center for Science in the Public Interest Report",
          "Southampton Study on Artificial Colors (2007)"
        ],
        novaInfo: "NOVA is a food classification system that categorizes foods according to the extent and purpose of industrial processing. It ranges from NOVA 1 (unprocessed) to NOVA 4 (ultra-processed)."
      }
    }
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    setActiveTab('overview');
    setExpandedSections({});
  };

  const goBack = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  // ============================================
  // HOME SCREEN - IMPROVED
  // ============================================
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        
        {/* Hero - Like your example! */}
        <div className="bg-white px-6 pt-10 pb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            Hello, User 👋
          </h1>
          <p className="text-gray-500 text-base">What are we eating today?</p>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-6 bg-white">
          <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-base outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Daily Tip Card */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-yellow-400 text-lg">⚡</div>
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wide">Daily Tip</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Watch out for E171</h3>
            <p className="text-gray-300 text-sm mb-4">Titanium Dioxide is often found in candies and gums. Learn why it's being phased out.</p>
            <button className="text-white font-bold text-sm underline">Read Article</button>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Recent Scans</h2>
            <button className="text-sm font-semibold text-gray-500">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
              >
                <div className="relative">
                  <div className="bg-gray-50 p-6 flex items-center justify-center" style={{ height: '160px' }}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div 
                    className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: product.scoreColor }}
                  >
                    {product.score >= 75 ? 'A' : product.score >= 50 ? 'C' : 'E'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900 mb-1 text-sm truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.brand}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Button - Floating */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <button className="bg-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl">
            <Scan className="w-7 h-7" />
          </button>
        </div>

      </div>
    );
  }

  // ============================================
  // PRODUCT DETAIL SCREEN
  // ============================================
  const product = selectedProduct;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-200">
        <button onClick={goBack}><ArrowLeft className="w-6 h-6" /></button>
        <div className="text-base font-bold">Product Details</div>
        <button><Share2 className="w-6 h-6 text-gray-400" /></button>
      </div>

      {/* Product Info */}
      <div className="bg-white px-6 pt-6 pb-6 border-b border-gray-100">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-3">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900 mb-1 leading-tight">{product.name}</h1>
            <div className="text-sm text-gray-500 mb-3">{product.brand}</div>
            <div className="flex items-center gap-2">
              <div 
                className="text-3xl font-black"
                style={{ color: product.scoreColor }}
              >
                {product.score}
              </div>
              <div className="text-xs text-gray-400">/100</div>
              <div 
                className="ml-2 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: product.scoreColor }}
              >
                {product.scoreLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b-2 border-gray-100">
        {['Overview', 'Ingredients', 'Details'].map((tab) => {
          const isActive = activeTab === tab.toLowerCase();
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className="flex-1 py-4 text-sm font-bold relative"
              style={{ 
                color: isActive ? '#059669' : '#9ca3af',
                borderBottom: isActive ? '3px solid #059669' : 'none'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        
        {activeTab === 'overview' && (
          <>
            {/* Additives & Processing - Combined Card */}
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900">Additives</h3>
                  <p className="text-sm text-red-700">{product.overview.additives.count} harmful detected</p>
                </div>
              </div>

              {product.overview.additives.count > 0 ? (
                <ul className="space-y-3">
                  {product.overview.additives.list.map((additive, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-bold text-red-900 mb-1">{additive.name}</div>
                        {additive.tag && (
                          <span className="inline-block text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-bold mb-1">
                            {additive.tag}
                          </span>
                        )}
                        <div className="text-sm text-red-700">{additive.reason}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-emerald-600">✓</div>
                  <div>
                    <div className="font-bold text-emerald-900">No harmful additives</div>
                    <div className="text-sm text-emerald-700">Clean ingredients only</div>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Factory className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">NOVA {product.overview.processing.nova}</h3>
                  <p className="text-sm text-gray-600">Processing Level</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{product.overview.processing.text}</p>
            </div>

            {/* Allergens */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Wheat className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-amber-900">Allergens</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.overview.allergens.map((allergen, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-amber-100 text-amber-900 text-sm font-semibold">
                    {allergen}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutritional Concerns */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Nutritional Concerns</h3>
              </div>
              <div className="space-y-4">
                {product.overview.nutritionalConcerns.map((concern, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{concern.label}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{concern.note}</div>
                      </div>
                      <div className="text-base font-black text-gray-900 ml-3">{concern.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ingredients' && (
          <>
            {/* Quality Breakdown - WITH LEGEND! */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Quality Overview</h3>
                <span className="text-sm text-gray-500">({product.ingredients.total} total)</span>
              </div>
              
              {/* Progress Bar */}
              <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-4">
                {product.ingredients.breakdown.excellent > 0 && (
                  <div 
                    style={{ 
                      flex: product.ingredients.breakdown.excellent, 
                      backgroundColor: '#10b981' 
                    }}
                  ></div>
                )}
                {product.ingredients.breakdown.moderate > 0 && (
                  <div 
                    style={{ 
                      flex: product.ingredients.breakdown.moderate, 
                      backgroundColor: '#f59e0b' 
                    }}
                  ></div>
                )}
                {product.ingredients.breakdown.poor > 0 && (
                  <div 
                    style={{ 
                      flex: product.ingredients.breakdown.poor, 
                      backgroundColor: '#ef4444' 
                    }}
                  ></div>
                )}
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-gray-900">Excellent: {product.ingredients.breakdown.excellent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-semibold text-gray-900">Moderate: {product.ingredients.breakdown.moderate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-semibold text-gray-900">Poor: {product.ingredients.breakdown.poor}</span>
                </div>
              </div>
            </div>

            {/* Complete List */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Complete List</h3>
              </div>
              <div>
                {product.ingredients.list.map((ing, i) => (
                  <div key={i} className="p-5 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        ing.status === 'excellent' || ing.status === 'good' ? 'bg-blue-500' :
                        ing.status === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-bold text-gray-900">{ing.name}</div>
                          {ing.tag && (
                            <div className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">
                              {ing.tag}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">{ing.description}</div>
                        {ing.warning && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            {ing.warning}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'details' && (
          <>
            {/* How It's Made */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">ℹ️</span>
                </div>
                How It's Made
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.details.howItsMade}</p>
            </div>

            {/* Scientific Evidence */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">🔬</span>
                </div>
                Scientific Evidence
              </h3>
              <ul className="space-y-2">
                {product.details.scientificEvidence.map((evidence, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>

            {/* About NOVA */}
            <div className="bg-gray-100 rounded-2xl p-5">
              <h3 className="text-base font-bold text-gray-900 mb-2">About NOVA Classification</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.details.novaInfo}</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FoodSafetyApp;
