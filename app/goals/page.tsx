'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, CheckCircle2, Circle } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { gamificationManager } from '@/lib/gamification'
import { notificationManager } from '@/lib/notifications'

type Goal = {
  id: string
  label: string
  completed: boolean
  category: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    // Load goals from onboarding
    if (typeof window !== 'undefined') {
      const onboardingData = localStorage.getItem('onboardingData')
      if (onboardingData) {
        const data = JSON.parse(onboardingData)
        const initialGoals: Goal[] = [
          { id: 'health1', label: 'Exercise 3x per week', completed: false, category: 'health' },
          { id: 'health2', label: 'Drink 8 glasses of water daily', completed: false, category: 'health' },
          { id: 'career1', label: 'Complete one online course', completed: false, category: 'career' },
          { id: 'career2', label: 'Network with 3 new people', completed: false, category: 'career' },
          { id: 'relationships1', label: 'Weekly quality time with family', completed: false, category: 'relationships' },
          { id: 'relationships2', label: 'Call an old friend', completed: false, category: 'relationships' },
          { id: 'personal1', label: 'Meditate for 10 minutes daily', completed: false, category: 'personal' },
          { id: 'personal2', label: 'Read for 30 minutes daily', completed: false, category: 'personal' },
          { id: 'finances1', label: 'Create a monthly budget', completed: false, category: 'finances' },
          { id: 'finances2', label: 'Save 10% of income', completed: false, category: 'finances' },
        ]

        // Filter goals based on selected categories from onboarding
        const selectedGoals = data.goals || []
        const filteredGoals = initialGoals.filter(goal =>
          selectedGoals.some((sg: string) => goal.category === sg)
        )

        // Load saved completion state
        const savedGoals = localStorage.getItem('userGoals')
        if (savedGoals) {
          const savedState = JSON.parse(savedGoals)
          setGoals(filteredGoals.map(goal => ({
            ...goal,
            completed: savedState[goal.id] || false
          })))
        } else {
          setGoals(filteredGoals)
        }
      }
    }
  }, [])

  const toggleGoal = (goalId: string) => {
    setGoals(prev => {
      const goal = prev.find(g => g.id === goalId)
      const wasCompleted = goal?.completed || false

      const updated = prev.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )

      // Save to localStorage
      const savedState = updated.reduce((acc, goal) => ({
        ...acc,
        [goal.id]: goal.completed
      }), {})
      localStorage.setItem('userGoals', JSON.stringify(savedState))

      // Track gamification - only award points when completing (not uncompleting)
      const nowCompleted = updated.find(g => g.id === goalId)?.completed
      if (!wasCompleted && nowCompleted) {
        const { points, achievements } = gamificationManager.trackAction('goal-completed')
        console.log(`🎉 +${points} points earned for completing a goal!`)

        // Show achievement notifications
        if (achievements.length > 0) {
          achievements.forEach(achievement => {
            notificationManager.showNotification(`🏆 Achievement Unlocked!`, {
              body: `${achievement.title}: ${achievement.description}`,
              tag: `achievement-${achievement.id}`,
              icon: '/icon-192.png'
            })
          })
        }

        // Show success notification
        notificationManager.showNotification(`🎯 Goal Completed!`, {
          body: `+${points} points! Keep building momentum!`,
          tag: 'goal-completed'
        })
      }

      return updated
    })
  }

  const completedCount = goals.filter(g => g.completed).length
  const totalCount = goals.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const categories = Array.from(new Set(goals.map(g => g.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">My Goals</h1>
          </div>
          <p className="text-purple-200">Track your progress towards transformation</p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Overall Progress</h2>
              <p className="text-sm text-purple-200">
                {completedCount} of {totalCount} goals completed
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>

          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Goals by Category */}
        {categories.map((category, index) => {
          const categoryGoals = goals.filter(g => g.category === category)
          const categoryCompleted = categoryGoals.filter(g => g.completed).length
          const categoryProgress = (categoryCompleted / categoryGoals.length) * 100

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke={
                          categoryProgress === 100 ? '#4ade80' :
                          categoryProgress >= 50 ? '#fbbf24' : '#a855f7'
                        }
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - categoryProgress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {categoryCompleted}/{categoryGoals.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {categoryGoals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                      goal.completed
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                    }`}
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-purple-300 flex-shrink-0" />
                    )}
                    <span className={goal.completed ? 'line-through text-purple-200' : ''}>
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )
        })}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200">
              Complete onboarding to set your goals
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
