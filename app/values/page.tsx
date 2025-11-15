'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Check, Circle } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'

export default function ValuesPage() {
  const coreValues = [
    { id: 1, value: 'Integrity', description: 'Living in alignment with my highest principles' },
    { id: 2, value: 'Growth', description: 'Constantly evolving and becoming my best self' },
    { id: 3, value: 'Contribution', description: 'Making a positive impact on others\' lives' },
    { id: 4, value: 'Love', description: 'Giving and receiving unconditional love' },
    { id: 5, value: 'Excellence', description: 'Delivering my absolute best in everything I do' }
  ]

  const [affirmations, setAffirmations] = useState([
    { id: 1, text: 'I am worthy of success and happiness', checked: false },
    { id: 2, text: 'I have the power to create the life I desire', checked: false },
    { id: 3, text: 'I am growing stronger and wiser every day', checked: false },
    { id: 4, text: 'I attract positive energy and opportunities', checked: false },
    { id: 5, text: 'I am grateful for all that I have and all that is coming', checked: false }
  ])

  const toggleAffirmation = (id: number) => {
    setAffirmations(prev =>
      prev.map(aff => aff.id === id ? { ...aff, checked: !aff.checked } : aff)
    )
  }

  const checkedCount = affirmations.filter(a => a.checked).length

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
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">My Values</h1>
          </div>
          <p className="text-purple-200">Your guiding principles for life</p>
        </motion.div>

        {/* Core Values Hierarchy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-6">Top 5 Core Values</h2>
          <div className="space-y-4">
            {coreValues.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl">
                    {item.id}
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-lg mb-1">{item.value}</h3>
                    <p className="text-sm text-purple-200">{item.description}</p>
                  </div>
                </div>
                {index < coreValues.length - 1 && (
                  <div className="ml-6 w-0.5 h-4 bg-gradient-to-b from-purple-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Affirmations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl border border-indigo-500/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Daily Affirmations</h2>
            <div className="px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <span className="font-bold">{checkedCount}/5</span>
              <span className="text-sm text-purple-200 ml-2">completed</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {affirmations.map((affirmation, index) => (
              <motion.button
                key={affirmation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleAffirmation(affirmation.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left ${
                  affirmation.checked
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                }`}
              >
                {affirmation.checked ? (
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-purple-300 flex-shrink-0 mt-0.5" />
                )}
                <span className={affirmation.checked ? 'text-purple-200' : ''}>
                  {affirmation.text}
                </span>
              </motion.button>
            ))}
          </div>

          {checkedCount === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-center"
            >
              <p className="font-semibold text-green-100">
                🎉 Amazing! You've completed all affirmations today!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Values Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 text-center"
        >
          <p className="text-lg italic text-purple-100 mb-2">
            &quot;When your values are clear, your decisions are easy.&quot;
          </p>
          <p className="text-sm text-purple-300">- Roy Disney</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
