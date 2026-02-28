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
    <div className="space-y-8 pb-20">
      {categories.map((category, catIndex) => (
        <div key={category.category} className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1 h-4 bg-accent/50 rounded-full" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
              {category.category}
            </h3>
            <div className="h-px flex-1 bg-border-primary/50" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 px-2">
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
                  className={`p-2.5 rounded-2xl border transition-all flex items-center gap-3 group w-full relative overflow-hidden ${
                    isSelected
                      ? 'bg-bg-secondary border-accent shadow-lg shadow-accent/10'
                      : 'bg-bg-secondary border-border-primary hover:border-accent/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg overflow-hidden relative bg-bg-primary flex-shrink-0`}>
                    <Suspense fallback={<div className="w-full h-full bg-bg-primary" />}>
                      <PresetPreview 
                        name={preset.name} 
                        category={previewCategory} 
                        isSelected={isSelected} 
                      />
                    </Suspense>
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-accent rounded-lg pointer-events-none z-20" />
                    )}
                  </div>
                  
                  <div className="flex-grow text-left">
                    <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                      {preset.name}
                    </span>
                  </div>
                  {isUsed && (
                    <CheckCircle2 size={12} className="text-accent flex-shrink-0 mr-2" />
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
