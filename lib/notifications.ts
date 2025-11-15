// Notification Manager for Giant Within
// Handles permission requests and scheduling

export class NotificationManager {
  private static instance: NotificationManager
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  /**
   * Register service worker for notifications
   */
  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', this.registration)
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  /**
   * Show immediate notification
   */
  async showNotification(title: string, options: NotificationOptions = {}) {
    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    if (!this.registration) {
      await this.registerServiceWorker()
    }

    if (this.registration) {
      await this.registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        ...options
      })
    }
  }

  /**
   * Schedule daily baseline reminder
   */
  async scheduleDailyBaselineReminder(hour: number = 8, minute: number = 0) {
    const permission = await this.requestPermission()
    if (permission !== 'granted') return

    // Calculate next reminder time
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hour, minute, 0, 0)

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    // Store in localStorage for persistence
    localStorage.setItem('baselineReminderTime', reminderTime.toISOString())

    // Use setTimeout for demo (in production, use Push API)
    const delay = reminderTime.getTime() - now.getTime()

    setTimeout(() => {
      this.showNotification('Good Morning! ☀️', {
        body: 'Time for your daily baseline check. How are you feeling today?',
        requireInteraction: true,
        tag: 'baseline-reminder',
        data: { url: '/baseline' }
      })

      // Reschedule for tomorrow
      this.scheduleDailyBaselineReminder(hour, minute)
    }, Math.min(delay, 2147483647)) // Max setTimeout value
  }

  /**
   * Schedule Decision Triad reminder
   */
  async scheduleTriadReminder(delayMinutes: number = 120) {
    const permission = await this.requestPermission()
    if (permission !== 'granted') return

    const delay = delayMinutes * 60 * 1000

    setTimeout(() => {
      this.showNotification('Time for a Power Reset! ⚡', {
        body: 'Complete a 90-second Decision Triad to regain focus.',
        tag: 'triad-reminder',
        data: { url: '/decision-triad' }
      })
    }, delay)
  }

  /**
   * Pattern break alert (when streak is about to reset)
   */
  async patternBreakAlert() {
    await this.showNotification('⏰ Pattern Break Warning!', {
      body: 'Your streak is about to reset in 90 seconds. Complete a Decision Triad now!',
      requireInteraction: true,
      tag: 'pattern-break',
      data: { url: '/decision-triad' }
    })
  }

  /**
   * Evening reflection reminder
   */
  async scheduleEveningReflection(hour: number = 19, minute: number = 0) {
    const permission = await this.requestPermission()
    if (permission !== 'granted') return

    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hour, minute, 0, 0)

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const delay = reminderTime.getTime() - now.getTime()

    setTimeout(() => {
      this.showNotification('Evening Reflection 🌙', {
        body: 'How did today go? Journal your wins and insights.',
        tag: 'evening-reflection',
        data: { url: '/dashboard' }
      })

      // Reschedule for tomorrow
      this.scheduleEveningReflection(hour, minute)
    }, Math.min(delay, 2147483647))
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return ('Notification' in window) && Notification.permission === 'granted'
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }
}

export const notificationManager = NotificationManager.getInstance()
