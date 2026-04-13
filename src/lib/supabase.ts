import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'

// Singleton client
let supabaseClient: SupabaseClient | null = null

// Hardcoded fallback for Vercel build env injection
const FALLBACK_URL = 'https://zlcdmkffvktvepkrykyd.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsY2Rta2Zmdmt0dmVwa3J5a3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTE4NjIsImV4cCI6MjA5MTY2Nzg2Mn0.NayUh3Ht6_k_GfsGvGH5eWe_f4rInidyd9iJWOYtGeI'

// Hook to get supabase client safely
export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY

    if (!url || url === 'your-project.supabase.co') {
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY

  console.log('[HangFit] Supabase URL:', url)
  console.log('[HangFit] Supabase Key:', key ? 'SET' : 'MISSING')

  if (!url || url === 'your-project.supabase.co') {
    throw new Error('Missing Supabase configuration. URL=' + (url || 'EMPTY'))
  }

  supabaseClient = createClient(url, key)
  return supabaseClient
}

// Alias for backwards compatibility
export const createClientComponentClient = getSupabaseClient