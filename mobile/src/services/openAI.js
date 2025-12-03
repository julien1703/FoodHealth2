// API Key wird aus .env Datei geladen - NIEMALS direkt hier einfügen!
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'DEIN_API_KEY_HIER'; 
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// Warnung wenn API Key fehlt
if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
  console.warn('⚠️  OpenAI API Key nicht gefunden! Erstelle eine .env Datei mit EXPO_PUBLIC_OPENAI_API_KEY=dein_key');
}

export async function analyzeProduct(productInfo) {
  try {
    const prompt = `
You are a nutrition expert. Analyze this food product and create a detailed health assessment in JSON format. Do NOT return a score or a mainVerdict/headline. Only return the product info, quickFacts, harmfulAdditives, ingredients, and scientificEvidence. Do not guess missing information.

Product: ${productInfo.name || 'Unknown Product'}
Brand: ${productInfo.brand || 'Unknown Brand'}
Ingredients: ${productInfo.ingredients || 'Not available'}
Nutrition: ${productInfo.nutrition || 'Not available'}
Barcode: ${productInfo.barcode || 'Not available'}
Existing Image: ${productInfo.image || 'Not available'}

QuickFacts types: "good", "warning", "danger"
Use real product info based on barcode/name and assess strictly by the above logic!
IMPORTANT: Always use the provided image URL if available, or a food-related stock image if not.

Return EXACTLY this JSON structure (for ProductDetailScreen template):
{
  "name": "Product Name",
  "brand": "Brand Name",
  "image": "${productInfo.image}",
  "quickFacts": [
    {"label": "ADDITIVES", "value": "2 concerning", "icon": "⚠️", "type": "warning"},
    {"label": "SUGAR", "value": "15g per 100g", "icon": "🍬", "type": "warning"},
    {"label": "PROCESSING", "value": "NOVA 3", "icon": "🏭", "type": "warning"},
    {"label": "PROTEIN", "value": "8g per 100g", "icon": "💪", "type": "good"}
  ],
  "harmfulAdditives": [
    {"name": "E621 (Monosodium glutamate)", "risk": "medium", "info": "May cause headaches in sensitive individuals"}
  ],
  "ingredients": [
    {"name": "Ingredient name", "safe": true, "desc": "Description of ingredient"}
  ],
  "scientificEvidence": [
    {"title": "Study title", "org": "Research organization, year"}
  ]
}
`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert. Analyze food products and return detailed health assessments in JSON format. Always respond with valid JSON only. Your answers must be deterministic and reproducible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse JSON response from OpenAI
    const analysis = JSON.parse(analysisText);
    
    // Add unique ID for the analyzed product
    analysis.id = `scanned-${Date.now()}`;
    
    return analysis;
    
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze product. Please try again.');
  }
}

// Curated clean product images for different categories
const getCleanProductImage = (productName, brand) => {
  const cleanImages = {
    // Beverages
    'coca cola': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop&auto=format',
    'pepsi': 'https://images.unsplash.com/photo-1629203851122-3726ecdf5507?w=400&h=400&fit=crop&auto=format',
    'red bull': 'https://images.unsplash.com/photo-1622543925917-763c34ba5602?w=400&h=400&fit=crop&auto=format',
    
    // Snacks & Sweets
    'nutella': 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&auto=format',
    'chocolate': 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=400&fit=crop&auto=format',
    'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
    
    // Default fallbacks
    'default_food': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'default_drink': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&auto=format'
  };
  
  const name = productName.toLowerCase();
  const brandName = brand.toLowerCase();
  
  // Try to match specific products
  for (const [key, url] of Object.entries(cleanImages)) {
    if (name.includes(key) || brandName.includes(key)) {
      return url;
    }
  }
  
  // Fallback to category-based images
  if (name.includes('cola') || name.includes('drink') || name.includes('juice')) {
    return cleanImages.default_drink;
  }
  
  return cleanImages.default_food;
};

export async function getProductInfo(barcode) {
  try {
    // Try to get product info from Open Food Facts API
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1) {
      const product = data.product;
      const productName = product.product_name || 'Unknown Product';
      const brandName = product.brands || 'Unknown Brand';
      
      return {
        name: productName,
        brand: brandName,
        ingredients: product.ingredients_text || 'Ingredients not available',
        nutrition: formatNutrition(product.nutriments),
        image: getCleanProductImage(productName, brandName), // Always clean image
        barcode: barcode
      };
    } else {
      // Fallback: return basic info for AI to work with
      return {
        name: 'Unknown Product',
        brand: 'Unknown Brand', 
        ingredients: 'Please scan ingredient list manually',
        nutrition: 'Nutrition facts not available',
        image: getCleanProductImage('Unknown Product', 'Unknown Brand'),
        barcode: barcode
      };
    }
  } catch (error) {
    console.error('Product lookup error:', error);
    return {
      name: 'Unknown Product',
      brand: 'Unknown Brand',
      ingredients: 'Product information not available',
      nutrition: 'Nutrition facts not available', 
      image: getCleanProductImage('Unknown Product', 'Unknown Brand'),
      barcode: barcode
    };
  }
}

function formatNutrition(nutriments) {
  if (!nutriments) return 'Nutrition facts not available';
  
  const nutrition = [];
  if (nutriments.energy_100g) nutrition.push(`Energy: ${nutriments.energy_100g} kJ`);
  if (nutriments.proteins_100g) nutrition.push(`Protein: ${nutriments.proteins_100g}g`);
  if (nutriments.carbohydrates_100g) nutrition.push(`Carbs: ${nutriments.carbohydrates_100g}g`);
  if (nutriments.sugars_100g) nutrition.push(`Sugar: ${nutriments.sugars_100g}g`);
  if (nutriments.fat_100g) nutrition.push(`Fat: ${nutriments.fat_100g}g`);
  if (nutriments.sodium_100g) nutrition.push(`Sodium: ${nutriments.sodium_100g}g`);
  
  return nutrition.join(', ') || 'Nutrition facts not available';
}