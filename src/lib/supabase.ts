import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// Singleton client - only created on the client, after hydration
let supabaseClient: SupabaseClient | null = null
let initAttempted = false

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient() should only be called on the client')
  }
  
  if (supabaseClient) return supabaseClient
  if (initAttempted) {
    throw new Error('Supabase client failed to initialize. Check your environment variables.')
  }
  
  initAttempted = true
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key || url === 'your-project.supabase.co') {
    throw new Error(
      'Missing or invalid Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }
  
  supabaseClient = createClient(url, key)
  return supabaseClient
}

// Alias for backwards compatibility
export const createClientComponentClient = getSupabaseClient

// Hook to get supabase client safely - returns null during SSR
export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    try {
      const supabase = getSupabaseClient()
      setClient(supabase)
    } catch (e: any) {
      setError(e.message)
    }
  }, [])
  
  return { client, error, isLoading: client === null && error === null }
}