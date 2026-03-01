import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Trash2, ZoomIn, Layers, Share } from 'lucide-react';

interface GalleryPanelProps {
  images: string[];
  onClose: () => void;
  onDelete: (image: string) => void;
}

export const GalleryPanel: React.FC<GalleryPanelProps> = ({ images, onClose, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (image: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `gallery-image-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async (image: string) => {
    try {
      const blob = await fetch(image).then(r => r.blob());
      const file = new File([blob], 'gallery-image.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'VΞCTOR Gallery Asset',
          text: 'Check out this visual asset from my gallery!'
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl h-[85vh] bg-bg-secondary border border-border-primary rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-secondary z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Layers size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Image Gallery</h2>
            <p className="text-[9px] font-mono uppercase tracking-widest opacity-40 mt-1">Stored Visual Assets</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg-primary">
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            Your gallery is empty. Save generated images to see them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square bg-bg-primary rounded-lg overflow-hidden relative group"
              >
                <img src={img} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setSelectedImage(img)} className="w-10 h-10 bg-black/70 rounded-full text-white hover:bg-accent hover:text-black flex items-center justify-center">
                    <ZoomIn size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-bg-primary/80 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage} alt="Selected" className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-2xl" />
              <div className="absolute -top-12 right-0 flex gap-2">
                 <button onClick={() => handleDownload(selectedImage)} className="w-10 h-10 bg-black/70 rounded-full text-white hover:bg-accent hover:text-black flex items-center justify-center">
                    <Download size={20} />
                  </button>
                 <button onClick={() => handleShare(selectedImage)} className="w-10 h-10 bg-black/70 rounded-full text-white hover:bg-accent hover:text-black flex items-center justify-center">
                    <Share size={20} />
                  </button>
                 <button onClick={() => { onDelete(selectedImage); setSelectedImage(null); }} className="w-10 h-10 bg-black/70 rounded-full text-white hover:bg-red-500 flex items-center justify-center">
                    <Trash2 size={20} />
                  </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
