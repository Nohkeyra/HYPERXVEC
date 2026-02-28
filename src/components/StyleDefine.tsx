import React from 'react';
import { Terminal, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function StyleDefine() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6"
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-accent/5 border border-accent/20 flex items-center justify-center">
          <Terminal className="text-accent w-10 h-10" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-bg-secondary border border-border-primary flex items-center justify-center shadow-lg">
          <Search className="text-accent" size={16} />
        </div>
      </div>
      <div className="max-w-xs">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Style Analyzer</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Upload an image to reverse-engineer its visual DNA. Extract prompts for style replication.
        </p>
      </div>
    </motion.div>
  );
}
