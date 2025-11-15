'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Sparkles, Trophy, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface UserLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  perks: string[]
}

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: UserLevel
  previousLevel: UserLevel
}

export function LevelUpModal({ isOpen, onClose, newLevel, previousLevel }: LevelUpModalProps) {
  const [showPerks, setShowPerks] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      // Show perks after animation
      setTimeout(() => setShowPerks(true), 1500)

      return () => {
        clearInterval(interval)
        setShowPerks(false)
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl border-2 border-yellow-400/50 shadow-2xl overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative p-8 text-center text-white">
              {/* Level Up Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              {/* Level Up Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  LEVEL UP!
                </h2>
                <p className="text-purple-200 mb-6">You've reached a new milestone!</p>
              </motion.div>

              {/* Level Progression */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8 flex items-center justify-center gap-4"
              >
                {/* Previous Level */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-2 border-2 border-gray-600">
                    <span className="text-2xl font-bold text-gray-400">{previousLevel.level}</span>
                  </div>
                  <span className="text-xs text-gray-400">{previousLevel.title}</span>
                </div>

                {/* Arrow */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                >
                  <Zap className="w-8 h-8 text-yellow-400" />
                </motion.div>

                {/* New Level */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2 border-4 border-yellow-300 shadow-lg">
                    <span className="text-3xl font-bold text-white">{newLevel.level}</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-300">{newLevel.title}</span>
                </motion.div>
              </motion.div>

              {/* New Perks */}
              <AnimatePresence>
                {showPerks && newLevel.perks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-yellow-400/30"
                  >
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-yellow-300">New Perks Unlocked!</h3>
                    </div>
                    <div className="space-y-2">
                      {newLevel.perks.map((perk, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20"
                        >
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-white">{perk}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl transition-all"
              >
                Continue Your Journey
              </motion.button>

              {/* Motivational Quote */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                className="mt-4 text-sm text-purple-300 italic"
              >
                &quot;The giant within you grows stronger with every step!&quot;
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
