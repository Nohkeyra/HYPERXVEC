import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Loader2, 
  Sparkles,
  Info,
  Target,
  Palette
} from 'lucide-react';
import { ImageModel } from '../services/modelRegistry';
import { LOGO_TYPE_PRESETS, LOGO_LAYOUT_PRESETS } from '../logoPresets';
import { STYLE_PRESETS } from '../config/stylePresets';
import { playClickSound, triggerHapticFeedback } from '../utils/soundUtils';

interface SynthesisControlsProps {
  userInput: string;
  setUserInput: (val: string) => void;
  selectedModel: ImageModel;
  onModelChange: (modelId: ImageModel) => void;
  modelOptions: any[];
  isGenerating: boolean;
  isAnalyzing: boolean;
  onGenerate: () => void;
  onAnalyze?: () => void;
  activeTab: string;
  uploadedImage: string | null;
  selectedPreset: any;
  isStrictModeEnabled: boolean;
  setIsStrictModeEnabled: (val: boolean) => void;
  isIllustrated: boolean;
  setIsIllustrated: (val: boolean) => void;
  isSubjectOnly: boolean;
  setIsSubjectOnly: (val: boolean) => void;
  isBatchMode: boolean;
  setIsBatchMode: (val: boolean) => void;
  selectedLogoType: string;
  setSelectedLogoType: (val: string) => void;
  selectedLogoLayout: string;
  setSelectedLogoLayout: (val: string) => void;
  selectedImageSize: string;
  setSelectedImageSize: (val: string) => void;
  selectedStylePresetId: string;
  setSelectedStylePresetId: (val: string) => void;
}

export const SynthesisControls: React.FC<SynthesisControlsProps> = ({
  userInput,
  setUserInput,
  selectedModel,
  onModelChange,
  modelOptions,
  isGenerating,
  isAnalyzing,
  onGenerate,
  onAnalyze,
  activeTab,
  uploadedImage,
  selectedPreset,
  isStrictModeEnabled,
  setIsStrictModeEnabled,
  isIllustrated,
  setIsIllustrated,
  isSubjectOnly,
  setIsSubjectOnly,
  isBatchMode,
  setIsBatchMode,
  selectedLogoType,
  setSelectedLogoType,
  selectedLogoLayout,
  setSelectedLogoLayout,
  selectedImageSize,
  setSelectedImageSize,
  selectedStylePresetId,
  setSelectedStylePresetId
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [showAttentionMenu, setShowAttentionMenu] = React.useState(false);

  const handleButtonClick = (callback: () => void) => {
    playClickSound();
    triggerHapticFeedback();
    callback();
  };

  const applyWeight = (weight: number) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selection = userInput.substring(start, end);
    
    if (!selection) return;

    const weighted = `(${selection}:${weight})`;
    const newValue = userInput.substring(0, start) + weighted + userInput.substring(end);
    setUserInput(newValue);
    setShowAttentionMenu(false); // Close menu after applying
    
    // Reset focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 1, start + 1 + selection.length);
      }
    }, 0);
  };
  return (
    <div className="w-full flex-shrink-0 flex flex-col order-2 transition-all duration-300">
      {/* Toggles Row */}
      <div className="flex items-center justify-between px-6 py-3 mb-4 bg-bg-secondary rounded-full shadow-sm ring-1 ring-border-primary overflow-x-auto custom-scrollbar gap-4">
        {/* Style Preset Selector */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Palette size={14} className="text-accent opacity-60" />
          <select
            value={selectedStylePresetId}
            onChange={(e) => setSelectedStylePresetId(e.target.value)}
            className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-text-primary focus:outline-none cursor-pointer w-full"
          >
            <option value="none">No Style</option>
            {STYLE_PRESETS.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-4 bg-border-primary shrink-0" />

        {/* Strict Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsStrictModeEnabled(!isStrictModeEnabled))}
            className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isStrictModeEnabled ? 'bg-accent' : 'bg-bg-primary ring-1 ring-border-primary'}`}
            title="High Fidelity Tracking"
          >
            <motion.div 
              animate={{ x: isStrictModeEnabled ? 16 : 2 }}
              className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isStrictModeEnabled ? 'bg-bg-primary' : 'bg-text-secondary'}`}
            />
          </motion.button>
          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Hi-Fi</span>
        </div>

        {/* Illustrated Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsIllustrated(!isIllustrated))}
            className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isIllustrated ? 'bg-accent' : 'bg-bg-primary ring-1 ring-border-primary'}`}
            title="Illustrated Finish"
          >
            <motion.div 
              animate={{ x: isIllustrated ? 16 : 2 }}
              className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isIllustrated ? 'bg-bg-primary' : 'bg-text-secondary'}`}
            />
          </motion.button>
          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Illust</span>
        </div>

        {/* Subject Only Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsSubjectOnly(!isSubjectOnly))}
            className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isSubjectOnly ? 'bg-accent' : 'bg-bg-primary ring-1 ring-border-primary'}`}
            title="Subject Isolation"
          >
            <motion.div 
              animate={{ x: isSubjectOnly ? 16 : 2 }}
              className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isSubjectOnly ? 'bg-bg-primary' : 'bg-text-secondary'}`}
            />
          </motion.button>
          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Subject</span>
        </div>

        {/* Batch Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick(() => setIsBatchMode(!isBatchMode))}
            className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isBatchMode ? 'bg-accent' : 'bg-bg-primary ring-1 ring-border-primary'}`}
            title="2x2 Batch Synthesis"
          >
            <motion.div 
              animate={{ x: isBatchMode ? 16 : 2 }}
              className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isBatchMode ? 'bg-bg-primary' : 'bg-text-secondary'}`}
            />
          </motion.button>
          <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Batch</span>
        </div>
      </div>

        {/* Designer Controls (Conditional) */}
      <AnimatePresence>
        {(activeTab === 'logo design' || selectedModel === 'gemini-3-pro-image') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-4 flex flex-wrap gap-3 overflow-hidden"
          >
            {activeTab === 'logo design' && (
              <>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-1 block">Logo Type DNA</label>
                  <select 
                    value={selectedLogoType}
                    onChange={(e) => setSelectedLogoType(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Default Neural</option>
                    {LOGO_TYPE_PRESETS.map(t => <option key={t.name} value={t.prompt}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-1 block">Logo Layout DNA</label>
                  <select 
                    value={selectedLogoLayout}
                    onChange={(e) => setSelectedLogoLayout(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Default Neural</option>
                    {LOGO_LAYOUT_PRESETS.map(l => <option key={l.name} value={l.prompt}>{l.name}</option>)}
                  </select>
                </div>
              </>
            )}
            {selectedModel === 'gemini-3-pro-image' && (
              <div className="flex-1 min-w-[140px]">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-1 block">Image Size</label>
                <select 
                  value={selectedImageSize}
                  onChange={(e) => setSelectedImageSize(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-bg-secondary rounded-[32px] overflow-hidden shadow-sm ring-1 ring-border-primary"
      >
        {/* Top: Input Area */}
        <div className="relative group border-b border-border-primary">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="ENTER VISUAL DIRECTIVES..."
            className="w-full bg-bg-secondary p-6 pb-16 text-sm font-mono uppercase tracking-widest focus:outline-none resize-none h-32 lg:h-[300px] xl:h-[400px] placeholder:opacity-30 relative z-10 transition-all duration-300"
          />
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            {userInput && (
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick(() => setUserInput(''))}
                className="p-2 text-text-secondary hover:text-red-500 transition-colors bg-bg-primary/50 rounded-lg backdrop-blur-sm"
                title="Clear Input"
              >
                <X size={14} />
              </motion.button>
            )}
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick(() => setShowAttentionMenu(!showAttentionMenu))}
                className="p-2 text-text-secondary hover:text-accent transition-colors"
                title="Smart Attention Syntax"
              >
                <Target size={16} />
              </motion.button>
              <div className={`absolute right-0 top-full mt-2 w-64 p-4 bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl transition-all z-[100] backdrop-blur-xl ${showAttentionMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <Target size={12} /> Attention Mechanism
                </h4>
                <p className="text-[9px] text-text-secondary leading-relaxed uppercase tracking-tighter">
                  Focus the engine on specific parts of your prompt using weight syntax:
                </p>
                <div className="mt-3 space-y-2">
                  <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                    <code className="text-[10px] text-accent font-mono">(word:1.5)</code>
                    <p className="text-[8px] text-text-secondary mt-1">High emphasis (1.5x weight)</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                    <code className="text-[10px] text-accent font-mono">[word]</code>
                    <p className="text-[8px] text-text-secondary mt-1">Shorthand for (word:1.5)</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                    <code className="text-[10px] text-accent font-mono">(word:0.8)</code>
                    <p className="text-[8px] text-text-secondary mt-1">Reduced emphasis (0.8x weight)</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonClick(() => applyWeight(1.5))}
                    className="w-full py-2 bg-accent/10 text-accent rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-accent hover:text-bg-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Target size={12} /> Apply 1.5x Weight to Selection
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>

          {/* Model Selector */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {modelOptions.map((model) => (
              <motion.button
                key={model.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick(() => onModelChange(model.id))}
                className={`w-8 h-8 flex items-center justify-center transition-all duration-300 relative group/model ${
                  selectedModel === model.id 
                    ? `scale-125 ${model.color}` 
                    : 'text-text-secondary opacity-40 hover:opacity-100 hover:scale-110'
                }`}
                title={model.label}
              >
                <model.icon 
                  size={18} 
                  className={`transition-all duration-300 ${
                    selectedModel === model.id 
                      ? 'filter drop-shadow-[0_0_12px_currentColor] drop-shadow-[0_0_4px_currentColor]' 
                      : ''
                  }`} 
                />
                
                {/* Active Indicator Dot */}
                {selectedModel === model.id && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-current shadow-[0_0_5px_currentColor] opacity-80`} />
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover/model:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
                  {model.label}
                  {model.id.startsWith('seedream') && <span className="block text-[7px] text-accent mt-0.5">ARK ENGINE</span>}
                  {model.id === 'nvidia-nim' && <span className="block text-[7px] text-green-400 mt-0.5">GPU ROUTE</span>}
                  {model.id === 'cloudflare-sdxl' && <span className="block text-[7px] text-blue-400 mt-0.5">SDXL</span>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom: Action Bar */}
        <div className="flex">
          {uploadedImage && onAnalyze && activeTab === 'image analyzer' && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleButtonClick(onAnalyze)}
              disabled={isAnalyzing}
              className="flex-1 bg-bg-secondary text-text-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-bg-primary transition-all border-r border-border-primary"
            >
              {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={14} className="text-accent" />}
              Extract DNA
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick(onGenerate)}
            disabled={isGenerating || (activeTab !== 'vectorize' && activeTab !== 'logo design' && !selectedPreset)}
            className="flex-[2] bg-accent text-bg-primary py-4 text-sm font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap size={20} className="fill-current" />}
            {isGenerating ? 'Synthesizing' : 'Initiate Synthesis'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
