'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { notificationManager } from '@/lib/notifications'
import { LevelUpModal } from '@/components/level-up-modal'
import { UserLevel } from '@/lib/gamification'

export function Providers({ children }: { children: React.ReactNode }) {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: UserLevel
    previousLevel: UserLevel
  } | null>(null)

  useEffect(() => {
    // Initialize notification manager on app startup
    const initializeNotifications = async () => {
      const permissionStatus = notificationManager.getPermissionStatus()

      // Only auto-register service worker if permissions already granted
      if (permissionStatus === 'granted') {
        await notificationManager.registerServiceWorker()

        // Load saved reminder times from localStorage
        const savedBaselineTime = localStorage.getItem('baselineReminderSettings')
        const savedEveningTime = localStorage.getItem('eveningReflectionSettings')
        const savedEveningEnabled = localStorage.getItem('eveningReflectionEnabled')

        // Schedule baseline reminder (default 9:00 AM)
        let baselineTime = { hour: 9, minute: 0 }
        if (savedBaselineTime) {
          try {
            baselineTime = JSON.parse(savedBaselineTime)
          } catch (e) {
            console.warn('Failed to parse baseline time settings')
          }
        }
        await notificationManager.scheduleDailyBaselineReminder(
          baselineTime.hour,
          baselineTime.minute
        )

        // Schedule evening reflection if enabled (default 7:00 PM)
        const eveningEnabled = savedEveningEnabled !== 'false' // true by default
        if (eveningEnabled) {
          let eveningTime = { hour: 19, minute: 0 }
          if (savedEveningTime) {
            try {
              eveningTime = JSON.parse(savedEveningTime)
            } catch (e) {
              console.warn('Failed to parse evening reflection settings')
            }
          }
          await notificationManager.scheduleEveningReflection(
            eveningTime.hour,
            eveningTime.minute
          )
        }

        console.log('✅ Notification manager initialized')
      }
    }

    initializeNotifications()

    // Listen for level-up events
    const handleLevelUp = (event: any) => {
      const { newLevel, previousLevel } = event.detail
      setLevelUpData({ newLevel, previousLevel })
      setShowLevelUpModal(true)
    }

    window.addEventListener('levelUp', handleLevelUp)

    return () => {
      window.removeEventListener('levelUp', handleLevelUp)
    }
  }, [])

  return (
    <SessionProvider>
      {children}
      {levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          newLevel={levelUpData.newLevel}
          previousLevel={levelUpData.previousLevel}
        />
      )}
    </SessionProvider>
  )
}
