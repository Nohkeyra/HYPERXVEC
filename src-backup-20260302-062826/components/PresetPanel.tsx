import React, { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Preset, PresetCategory } from '../presets';
import { CheckCircle2 } from 'lucide-react';

const PresetPreview = lazy(() => import('./PresetPreview').then(m => ({ default: m.PresetPreview })));

interface PresetPanelProps {
  categories: readonly PresetCategory[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset) => void;
  previewCategory: "lettering" | "logo design" | "vector";
  usedPresets?: Set<string>;
}

export const PresetPanel: React.FC<PresetPanelProps> = ({ categories, selectedPreset, onSelectPreset, previewCategory, usedPresets = new Set() }) => {
  return (
    <div className="space-y-12 pb-20">
      {categories.map((category, catIndex) => (
        <div key={category.category} className="space-y-4">
          <div className="px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-text-secondary">
              {category.category}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4 px-2">
            {category.presets.map((preset, index) => {
              const isSelected = selectedPreset?.name === preset.name;
              const isUsed = usedPresets.has(preset.name);
              
              return (
                <motion.button
                  key={preset.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-2 rounded-2xl transition-all flex items-center gap-3 group w-full relative overflow-hidden ${
                    isSelected
                      ? 'bg-bg-secondary ring-1 ring-accent shadow-xl shadow-accent/5'
                      : 'bg-transparent hover:bg-bg-secondary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl overflow-hidden relative bg-bg-secondary flex-shrink-0`}>
                    <Suspense fallback={<div className="w-full h-full bg-bg-secondary" />}>
                      <PresetPreview 
                        name={preset.name} 
                        category={previewCategory} 
                        isSelected={isSelected} 
                      />
                    </Suspense>
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-accent rounded-xl pointer-events-none z-20" />
                    )}
                  </div>
                  
                  <div className="flex-grow text-left">
                    <span className={`text-[10px] font-bold uppercase tracking-wider truncate block w-full ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                      {preset.name}
                    </span>
                  </div>
                  {isUsed && (
                    <CheckCircle2 size={12} className="text-accent flex-shrink-0 mr-2 opacity-50" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
