'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Zap } from 'lucide-react'
import { gamificationManager, UserLevel } from '@/lib/gamification'

export function GamificationStatus() {
  const [currentLevel, setCurrentLevel] = useState<UserLevel | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [progress, setProgress] = useState({ current: 0, needed: 0, percentage: 0 })

  useEffect(() => {
    loadGamificationStatus()

    // Refresh on storage change (cross-tab sync)
    const handleStorageChange = () => {
      loadGamificationStatus()
    }

    window.addEventListener('storage', handleStorageChange)

    // Also refresh on custom gamification update event
    window.addEventListener('gamificationUpdate', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('gamificationUpdate', handleStorageChange)
    }
  }, [])

  const loadGamificationStatus = () => {
    const state = gamificationManager.getState()
    const level = gamificationManager.getCurrentLevel()
    const progressData = gamificationManager.getProgressToNextLevel()

    setCurrentLevel(level)
    setTotalPoints(state.totalPoints)
    setProgress(progressData)
  }

  if (!currentLevel) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-full border border-purple-500/30"
    >
      {/* Level Badge */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-purple-300 leading-none">Level {currentLevel.level}</span>
          <span className="text-xs font-semibold text-white leading-none">{currentLevel.title}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-white/20" />

      {/* Points */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        <div className="flex flex-col">
          <span className="text-xs text-purple-300 leading-none">Points</span>
          <span className="text-xs font-semibold text-white leading-none">{totalPoints}</span>
        </div>
      </div>

      {/* Progress to Next Level */}
      {progress.percentage < 100 && (
        <>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-purple-300 leading-none">
              Next: {Math.round(progress.percentage)}%
            </span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
