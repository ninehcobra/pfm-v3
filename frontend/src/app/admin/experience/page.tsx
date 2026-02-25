'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Loader2,
  Calendar,
  Briefcase,
  Globe
} from 'lucide-react';
import { 
  useGetExperiencesQuery, 
  useCreateExperienceMutation, 
  useUpdateExperienceMutation, 
  useDeleteExperienceMutation 
} from '@/core/api/experience-api';
import { useGetAdminLanguagesQuery } from '@/core/api/config-api';
import { toast } from 'sonner';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface Experience {
  id: string;
  period: string;
  translations: {
    language: { code: string; name: string };
    company: string;
    role: string;
    description: string;
  }[];
}

export default function ExperienceAdminPage() {
  const { data: experiences = [], isLoading: isExpLoading } = useGetExperiencesQuery();
  const { data: languages = [], isLoading: isLangLoading } = useGetAdminLanguagesQuery();
  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isExpLoading || isLangLoading;

  const [formData, setFormData] = useState({
    period: '',
    translations: [] as { languageCode: string; company: string; role: string; description: string }[]
  });

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      period: exp.period,
      translations: languages.map((lang: any) => ({
        languageCode: lang.code,
        company: exp.translations.find(t => t.language.code === lang.code)?.company || '',
        role: exp.translations.find(t => t.language.code === lang.code)?.role || '',
        description: exp.translations.find(t => t.language.code === lang.code)?.description || ''
      }))
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingExp(null);
    setFormData({
      period: '',
      translations: languages.map((lang: any) => ({
        languageCode: lang.code,
        company: '',
        role: '',
        description: ''
      }))
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to terminate this experience record?')) {
      try {
        await deleteExperience(id).unwrap();
        toast.success('Experience record purged from records');
      } catch (err) {
        // Interceptor handles toast
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingExp) {
        await updateExperience({ id: editingExp.id, data: formData }).unwrap();
        toast.success('Career archive updated');
      } else {
        await createExperience(formData).unwrap();
        toast.success('New milestone registered');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Interceptor handles toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTranslation = (code: string, field: string, value: string) => {
    setFormData({
      ...formData,
      translations: formData.translations.map(t => 
        t.languageCode === code ? { ...t, [field]: value } : t
      )
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Career Roadmap</h2>
          <p className="text-muted-foreground font-medium">Document your professional evolution across all supported locales.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          [1,2].map(i => (
            <div key={i} className="h-32 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
          ))
        ) : experiences.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-muted-foreground font-medium">
            No career milestones recorded yet.
          </div>
        ) : (
          experiences.map((exp: any) => (
            <motion.div 
              layout
              key={exp.id}
              className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight">
                      {exp.translations[0]?.role || 'Unknown Role'}
                    </h3>
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">@ {exp.translations[0]?.company}</span>
                    <div className="flex gap-1 ml-2">
                      {exp.translations.map((t: any) => (
                        <span key={t.language.code} className="text-[7px] font-black px-1 py-0.5 rounded bg-white/10 uppercase">{t.language.code}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.period}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(exp)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(exp.id)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-destructive hover:text-white flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#060606]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">
                  {editingExp ? 'Refine Milestone' : 'New Career Milestone'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Time Period</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="e.g., 2023 - Present"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-10">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/50 flex items-center gap-3">
                     <Globe className="w-4 h-4" />
                     Localization Metadata
                   </h4>

                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      {languages.map((lang: any) => (
                        <div key={lang.id} className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{lang.code}</div>
                            <h5 className="font-bold text-sm">{lang.name}</h5>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</label>
                              <input 
                                type="text" 
                                value={formData.translations.find(t => t.languageCode === lang.code)?.role || ''}
                                onChange={(e) => updateTranslation(lang.code, 'role', e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 outline-none focus:border-primary/50 font-bold text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</label>
                              <input 
                                type="text" 
                                value={formData.translations.find(t => t.languageCode === lang.code)?.company || ''}
                                onChange={(e) => updateTranslation(lang.code, 'company', e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 outline-none focus:border-primary/50 font-bold text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                            <textarea 
                              rows={3}
                              value={formData.translations.find(t => t.languageCode === lang.code)?.description || ''}
                              onChange={(e) => updateTranslation(lang.code, 'description', e.target.value)}
                              className="w-full bg-white/5 border border-white/5 rounded-xl p-4 outline-none focus:border-primary/50 font-medium text-xs leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </form>

              <div className="p-8 border-t border-white/10 flex items-center justify-end gap-4 bg-white/[0.02]">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-black uppercase tracking-tighter text-xs text-muted-foreground hover:text-foreground transition-colors">Discard</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Finalize Milestone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
