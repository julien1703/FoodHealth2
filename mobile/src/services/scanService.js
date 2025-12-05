import supabase from '../supabaseClient';
import { getCurrentUser, waitForSession } from './sessionService';

/**
 * Speichert einen Scan für den aktuellen User
 */
export const saveScan = async (product) => {
  try {
    const user = await waitForSession();
    
    if (!user) {
      throw new Error('User nicht angemeldet');
    }

    // Prüfen ob Scan bereits existiert (basierend auf product.id)
    const { data: existingScan } = await supabase
      .from('scans')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();

    if (existingScan) {
      // Update des bestehenden Scans (neues Datum)
      const { error } = await supabase
        .from('scans')
        .update({
          scanned_at: new Date().toISOString(),
          product_data: product // Gesamtes Produkt-Objekt speichern
        })
        .eq('id', existingScan.id);

      if (error) throw error;
      return { success: true, isNew: false };
    } else {
      // Neuer Scan
      const { error } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_data: product, // Gesamtes Produkt-Objekt speichern
          scanned_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, isNew: true };
    }
  } catch (error) {
    console.error('Fehler beim Speichern des Scans:', error);
    throw error;
  }
};

/**
 * Lädt alle Scans des aktuellen Users (neueste zuerst)
 */
export const getUserScans = async () => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('No user found for loading scans');
      return [];
    }

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('scanned_at', { ascending: false });

    if (error) throw error;

    // Extrahiere product_data aus jedem Scan
    return data.map(scan => ({
      ...scan.product_data,
      scanned_at: scan.scanned_at,
      scan_id: scan.id
    }));
  } catch (error) {
    console.error('Fehler beim Laden der Scans:', error);
    return [];
  }
};

/**
 * Löscht einen Scan
 */
export const deleteScan = async (scanId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User nicht angemeldet');
    }

    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId)
      .eq('user_id', user.id); // Sicherheit: Nur eigene Scans löschen

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Fehler beim Löschen des Scans:', error);
    throw error;
  }
};

