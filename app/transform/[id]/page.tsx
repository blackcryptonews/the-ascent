'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Brain, AlertTriangle, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Habit {
  id: string
  habitName: string
  habitType: string
  currentBehavior: string
  desiredBehavior: string
}

type Step = 'intro' | 'pain-generate' | 'pain-visualize' | 'pain-intensity' |
            'pleasure-generate' | 'pleasure-visualize' | 'pleasure-intensity' | 'complete'

export default function TransformPage() {
  const params = useParams()
  const habitId = params.id as string

  const [habit, setHabit] = useState<Habit | null>(null)
  const [step, setStep] = useState<Step>('intro')
  const [loading, setLoading] = useState(false)

  const [painScenario, setPainScenario] = useState('')
  const [painVisualization, setPainVisualization] = useState('')
  const [painIntensity, setPainIntensity] = useState(5)

  const [pleasureScenario, setPleasureScenario] = useState('')
  const [pleasureVisualization, setPleasureVisualization] = useState('')
  const [pleasureIntensity, setPleasureIntensity] = useState(5)

  useEffect(() => {
    loadHabit()
  }, [habitId])

  const loadHabit = async () => {
    try {
      const res = await fetch('/api/habits')
      const data = await res.json()
      const foundHabit = data.habits?.find((h: Habit) => h.id === habitId)
      if (foundHabit) {
        setHabit(foundHabit)
      }
    } catch (error) {
      console.error('Failed to load habit:', error)
    }
  }

  const generatePainScenario = async () => {
    if (!habit) return

    setLoading(true)
    try {
      const res = await fetch(`/api/habits/${habitId}/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'generate_pain' })
      })
      const data = await res.json()
      setPainScenario(data.painScenario)
      setStep('pain-visualize')
    } catch (error) {
      console.error('Failed to generate pain scenario:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePleasureScenario = async () => {
    if (!habit) return

    setLoading(true)
    try {
      const res = await fetch(`/api/habits/${habitId}/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'generate_pleasure' })
      })
      const data = await res.json()
      setPleasureScenario(data.pleasureScenario)
      setStep('pleasure-visualize')
    } catch (error) {
      console.error('Failed to generate pleasure scenario:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeExercise = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/habits/${habitId}/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'complete',
          painScenario,
          painVisualization,
          painIntensity,
          pleasureScenario,
          pleasureVisualization,
          pleasureIntensity
        })
      })
      const data = await res.json()
      if (data.success) {
        setStep('complete')
      }
    } catch (error) {
      console.error('Failed to complete exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!habit) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/habits" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Habits
        </Link>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Transformation Progress</span>
            <span className="text-sm font-medium text-purple-600">
              {step === 'complete' ? '100%' : `${Math.round((
                ['intro', 'pain-generate', 'pain-visualize', 'pain-intensity',
                 'pleasure-generate', 'pleasure-visualize', 'pleasure-intensity', 'complete'].indexOf(step) / 7
              ) * 100)}%`}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
              style={{
                width: `${(['intro', 'pain-generate', 'pain-visualize', 'pain-intensity',
                           'pleasure-generate', 'pleasure-visualize', 'pleasure-intensity', 'complete'].indexOf(step) / 7) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Intro Step */}
        {step === 'intro' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-10 h-10 text-purple-600" />
              <h1 className="text-3xl font-bold gradient-text">The Dickens Pattern</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Transforming: {habit.habitName}</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">From: </span>
                  <span className="text-gray-700">{habit.currentBehavior}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">To: </span>
                  <span className="text-gray-700">{habit.desiredBehavior}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-gray-700">
                This powerful NLP (Neuro-Linguistic Programming) technique will help you create lasting change by:
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium text-gray-800">1. Linking PAIN to your old behavior</div>
                    <div className="text-sm text-gray-600">Visualize the cumulative cost of continuing this pattern</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium text-gray-800">2. Linking PLEASURE to your new behavior</div>
                    <div className="text-sm text-gray-600">Visualize the compounding benefits of transformation</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Your brain makes decisions based on pain and pleasure associations.
                  By creating intense emotional connections, we rewire your automatic responses.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('pain-generate')}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-lg"
            >
              Begin Transformation
            </button>
          </div>
        )}

        {/* Pain Generation */}
        {step === 'pain-generate' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-800">Step 1: Face the Pain</h1>
            </div>

            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                Let's visualize where you'll be in 5 years if you <strong>continue</strong> your current behavior.
                This isn't about judgment—it's about clarity.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  AI will generate a powerful scenario based on your habit. Take this seriously—the more vivid the pain,
                  the stronger your motivation to change.
                </p>
              </div>
            </div>

            <button
              onClick={generatePainScenario}
              disabled={loading}
              className="w-full px-8 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating Pain Scenario...' : 'Generate Pain Scenario'}
            </button>
          </div>
        )}

        {/* Pain Visualization */}
        {step === 'pain-visualize' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-800">Your Pain Scenario</h1>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{painScenario}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Close your eyes and visualize this scenario. What specific details do you see? How does it make you feel?
              </label>
              <textarea
                value={painVisualization}
                onChange={(e) => setPainVisualization(e.target.value)}
                placeholder="Describe what you see and feel in this future..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none resize-none"
              />
            </div>

            <button
              onClick={() => setStep('pain-intensity')}
              disabled={!painVisualization.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Pain Intensity */}
        {step === 'pain-intensity' && (
          <div className="glass rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">How intense is this pain?</h1>

            <div className="mb-8">
              <p className="text-gray-700 mb-6">
                On a scale of 1-10, how much emotional pain do you feel when you fully visualize this future?
              </p>

              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painIntensity}
                  onChange={(e) => setPainIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #dc2626 ${(painIntensity / 10) * 100}%, #fecaca ${(painIntensity / 10) * 100}%, #fecaca 100%)`
                  }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Mild discomfort</span>
                <span className="text-2xl font-bold text-red-600">{painIntensity}/10</span>
                <span>Unbearable</span>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">
                  The higher the intensity, the stronger your brain's association. Be honest with yourself.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('pleasure-generate')}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Continue to Pleasure Association
            </button>
          </div>
        )}

        {/* Pleasure Generation */}
        {step === 'pleasure-generate' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-green-500" />
              <h1 className="text-3xl font-bold text-gray-800">Step 2: Embrace the Pleasure</h1>
            </div>

            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                Now let's visualize where you'll be in 5 years after <strong>mastering</strong> your desired behavior.
                This is your empowered future.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  Feel the pride, confidence, and freedom that comes from transformation. Let this vision pull you forward.
                </p>
              </div>
            </div>

            <button
              onClick={generatePleasureScenario}
              disabled={loading}
              className="w-full px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating Pleasure Scenario...' : 'Generate Pleasure Scenario'}
            </button>
          </div>
        )}

        {/* Pleasure Visualization */}
        {step === 'pleasure-visualize' && (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-green-500" />
              <h1 className="text-3xl font-bold text-gray-800">Your Pleasure Scenario</h1>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{pleasureScenario}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Close your eyes and step into this empowered future. What do you see? How does it feel?
              </label>
              <textarea
                value={pleasureVisualization}
                onChange={(e) => setPleasureVisualization(e.target.value)}
                placeholder="Describe the pride, freedom, and confidence you feel..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none resize-none"
              />
            </div>

            <button
              onClick={() => setStep('pleasure-intensity')}
              disabled={!pleasureVisualization.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Pleasure Intensity */}
        {step === 'pleasure-intensity' && (
          <div className="glass rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">How intense is this pleasure?</h1>

            <div className="mb-8">
              <p className="text-gray-700 mb-6">
                On a scale of 1-10, how much joy and fulfillment do you feel when you fully embody this future?
              </p>

              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={pleasureIntensity}
                  onChange={(e) => setPleasureIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #22c55e 0%, #16a34a ${(pleasureIntensity / 10) * 100}%, #bbf7d0 ${(pleasureIntensity / 10) * 100}%, #bbf7d0 100%)`
                  }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Mildly pleasant</span>
                <span className="text-2xl font-bold text-green-600">{pleasureIntensity}/10</span>
                <span>Pure bliss</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  The stronger this positive association, the more naturally you'll move toward your goal.
                </p>
              </div>
            </div>

            <button
              onClick={completeExercise}
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Transformation...' : 'Complete Transformation'}
            </button>
          </div>
        )}

        {/* Complete */}
        {step === 'complete' && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold gradient-text mb-4">
              Transformation Complete!
            </h1>

            <p className="text-lg text-gray-700 mb-6">
              You've successfully created powerful neuro-associations. Your brain now has clear pain and pleasure
              anchors for your transformation.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-800 mb-3">What happens now:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Your subconscious has been reprogrammed with these associations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Review this exercise whenever you need reinforcement</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Notice how your automatic responses begin to shift</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Trust the process—change happens from the inside out</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link
                href="/habits"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-center"
              >
                Back to Habits
              </Link>
              <Link
                href="/"
                className="flex-1 px-8 py-4 glass rounded-xl font-medium hover:bg-white/80 transition-all text-center"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
