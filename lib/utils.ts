import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function calculateStreak(lastActivityDate: Date | null): number {
  if (!lastActivityDate) return 0

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastActivity = new Date(lastActivityDate)
  lastActivity.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)

  if (lastActivity.getTime() === now.getTime() || lastActivity.getTime() === yesterday.getTime()) {
    return 1 // Continue streak
  }

  return 0 // Streak broken
}
