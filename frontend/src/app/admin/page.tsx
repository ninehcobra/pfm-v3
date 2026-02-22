'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlurText } from '@/components/ui/blur-text';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  ArrowUpRight, 
  Activity,
  Globe,
  Database
} from 'lucide-react';

const stats = [
  { label: 'Total Visits', value: '12.5k', icon: Eye, change: '+12%', color: 'text-blue-500' },
  { label: 'Contact Leades', value: '48', icon: MessageSquare, change: '+5%', color: 'text-green-500' },
  { label: 'Subscribers', value: '2.4k', icon: Users, change: '+18%', color: 'text-purple-500' },
  { label: 'Active Projects', value: '14', icon: Activity, change: 'Stable', color: 'text-orange-500' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <BlurText 
          text="Welcome Back, Commander" 
          className="text-4xl font-black tracking-tighter mb-4"
        />
        <p className="text-muted-foreground font-medium">Here's what's happening with your digital universe today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">
                {stat.change}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              System Status
            </h3>
            <button className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              View Logs <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-6">
             {[
               { name: 'API Server', status: 'Healthy', latency: '42ms' },
               { name: 'PostgreSQL Database', status: 'Connected', latency: '8ms' },
               { name: 'Frontend Edge', status: 'Active', latency: '12ms' },
             ].map((svc) => (
               <div key={svc.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                   <span className="font-bold text-sm">{svc.name}</span>
                 </div>
                 <div className="flex items-center gap-8">
                   <span className="text-xs font-medium text-muted-foreground">{svc.latency}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">{svc.status}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="p-6 rounded-full bg-primary/10 text-primary mb-8">
              <Globe className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-4">Multi-Region Active</h3>
            <p className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed">
              Your content is currently being served from 8 edge locations worldwide with 100% uptime.
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <div className="w-2 h-2 rounded-full bg-primary/30" />
            </div>
        </div>
      </div>
    </div>
  );
}
