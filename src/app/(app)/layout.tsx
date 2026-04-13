'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/supabase'
import { BottomNav } from '@/components/BottomNav'
import { Plane } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { client: supabase, isLoading: supabaseLoading } = useSupabase()

  useEffect(() => {
    if (supabaseLoading) return
    if (!supabase) return

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
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
  }, [supabase, supabaseLoading, router])

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