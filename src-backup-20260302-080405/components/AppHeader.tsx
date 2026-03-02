import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Terminal as TerminalIcon, 
  History, 
  Layers, 
  Sun, 
  Moon, 
  Camera 
} from 'lucide-react';

interface AppHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  setShowSettings: (val: boolean) => void;
  setShowLogs: (val: boolean) => void;
  setShowHistory: (val: boolean) => void;
  setShowGallery: (val: boolean) => void;
  setShowCamera: (val: boolean) => void;
  generationCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  setShowSettings,
  setShowLogs,
  setShowHistory,
  setShowGallery,
  setShowCamera,
  generationCount
}) => {
  return (
    <header className="flex justify-between items-center mb-8 md:mb-12 relative z-50">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 bg-bg-secondary ring-1 ring-border-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl md:text-2xl font-black text-accent tracking-tighter italic">V</span>
          </div>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] italic font-serif">VΞCTOR</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Neural Synthesis Engine v1.3</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2 bg-bg-secondary/50 backdrop-blur-md p-1.5 rounded-full ring-1 ring-border-primary shadow-sm">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="System Settings"
          >
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <button 
            onClick={() => setShowLogs(true)}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="System Logs"
          >
            <TerminalIcon size={18} />
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="Generation History"
          >
            <History size={18} />
          </button>
          <button 
            onClick={() => setShowGallery(true)}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="Image Gallery"
          >
            <Layers size={18} />
            {generationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full ring-2 ring-bg-secondary" />
            )}
          </button>
          <div className="w-px h-6 bg-border-primary mx-1" />
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all text-text-secondary hover:text-text-primary"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-1">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={() => setShowLogs(true)}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Logs"
          >
            <TerminalIcon size={18} />
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="History"
          >
            <History size={18} />
          </button>
          <button 
            onClick={() => setShowGallery(true)}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all relative text-text-secondary hover:text-text-primary"
            title="Gallery"
          >
            <Layers size={18} />
            {generationCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
