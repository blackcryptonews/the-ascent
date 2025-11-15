'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Award, Lock, CheckCircle2, Zap } from 'lucide-react'
import { gamificationManager, Achievement, UserLevel } from '@/lib/gamification'
import { BottomNav } from '@/components/bottom-nav'

export default function AchievementsPage() {
  const [currentLevel, setCurrentLevel] = useState<UserLevel | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [progressToNext, setProgressToNext] = useState({ current: 0, needed: 0, percentage: 0 })
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadGamificationData()
  }, [])

  const loadGamificationData = () => {
    const state = gamificationManager.getState()
    const level = gamificationManager.getCurrentLevel()
    const progress = gamificationManager.getProgressToNextLevel()
    const unlocked = gamificationManager.getUnlockedAchievements()
    const locked = gamificationManager.getLockedAchievements()

    setCurrentLevel(level)
    setTotalPoints(state.totalPoints)
    setProgressToNext(progress)
    setUnlockedAchievements(unlocked)
    setLockedAchievements(locked)
  }

  const categories = [
    { id: 'all', label: 'All', icon: '🎯' },
    { id: 'baseline', label: 'Baseline', icon: '🌅' },
    { id: 'triad', label: 'Triad', icon: '⚡' },
    { id: 'journal', label: 'Journal', icon: '📝' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
    { id: 'special', label: 'Special', icon: '✨' },
  ]

  const filteredUnlocked = selectedCategory === 'all'
    ? unlockedAchievements
    : unlockedAchievements.filter(a => a.category === selectedCategory)

  const filteredLocked = selectedCategory === 'all'
    ? lockedAchievements
    : lockedAchievements.filter(a => a.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Achievements</h1>
              <p className="text-gray-300">Track your transformation journey</p>
            </div>
          </div>
        </motion.div>

        {/* Level & Points Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Level {currentLevel?.level}</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {currentLevel?.title}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
              <div className="text-sm text-gray-300">Total Points</div>
            </div>
          </div>

          {/* Progress bar to next level */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Progress to Level {(currentLevel?.level || 0) + 1}</span>
              <span>{Math.round(progressToNext.percentage)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {progressToNext.current} / {progressToNext.needed} points
            </div>
          </div>

          {/* Perks */}
          {currentLevel && currentLevel.perks.length > 0 && (
            <div className="pt-3 border-t border-yellow-500/20">
              <div className="text-sm text-gray-300 mb-2">Level Perks:</div>
              <div className="flex flex-wrap gap-2">
                {currentLevel.perks.map((perk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs text-yellow-300"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="p-4 bg-green-500/10 backdrop-blur-lg rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Unlocked</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{unlockedAchievements.length}</div>
          </div>
          <div className="p-4 bg-gray-500/10 backdrop-blur-lg rounded-xl border border-gray-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Locked</span>
            </div>
            <div className="text-2xl font-bold text-gray-400">{lockedAchievements.length}</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Unlocked Achievements */}
        {filteredUnlocked.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Unlocked ({filteredUnlocked.length})
            </h3>
            <div className="grid gap-4">
              {filteredUnlocked.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl border border-green-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{achievement.title}</h4>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          +{achievement.points} points
                        </span>
                        {achievement.unlockedAt && (
                          <span>
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked Achievements */}
        {filteredLocked.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Locked ({filteredLocked.length})
            </h3>
            <div className="grid gap-4">
              {filteredLocked.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl opacity-40">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-gray-300">{achievement.title}</h4>
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>

                      {/* Progress bar */}
                      {achievement.progress > 0 && (
                        <div className="mb-2">
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(achievement.progress)}% complete
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-gray-500" />
                          {achievement.points} points
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredUnlocked.length === 0 && filteredLocked.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No achievements in this category yet.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
