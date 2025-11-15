'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Target, Heart, Briefcase, Users, Brain, Dumbbell, Sparkles, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getOrCreateUser, saveOnboardingData } from '@/lib/supabase'

type OnboardingStep = 'name' | 'goals' | 'satisfaction' | 'motivation' | 'challenge' | 'checkin' | 'summary'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('name')
  const [data, setData] = useState({
    name: '',
    email: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '',
    goals: [] as string[],
    customGoals: [] as string[], // NEW: Store custom goals
    satisfaction: {
      health: 5,
      career: 5,
      relationships: 5,
      personal: 5,
      finances: 5
    },
    motivationStyle: '',
    challenge: '',
    checkinTime: '09:00'
  })

  const [customGoalInput, setCustomGoalInput] = useState('')
  const [showCustomGoalInput, setShowCustomGoalInput] = useState(false)

  const goalOptions = [
    { id: 'health', label: 'Improve Health & Fitness', icon: Dumbbell },
    { id: 'career', label: 'Advance My Career', icon: Briefcase },
    { id: 'relationships', label: 'Better Relationships', icon: Heart },
    { id: 'confidence', label: 'Build Confidence', icon: Sparkles },
    { id: 'habits', label: 'Break Bad Habits', icon: Target },
    { id: 'growth', label: 'Personal Growth', icon: Brain },
    { id: 'leadership', label: 'Develop Leadership', icon: Users }
  ]

  const motivationOptions = [
    { id: 'pain', label: 'Moving Away from Pain', description: 'I\'m motivated by avoiding negative outcomes' },
    { id: 'pleasure', label: 'Moving Toward Pleasure', description: 'I\'m motivated by achieving positive goals' },
    { id: 'both', label: 'Balanced Approach', description: 'I use both pain and pleasure equally' }
  ]

  const challengeOptions = [
    'Lack of motivation',
    'Self-doubt and limiting beliefs',
    'Procrastination',
    'Fear of failure',
    'Lack of clarity on goals',
    'Inconsistency and follow-through',
    'Negative thinking patterns'
  ]

  const steps: OnboardingStep[] = ['name', 'goals', 'satisfaction', 'motivation', 'challenge', 'checkin', 'summary']
  const currentStepIndex = steps.indexOf(step)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleComplete = async () => {
    // Save onboarding data to localStorage
    localStorage.setItem('onboardingData', JSON.stringify(data))

    // TODO: Send to API when user creates account

    // Redirect to baseline check
    router.push('/baseline')
  }

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const addCustomGoal = () => {
    if (customGoalInput.trim()) {
      setData(prev => ({
        ...prev,
        customGoals: [...prev.customGoals, customGoalInput.trim()]
      }))
      setCustomGoalInput('')
      setShowCustomGoalInput(false)
    }
  }

  const removeCustomGoal = (index: number) => {
    setData(prev => ({
      ...prev,
      customGoals: prev.customGoals.filter((_, i) => i !== index)
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 'name':
        return data.name.trim().length > 0
      case 'goals':
        return data.goals.length > 0 || data.customGoals.length > 0
      case 'motivation':
        return data.motivationStyle !== ''
      case 'challenge':
        return data.challenge !== ''
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">What's your name?</h2>
              <p className="text-purple-200 mb-6">Let's personalize your experience</p>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 text-lg focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </motion.div>
          )}

          {/* Step 2: Goals */}
          {step === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">What are your goals?</h2>
              <p className="text-purple-200 mb-6">Select all that apply or add your own</p>

              {/* Predefined Goals */}
              <div className="space-y-3 mb-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      data.goals.includes(goal.id)
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <goal.icon className="w-6 h-6" />
                    <span className="flex-1 text-left">{goal.label}</span>
                    {data.goals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Goals List */}
              {data.customGoals.length > 0 && (
                <div className="space-y-3 mb-4">
                  {data.customGoals.map((customGoal, index) => (
                    <div
                      key={index}
                      className="w-full p-4 rounded-xl border-2 border-green-500 bg-green-500/20 flex items-center gap-4"
                    >
                      <Sparkles className="w-6 h-6 text-green-400" />
                      <span className="flex-1 text-left">{customGoal}</span>
                      <button
                        onClick={() => removeCustomGoal(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Goal Button/Input */}
              {!showCustomGoalInput ? (
                <button
                  onClick={() => setShowCustomGoalInput(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-white/30 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 text-purple-200 hover:text-white"
                >
                  <Plus className="w-5 h-5" />
                  Add Custom Goal
                </button>
              ) : (
                <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-500/10">
                  <input
                    type="text"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
                    placeholder="e.g., Learn to play guitar, Run a marathon..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 mb-3 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addCustomGoal}
                      disabled={!customGoalInput.trim()}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Add Goal
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomGoalInput(false)
                        setCustomGoalInput('')
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Life Satisfaction */}
          {step === 'satisfaction' && (
            <motion.div
              key="satisfaction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">Rate your life satisfaction</h2>
              <p className="text-purple-200 mb-6">On a scale of 1-10, how satisfied are you in these areas?</p>
              <div className="space-y-6">
                {Object.keys(data.satisfaction).map((area) => (
                  <div key={area}>
                    <div className="flex justify-between mb-2">
                      <span className="capitalize">{area}</span>
                      <span className="font-bold text-purple-300">
                        {data.satisfaction[area as keyof typeof data.satisfaction]}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={data.satisfaction[area as keyof typeof data.satisfaction]}
                      onChange={(e) => setData({
                        ...data,
                        satisfaction: {
                          ...data.satisfaction,
                          [area]: parseInt(e.target.value)
                        }
                      })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Motivation Style */}
          {step === 'motivation' && (
            <motion.div
              key="motivation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">What motivates you most?</h2>
              <p className="text-purple-200 mb-6">Understanding your motivation style helps us personalize your coaching</p>
              <div className="space-y-4">
                {motivationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, motivationStyle: option.id })}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      data.motivationStyle === option.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-lg">{option.label}</span>
                      {data.motivationStyle === option.id && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <p className="text-sm text-purple-200">{option.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Biggest Challenge */}
          {step === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">What's your biggest challenge?</h2>
              <p className="text-purple-200 mb-6">We'll focus on helping you overcome this</p>
              <div className="space-y-3">
                {challengeOptions.map((challenge) => (
                  <button
                    key={challenge}
                    onClick={() => setData({ ...data, challenge })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      data.challenge === challenge
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {challenge}
                    {data.challenge === challenge && (
                      <Check className="w-5 h-5 text-purple-400 float-right" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 6: Check-in Time */}
          {step === 'checkin' && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">When should we check in?</h2>
              <p className="text-purple-200 mb-6">Choose your preferred time for daily power questions</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-purple-200 mb-2">Preferred Time</label>
                  <input
                    type="time"
                    value={data.checkinTime}
                    onChange={(e) => setData({ ...data, checkinTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-blue-100">
                    💡 We'll send you a daily power question at this time to keep you on track
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Summary */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">You're all set, {data.name}!</h2>
                <p className="text-purple-200">Here's your personalized transformation plan:</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-purple-300 mb-1">Primary Goals</p>
                  <p className="font-semibold">
                    {data.goals.map(g => goalOptions.find(opt => opt.id === g)?.label).join(', ')}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-purple-300 mb-1">Focus Area</p>
                  <p className="font-semibold">{data.challenge}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-purple-300 mb-1">Daily Check-in</p>
                  <p className="font-semibold">{data.checkinTime}</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 mb-6">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="space-y-2 text-sm text-purple-100">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-purple-400" />
                    <span>Answer your first power question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-purple-400" />
                    <span>Create your first transformation goal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-purple-400" />
                    <span>Experience the Pain & Pleasure technique</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          {step !== 'summary' ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start Transformation
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}
