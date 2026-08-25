'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiImage,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiBriefcase,
  FiExternalLink,
  FiBell,
  FiUser,
  FiCreditCard,
  FiClipboard,
  FiTruck,
  FiFile,
  FiShield,
  FiActivity,
  FiHeart,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth, ProtectedRoute } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/admin/NotificationBell';
import { useSettings } from '@/hooks/useSettings';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  {
    name: 'Patients',
    icon: FiHeart,
    children: [
      { name: 'All Patients', href: '/admin/patients' },
    ],
  },
  {
    name: 'Team / Specialists',
    icon: FiUsers,
    children: [
      { name: 'All Doctors', href: '/admin/doctors' },
      { name: 'Add Doctor', href: '/admin/doctors/new' },
    ],
  },
  {
    name: 'Appointments',
    icon: FiCalendar,
    children: [
      { name: 'All Appointments', href: '/admin/appointments' },
    ],
  },
  { name: 'Home services', href: '/admin/services', icon: FiBriefcase },
  { name: 'Packages', href: '/admin/packages', icon: FiBriefcase },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: FiCreditCard },
  {
    name: 'Health Cards',
    icon: FiCreditCard,
    children: [
      { name: 'Categories', href: '/admin/health-card' },
      { name: 'Applications', href: '/admin/health-cards/applications' },
      { name: 'Issued Cards', href: '/admin/health-cards/issued' },
    ],
  },
  { name: 'Partners', href: '/admin/partners', icon: FiUsers },
  {
    name: 'Lab Tests',
    icon: FiActivity,
    children: [
      { name: 'Manage Tests', href: '/admin/lab-tests' },
    ],
  },
  {
    name: 'Lab Orders',
    icon: FiClipboard,
    children: [
      { name: 'All Orders', href: '/admin/lab-orders' },
    ],
  },
  { name: 'Lab Reports', href: '/admin/lab-reports', icon: FiFile },
  { name: 'Home Collection', href: '/admin/home-collection', icon: FiTruck },
  { name: 'Vaccinations', href: '/admin/vaccinations', icon: FiShield },
  { name: 'Payments', href: '/admin/payments', icon: FiCalendar },
  {
    name: 'Content',
    icon: FiFileText,
    children: [
      { name: 'Site Settings', href: '/admin/content' },
      { name: 'Pages', href: '/admin/content/pages' },
      { name: 'Blog Posts', href: '/admin/blog' },
      { name: 'Testimonials', href: '/admin/testimonials' },
      { name: 'Gallery', href: '/admin/gallery' },
    ],
  },
  { name: 'Enquiries', href: '/admin/enquiries', icon: FiMessageSquare },
  { name: 'Media', href: '/admin/media', icon: FiImage },
  {
    name: 'Settings',
    icon: FiSettings,
    children: [
      { name: 'General', href: '/admin/settings' },
      { name: 'SEO Settings', href: '/admin/settings/seo' },
      { name: 'Payment Config', href: '/admin/settings/payment-config' },
      { name: 'Users', href: '/admin/users' },
      { name: 'Security', href: '/admin/settings/security' },
    ],
  },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  // Auto-expand active parent items
  useEffect(() => {
    const activeParents = navigation
      .filter((item) => item.children?.some((child) => pathname.startsWith(child.href)))
      .map((item) => item.name);
    setExpandedItems((prev) => [...new Set([...prev, ...activeParents])]);
  }, [pathname]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some((child) => pathname.startsWith(child.href));

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  // Don't render sidebar on login/reset pages
  if (pathname === '/admin/login' || pathname.startsWith('/admin/reset-password')) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-100">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 left-0 z-50 h-full w-64 bg-neutral-900 transform transition-transform duration-200 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white">
                <Image
                  src={settings.logo || '/logo.png'}
                  alt={settings.siteName || 'Nita Clinic'}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-semibold text-sm block leading-tight">Nita Clinic</span>
                <span className="text-neutral-400 text-xs">Admin Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                        isParentActive(item.children)
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </span>
                      <FiChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          expandedItems.includes(item.name) && 'rotate-180'
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedItems.includes(item.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-neutral-700">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  'block px-3 py-2 rounded-lg text-sm transition-colors',
                                  isActive(child.href)
                                    ? 'bg-primary-600 text-white'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive(item.href!)
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User section at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800 bg-neutral-900">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-neutral-400 text-xs truncate">{user?.role || 'admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 h-16">
            <div className="flex items-center justify-between h-full px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-neutral-600 hover:text-neutral-900"
              >
                <FiMenu className="w-6 h-6" />
              </button>

              <div className="flex-1 lg:flex-none">
                {/* Breadcrumb could go here */}
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <NotificationBell />

                {/* View Site */}
                <Link
                  href="/"
                  target="_blank"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                  View Site
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700 hidden md:inline">
                      {user?.name || 'Admin'}
                    </span>
                    <FiChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card border border-neutral-100 py-2 z-50"
                        >
                          <div className="px-4 py-2 border-b border-neutral-100">
                            <p className="font-medium text-neutral-900">{user?.name}</p>
                            <p className="text-sm text-neutral-500">{user?.email}</p>
                          </div>
                          <Link
                            href="/admin/settings/security"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FiSettings className="w-4 h-4" />
                            Security
                          </Link>
                          <div className="border-t border-neutral-100 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <FiLogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
