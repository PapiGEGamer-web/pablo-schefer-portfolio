import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const authConfigured = Boolean(supabaseUrl && supabasePublishableKey)

let clientPromise: Promise<SupabaseClient | null> | null = null

export function getSupabase() {
  if (!authConfigured) return Promise.resolve(null)
  if (clientPromise) return clientPromise

  clientPromise = import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl!, supabasePublishableKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: { 'X-Client-Info': 'pablo-schefer-portfolio' },
    },
  }))

  return clientPromise
}
