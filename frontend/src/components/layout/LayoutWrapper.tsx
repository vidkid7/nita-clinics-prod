'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { LiquidBackdrop } from '@/components/ui/LiquidBackdrop';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current page is admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // If it's an admin route, only render children (admin has its own layout)
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For public routes, render with Header, Footer, WhatsApp, and Chatbot
  return (
    <>
      <LiquidBackdrop />
      <Header />
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatbotWidget />
    </>
  );
}
