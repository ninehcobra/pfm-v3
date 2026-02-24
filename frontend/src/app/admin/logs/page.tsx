'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Bug,
  RefreshCcw,
  User
} from 'lucide-react';
import { useGetLogsQuery, useClearLogsMutation, LogFilter } from '@/core/api/log-api';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogsPage() {
  const [filters, setFilters] = useState<LogFilter>({
    page: 1,
    limit: 20,
    search: '',
  });
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetLogsQuery(filters);
  const [clearLogsOld] = useClearLogsMutation();

  const logs = data?.items || [];
  const meta = data?.meta || { total: 0, totalPages: 0 };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const clearLogs = async () => {
    if (confirm('Are you sure you want to clear logs older than 30 days?')) {
      await clearLogsOld(30);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'DEBUG': return <Bug className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const isSuccess = status === 'SUCCESS';
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
        isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">System Logs</h1>
          <p className="text-muted-foreground font-medium">Monitor system activity and debug issues in real-time.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => refetch()}
            className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={clearLogs}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Old Logs</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-white/5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search message, path..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <select 
            className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            value={filters.level || ''}
            onChange={(e) => setFilters({ ...filters, level: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Levels</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="ERROR">Error</option>
            <option value="DEBUG">Debug</option>
          </select>

          <select 
            className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>

          <div className="flex gap-4">
             <button 
              type="submit"
              className="flex-1 bg-primary text-primary-foreground rounded-2xl font-black text-sm tracking-tight hover:opacity-90 transition-all"
             >
              Apply Filters
             </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-[#0d0d0d] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-10">Level</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-10"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`group hover:bg-white/[0.02] cursor-pointer transition-colors ${expandedLog === log.id ? 'bg-white/[0.02]' : ''}`}
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    >
                      <td className="p-6">
                        {getLevelIcon(log.level)}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm tracking-tight">{log.action}</span>
                          <span className="text-xs text-muted-foreground font-medium truncate max-w-xs">{log.message}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        {log.user ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                              <User className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold">{log.user.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium italic">Guest</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="p-6">
                        {expandedLog === log.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />}
                      </td>
                    </motion.tr>
                    {expandedLog === log.id && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-white/5">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="p-8 bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-8"
                          >
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Context Info</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Source</p>
                                    <p className="text-xs font-bold">{log.source}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">IP Address</p>
                                    <p className="text-xs font-bold font-mono">{log.ip || 'Unknown'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Method</p>
                                    <p className="text-xs font-bold">{log.method || 'N/A'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Status Code</p>
                                    <p className="text-xs font-bold">{log.statusCode || 'N/A'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Duration</p>
                                    <p className="text-xs font-bold">{log.duration ? `${log.duration}ms` : 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">User Agent</h4>
                                <p className="text-xs font-medium text-muted-foreground leading-relaxed break-all">
                                  {log.userAgent || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Logs Metadata</h4>
                              <div className="p-4 rounded-2xl bg-[#080808] border border-white/5 max-h-[300px] overflow-y-auto">
                                <pre className="text-[10px] font-mono leading-relaxed text-blue-400">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#0a0a0a]">
          <p className="text-xs text-muted-foreground font-bold">
            Showing <span className="text-foreground">{logs.length}</span> of <span className="text-foreground">{meta.total}</span> logs
          </p>
          <div className="flex gap-2">
            <button 
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 disabled:opacity-30 font-bold text-xs"
            >
              Previous
            </button>
            <button 
              disabled={filters.page === meta.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 disabled:opacity-30 font-bold text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
