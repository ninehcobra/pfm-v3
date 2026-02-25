'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  X, 
  Image as ImageIcon,
  Save,
  Loader2,
  Code2,
  Globe
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  useGetProjectsQuery, 
  useCreateProjectMutation, 
  useUpdateProjectMutation, 
  useDeleteProjectMutation 
} from '@/core/api/project-api';
import { useGetAdminLanguagesQuery } from '@/core/api/config-api';
import { toast } from 'sonner';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface Project {
  id: string;
  image: string;
  imagePublicId: string;
  link: string;
  techStack: string[];
  translations: {
    language: { code: string; name: string };
    title: string;
    description: string;
  }[];
}

export default function ProjectsAdminPage() {
  const { data: projects = [], isLoading: isProjectsLoading } = useGetProjectsQuery();
  const { data: languages = [], isLoading: isLanguagesLoading } = useGetAdminLanguagesQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = isProjectsLoading || isLanguagesLoading;

  // Form state
  const [formData, setFormData] = useState({
    image: '',
    imagePublicId: '',
    link: '',
    techStack: '',
    translations: [] as { languageCode: string; title: string; description: string }[]
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      image: project.image || '',
      imagePublicId: project.imagePublicId || '',
      link: project.link || '',
      techStack: project.techStack.join(', '),
      translations: languages.map(lang => ({
        languageCode: lang.code,
        title: project.translations.find(t => t.language.code === lang.code)?.title || '',
        description: project.translations.find(t => t.language.code === lang.code)?.description || ''
      }))
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      image: '',
      imagePublicId: '',
      link: '',
      techStack: '',
      translations: languages.map(lang => ({
        languageCode: lang.code,
        title: '',
        description: ''
      }))
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to terminate this project record?')) {
      try {
        await deleteProject(id).unwrap();
        toast.success('Project terminated successfully');
      } catch (err) {
        // Interceptor handles toast
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
    };

    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data: payload }).unwrap();
        toast.success('Neural project protocol updated');
      } else {
        await createProject(payload).unwrap();
        toast.success('New project initialized');
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

  const filteredProjects = projects.filter((p: any) => 
    p.translations?.[0]?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Project Core</h2>
          <p className="text-muted-foreground font-medium">Manage and deploy your digital artifacts.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Initialize Project
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1,2,3].map(i => (
            <div key={i} className="aspect-video rounded-[32px] bg-white/5 animate-pulse" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full p-20 text-center text-muted-foreground font-medium">No projects found in the database.</div>
        ) : (
          filteredProjects.map((project: any) => (
            <motion.div 
              key={project.id}
              layoutId={project.id}
              className="group relative bg-[#0d0d0d] border border-white/10 rounded-[40px] overflow-hidden hover:border-primary/50 transition-colors shadow-2xl"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5">
                {project.image ? (
                  <img src={project.image} alt="Project" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-white/5">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                  {project.techStack.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary/80 whitespace-nowrap">
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-black tracking-tighter mb-2 group-hover:text-primary transition-colors">
                  {project.translations?.[0]?.title || 'Untitled Project'}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 font-medium mb-8 leading-relaxed">
                  {project.translations?.[0]?.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-destructive hover:text-white transition-all hover:shadow-lg hover:shadow-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                      Live View <ExternalLink className="w-3 h-3" />
                    </a>
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
              className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">
                  {editingProject ? 'Refine Project Module' : 'Initialize New Artifact'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <ImageUpload 
                      label="Visual Interface"
                      value={formData.image}
                      onChange={(url, publicId) => setFormData({ ...formData, image: url, imagePublicId: publicId })}
                      onRemove={() => setFormData({ ...formData, image: '', imagePublicId: '' })}
                    />
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
                        <Code2 className="w-3 h-3" /> Tech Stack
                      </label>
                      <input 
                        type="text" 
                        value={formData.techStack}
                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                        placeholder="React, NestJS, Prisma..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 outline-none focus:border-primary/50 font-bold text-sm"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
                        <ExternalLink className="w-3 h-3" /> Access Link
                      </label>
                      <input 
                        type="url" 
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 outline-none focus:border-primary/50 font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-center gap-2 text-primary">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Localized Metadata</span>
                    </div>
                    
                    {languages.map(lang => (
                      <div key={lang.id} className="space-y-6 p-6 border border-white/5 rounded-[32px] bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                            {lang.name} ({lang.code.toUpperCase()})
                          </span>
                        </div>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            placeholder="Localized Title"
                            value={formData.translations.find(t => t.languageCode === lang.code)?.title || ''}
                            onChange={(e) => updateTranslation(lang.code, 'title', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-primary/50 font-bold text-sm"
                          />
                          <textarea 
                            rows={3}
                            placeholder="Biological summary / description..."
                            value={formData.translations.find(t => t.languageCode === lang.code)?.description || ''}
                            onChange={(e) => updateTranslation(lang.code, 'description', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-primary/50 font-medium text-sm leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className="p-8 border-t border-white/10 flex items-center justify-end gap-4 bg-white/[0.02]">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:text-foreground transition-colors text-xs uppercase tracking-widest font-black">Abort</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Deploy Module
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
