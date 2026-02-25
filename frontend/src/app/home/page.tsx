'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/core/hooks/use-auth';
import { useLayout } from '@/core/providers/theme-provider';
import { useGetPortfolioBlogPostsQuery } from '@/core/api/portfolio-api';
import { BlurText } from '@/components/ui/blur-text';
import { ShinyText } from '@/components/ui/shiny-text';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Magnet } from '@/components/ui/magnet';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Newspaper,
  LayoutDashboard,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ClientHomePage() {
  const { user, logout } = useAuth();
  const { t, locale } = useLayout();
  const { data: blogs = [], isLoading: isBlogsLoading } = useGetPortfolioBlogPostsQuery({ locale: locale || 'en' });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.morning') || 'Good Morning';
    if (hour < 18) return t('home.afternoon') || 'Good Afternoon';
    return t('home.evening') || 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 selection:text-primary overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Sidebar-style Nav or Top Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all group-hover:scale-110">
                <LayoutDashboard className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
              </div>
            </Link>
            <ShinyText text="CLIENT PORTAL" className="text-sm font-black tracking-[0.3em]" />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/blog" className="hover:text-white transition-colors">{t('nav.blog')}</Link>
              <Link href="/profile" className="hover:text-white transition-colors">{t('nav.profile')}</Link>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black uppercase tracking-widest">{user?.fullName}</span>
                <span className="text-[10px] text-primary/60 font-medium uppercase tracking-tighter">{user?.roleName}</span>
              </div>
              <Magnet strength={10}>
                <button 
                  onClick={logout}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </Magnet>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-20">
        {/* Welcome Section */}
        <section className="relative p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-primary"
              >
                <Sparkles className="w-4 h-4 fill-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.4em]">{greeting()}</span>
              </motion.div>
              <BlurText 
                text={`${t('home.welcome') || 'Welcome Back,'} ${user?.fullName.split(' ')[0]}`}
                className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic"
              />
            </div>
            <p className="text-lg text-white/40 max-w-2xl font-medium leading-relaxed">
              Explore the latest insights from the Antigravity engineering journals and manage your ecosystem protocols.
            </p>
            <div className="flex gap-4">
              <Magnet>
                <Link href="/blog" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:scale-105 transition-all">
                  Read Journals <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnet>
              <Magnet>
                <Link href="/profile" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all">
                  Access Identity <UserIcon className="w-4 h-4" />
                </Link>
              </Magnet>
            </div>
          </div>
        </section>

        {/* Quick Stats / Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest leading-none">Latest Releases</h3>
              <p className="text-sm text-white/40 mt-2">New journals published this week.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest leading-none">System Activity</h3>
              <p className="text-sm text-white/40 mt-2">Protocols are running at optimal performance.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest leading-none">Active Session</h3>
              <p className="text-sm text-white/40 mt-2">Authenticated through terminal node 4.</p>
            </div>
          </SpotlightCard>
        </div>

        {/* Blog Feed Section */}
        <section className="space-y-12">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">LATEST JOURNALS</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Engineering Deep-Dives</h2>
            </div>
            <Link href="/blog" className="text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors flex items-center gap-2 group">
              View Archive <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isBlogsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse" />
              ))
            ) : blogs.length === 0 ? (
              <div className="col-span-full p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/20 uppercase text-xs font-black tracking-[0.3em]">
                No signal detected from the archive.
              </div>
            ) : (
              blogs.slice(0, 3).map((blog: any, i: number) => {
                const trans = blog.translations?.[0] || {};
                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/blog/${blog.slug}`} className="group block h-full">
                      <SpotlightCard className="p-0 overflow-hidden h-full flex flex-col border-white/5 group-hover:border-primary/50 transition-all">
                        <div className="h-64 relative bg-white/5">
                          {blog.thumbnail && (
                            <img src={blog.thumbnail} alt={trans.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          )}
                          <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                          <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                            {trans.title}
                          </h3>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">SYSTEM TRANSMISSION</span>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer className="py-20 border-t border-white/5 opacity-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <ShinyText text="ANTIGRAVITY SYSTEMS" className="text-[10px] font-black tracking-[0.5em]" />
          <span className="text-[10px] font-black tracking-[0.5em]">CORE v2.4.0 • CLIENT ACCREDITED</span>
        </div>
      </footer>
    </div>
  );
}
