'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, Zap, Star, Users, TrendingUp, ArrowRight, Mail, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSubmitted(true)

    // Store email in localStorage for onboarding
    localStorage.setItem('userEmail', email)

    // Redirect to onboarding after animation
    setTimeout(() => {
      router.push('/onboarding')
    }, 2000)
  }

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Coaching',
      description: 'Get personalized guidance powered by advanced AI that understands your unique journey and adapts to your goals.'
    },
    {
      icon: Target,
      title: 'Proven Transformation',
      description: 'Use the Dickens Pattern - a powerful NLP technique that creates lasting behavioral change through pain and pleasure reprogramming.'
    },
    {
      icon: Zap,
      title: 'Daily Momentum',
      description: 'Build unstoppable habits with daily power questions, streak tracking, and gamified progress that keeps you motivated.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Entrepreneur',
      text: 'Eneuroa helped me break free from self-doubt. The Pain & Pleasure technique was a game-changer. I finally launched my business!',
      rating: 5
    },
    {
      name: 'Marcus Chen',
      role: 'Software Engineer',
      text: 'The daily power questions keep me focused on what matters. My productivity has doubled and I feel more aligned with my values.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Health Coach',
      text: 'This app combines proven transformation techniques with AI personalization. The transformation I\'ve experienced in 90 days is incredible.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            Eneuroa
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/auth/signin')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all"
          >
            Sign In
          </motion.button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Begin Your Ascent
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-12">
                Where every day is a step up. Break through limiting beliefs and build unstoppable momentum
                with your personal AI coach, inspired by proven methodologies.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-300" />
                <span className="text-2xl font-bold">50K+</span>
                <span className="text-purple-200">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold">4.8★</span>
                <span className="text-purple-200">Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-2xl font-bold">89%</span>
                <span className="text-purple-200">Success Rate</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setShowEmailCapture(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Your Transformation
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/auth/signin')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Why Eneuroa Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-purple-100 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Real Transformations
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-purple-100 mb-6 leading-relaxed italic">
                &quot;{testimonial.text}&quot;
              </p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-purple-300">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl border border-white/10"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join 50,000+ people who are already on their ascent to greatness.
          </p>
          <button
            onClick={() => setShowEmailCapture(true)}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md p-8 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border border-white/20 shadow-2xl"
            >
              {!emailSubmitted ? (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">
                    Start Your Journey
                  </h3>
                  <p className="text-purple-100 text-center mb-6">
                    Enter your email to begin your transformation
                  </p>
                  <form onSubmit={handleEmailSubmit}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 mb-4 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Continue
                    </button>
                  </form>
                  <button
                    onClick={() => setShowEmailCapture(false)}
                    className="w-full mt-3 py-2 text-purple-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Welcome!</h3>
                  <p className="text-purple-100">
                    Redirecting to your personalized onboarding...
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-purple-300">
          <p>&copy; 2025 Eneuroa. Built with ❤️ for personal transformation.</p>
        </div>
      </div>
    </div>
  )
}
