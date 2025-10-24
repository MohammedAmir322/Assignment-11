import { useState, useCallback } from 'react';
import chatService from './chatService';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Welcome to the Volunteer Assistant! I'm here to help you with:\n\n• Event information and registration\n• Volunteer opportunities\n• Platform guidance\n• General support\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage, context = '') => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Check for quick response first
      const quickResponse = chatService.getQuickResponse(userMessage);
      let botResponse;

      if (quickResponse) {
        botResponse = quickResponse;
      } else {
        botResponse = await chatService.generateResponse(userMessage, context);
      }

      const botMsg = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'bot'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        text: error.message || "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "👋 Welcome to the Volunteer Assistant! I'm here to help you with:\n\n• Event information and registration\n• Volunteer opportunities\n• Platform guidance\n• General support\n\nHow can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      }
    ]);
    chatService.clearChatHistory();
  }, []);

  const getChatHistory = useCallback(() => {
    return chatService.getChatHistory();
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    getChatHistory
  };
};