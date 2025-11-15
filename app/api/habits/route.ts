import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/habits
 * Get all habits for the current user
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Get from session
    const userId = 'test-user-id'

    const habits = await prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        painPleasureExercises: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    return NextResponse.json({ habits })
  } catch (error: any) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habits', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/habits
 * Create a new habit to transform
 */
export async function POST(req: NextRequest) {
  try {
    const userId = 'test-user-id'
    const body = await req.json()

    const { habitName, habitType, currentBehavior, desiredBehavior } = body

    if (!habitName || !habitType || !currentBehavior || !desiredBehavior) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        habitName,
        habitType,
        currentBehavior,
        desiredBehavior
      }
    })

    return NextResponse.json({ habit })
  } catch (error: any) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Failed to create habit', details: error.message },
      { status: 500 }
    )
  }
}
