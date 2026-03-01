import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = React.memo(({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [showFlashEffect, setShowFlashEffect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode,
          width: { ideal: 1920 }, // 1080p
          height: { ideal: 1080 }
        },
        audio: false 
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch/flash support
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      setHasFlash(!!capabilities.torch);

    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure permissions are granted.');
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !isFlashOn }]
      } as any);
      setIsFlashOn(!isFlashOn);
    } catch (err) {
      console.error('Error toggling flash:', err);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!stream || isCapturing || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Ensure video is actually playing and has dimensions
    if (video.readyState < 2 || video.videoWidth === 0) {
      console.warn('Video not ready for capture');
      return;
    }

    setIsCapturing(true);
    setShowFlashEffect(true);
    setTimeout(() => setShowFlashEffect(false), 150);

    try {
      // Use Canvas for capture - more reliable across browsers for this use case
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });

        if (context) {
          // Set canvas dimensions to match video source resolution
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the current frame
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to high-quality JPEG (usually smaller and faster than PNG)
          const imageData = canvas.toDataURL('image/jpeg', 0.95);
          
          // Small delay to ensure state updates don't collide with modal closing
          setTimeout(() => {
            onCapture(imageData);
            onClose();
          }, 50);
        }
      }
    } catch (err) {
      console.error('Capture failed:', err);
      setError('Capture failed. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-xl aspect-[3/4] md:aspect-video bg-bg-secondary rounded-[32px] overflow-hidden border border-border-primary shadow-2xl flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center bg-gradient-to-b from-bg-primary/80 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center backdrop-blur-md border border-border-primary">
                  <Camera size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary">Visual Capture</h2>
                  <p className="text-[8px] font-mono opacity-60 uppercase tracking-widest text-text-secondary">Direct Synthesis Input</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-bg-primary/40 hover:bg-bg-primary/60 flex items-center justify-center text-text-primary transition-colors backdrop-blur-md border border-border-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Viewport */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              {error ? (
                <div className="text-center p-8">
                  <p className="text-red-500 text-sm font-mono uppercase tracking-widest mb-4">{error}</p>
                  <button 
                    onClick={startCamera}
                    className="px-6 py-3 bg-accent text-bg-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={14} /> Retry
                  </button>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Flash Effect Overlay */}
                  <AnimatePresence>
                    {showFlashEffect && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-50"
                      />
                    )}
                  </AnimatePresence>

                  {/* Viewport Overlay */}
                  <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
                    <div className="w-full h-full border border-white/20 relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent" />
                      
                      {/* Center Crosshair */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-accent/40 rounded-full" />
                    </div>
                  </div>

                  {/* Camera Info Overlay */}
                  <div className="absolute bottom-4 left-6 flex flex-col gap-1 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Live_Feed_Uplink</span>
                    </div>
                    {stream && (
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
                        {stream.getVideoTracks()[0].getSettings().width}x{stream.getVideoTracks()[0].getSettings().height} @ {Math.round(stream.getVideoTracks()[0].getSettings().frameRate || 0)}FPS
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="p-8 bg-bg-secondary flex justify-between items-center shrink-0 px-12">
              <button
                onClick={toggleCamera}
                className="w-12 h-12 rounded-full bg-bg-primary/40 flex items-center justify-center text-text-primary border border-border-primary hover:bg-bg-primary transition-colors"
                title="Switch Camera"
              >
                <RefreshCw size={20} />
              </button>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={captureImage}
                  disabled={!stream || isCapturing}
                  className="group relative w-20 h-20 rounded-full border-4 border-accent p-1 transition-transform active:scale-90 disabled:opacity-50"
                  id="camera-capture-button"
                >
                  <div className="w-full h-full rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] group-hover:brightness-110 transition-all">
                    <Zap size={32} className="text-bg-primary fill-current" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border border-accent/20 animate-ping opacity-20" />
                </button>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent animate-pulse">Capture</span>
              </div>

              <button
                onClick={toggleFlash}
                disabled={!hasFlash}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                  isFlashOn 
                    ? 'bg-accent border-accent text-bg-primary' 
                    : 'bg-bg-primary/40 border-border-primary text-text-primary hover:bg-bg-primary'
                } disabled:opacity-20`}
                title="Toggle Flash"
              >
                <Zap size={20} className={isFlashOn ? 'fill-current' : ''} />
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
