import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Supabase credentials not found. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file. ' +
    'API will run in degraded mode and frontend will fall back to local data.'
  );
} else {
  // Server-side client uses the service-role key so it can bypass RLS for trusted operations.
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  console.log('Supabase client initialised');
}

export const isSupabaseEnabled = () => supabase !== null;

export default supabase;
