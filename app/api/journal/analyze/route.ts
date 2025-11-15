import { NextRequest, NextResponse } from 'next/server'
import { openaiService } from '@/lib/ai/openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/journal/analyze
 * Analyzes journal entry using OpenAI for sentiment, patterns, and insights
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entryText, userNegativeWords } = body

    if (!entryText || entryText.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Entry text is required'
      }, { status: 400 })
    }

    // Analyze with OpenAI
    const analysis = await openaiService.analyzeJournalEntry(
      entryText,
      userNegativeWords || []
    )

    return NextResponse.json({
      success: true,
      data: analysis
    })
  } catch (error: any) {
    console.error('Error analyzing journal entry:', error)

    // Return basic client-side analysis as fallback
    const entryText = (await request.json()).entryText || ''
    const lowerText = entryText.toLowerCase()

    const positiveWords = ['good', 'great', 'happy', 'excited', 'amazing', 'wonderful', 'love', 'enjoy']
    const negativeWords = ['bad', 'sad', 'angry', 'hate', 'terrible', 'awful', 'difficult', 'hard']

    const positiveCount = positiveWords.filter((word: string) => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter((word: string) => lowerText.includes(word)).length

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
    }

    return NextResponse.json({
      success: true,
      data: {
        sentiment,
        negativeWordsUsed: [],
        patterns: [],
        insight: 'Keep reflecting on your journey - every insight brings you closer to transformation.'
      },
      fallback: true
    })
  }
}
