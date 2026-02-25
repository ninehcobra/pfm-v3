'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/core/hooks/use-auth';
import { ShinyText } from '@/components/ui/shiny-text';
import { Magnet } from '@/components/ui/magnet';
import { BlurText } from '@/components/ui/blur-text';
import { Lock, Mail, Loader2, Rocket, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Access denied. Verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group z-50">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest px-2">Abort to Earth</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-[2rem] text-primary mb-8 shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            <ShieldCheck className="w-10 h-10" />
          </motion.div>
          <BlurText 
            text="Control Cockpit" 
            className="text-5xl font-black mb-4 tracking-tighter text-white"
          />
          <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm mx-auto">
            Authorized personnel only. Initiate authentication protocol to access the matrix.
          </p>
        </div>

        <div className="relative group">
          {/* Glass Card Effect */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 group-hover:border-primary/20 transition-all duration-500" />
          
          <div className="relative p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Terminal Identity
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@antigravity.dev"
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-6 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-bold text-white placeholder:text-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Access Cipher
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-6 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all font-bold text-white placeholder:text-white/10"
                    required
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black p-4 rounded-2xl flex items-center gap-3 uppercase tracking-widest">
                      <Zap className="w-4 h-4 fill-destructive" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4 flex justify-center">
                <Magnet strength={15}>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="relative px-12 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm overflow-hidden group/btn disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative">
                      {isSubmitting ? 'Bypassing...' : 'Engage'}
                    </span>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin relative" />
                    ) : (
                      <Rocket className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform relative" />
                    )}
                  </button>
                </Magnet>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Sign up now
            </Link>
          </p>
          <ShinyText text="ANTIGRAVITY SYSTEMS • CORE v2.4.0" className="text-[10px] font-black tracking-[0.5em] opacity-30 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
