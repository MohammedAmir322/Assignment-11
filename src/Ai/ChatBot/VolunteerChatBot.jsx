import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FiSend, FiMessageCircle, FiX, FiMinus, FiSquare, FiUser, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';

const VolunteerChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Welcome to the Volunteer Assistant! I'm here to help you with:\n\n• Event information and registration\n• Volunteer opportunities\n• Platform guidance\n• General support\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  });

  const getVolunteerContext = () => {
    return `
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
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = getVolunteerContext();
      const prompt = `${context}\n\nUser's question: ${inputMessage}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.text || "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later. You can also try refreshing the page or checking your internet connection.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const getQuickActions = () => [
    { text: "Find volunteer events", icon: Calendar },
    { text: "How to register?", icon: User },
    { text: "Platform help", icon: MessageCircle },
    { text: "Contact support", icon: MessageCircle }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action.text);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-yellow-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300"
          onClick={toggleChat}
        >
          <FiUser size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            AI
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 ${
              isMinimized ? 'h-16 w-80' : 'h-[500px] w-96'
            } transition-all duration-300`}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiUser size={20} />
                <div>
                  <span className="font-semibold">Volunteer Assistant</span>
                  <div className="text-xs opacity-80">AI-powered help</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                >
                  {isMinimized ? <Maximize size={16} /> : <Minus size={16} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === 'bot' && (
                            <Bot size={16} className="mt-1 flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <User size={16} className="mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{formatMessage(message.text)}</p>
                            <div className="flex items-center space-x-1 mt-2">
                              <Clock size={12} className="opacity-70" />
                              <p className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getQuickActions().map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="flex items-center space-x-1 bg-white border border-blue-200 text-blue-600 px-2 py-1 rounded-full text-xs hover:bg-blue-100 transition-colors"
                        >
                          <action.icon size={12} />
                          <span>{action.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about volunteer opportunities, events, or get help..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Powered by Gemini AI • Ask anything about volunteering!
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VolunteerChatBot;