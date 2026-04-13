'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dumbbell, History, Settings, LayoutDashboard } from 'lucide-react'

const navItems = [
  { href: '/workout', icon: Dumbbell, label: 'Workout' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f0a]/95 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-orange-500'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}