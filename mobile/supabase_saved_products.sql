-- ============================================
-- KOMPLETTES SETUP FÜR FOODHEALTH APP
-- ============================================

-- 1. SCANS TABELLE
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_data JSONB NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 2. SAVED PRODUCTS TABELLE  
CREATE TABLE saved_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 3. PROFILES TABELLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FÜR PERFORMANCE
-- ============================================

CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at DESC);
CREATE INDEX idx_saved_products_user_id ON saved_products(user_id);
CREATE INDEX idx_saved_products_saved_at ON saved_products(saved_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- RLS aktivieren
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SCANS POLICIES
CREATE POLICY "Users can view own scans" ON scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scans" ON scans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scans" ON scans FOR DELETE USING (auth.uid() = user_id);

-- SAVED PRODUCTS POLICIES
CREATE POLICY "Users can view own saved products" ON saved_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved products" ON saved_products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved products" ON saved_products FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved products" ON saved_products FOR DELETE USING (auth.uid() = user_id);

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);