import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid (non-placeholder) environment variables
const isValidUrl = supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseUrl.includes('placeholder');

const isValidKey = supabaseAnonKey && 
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseAnonKey.includes('placeholder');

// Only create client if we have valid environment variables
export const supabase = isValidUrl && isValidKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helper functions
export const signInWithOTP = async (phone: string) => {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  // Check if phone is authorized
  if (phone !== '6361064550') {
    return { success: false, error: 'Unauthorized phone number' };
  }

  // Send OTP via Supabase Auth
  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });

  if (error) {
    console.error('OTP send error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const verifyOTP = async (phone: string, otp: string) => {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  // Verify OTP with Supabase Auth
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: otp,
    type: 'sms'
  });

  if (error) {
    console.error('OTP verification error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data, error: null };
};

export const signOut = async () => {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  
  const { error } = await supabase.auth.signOut();
  return { success: !error, error };
};