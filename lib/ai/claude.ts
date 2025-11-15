import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface UserContext {
  goals: string[]
  recentAnswers: string[]
  currentFocusArea: string
  negativePatterns: string[]
}

export interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative'
  negativeWordsUsed: string[]
  patterns: string[]
  insight: string
}

export class ClaudeAIService {
  /**
   * Generate a personalized daily power question
   */
  async generateDailyQuestion(userContext: UserContext): Promise<string> {
    const prompt = `You are a personal transformation coach in the style of Tony Robbins.

User Context:
- Primary Goals: ${userContext.goals.join(', ')}
- Current Focus: ${userContext.currentFocusArea}
- Recent Patterns: ${userContext.negativePatterns.join(', ')}

Generate ONE powerful, specific daily question that will:
1. Move them toward their goals
2. Challenge limiting beliefs
3. Create emotional engagement
4. Require thoughtful reflection

The question should be empowering and action-oriented. Return ONLY the question, no explanation.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    return content.type === 'text' ? content.text : ''
  }

  /**
   * Analyze a journal entry for patterns and insights
   */
  async analyzeJournalEntry(
    entryText: string,
    userNegativeWords: string[]
  ): Promise<AnalysisResult> {
    const prompt = `Analyze this journal entry for emotional patterns and insights:

"${entryText}"

User's known negative vocabulary: ${userNegativeWords.join(', ')}

Provide:
1. Sentiment (positive/neutral/negative)
2. Detected negative words from their list
3. Emotional patterns (repeated themes)
4. One brief, empowering insight or coaching suggestion (max 2 sentences)

Respond in JSON format:
{
  "sentiment": "positive|neutral|negative",
  "negativeWordsUsed": ["word1", "word2"],
  "patterns": ["pattern1", "pattern2"],
  "insight": "Brief coaching insight here"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    if (content.type === 'text') {
      return JSON.parse(content.text)
    }

    throw new Error('Invalid response from Claude')
  }

  /**
   * Generate a pain scenario for the Dickens Pattern exercise
   */
  async generatePainScenario(
    habit: string,
    timeframe: string = '5 years'
  ): Promise<string> {
    const prompt = `You are guiding someone through the "Dickens Pattern" - a powerful visualization exercise.

The user wants to STOP this behavior: "${habit}"

Create a vivid, emotionally compelling scenario of where they'll be in ${timeframe} if they CONTINUE this habit. Make it:
- Specific and visual
- Emotionally impactful
- Realistic but intense
- First-person perspective
- 2-3 sentences maximum

Focus on the CUMULATIVE COST and lost opportunities.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    return content.type === 'text' ? content.text : ''
  }

  /**
   * Generate a pleasure scenario for transformation visualization
   */
  async generatePleasureScenario(
    currentHabit: string,
    desiredBehavior: string,
    timeframe: string = '5 years'
  ): Promise<string> {
    const prompt = `You are guiding someone through visualization of their empowered future.

Current habit: "${currentHabit}"
New behavior: "${desiredBehavior}"

Create a vivid, inspiring scenario of where they'll be in ${timeframe} having MASTERED this new behavior. Make it:
- Specific and visual
- Emotionally uplifting
- Emphasizes confidence, freedom, and pride
- First-person perspective
- 2-3 sentences maximum

Focus on the COMPOUNDING BENEFITS and transformation.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    return content.type === 'text' ? content.text : ''
  }

  /**
   * Suggest a daily focus area based on user goals and activity
   */
  async suggestFocusArea(
    userGoals: string[],
    recentActivity: any[]
  ): Promise<string> {
    const prompt = `Based on user's goals and recent activity, suggest ONE specific focus for today.

Goals: ${userGoals.join(', ')}
Recent Activity: ${JSON.stringify(recentActivity)}

Return a single, actionable focus statement (e.g., "Today, focus on finding solutions, not dwelling on problems"). Max 15 words.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    return content.type === 'text' ? content.text : ''
  }

  /**
   * Generate personalized coaching insight
   */
  async generateCoachingInsight(responseText: string): Promise<string> {
    const prompt = `You are Tony Robbins, a master personal transformation coach. A user just answered their daily power question with this response:

"${responseText}"

Provide a brief (2-3 sentences), powerful coaching insight that:
1. Acknowledges their reflection
2. Offers an empowering reframe or next step
3. Energizes them to take action

Be encouraging, direct, and passionate. Use Tony Robbins' coaching style.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0]
    return content.type === 'text' ? content.text : ''
  }
}

export const claudeService = new ClaudeAIService()
