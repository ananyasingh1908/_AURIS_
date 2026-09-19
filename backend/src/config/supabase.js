import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseServiceRoleKey } = config;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

export const supabase = createSupabaseClient();

export const connectSupabase = async () => {
  if (!supabase) {
    console.warn('Supabase not configured. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    return false;
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase connection check failed:', error.message);
      return false;
    }

    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.warn('Supabase unavailable:', error.message);
    return false;
  }
};
