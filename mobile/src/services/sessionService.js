import supabase from '../supabaseClient';

/**
 * Robuste Session-Überprüfung mit Fallbacks
 */
export const getCurrentUser = async () => {
  try {
    // Methode 1: Session prüfen
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionData?.session?.user && !sessionError) {
      console.log('User found via session:', sessionData.session.user.id);
      return sessionData.session.user;
    }
    
    if (sessionError) {
      console.log('Session error:', sessionError.message);
    }
    
    console.log('No session found, trying getUser...');
    
    // Methode 2: Direkter User-Abruf
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userData?.user && !userError) {
      console.log('User found via getUser:', userData.user.id);
      return userData.user;
    }
    
    if (userError) {
      console.log('GetUser error:', userError.message);
    }
    
    console.log('No user found in getCurrentUser');
    return null;
    
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

/**
 * Warte auf Session-Initialisierung mit Retry-Logic
 */
export const waitForSession = async (maxRetries = 3, delayMs = 200) => {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`Session check attempt ${i + 1}/${maxRetries}`);
    
    const user = await getCurrentUser();
    if (user) {
      console.log('Session found after', i + 1, 'attempts');
      return user;
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log('Session wait timeout reached after', maxRetries, 'attempts');
  return null;
};

/**
 * Force Session Refresh
 */
export const refreshUserSession = async () => {
  try {
    console.log('Refreshing user session...');
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      return null;
    }
    
    console.log('Session refreshed successfully');
    return data?.user || null;
  } catch (error) {
    console.error('Session refresh catch error:', error);
    return null;
  }
};