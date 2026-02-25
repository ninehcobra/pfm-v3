'use client';

import React from 'react';
import { useAuth } from '@/core/hooks/use-auth';
import { useLayout } from '@/core/providers/theme-provider';
import { User, Mail, Shield, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLayout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
        <h1 className="text-2xl font-bold">{t('auth.please_login') || 'Please login to view your profile'}</h1>
        <Link href="/login" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">
          {t('nav.login')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-primary/30">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">{t('common.back') || 'Back'}</span>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-xs font-bold uppercase tracking-widest border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            {t('common.logout') || 'Logout'}
          </button>
        </div>

        {/* Profile Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8 md:p-16 overflow-hidden">
             {/* Background Glow */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
             
             <div className="flex flex-col md:flex-row items-center gap-12">
               {/* Avatar */}
               <div className="relative">
                 <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-1">
                   {user.avatar ? (
                     <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.fullName} />
                   ) : (
                     <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                       <User className="w-16 h-16 text-primary" />
                     </div>
                   )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-[#0d0d0d] rounded-full" />
               </div>

               {/* Info */}
               <div className="space-y-6 text-center md:text-left flex-1">
                 <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground mb-4">
                     <Shield className="w-3 h-3 text-primary" />
                     {user.roleName}
                   </div>
                   <h1 className="text-5xl font-black tracking-tighter uppercase italic">{user.fullName}</h1>
                 </div>
                 
                 <div className="flex flex-col md:flex-row gap-6 text-muted-foreground font-medium">
                   <div className="flex items-center gap-2 justify-center md:justify-start">
                     <Mail className="w-4 h-4" />
                     {user.email}
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Action Grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 pointer-events-none grayscale">
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Activity Log</h3>
                <p className="text-xs text-muted-foreground">Your recent interactions with the platform.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Settings</h3>
                <p className="text-xs text-muted-foreground">Manage your account preferences and security.</p>
            </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
             Regular Access Protocol • Profile Interface
          </p>
        </div>
      </div>
    </div>
  );
}
