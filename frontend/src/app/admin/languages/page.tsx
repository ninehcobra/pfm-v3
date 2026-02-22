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
  Languages,
  Type,
  AlignLeft,
  Star
} from 'lucide-react';
import { 
  useGetAdminLanguagesQuery, 
  useCreateLanguageMutation, 
  useUpdateLanguageMutation, 
  useDeleteLanguageMutation 
} from '@/core/api/language-api';
import { toast } from 'sonner';

interface Language {
  id: string;
  code: string;
  name: string;
  fontFamily: string;
  direction: string;
  isDefault: boolean;
}

export default function LanguagesAdminPage() {
  const { data: languages = [], isLoading } = useGetAdminLanguagesQuery();
  const [createLanguage] = useCreateLanguageMutation();
  const [updateLanguage] = useUpdateLanguageMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    fontFamily: "'Inter', sans-serif",
    direction: 'ltr',
    isDefault: false
  });

  const handleEdit = (lang: Language) => {
    setEditingLang(lang);
    setFormData({
      code: lang.code,
      name: lang.name,
      fontFamily: lang.fontFamily || "'Inter', sans-serif",
      direction: lang.direction || 'ltr',
      isDefault: lang.isDefault
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLang(null);
    setFormData({
      code: '',
      name: '',
      fontFamily: "'Inter', sans-serif",
      direction: 'ltr',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const lang = languages.find((l: any) => l.id === id);
    if (lang?.isDefault) {
      toast.error('Cannot delete the default system language.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this language? This may impact content association.')) {
      try {
        await deleteLanguage(id).unwrap();
        toast.success('Language association dissolved');
      } catch (err) {
        // Interceptor handles toast
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingLang) {
        await updateLanguage({ id: editingLang.id, data: formData }).unwrap();
        toast.success('Locale configuration synchronized');
      } else {
        await createLanguage(formData).unwrap();
        toast.success('New linguistic node initialized');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Interceptor handles toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Locales & Fonts</h2>
          <p className="text-muted-foreground font-medium">Configure system languages, typography, and directionality.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
          ))
        ) : (
          languages.map((lang: any) => (
            <motion.div 
              layout
              key={lang.id}
              className={`p-8 rounded-3xl border transition-all relative overflow-hidden group ${
                lang.isDefault ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/5 hover:border-primary/20'
              }`}
            >
              {lang.isDefault && (
                <div className="absolute top-4 right-4 text-primary">
                  <Star className="w-4 h-4 fill-primary" />
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black text-xl">
                    {lang.code.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{lang.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {lang.direction === 'ltr' ? 'Left to Right' : 'Right to Left'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Type className="w-3 h-3" />
                    <span className="font-mono">{lang.fontFamily}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleEdit(lang)}
                    className="text-xs font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
                  >
                    Configure
                  </button>
                  {!lang.isDefault && (
                    <button 
                      onClick={() => handleDelete(lang.id)}
                      className="text-xs font-black uppercase tracking-widest text-destructive/70 hover:text-destructive transition-colors ml-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
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
              className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">
                  {editingLang ? 'Configure Locale' : 'Register New Locale'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary block">ISO Code (e.g. jp)</label>
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 font-bold"
                      required
                      placeholder="ja"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 font-bold"
                      required
                      placeholder="Japanese"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Font Family (CSS Standard)</label>
                  <div className="relative group">
                    <Type className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={formData.fontFamily}
                      onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 font-medium text-sm"
                      placeholder="'Noto Sans JP', sans-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary block">Direction</label>
                    <select 
                      value={formData.direction}
                      onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 font-bold appearance-none cursor-pointer"
                    >
                      <option value="ltr" className="bg-[#0d0d0d]">Left to Right (LTR)</option>
                      <option value="rtl" className="bg-[#0d0d0d]">Right to Left (RTL)</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.isDefault ? 'bg-primary' : 'bg-white/10'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isDefault ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Default System Language</span>
                    </label>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Finalize Locale
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
