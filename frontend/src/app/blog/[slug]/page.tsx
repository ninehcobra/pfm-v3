'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBlogBySlugQuery } from '@/core/api/portfolio-api';
import { useLayout } from '@/core/providers/theme-provider';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { locale, t } = useLayout();
  const { data: blog, isLoading, error } = useGetBlogBySlugQuery(slug as string);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested publication could not be retrieved from records.</p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          Return to Base
        </Link>
      </div>
    );
  }

  const translation = blog.translations?.find((t: any) => t.language?.code === locale) || blog.translations?.[0] || {};
  const date = new Date(blog.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Article Header */}
      <header className="relative h-[60vh] w-full overflow-hidden">
        {blog.thumbnail ? (
          <img 
            src={blog.thumbnail} 
            alt={translation.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Share2 className="w-20 h-20 text-muted-foreground opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <nav className="absolute top-0 w-full p-8 flex items-center justify-between z-10">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-background/40 transition-all text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.2em] text-primary"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
                <Calendar className="w-3 h-3" />
                {date}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/70">
                <User className="w-3 h-3" />
                {blog.author?.fullName || 'Super Admin'}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]"
            >
              {translation.title}
            </motion.h1>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-8 py-20">
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-primary max-w-none"
        >
          <div className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium space-y-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {translation.content}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Footer actions */}
        <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <Share2 className="w-4 h-4" />
            {t('blog.share_knowledge') || 'Share Knowledge'}
          </div>
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn'].map(platform => (
              <button key={platform} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                {platform}
              </button>
            ))}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t('blog.link_copied') || 'Link copied to clipboard');
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              {t('blog.copy_link') || 'Copy Link'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
