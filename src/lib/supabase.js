import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV && url && /your-project-ref|YOUR-PROJECT-REF/i.test(url)) {
  console.warn(
    '[Aroma] VITE_SUPABASE_URL still looks like a placeholder. Edit .env.local in the project root (next to package.json), set your real https://xxxx.supabase.co URL, then stop and run npm run dev again.'
  )
}

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null
