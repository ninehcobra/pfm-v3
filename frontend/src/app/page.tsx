'use client';

import React from 'react';
import { BlurText } from '@/components/ui/blur-text';
import { ShinyText } from '@/components/ui/shiny-text';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Magnet } from '@/components/ui/magnet';
import { TiltedCard } from '@/components/ui/tilted-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DirectionToggle } from '@/components/ui/dir-toggle';
import { useLayout } from '@/core/providers/theme-provider';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/lang-toggle';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Maintenance } from '@/components/ui/maintenance';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/core/hooks/use-auth';
import { useGetPortfolioBlogPostsQuery } from '@/core/api/portfolio-api';
import Link from 'next/link';
export default function HomePage() {
  const { user } = useAuth();
  const { t, projects, experience, isLoading, error, locale } = useLayout();
  const { data: blogPosts = [], isLoading: isBlogsLoading } = useGetPortfolioBlogPostsQuery({ locale: locale || 'en' });
  const router = useRouter();

  const milestones = [
    { id: 'hero', label: t('nav.home') || 'Home' },
    { id: 'about', label: t('nav.about') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'blog', label: t('nav.blog') },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <ScrollProgress milestones={milestones} />
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Magnet strength={10}>
            <ShinyText text="ANTIGRAVITY" className="text-xl font-black tracking-tighter" />
          </Magnet>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#hero" className="hover:text-primary transition-colors">{t('nav.home')}</a>
              <a href="#about" className="hover:text-primary transition-colors">{t('nav.about')}</a>
              <a href="#projects" className="hover:text-primary transition-colors">{t('nav.projects')}</a>
              <a href="#experience" className="hover:text-primary transition-colors">{t('nav.experience')}</a>
              <a href="#blog" className="hover:text-primary transition-colors">{t('nav.blog')}</a>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              {user ? (
                <Link 
                  href={user.roleName === 'SUPERADMIN' ? '/admin' : '/'} 
                  className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {t('nav.login')}
                </Link>
              )}
              <div className="flex items-center gap-1 ml-2">
                <LanguageToggle />
                <DirectionToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center pt-20">
          <div className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-8 animate-bounce">
            {t('common.available')}
          </div>
          <BlurText 
            text={t('hero.title')} 
            className="text-6xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter"
            delay={80}
          />
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Magnet>
              <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95">
                {t('common.resume')}
              </button>
            </Magnet>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                <Magnet key={i}>
                  <a href="#" className="flex items-center justify-center w-12 h-12 bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </a>
                </Magnet>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <TiltedCard 
            imageSrc={t('about.image') || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"}
            className="w-full h-[500px] md:h-[600px]"
            captionText={t('about.caption')}
          />
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('about.title')}</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                {t('about.p1')}
              </p>
              <p>
                {t('about.p2')}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="text-foreground font-bold mb-2">{t('about.frontend')}</h4>
                  <p className="text-sm">React, Next.js, Framer Motion, Tailwind</p>
                </div>
                <div>
                  <h4 className="text-foreground font-bold mb-2">{t('about.backend')}</h4>
                  <p className="text-sm">NestJS, Node.js, Prisma, PostgreSQL</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 underline decoration-primary/30 decoration-8 underline-offset-8">{t('projects.title')}</h2>
              <p className="text-xl text-muted-foreground font-medium">{t('projects.subtitle')}</p>
            </div>
            <Magnet>
              <button className="text-primary font-bold border-b-2 border-primary hover:text-primary/70 transition-colors">{t('projects.view_all')}</button>
            </Magnet>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((p, i) => {
              const CardContent = (
                <SpotlightCard key={p.id} className="p-0 overflow-hidden group h-full cursor-pointer">
                  <div className="h-64 bg-muted relative">
                    <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-muted-foreground mb-6 text-sm">{p.description}</p>
                    <div className="flex gap-2">
                      {p.techStack.map((tech: string) => (
                        <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase">{tech}</span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              );

              return p.link ? (
                <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer">
                  {CardContent}
                </a>
              ) : CardContent;
            })}
          </div>
        </section>

        {/* Experience / Timeline Section */}
        <section id="experience" className="py-32">
          <h2 className="text-4xl font-black mb-16 text-center">{t('nav.experience')}</h2>
          <div className="max-w-4xl mx-auto space-y-12">
            {experience.map((exp, i) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors py-4">
                <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{exp.period}</span>
                <h3 className="text-2xl font-bold mt-2">{exp.role}</h3>
                <p className="text-lg font-medium text-muted-foreground">{exp.company}</p>
                <p className="mt-4 text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SpotlightCard className="flex flex-col items-center justify-center gap-4 py-8">
              <span className="text-4xl font-bold text-blue-500">Next.js</span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest">{t('about.frontend')}</span>
            </SpotlightCard>
            <SpotlightCard className="flex flex-col items-center justify-center gap-4 py-8">
              <span className="text-4xl font-bold text-green-500">NestJS</span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest">{t('about.backend')}</span>
            </SpotlightCard>
            <SpotlightCard className="flex flex-col items-center justify-center gap-4 py-8">
              <span className="text-4xl font-bold text-indigo-500">Prisma</span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest">Database</span>
            </SpotlightCard>
            <SpotlightCard className="flex flex-col items-center justify-center gap-4 py-8">
              <span className="text-4xl font-bold text-cyan-500">Docker</span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest">DevOps</span>
            </SpotlightCard>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section id="blog" className="py-32">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">{t('blog.title')}</h2>
            <p className="text-muted-foreground text-lg italic tracking-tight">{t('blog.subtitle')}</p>
          </div>
          
          <div className="space-y-4">
            {isBlogsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
              ))
            ) : blogPosts.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-muted-foreground uppercase text-xs font-black tracking-widest">
                No articles published yet.
              </div>
            ) : (
              blogPosts.map((post: any, i: number) => {
                const translation = post.translations?.[0] || {};
                const date = new Date(post.createdAt).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className="flex items-center justify-between p-8 rounded-2xl border border-transparent hover:border-border hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-muted-foreground font-mono text-xs">{(i + 1).toString().padStart(2, '0')}</span>
                      <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                        {translation.title || post.title}
                      </h3>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-muted-foreground text-sm uppercase font-bold tracking-widest">
                      {date}
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        →
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Link 
              href="/blog" 
              className="px-8 py-3 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 group"
            >
              Examine All Journals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer / CTA Section */}
      <footer className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <BlurText text={t('common.epic')} className="text-4xl md:text-7xl font-black mb-12 tracking-tight" />
          <Magnet strength={30}>
            <button className="text-3xl md:text-5xl font-black underline decoration-primary decoration-4 underline-offset-[12px] hover:text-primary transition-colors">
              hello@antigravity.dev
            </button>
          </Magnet>
          
          <div className="mt-32 flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border gap-6 opacity-60">
            <p className="text-xs font-bold tracking-widest uppercase">&copy; 2026 {t('common.footer')}</p>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
              <Link href="/login" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">Terminal</Link>
              <a href="#" className="hover:text-primary">Source Code</a>
              <a href="#" className="hover:text-primary">Design Specs</a>
              <a href="#" className="hover:text-primary">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
