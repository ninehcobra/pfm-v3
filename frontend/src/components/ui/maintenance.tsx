'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlurText } from './blur-text';
import { Hammer } from 'lucide-react';

export function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="mb-8 p-6 bg-primary/10 rounded-full text-primary"
      >
        <Hammer className="w-12 h-12" />
      </motion.div>
      
      <BlurText 
        text="Site Under Maintenance" 
        className="text-4xl md:text-6xl font-black mb-6"
      />
      
      <p className="max-w-md text-muted-foreground text-lg leading-relaxed mb-12">
        We're currently updating our portfolio to bring you an even better experience. Please check back in a few moments.
      </p>
      
      <div className="text-xs font-bold uppercase tracking-widest text-primary/50">
        Antigravity Engineering
      </div>
    </div>
  );
}
