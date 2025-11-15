'use client'

import { useState, useEffect } from 'react'
import { Plus, Target, Trash2, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Habit {
  id: string
  habitName: string
  habitType: 'break' | 'build'
  currentBehavior: string
  desiredBehavior: string
  status: string
  createdAt: string
  painPleasureExercises: any[]
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    habitName: '',
    habitType: 'break' as 'break' | 'build',
    currentBehavior: '',
    desiredBehavior: ''
  })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const res = await fetch('/api/habits')
      const data = await res.json()
      setHabits(data.habits || [])
    } catch (error) {
      console.error('Failed to load habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.habit) {
        setHabits([data.habit, ...habits])
        setShowForm(false)
        setFormData({
          habitName: '',
          habitType: 'break',
          currentBehavior: '',
          desiredBehavior: ''
        })
      }
    } catch (error) {
      console.error('Failed to create habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Your Transformation Goals
          </h1>
          <p className="text-gray-600">
            Track habits you want to break or build. Use the Transform tool to create lasting change.
          </p>
        </div>

        {/* Create Habit Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="glass rounded-xl p-4 mb-6 w-full flex items-center justify-center gap-3 hover:bg-white/80 transition-all group"
          >
            <Plus className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700">Add New Transformation Goal</span>
          </button>
        )}

        {/* Create Habit Form */}
        {showForm && (
          <div className="glass rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Create Transformation Goal</h2>
            <form onSubmit={createHabit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to transform?
                </label>
                <input
                  type="text"
                  value={formData.habitName}
                  onChange={(e) => setFormData({ ...formData, habitName: e.target.value })}
                  placeholder="e.g., Procrastination, Exercise routine, Healthy eating"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of transformation
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, habitType: 'break' })}
                    className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all ${
                      formData.habitType === 'break'
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Break a Habit</div>
                    <div className="text-sm mt-1 text-gray-600">Stop doing something</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, habitType: 'build' })}
                    className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all ${
                      formData.habitType === 'build'
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Build a Habit</div>
                    <div className="text-sm mt-1 text-gray-600">Start doing something</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current behavior (what you do now)
                </label>
                <textarea
                  value={formData.currentBehavior}
                  onChange={(e) => setFormData({ ...formData, currentBehavior: e.target.value })}
                  placeholder="Describe your current pattern or behavior..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired behavior (what you want instead)
                </label>
                <textarea
                  value={formData.desiredBehavior}
                  onChange={(e) => setFormData({ ...formData, desiredBehavior: e.target.value })}
                  placeholder="Describe your desired outcome or behavior..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 glass rounded-xl font-medium hover:bg-white/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits List */}
        {loading && habits.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-gray-500">
            Loading your transformation goals...
          </div>
        ) : habits.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No transformation goals yet</h3>
            <p className="text-gray-500">Create your first goal to start your transformation journey!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {habits.map((habit) => (
              <div key={habit.id} className="glass rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{habit.habitName}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          habit.habitType === 'break'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {habit.habitType === 'break' ? 'Break' : 'Build'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Current: </span>
                        <span className="text-gray-700">{habit.currentBehavior}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Desired: </span>
                        <span className="text-gray-700">{habit.desiredBehavior}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise Status */}
                {habit.painPleasureExercises.length > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Pain & Pleasure exercise completed
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                    <div className="text-sm text-purple-700">
                      Ready for transformation exercise
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/transform/${habit.id}`}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {habit.painPleasureExercises.length > 0 ? 'Review Exercise' : 'Start Transform'}
                    </div>
                  </Link>
                  <button
                    className="px-4 py-3 glass rounded-xl hover:bg-red-50 transition-all group"
                    title="Delete habit"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
