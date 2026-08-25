'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiRefreshCw, FiHeart } from 'react-icons/fi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  'How do I book an appointment?',
  'What specialists are available?',
  'What are your working hours?',
  'Services offered',
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Welcome to Nita Clinic. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll-aware visibility: visible while scrolling, auto-hides 4s after scrolling stops
  const [isVisible, setIsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpenRef = useRef(false);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!isOpenRef.current) setIsVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(true);
      scheduleHide();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    scheduleHide(); // hide after 4s of inactivity on load
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  // Keep isOpen in a ref and keep the widget visible while the chat is open
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setIsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/chatbot/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     message: text, 
      //     history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })) 
      //   }),
      // });
      // const data = await response.json();
      
      // Simulated response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const simulatedResponses: Record<string, string> = {
        'How do I book an appointment?': 'You can book an appointment from the website by clicking "Book Appointment" in the menu, or call the clinic directly. You can choose your preferred specialist, date, and time slot.',
        'What specialists are available?': 'Nita Clinic provides specialist consultations in areas such as gynecology, pediatrics, tuberculosis care, and general outpatient services. You can view the full team on the Team Members and Specialists pages.',
        'What are your working hours?': 'Our clinic hours may vary by service. Please check the Contact page for current timings or call us directly for urgent support.',
        'Services offered': 'We offer lab & service tests, check-up packages, vaccination services, specialist consultations, online consultations, home visits, and preventive healthcare plans including our health card benefits.',
      };
      
      const responseText = simulatedResponses[text] || 
        "Thank you for your question. For specific inquiries, please contact us at info@nitaclinics.com or call the clinic directly. Is there anything else I can help you with?";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm experiencing technical difficulties. Please try again or contact us directly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! Welcome to Nita Clinic. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
      }}
      onMouseEnter={() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }}
      onMouseLeave={scheduleHide}
      aria-hidden={!isVisible}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FiHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Clinic Assistant</h3>
                    <p className="text-sm text-primary-200">Ask me anything</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Clear chat"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-accent-100 text-accent-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <FiUser className="w-4 h-4" />
                    ) : (
                      <FiHeart className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-white text-neutral-700 shadow-soft rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center">
                    <FiHeart className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="p-3 border-t border-neutral-100 bg-white">
                <p className="text-xs text-neutral-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-neutral-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-primary-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiX className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FiMessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
