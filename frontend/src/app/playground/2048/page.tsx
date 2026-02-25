'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft, Gamepad2, Info } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/core/hooks/use-auth';
import { 
  useSaveScoreMutation, 
  useGetLeaderboardQuery, 
  useGetUserHistoryQuery,
  useGetUserBestQuery
} from '@/core/api/playground-api';
import { 
  Grid, 
  createEmptyGrid, 
  spawnTile, 
  move, 
  isGameOver 
} from './game-logic';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const TILE_COLORS: Record<number, string> = {
  2: 'bg-white/10 text-foreground',
  4: 'bg-white/20 text-foreground',
  8: 'bg-orange-500/30 text-white border-orange-500/50',
  16: 'bg-orange-600/40 text-white border-orange-600/50',
  32: 'bg-red-500/40 text-white border-red-500/50',
  64: 'bg-red-600/50 text-white border-red-600/60',
  128: 'bg-yellow-500/40 text-white border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
  256: 'bg-yellow-500/50 text-white border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
  512: 'bg-yellow-500/60 text-white border-yellow-500/70 shadow-[0_0_25px_rgba(234,179,8,0.5)]',
  1024: 'bg-yellow-500/70 text-white border-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.6)]',
  2048: 'bg-primary/40 text-white border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.5)]',
};

export default function Glass2048Page() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  
  const { data: remoteBest } = useGetUserBestQuery({ gameKey: '2048' }, { skip: !user });
  const [saveScore] = useSaveScoreMutation();
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useGetLeaderboardQuery({ gameKey: '2048', limit: 10 });
  const { data: history = [] } = useGetUserHistoryQuery({ gameKey: '2048', limit: 5 }, { skip: !user });

  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Initialize game on client side only to avoid hydration mismatch
    setGrid(spawnTile(spawnTile(createEmptyGrid())));
    
    // Load best score from local storage
    const saved = localStorage.getItem('glass-2048-best');
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, []);

  // Sync bestScore with remote data once
  useEffect(() => {
    if (remoteBest && remoteBest.score > bestScore) {
      setBestScore(remoteBest.score);
    }
  }, [remoteBest, bestScore]); 

  const [isGameOverState, setIsGameOverState] = useState(false);

  // Sync bestScore locally (removed useEffect loop)
  const updateBestScore = useCallback((newScore: number) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem('glass-2048-best', newScore.toString());
    }
  }, [bestScore]);

  // Handle Game Over - Save Score
  useEffect(() => {
    if (isGameOverState && score > 0) {
      saveScore({
        gameKey: '2048',
        score: score,
        playerName: user?.fullName || 'Guest Player'
      });
    }
  }, [isGameOverState, score, user, saveScore]);

  const handleNewGame = () => {
    setGrid(spawnTile(spawnTile(createEmptyGrid())));
    setScore(0);
    setIsGameOverState(false);
  };

  const handleMove = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isGameOverState) return;

    setGrid((prevGrid: Grid) => {
      const { newGrid, score: moveScore, moved } = move(prevGrid, direction);
      if (moved) {
        const withNewTile = spawnTile(newGrid);
        
        setScore((s: number) => {
          const newScore = s + moveScore;
          updateBestScore(newScore);
          return newScore;
        });

        if (isGameOver(withNewTile)) {
          setIsGameOverState(true);
        }
        return withNewTile;
      }
      return prevGrid;
    });
  }, [isGameOverState, updateBestScore]); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': handleMove('LEFT'); break;
        case 'ArrowRight': handleMove('RIGHT'); break;
        case 'ArrowUp': handleMove('UP'); break;
        case 'ArrowDown': handleMove('DOWN'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 flex flex-col items-center justify-center p-6 md:p-12 font-sans overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 relative z-10 items-start">
        {/* Game Section */}
        <div className="space-y-8 w-full">
          {/* Header Section */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Link 
                href="/playground"
                className="group flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Playground Hub
              </Link>
              <h1 className="text-6xl font-black italic tracking-tighter leading-none">GLASS <span className="text-primary tracking-[-0.15em] ml-[-0.1em]">2048</span></h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">Merge the shards, reach the pinnacle.</p>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <div className="flex gap-2">
                <div className="bg-white/5 border border-white/10 p-3 px-6 rounded-2xl flex flex-col items-center group hover:bg-white/10 transition-all cursor-default min-w-[100px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Score</span>
                  <span className="text-xl font-black italic">{score}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 px-6 rounded-2xl flex flex-col items-center group hover:bg-white/10 transition-all cursor-default min-w-[100px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-yellow-500 transition-colors">Best</span>
                  <span className="text-xl font-black italic flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    {bestScore}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleNewGame}
                className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 hover:shadow-primary/20"
              >
                <RotateCcw className="w-4 h-4" />
                Pulse Reset
              </button>
            </div>
          </div>

          {/* Game Board */}
          <div className="relative group p-4 bg-white/[0.03] border border-white/5 rounded-[40px] shadow-2xl backdrop-blur-3xl aspect-square w-full max-w-[500px] h-auto mx-auto lg:mx-0">
            <div className="grid grid-cols-4 grid-rows-4 gap-3 md:gap-4 h-full aspect-square">
              {grid.map((row, r) => 
                row.map((cell, c) => (
                  <div 
                    key={`${r}-${c}`} 
                    className="bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden aspect-square"
                  >
                    <AnimatePresence mode='popLayout'>
                      {cell !== null && (
                        <motion.div
                          key={`${r}-${c}-${cell}`}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`
                            absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-black italic rounded-2xl border
                            ${TILE_COLORS[cell] || 'bg-white/10'}
                          `}
                        >
                          {cell}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>

            {/* Game Over Overlay */}
            <AnimatePresence>
              {isGameOverState && (
                <motion.div 
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8 bg-black/60 rounded-[40px] p-10 text-center"
                >
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-red-500/20 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-6">
                      <Gamepad2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase">Signal Lost</h2>
                    <p className="text-muted-foreground font-medium max-w-[200px] mx-auto uppercase text-[10px] tracking-widest leading-relaxed">The data grid has stabilized at {score} points. Protocol terminated.</p>
                  </div>
                  <button 
                    onClick={handleNewGame}
                    className="bg-primary text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    Initialize New Sequence
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3 group hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Controls</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-relaxed group-hover:text-white transition-colors">
                Use <span className="text-white px-2 py-1 bg-white/5 rounded-lg border border-white/10 font-bold">Arrow Keys</span> to shift the grid. Merge identical values to evolve.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3 group hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-2 text-primary">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Singularity</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-relaxed group-hover:text-white transition-colors">
                Reach the <span className="text-white font-black italic">2048</span> singularity to achieve absolute data coherence.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Section: Leaderboard & History */}
        <div className="w-full lg:w-80 space-y-8">
          {/* Global Leaderboard */}
          <SpotlightCard className="p-8 border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Top Nodes</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Global Leaderboard</h3>
              </div>
            </div>

            <div className="space-y-4">
              {isLeaderboardLoading ? (
                [1,2,3,4,5].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl" />)
              ) : leaderboard.length === 0 ? (
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest text-center py-8">No data logs recorded.</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black font-mono ${i < 3 ? 'text-primary' : 'text-white/20'}`}>
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                          {entry.user?.fullName || entry.playerName || 'Anonymous'}
                        </span>
                        <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">
                          {isMounted ? new Date(entry.createdAt).toLocaleDateString() : '...'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-black italic text-primary">{entry.score}</span>
                  </div>
                ))
              )}
            </div>
          </SpotlightCard>

          {/* Personal History */}
          {user && (
            <SpotlightCard className="p-8 border-white/5 bg-white/[0.02]">
              <div className="space-y-1 mb-8">
                <div className="flex items-center gap-2 text-blue-400">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Your Logs</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Personal History</h3>
              </div>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest text-center py-4">No personal runs recorded.</p>
                ) : (
                  history.map((run) => (
                    <div key={run.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 p-2 border-b border-white/5 last:border-0">
                      <span>{isMounted ? new Date(run.createdAt).toLocaleDateString() : '...'}</span>
                      <span className="text-white">{run.score}</span>
                    </div>
                  ))
                )}
              </div>
            </SpotlightCard>
          )}
        </div>
      </div>
    </div>
  );
}
