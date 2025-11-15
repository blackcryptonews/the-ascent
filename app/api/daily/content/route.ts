import { NextRequest, NextResponse } from 'next/server'
import { openaiService } from '@/lib/ai/openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/daily/content
 * Fetches personalized daily content (quote + focus) based on baseline scores
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const energyLevel = parseInt(searchParams.get('energy') || '5')
    const emotionalState = parseInt(searchParams.get('emotion') || '5')
    const goalsParam = searchParams.get('goals') || ''
    const userGoals = goalsParam ? goalsParam.split(',') : ['personal growth']

    // Get personalized quote based on baseline
    const quote = await openaiService.selectPersonalizedQuote(
      energyLevel,
      emotionalState,
      userGoals
    )

    // Get daily focus based on baseline
    const dailyFocus = await openaiService.generateDailyFocus(
      energyLevel,
      emotionalState,
      userGoals
    )

    return NextResponse.json({
      success: true,
      data: {
        quote,
        dailyFocus,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('Error generating daily content:', error)

    // Return fallback content on error
    return NextResponse.json({
      success: true,
      data: {
        quote: {
          text: 'The only impossible journey is the one you never begin.',
          author: 'Tony Robbins',
          category: 'action'
        },
        dailyFocus: 'MAKE TODAY MEANINGFUL',
        generatedAt: new Date().toISOString(),
        fallback: true
      }
    })
  }
}

/**
 * POST /api/daily/content
 * Same as GET but accepts body parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { energyLevel, emotionalState, userGoals } = body

    // Validate inputs
    const energy = Math.max(1, Math.min(10, energyLevel || 5))
    const emotion = Math.max(1, Math.min(10, emotionalState || 5))
    const goals = Array.isArray(userGoals) && userGoals.length > 0
      ? userGoals
      : ['personal growth']

    // Get personalized quote based on baseline
    const quote = await openaiService.selectPersonalizedQuote(
      energy,
      emotion,
      goals
    )

    // Get daily focus based on baseline
    const dailyFocus = await openaiService.generateDailyFocus(
      energy,
      emotion,
      goals
    )

    return NextResponse.json({
      success: true,
      data: {
        quote,
        dailyFocus,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('Error generating daily content:', error)

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate daily content',
      data: {
        quote: {
          text: 'The only impossible journey is the one you never begin.',
          author: 'Tony Robbins',
          category: 'action'
        },
        dailyFocus: 'MAKE TODAY MEANINGFUL',
        generatedAt: new Date().toISOString(),
        fallback: true
      }
    }, { status: 500 })
  }
}
