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

// Simple authentication - no Supabase auth needed
const ADMIN_PHONE = '6361064550';
const ADMIN_OTP = '664477';

export const signInWithOTP = async (phone: string) => {
  return { success: phone === ADMIN_PHONE };
};

export const verifyOTP = async (phone: string, otp: string) => {
  if (phone === ADMIN_PHONE && otp === ADMIN_OTP) {
    return { success: true, data: { user: { id: 'demo-admin' } }, error: null };
  }
  return { success: false, error: { message: 'Invalid OTP' } };
};

export const signOut = async () => {
  return { success: true };
};