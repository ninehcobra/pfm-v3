'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  Loader2,
  FileText,
  Clock,
  Globe,
  Layout,
  Eye
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/core/hooks/use-auth';
import { 
  useGetBlogsQuery, 
  useCreateBlogMutation, 
  useUpdateBlogMutation, 
  useDeleteBlogMutation 
} from '@/core/api/blog-api';
import { useGetAdminLanguagesQuery } from '@/core/api/config-api';
import { useUploadImageMutation } from '@/core/api/media-api';
import { toast } from 'sonner';
import Link from 'next/link';

// Import SimpleMDE dynamically to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
import "easymde/dist/easymde.min.css";

interface Blog {
  id: string;
  slug: string;
  thumbnail: string;
  thumbnailPublicId: string;
  published: boolean;
  translations: {
    language: { code: string; name: string };
    title: string;
    content: string;
  }[];
  createdAt: string;
}

export default function BlogAdminPage() {
  const { user } = useAuth();
  const { data: blogs = [], isLoading: isBlogsLoading } = useGetBlogsQuery();
  const { data: languages = [], isLoading: isLanguagesLoading } = useGetAdminLanguagesQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [uploadImage] = useUploadImageMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isBlogsLoading || isLanguagesLoading;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    thumbnailPublicId: '',
    published: false,
    locale: 'en'
  });

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      thumbnail: '',
      thumbnailPublicId: '',
      published: false,
      locale: languages[0]?.code || 'en'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    const trans = blog.translations?.[0];
    setFormData({
      title: trans?.title || '',
      content: trans?.content || '',
      thumbnail: blog.thumbnail || '',
      thumbnailPublicId: blog.thumbnailPublicId || '',
      published: blog.published,
      locale: trans?.language?.code || 'en'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article? All associated media will be purged.')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Neural entry and associated data purged from reality');
      } catch (err) {}
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title) return toast.error('Title is mandatory');
    setIsSubmitting(true);
    try {
      const payload = { ...formData, authorId: user?.id };
      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, data: payload }).unwrap();
        toast.success('Neural broadcast synchronized');
      } else {
        await createBlog(payload).unwrap();
        toast.success('New transmission registered');
      }
      setIsModalOpen(false);
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter((b: any) => 
    b.translations?.[0]?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mdeOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: "Infect the network with your data...",
      status: false,
      imageUpload: true,
      imageUploadFunction: async (file: File, onSuccess: (url: string) => void, onError: (error: string) => void) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const result = await uploadImage(formData).unwrap();
          if (result?.url) {
            onSuccess(result.url);
            toast.success('Visual data uploaded to Cloudinary');
          } else {
            throw new Error('No URL returned');
          }
        } catch (err) {
          onError('Neural uplink failed during upload');
          toast.error('Failed to upload image');
        }
      },
      toolbar: [
        "bold", "italic", "heading", "|",
        "quote", "unordered-list", "ordered-list", "|",
        "link", 
        {
          name: "image",
          action: (editor: any) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e: any) => {
              const file = e.target.files[0];
              if (!file) return;

              const uploadPromise = (async () => {
                const formData = new FormData();
                formData.append('file', file);
                const result = await uploadImage(formData).unwrap();
                
                // Insert markdown image at cursor position
                const cm = editor.codemirror;
                const doc = cm.getDoc();
                const cursor = doc.getCursor();
                const line = doc.getLine(cursor.line);
                const pos = { line: cursor.line, ch: cursor.ch };
                
                const imageMarkdown = `\n![${file.name}](${result.url})\n`;
                doc.replaceRange(imageMarkdown, pos);
                return result;
              })();

              toast.promise(uploadPromise, {
                loading: 'Uploading visual data...',
                success: 'Neural link established. Visual data integrated.',
                error: 'Neural uplink failed during transmission.'
              });
            };
            input.click();
          },
          className: "fa fa-picture-o",
          title: "Upload Image",
        },
        "table", "code", "|",
        "preview", "side-by-side", "fullscreen", "|",
        "guide"
      ],
      promptURLs: false,
    };
  }, [uploadImage]) as any;

  return (
    <div className="space-y-8 pb-20">
      <style jsx global>{`
        .editor-toolbar {
          background: #0d0d0d !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-top-left-radius: 20px !important;
          border-top-right-radius: 20px !important;
          z-index: 50 !important;
          opacity: 1 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .editor-toolbar.fullscreen {
          z-index: 200 !important;
          background: #0d0d0d !important;
        }
        .CodeMirror-cursor {
          border-left: 3px solid #00f0ff !important;
          border-right: none !important;
          width: 0 !important;
          visibility: visible !important;
          z-index: 10 !important;
        }
        .CodeMirror div.CodeMirror-cursor {
          visibility: visible !important;
          border-left: 3px solid #00f0ff !important;
        }
        .CodeMirror {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          caret-color: #00f0ff !important;
          border-bottom-left-radius: 20px !important;
          border-bottom-right-radius: 20px !important;
          font-family: inherit !important;
          font-size: 16px !important;
          min-height: 500px !important;
          height: auto !important;
          flex: 1 !important;
        }
        .CodeMirror-scroll {
          min-height: 500px !important;
        }
        .CodeMirror-fullscreen {
          z-index: 199 !important;
          background: #0d0d0d !important;
        }
        .editor-preview-active-side {
          background: #0d0d0d !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .CodeMirror-cursor {
          border-left: 2px solid var(--primary) !important;
        }
        .EasyMDEContainer {
           display: flex;
           flex-direction: column;
           height: 100%;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Neural Journals</h2>
          <p className="text-muted-foreground font-medium">Broadcast your cognitive data to the global network.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Initialize Entry
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Filtering signal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          [1,2,3].map(i => (
            <div key={i} className="h-32 rounded-[32px] bg-white/5 animate-pulse" />
          ))
        ) : filteredBlogs.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-muted-foreground font-medium">
            No transmissions detected in this frequency.
          </div>
        ) : (
          filteredBlogs.map((blog: any) => (
            <motion.div 
              layout
              key={blog.id}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                  {blog.thumbnail ? (
                    <img src={blog.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight">
                      {blog.translations?.[0]?.title || 'Signal Error'}
                    </h3>
                    {blog.published ? (
                      <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest border border-green-500/20">Live</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground text-[8px] font-black uppercase tracking-widest border border-white/10">Draft</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      {blog.translations?.[0]?.language?.code?.toUpperCase() || 'EN'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 transition-opacity">
                <Link 
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all border border-white/5"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleEdit(blog)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(blog.id)}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-white">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#060606]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-[95vw] max-w-[95vw] h-[95vh] bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">
                    {editingBlog ? 'Refining Signal' : 'Drafting Transmission'}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Status: Neural Upload Pending</p>
                    {editingBlog && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <Link 
                          href={`/blog/${editingBlog.slug}`} 
                          target="_blank"
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> View Live Article
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 rounded-2xl hover:bg-white/5 flex items-center justify-center transition-colors border border-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 min-h-full">
                  <div className="space-y-10 lg:col-span-1">
                    <ImageUpload 
                      label="Transmission Visual"
                      value={formData.thumbnail}
                      onChange={(url, publicId) => setFormData({ ...formData, thumbnail: url, thumbnailPublicId: publicId })}
                      onRemove={() => setFormData({ ...formData, thumbnail: '', thumbnailPublicId: '' })}
                    />

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Linguistic Node
                        </label>
                        <select 
                          value={formData.locale}
                          onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 font-bold text-sm appearance-none cursor-pointer"
                        >
                          {languages.map((l: any) => (
                            <option key={l.code} value={l.code} className="bg-[#0d0d0d]">{l.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
                          <Layout className="w-3 h-3" /> Visibility Protocol
                        </label>
                        <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5">
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, published: false })}
                            className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!formData.published ? 'bg-white/10 text-white shadow-inner' : 'text-muted-foreground'}`}
                          >
                            Internal Only
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, published: true })}
                            className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.published ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground'}`}
                          >
                            Global Broadcast
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-8 flex flex-col h-full">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/50">Article Core Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Define your transmission head..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-primary/50 font-black text-2xl tracking-tighter"
                      />
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col min-h-[600px]">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/50">Cognitive Payload (Advanced Editor Mode)</label>
                      <div className="flex-1 overflow-hidden rounded-[32px] border border-white/10 flex flex-col">
                        <SimpleMDE
                          value={formData.content}
                          onChange={(value) => setFormData({ ...formData, content: value })}
                          options={mdeOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/10 flex items-center justify-end gap-6 bg-white/[0.02]">
                <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors">Discard Sequence</button>
                <button 
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
                  id="submit-blog-button"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Synchronize Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
