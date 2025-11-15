import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openaiService } from '@/lib/ai/openai'

/**
 * GET /api/daily/question
 * Get or generate today's power question
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Get user ID from session
    // For now, using a hardcoded test user
    const userId = 'test-user-id'

    // Check if user already has a question for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let existingQuestion = await prisma.dailyQuestion.findFirst({
      where: {
        userId,
        createdAt: {
          gte: today,
        }
      }
    })

    if (existingQuestion) {
      return NextResponse.json({ question: existingQuestion })
    }

    // Get user profile for personalization
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId }
    })

    // Create user and profile if they don't exist (for testing)
    if (!userProfile) {
      const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User',
        }
      })

      userProfile = await prisma.userProfile.create({
        data: {
          userId,
          primaryGoals: 'Build confidence,Improve health,Grow career',
          currentFocusArea: 'Building positive habits',
          negativeWords: "can't,impossible,failure"
        }
      })
    }

    // Get recent answers for context
    const recentAnswers = await prisma.dailyQuestion.findMany({
      where: {
        userId,
        answeredAt: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      take: 7,
      select: { responseText: true }
    })

    // Generate new question using AI
    const questionText = await openaiService.generateDailyQuestion({
      goals: userProfile.primaryGoals.split(","),
      recentAnswers: recentAnswers.map(a => a.responseText || ''),
      currentFocusArea: userProfile.currentFocusArea || '',
      negativePatterns: userProfile.negativeWords.split(",")
    })

    // Save question
    const newQuestion = await prisma.dailyQuestion.create({
      data: {
        userId,
        questionText,
        questionType: 'reflection'
      }
    })

    return NextResponse.json({ question: newQuestion })

  } catch (error: any) {
    console.error('Error generating daily question:', error)
    return NextResponse.json(
      { error: 'Failed to generate question', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/daily/question
 * Submit answer to daily question
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { questionId, responseText } = body

    if (!questionId || !responseText) {
      return NextResponse.json(
        { error: 'questionId and responseText are required' },
        { status: 400 }
      )
    }

    // Update question with answer
    const updated = await prisma.dailyQuestion.update({
      where: { id: questionId },
      data: {
        responseText,
        answeredAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    // Update streak
    const profile = updated.user.profile
    if (profile) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const lastActivity = profile.lastActivityDate ? new Date(profile.lastActivityDate) : null
      let newStreakCount = profile.streakCount

      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastActivity.getTime() === yesterday.getTime()) {
          // Continue streak
          newStreakCount += 1
        } else if (lastActivity.getTime() < yesterday.getTime()) {
          // Streak broken
          newStreakCount = 1
        }
      } else {
        newStreakCount = 1
      }

      // Award points
      const pointsToAward = 10

      await prisma.userProfile.update({
        where: { userId: updated.userId },
        data: {
          streakCount: newStreakCount,
          lastActivityDate: today,
          totalPoints: { increment: pointsToAward }
        }
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: updated.userId,
          activityType: 'daily_question_answered',
          pointsEarned: pointsToAward
        }
      })

      // Generate AI coaching insight
      try {
        const insight = await openaiService.generateCoachingInsight(responseText)

        await prisma.aIInsight.create({
          data: {
            userId: updated.userId,
            insightType: 'encouragement',
            insightText: insight,
            confidenceScore: 0.9,
            relatedEntryId: questionId
          }
        })

        return NextResponse.json({
          success: true,
          question: updated,
          streak: newStreakCount,
          points: pointsToAward,
          insight
        })
      } catch (aiError) {
        console.error('AI insight generation failed:', aiError)
        return NextResponse.json({
          success: true,
          question: updated,
          streak: newStreakCount,
          points: pointsToAward
        })
      }
    }

    return NextResponse.json({
      success: true,
      question: updated
    })

  } catch (error: any) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: 'Failed to submit answer', details: error.message },
      { status: 500 }
    )
  }
}
