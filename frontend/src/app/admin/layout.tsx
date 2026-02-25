'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/core/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  PenTool, 
  Settings, 
  LogOut,
  ChevronRight,
  User as UserIcon,
  Languages as LanguagesIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Layers, label: 'Projects', href: '/admin/projects' },
  { icon: Briefcase, label: 'Experience', href: '/admin/experience' },
  { icon: PenTool, label: 'Blog Posts', href: '/admin/blog' },
  { icon: LanguagesIcon, label: 'Languages', href: '/admin/languages' },
  { icon: Layers, label: 'System Logs', href: '/admin/logs' },
  { icon: Settings, label: 'System Config', href: '/admin/config' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.roleName !== 'SUPERADMIN')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.roleName !== 'SUPERADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-foreground">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0d0d0d] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
                <LogOut className="w-5 h-5 rotate-180" />
              </div>
              <div>
                <h2 className="font-black tracking-tighter text-xl">CONTROL</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Antigravity</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/"
              className="flex items-center gap-4 p-4 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all font-bold text-sm mb-6 border border-dashed border-white/5 hover:border-primary/20"
            >
              <LayoutDashboard className="w-5 h-5 opacity-50" />
              <span>Back to Website</span>
            </Link>
            
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 px-4">Menu</div>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </div>
                  {isActive && <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm truncate">{user.fullName}</p>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">{user.roleName}</p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 min-h-20 shrink-0 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground capitalize">
             <span>Admin</span>
             <ChevronRight className="w-4 h-4 opacity-50" />
             <span className="text-foreground">
               {menuItems.find(m => m.href === pathname)?.label || 'Dashboard'}
             </span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Layers className="w-3 h-3" />
              View Site
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Core Active</span>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
