import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, CheckCircle2 } from 'lucide-react';
import { COLOR_PALETTES, ColorPalette } from '../colorPalettes';

interface ColorPalettePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPalette: ColorPalette | null;
  onSelectPalette: (palette: ColorPalette | null) => void;
}

export const ColorPalettePanel: React.FC<ColorPalettePanelProps> = ({
  isOpen,
  onClose,
  selectedPalette,
  onSelectPalette
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-secondary border border-border-primary rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-border-primary shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Palette size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Color Synthesis</h2>
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mt-1">Select Neural Color DNA</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLOR_PALETTES.map((palette) => {
                  const isSelected = selectedPalette?.name === palette.name;
                  return (
                    <motion.button
                      key={palette.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectPalette(palette.name === 'Default' ? null : palette);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 text-left group ${
                        isSelected 
                          ? 'bg-accent/10 border-accent ring-1 ring-accent/20 shadow-lg shadow-accent/5' 
                          : 'bg-bg-primary/50 border-border-primary hover:border-accent/40 hover:bg-bg-primary'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                          {palette.name}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-accent"
                          >
                            <CheckCircle2 size={14} />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex gap-1.5 h-8 w-full rounded-lg overflow-hidden border border-white/5 shadow-inner">
                        {palette.colors.map((color, idx) => (
                          <div 
                            key={idx} 
                            className="flex-1 h-full transition-transform group-hover:scale-y-110" 
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-border-primary bg-bg-secondary/50 shrink-0">
              <p className="text-[9px] font-mono text-text-secondary leading-relaxed uppercase tracking-tighter text-center">
                Note: Color palettes are strictly enforced by the synthesis engine. 
                Selecting a palette will override default color generation logic.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
