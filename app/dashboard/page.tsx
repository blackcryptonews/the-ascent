'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Brain, Mic, Square, Check, Sparkles, MessageSquare, X } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { GamificationStatus } from '@/components/gamification-status'
import { gamificationManager } from '@/lib/gamification'
import { notificationManager } from '@/lib/notifications'

type Sentiment = 'positive' | 'negative' | 'neutral'

export default function DashboardPage() {
  const [showPowerQuestion, setShowPowerQuestion] = useState(false)
  const [journalEntry, setJournalEntry] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [sentiment, setSentiment] = useState<Sentiment | null>(null)
  const [vocabularySuggestions, setVocabularySuggestions] = useState<string[]>([])
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string; category: string } | null>(null)
  const [dailyFocus, setDailyFocus] = useState<string>('MAKE TODAY MEANINGFUL')
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [journalSaved, setJournalSaved] = useState(false)

  // Load onboarding data
  const [userData, setUserData] = useState({
    name: 'User',
    streak: 7,
    goals: [],
    satisfaction: {
      health: 5,
      career: 5,
      relationships: 5,
      personal: 5,
      finances: 5
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user has completed baseline check today
      const lastBaselineDate = localStorage.getItem('lastBaselineDate')
      const today = new Date().toDateString()

      // If no baseline for today, redirect to baseline check
      if (lastBaselineDate !== today) {
        const { pathname } = window.location
        // Only redirect if we're actually on the dashboard (avoid redirect loops)
        if (pathname === '/dashboard') {
          window.location.href = '/baseline'
          return
        }
      }

      const onboardingData = localStorage.getItem('onboardingData')
      if (onboardingData) {
        const data = JSON.parse(onboardingData)
        setUserData(prev => ({
          ...prev,
          name: data.name || 'User',
          goals: data.goals || [],
          satisfaction: data.satisfaction || prev.satisfaction
        }))
      }

      // Load daily content based on baseline
      fetchDailyContent()
    }
  }, [])

  const fetchDailyContent = async () => {
    try {
      setIsLoadingContent(true)
      const baselineData = localStorage.getItem('dailyBaseline')

      if (baselineData) {
        const baseline = JSON.parse(baselineData)
        const onboardingData = localStorage.getItem('onboardingData')
        const userData = onboardingData ? JSON.parse(onboardingData) : {}

        const response = await fetch('/api/daily/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            energyLevel: baseline.energyLevel,
            emotionalState: baseline.emotionalState,
            userGoals: userData.goals || ['personal growth']
          })
        })

        const result = await response.json()
        if (result.success && result.data) {
          setDailyQuote(result.data.quote)
          setDailyFocus(result.data.dailyFocus)
        }
      } else {
        // No baseline yet, use defaults
        setDailyQuote({
          text: 'The only impossible journey is the one you never begin.',
          author: 'Tony Robbins',
          category: 'action'
        })
      }
    } catch (error) {
      console.error('Error fetching daily content:', error)
      setDailyQuote({
        text: 'The only impossible journey is the one you never begin.',
        author: 'Tony Robbins',
        category: 'action'
      })
    } finally {
      setIsLoadingContent(false)
    }
  }

  const powerQuestion = "What is one action you can take today that would make the biggest positive impact on your goals?"

  const handleJournalChange = async (text: string) => {
    setJournalEntry(text)

    // Only analyze if text is substantial
    if (text.length < 20) {
      setSentiment(null)
      setVocabularySuggestions([])
      return
    }

    // Debounce API call - wait 1.5 seconds after user stops typing
    if ((window as any).journalAnalysisTimeout) {
      clearTimeout((window as any).journalAnalysisTimeout)
    }

    ;(window as any).journalAnalysisTimeout = setTimeout(async () => {
      try {
        const response = await fetch('/api/journal/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entryText: text,
            userNegativeWords: ["can't", "impossible", "never", "failure", "hate", "overwhelmed"]
          })
        })

        const result = await response.json()
        if (result.success && result.data) {
          setSentiment(result.data.sentiment)

          // Generate vocabulary suggestions based on detected negative words
          const suggestions: string[] = []
          const lowerText = text.toLowerCase()
          if (lowerText.includes("can't")) suggestions.push("I am learning to")
          if (lowerText.includes("impossible")) suggestions.push("challenging but achievable")
          if (lowerText.includes("never")) suggestions.push("not yet")
          if (lowerText.includes("failure")) suggestions.push("learning opportunity")
          if (lowerText.includes("overwhelmed")) suggestions.push("I have many exciting priorities")
          setVocabularySuggestions(suggestions)
        }
      } catch (error) {
        console.error('Error analyzing journal:', error)
        // Fallback to simple client-side analysis
        const lowerText = text.toLowerCase()
        const positiveWords = ['good', 'great', 'happy', 'excited', 'amazing', 'wonderful', 'love', 'enjoy']
        const negativeWords = ['bad', 'sad', 'angry', 'hate', 'terrible', 'awful', 'difficult', 'hard']

        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length

        if (positiveCount > negativeCount) {
          setSentiment('positive')
        } else if (negativeCount > positiveCount) {
          setSentiment('negative')
        } else {
          setSentiment('neutral')
        }
      }
    }, 1500)
  }

  const applyVocabularySuggestion = (suggestion: string) => {
    let newText = journalEntry
    if (suggestion === "I am learning to") {
      newText = newText.replace(/can't/gi, "am learning to")
    } else if (suggestion === "challenging but achievable") {
      newText = newText.replace(/impossible/gi, "challenging but achievable")
    } else if (suggestion === "not yet") {
      newText = newText.replace(/never/gi, "not yet")
    } else if (suggestion === "learning opportunity") {
      newText = newText.replace(/failure/gi, "learning opportunity")
    }
    setJournalEntry(newText)
    setVocabularySuggestions([])
  }

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      startVoiceRecording()
    } else {
      // Stop recording
      stopVoiceRecording()
    }
  }

  const startVoiceRecording = () => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recording is not supported in your browser. Please try Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setJournalEntry(prev => prev + finalTranscript)
        handleJournalChange(journalEntry + finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    // Store recognition instance for later stopping
    ;(window as any).currentRecognition = recognition
    recognition.start()
  }

  const stopVoiceRecording = () => {
    const recognition = (window as any).currentRecognition
    if (recognition) {
      recognition.stop()
      ;(window as any).currentRecognition = null
    }
    setIsRecording(false)
  }

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) {
      return
    }

    // Save journal to localStorage
    const journalData = {
      entry: journalEntry,
      sentiment,
      timestamp: new Date().toISOString()
    }

    if (typeof window !== 'undefined') {
      const existingJournals = localStorage.getItem('journals')
      const journals = existingJournals ? JSON.parse(existingJournals) : []
      journals.push(journalData)
      localStorage.setItem('journals', JSON.stringify(journals))
    }

    // Track gamification - check if voice was used
    const currentHour = new Date().getHours()
    const isVoiceJournal = isRecording || false // Track if voice was used
    const action = isVoiceJournal ? 'voice-journal' : 'journal-entry'

    const { points, achievements } = gamificationManager.trackAction(action, {
      hour: currentHour
    })

    console.log(`🎉 +${points} points earned for journal entry!`)

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

    // Show success feedback
    setJournalSaved(true)
    setTimeout(() => setJournalSaved(false), 3000)

    // Clear journal entry
    setJournalEntry('')
    setSentiment(null)
    setVocabularySuggestions([])
  }

  const avgSatisfaction = Object.values(userData.satisfaction).reduce((a, b) => a + b, 0) / 5
  const satisfactionPercentage = (avgSatisfaction / 10) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Good morning, {userData.name}! ☀️
              </h1>
              <p className="text-purple-200">Ready to begin your ascent?</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-xl border border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-lg">{userData.streak}</span>
              <span className="text-sm text-orange-200">day streak</span>
            </div>
          </div>

          {/* Gamification Status */}
          <div className="flex justify-center mb-4">
            <GamificationStatus />
          </div>
        </motion.div>

        {/* Daily Power Quote */}
        {dailyQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl border border-amber-500/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-300 mb-2 uppercase tracking-wide">
                  Power Quote of the Day
                </h3>
                {isLoadingContent ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  </div>
                ) : (
                  <>
                    <blockquote className="text-lg font-medium text-white leading-relaxed mb-2">
                      &quot;{dailyQuote.text}&quot;
                    </blockquote>
                    <p className="text-sm text-amber-200">— {dailyQuote.author}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-purple-500/30"
        >
          <div className="text-center">
            <h3 className="text-sm font-medium text-purple-300 mb-3 uppercase tracking-wide">
              Your Focus for Today
            </h3>
            {isLoadingContent ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded mx-auto w-2/3"></div>
              </div>
            ) : (
              <p className="text-2xl font-bold text-white tracking-wide">
                {dailyFocus}
              </p>
            )}
          </div>
        </motion.div>

        {/* Life Satisfaction Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">Life Satisfaction</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(userData.satisfaction).map(([area, value]) => {
              const percentage = (value / 10) * 100
              const color = value >= 7 ? 'text-green-400' : value >= 4 ? 'text-yellow-400' : 'text-red-400'
              return (
                <div key={area} className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke={value >= 7 ? '#4ade80' : value >= 4 ? '#fbbf24' : '#f87171'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${color}`}>{value}</span>
                    </div>
                  </div>
                  <span className="text-sm capitalize text-purple-200">{area}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-sm text-purple-300">
              Overall Life Satisfaction:{' '}
              <span className="font-bold text-lg text-purple-100">{avgSatisfaction.toFixed(1)}/10</span>
            </p>
          </div>
        </motion.div>

        {/* Power Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowPowerQuestion(true)}
            className="w-full p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Today's Power Question</h3>
                <p className="text-sm text-purple-100">Tap to answer and build your streak</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>

        {/* Journal with AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Daily Journal
            </h2>
            {sentiment && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </div>
            )}
          </div>

          <textarea
            value={journalEntry}
            onChange={(e) => handleJournalChange(e.target.value)}
            placeholder="How are you feeling today? What's on your mind?"
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 resize-none focus:outline-none focus:border-purple-500 mb-3"
          />

          {vocabularySuggestions.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {vocabularySuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => applyVocabularySuggestion(suggestion)}
                  className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-xs hover:bg-amber-500/30 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Apply: &quot;{suggestion}&quot;
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  <span className="text-sm">Stop Recording</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Voice Input</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveJournal}
              disabled={!journalEntry.trim() || journalSaved}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                journalSaved
                  ? 'bg-green-500 text-white'
                  : journalEntry.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
                  : 'bg-gray-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {journalSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Save Entry</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/decision-triad"
            className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Decision Triad</h3>
            <p className="text-sm text-yellow-200">90-second power ritual</p>
          </Link>

          <Link
            href="/goals"
            className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">My Goals</h3>
            <p className="text-sm text-purple-200">Track your progress</p>
          </Link>

          <Link
            href="/transformer"
            className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Transform</h3>
            <p className="text-sm text-purple-200">Pain & Pleasure</p>
          </Link>

          <Link
            href="/alignment"
            className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Alignment</h3>
            <p className="text-sm text-purple-200">Values matrix</p>
          </Link>
        </div>
      </div>

      {/* Power Question Modal */}
      <AnimatePresence>
        {showPowerQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl p-8 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-7 h-7" />
                </div>
                <button
                  onClick={() => setShowPowerQuestion(false)}
                  className="text-purple-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-4">Today's Power Question</h2>
              <p className="text-lg text-purple-100 mb-6 leading-relaxed">
                {powerQuestion}
              </p>

              <textarea
                placeholder="Type your answer here..."
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 resize-none focus:outline-none focus:border-purple-500 mb-4"
              />

              <button
                onClick={() => setShowPowerQuestion(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Submit & Build Streak 🔥
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
