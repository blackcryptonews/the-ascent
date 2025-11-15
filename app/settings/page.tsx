'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Moon, LogOut, Home, Sunrise, Zap, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { notificationManager } from '@/lib/notifications'

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    checkinTime: '09:00',
    darkMode: true,
    notifications: true
  })
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [baselineTime, setBaselineTime] = useState({ hour: 9, minute: 0 })
  const [eveningReflectionTime, setEveningReflectionTime] = useState({ hour: 19, minute: 0 })
  const [eveningReflectionEnabled, setEveningReflectionEnabled] = useState(true)
  const [triadReminderEnabled, setTriadReminderEnabled] = useState(true)
  const [triadInterval, setTriadInterval] = useState(120)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onboardingData = localStorage.getItem('onboardingData')
      if (onboardingData) {
        const data = JSON.parse(onboardingData)
        setUserData(prev => ({
          ...prev,
          name: data.name || 'User',
          email: data.email || '',
          checkinTime: data.checkinTime || '09:00'
        }))
      }

      // Load notification settings
      const savedBaselineTime = localStorage.getItem('baselineReminderTime')
      const savedEveningTime = localStorage.getItem('eveningReflectionTime')
      const savedEveningEnabled = localStorage.getItem('eveningReflectionEnabled')
      const savedTriadEnabled = localStorage.getItem('triadReminderEnabled')
      const savedTriadInterval = localStorage.getItem('triadInterval')

      if (savedBaselineTime) {
        setBaselineTime(JSON.parse(savedBaselineTime))
      }
      if (savedEveningTime) {
        setEveningReflectionTime(JSON.parse(savedEveningTime))
      }
      if (savedEveningEnabled !== null) {
        setEveningReflectionEnabled(savedEveningEnabled === 'true')
      }
      if (savedTriadEnabled !== null) {
        setTriadReminderEnabled(savedTriadEnabled === 'true')
      }
      if (savedTriadInterval) {
        setTriadInterval(parseInt(savedTriadInterval))
      }

      // Check notification permission
      setPermissionStatus(notificationManager.getPermissionStatus())
    }
  }, [])

  const handleLogout = () => {
    // In real app, this would call signOut() from next-auth
    router.push('/landing')
  }

  const handleEnableNotifications = async () => {
    const permission = await notificationManager.requestPermission()
    setPermissionStatus(permission)

    if (permission === 'granted') {
      await notificationManager.registerServiceWorker()
      await notificationManager.scheduleDailyBaselineReminder(baselineTime.hour, baselineTime.minute)

      if (eveningReflectionEnabled) {
        await notificationManager.scheduleEveningReflection(eveningReflectionTime.hour, eveningReflectionTime.minute)
      }

      await notificationManager.showNotification('Notifications Enabled! 🎉', {
        body: 'You\'ll now receive daily reminders to support your transformation journey.',
        tag: 'setup-complete'
      })

      setUserData(prev => ({ ...prev, notifications: true }))
    }
  }

  const handleBaselineTimeChange = (hour: number, minute: number) => {
    setBaselineTime({ hour, minute })
    localStorage.setItem('baselineReminderTime', JSON.stringify({ hour, minute }))

    if (permissionStatus === 'granted') {
      notificationManager.scheduleDailyBaselineReminder(hour, minute)
    }
  }

  const handleEveningTimeChange = (hour: number, minute: number) => {
    setEveningReflectionTime({ hour, minute })
    localStorage.setItem('eveningReflectionTime', JSON.stringify({ hour, minute }))

    if (permissionStatus === 'granted' && eveningReflectionEnabled) {
      notificationManager.scheduleEveningReflection(hour, minute)
    }
  }

  const handleEveningReflectionToggle = (enabled: boolean) => {
    setEveningReflectionEnabled(enabled)
    localStorage.setItem('eveningReflectionEnabled', enabled.toString())

    if (enabled && permissionStatus === 'granted') {
      notificationManager.scheduleEveningReflection(eveningReflectionTime.hour, eveningReflectionTime.minute)
    }
  }

  const handleTriadReminderToggle = (enabled: boolean) => {
    setTriadReminderEnabled(enabled)
    localStorage.setItem('triadReminderEnabled', enabled.toString())
  }

  const handleTriadIntervalChange = (minutes: number) => {
    setTriadInterval(minutes)
    localStorage.setItem('triadInterval', minutes.toString())
  }

  const testNotification = async () => {
    await notificationManager.showNotification('Test Notification 🧪', {
      body: 'If you see this, notifications are working perfectly!',
      tag: 'test'
    })
  }

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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-purple-200">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-sm text-purple-200">{userData.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200 mb-2">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-2">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Preferences
          </h3>

          <div className="space-y-4">
            {/* Notification Permission Status */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 p-4 rounded-xl border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <p className="font-medium">Push Notifications</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  permissionStatus === 'granted' ? 'bg-green-500/20 text-green-300' :
                  permissionStatus === 'denied' ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {permissionStatus === 'granted' ? 'Enabled ✓' :
                   permissionStatus === 'denied' ? 'Blocked' : 'Not Set'}
                </span>
              </div>
              <p className="text-sm text-purple-200 mb-3">
                Get daily reminders to stay on track with your transformation journey
              </p>

              {permissionStatus !== 'granted' && permissionStatus !== 'denied' && (
                <button
                  onClick={handleEnableNotifications}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  Enable Notifications
                </button>
              )}

              {permissionStatus === 'granted' && (
                <button
                  onClick={testNotification}
                  className="w-full bg-white/10 text-white font-medium py-2 rounded-lg hover:bg-white/20 transition-all"
                >
                  Send Test Notification
                </button>
              )}

              {permissionStatus === 'denied' && (
                <p className="text-xs text-red-300">
                  Please enable notifications in your browser settings
                </p>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* Morning Baseline Reminder */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Sunrise className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="font-medium">Morning Baseline Check</p>
                  <p className="text-sm text-purple-200">Daily reminder to check in</p>
                </div>
              </div>
              <input
                type="time"
                value={`${baselineTime.hour.toString().padStart(2, '0')}:${baselineTime.minute.toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hour, minute] = e.target.value.split(':').map(Number)
                  handleBaselineTimeChange(hour, minute)
                }}
                disabled={permissionStatus !== 'granted'}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 text-sm"
              />
            </div>

            <div className="h-px bg-white/10" />

            {/* Decision Triad Reminders */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Decision Triad Reminders</p>
                  <p className="text-sm text-purple-200">Periodic prompts throughout the day</p>
                </div>
              </div>
              <button
                onClick={() => handleTriadReminderToggle(!triadReminderEnabled)}
                disabled={permissionStatus !== 'granted'}
                className={`w-14 h-8 rounded-full transition-all disabled:opacity-50 ${
                  triadReminderEnabled ? 'bg-cyan-600' : 'bg-white/20'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  triadReminderEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {triadReminderEnabled && (
              <div className="ml-8 flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-purple-200">Remind every:</span>
                <select
                  value={triadInterval}
                  onChange={(e) => handleTriadIntervalChange(Number(e.target.value))}
                  disabled={permissionStatus !== 'granted'}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50 text-sm"
                >
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
            )}

            <div className="h-px bg-white/10" />

            {/* Evening Reflection */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Moon className="w-5 h-5 text-purple-400 mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Evening Reflection</p>
                  <p className="text-sm text-purple-200">End-of-day journaling reminder</p>
                </div>
              </div>
              <button
                onClick={() => handleEveningReflectionToggle(!eveningReflectionEnabled)}
                disabled={permissionStatus !== 'granted'}
                className={`w-14 h-8 rounded-full transition-all disabled:opacity-50 ${
                  eveningReflectionEnabled ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  eveningReflectionEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {eveningReflectionEnabled && (
              <div className="ml-8 flex items-center gap-3">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-200">Time:</span>
                <input
                  type="time"
                  value={`${eveningReflectionTime.hour.toString().padStart(2, '0')}:${eveningReflectionTime.minute.toString().padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hour, minute] = e.target.value.split(':').map(Number)
                    handleEveningTimeChange(hour, minute)
                  }}
                  disabled={permissionStatus !== 'granted'}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 text-sm"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/landing')}
            className="w-full p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-300" />
              </div>
              <span className="font-medium">Back to Landing Page</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-4 bg-red-500/10 backdrop-blur-lg rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-300" />
              </div>
              <span className="font-medium text-red-100">Sign Out</span>
            </div>
          </button>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-purple-300"
        >
          <p>Giant Within v1.0.0</p>
          <p className="mt-1">Built with ❤️ for personal transformation</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
