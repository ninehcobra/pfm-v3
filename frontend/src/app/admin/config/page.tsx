'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Loader2, 
  Search, 
  Globe2,
  Plus,
  Type,
  ArrowRight,
  Database,
  Hash
} from 'lucide-react';
import { 
  useGetUIContentQuery, 
  useUpdateUIContentMutation, 
  useCreateUIKeyMutation, 
  useGetAdminLanguagesQuery 
} from '@/core/api/config-api';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';

interface UIContent {
  id: string;
  key: string;
  value: string;
  languageId: string;
  language: { code: string; name: string };
}

interface Language {
  id: string;
  code: string;
  name: string;
}

export default function ConfigAdminPage() {
  const { data: content = [], isLoading: isContentLoading } = useGetUIContentQuery();
  const { data: languages = [], isLoading: isLanguagesLoading } = useGetAdminLanguagesQuery();
  const [updateUIContent] = useUpdateUIContentMutation();
  const [createUIKey] = useCreateUIKeyMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Key Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // Grouped content for multi-lang editing
  // Key -> { languageId -> value }
  const [groupedData, setGroupedData] = useState<Record<string, Record<string, string>>>({});

  const isLoading = isContentLoading || isLanguagesLoading;

  useEffect(() => {
    if (content.length > 0) {
      const initialGrouped: Record<string, Record<string, string>> = {};
      content.forEach((item: any) => {
        if (!initialGrouped[item.key]) {
          initialGrouped[item.key] = {};
        }
        initialGrouped[item.key][item.languageId] = item.value;
      });
      setGroupedData(initialGrouped);
    }
  }, [content]);

  const handleValueChange = (key: string, langId: string, value: string) => {
    setGroupedData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [langId]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload: any[] = [];
      Object.entries(groupedData).forEach(([key, langValues]) => {
        Object.entries(langValues).forEach(([languageId, value]) => {
          payload.push({ key, languageId, value });
        });
      });
      
      await updateUIContent(payload).unwrap();
      toast.success('System configuration synchronized across all nodes.');
    } catch (err) {
      // Interceptor handles toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingKey(true);
    try {
      await createUIKey({ key: newKey, defaultValue }).unwrap();
      toast.success('New tactical token initialized.');
      setIsModalOpen(false);
      setNewKey('');
      setDefaultValue('');
    } catch (err) {
      // Interceptor handles toast
    } finally {
      setIsCreatingKey(false);
    }
  };

  const filteredKeys = useMemo(() => {
    return Object.keys(groupedData).filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort();
  }, [groupedData, searchTerm]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">System Config</h2>
          <p className="text-muted-foreground font-medium">Multi-language synchronization and token orchestration.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Token
          </button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Push Configuration
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by key (e.g. nav.home, hero.title)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
          />
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-[32px] overflow-hidden flex flex-col">
          <div className="max-h-[70vh] overflow-auto custom-scrollbar relative">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed', width: `calc(300px + ${languages.length} * 400px)`, minWidth: '100%' }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#161616] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="p-6 border-r border-white/5 text-left font-black" style={{ width: '300px' }}>Token Key</th>
                  {languages.map((lang: any) => (
                    <th key={lang.id} className="p-6 border-r border-white/5 text-left font-black" style={{ width: '400px' }}>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Globe2 className="w-3 h-3 text-primary" />
                        {lang.name} ({lang.code.toUpperCase()})
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="h-20 animate-pulse bg-white/[0.01]">
                      <td colSpan={languages.length + 1} />
                    </tr>
                  ))
                ) : (
                  filteredKeys.map((key) => {
                    const isImageKey = key.includes('.image');
                    
                    return (
                      <tr key={key} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 border-r border-white/5 align-top">
                          <span className="text-xs font-mono font-bold text-primary/70 break-all">{key}</span>
                        </td>
                        {languages.map((lang: any) => (
                          <td key={lang.id} className="p-4 border-r border-white/5 align-top">
                            {isImageKey ? (
                              <div className="w-full max-w-[200px]">
                                <ImageUpload
                                  value={groupedData[key]?.[lang.id] || ''}
                                  onChange={(url) => handleValueChange(key, lang.id, url)}
                                  onRemove={() => handleValueChange(key, lang.id, '')}
                                />
                              </div>
                            ) : (
                              <textarea
                                rows={1}
                                value={groupedData[key]?.[lang.id] || ''}
                                onChange={(e) => handleValueChange(key, lang.id, e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-medium w-full focus:text-primary transition-colors resize-none overflow-hidden h-auto py-2 leading-relaxed"
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = el.scrollHeight + 'px';
                                  }
                                }}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Key Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#060606]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10"
            >
              <div className="mb-10 text-center">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <Hash className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">Create New Token</h3>
                <p className="text-muted-foreground text-sm font-medium">This key will be registered across all active locales.</p>
              </div>

              <form onSubmit={handleCreateKey} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Identifier Key</label>
                  <div className="relative group">
                    <Database className="absolute left-5 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      required
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="e.g. hero.cta_button"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/50 font-mono text-sm"
                    />
                    <p className="text-[9px] text-muted-foreground mt-2 ml-2 italic">* Use &quot;.image&quot; in key to enable image upload UI.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Initial Value (Global)</label>
                  <div className="relative group">
                    <Type className="absolute left-5 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      required={!newKey.includes('.image')}
                      value={defaultValue}
                      onChange={(e) => setDefaultValue(e.target.value)}
                      placeholder="Enter the default text..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-primary/50 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreatingKey}
                    className="flex-[2] bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Initialize Token
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
