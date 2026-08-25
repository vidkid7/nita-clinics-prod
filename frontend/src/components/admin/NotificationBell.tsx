'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import { format, addDays, parseISO } from 'date-fns';
import { get } from '@/lib/api';

interface AppointmentNotification {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  startTime: string;
  status: string;
  createdAt: string;
  isRead?: boolean;
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppointmentNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedSound = useRef(false);

  // Load notifications for next 7 days
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const today = format(new Date(), 'yyyy-MM-dd');
        const sevenDaysLater = format(addDays(new Date(), 7), 'yyyy-MM-dd');

        const response = await get<{ data: AppointmentNotification[]; total: number }>('appointments', {
          params: {
            page: 1,
            limit: 100,
            startDate: today,
            endDate: sevenDaysLater,
            sortBy: 'date',
            sortOrder: 'asc',
          },
        });

        // Map appointments to notifications, marking new ones as unread
        // Check localStorage for read notifications
        const readNotifications = JSON.parse(
          localStorage.getItem('readNotifications') || '[]'
        ) as string[];

        const mappedNotifications = response.data.map((apt: any) => ({
          id: apt.id,
          patientName: apt.patientName,
          doctorName: apt.doctor?.name || apt.doctorName || 'Unknown Doctor',
          date: apt.date,
          startTime: apt.startTime,
          status: apt.status,
          createdAt: apt.createdAt,
          isRead: readNotifications.includes(apt.id),
        }));

        // Sort by creation date, newest first (most recent appointments first)
        mappedNotifications.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        // Check if there are new unread notifications
        const previousUnreadCount = notifications.filter((n) => !n.isRead).length;
        const newUnreadCount = mappedNotifications.filter((n) => !n.isRead).length;
        const hasNewNotifications = newUnreadCount > previousUnreadCount;

        setNotifications(mappedNotifications);

        // Play sound for new notifications
        if (hasNewNotifications && newUnreadCount > 0) {
          playNotificationSound();
        }
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    // Also listen for storage events (when appointments are created from other tabs)
    const handleStorageChange = () => {
      loadNotifications();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // Save to localStorage
    const readNotifications = JSON.parse(
      localStorage.getItem('readNotifications') || '[]'
    ) as string[];
    if (!readNotifications.includes(id)) {
      readNotifications.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatNotificationDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      const tomorrow = addDays(today, 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Today';
      } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-elevated border border-neutral-200 z-50 max-h-[600px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-primary-600 font-medium mt-0.5">
                      {unreadCount} new appointment{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="p-8 text-center text-neutral-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-sm">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">
                    <FiCalendar className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                    <p className="text-sm">No appointments in the next 7 days</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-primary-50/50' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                          router.push('/admin/appointments');
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <FiCalendar className="w-5 h-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-neutral-900 text-sm">
                                    {notification.patientName}
                                  </p>
                                  {!notification.isRead && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-600 mt-1">
                                  with {notification.doctorName}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                                  <span>{formatNotificationDate(notification.date)}</span>
                                  <span>•</span>
                                  <span>{notification.startTime}</span>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  notification.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : notification.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}
                              >
                                {notification.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/admin/appointments');
                    }}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all appointments
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
