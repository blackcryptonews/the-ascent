'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Battery, Sun, ArrowRight, Cloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { gamificationManager } from '@/lib/gamification'
import { notificationManager } from '@/lib/notifications'

export default function BaselineCheckPage() {
  const router = useRouter()
  const [energyLevel, setEnergyLevel] = useState(5)
  const [emotionalState, setEmotionalState] = useState(5)
  const [energyNotes, setEnergyNotes] = useState('')
  const [emotionNotes, setEmotionNotes] = useState('')

  const handleSubmit = async () => {
    // Save baseline data to localStorage for now
    const baselineData = {
      energyLevel,
      emotionalState,
      energyNotes,
      emotionNotes,
      timestamp: new Date().toISOString()
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyBaseline', JSON.stringify(baselineData))
      localStorage.setItem('lastBaselineDate', new Date().toDateString())
    }

    // TODO: Save to database via API

    // Track gamification - award points and check achievements
    const currentHour = new Date().getHours()
    const { points, achievements } = gamificationManager.trackAction('baseline-check', {
      hour: currentHour
    })

    console.log(`🎉 +${points} points earned for baseline check!`)

    // Show achievement notifications if any unlocked
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        notificationManager.showNotification(`🏆 Achievement Unlocked!`, {
          body: `${achievement.title}: ${achievement.description}`,
          tag: `achievement-${achievement.id}`,
          icon: '/icon-192.png'
        })
      })
    }

    // Redirect to dashboard
    router.push('/dashboard')
  }

  // Calculate battery fill percentage and color
  const batteryPercentage = energyLevel * 10
  const batteryColor = energyLevel <= 3 ? '#f87171' : energyLevel <= 6 ? '#fbbf24' : '#4ade80'

  // Calculate sun brightness and cloud opacity
  const sunBrightness = 0.5 + (emotionalState * 0.05) // 0.5 to 1.0
  const cloudOpacity = 1 - (emotionalState * 0.1) // 1.0 to 0.0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-3">Morning Baseline Check ☀️</h1>
          <p className="text-purple-200 text-lg">
            Let's check in with your energy and emotions to personalize your day
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6"
        >
          {/* Energy Level Section */}
          <div className="mb-10">
            <label className="block text-xl font-semibold mb-4">
              What's your energy level this morning?
            </label>
            <div className="flex justify-between text-sm text-purple-300 mb-3">
              <span>1 - Drained</span>
              <span>10 - Electric</span>
            </div>

            {/* Energy Slider */}
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${batteryColor} 0%, ${batteryColor} ${batteryPercentage}%, rgba(255,255,255,0.1) ${batteryPercentage}%, rgba(255,255,255,0.1) 100%)`
              }}
            />

            {/* Energy Value Display */}
            <div className="text-center mt-4">
              <span className="inline-block px-6 py-2 bg-purple-600 rounded-full text-2xl font-bold">
                {energyLevel}
              </span>
            </div>

            {/* Battery Visualization */}
            <div className="flex justify-center mt-6">
              <div className="relative">
                <div className="w-32 h-16 border-4 rounded-lg relative overflow-hidden" style={{ borderColor: batteryColor }}>
                  <motion.div
                    className="h-full rounded"
                    style={{ backgroundColor: batteryColor }}
                    initial={{ width: '50%' }}
                    animate={{ width: `${batteryPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Battery Terminal */}
                <div
                  className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-8 rounded-r"
                  style={{ backgroundColor: batteryColor }}
                />
                <Battery className="absolute inset-0 m-auto w-8 h-8 text-white/30 pointer-events-none" />
              </div>
            </div>

            {/* Optional Notes */}
            <div className="mt-6">
              <label className="block text-sm text-purple-300 mb-2">
                Any notes about your energy? (optional)
              </label>
              <input
                type="text"
                value={energyNotes}
                onChange={(e) => setEnergyNotes(e.target.value)}
                placeholder="e.g., Slept well but woke up early..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Emotional State Section */}
          <div className="mb-8 pt-8 border-t border-white/10">
            <label className="block text-xl font-semibold mb-4">
              What's your emotional state?
            </label>
            <div className="flex justify-between text-sm text-purple-300 mb-3">
              <span>1 - Heavy/Anxious</span>
              <span>10 - Light/Excited</span>
            </div>

            {/* Emotion Slider */}
            <input
              type="range"
              min="1"
              max="10"
              value={emotionalState}
              onChange={(e) => setEmotionalState(Number(e.target.value))}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${emotionalState * 10}%, rgba(255,255,255,0.1) ${emotionalState * 10}%, rgba(255,255,255,0.1) 100%)`
              }}
            />

            {/* Emotion Value Display */}
            <div className="text-center mt-4">
              <span className="inline-block px-6 py-2 bg-amber-600 rounded-full text-2xl font-bold">
                {emotionalState}
              </span>
            </div>

            {/* Sun/Cloud Visualization */}
            <div className="flex justify-center mt-6 h-24 relative">
              <motion.div
                className="relative"
                animate={{
                  filter: `brightness(${sunBrightness})`,
                  scale: 0.8 + (emotionalState * 0.02)
                }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="w-20 h-20 text-amber-400" strokeWidth={2} />

                {/* Clouds */}
                <motion.div
                  className="absolute -top-2 -left-4"
                  animate={{ opacity: cloudOpacity }}
                  transition={{ duration: 0.3 }}
                >
                  <Cloud className="w-12 h-12 text-gray-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-4"
                  animate={{ opacity: cloudOpacity * 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cloud className="w-10 h-10 text-gray-400" />
                </motion.div>
              </motion.div>
            </div>

            {/* Optional Notes */}
            <div className="mt-6">
              <label className="block text-sm text-purple-300 mb-2">
                Any notes about your emotions? (optional)
              </label>
              <input
                type="text"
                value={emotionNotes}
                onChange={(e) => setEmotionNotes(e.target.value)}
                placeholder="e.g., Feeling optimistic about today..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
          >
            Continue to Your Daily Power Session
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-purple-300"
        >
          <p>
            💡 Your baseline check helps us personalize your quotes, questions, and daily focus
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
