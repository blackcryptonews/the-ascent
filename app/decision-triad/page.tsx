'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Focus, Lightbulb, Zap, Check, ArrowRight, Timer, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { notificationManager } from '@/lib/notifications'
import { gamificationManager } from '@/lib/gamification'

type TriadStep = 'focus' | 'meaning' | 'action' | 'complete'

const FOCUS_OPTIONS = [
  { id: 'health', label: 'My Health & Energy', icon: '💪' },
  { id: 'relationships', label: 'My Relationships', icon: '❤️' },
  { id: 'career', label: 'My Career Growth', icon: '🚀' },
  { id: 'finances', label: 'My Financial Freedom', icon: '💰' },
  { id: 'personal', label: 'My Personal Growth', icon: '🌱' },
]

const MEANING_TEMPLATES = {
  health: [
    'This is my chance to honor my body and feel unstoppable',
    'Every healthy choice compounds into massive energy gains',
    'I\'m building the foundation for my best years ahead',
  ],
  relationships: [
    'This moment strengthens bonds that last a lifetime',
    'Love and connection are my greatest sources of power',
    'I\'m creating memories that will inspire others',
  ],
  career: [
    'This is how I contribute my unique gifts to the world',
    'Every step forward builds momentum toward my vision',
    'I\'m proving to myself what I\'re truly capable of',
  ],
  finances: [
    'Financial freedom means more time with loved ones',
    'This is how I create choices and opportunities',
    'I\'m building security for my family\'s future',
  ],
  personal: [
    'Growth is the only way to truly live',
    'This is how I become the person I\'m meant to be',
    'Every challenge is shaping my ultimate potential',
  ],
}

const MICRO_ACTIONS = {
  health: [
    { action: '20 push-ups RIGHT NOW', duration: 60 },
    { action: '1-minute plank hold', duration: 60 },
    { action: '10 deep breaths with intention', duration: 90 },
    { action: 'Drink a full glass of water', duration: 30 },
  ],
  relationships: [
    { action: 'Send a heartfelt text to someone you love', duration: 90 },
    { action: 'Call a friend just to say hi', duration: 120 },
    { action: 'Write down 3 things you appreciate about your partner', duration: 90 },
  ],
  career: [
    { action: 'Tackle the hardest task on your list for 5 minutes', duration: 300 },
    { action: 'Send one important email you\'ve been avoiding', duration: 120 },
    { action: 'Learn one new skill-building tip', duration: 180 },
  ],
  finances: [
    { action: 'Review one bill and find a way to reduce it', duration: 180 },
    { action: 'Transfer $5 to savings RIGHT NOW', duration: 60 },
    { action: 'Track today\'s spending in detail', duration: 120 },
  ],
  personal: [
    { action: 'Journal 3 wins from this week', duration: 120 },
    { action: 'Read 5 pages of a growth book', duration: 180 },
    { action: 'Visualize your ideal day for 2 minutes', duration: 120 },
  ],
}

export default function DecisionTriadPage() {
  const router = useRouter()
  const [step, setStep] = useState<TriadStep>('focus')
  const [selectedFocus, setSelectedFocus] = useState<string>('')
  const [customFocus, setCustomFocus] = useState('')
  const [selectedMeaning, setSelectedMeaning] = useState('')
  const [customMeaning, setCustomMeaning] = useState('')
  const [selectedAction, setSelectedAction] = useState<{ action: string; duration: number } | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [challengeStreak, setChallengeStreak] = useState(0)
  const [lastCompletionTime, setLastCompletionTime] = useState<number>(0)

  useEffect(() => {
    // Load challenge streak from localStorage
    if (typeof window !== 'undefined') {
      const streak = localStorage.getItem('decisionTriadStreak')
      const lastCompletion = localStorage.getItem('lastTriadCompletion')
      if (streak) setChallengeStreak(parseInt(streak))
      if (lastCompletion) setLastCompletionTime(parseInt(lastCompletion))
    }
  }, [])

  useEffect(() => {
    // Timer countdown
    if (isTimerRunning && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timeRemaining === 0 && isTimerRunning) {
      handleTimerComplete()
    }
  }, [isTimerRunning, timeRemaining])

  // Check for 2-minute pattern break (challenge reset)
  useEffect(() => {
    if (lastCompletionTime > 0) {
      let warningShown = false

      const interval = setInterval(() => {
        const timeSinceLastCompletion = Date.now() - lastCompletionTime
        const twoMinutes = 2 * 60 * 1000
        const ninetySeconds = 90 * 1000

        // Send notification 90 seconds before reset
        if (timeSinceLastCompletion >= ninetySeconds && timeSinceLastCompletion < twoMinutes && !warningShown && challengeStreak > 0) {
          warningShown = true
          notificationManager.patternBreakAlert()
        }

        if (timeSinceLastCompletion > twoMinutes && challengeStreak > 0) {
          // Pattern break! Reset with compassion
          handlePatternBreak()
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lastCompletionTime, challengeStreak])

  const handlePatternBreak = () => {
    localStorage.setItem('decisionTriadStreak', '0')
    setChallengeStreak(0)
    gamificationManager.resetStreak('triad')
    alert('⏰ Pattern Break Detected\n\nYour 10-day challenge has reset. That\'s okay - this is where growth happens! Take a breath, reflect on what pulled you away, and start fresh.')
  }

  const handleFocusSelect = (focusId: string) => {
    setSelectedFocus(focusId)
  }

  const handleContinueToMeaning = () => {
    if (selectedFocus || customFocus) {
      setStep('meaning')
    }
  }

  const handleMeaningSelect = (meaning: string) => {
    setSelectedMeaning(meaning)
  }

  const handleContinueToAction = () => {
    if (selectedMeaning || customMeaning) {
      setStep('action')
    }
  }

  const handleActionSelect = (action: { action: string; duration: number }) => {
    setSelectedAction(action)
    setTimeRemaining(action.duration)
    setIsTimerRunning(true)
  }

  const handleTimerComplete = () => {
    setIsTimerRunning(false)

    // Update streak
    const newStreak = challengeStreak + 1
    setChallengeStreak(newStreak)
    const now = Date.now()
    setLastCompletionTime(now)

    localStorage.setItem('decisionTriadStreak', newStreak.toString())
    localStorage.setItem('lastTriadCompletion', now.toString())

    // Award points and check achievements
    const { points, achievements } = gamificationManager.trackAction('decision-triad')
    console.log(`🎉 +${points} points earned!`)

    // Show achievement notifications
    achievements.forEach(achievement => {
      notificationManager.showNotification(`🏆 Achievement Unlocked!`, {
        body: `${achievement.title}: ${achievement.description}`,
        tag: `achievement-${achievement.id}`
      })
    })

    // Show completion
    setStep('complete')
  }

  const handleRestart = () => {
    setStep('focus')
    setSelectedFocus('')
    setCustomFocus('')
    setSelectedMeaning('')
    setCustomMeaning('')
    setSelectedAction(null)
    setTimeRemaining(0)
    setIsTimerRunning(false)
  }

  const getFocusType = () => selectedFocus || 'personal'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header with Streak */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Decision Triad</h1>
            <p className="text-gray-400">90-Second Power Ritual</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-xl border border-yellow-500/30">
            <Flame className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{challengeStreak}</span>
            <span className="text-sm text-yellow-200">day streak</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-3 h-3 rounded-full ${step !== 'focus' ? 'bg-yellow-500' : 'bg-gray-600'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'action' || step === 'complete' ? 'bg-yellow-500' : 'bg-gray-600'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 'complete' ? 'bg-yellow-500' : 'bg-gray-600'}`} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Focus */}
          {step === 'focus' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Focus className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What matters most RIGHT NOW?</h2>
                  <p className="text-gray-400 text-sm">Step 1 of 3 • Choose your focus</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {FOCUS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFocusSelect(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      selectedFocus === option.id
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-semibold">{option.label}</span>
                    {selectedFocus === option.id && (
                      <Check className="w-5 h-5 text-yellow-400 ml-auto" />
                    )}
                  </button>
                ))}

                <input
                  type="text"
                  value={customFocus}
                  onChange={(e) => {
                    setCustomFocus(e.target.value)
                    setSelectedFocus('')
                  }}
                  placeholder="Or create your own focus..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button
                onClick={handleContinueToMeaning}
                disabled={!selectedFocus && !customFocus}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Meaning
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Meaning */}
          {step === 'meaning' && (
            <motion.div
              key="meaning"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What does this MEAN?</h2>
                  <p className="text-gray-400 text-sm">Step 2 of 3 • Reframe with power</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {MEANING_TEMPLATES[getFocusType() as keyof typeof MEANING_TEMPLATES].map((meaning, index) => (
                  <button
                    key={index}
                    onClick={() => handleMeaningSelect(meaning)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMeaning === meaning
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <p className="text-lg leading-relaxed">{meaning}</p>
                    {selectedMeaning === meaning && (
                      <Check className="w-5 h-5 text-cyan-400 mt-2" />
                    )}
                  </button>
                ))}

                <textarea
                  value={customMeaning}
                  onChange={(e) => {
                    setCustomMeaning(e.target.value)
                    setSelectedMeaning('')
                  }}
                  placeholder="Or create your own empowering meaning..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                onClick={handleContinueToAction}
                disabled={!selectedMeaning && !customMeaning}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Action
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 3: Action */}
          {step === 'action' && (
            <motion.div
              key="action"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What action will you take NOW?</h2>
                  <p className="text-gray-400 text-sm">Step 3 of 3 • Micro-action with timer</p>
                </div>
              </div>

              {!isTimerRunning ? (
                <div className="space-y-3">
                  {MICRO_ACTIONS[getFocusType() as keyof typeof MICRO_ACTIONS].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionSelect(item)}
                      className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/5 hover:border-red-500 hover:bg-red-500/20 transition-all text-left flex items-center justify-between"
                    >
                      <span className="font-semibold">{item.action}</span>
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <Timer className="w-4 h-4" />
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-8xl font-bold text-red-500 mb-4">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-2xl font-bold mb-2">{selectedAction?.action}</p>
                  <p className="text-gray-400">Focus. Execute. Win.</p>

                  <div className="mt-8 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeRemaining / (selectedAction?.duration || 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Completion Screen */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-12 border border-yellow-500/30 text-center"
            >
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-black" />
              </div>

              <h2 className="text-4xl font-bold mb-4">POWER ACTIVATED!</h2>
              <p className="text-2xl mb-2">Streak: {challengeStreak} days</p>
              <p className="text-gray-300 mb-8">
                You just proved you're in control. This is how champions are built.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
                >
                  Do Another Triad
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
