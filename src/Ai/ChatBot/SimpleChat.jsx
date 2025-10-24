import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiX, FiMinus, FiSquare, FiUser, FiClock, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from './useChat';

const SimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
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

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300"
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
                  onClick={clearChat}
                  className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                  title="Clear chat"
                >
                  <FiRefreshCw size={16} />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                >
                  {isMinimized ? <FiSquare size={16} /> : <FiMinus size={16} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                >
                  <FiX size={16} />
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
                            <FiUser size={16} className="mt-1 flex-shrink-0" />
                          )}
                          {message.sender === 'user' && (
                            <FiUser size={16} className="mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{formatMessage(message.text)}</p>
                            <div className="flex items-center space-x-1 mt-2">
                              <FiClock size={12} className="opacity-70" />
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
                      <FiSend size={20} />
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

export default SimpleChat;