import React, { useState } from 'react';
import { Search, Scan, ArrowLeft, Share2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

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
      id: 'yogurt',
      name: "Organic Greek Yogurt",
      brand: "Pure Valley Farms",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      score: 87,
      scoreLabel: "Excellent",
      scoreLetter: "A",
      scoreColor: "#10b981",
      scoreBg: "#d1fae5",
      
      verdict: null,
      
      quickFacts: {
        additives: 0,
        nova: 2,
        sugar: "6g",
        allergens: 1
      },
      
      harmfulAdditives: [],
      
      ingredients: [
        { name: "Organic Whole Milk", description: "From grass-fed cows, rich in omega-3", status: "good" },
        { name: "Live Active Cultures", description: "Probiotics for digestive health", status: "good" },
        { name: "Natural Cream", description: "Unprocessed dairy cream", status: "good" }
      ],
      
      scientificEvidence: [
        { title: "Probiotic Benefits", org: "NIH, 2023" },
        { title: "Organic Standards", org: "USDA, 2024" }
      ]
    },
    {
      id: 'granola',
      name: "Honey Almond Granola",
      brand: "Nature's Harvest",
      image: "https://images.unsplash.com/photo-1625869016774-3ba4a083dcc4?w=400",
      score: 62,
      scoreLabel: "Moderate",
      scoreLetter: "C",
      scoreColor: "#f59e0b",
      scoreBg: "#fef3c7",
      
      verdict: {
        title: "Moderate Product",
        description: "Contains natural flavors and moderate sugar content"
      },
      
      quickFacts: {
        additives: 1,
        nova: 3,
        sugar: "12g",
        allergens: 2
      },
      
      harmfulAdditives: [
        { name: "Natural Flavor", badge: "Undisclosed", description: "Proprietary blend, may contain allergens" }
      ],
      
      ingredients: [
        { name: "Whole Grain Oats", description: "High in fiber", status: "good" },
        { name: "Honey", description: "Natural sweetener - 8g sugar", status: "moderate" },
        { name: "Almonds", description: "Heart-healthy fats", status: "good" },
        { name: "Natural Flavor", description: "Proprietary blend", status: "moderate" },
        { name: "Canola Oil", description: "Processed vegetable oil", status: "moderate" },
        { name: "Brown Sugar", description: "Added sweetener", status: "moderate" }
      ],
      
      scientificEvidence: [
        { title: "Whole Grain Benefits", org: "Harvard, 2023" }
      ]
    },
    {
      id: 'cereal',
      name: "Rainbow Crunch Cereal",
      brand: "Sugar Rush Co.",
      image: "https://images.unsplash.com/photo-1590137876181-4ca0b00a8cba?w=400",
      score: 24,
      scoreLabel: "Avoid",
      scoreLetter: "E",
      scoreColor: "#ef4444",
      scoreBg: "#fee2e2",
      
      verdict: {
        title: "Avoid This Product",
        description: "Contains Titanium Dioxide (banned in EU) and artificial dyes linked to hyperactivity"
      },
      
      quickFacts: {
        additives: 4,
        nova: 4,
        sugar: "18g",
        allergens: 2
      },
      
      harmfulAdditives: [
        { name: "Titanium Dioxide (E171)", badge: "Banned in EU", description: "Banned in EU - potential DNA damage" },
        { name: "Red 40 & Yellow 5", badge: "Artificial dye", description: "Linked to hyperactivity in children" }
      ],
      
      ingredients: [
        { name: "Refined Wheat Flour", description: "Processed grain stripped of fiber", status: "moderate" },
        { name: "Sugar", description: "18g per serving", status: "bad", warning: "High amount" },
        { name: "Corn Syrup", description: "High fructose sweetener", status: "bad" },
        { name: "Titanium Dioxide", description: "Banned in EU", status: "bad", warning: "Banned in EU" },
        { name: "Red 40", description: "Artificial coloring", status: "bad", warning: "Artificial dye" }
      ],
      
      scientificEvidence: [
        { title: "EFSA E171 Assessment", org: "EFSA, 2021" },
        { title: "Southampton Study", org: "The Lancet, 2007" }
      ]
    }
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    setExpandedSection(null);
  };

  const goBack = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  // HOME SCREEN
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        
        {/* Header */}
        <div className="bg-white px-6 pt-12 pb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Hello, User 👋</h1>
          <p className="text-gray-500 text-base">What are we eating today?</p>
          
          {/* Search Bar */}
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

        {/* Daily Tip Card */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400 text-lg">⚡</span>
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wide">DAILY TIP</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Watch out for E171</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Titanium Dioxide is found in candies. Learn why it's being phased out.
            </p>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="px-6 mb-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Scans</h2>
            <button className="text-gray-500 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => openProduct(product)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-900 text-base">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                </div>
                
                {/* Score Badge */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: product.scoreColor }}
                >
                  {product.scoreLetter}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Button */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <button className="bg-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl border-4 border-white">
            <Scan className="w-7 h-7" />
          </button>
        </div>

      </div>
    );
  }

  // PRODUCT DETAIL SCREEN
  const product = selectedProduct;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white">
        <button onClick={goBack}><ArrowLeft className="w-6 h-6 text-gray-900" /></button>
        <div className="text-base font-bold text-gray-900">Product Details</div>
        <button><Share2 className="w-5 h-5 text-gray-400" /></button>
      </div>

      {/* Product Header */}
      <div className="bg-white px-6 pt-4 pb-6">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center p-3 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>
          
          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <div className="text-sm text-gray-500 mb-3">{product.brand}</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black" style={{ color: product.scoreColor }}>{product.score}</span>
              <span className="text-gray-400 text-sm">/100</span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-bold text-white ml-2"
                style={{ backgroundColor: product.scoreColor }}
              >
                {product.scoreLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict Banner */}
      {product.verdict && (
        <div 
          className="mx-4 rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: product.scoreLetter === 'E' ? '#ef4444' : '#f59e0b' }}
        >
          <div className="text-white text-xl">
            {product.scoreLetter === 'E' ? '🛑' : '⚠️'}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base">{product.verdict.title}</div>
            <div className="text-white text-sm opacity-90">{product.verdict.description}</div>
          </div>
        </div>
      )}

      {/* Quick Facts */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400">ℹ️</span>
          <span className="font-bold text-gray-900">Quick Facts</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Harmful Additives */}
          <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: product.scoreBg, borderColor: product.scoreColor + '40' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" style={{ color: product.scoreColor }} />
              <span className="text-2xl font-black" style={{ color: product.scoreColor }}>{product.quickFacts.additives}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: product.scoreColor }}>Harmful Additives</div>
          </div>
          
          {/* NOVA Level */}
          <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: product.scoreBg, borderColor: product.scoreColor + '40' }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: product.scoreColor }}>📊</span>
              <span className="text-2xl font-black" style={{ color: product.scoreColor }}>{product.quickFacts.nova}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: product.scoreColor }}>NOVA Level</div>
          </div>
          
          {/* Sugar Content */}
          <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: product.scoreBg, borderColor: product.scoreColor + '40' }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: product.scoreColor }}>🍬</span>
              <span className="text-2xl font-black" style={{ color: product.scoreColor }}>{product.quickFacts.sugar}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: product.scoreColor }}>Sugar Content</div>
          </div>
          
          {/* Allergens */}
          <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: product.scoreBg, borderColor: product.scoreColor + '40' }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: product.scoreColor }}>🌾</span>
              <span className="text-2xl font-black" style={{ color: product.scoreColor }}>{product.quickFacts.allergens}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: product.scoreColor }}>Allergens</div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 pb-8 space-y-3">
        
        {/* Harmful Additives Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('additives')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Harmful Additives</div>
                <div className="text-sm text-gray-500">{product.harmfulAdditives.length} detected</div>
              </div>
            </div>
            {expandedSection === 'additives' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'additives' && product.harmfulAdditives.length > 0 && (
            <div className="px-4 pb-4 space-y-4">
              {product.harmfulAdditives.map((additive, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-red-900">{additive.name}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold">
                      {additive.badge}
                    </span>
                    <div className="text-sm text-red-700 mt-1">{additive.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Ingredient List Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('ingredients')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{product.ingredients.length}</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Full Ingredient List</div>
                <div className="text-sm text-gray-500">{product.ingredients.length} ingredients</div>
              </div>
            </div>
            {expandedSection === 'ingredients' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'ingredients' && (
            <div className="px-4 pb-4 space-y-4">
              {product.ingredients.map((ing, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        ing.status === 'good' ? 'bg-amber-400' : 
                        ing.status === 'moderate' ? 'bg-amber-400' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-bold text-gray-900">{ing.name}</div>
                        <div className="text-sm text-gray-500">{ing.description}</div>
                        {ing.warning && (
                          <div className="mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-700 font-medium">{ing.warning}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {ing.status === 'bad' && (
                      <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold flex-shrink-0">
                        Avoid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scientific Evidence Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button 
            onClick={() => toggleSection('science')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Scientific Evidence</div>
                <div className="text-sm text-gray-500">Research & studies</div>
              </div>
            </div>
            {expandedSection === 'science' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>
          
          {expandedSection === 'science' && (
            <div className="px-4 pb-4 space-y-3">
              {product.scientificEvidence.map((source, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-900 text-sm">{source.title}</div>
                  <div className="text-xs text-gray-500">{source.org}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FoodSafetyApp;
