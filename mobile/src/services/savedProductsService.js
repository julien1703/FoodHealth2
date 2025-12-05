import supabase from '../supabaseClient';
import { getCurrentUser, waitForSession } from './sessionService';

/**
 * Speichert ein Produkt für den aktuellen User
 */
export const saveProduct = async (product) => {
  try {
    const user = await waitForSession();
    
    if (!user) {
      throw new Error('User nicht angemeldet');
    }

    console.log('Saving product for userId:', user.id, 'productId:', product.id);

    // Prüfen ob Produkt bereits gespeichert ist
    const { data: existingSave } = await supabase
      .from('saved_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();

    if (existingSave) {
      // Produkt ist bereits gespeichert
      return { success: false, message: 'Product already saved', alreadySaved: true };
    } else {
      // Neues gespeichertes Produkt
      const { error } = await supabase
        .from('saved_products')
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_data: product, // Gesamtes Produkt-Objekt speichern
          saved_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('Product saved successfully');
      return { success: true, message: 'Product saved successfully' };
    }
  } catch (error) {
    console.error('Fehler beim Speichern des Produkts:', error);
    throw error;
  }
};

/**
 * Entfernt ein Produkt aus den gespeicherten Produkten
 */
export const unsaveProduct = async (productId) => {
  try {
    const user = await waitForSession();
    
    if (!user) {
      throw new Error('User nicht angemeldet');
    }

    console.log('Unsaving product for userId:', user.id, 'productId:', productId);

    const { error } = await supabase
      .from('saved_products')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
    console.log('Product unsaved successfully');
    return { success: true, message: 'Product removed from saved' };
  } catch (error) {
    console.error('Fehler beim Entfernen des Produkts:', error);
    throw error;
  }
};

/**
 * Lädt alle gespeicherten Produkte des aktuellen Users
 */
export const getSavedProducts = async () => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('No user found for getting saved products');
      return [];
    }

    console.log('Loading saved products for userId:', user.id);

    const { data, error } = await supabase
      .from('saved_products')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) throw error;

    console.log('Loaded saved products:', data?.length || 0);
    
    // Extrahiere product_data aus jedem gespeicherten Produkt
    return data?.map(save => ({
      ...save.product_data,
      saved_at: save.saved_at,
      save_id: save.id
    })) || [];
  } catch (error) {
    console.error('Fehler beim Laden der gespeicherten Produkte:', error);
    return [];
  }
};

/**
 * Prüft ob ein Produkt vom aktuellen User gespeichert ist
 */
export const isProductSaved = async (productId) => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('saved_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking if product is saved:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if product is saved:', error);
    return false;
  }
};