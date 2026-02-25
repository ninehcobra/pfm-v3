'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useGetBlogBySlugQuery,
  useAddCommentMutation, 
  useDeleteCommentMutation, 
  useToggleReactionMutation 
} from '@/core/api/blog-api';
import { useLayout } from '@/core/providers/theme-provider';
import { useAuth } from '@/core/hooks/use-auth';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  Heart, 
  Zap, 
  Award,
  Trash2,
  Send,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { ReactionEffects } from '@/components/blog/reaction-effects';

const ReactionButton = ({ reaction, blog, user, onToggle }: any) => {
  const [isTriggered, setIsTriggered] = React.useState(false);
  const count = blog.reactions?.filter((r: any) => r.type === reaction.type).length || 0;
  const hasReacted = blog.reactions?.some((r: any) => r.type === reaction.type && r.userId === user?.id);

  return (
    <button
      key={reaction.type}
      onClick={() => {
        onToggle(reaction.type);
        setIsTriggered(true);
        setTimeout(() => setIsTriggered(false), 100);
      }}
      className={`
        group relative flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all
        ${hasReacted 
          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
          : 'bg-white/5 border-white/5 hover:border-primary/30'}
      `}
    >
      <ReactionEffects type={reaction.type} trigger={isTriggered} />
      <reaction.icon className={`w-4 h-4 ${!hasReacted && reaction.color}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{reaction.label}</span>
      {count > 0 && (
        <span className={`text-xs font-black ${hasReacted ? 'opacity-100' : 'opacity-50'}`}>{count}</span>
      )}
    </button>
  );
};

const BlogDetailSkeleton = () => (
  <div className="min-h-screen bg-background pt-32 pb-20 px-8 md:px-20">
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-4 bg-white/5 rounded-full animate-pulse" />
        <div className="space-y-3">
          <div className="w-full h-12 bg-white/5 rounded-2xl animate-pulse" />
          <div className="w-3/4 h-12 bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="w-32 h-4 bg-white/5 rounded-full animate-pulse" />
          <div className="w-32 h-4 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="aspect-video w-full bg-white/5 rounded-[40px] animate-pulse" />
      <div className="space-y-4 pt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className={`h-4 bg-white/5 rounded-full animate-pulse ${i % 3 === 0 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  </div>
);

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const { locale, t } = useLayout();
  const { user } = useAuth();
  const { data: blog, isLoading, error } = useGetBlogBySlugQuery(slug as string);

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [toggleReaction] = useToggleReactionMutation();

  const [newComment, setNewComment] = React.useState('');

  const handleToggleReaction = async (type: string) => {
    if (!user) {
      toast.error(t('auth.login_required') || 'You must be logged in to react');
      return;
    }
    try {
      await toggleReaction({ blogId: blog.id, type }).unwrap();
    } catch {
      toast.error('Failed to update reaction');
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error(t('auth.login_required') || 'You must be logged in to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      await addComment({ blogId: blog.id, content: newComment }).unwrap();
      setNewComment('');
      toast.success('Comment added successfully');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      toast.success('Comment deleted successfully');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const reactionsData = React.useMemo(() => [
    { type: 'LIKE', icon: ThumbsUp, label: t('blog.reaction.cool') || 'Cool', color: 'hover:text-blue-500' },
    { type: 'LOVE', icon: Heart, label: t('blog.reaction.love') || 'Love', color: 'hover:text-red-500' },
    { type: 'WOW', icon: Zap, label: t('blog.reaction.wow') || 'Wow', color: 'hover:text-yellow-500' },
    { type: 'BRAVO', icon: Award, label: t('blog.reaction.bravo') || 'Bravo', color: 'hover:text-green-500' },
  ], [t]);

  if (isLoading) return <BlogDetailSkeleton />;
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center space-y-8 max-w-md p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <ArrowLeft className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            {t('blog.not_found') || 'Article Not Found'}
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            The data broadcast you are looking for has been lost in the digital void.
          </p>
          <button 
            onClick={() => router.push('/blog')}
            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            {t('blog.return') || 'Return to base'}
          </button>
        </div>
      </div>
    );
  }

  const translation = blog.translations?.find((t: any) => t.language?.code === locale) || blog.translations?.[0] || {};
  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Scroll indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

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
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/70">
                <Eye className="w-3 h-3" />
                {blog.views || 0} {t('blog.views') || 'Views'}
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
          className="prose prose-invert prose-primary max-w-none mb-32"
        >
          <div className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium space-y-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {translation.content}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Reactions Section */}
        <section className="mb-20 p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <h3 className="text-xl font-black tracking-tight mb-8 uppercase italic flex items-center gap-3">
             <Zap className="w-5 h-5 text-primary" />
             {t('blog.how_was_it') || 'Transmission Feedback'}
          </h3>
          <div className="flex flex-wrap gap-4">
             {reactionsData.map((reaction) => (
               <ReactionButton 
                 key={reaction.type}
                 reaction={reaction}
                 blog={blog}
                 user={user}
                 onToggle={handleToggleReaction}
               />
             ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              {t('blog.comments') || 'Comments'}
              <span className="text-primary/50 text-sm ml-2">[{blog.comments?.length || 0}]</span>
            </h3>
          </div>

          {/* User Comment Form */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
            {user ? (
              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground">
                    {user.fullName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{user.fullName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Authenticated User</p>
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('blog.comment_placeholder') || 'Type your transmission here...'}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-foreground/80 placeholder:text-white/10 resize-none min-h-[120px] pb-4"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={isAddingComment || !newComment.trim()}
                    className="flex items-center gap-3 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
                  >
                    {isAddingComment ? 'Processing...' : (t('blog.post_comment') || 'Post Comment')}
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em]">{t('auth.login_required') || 'Authentication Required'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase opacity-50">Secure connection needed to comment</p>
                </div>
                <Link 
                  href="/login"
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  {t('auth.go_to_login') || 'Go to Login'}
                </Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            <AnimatePresence>
              {blog.comments?.map((comment: any, i: number) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all"
                >
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-primary overflow-hidden">
                          {comment.author?.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.fullName} className="w-full h-full object-cover" />
                          ) : (
                            comment.author?.fullName?.[0] || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest">{comment.author?.fullName || 'Anonymous'}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                     {user?.id === comment.authorId && (
                       <button 
                         onClick={() => handleDeleteComment(comment.id)}
                         className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                   <div className="text-sm text-muted-foreground leading-relaxed pl-14">
                      {comment.content}
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!blog.comments || blog.comments.length === 0) && (
              <div className="py-20 text-center space-y-4">
                 <p className="text-muted-foreground text-sm italic">{t('blog.no_comments') || 'The void is silent. Be the first to speak.'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap gap-8 items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <Share2 className="w-4 h-4" />
            {t('blog.share_knowledge') || 'Share Knowledge'}
          </div>
          <div className="flex gap-4 flex-wrap">
            {['Twitter', 'LinkedIn'].map(platform => (
              <button key={platform} className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">
                {platform}
              </button>
            ))}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t('blog.link_copied') || 'Link copied to clipboard');
              }}
              className="px-6 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-primary/20"
            >
              {t('blog.copy_link') || 'Copy Link'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
