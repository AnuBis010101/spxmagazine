'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Video,
  MessageSquare,
  ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  X,
  BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Posts', href: '/admin/posts', icon: FileText },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Tweets', href: '/admin/tweets', icon: MessageSquare },
  { label: 'Glossary', href: '/admin/glossary', icon: BookOpen },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="h-16 flex items-center px-6 border-b border-mag-border shrink-0">
        <Image
          src="/spxlogo-light.png"
          alt="SPX Logo"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="ml-3 font-display font-bold text-white text-lg">
          SPX Admin
        </span>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="ml-auto lg:hidden text-mag-muted hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-gold-400/10 text-gold-400 border-r-2 border-gold-400'
                  : 'text-mag-muted hover:text-white hover:bg-mag-gray/50'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-mag-border p-4 space-y-2 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-2 py-2 text-sm text-mag-muted hover:text-white transition-colors rounded-lg hover:bg-mag-gray/50"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-2 py-2 text-sm text-mag-muted hover:text-red-400 transition-colors rounded-lg hover:bg-mag-gray/50 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-mag-dark border-r border-mag-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-mag-dark border-r border-mag-border z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
