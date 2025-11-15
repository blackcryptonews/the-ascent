import OpenAI from 'openai'

// Lazy-load the client to avoid build-time errors
let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    client = new OpenAI({
      apiKey,
    })
  }
  return client
}

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

export class OpenAIService {
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 200,
      temperature: 0.8
    })

    return response.choices[0]?.message?.content || 'What action can you take today to move closer to your goals?'
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 500,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content
    if (content) {
      try {
        return JSON.parse(content)
      } catch (e) {
        // Fallback if JSON parsing fails
        return {
          sentiment: 'neutral',
          negativeWordsUsed: [],
          patterns: [],
          insight: 'Keep reflecting on your journey - every insight brings you closer to transformation.'
        }
      }
    }

    throw new Error('Invalid response from OpenAI')
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 300,
      temperature: 0.8
    })

    return response.choices[0]?.message?.content || 'Continuing this path will cost you more than you realize.'
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 300,
      temperature: 0.8
    })

    return response.choices[0]?.message?.content || 'Your transformed future is brighter than you can imagine.'
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 100,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content || 'Focus on taking one powerful action today.'
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

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 250,
      temperature: 0.8
    })

    return response.choices[0]?.message?.content || 'Great reflection! Now take massive action and make it happen!'
  }

  /**
   * Select a personalized power quote based on baseline scores
   */
  async selectPersonalizedQuote(
    energyLevel: number,
    emotionalState: number,
    userGoals: string[]
  ): Promise<{ text: string; author: string; category: string }> {
    const prompt = `You are a motivational coach selecting the perfect quote for someone.

Current State:
- Energy Level: ${energyLevel}/10
- Emotional State: ${emotionalState}/10
- Goals: ${userGoals.join(', ')}

Based on their state, select ONE powerful quote that will:
${energyLevel <= 4 && emotionalState <= 4 ? '- Energize and uplift them from a low state' : ''}
${energyLevel <= 4 && emotionalState > 6 ? '- Give them practical energy despite good mood' : ''}
${energyLevel > 6 && emotionalState <= 4 ? '- Help them channel their energy positively' : ''}
${energyLevel > 6 && emotionalState > 6 ? '- Amplify their momentum and focus it' : ''}

Return a JSON object with:
{
  "text": "The quote text",
  "author": "Quote author",
  "category": "action|courage|focus|persistence|gratitude|confidence|energy|patience"
}

Choose from famous motivational speakers, philosophers, or leaders. Make it relevant and powerful.`

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 300,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (content) {
      try {
        return JSON.parse(content)
      } catch (e) {
        return {
          text: 'The only impossible journey is the one you never begin.',
          author: 'Tony Robbins',
          category: 'action'
        }
      }
    }

    return {
      text: 'The only impossible journey is the one you never begin.',
      author: 'Tony Robbins',
      category: 'action'
    }
  }

  /**
   * Generate an AI-powered daily focus based on baseline and goals
   */
  async generateDailyFocus(
    energyLevel: number,
    emotionalState: number,
    userGoals: string[],
    recentPatterns?: string[]
  ): Promise<string> {
    const prompt = `You are creating a powerful daily focus statement for someone.

Current State:
- Energy: ${energyLevel}/10
- Emotion: ${emotionalState}/10
- Goals: ${userGoals.join(', ')}
${recentPatterns ? `- Recent Patterns: ${recentPatterns.join(', ')}` : ''}

Create ONE short, powerful focus statement (max 12 words) that:
1. Matches their current energy/emotional state
2. Aligns with their goals
3. Is actionable and empowering
4. Uses active, commanding language

Examples:
- "START WITH THE HARDEST TASK"
- "TURN ANXIETY INTO ACTION"
- "FOCUS ON PROGRESS, NOT PERFECTION"

Return ONLY the focus statement, no explanation.`

    const response = await getClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 50,
      temperature: 0.8
    })

    return response.choices[0]?.message?.content?.toUpperCase() || 'MAKE TODAY MEANINGFUL'
  }
}

export const openaiService = new OpenAIService()
