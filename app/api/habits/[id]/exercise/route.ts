import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openaiService } from '@/lib/ai/openai'

/**
 * POST /api/habits/[id]/exercise
 * Create or update pain/pleasure exercise for a habit
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'test-user-id'
    const habitId = params.id
    const body = await req.json()
    const { step } = body

    // Get the habit
    const habit = await prisma.habit.findUnique({
      where: { id: habitId, userId }
    })

    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }

    // Generate pain scenario
    if (step === 'generate_pain') {
      const painScenario = await openaiService.generatePainScenario(
        habit.currentBehavior,
        '5 years'
      )

      return NextResponse.json({ painScenario })
    }

    // Generate pleasure scenario
    if (step === 'generate_pleasure') {
      const pleasureScenario = await openaiService.generatePleasureScenario(
        habit.currentBehavior,
        habit.desiredBehavior,
        '5 years'
      )

      return NextResponse.json({ pleasureScenario })
    }

    // Complete the exercise
    if (step === 'complete') {
      const {
        painScenario,
        painVisualization,
        painIntensity,
        pleasureScenario,
        pleasureVisualization,
        pleasureIntensity
      } = body

      const exercise = await prisma.painPleasureExercise.create({
        data: {
          habitId,
          userId,
          painScenario,
          painVisualization,
          painIntensity,
          pleasureScenario,
          pleasureVisualization,
          pleasureIntensity,
          completedAt: new Date()
        }
      })

      // Award points
      await prisma.userProfile.update({
        where: { userId },
        data: {
          totalPoints: { increment: 50 }
        }
      })

      await prisma.activityLog.create({
        data: {
          userId,
          activityType: 'pain_pleasure_exercise_completed',
          pointsEarned: 50
        }
      })

      return NextResponse.json({ success: true, exercise })
    }

    return NextResponse.json(
      { error: 'Invalid step' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Error in exercise flow:', error)
    return NextResponse.json(
      { error: 'Exercise failed', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/habits/[id]/exercise
 * Get the latest exercise for a habit
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'test-user-id'
    const habitId = params.id

    const exercise = await prisma.painPleasureExercise.findFirst({
      where: { habitId, userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ exercise })
  } catch (error: any) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercise', details: error.message },
      { status: 500 }
    )
  }
}
