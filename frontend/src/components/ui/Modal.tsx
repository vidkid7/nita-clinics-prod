'use client';

import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full bg-white rounded-2xl shadow-elevated max-h-[90vh] flex flex-col',
                sizes[size]
              )}
            >
              {/* Header (sticky) */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-6 border-b border-neutral-100 shrink-0">
                  <div>
                    {title && (
                      <h2 className="text-xl font-heading font-semibold text-neutral-900">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-neutral-500">{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 -m-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-100"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content (scrolls internally) */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
