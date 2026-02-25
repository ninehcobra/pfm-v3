'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { BlurText } from '@/components/ui/blur-text';
import { Shield, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const games = [
  {
    id: '2048',
    title: 'Glass-2048',
    description: 'A premium glassmorphism version of the classic 2048 game with smooth animations.',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-blue-500/20 to-purple-500/20',
    link: '/playground/2048',
    status: 'Ready'
  },
  {
    id: 'soon-1',
    title: 'Cyber Sudoku',
    description: 'Challenge your mind with a neon-lit sudoku experience. Coming soon.',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-emerald-500/10 to-teal-500/10',
    link: '#',
    status: 'Coming Soon'
  }
];

export default function PlaygroundHub() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a1a1a_0%,_transparent_50%)] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <header className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8 group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Reality</span>
          </Link>
          
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-primary"
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.5em]">System Playground</span>
            </motion.div>
            <BlurText 
              text="SELECT PROTOCOL"
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic"
            />
          </div>
          <p className="text-white/40 max-w-xl text-lg font-medium leading-relaxed">
            A collection of experimental neural-interactive modules designed for cognitive optimization and leisure.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={game.link} className={game.status === 'Ready' ? 'cursor-pointer' : 'cursor-default'}>
                <SpotlightCard className={`p-8 h-full border-white/5 hover:border-primary/50 transition-all flex flex-col justify-between group relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-tight">{game.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{game.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-8 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${game.status === 'Ready' ? 'text-primary' : 'text-white/20'}`}>
                      {game.status}
                    </span>
                    {game.status === 'Ready' && (
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="mt-32 text-center text-white/10 text-[10px] uppercase font-black tracking-[0.5em]">
        Neural Core v4.2.0 • Playground Module
      </footer>
    </div>
  );
}
