import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

export type Goal = {
  id: string
  user_id: string
  name: string
  category: string
  is_custom: boolean
  completed: boolean
  created_at: string
}

export type OnboardingData = {
  id: string
  user_id: string
  name: string
  email: string
  goals: string[] // Array of goal IDs
  satisfaction: {
    health: number
    career: number
    relationships: number
    personal: number
    finances: number
  }
  motivation_style: string
  challenge: string
  checkin_time: string
  created_at: string
}

// Helper Functions for Data Sync

// Create or get user by email
export async function getOrCreateUser(email: string, name: string) {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return { data: existingUser, error: null }
    }

    // Create new user if not found
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ email, name }])
      .select()
      .single()

    return { data: newUser, error: createError }
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    return { data: null, error }
  }
}

// Save onboarding data
export async function saveOnboardingData(
  userId: string,
  data: {
    name: string
    email: string
    goals: string[]
    customGoals: string[]
    satisfaction: {
      health: number
      career: number
      relationships: number
      personal: number
      finances: number
    }
    motivationStyle: string
    challenge: string
    checkinTime: string
  }
) {
  try {
    // Save onboarding data
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding_data')
      .upsert([
        {
          user_id: userId,
          name: data.name,
          email: data.email,
          goals: data.goals,
          satisfaction: data.satisfaction,
          motivation_style: data.motivationStyle,
          challenge: data.challenge,
          checkin_time: data.checkinTime
        }
      ])
      .select()

    if (onboardingError) throw onboardingError

    // Save predefined goals
    const goalInserts = data.goals.map(goalName => ({
      user_id: userId,
      name: goalName,
      category: getCategoryForGoal(goalName),
      is_custom: false,
      completed: false
    }))

    // Save custom goals
    const customGoalInserts = data.customGoals.map(goalName => ({
      user_id: userId,
      name: goalName,
      category: 'personal',
      is_custom: true,
      completed: false
    }))

    const allGoals = [...goalInserts, ...customGoalInserts]

    if (allGoals.length > 0) {
      const { error: goalsError } = await supabase.from('goals').insert(allGoals)
      if (goalsError) throw goalsError
    }

    return { data: onboarding, error: null }
  } catch (error) {
    console.error('Error saving onboarding data:', error)
    return { data: null, error }
  }
}

// Get user goals
export async function getUserGoals(userId: string) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    return { data, error }
  } catch (error) {
    console.error('Error fetching user goals:', error)
    return { data: null, error }
  }
}

// Update goal completion status
export async function updateGoalCompletion(goalId: string, completed: boolean) {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update({ completed })
      .eq('id', goalId)
      .select()

    return { data, error }
  } catch (error) {
    console.error('Error updating goal:', error)
    return { data: null, error }
  }
}

// Get onboarding data for user
export async function getOnboardingData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error fetching onboarding data:', error)
    return { data: null, error }
  }
}

// Helper function to determine goal category
function getCategoryForGoal(goalName: string): string {
  const healthGoals = ['lose weight', 'build muscle', 'improve sleep', 'eat healthier', 'exercise regularly']
  const careerGoals = ['get promoted', 'start a business', 'learn new skill', 'increase income']
  const relationshipGoals = ['improve relationships', 'find partner', 'strengthen marriage', 'connect with family']
  const personalGoals = ['develop confidence', 'reduce stress', 'improve mindset', 'build discipline']
  const financeGoals = ['save money', 'reduce debt', 'invest wisely', 'create budget']

  const lowerGoal = goalName.toLowerCase()

  if (healthGoals.some(g => lowerGoal.includes(g))) return 'health'
  if (careerGoals.some(g => lowerGoal.includes(g))) return 'career'
  if (relationshipGoals.some(g => lowerGoal.includes(g))) return 'relationships'
  if (financeGoals.some(g => lowerGoal.includes(g))) return 'finances'
  return 'personal'
}
