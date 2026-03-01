import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Save, 
  Share, 
  Trash2, 
  Zap, 
  Maximize2, 
  Palette,
  Upload,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { ImageModel } from '../services/modelRegistry';

interface ViewportProps {
  isGenerating: boolean;
  resultImage: string | string[] | null;
  uploadedImage: string | null;
  selectedModel: ImageModel;
  modelOptions: any[];
  selectedPreset: any;
  isHoldingCompare: boolean;
  setIsHoldingCompare: (val: boolean) => void;
  onDownload: () => void;
  onSaveToGallery: () => void;
  onShare: (img?: string) => void;
  onClear: () => void;
  onSelectVariation: (img: string) => void;
  onUploadClick: () => void;
  onCameraClick: () => void;
  onColorPaletteClick: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const Viewport: React.FC<ViewportProps> = ({
  isGenerating,
  resultImage,
  uploadedImage,
  selectedModel,
  modelOptions,
  selectedPreset,
  isHoldingCompare,
  setIsHoldingCompare,
  onDownload,
  onSaveToGallery,
  onShare,
  onClear,
  onSelectVariation,
  onUploadClick,
  onCameraClick,
  onColorPaletteClick,
  onFileUpload,
  fileInputRef
}) => {
  const currentModel = modelOptions.find(m => m.id === selectedModel);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full lg:flex-1 bg-bg-secondary rounded-[32px] aspect-square lg:aspect-auto lg:h-[600px] xl:h-[700px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm ring-1 ring-border-primary group/viewport order-1 transition-all duration-300"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--border-primary) 1px, transparent 1px), linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Model Engine Indicator */}
      <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
        <div className="flex items-center gap-2 bg-bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full ring-1 ring-border-primary shadow-sm">
          <div className={`w-1.5 h-1.5 rounded-full ${currentModel?.color.replace('text-', 'bg-') || 'bg-accent'}`} />
          <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">
            ENGINE: {currentModel?.label || selectedModel}
          </span>
        </div>
      </div>

      {/* Floating Utility Icons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onColorPaletteClick();
          }}
          className="w-8 h-8 md:w-10 md:h-10 bg-bg-secondary/80 backdrop-blur-md ring-1 ring-border-primary rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-all shadow-sm"
          title="Color Palette"
        >
          <Palette size={16} />
        </button>
        {(resultImage || uploadedImage) && !isGenerating && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="w-8 h-8 md:w-10 md:h-10 bg-bg-secondary/80 backdrop-blur-md ring-1 ring-border-primary rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-all shadow-sm"
              title="Download Image"
            >
              <Download size={16} />
            </button>
            {resultImage && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveToGallery();
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-bg-secondary/80 backdrop-blur-md ring-1 ring-border-primary rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-all shadow-sm"
                  title="Save to Gallery"
                >
                  <Save size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-bg-secondary/80 backdrop-blur-md ring-1 ring-border-primary rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-all shadow-sm"
                  title="Share Synthesis"
                >
                  <Share size={16} />
                </button>
              </>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="w-8 h-8 md:w-10 md:h-10 bg-bg-secondary/80 backdrop-blur-md ring-1 ring-border-primary rounded-xl flex items-center justify-center text-text-secondary hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Clear Canvas"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 md:gap-8 relative z-10"
          >
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-accent/10 border-t-accent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="text-accent w-6 h-6 md:w-8 md:h-8 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-[0.3em] italic font-serif">Synthesizing</h3>
              <p className="text-[10px] md:text-xs font-mono opacity-40 mt-2 uppercase tracking-widest">Constructing Vector Geometry</p>
            </div>
          </motion.div>
        ) : resultImage ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full h-full cursor-crosshair flex items-center justify-center p-4"
            onMouseDown={() => uploadedImage && !Array.isArray(resultImage) && setIsHoldingCompare(true)}
            onMouseUp={() => setIsHoldingCompare(false)}
            onMouseLeave={() => setIsHoldingCompare(false)}
            onTouchStart={() => uploadedImage && !Array.isArray(resultImage) && setIsHoldingCompare(true)}
            onTouchEnd={() => setIsHoldingCompare(false)}
          >
            {Array.isArray(resultImage) ? (
              <div className="grid grid-cols-2 gap-2 w-full h-full max-h-[80vh]">
                {resultImage.map((img, idx) => (
                  <div key={idx} className="relative group/item overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    <img 
                      src={img} 
                      alt={`Variation ${idx + 1}`} 
                      className="w-full h-full object-contain" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVariation(img);
                        }}
                        className="p-2 bg-accent text-bg-primary rounded-lg hover:scale-110 transition-transform"
                        title="Select as Primary"
                      >
                        <Maximize2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = img;
                          link.download = `vector-variation-${idx + 1}-${Date.now()}.png`;
                          link.click();
                        }}
                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        title="Download Variation"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare(img);
                        }}
                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        title="Share Variation"
                      >
                        <Share size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white/60 uppercase tracking-widest border border-white/10">
                      Var_{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <img 
                  src={isHoldingCompare && uploadedImage ? uploadedImage : resultImage} 
                  alt="Result" 
                  className="max-w-full max-h-full h-auto object-contain bg-black/5 pointer-events-none select-none" 
                />
                
                {/* Comparison Indicator */}
                {uploadedImage && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono text-white/80 uppercase tracking-widest pointer-events-none border border-white/10">
                    {isHoldingCompare ? 'Original Reference' : 'Hold to Compare'}
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-700 flex flex-col justify-end p-8 md:p-12 backdrop-blur-[2px] pointer-events-none ${isHoldingCompare ? 'opacity-0' : 'opacity-0 group-hover/viewport:opacity-100'}`}>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-accent uppercase tracking-[0.4em] mb-2">Synthesis Complete</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tighter italic font-serif">
                      {selectedPreset?.name || 'Custom Construction'}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="upload-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onUploadClick}
            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all group relative z-10 ${uploadedImage ? 'bg-accent/5' : ''}`}
          >
            <input type="file" ref={fileInputRef} onChange={onFileUpload} accept="image/*" className="hidden" />
            
            {/* Camera Trigger */}
            {!uploadedImage && (
              <div className="absolute top-4 left-4 z-20 flex flex-col items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCameraClick();
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-bg-secondary backdrop-blur-md border border-border-primary rounded-2xl flex items-center justify-center text-text-primary hover:bg-accent hover:text-bg-primary transition-all shadow-xl group/cam ring-4 ring-accent/5"
                  title="Open Camera"
                >
                  <Camera size={22} className="group-hover/cam:scale-110 transition-transform" />
                </button>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent/60 group-hover/cam:text-accent transition-colors">Camera</span>
              </div>
            )}

            {uploadedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={uploadedImage} alt="Reference" className="max-w-full max-h-full h-auto object-contain opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-primary/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-2xl shadow-accent/40 scale-110 transition-transform">
                    <ImageIcon size={24} className="md:w-8 md:h-8" />
                  </div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent">Reference Locked</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 group-hover:scale-105 transition-transform duration-500">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] bg-bg-primary border border-border-primary flex items-center justify-center mx-auto shadow-inner group-hover:border-accent transition-colors relative overflow-hidden">
                  <Upload className="text-accent relative z-10 w-6 h-6 md:w-8 md:h-8" />
                  <motion.div 
                    animate={{ y: [-40, 40] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-accent/10 h-1 w-full blur-[2px]"
                  />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.3em]">Awaiting Synthesis</h3>
                  <p className="text-[8px] md:text-[10px] font-mono opacity-40 mt-2 uppercase tracking-widest">Drop Reference or Click to Upload</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
