'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, AlertTriangle, TrendingUp, Sparkles, Plus, X } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'

type Value = {
  id: string
  name: string
  importance: number // 1-5 scale
}

type Goal = {
  id: string
  name: string
  category: string
  completed: boolean
  valueAlignments: { [valueId: string]: number } // How much this goal aligns with each value (0-100)
}

type Conflict = {
  value1: string
  value2: string
  severity: 'high' | 'medium' | 'low'
}

export default function AlignmentMatrixPage() {
  const [values, setValues] = useState<Value[]>([
    { id: 'integrity', name: 'Integrity', importance: 5 },
    { id: 'growth', name: 'Growth', importance: 5 },
    { id: 'contribution', name: 'Contribution', importance: 4 },
    { id: 'love', name: 'Love', importance: 5 },
    { id: 'excellence', name: 'Excellence', importance: 4 },
    { id: 'security', name: 'Security', importance: 3 },
    { id: 'freedom', name: 'Freedom', importance: 5 }
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Exercise 3x per week',
      category: 'health',
      completed: false,
      valueAlignments: {
        integrity: 80,
        growth: 90,
        contribution: 30,
        love: 60,
        excellence: 85,
        security: 70,
        freedom: 50
      }
    },
    {
      id: '2',
      name: 'Start my own business',
      category: 'career',
      completed: false,
      valueAlignments: {
        integrity: 90,
        growth: 100,
        contribution: 95,
        love: 50,
        excellence: 100,
        security: 20, // Low security = conflict
        freedom: 100  // High freedom = conflict with security
      }
    },
    {
      id: '3',
      name: 'Spend quality time with family weekly',
      category: 'relationships',
      completed: false,
      valueAlignments: {
        integrity: 95,
        growth: 60,
        contribution: 80,
        love: 100,
        excellence: 70,
        security: 90,
        freedom: 40
      }
    }
  ])

  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState('health')
  const [previewAlignments, setPreviewAlignments] = useState<{ [valueId: string]: number } | null>(null)

  // Calculate overall alignment score
  const calculateAlignmentScore = (goal: Goal): number => {
    let totalScore = 0
    let totalWeight = 0

    values.forEach(value => {
      const alignment = goal.valueAlignments[value.id] || 0
      const weight = value.importance
      totalScore += (alignment * weight)
      totalWeight += (weight * 100) // Max possible for this value
    })

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  // Detect conflicts between values
  const detectConflicts = (goal: Goal): Conflict[] => {
    const conflicts: Conflict[] = []

    // Security vs Freedom conflict
    const securityAlignment = goal.valueAlignments['security'] || 0
    const freedomAlignment = goal.valueAlignments['freedom'] || 0
    const securityImportance = values.find(v => v.id === 'security')?.importance || 0
    const freedomImportance = values.find(v => v.id === 'freedom')?.importance || 0

    if (securityImportance >= 3 && freedomImportance >= 3) {
      const diff = Math.abs(securityAlignment - freedomAlignment)
      if (diff > 50) {
        conflicts.push({
          value1: 'Security',
          value2: 'Freedom',
          severity: diff > 70 ? 'high' : 'medium'
        })
      }
    }

    // Love vs Excellence conflict (perfectionism can harm relationships)
    const loveAlignment = goal.valueAlignments['love'] || 0
    const excellenceAlignment = goal.valueAlignments['excellence'] || 0
    const loveImportance = values.find(v => v.id === 'love')?.importance || 0
    const excellenceImportance = values.find(v => v.id === 'excellence')?.importance || 0

    if (loveImportance >= 4 && excellenceImportance >= 4) {
      if (excellenceAlignment > 90 && loveAlignment < 50) {
        conflicts.push({
          value1: 'Excellence',
          value2: 'Love',
          severity: 'medium'
        })
      }
    }

    return conflicts
  }

  // Calculate overall goal completion
  const goalCompletionPercentage = goals.length > 0
    ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100)
    : 0

  // Calculate weighted value alignment score
  const overallValueAlignment = (): number => {
    if (goals.length === 0) return 0

    let totalScore = 0
    goals.forEach(goal => {
      totalScore += calculateAlignmentScore(goal)
    })

    return Math.round(totalScore / goals.length)
  }

  const valueAlignmentScore = overallValueAlignment()

  // Generate AI-based alignment preview for new goals
  const generateAlignmentPreview = (goalName: string, category: string) => {
    // Simple heuristic-based alignment generator (in production, this would use AI)
    const alignments: { [key: string]: number } = {}

    values.forEach(value => {
      let score = 50 // Base score

      // Category-based adjustments
      if (category === 'health') {
        if (value.id === 'growth') score = 85
        if (value.id === 'excellence') score = 80
        if (value.id === 'integrity') score = 75
      } else if (category === 'career') {
        if (value.id === 'growth') score = 95
        if (value.id === 'excellence') score = 90
        if (value.id === 'contribution') score = 85
        if (value.id === 'security') score = goalName.toLowerCase().includes('business') ? 30 : 80
        if (value.id === 'freedom') score = goalName.toLowerCase().includes('business') ? 95 : 60
      } else if (category === 'relationships') {
        if (value.id === 'love') score = 100
        if (value.id === 'contribution') score = 80
        if (value.id === 'integrity') score = 90
      }

      alignments[value.id] = score
    })

    setPreviewAlignments(alignments)
  }

  useEffect(() => {
    if (newGoalName.length > 3) {
      generateAlignmentPreview(newGoalName, newGoalCategory)
    } else {
      setPreviewAlignments(null)
    }
  }, [newGoalName, newGoalCategory])

  const addNewGoal = () => {
    if (!newGoalName.trim() || !previewAlignments) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName,
      category: newGoalCategory,
      completed: false,
      valueAlignments: previewAlignments
    }

    setGoals([...goals, newGoal])
    setNewGoalName('')
    setShowNewGoalModal(false)
    setPreviewAlignments(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pb-24">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Alignment Matrix</h1>
          </div>
          <p className="text-purple-200">Track how your goals align with your core values</p>
        </motion.div>

        {/* Dual Progress Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-6">Overall Progress</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Goal Completion Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#goalGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - goalCompletionPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{goalCompletionPercentage}%</span>
                  <span className="text-xs text-purple-300">Completed</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Goal Completion</h3>
              <p className="text-sm text-purple-200">{goals.filter(g => g.completed).length} of {goals.length} goals</p>
            </div>

            {/* Value Alignment Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#valueGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - valueAlignmentScore / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="valueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{valueAlignmentScore}%</span>
                  <span className="text-xs text-purple-300">Aligned</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Value Alignment</h3>
              <p className="text-sm text-purple-200">How well goals match values</p>
            </div>
          </div>

          {valueAlignmentScore >= 80 && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-sm text-green-100">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Excellent alignment! Your goals strongly support your core values.
              </p>
            </div>
          )}

          {valueAlignmentScore < 60 && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-sm text-yellow-100">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Consider reviewing your goals. Low alignment may lead to lack of motivation.
              </p>
            </div>
          )}
        </motion.div>

        {/* Goals with Alignment Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Goals</h2>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((goal, index) => {
              const alignmentScore = calculateAlignmentScore(goal)
              const conflicts = detectConflicts(goal)

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{goal.name}</h3>
                      <p className="text-sm text-purple-200 capitalize">{goal.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold mb-1">
                        {alignmentScore}%
                      </div>
                      <div className="text-xs text-purple-300">Alignment</div>
                    </div>
                  </div>

                  {/* Conflict Alerts */}
                  {conflicts.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {conflicts.map((conflict, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border flex items-start gap-2 ${
                            conflict.severity === 'high'
                              ? 'bg-red-500/10 border-red-500/30'
                              : 'bg-orange-500/10 border-orange-500/30'
                          }`}
                        >
                          <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            conflict.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                          }`} />
                          <p className={`text-sm ${
                            conflict.severity === 'high' ? 'text-red-100' : 'text-orange-100'
                          }`}>
                            Conflict detected: This goal strongly favors <strong>{conflict.value1}</strong> over{' '}
                            <strong>{conflict.value2}</strong>. Consider if this aligns with your priorities.
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Value Alignment Bars */}
                  <div className="space-y-2">
                    {values.map(value => {
                      const score = goal.valueAlignments[value.id] || 0
                      return (
                        <div key={value.id} className="flex items-center gap-3">
                          <div className="w-24 text-sm text-purple-200 flex items-center gap-2">
                            {value.name}
                            {value.importance >= 4 && (
                              <span className="text-xs text-yellow-400">★</span>
                            )}
                          </div>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                score >= 80 ? 'bg-green-500' :
                                score >= 60 ? 'bg-blue-500' :
                                score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-right text-purple-300">
                            {score}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* New Goal Modal */}
        {showNewGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl p-8 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Goal</h2>
                <button
                  onClick={() => {
                    setShowNewGoalModal(false)
                    setNewGoalName('')
                    setPreviewAlignments(null)
                  }}
                  className="text-purple-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-purple-200 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="e.g., Run a marathon, Learn Spanish..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-purple-200 mb-2">Category</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career & Finance</option>
                    <option value="relationships">Relationships</option>
                    <option value="personal">Personal Growth</option>
                  </select>
                </div>
              </div>

              {/* Real-time Alignment Preview */}
              {previewAlignments && (
                <div className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Predicted Alignment</h3>
                    <div className="text-2xl font-bold">
                      {calculateAlignmentScore({
                        id: 'preview',
                        name: newGoalName,
                        category: newGoalCategory,
                        completed: false,
                        valueAlignments: previewAlignments
                      })}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    {values.map(value => {
                      const score = previewAlignments[value.id] || 0
                      return (
                        <div key={value.id} className="flex items-center gap-3">
                          <div className="w-24 text-sm text-purple-200">{value.name}</div>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 80 ? 'bg-green-500' :
                                score >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-right">{score}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={addNewGoal}
                disabled={!newGoalName.trim() || !previewAlignments}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Add Goal
              </button>
            </motion.div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
