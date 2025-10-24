import { GoogleGenAI } from '@google/genai';

class ChatService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });
    this.chatHistory = [];
  }

  async generateResponse(userMessage, context = '') {
    try {
      const prompt = this.buildPrompt(userMessage, context);
      
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const botResponse = response.text || "I'm sorry, I couldn't process your request. Please try again.";
      
      // Store in chat history
      this.chatHistory.push({
        user: userMessage,
        bot: botResponse,
        timestamp: new Date()
      });

      return botResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error("I'm sorry, I'm having trouble connecting right now. Please try again later.");
    }
  }

  buildPrompt(userMessage, context = '') {
    const baseContext = `
    You are a helpful AI assistant for a volunteer platform. Your role is to:
    
    1. Help users find volunteer opportunities
    2. Provide information about events and activities
    3. Guide users through registration processes
    4. Answer questions about the platform
    5. Offer support and encouragement for volunteering
    
    Key features of this platform:
    - Event creation and management
    - Volunteer registration system
    - Rating and feedback system
    - Blog and community features
    - Dashboard for tracking activities
    
    Always be friendly, encouraging, and helpful. If you don't know something specific about the platform, suggest they contact support or check the relevant sections.
    `;

    const historyContext = this.chatHistory.length > 0 
      ? `\n\nPrevious conversation context:\n${this.chatHistory.slice(-3).map(h => `User: ${h.user}\nBot: ${h.bot}`).join('\n')}`
      : '';

    return `${baseContext}${context}${historyContext}\n\nUser's current question: ${userMessage}`;
  }

  getChatHistory() {
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
  }

  // Predefined responses for common queries
  getQuickResponse(query) {
    const quickResponses = {
      'hello': "Hello! I'm your volunteer assistant. How can I help you today?",
      'help': "I can help you with:\n• Finding volunteer events\n• Registration guidance\n• Platform navigation\n• General support\n\nWhat would you like to know?",
      'events': "To find volunteer events, you can:\n• Check the Events section in the main menu\n• Use the search feature to filter by location, date, or type\n• Browse upcoming events on the dashboard\n\nWould you like me to guide you through any specific event?",
      'register': "To register as a volunteer:\n• Go to the 'Be a Volunteer' section\n• Fill out the volunteer application form\n• Wait for approval from administrators\n• Once approved, you can join events\n\nNeed help with any specific step?",
      'contact': "For additional support:\n• Check the FAQ section\n• Contact the platform administrators\n• Use the feedback system\n• Join community discussions\n\nIs there something specific I can help you with?"
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(quickResponses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }
    return null;
  }
}

export default new ChatService();