'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '@/hooks/useSettings';

export function WhatsAppButton() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

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
  const whatsappNumber = settings.whatsapp || settings.phone || '+9779800000000';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`,
        '_blank'
      );
      setMessage('');
      setIsOpen(false);
    }
  };

  const quickMessages = [
    'I want to book an appointment',
    'I need information about your specialist services',
    'I want details about health card benefits',
    'What are your clinic timings?',
    'I need help booking a lab test or service',
  ];

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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat with us</h3>
                    <p className="text-sm text-green-100">Typically replies within minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="p-4 border-b border-neutral-100">
              <p className="text-sm text-neutral-500 mb-3">Quick messages:</p>
              <div className="space-y-2">
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(msg)}
                    className="w-full text-left text-sm px-3 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Chat on WhatsApp"
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
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FaWhatsapp className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse animation */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
      )}
    </div>
  );
}
