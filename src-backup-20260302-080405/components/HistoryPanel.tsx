import React from 'react';
import { motion } from 'motion/react';
import { History, X, RotateCcw, Trash2, Share } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  presetName: string;
  timestamp: string;
  image: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onClose: () => void;
  onRestore: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClose, onRestore, onClear }) => {
  const handleShare = async (image: string) => {
    try {
      const blob = await fetch(image).then(r => r.blob());
      const file = new File([blob], 'history-synthesis.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'VΞCTOR Synthesis History',
          text: 'Check out this visual synthesis from my history!'
        });
      } else {
        alert('Sharing not supported on this browser.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-secondary border-l border-border-primary shadow-2xl z-[100] flex flex-col"
    >
      <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-secondary shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <History size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Generation History</h2>
            <p className="text-[9px] font-mono uppercase tracking-widest opacity-40 mt-1">Recent Visual Synthesis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors" title="Clear History">
            <Trash2 size={18} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg-primary space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-4 opacity-40">
            <History size={48} strokeWidth={1} />
            <p className="text-xs uppercase tracking-widest">No recent history</p>
          </div>
        ) : (
          history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-bg-secondary border border-border-primary rounded-2xl group hover:border-accent transition-all"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border-primary">
                  <img src={item.image} alt="History" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">{item.timestamp}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleShare(item.image)}
                        className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-bg-primary transition-all opacity-0 group-hover:opacity-100"
                        title="Share Synthesis"
                      >
                        <Share size={14} />
                      </button>
                      <button 
                        onClick={() => onRestore(item)}
                        className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-bg-primary transition-all opacity-0 group-hover:opacity-100"
                        title="Restore Prompt & Preset"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter mt-1 truncate">{item.presetName}</p>
                  <p className="text-[11px] text-text-secondary mt-1 line-clamp-2 italic">"{item.prompt}"</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
