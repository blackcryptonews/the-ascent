'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Target, Zap, Trophy, Settings } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
    { id: 'transform', label: 'Transform', icon: Zap, path: '/transformer' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-xl border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <tab.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
