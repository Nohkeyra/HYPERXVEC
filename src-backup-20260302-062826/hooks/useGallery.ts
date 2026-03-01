import { useState, useEffect } from 'react';

export function useGallery(addLog: (msg: string, type?: any) => void) {
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('galleryImages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const saveToGallery = (image: string | string[] | null) => {
    if (!image) return;
    
    if (Array.isArray(image)) {
      setGalleryImages(prev => [...image, ...prev].slice(0, 100));
      addLog(`Saved ${image.length} variations to gallery`, 'success');
    } else {
      setGalleryImages(prev => [image, ...prev].slice(0, 100));
      addLog('Image saved to gallery', 'success');
    }
  };

  const deleteFromGallery = (image: string) => {
    setGalleryImages(prev => prev.filter(img => img !== image));
    addLog('Image removed from gallery', 'info');
  };

  return { galleryImages, setGalleryImages, saveToGallery, deleteFromGallery };
}
