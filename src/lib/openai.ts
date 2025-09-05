import OpenAI from 'openai';

// Initialize OpenAI client only when API key is available
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend API
  });
};

export interface TravelContext {
  destination: string;
  budget: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  selectedDay?: string | null;
  existingActivities?: string[];
}

export const generateTravelResponse = async (
  userMessage: string,
  context: TravelContext
): Promise<string> => {
  const openai = getOpenAIClient();
  
  // If no API key is configured, use fallback response immediately
  if (!openai) {
    console.warn('OpenAI API key not configured. Using fallback responses.');
    return getFallbackResponse(userMessage, context);
  }

  try {
    const systemPrompt = `You are TravelGenie, an expert AI travel assistant. You help users plan amazing trips with personalized recommendations.

Current Trip Context:
- Destination: ${context.destination}
- Budget: $${context.budget} (Spent: $${context.spentAmount}, Remaining: $${context.budget - context.spentAmount})
- Trip Dates: ${context.startDate} to ${context.endDate}
- Selected Day: ${context.selectedDay || 'None'}
- Existing Activities: ${context.existingActivities?.join(', ') || 'None'}

Guidelines:
- Provide specific, actionable travel recommendations
- Include estimated costs, timing, and locations when relevant
- Consider the user's remaining budget
- Suggest activities appropriate for the destination and dates
- Be enthusiastic and helpful
- Format responses with emojis and clear sections
- Keep responses concise but informative (max 300 words)
- If asked about adding activities, provide specific suggestions with times and costs`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now. Please try again!";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback to simulated response if API fails
    return getFallbackResponse(userMessage, context);
  }
};

// Fallback function for when OpenAI API is unavailable
const getFallbackResponse = (message: string, context: TravelContext): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    return `🌟 **Great question!** Based on your trip to ${context.destination}, here are some personalized recommendations:

🏛️ **Must-Visit Attractions:**
- Historic city center tour (2-3 hours, $15-25)
- Local cultural museum (1-2 hours, $10-15)
- Scenic viewpoint for photos (1 hour, free)

🍴 **Dining Experiences:**
- Traditional local restaurant ($20-35 per meal)
- Street food market tour ($10-15)
- Rooftop dining with views ($40-60)

💰 **Budget Status:** You have $${context.budget - context.spentAmount} remaining from your $${context.budget} budget.

Would you like me to help you add any of these to your itinerary? I can provide more specific details about timing and booking! ✨`;
  }
  
  return `✨ **I'm here to help with your ${context.destination} adventure!**

I can assist with:
🎯 **Activity Recommendations** - Perfect spots for your interests
📅 **Itinerary Planning** - Optimal timing and routes  
💰 **Budget Optimization** - Great value experiences
🚗 **Transportation Tips** - Getting around efficiently
🏛️ **Local Insights** - Hidden gems and cultural tips

What would you like to explore first? I'm ready to make your trip unforgettable! 🌟`;
};