// Gamification System for Giant Within
// Tracks points, levels, achievements, and streaks

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  category: 'baseline' | 'triad' | 'journal' | 'goals' | 'streak' | 'special'
  requirement: {
    type: 'count' | 'streak' | 'custom'
    target: number
    metric: string
  }
  unlocked: boolean
  unlockedAt?: string
  progress: number
}

export interface UserLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  perks: string[]
}

export interface GamificationState {
  totalPoints: number
  currentLevel: number
  achievements: Achievement[]
  streaks: {
    baseline: number
    triad: number
    journal: number
    longest: number
  }
  stats: {
    baselinesCompleted: number
    triadsCompleted: number
    journalEntries: number
    goalsAchieved: number
    transformationsCompleted: number
  }
}

// Points system
export const POINTS = {
  BASELINE_CHECK: 10,
  DECISION_TRIAD: 25,
  JOURNAL_ENTRY: 15,
  VOICE_JOURNAL: 20,
  GOAL_COMPLETED: 50,
  TRANSFORMATION_EXERCISE: 30,
  STREAK_BONUS_MULTIPLIER: 1.5, // 1.5x points for maintaining streaks
  FIRST_OF_DAY_BONUS: 5,
}

// Level progression
export const LEVELS: UserLevel[] = [
  { level: 1, title: 'Awakening', minPoints: 0, maxPoints: 99, perks: ['Basic features unlocked'] },
  { level: 2, title: 'Rising', minPoints: 100, maxPoints: 249, perks: ['Voice journaling unlocked', 'Custom goals'] },
  { level: 3, title: 'Growing', minPoints: 250, maxPoints: 499, perks: ['Advanced analytics', 'Pattern insights'] },
  { level: 4, title: 'Thriving', minPoints: 500, maxPoints: 999, perks: ['AI coaching suggestions', 'Community access'] },
  { level: 5, title: 'Mastering', minPoints: 1000, maxPoints: 1999, perks: ['Priority support', 'Custom themes'] },
  { level: 6, title: 'Transcending', minPoints: 2000, maxPoints: 3999, perks: ['Mentor others', 'Advanced features'] },
  { level: 7, title: 'Giant Within', minPoints: 4000, maxPoints: 999999, perks: ['All features', 'Lifetime access'] },
]

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Baseline achievements
  {
    id: 'first-baseline',
    title: 'First Step',
    description: 'Complete your first baseline check',
    icon: '🌅',
    points: 10,
    category: 'baseline',
    requirement: { type: 'count', target: 1, metric: 'baselinesCompleted' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'baseline-week',
    title: 'Week Warrior',
    description: 'Complete 7 consecutive baseline checks',
    icon: '📅',
    points: 50,
    category: 'baseline',
    requirement: { type: 'streak', target: 7, metric: 'baseline' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'baseline-master',
    title: 'Baseline Master',
    description: 'Complete 30 baseline checks',
    icon: '👑',
    points: 100,
    category: 'baseline',
    requirement: { type: 'count', target: 30, metric: 'baselinesCompleted' },
    unlocked: false,
    progress: 0,
  },

  // Decision Triad achievements
  {
    id: 'first-triad',
    title: 'Power Decision',
    description: 'Complete your first Decision Triad',
    icon: '⚡',
    points: 25,
    category: 'triad',
    requirement: { type: 'count', target: 1, metric: 'triadsCompleted' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'triad-10-day',
    title: '10-Day Challenge Winner',
    description: 'Complete the 10-day Decision Triad challenge',
    icon: '🔥',
    points: 200,
    category: 'triad',
    requirement: { type: 'streak', target: 10, metric: 'triad' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'triad-speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 Decision Triads in one day',
    icon: '🚀',
    points: 75,
    category: 'triad',
    requirement: { type: 'custom', target: 5, metric: 'triadsInOneDay' },
    unlocked: false,
    progress: 0,
  },

  // Journal achievements
  {
    id: 'first-journal',
    title: 'Reflective Mind',
    description: 'Write your first journal entry',
    icon: '📝',
    points: 15,
    category: 'journal',
    requirement: { type: 'count', target: 1, metric: 'journalEntries' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'voice-pioneer',
    title: 'Voice Pioneer',
    description: 'Use voice journaling for the first time',
    icon: '🎤',
    points: 25,
    category: 'journal',
    requirement: { type: 'custom', target: 1, metric: 'voiceJournals' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'journal-habit',
    title: 'Daily Writer',
    description: 'Journal for 21 consecutive days',
    icon: '📖',
    points: 150,
    category: 'journal',
    requirement: { type: 'streak', target: 21, metric: 'journal' },
    unlocked: false,
    progress: 0,
  },

  // Goal achievements
  {
    id: 'goal-crusher',
    title: 'Goal Crusher',
    description: 'Complete your first goal',
    icon: '🎯',
    points: 50,
    category: 'goals',
    requirement: { type: 'count', target: 1, metric: 'goalsAchieved' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'goal-master',
    title: 'Achievement Master',
    description: 'Complete 10 goals',
    icon: '🏆',
    points: 300,
    category: 'goals',
    requirement: { type: 'count', target: 10, metric: 'goalsAchieved' },
    unlocked: false,
    progress: 0,
  },

  // Streak achievements
  {
    id: 'streak-7',
    title: 'Consistency King',
    description: 'Maintain any 7-day streak',
    icon: '👑',
    points: 75,
    category: 'streak',
    requirement: { type: 'streak', target: 7, metric: 'longest' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak-30',
    title: 'Unstoppable Force',
    description: 'Maintain any 30-day streak',
    icon: '💪',
    points: 250,
    category: 'streak',
    requirement: { type: 'streak', target: 30, metric: 'longest' },
    unlocked: false,
    progress: 0,
  },

  // Special achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete baseline before 7 AM',
    icon: '🐦',
    points: 30,
    category: 'special',
    requirement: { type: 'custom', target: 1, metric: 'earlyBaseline' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete evening reflection after 11 PM',
    icon: '🦉',
    points: 30,
    category: 'special',
    requirement: { type: 'custom', target: 1, metric: 'lateJournal' },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'transformation-complete',
    title: 'Mind Transformer',
    description: 'Complete a full Pain & Pleasure exercise',
    icon: '🧠',
    points: 100,
    category: 'special',
    requirement: { type: 'count', target: 1, metric: 'transformationsCompleted' },
    unlocked: false,
    progress: 0,
  },
]

export class GamificationManager {
  private static instance: GamificationManager
  private state: GamificationState

  private constructor() {
    this.state = this.loadState()
  }

  static getInstance(): GamificationManager {
    if (!GamificationManager.instance) {
      GamificationManager.instance = new GamificationManager()
    }
    return GamificationManager.instance
  }

  private loadState(): GamificationState {
    if (typeof window === 'undefined') {
      return this.getDefaultState()
    }

    const saved = localStorage.getItem('gamificationState')
    if (saved) {
      return JSON.parse(saved)
    }

    return this.getDefaultState()
  }

  private getDefaultState(): GamificationState {
    return {
      totalPoints: 0,
      currentLevel: 1,
      achievements: ACHIEVEMENTS.map(a => ({ ...a })),
      streaks: {
        baseline: 0,
        triad: 0,
        journal: 0,
        longest: 0,
      },
      stats: {
        baselinesCompleted: 0,
        triadsCompleted: 0,
        journalEntries: 0,
        goalsAchieved: 0,
        transformationsCompleted: 0,
      },
    }
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamificationState', JSON.stringify(this.state))
    }
  }

  // Award points and check for level up
  awardPoints(points: number, reason: string): { pointsAwarded: number; leveledUp: boolean; newLevel?: UserLevel } {
    this.state.totalPoints += points

    // Check for level up
    const previousLevel = this.state.currentLevel
    const newLevel = this.calculateLevel(this.state.totalPoints)

    this.state.currentLevel = newLevel.level
    this.saveState()

    console.log(`🎉 +${points} points for ${reason}! Total: ${this.state.totalPoints}`)

    return {
      pointsAwarded: points,
      leveledUp: newLevel.level > previousLevel,
      newLevel: newLevel.level > previousLevel ? newLevel : undefined,
    }
  }

  // Calculate current level based on points
  calculateLevel(points: number): UserLevel {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i]
      }
    }
    return LEVELS[0]
  }

  // Track action and award points
  trackAction(action: string, metadata?: any): { points: number; achievements: Achievement[]; leveledUp: boolean; newLevel?: UserLevel; previousLevel?: UserLevel } {
    let points = 0
    const unlockedAchievements: Achievement[] = []

    switch (action) {
      case 'baseline-check':
        this.state.stats.baselinesCompleted++
        this.state.streaks.baseline++
        points = POINTS.BASELINE_CHECK

        // Check for early bird
        if (metadata?.hour && metadata.hour < 7) {
          const earlyBird = this.checkAchievement('early-bird', { earlyBaseline: 1 })
          if (earlyBird) unlockedAchievements.push(earlyBird)
        }
        break

      case 'decision-triad':
        this.state.stats.triadsCompleted++
        this.state.streaks.triad++
        points = POINTS.DECISION_TRIAD
        break

      case 'journal-entry':
        this.state.stats.journalEntries++
        this.state.streaks.journal++
        points = POINTS.JOURNAL_ENTRY

        // Check for night owl
        if (metadata?.hour && metadata.hour >= 23) {
          const nightOwl = this.checkAchievement('night-owl', { lateJournal: 1 })
          if (nightOwl) unlockedAchievements.push(nightOwl)
        }
        break

      case 'voice-journal':
        this.state.stats.journalEntries++
        points = POINTS.VOICE_JOURNAL
        const voicePioneer = this.checkAchievement('voice-pioneer', { voiceJournals: 1 })
        if (voicePioneer) unlockedAchievements.push(voicePioneer)
        break

      case 'goal-completed':
        this.state.stats.goalsAchieved++
        points = POINTS.GOAL_COMPLETED
        break

      case 'transformation-completed':
        this.state.stats.transformationsCompleted++
        points = POINTS.TRANSFORMATION_EXERCISE
        break
    }

    // Update longest streak
    const currentMaxStreak = Math.max(
      this.state.streaks.baseline,
      this.state.streaks.triad,
      this.state.streaks.journal
    )
    if (currentMaxStreak > this.state.streaks.longest) {
      this.state.streaks.longest = currentMaxStreak
    }

    // Check for achievements
    const newAchievements = this.checkAllAchievements()
    unlockedAchievements.push(...newAchievements)

    // Award achievement points
    unlockedAchievements.forEach(achievement => {
      points += achievement.points
    })

    // Award points and check for level up
    const previousLevelNumber = this.state.currentLevel
    const previousLevel = this.getCurrentLevel()
    const result = this.awardPoints(points, action)

    this.saveState()

    // Emit level-up event if leveled up
    if (result.leveledUp && result.newLevel) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('levelUp', {
          detail: { newLevel: result.newLevel, previousLevel }
        })
        window.dispatchEvent(event)
      }
    }

    return {
      points: result.pointsAwarded,
      achievements: unlockedAchievements,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      previousLevel: result.leveledUp ? previousLevel : undefined,
    }
  }

  // Check specific achievement
  private checkAchievement(achievementId: string, customMetrics?: any): Achievement | null {
    const achievement = this.state.achievements.find(a => a.id === achievementId)
    if (!achievement || achievement.unlocked) return null

    const { type, target, metric } = achievement.requirement
    let currentValue = 0

    if (type === 'count') {
      currentValue = (this.state.stats as any)[metric] || 0
    } else if (type === 'streak') {
      currentValue = (this.state.streaks as any)[metric] || 0
    } else if (type === 'custom' && customMetrics) {
      currentValue = customMetrics[metric] || 0
    }

    achievement.progress = Math.min((currentValue / target) * 100, 100)

    if (currentValue >= target) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date().toISOString()
      console.log(`🏆 Achievement unlocked: ${achievement.title}!`)
      return achievement
    }

    return null
  }

  // Check all achievements
  private checkAllAchievements(): Achievement[] {
    const unlocked: Achievement[] = []

    this.state.achievements.forEach(achievement => {
      if (achievement.unlocked) return

      const result = this.checkAchievement(achievement.id)
      if (result) unlocked.push(result)
    })

    return unlocked
  }

  // Get current state
  getState(): GamificationState {
    return { ...this.state }
  }

  // Get current level
  getCurrentLevel(): UserLevel {
    return this.calculateLevel(this.state.totalPoints)
  }

  // Get progress to next level
  getProgressToNextLevel(): { current: number; needed: number; percentage: number } {
    const currentLevel = this.getCurrentLevel()
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1)

    if (!nextLevel) {
      return { current: 0, needed: 0, percentage: 100 }
    }

    const current = this.state.totalPoints - currentLevel.minPoints
    const needed = nextLevel.minPoints - currentLevel.minPoints

    return {
      current,
      needed,
      percentage: (current / needed) * 100,
    }
  }

  // Get unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return this.state.achievements.filter(a => a.unlocked)
  }

  // Get locked achievements
  getLockedAchievements(): Achievement[] {
    return this.state.achievements.filter(a => !a.unlocked)
  }

  // Reset streak (for pattern breaks)
  resetStreak(type: 'baseline' | 'triad' | 'journal'): void {
    this.state.streaks[type] = 0
    this.saveState()
  }
}

export const gamificationManager = GamificationManager.getInstance()
