/* Hinweis zur Lösung des "esbuild platform" Fehlers:
   Ursache: esbuild bindet plattformspezifische native Binaries. Wenn node_modules
   von einer anderen Plattform übernommen wurde, passt das Binary nicht.

   Empfohlene Schritte im Projekt-Root:
     rm -rf node_modules package-lock.json yarn.lock
     npm install
   Falls weiterhin Fehler:
     npm rebuild esbuild --update-binary

   Wenn du in Docker/CI arbeitest: Führe "npm install" innerhalb des Zielsystems aus
   (nicht node_modules kopieren).

   Optionales package.json-Snippet (füge in "scripts" ein), damit CI/andere Maschinen
   das Binary nach Installation neu bauen:
     "postinstall": "npm rebuild esbuild --update-binary || true"

   Alternative (langsamer, nicht empfohlen): esbuild-wasm
*/

import React, { useState } from 'react';
import { Search, Scan, ArrowLeft, Share2, AlertTriangle, Droplet } from 'lucide-react';

const FoodSafetyApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const userAllergies = ['Milk'];

  const products = [
    {
      id: 'yogurt',
      name: "Andechser Plain Yogurt",
      brand: "Nature's Best",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      score: 87,
      scoreLabel: "A",
      scoreColor: "#10b981",
      
      overview: {
        nova: 2,
        novaLabel: "Minimally processed",
        additives: [],
        nutrition: [
          { label: "High Sugar", value: "6gg/serv." },
          { label: "High Sodium", value: "75mg/serv." }
        ]
      },
      
      ingredients: {
        breakdown: { excellent: 3, moderate: 0, poor: 0 },
        list: [
          { 
            name: "Organic Whole Milk", 
            status: "excellent",
            description: "From grass-fed cows, rich in omega-3 fatty acids"
          },
          { 
            name: "Live Active Cultures", 
            status: "excellent",
            description: "Probiotics for digestive health"
          },
          { 
            name: "Natural Cream", 
            status: "excellent",
            description: "Unprocessed dairy cream"
          }
        ]
      },
      
      details: {
        howItsMade: "Traditional fermentation process with minimal industrial intervention. Milk is cultured with live bacteria at controlled temperatures for 8-12 hours, then naturally strained to create a thick, creamy texture. No chemical processing or artificial additives are used.",
        whyItWorks: [
          { icon: "🦠", title: "Gut Health", description: "Probiotics improve digestion by 40%", link: "#" },
          { icon: "🦴", title: "Bone Strength", description: "20% daily calcium in one serving", link: "#" }
        ],
        brand: {
          name: "Nature's Best",
          founded: "1985",
          reputation: "Known for organic dairy products",
          certifications: ["USDA Organic", "Non-GMO"]
        },
        sources: [
          { title: "Probiotic Benefits", org: "NIH, 2023", link: "#" },
          { title: "Organic Standards", org: "USDA, 2024", link: "#" }
        ]
      },
      
      allergens: ["Milk"]
    },
    {
      id: 'granola',
      name: "Andechser Plain Yogurt",
      brand: "Nature's Best",
      image: "https://images.unsplash.com/photo-1625869016774-3ba4a083dcc4?w=400",
      score: 62,
      scoreLabel: "C",
      scoreColor: "#f59e0b",
      
      overview: {
        nova: 3,
        novaLabel: "Moderately processed",
        additives: [
          { name: "Natural Flavor", badge: "Undisclosed" }
        ],
        nutrition: [
          { label: "High Sugar", value: "12gg/serv." },
          { label: "High Sodium", value: "85mg/serv." }
        ]
      },
      
      ingredients: {
        breakdown: { excellent: 2, moderate: 2, poor: 0 },
        list: [
          { name: "Whole Grain Oats", status: "excellent", description: "High in fiber" },
          { name: "Honey", status: "moderate", description: "Natural sweetener - 8g sugar" },
          { name: "Almonds", status: "excellent", description: "Heart-healthy fats" },
          { name: "Natural Flavor", status: "moderate", description: "Proprietary blend" }
        ]
      },
      
      details: {
        howItsMade: "Oats are mixed with honey, oils, and sweeteners, then baked at controlled temperatures to create a crunchy texture. Natural flavoring is added after baking, though the exact ingredients in these flavorings are not disclosed by the manufacturer.",
        concerns: [
          { icon: "📊", title: "Blood Sugar Spikes", description: "12g sugar causes rapid increase", link: "#" }
        ],
        whyItWorks: [
          { icon: "❤️", title: "Heart Health", description: "Almonds provide healthy fats", link: "#" }
        ],
        additiveDetails: [
          { 
            name: "Natural Flavor", 
            why: "Undisclosed ingredients, may contain allergens",
            link: "#"
          }
        ],
        brand: {
          name: "Nature's Harvest",
          founded: "1998",
          reputation: "Organic breakfast foods",
          certifications: ["Gluten-Free"]
        },
        sources: [
          { title: "Whole Grain Benefits", org: "Harvard, 2023", link: "#" }
        ]
      },
      
      allergens: ["Almonds"]
    },
    {
      id: 'cereal',
      name: "Andechser Plain Yogurt",
      brand: "Nature's Best",
      image: "https://images.unsplash.com/photo-1590137876181-4ca0b00a8cba?w=400",
      score: 24,
      scoreLabel: "E",
      scoreColor: "#ef4444",
      
      overview: {
        nova: 4,
        novaLabel: "Ultra-processed",
        additives: [
          { name: "Titanium Dioxide (E171)", badge: "Banned in EU" },
          { name: "Red 40 (Allura Red)", badge: "Artificial Dye" },
          { name: "Yellow 5 (Tartrazine)", badge: "Artificial Dye" },
          { name: "BHT (Butylated Hydroxytoluene)", badge: "Preservative" }
        ],
        nutrition: [
          { label: "High Sugar", value: "18gg/serv." },
          { label: "High Sodium", value: "210mg/serv." }
        ]
      },
      
      ingredients: {
        breakdown: { excellent: 0, moderate: 2, poor: 3 },
        list: [
          { name: "Refined Wheat Flour", status: "moderate", description: "Processed grain stripped of fiber and nutrients" },
          { name: "Sugar", status: "poor", description: "18g per serving - exceeds daily limit for children", tag: "Avoid", warning: "High amount linked to metabolic issues" },
          { name: "Corn Syrup", status: "poor", description: "High fructose sweetener, linked to metabolic issues" },
          { name: "Titanium Dioxide (E171)", status: "poor", description: "Banned in EU - potential DNA damag", tag: "Avoid", warning: "Banned in EU" },
          { name: "BHT (E321)", status: "moderate", description: "Synthetic preservative with potential hormone effects" }
        ]
      },
      
      details: {
        howItsMade: "This cereal undergoes extensive industrial processing involving multiple synthetic additives, artificial colorants, and preservatives. The product contains ingredients that are banned in the European Union and has been linked to various health concerns.",
        healthRisks: [
          { icon: "🧠", title: "Hyperactivity", description: "Dyes linked to behavioral issues in kids", link: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(07)61306-3/fulltext" },
          { icon: "⚠️", title: "Metabolic Issues", description: "18g sugar exceeds daily limit for children", link: "https://www.who.int/news-room/fact-sheets/detail/sugars-intake-for-adults-and-children" },
          { icon: "🔬", title: "DNA Damage", description: "E171 banned in EU due to genotoxicity", link: "https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive" }
        ],
        additiveDetails: [
          { 
            name: "Titanium Dioxide (E171)", 
            why: "Banned in EU - DNA damage risk",
            banned: "EU",
            link: "https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive"
          },
          { 
            name: "Red 40", 
            why: "Linked to hyperactivity in children",
            link: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(07)61306-3/fulltext"
          },
          { 
            name: "Yellow 5", 
            why: "Can trigger allergic reactions",
            banned: "Norway, Austria",
            link: "#"
          },
          { 
            name: "BHT", 
            why: "Synthetic preservative, hormone concerns",
            link: "#"
          }
        ],
        alternatives: [
          { name: "Nature's Path Organic", score: 78, why: "No dyes, organic" },
          { name: "Cheerios Original", score: 72, why: "Whole grain, 1g sugar" }
        ],
        brand: {
          name: "Sugar Rush Co.",
          founded: "1995",
          reputation: "Known for colorful cereals, multiple FDA warnings",
          concerns: "History of using banned additives"
        },
        sources: [
          { title: "EFSA E171 Assessment", org: "EFSA, 2021", link: "https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive" },
          { title: "Southampton Study", org: "The Lancet, 2007", link: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(07)61306-3/fulltext" }
        ]
      },
      
      allergens: ["Wheat"]
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
  };

  const goBack = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  // HOME SCREEN
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        
        <div className="bg-white px-6 pt-10 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Hello, Julien</h1>
              <p className="text-gray-400 text-lg">What are we eating today?</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0"></div>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-base outline-none bg-transparent text-gray-500 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="px-6 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Recent Scans</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="flex-shrink-0 w-56 bg-white rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <div className="bg-gray-50 p-8 flex items-center justify-center" style={{ height: '180px' }}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div 
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg"
                    style={{ backgroundColor: product.scoreColor }}
                  >
                    {product.scoreLabel}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900 mb-1 text-base">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mb-32">
          <div className="bg-black rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-yellow-400 text-xl">⚡</div>
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wide">DAILY TIP</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Watch out for E171</h3>
            <p className="text-gray-300 text-base mb-4 leading-relaxed">Titanium Dioxide is often found in candies and gums. Learn why it's being phased out.</p>
            <button className="text-white font-bold text-base underline">Read Article</button>
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl">
            <Scan className="w-9 h-9" />
          </button>
        </div>

      </div>
    );
  }

  // PRODUCT DETAIL SCREEN
  const product = selectedProduct;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-200">
        <button onClick={goBack}><ArrowLeft className="w-6 h-6" /></button>
        <div className="text-base font-bold">Product Details</div>
        <button><Share2 className="w-6 h-6 text-gray-400" /></button>
      </div>

      <div className="bg-white px-6 pt-6 pb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center p-3">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 mb-1 leading-tight">{product.name}</h1>
            <div className="text-base text-gray-500 mb-3">{product.brand}</div>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black text-red-600">{product.score}</div>
              <div className="text-base text-gray-400">/100</div>
              <div className="px-4 py-1.5 rounded-full text-sm font-bold text-white bg-red-600">
                Avoid
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b border-gray-100">
        {['Overview', 'Ingredients', 'Details'].map((tab) => {
          const isActive = activeTab === tab.toLowerCase();
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className="flex-1 py-4 text-base font-bold relative"
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

      <div className="p-5 space-y-4 bg-gray-50">
        
        {activeTab === 'overview' && (
          <>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-center mb-3">
                <h3 className="text-base font-bold text-gray-900 mb-4">Processing Level</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-black text-gray-900">Nova {product.overview.nova}</div>
                    <div className="text-sm text-gray-600">{product.overview.novaLabel}</div>
                  </div>
                </div>
              </div>
            </div>

            {product.overview.additives.length > 0 && (
              <div className="bg-red-50 rounded-2xl overflow-hidden border border-red-100">
                <div className="p-5 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-bold text-red-900">Additives</h3>
                </div>
                <div className="px-5 pb-5 space-y-3">
                  {product.overview.additives.map((additive, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="font-bold text-gray-900 text-base">{additive.name}</span>
                      </div>
                      <span className="text-sm px-3 py-1 rounded-full font-bold bg-red-200 text-red-900">
                        {additive.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="w-6 h-6 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Nutritional Concerns</h3>
              </div>
              <div className="space-y-3">
                {product.overview.nutrition.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="font-bold text-gray-900 text-base">{item.label}</div>
                    <div className="font-black text-gray-900 text-xl">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ingredients' && (
          <>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">Quality Overview</h3>
              
              <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
                {product.ingredients.breakdown.excellent > 0 && (
                  <div style={{ flex: product.ingredients.breakdown.excellent, backgroundColor: '#10b981' }}></div>
                )}
                {product.ingredients.breakdown.moderate > 0 && (
                  <div style={{ flex: product.ingredients.breakdown.moderate, backgroundColor: '#f59e0b' }}></div>
                )}
                {product.ingredients.breakdown.poor > 0 && (
                  <div style={{ flex: product.ingredients.breakdown.poor, backgroundColor: '#ef4444' }}></div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-semibold text-gray-900">Excellent: {product.ingredients.breakdown.excellent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-semibold text-gray-900">Moderate: {product.ingredients.breakdown.moderate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-semibold text-gray-900">Poor: {product.ingredients.breakdown.poor}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-gray-700" />
                  <h3 className="text-base font-bold text-gray-900">Nutritional Concerns</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {product.ingredients.list.map((ing, i) => (
                  <div key={i} className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          ing.status === 'excellent' ? 'bg-emerald-500' :
                          ing.status === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                        <div className="font-bold text-gray-900">{ing.name}</div>
                      </div>
                      {ing.tag && (
                        <div className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                          {ing.tag}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed ml-5">{ing.description}</div>
                    {ing.warning && (
                      <div className="mt-3 ml-5 flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-red-800 font-semibold">{ing.warning}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'details' && (
          <>
            {/* How It's Made - Simple Text Block */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 px-1 flex items-center gap-2">
                <span className="text-xl">📖</span>
                How It's Made
              </h3>
              <p className="text-base text-gray-700 leading-relaxed px-1">{product.details.howItsMade}</p>
            </div>

            {/* Health Risks - Clickable Cards */}
            {product.details.healthRisks && (
              <>
                <h3 className="text-lg font-bold text-gray-900 px-1 mt-2">Health Concerns</h3>
                <div className="space-y-3">
                  {product.details.healthRisks.map((risk, i) => (
                    <a
                      key={i}
                      href={risk.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-red-50 rounded-2xl p-4 border border-red-200 active:bg-red-100 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{risk.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 mb-1">{risk.title}</div>
                          <div className="text-sm text-gray-700 mb-2">{risk.description}</div>
                          <div className="text-xs text-blue-600 font-semibold">Read Study →</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Why It Works - Clickable Cards */}
            {product.details.whyItWorks && (
              <>
                <h3 className="text-lg font-bold text-gray-900 px-1 mt-2">Why This Works</h3>
                <div className="space-y-3">
                  {product.details.whyItWorks.map((benefit, i) => (
                    <a
                      key={i}
                      href={benefit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-emerald-50 rounded-2xl p-4 border border-emerald-200 active:bg-emerald-100 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 mb-1">{benefit.title}</div>
                          <div className="text-sm text-gray-700 mb-2">{benefit.description}</div>
                          <div className="text-xs text-blue-600 font-semibold">Learn More →</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Watch Out For */}
            {product.details.concerns && (
              <>
                <h3 className="text-lg font-bold text-gray-900 px-1 mt-2">Watch Out For</h3>
                <div className="space-y-3">
                  {product.details.concerns.map((concern, i) => (
                    <a
                      key={i}
                      href={concern.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-amber-50 rounded-2xl p-4 border border-amber-200 active:bg-amber-100 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{concern.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 mb-1">{concern.title}</div>
                          <div className="text-sm text-gray-700 mb-2">{concern.description}</div>
                          <div className="text-xs text-blue-600 font-semibold">Learn More →</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Additive Details */}
            {product.details.additiveDetails && (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <h3 className="text-base font-bold text-red-900">Why Additives Are Harmful</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {product.details.additiveDetails.map((additive, i) => (
                    <a
                      key={i}
                      href={additive.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 active:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-bold text-gray-900 text-sm">{additive.name}</div>
                        {additive.banned && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold flex-shrink-0">
                            Banned in {additive.banned}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{additive.why}</div>
                      <div className="text-xs text-blue-600 font-semibold">Read Research →</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Better Alternatives */}
            {product.details.alternatives && (
              <div className="bg-white rounded-2xl overflow-hidden border border-emerald-200">
                <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                  <h3 className="text-base font-bold text-emerald-900">Better Alternatives</h3>
                </div>
                <div className="p-3 space-y-2">
                  {product.details.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm mb-1">{alt.name}</div>
                        <div className="text-xs text-gray-600">{alt.why}</div>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-black ml-3 flex-shrink-0">
                        {alt.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Info - Simple List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">About the Brand</h3>
              <div className="space-y-3 text-sm px-1">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Company</span>
                  <span className="font-semibold text-gray-900">{product.details.brand.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-semibold text-gray-900">{product.details.brand.founded}</span>
                </div>
                <div className="py-2 border-b border-gray-200">
                  <div className="text-gray-600 mb-1">Reputation</div>
                  <div className="text-gray-900">{product.details.brand.reputation}</div>
                </div>
                {product.details.brand.concerns && (
                  <div className="py-2 bg-red-50 -mx-1 px-1 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-red-800 text-sm">{product.details.brand.concerns}</div>
                    </div>
                  </div>
                )}
                {product.details.brand.certifications && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.details.brand.certifications.map((cert, i) => (
                      <span key={i} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-semibold">
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scientific Sources */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-3">Scientific Sources</h3>
              <div className="space-y-2">
                {product.details.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg active:bg-blue-100 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-blue-900 text-sm">{source.title}</div>
                      <div className="text-xs text-blue-700">{source.org}</div>
                    </div>
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FoodSafetyApp;
