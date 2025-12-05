import supabase from '../supabaseClient';

export async function createProfile(userId, username) {
  return await supabase.from('profiles').insert({ 
    id: userId, 
    username,
    onboarding_completed: false 
  });
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('username, onboarding_completed').eq('id', userId).single();
  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
  return data;
}

export async function markOnboardingComplete(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', userId);
  
  if (error) {
    console.error('Error marking onboarding complete:', error);
    throw error;
  }
  console.log('Onboarding marked as complete for user:', userId);
}