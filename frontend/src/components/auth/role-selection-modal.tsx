'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Layout, Shield, Terminal, ArrowRight, X } from 'lucide-react';
import { useLayout } from '@/core/providers/theme-provider';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const { t } = useLayout();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[10000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 z-[10001] shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Shield className="w-3 h-3" />
                  {t('auth.privileged_access') || 'Privileged Access'}
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">{t('auth.choose_destination') || 'Choose Your Destination'}</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  {t('auth.superadmin_detected') || 'Superadmin detected. Select the operational environment you wish to engage.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleNavigate('/')}
                  className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-primary/30 rounded-[2rem] text-left transition-all hover:bg-white/[0.05] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-xs mb-2">{t('auth.client_portal')}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed uppercase opacity-60">
                        {t('auth.client_portal_desc') || 'Access the public interface, blog, and portfolio systems.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all">
                      {t('auth.deploy_interface') || 'Deploy Interface'} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('/admin')}
                  className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 rounded-[2rem] text-left transition-all hover:bg-white/[0.05] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-xs mb-2">{t('auth.command_center')}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed uppercase opacity-60">
                        {t('auth.command_center_desc') || 'Manage entire system protocols, data matrices, and logs.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                      {t('auth.access_dashboard') || 'Access Dashboard'} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">
                  {t('common.security_active') || 'Antigravity Security Protocol • Active Session'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
