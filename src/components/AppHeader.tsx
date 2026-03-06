import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Terminal as TerminalIcon, 
  History, 
  Layers, 
  Sun, 
  Moon, 
  Camera,
  Hexagon
} from 'lucide-react';
import { playClickSound, triggerHapticFeedback } from '../utils/soundUtils';

interface AppHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  setShowSettings: (val: boolean) => void;
  setShowLogs: (val: boolean) => void;
  setShowHistory: (val: boolean) => void;
  setShowCamera: (val: boolean) => void;
  generationCount: number;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  setShowSettings,
  setShowLogs,
  setShowHistory,
  setShowCamera,
  generationCount,
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'vectorize', label: 'Vectorize' },
    { id: 'core lettering', label: 'Lettering' },
    { id: 'logo design', label: 'Logo' },
    { id: 'image analyzer', label: 'Analyzer' },
    { id: 'chat', label: 'Assistant' },
  ];

  const handleButtonClick = (callback: () => void) => {
    playClickSound();
    triggerHapticFeedback();
    callback();
  };

  return (
    <header className="pull-to-refresh-header flex justify-between items-center mb-8 md:mb-12 relative z-50">
      <div className="flex items-center gap-3 md:gap-4">
        <Hexagon className="w-8 h-8 md:w-10 md:h-10 text-accent fill-accent/20" strokeWidth={2.5} />
        <div>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] italic font-serif">VΞCTOR</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Neural Synthesis Engine v1.3</p>
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:flex items-center gap-1 bg-bg-secondary/50 backdrop-blur-md p-1 rounded-full ring-1 ring-border-primary shadow-sm">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButtonClick(() => onTabChange(tab.id))}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-accent text-bg-primary shadow-lg shadow-accent/20' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2 bg-bg-secondary/50 backdrop-blur-md p-1.5 rounded-full ring-1 ring-border-primary shadow-sm">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowSettings(true))}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="System Settings"
          >
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowLogs(true))}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="System Logs"
          >
            <TerminalIcon size={18} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowHistory(true))}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all group relative text-text-secondary hover:text-text-primary"
            title="Generation History"
          >
            <History size={18} />
          </motion.button>
          <div className="w-px h-6 bg-border-primary mx-1" />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsDarkMode(!isDarkMode))}
            className="p-2.5 hover:bg-bg-primary rounded-full transition-all text-text-secondary hover:text-text-primary"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowSettings(true))}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Settings"
          >
            <Settings size={18} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowLogs(true))}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Logs"
          >
            <TerminalIcon size={18} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setShowHistory(true))}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="History"
          >
            <History size={18} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsDarkMode(!isDarkMode))}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-all text-text-secondary hover:text-text-primary"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
