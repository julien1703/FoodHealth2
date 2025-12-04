-- ============================================
-- SUPABASE SETUP FÜR FOODHEALTH APP
-- ============================================
-- 
-- Diese SQL-Datei erstellt die benötigte Tabelle für Scans
-- 
-- ANLEITUNG:
-- 1. Öffne dein Supabase Dashboard: https://supabase.com/dashboard
-- 2. Gehe zu deinem Projekt
-- 3. Klicke auf "SQL Editor" (links im Menü)
-- 4. Kopiere den gesamten Inhalt dieser Datei
-- 5. Füge ihn in den SQL Editor ein
-- 6. Klicke auf "Run" (oder drücke Cmd/Ctrl + Enter)
-- ============================================

-- Tabelle für gescannte Produkte erstellen
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_data JSONB NOT NULL, -- Gesamtes Produkt-Objekt wird hier gespeichert
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Eindeutiger Constraint: Ein User kann ein Produkt nur einmal scannen
  -- (wird beim Update aktualisiert, nicht dupliziert)
  UNIQUE(user_id, product_id)
);

-- Index für schnelle Abfragen nach User
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);

-- Index für schnelle Abfragen nach Scan-Datum (neueste zuerst)
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at DESC);

-- Row Level Security (RLS) aktivieren
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Policy: User können nur ihre eigenen Scans sehen
CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User können nur ihre eigenen Scans erstellen
CREATE POLICY "Users can insert own scans"
  ON scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User können nur ihre eigenen Scans updaten
CREATE POLICY "Users can update own scans"
  ON scans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: User können nur ihre eigenen Scans löschen
CREATE POLICY "Users can delete own scans"
  ON scans FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FERTIG! ✅
-- ============================================
-- 
-- Die Tabelle ist jetzt erstellt und gesichert.
-- Jeder User kann nur seine eigenen Scans sehen/bearbeiten/löschen.
-- 
-- Testen kannst du es so:
-- 1. In deiner App einloggen
-- 2. Ein Produkt scannen/öffnen
-- 3. In Supabase Dashboard → Table Editor → "scans" öffnen
-- 4. Du solltest deinen Scan sehen (nur deine eigenen!)
-- ============================================

