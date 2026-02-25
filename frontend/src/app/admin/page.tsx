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
  Database,
  Briefcase,
  FileText,
  Zap,
  Loader2,
  ShieldAlert,
  RefreshCw,
  Bomb
} from 'lucide-react';
import { 
  useGetDashboardStatsQuery, 
  useClearLogsMutation, 
  useSeedDatabaseMutation,
  useResetSystemMutation
} from '@/core/api/dashboard-api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const [clearLogs, { isLoading: isClearingLogs }] = useClearLogsMutation();
  const [seedDatabase, { isLoading: isSeeding }] = useSeedDatabaseMutation();
  const [resetSystem, { isLoading: isResetting }] = useResetSystemMutation();

  if (isLoading) return <div className="p-8">Loading dashboard metrics...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading dashboard</div>;

  const stats = [
    { label: 'Total Visits (24h)', value: data?.overview.visits24h || 0, icon: Eye, change: 'Real-time', color: 'text-blue-500' },
    { label: 'Contact Leads', value: data?.overview.totalContacts || 0, icon: MessageSquare, change: 'All time', color: 'text-green-500' },
    { label: 'Blog Views', value: data?.overview.totalBlogViews || 0, icon: Users, change: 'Total', color: 'text-purple-500' },
    { label: 'Projects', value: data?.overview.totalProjects || 0, icon: Briefcase, change: 'Active', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <BlurText 
          text="Welcome Back, Commander" 
          className="text-4xl font-black tracking-tighter mb-4"
        />
        <p className="text-muted-foreground font-medium">Here&apos;s what&apos;s happening with your digital universe today.</p>
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
        <div className="lg:col-span-2 space-y-8">
          {/* Top Blogs */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              Top Performing Blogs
            </h3>
            <div className="space-y-4">
              {data?.topBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm group-hover:text-primary transition-colors">{blog.title}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{blog.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-black">{blog.views}</span>
                  </div>
                </div>
              ))}
              {(!data?.topBlogs || data.topBlogs.length === 0) && (
                <p className="text-sm text-muted-foreground italic text-center py-4">No blog data yet</p>
              )}
            </div>
          </div>

          {/* Maintenance Protocols */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-8">
                <Zap className="w-5 h-5 text-primary" />
                Maintenance Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={async () => {
                    const confirm = window.confirm('Clear all system logs? This action cannot be undone.');
                    if (!confirm) return;
                    try {
                      const res = await clearLogs().unwrap();
                      toast.success(res.message || 'Logs cleared');
                    } catch (err: any) {
                      toast.error(err?.data?.message || 'Failed to clear logs');
                    }
                  }}
                  disabled={isClearingLogs}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2">Logs purging</span>
                    <span className="text-sm font-bold uppercase tracking-widest">Clear Records</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-red-500 group-hover:text-white transition-all">
                    {isClearingLogs ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                </button>

                <button
                  onClick={async () => {
                    const confirm = window.confirm('Initiate database seed? This will restore default content and keys.');
                    if (!confirm) return;
                    try {
                      toast.loading('Initiating system seed...');
                      const res = await seedDatabase().unwrap();
                      toast.dismiss();
                      toast.success(res.message || 'Database seeded');
                    } catch (err: any) {
                      toast.dismiss();
                      toast.error(err?.data?.message || 'Seed failed');
                    }
                  }}
                  disabled={isSeeding}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2">System Restore</span>
                    <span className="text-sm font-bold uppercase tracking-widest">Re-seed Data</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                    {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  </div>
                </button>
                <button
                  onClick={async () => {
                    const confirm = window.confirm('DANGEROUS: Clear ALL data (Blogs, Projects, Experiences, etc.) and Reset?');
                    if (!confirm) return;
                    const doubleConfirm = window.confirm('Are you absolutely sure? This will nuclear reset your content but keep users.');
                    if (!doubleConfirm) return;
                    try {
                      toast.loading('Performing nuclear reset and re-seeding...');
                      const res = await resetSystem().unwrap();
                      toast.dismiss();
                      toast.success(res.message || 'System nuclear reset complete');
                    } catch (err: any) {
                      toast.dismiss();
                      toast.error(err?.data?.message || 'Nuclear reset failed');
                    }
                  }}
                  disabled={isResetting}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all text-left group sm:col-span-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bomb className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">Nuclear Reset</span>
                      <span className="text-sm font-bold uppercase tracking-widest">Reset System & Data</span>
                    </div>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                System Status
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                View Detailed Logs <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {data?.systemHealth.map((svc) => (
                 <div key={svc.name} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="flex items-center gap-3 mb-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${svc.status === 'Healthy' || svc.status === 'Connected' || svc.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                     <span className="font-bold text-xs">{svc.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">{svc.status}</span>
                     <span className="text-[10px] font-medium text-muted-foreground">{svc.latency}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Recent Comments */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recent Feedback
            </h3>
            <div className="space-y-6">
              {data?.recentComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-primary uppercase tracking-wider">{comment.author}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">&quot;{comment.content}&quot;</p>
                  <p className="text-[10px] font-bold text-primary/60 truncate">on {comment.blogTitle}</p>
                </div>
              ))}
              {(!data?.recentComments || data.recentComments.length === 0) && (
                <p className="text-sm text-muted-foreground italic text-center py-10">No comments yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              Recent Actions
            </h3>
            <div className="space-y-4">
              {data?.recentActivity.map((act) => (
                <div key={act.id} className="border-l-2 border-primary/20 pl-4 py-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                    {new Date(act.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs font-bold truncate">{act.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
