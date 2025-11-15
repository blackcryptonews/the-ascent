'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Play, Pause, SkipForward, Check, Clock } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { gamificationManager } from '@/lib/gamification'
import { notificationManager } from '@/lib/notifications'

type Step = 'intro' | 'pain-focus' | 'pain-immerse' | 'pleasure-focus' | 'pleasure-immerse' | 'complete'

export default function TransformerPage() {
  const [isActive, setIsActive] = useState(false)
  const [step, setStep] = useState<Step>('intro')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes per step
  const [isPaused, setIsPaused] = useState(false)

  const steps: Step[] = ['intro', 'pain-focus', 'pain-immerse', 'pleasure-focus', 'pleasure-immerse', 'complete']
  const currentStepIndex = steps.indexOf(step)
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0 && step !== 'intro' && step !== 'complete') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive, isPaused, timeLeft, step])

  const startExercise = () => {
    setIsActive(true)
    setStep('pain-focus')
    setTimeLeft(300)
  }

  const nextStep = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      const nextStepValue = steps[currentIndex + 1]

      // If moving to complete step, trigger gamification
      if (nextStepValue === 'complete') {
        completeExercise()
      } else {
        setStep(nextStepValue)
        setTimeLeft(300)
        setIsPaused(false)
      }
    }
  }

  const completeExercise = () => {
    setStep('complete')
    setIsActive(false)

    // Track gamification - award points for completing transformation exercise
    const { points, achievements } = gamificationManager.trackAction('transformation-completed')
    console.log(`🎉 +${points} points earned for completing transformation exercise!`)

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
    notificationManager.showNotification(`🧠 Transformation Complete!`, {
      body: `+${points} points! You've rewired your neural pathways!`,
      tag: 'transformation-complete'
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const stepContent = {
    intro: {
      title: 'Pain & Pleasure Reprogrammer',
      subtitle: 'The Dickens Pattern - 4 Steps to Transformation',
      description: 'This powerful NLP technique rewires your brain by linking intense pain to old behaviors and intense pleasure to new ones. Complete the full 20-minute exercise for maximum impact.'
    },
    'pain-focus': {
      title: 'Step 1: Focus on the Pain',
      subtitle: 'Link Pain to Your Old Habit',
      description: 'Visualize continuing your old habit for the next 5 years. What does your life look like? Your health? Your relationships? Your career? Feel the disappointment, the regret, the missed opportunities.',
      prompts: [
        'How does your body feel after 5 years of this habit?',
        'What opportunities have you missed?',
        'How do your loved ones look at you?',
        'What has this habit cost you financially?'
      ]
    },
    'pain-immerse': {
      title: 'Step 2: Immerse in the Pain',
      subtitle: 'Make it Vivid and Real',
      description: 'Now go deeper. See it in vivid detail. Hear what people say. Feel the emotions. Smell the environment. Make this future so real and painful that your unconscious mind rejects it completely.',
      prompts: [
        'What specific moment shows your biggest regret?',
        'Who is disappointed in you?',
        'What health scare do you experience?',
        'How does it feel to wake up in this reality every day?'
      ]
    },
    'pleasure-focus': {
      title: 'Step 3: Focus on the Pleasure',
      subtitle: 'Link Pleasure to Your New Habit',
      description: 'Now visualize having transformed this habit 5 years ago. See yourself thriving! Your health is vibrant, relationships are deep, career is flourishing. Feel the pride, the energy, the joy!',
      prompts: [
        'How amazing does your body feel?',
        'What incredible opportunities came your way?',
        'How do people praise and admire you?',
        'What amazing experiences have you had?'
      ]
    },
    'pleasure-immerse': {
      title: 'Step 4: Immerse in the Pleasure',
      subtitle: 'Make it Irresistibly Real',
      description: 'Go all in! See every vivid detail of your transformed life. Hear the compliments. Feel the confidence. Taste the success. Make this future so compelling that your unconscious mind craves it desperately.',
      prompts: [
        'What specific achievement makes you most proud?',
        'Who celebrates your transformation?',
        'How has your confidence changed everything?',
        'What does a perfect day look like in this reality?'
      ]
    },
    complete: {
      title: 'Transformation Complete! 🎉',
      subtitle: 'You\'ve Rewired Your Neural Pathways',
      description: 'You just completed the Dickens Pattern! Your unconscious mind now associates intense pain with the old behavior and intense pleasure with the new one. Repeat this exercise whenever you need reinforcement.'
    }
  }

  const content = stepContent[step] || stepContent.intro

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        {!isActive ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Transform</h1>
            </div>
            <p className="text-purple-200">Pain & Pleasure Reprogramming Exercise</p>
          </motion.div>
        ) : (
          <div className="mb-6">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-purple-200">
              <span>Step {currentStepIndex} of 4</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Intro Screen */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="p-8 bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-lg rounded-2xl border border-orange-500/30">
                <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
                <p className="text-xl text-purple-100 mb-6">{content.subtitle}</p>
                <p className="text-purple-100 leading-relaxed">{content.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                  <div className="text-4xl mb-3">😰</div>
                  <h3 className="font-semibold mb-2">Pain Association</h3>
                  <p className="text-sm text-purple-200">
                    Link intense negative emotions to the habit you want to break
                  </p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                  <div className="text-4xl mb-3">😄</div>
                  <h3 className="font-semibold mb-2">Pleasure Association</h3>
                  <p className="text-sm text-purple-200">
                    Link intense positive emotions to your new empowering habit
                  </p>
                </div>
              </div>

              <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <h3 className="font-semibold mb-3">💡 Exercise Breakdown:</h3>
                <div className="space-y-2 text-sm text-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">1</div>
                    <span>Focus on Pain (5 minutes) - Visualize 5 years of the old habit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">2</div>
                    <span>Immerse in Pain (5 minutes) - Make it vivid and unbearable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold">3</div>
                    <span>Focus on Pleasure (5 minutes) - Visualize 5 years transformed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold">4</div>
                    <span>Immerse in Pleasure (5 minutes) - Make it irresistible</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startExercise}
                className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6" />
                Begin Transformation Exercise
              </button>
            </motion.div>
          )}

          {/* Exercise Steps */}
          {step !== 'intro' && step !== 'complete' && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Timer */}
              <div className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-300" />
                  <span className="text-sm text-purple-200">Time Remaining</span>
                </div>
                <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all flex items-center gap-2"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2"
                  >
                    <SkipForward className="w-5 h-5" />
                    Next Step
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={`p-8 backdrop-blur-lg rounded-2xl border ${
                step.includes('pain')
                  ? 'bg-red-600/10 border-red-500/30'
                  : 'bg-green-600/10 border-green-500/30'
              }`}>
                <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
                <p className="text-lg text-purple-100 mb-6">{content.subtitle}</p>
                <p className="text-purple-100 leading-relaxed mb-6">{content.description}</p>

                {'prompts' in content && content.prompts && (
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-3">Reflection Prompts:</h3>
                    {content.prompts.map((prompt, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <p className="text-sm text-purple-100">🤔 {prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Complete Screen */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-8 bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl border border-green-500/30 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
                <p className="text-xl text-purple-100 mb-4">{content.subtitle}</p>
                <p className="text-purple-100 leading-relaxed">{content.description}</p>
              </div>

              <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                <h3 className="font-semibold mb-3">💪 Next Steps:</h3>
                <ul className="space-y-2 text-sm text-purple-100">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                    <span>Repeat this exercise daily for the first week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                    <span>Use it as needed when you feel tempted by the old habit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                    <span>Journal about your experience and insights</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setStep('intro')
                  setTimeLeft(300)
                  setIsActive(false)
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                Return to Start
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}
