import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'

// Singleton client
let supabaseClient: SupabaseClient | null = null

// Hook to get supabase client safely
export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key || url === 'your-project.supabase.co') {
      setError('Missing Supabase configuration')
      setIsLoading(false)
      return
    }

    try {
      supabaseClient = createClient(url, key)
      setClient(supabaseClient)
      setIsLoading(false)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }, [])

  return { client, error, isLoading }
}

// Direct client getter for one-time use (like login page)
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

// Alias for backwards compatibility
export const createClientComponentClient = getSupabaseClient