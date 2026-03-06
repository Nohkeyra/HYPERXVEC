import React from 'react';
import { motion } from 'motion/react';
import { 
  Image as ImageIcon, 
  Type as TypeIcon, 
  Aperture, 
  Sparkles, 
  MessageCircle 
} from 'lucide-react';
import { playClickSound, triggerHapticFeedback } from '../utils/soundUtils';

type Tab = 'vectorize' | 'core lettering' | 'logo design' | 'image analyzer' | 'chat';

interface AppNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'vectorize', label: 'Vectorize', icon: ImageIcon },
    { id: 'core lettering', label: 'Lettering', icon: TypeIcon },
    { id: 'logo design', label: 'Logo', icon: Aperture },
    { id: 'image analyzer', label: 'Analyzer', icon: Sparkles },
    { id: 'chat', label: 'Assistant', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-t border-border-primary px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex justify-around items-center md:hidden">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playClickSound();
            triggerHapticFeedback();
            onTabChange(tab.id);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <tab.icon size={20} className="mb-1" />
          {tab.label}
        </motion.button>
      ))}
    </nav>
  );
};
