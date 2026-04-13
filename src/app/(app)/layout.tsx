'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/supabase'
import { BottomNav } from '@/components/BottomNav'
import { Plane } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { client: supabase, isLoading: supabaseLoading, error: supabaseError } = useSupabase()

  useEffect(() => {
    if (supabaseLoading) return

    // Show error state if Supabase failed to init
    if (supabaseError || !supabase) {
      setError(supabaseError || 'Failed to connect to database')
      setLoading(false)
      return
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
        } else {
          setUser(user)
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to verify user')
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, supabaseLoading, supabaseError, router])

  // Error state - show what went wrong
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f0a]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Plane className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Connection Error</h2>
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (supabaseLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f0a]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-pulse">
          <Plane className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] pb-20">
      {children}
      <BottomNav />
    </div>
  )
}