'use client';

import React from 'react';
import { useGetPortfolioBlogPostsQuery } from '@/core/api/portfolio-api';
import { useLayout } from '@/core/providers/theme-provider';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogArchivePage() {
  const { locale, t } = useLayout();
  const { data: blogs = [], isLoading } = useGetPortfolioBlogPostsQuery({ locale: locale || 'en' });
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredBlogs = blogs.filter((b: any) => 
    b.translations?.[0]?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-8 md:px-20">
      <div className="max-w-7xl mx-auto space-y-20">
        <header className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter"
          >
            THE JOURNALS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl"
          >
            An archive of engineering insights, design philosophies, and cognitive data transmissions.
          </motion.p>
        </header>

        <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search the archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-8 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[4/5] rounded-[40px] bg-white/5 animate-pulse" />
            ))
          ) : filteredBlogs.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground uppercase text-xs font-black tracking-[0.2em] border-2 border-dashed border-white/5 rounded-[40px]">
              Empty signal. No data matching your query.
            </div>
          ) : (
            filteredBlogs.map((blog: any, i: number) => {
              const trans = blog.translations?.[0] || {};
              const date = new Date(blog.createdAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={blog.id}
                  className="group relative h-full flex flex-col"
                >
                  <Link href={`/blog/${blog.slug}`} className="absolute inset-0 z-10" />
                  <div className="aspect-[4/5] overflow-hidden rounded-[40px] bg-white/5 border border-white/10 mb-8">
                    {blog.thumbnail ? (
                      <img 
                        src={blog.thumbnail} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        alt={trans.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/10">
                        <FileText className="w-20 h-20" />
                      </div>
                    )}
                  </div>
                  <div className="px-4 space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                      <span>{date}</span>
                      <div className="w-1 h-1 rounded-full bg-primary/20" />
                      <span>{blog.author?.fullName || 'SuperAdmin'}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
                      {trans.title}
                    </h3>
                    <div className="pt-2">
                       <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                         <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
  );
}
