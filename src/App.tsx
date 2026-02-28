/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { 
  Upload, 
  Type as TypeIcon, 
  PenTool, 
  Sparkles, 
  Download, 
  Loader2, 
  Image as ImageIcon,
  X,
  Layers,
  Moon,
  Sun,
  Zap,
  Maximize2,
  MousePointer2,
  Settings,
  Trash2,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  Aperture,
  Cpu,
  Cloud,
  Save,
  MessageCircle,
  Camera,
  User,
  Palette
} from 'lucide-react';
import { VECTOR_PRESETS, TYPOGRAPHY_PRESETS, Preset, PresetCategory } from './presets';
import { COLOR_PALETTES, ColorPalette } from './colorPalettes';

import { analyzeImage, generateVisual, describeImageSubject } from './services/geminiService';
import { generateImage } from './services/imageService';
import { getModule } from './modules';
import { modelRegistry, ImageModel } from './services/modelRegistry';
import LightningBolt from './components/LightningBolt';
import { resizeImage } from './services/imageUtils';
import { ChatPanel } from './components/ChatPanel';
import { CameraModal } from './components/CameraModal';
import { PresetPanel } from './components/PresetPanel';
import { LOGO_PRESETS } from './modules/LogoModule';
import { PullToRefresh } from './components/PullToRefresh';

const SettingsPanel = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const PresetPreview = lazy(() => import('./components/PresetPreview').then(m => ({ default: m.PresetPreview })));
const LogsPanel = lazy(() => import('./components/LogsPanel').then(m => ({ default: m.LogsPanel })));
const GalleryPanel = lazy(() => import('./components/GalleryPanel').then(m => ({ default: m.GalleryPanel })));

type Tab = 'vectorize' | 'core lettering' | 'logo design' | 'image analyzer' | 'chat';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  timestamp: string;
}

const MODEL_OPTIONS: { id: ImageModel; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'gemini', label: modelRegistry['gemini'].label, icon: Sparkles, color: 'text-blue-400' },
  { id: 'seedream-5.0', label: modelRegistry['seedream-5.0'].label, icon: Zap, color: 'text-yellow-500' },
  { id: 'seedream-4.5', label: modelRegistry['seedream-4.5'].label, icon: Zap, color: 'text-yellow-500' },
  { id: 'seedream-4.0', label: modelRegistry['seedream-4.0'].label, icon: Zap, color: 'text-yellow-500' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('vectorize');
  const [userInput, setUserInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [selectedModel, setSelectedModel] = useState<ImageModel>('gemini');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [usedPresets, setUsedPresets] = useState<Set<string>>(new Set());
  const [generationCount, setGenerationCount] = useState(0);
  const [isStrictModeEnabled, setIsStrictModeEnabled] = useState(false);
  const [isIllustrated, setIsIllustrated] = useState(false);
  const [isSubjectOnly, setIsSubjectOnly] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isHoldingCompare, setIsHoldingCompare] = useState(false);
  const [userPresets, setUserPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('userPresets');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('galleryImages');
    return saved ? JSON.parse(saved) : [];
  });
  const [lightningBolts, setLightningBolts] = useState<Array<{ id: string; x: number; y: number; color: string; coreColor?: string; initialAngle: number }>>([]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  // Multi-key Gemini Free Tier State
  const [geminiKeys, setGeminiKeys] = useState<string[]>(() => {
    const saved = localStorage.getItem('geminiKeys');
    return saved ? JSON.parse(saved) : [''];
  });
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(() => {
    const saved = localStorage.getItem('activeKeyIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Measure bottom navigation height for proper padding
  useEffect(() => {
    const updateBottomNavHeight = () => {
      const bottomNav = document.querySelector('nav.fixed.bottom-0');
      if (bottomNav) {
        setBottomNavHeight(bottomNav.clientHeight);
      }
    };
    
    updateBottomNavHeight();
    window.addEventListener('resize', updateBottomNavHeight);
    window.addEventListener('orientationchange', updateBottomNavHeight);
    
    return () => {
      window.removeEventListener('resize', updateBottomNavHeight);
      window.removeEventListener('orientationchange', updateBottomNavHeight);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('geminiKeys', JSON.stringify(geminiKeys));
  }, [geminiKeys]);

  useEffect(() => {
    localStorage.setItem('activeKeyIndex', activeKeyIndex.toString());
  }, [activeKeyIndex]);

  const getActiveGeminiKey = () => {
    const key = geminiKeys[activeKeyIndex];
    return key || process.env.GEMINI_API_KEY;
  };

  const getArkApiKey = () => {
    return localStorage.getItem('arkApiKey') || '';
  };

  const switchToNextKey = () => {
    const nextIndex = (activeKeyIndex + 1) % geminiKeys.length;
    if (nextIndex === 0 && !geminiKeys[0]) {
      return false;
    }
    setActiveKeyIndex(nextIndex);
    addLog(`Rate limit detected. Switching to Node_0${nextIndex + 1}...`, 'process');
    return true;
  };

  const handleRateLimit = () => {
    const switched = switchToNextKey();
    if (!switched) {
      addLog('All Gemini Free Tier Nodes exhausted. Please update API keys in settings.', 'error');
      setShowSettings(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true }).catch(console.error);
      StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light }).catch(console.error);
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('userPresets', JSON.stringify(userPresets));
  }, [userPresets]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev.slice(-19), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('System logs cleared', 'success');
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    clearLogs();
    addLog('VΞCTOR Engine Initialized', 'success');
    addLog('Mode: Free Tier / Image Generation Only', 'info');
    addLog('Awaiting visual directives...', 'info');

    const strikeInterval = setInterval(() => {
      const edge = Math.floor(Math.random() * 4);
      let startX, startY, initialAngle;
      
      if (edge === 0) {
        startX = Math.random() * window.innerWidth;
        startY = 0;
        initialAngle = 180;
      } else if (edge === 1) {
        startX = window.innerWidth;
        startY = Math.random() * window.innerHeight;
        initialAngle = 270;
      } else if (edge === 2) {
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight;
        initialAngle = 0;
      } else {
        startX = 0;
        startY = Math.random() * window.innerHeight;
        initialAngle = 90;
      }

      const color = isDarkMode ? '#CCFF00' : '#000000';
      const coreColor = isDarkMode ? '#000000' : '#000000';
      const id = Math.random().toString(36).substring(2, 9);
      
      const strikes = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < strikes; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 50;
          const offsetY = (Math.random() - 0.5) * 50;
          const idSub = `${id}-${i}`;
          setLightningBolts(prev => [...prev, { 
            id: idSub, 
            x: startX + offsetX, 
            y: startY + offsetY, 
            color,
            coreColor,
            initialAngle 
          }]);
        }, i * 50);
      }
    }, Math.random() * 2000 + 8000);

    return () => clearInterval(strikeInterval);
  }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleModelChange = (modelId: ImageModel) => {
    if (activeTab === 'logo design' && modelId !== 'gemini') {
      addLog('Logo Design optimized for Gemini 2.5 Flash. Other models may hallucinate text.', 'info');
    }
    setSelectedModel(modelId);
    const modelName = MODEL_OPTIONS.find(m => m.id === modelId)?.label || modelId;
    addLog(`Engine switched to: ${modelName}`, 'info');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    addLog(`Module activated: ${tab.toUpperCase()}`, 'info');
    if (!(activeTab === 'image analyzer' && tab === 'vectorize')) {
      setSelectedPreset(null);
    }

    if (tab === 'core lettering') {
      setSelectedModel('seedream-4.5');
      addLog(`Engine optimized for: Typography Art`, 'info');
      
      if (TYPOGRAPHY_PRESETS.length > 0 && TYPOGRAPHY_PRESETS[0].presets.length > 0) {
        setSelectedPreset(TYPOGRAPHY_PRESETS[0].presets[0]);
      }
    } else if (tab === 'logo design') {
      setSelectedModel('gemini');
      addLog(`Engine optimized for: Logo Design`, 'info');

      if (LOGO_PRESETS.length > 0 && LOGO_PRESETS[0].presets.length > 0) {
        setSelectedPreset(LOGO_PRESETS[0].presets[0]);
      }
    } else if (tab === 'vectorize') {
      setSelectedModel('gemini');
    }
    setResultImage(null);
    setError(null);
  };

  useEffect(() => {
    if (activeTab === 'vectorize' && selectedModel !== 'gemini') {
      setSelectedModel('gemini');
    } else if (activeTab === 'core lettering' && !selectedModel.startsWith('seedream')) {
      setSelectedModel('seedream-4.5');
    } else if (activeTab === 'image analyzer' && selectedModel !== 'gemini') {
      setSelectedModel('gemini');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const resized = await resizeImage(reader.result as string, 1024);
          setUploadedImage(resized);
          setUploadedMimeType('image/jpeg');
        } catch (err) {
          setUploadedImage(reader.result as string);
          setUploadedMimeType(file.type);
        }
        setError(null);
        setGenerationCount(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const resized = await resizeImage(reader.result as string, 1024);
          setUploadedImage(resized);
          setUploadedMimeType('image/jpeg');
        } catch (err) {
          setUploadedImage(reader.result as string);
          setUploadedMimeType(file.type);
        }
        setError(null);
        setGenerationCount(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAnalyze = async () => {
    if (!uploadedImage || !uploadedMimeType) return;
    setIsAnalyzing(true);
    setError(null);
    addLog('Initiating Visual DNA Extraction...', 'process');
    try {
      const preset = await analyzeImage(uploadedImage, uploadedMimeType, getActiveGeminiKey());
      
      const newPreset = { ...preset, name: `Style ${userPresets.length + 1}` };
      setUserPresets(prev => [newPreset, ...prev]);
      setSelectedPreset(newPreset);
      
      addLog(`Style identified: ${newPreset.name}`, 'success');
      addLog('Preset auto-saved to library', 'info');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        if (handleRateLimit()) {
          try {
            const preset = await analyzeImage(uploadedImage, uploadedMimeType, getActiveGeminiKey());
            const newPreset = { ...preset, name: `Style ${userPresets.length + 1}` };
            setUserPresets(prev => [newPreset, ...prev]);
            setSelectedPreset(newPreset);
            addLog(`Style identified: ${newPreset.name}`, 'success');
            return;
          } catch (retryErr) {
            console.error('Retry analysis failed:', retryErr);
          }
        }
      }
      
      let errorMessage = 'An unknown error occurred during analysis.';
      if (err.message) {
        if (err.message.includes('API key')) {
          errorMessage = 'Invalid or missing API key. Please check your settings.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      addLog(`Analysis failed: ${errorMessage}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPreset && activeTab !== 'vectorize') {
      setError('Please select a style preset first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    addLog('[PROCESS START] Synthesizing visual geometry... (ETA: 10-20s)', 'process');
    addLog(`Applying preset: ${selectedPreset?.name || 'Default'}`, 'info');
    
    try {
      const presetToUse = selectedPreset || {
        name: 'Default Vector',
        basePrompt: 'high quality vector art, clean lines, professional graphic design',
        aspectRatio: '1:1',
        negativePrompt: ''
      };

      let prompt = userInput || (activeTab === 'vectorize' ? 'vectorize this image' : 'Artistic Text');
      
      if (activeTab === 'core lettering' && userInput) {
        prompt = userInput.replace(/^"+|"+$/g, '');
      }
      
      const strictMode = isStrictModeEnabled || generationCount >= 2;

      if (strictMode && uploadedImage) {
        addLog('High Fidelity Mode Active: Prioritizing reference subject', 'info');
      }
      
      const currentModule = getModule(activeTab);
      const generationContext = {
        prompt,
        preset: presetToUse,
        base64Image: uploadedImage || undefined,
        mimeType: uploadedMimeType || undefined,
        strictMode,
        isIllustrated,
        isSubjectOnly
      };

      const skipTurbo = currentModule.shouldSkipTurbo(generationContext);

      let finalPrompt = currentModule.constructPrompt(generationContext);
      let finalNegativePrompt = currentModule.constructNegativePrompt 
        ? currentModule.constructNegativePrompt(generationContext)
        : presetToUse.negativePrompt;

      if (selectedPalette && selectedPalette.name !== 'Default') {
        finalPrompt += ` CRITICAL COLOR INSTRUCTION: Use exactly this color palette: ${selectedPalette.name} (${selectedPalette.colors.join(', ')}). Do NOT use any other colors.`;
        addLog(`Applying color palette: ${selectedPalette.name}`, 'info');
      }
      
      let result: string | null = null;
      
      if (selectedModel !== 'gemini' && !skipTurbo) {
        try {
          const engineName = MODEL_OPTIONS.find(m => m.id === selectedModel)?.label || selectedModel;
          if (selectedModel.startsWith('seedream')) {
            addLog(`Using ${engineName} Engine [ARK Optimized]...`, 'info');
          } else {
            addLog(`Using ${engineName} Engine...`, 'info');
          }
          
          let basePrompt = finalPrompt;
          if (uploadedImage && uploadedMimeType && activeTab !== 'core lettering' && activeTab !== 'logo design') {
             addLog('Analyzing image subject for vectorization...', 'process');
             try {
               const subjectDescription = await describeImageSubject(uploadedImage, uploadedMimeType);
               const poseConstraint = "CRITICAL: Maintain the EXACT original pose, position, and composition of the subject. Do NOT reposition. Apply style with minimal structural adjustment.";
               basePrompt = `${poseConstraint} Subject: ${subjectDescription}. ${finalPrompt}`;
               if (strictMode) {
                 basePrompt = `${poseConstraint} STRICTLY RECREATE this subject: ${subjectDescription}. ${finalPrompt}`;
               }
               addLog('Subject analysis complete.', 'success');
             } catch (descError) {
               console.error("Subject description failed", descError);
               addLog('Subject analysis failed, proceeding with text prompt only.', 'error');
             }
          }

          const enhancedPrompt = activeTab === 'core lettering' ? basePrompt : `${basePrompt}. Style: ${presetToUse.basePrompt}`;
          
          if (isBatchMode) {
            addLog('Batch Mode Active: Initiating 2x2 parallel synthesis...', 'process');
            const batchPromises = Array(4).fill(null).map((_, i) => {
              // Add slight variation to prompt for each batch item to get different results
              const variationPrompt = `${enhancedPrompt} (variation ${i + 1})`;
              return generateImage(variationPrompt, selectedModel, presetToUse.basePrompt, finalNegativePrompt, uploadedImage || undefined);
            });
            const batchResults = await Promise.all(batchPromises);
            setResultImage(batchResults);
            addLog('[PROCESS END] Batch synthesis complete. 4 variations rendered.', 'success');
            setIsGenerating(false);
            return;
          } else {
            result = await generateImage(enhancedPrompt, selectedModel, presetToUse.basePrompt, finalNegativePrompt, uploadedImage || undefined);
          }
        } catch (turboError: any) {
          console.error(`${selectedModel} failed`, turboError);
          addLog(`External Engine unavailable: ${turboError.message}`, 'error');
          addLog('Synthesis aborted. Please try again or select a different model.', 'error');
          setError(`Generation Failed: ${turboError.message}`);
          setIsGenerating(false);
          return;
        }
      } else if (skipTurbo && selectedModel !== 'gemini') {
        addLog(`${currentModule.name} Mode: Bypassing External Engines for direct image processing...`, 'info');
      }
      
      if (!result && (selectedModel === 'gemini' || skipTurbo)) {
        if (selectedModel === 'gemini') {
          addLog('Using Gemini Engine...', 'info');
        } else {
          addLog('Switching to Gemini for high-fidelity image processing...', 'info');
        }
        try {
          result = await generateVisual(
            finalPrompt, 
            presetToUse,
            uploadedImage || undefined,
            uploadedMimeType || undefined,
            activeTab,
            strictMode,
            getActiveGeminiKey(),
            finalNegativePrompt
          );
        } catch (geminiErr: any) {
          if (geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')) {
            if (handleRateLimit()) {
              result = await generateVisual(
                finalPrompt, 
                presetToUse,
                uploadedImage || undefined,
                uploadedMimeType || undefined,
                activeTab,
                strictMode,
                getActiveGeminiKey(),
                finalNegativePrompt
              );
            } else {
              throw geminiErr;
            }
          } else {
            throw geminiErr;
          }
        }
      }
      
      setResultImage(result);
      if (selectedPreset) {
        setUsedPresets(prev => new Set(prev).add(selectedPreset.name));
      }
      if (uploadedImage) {
        setGenerationCount(prev => prev + 1);
      }
      addLog('[PROCESS END] Synthesis complete. Image rendered.', 'success');
    } catch (err: any) {
      let errorMessage = 'An unknown error occurred during synthesis.';
      if (err.message) {
        if (err.message.includes('403') || err.message.includes('permission')) {
          errorMessage = 'Permission Denied. You may need to select a paid API key for this model.';
          if (window.aistudio) {
            window.aistudio.openSelectKey().catch(console.error);
          }
        } else if (err.message.includes('API key')) {
          errorMessage = 'Invalid or missing API key. Please check your settings.';
        } else if (err.message.includes('400')) {
          errorMessage = 'The model rejected the prompt. Try a different style or wording.';
        } else if (err.message.includes('500')) {
          errorMessage = 'The generation service is currently unavailable. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      addLog(`[PROCESS END] Synthesis failed: ${errorMessage}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToGallery = () => {
    if (!resultImage) return;
    
    if (Array.isArray(resultImage)) {
      const newImages = resultImage.filter(img => !galleryImages.includes(img));
      if (newImages.length === 0) {
        addLog('All variations already in gallery', 'info');
        return;
      }
      setGalleryImages(prev => [...newImages, ...prev]);
      addLog(`${newImages.length} variations saved to gallery`, 'success');
    } else {
      if (galleryImages.includes(resultImage)) {
        addLog('Image already in gallery', 'info');
        return;
      }
      setGalleryImages(prev => [resultImage, ...prev]);
      addLog('Image saved to gallery', 'success');
    }
  };

  const deleteFromGallery = (imageToDelete: string) => {
    setGalleryImages(prev => prev.filter(img => img !== imageToDelete));
    addLog('Image deleted from gallery', 'info');
  };

  const downloadImage = () => {
    if (!resultImage) return;
    if (Array.isArray(resultImage)) {
      resultImage.forEach((img, i) => {
        const link = document.createElement('a');
        link.href = img;
        link.download = `vector-variation-${i + 1}-${Date.now()}.png`;
        link.click();
      });
      addLog('Downloading all variations...', 'info');
    } else {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `vector-${Date.now()}.png`;
      link.click();
    }
  };

  const handleAppRefresh = async () => {
    addLog('System Refresh Initiated...', 'process');
    // Give it a moment to show the animation
    await new Promise(resolve => setTimeout(resolve, 800));
    window.location.reload();
  };

  let currentCategories: readonly PresetCategory[] = [];
  if (activeTab === 'vectorize') {
    currentCategories = VECTOR_PRESETS;
  } else if (activeTab === 'core lettering') {
    currentCategories = TYPOGRAPHY_PRESETS;
  } else if (activeTab === 'logo design') {
    currentCategories = LOGO_PRESETS;
  } else if (activeTab === 'image analyzer') {
    currentCategories = [{ category: 'User Library', presets: userPresets }];
  }

  return (
    <PullToRefresh onRefresh={handleAppRefresh}>
      <div 
        className="min-h-dvh flex flex-col overflow-x-hidden bg-bg-primary text-text-primary font-sans selection:bg-accent selection:text-bg-primary transition-colors duration-500 relative"
        onDrop={handleFileDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {lightningBolts.map(bolt => (
          <LightningBolt 
            key={bolt.id} 
            id={bolt.id} 
            x={bolt.x} 
            y={bolt.y} 
            color={bolt.color} 
            coreColor={bolt.coreColor}
            initialAngle={bolt.initialAngle}
            onRemove={(idToRemove) => setLightningBolts(prev => prev.filter(b => b.id !== idToRemove))} 
          />
        ))}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-accent/20 backdrop-blur-sm flex items-center justify-center pointer-events-none"
            >
              <div className="text-center text-accent font-bold uppercase tracking-[0.4em] p-8 bg-bg-primary/80 rounded-2xl border-2 border-dashed border-accent">
                Drop Image to Synthesize
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Navigation Bar */}
        <nav 
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
          className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary px-4 md:px-8 py-4 md:py-5 flex justify-between items-center transition-all"
        >
          <div className="flex items-center gap-3 md:gap-5">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-accent flex items-center justify-center shadow-xl shadow-accent/20"
            >
              <Zap className="text-bg-primary w-6 h-6 md:w-7 md:h-7 fill-current" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tighter uppercase leading-none">VΞCTOR</h1>
              <p className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] mt-1 md:mt-1.5">Monolithic Design System</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex gap-2 bg-bg-secondary p-1.5 border border-border-primary">
              {(['vectorize', 'core lettering', 'logo design', 'image analyzer', 'chat'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 lg:px-8 py-2.5 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-accent text-bg-primary shadow-lg shadow-accent/10' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                  }`}
                >
                  {tab === 'image analyzer' ? 'analyzer' : tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-bg-secondary border border-border-primary hover:border-accent transition-all duration-300 group"
            >
              <Settings size={18} className="text-accent group-hover:rotate-90 transition-transform" />
            </button>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border transition-all duration-300 group ${
                showLogs ? 'bg-accent border-accent' : 'bg-bg-secondary border-border-primary hover:border-accent'
              }`}
              title="System Logs"
            >
              <TerminalIcon size={18} className={`${showLogs ? 'text-bg-primary' : 'text-accent'} transition-colors`} />
            </button>
            <button
              onClick={() => setShowGallery(true)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-bg-secondary border border-border-primary hover:border-accent transition-all duration-300 group"
              title="Gallery"
            >
              <Layers size={18} className="text-accent" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-bg-secondary border border-border-primary hover:border-accent transition-all duration-300 group"
            >
              {isDarkMode ? <Sun size={18} className="text-accent group-hover:rotate-45 transition-transform" /> : <Moon size={18} className="text-accent group-hover:-rotate-12 transition-transform" />}
            </button>
          </div>
        </nav>

      <AnimatePresence>
        {showColorPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowColorPalette(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest">Choose Color Palette</h3>
                <button 
                  onClick={() => setShowColorPalette(false)}
                  className="p-2 hover:bg-bg-primary rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COLOR_PALETTES.map((palette, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPalette(palette);
                      setShowColorPalette(false);
                      addLog(`Selected palette: ${palette.name}`, 'info');
                    }}
                    className={`flex flex-col gap-2 p-3 rounded-xl border transition-all text-left ${selectedPalette?.name === palette.name ? 'border-accent bg-accent/5' : 'border-border-primary hover:border-accent/50 bg-bg-primary'}`}
                  >
                    <div className="flex w-full h-12 rounded-lg overflow-hidden">
                      {palette.colors.map((color, cIdx) => (
                        <div key={cIdx} className="flex-1 h-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm font-medium">{palette.name}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPalette?.name === palette.name ? 'border-accent bg-accent' : 'border-border-primary'}`}>
                        {selectedPalette?.name === palette.name && <CheckCircle2 size={12} className="text-bg-primary" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold">Clear Canvas?</h3>
              <p className="text-sm text-text-secondary mt-2 mb-6">This will remove the reference and generated images. This action cannot be undone.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearConfirm(false)} 
                  className="flex-1 py-2 px-4 rounded-lg bg-bg-primary border border-border-primary hover:border-accent transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setResultImage(null);
                    setUploadedImage(null);
                    setGenerationCount(0);
                    addLog('Canvas cleared', 'info');
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white hover:brightness-110 transition-all"
                >
                  Confirm & Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with dynamic bottom padding to account for mobile navigation */}
      <main 
        ref={mainRef}
        className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 transition-all duration-300 flex-1"
        style={{ 
          paddingBottom: `calc(${bottomNavHeight}px + 1rem + env(safe-area-inset-bottom))` 
        }}
      >
        <AnimatePresence mode="wait">
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <SettingsPanel 
                addLog={addLog}
                onClose={() => setShowSettings(false)}
                geminiKeys={geminiKeys}
                setGeminiKeys={setGeminiKeys}
                activeKeyIndex={activeKeyIndex}
                setActiveKeyIndex={setActiveKeyIndex}
                galleryImages={galleryImages}
                setGalleryImages={setGalleryImages}
                userPresets={userPresets}
                setUserPresets={setUserPresets}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <GalleryPanel 
                images={galleryImages}
                onClose={() => setShowGallery(false)}
                onDelete={deleteFromGallery}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showLogs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <LogsPanel 
                logs={logs}
                addLog={addLog}
                clearLogs={clearLogs}
                selectedModel={selectedModel}
                onClose={() => setShowLogs(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'chat' ? (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex justify-center py-4 md:py-8"
            >
              <ChatPanel 
                onClose={() => handleTabChange('vectorize')}
                addLog={addLog}
                apiKey={getArkApiKey()}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start"
            >
              {/* Unified Interaction Zone: Upload & Result */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full lg:flex-1 bg-bg-secondary border border-border-primary aspect-square lg:aspect-auto lg:h-[600px] xl:h-[700px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group/viewport order-1 transition-all duration-300"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(var(--border-primary) 1px, transparent 1px), linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.02] pointer-events-none" />
                
                {/* Model Engine Indicator */}
                <div className="absolute bottom-4 right-4 z-40 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className={`w-1.5 h-1.5 rounded-full ${MODEL_OPTIONS.find(m => m.id === selectedModel)?.color.replace('text-', 'bg-') || 'bg-accent'}`} />
                    <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
                      ENGINE: {MODEL_OPTIONS.find(m => m.id === selectedModel)?.label || selectedModel}
                    </span>
                  </div>
                </div>

                {/* Floating Utility Icons */}
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPalette(true);
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all shadow-lg"
                    title="Color Palette"
                  >
                    <Palette size={16} />
                  </button>
                  {(resultImage || uploadedImage) && !isGenerating && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (Array.isArray(resultImage)) {
                            resultImage.forEach((img, i) => {
                              const link = document.createElement('a');
                              link.href = img;
                              link.download = `vector-variation-${i + 1}-${Date.now()}.png`;
                              link.click();
                            });
                            addLog('Downloading all variations...', 'info');
                          } else {
                            const link = document.createElement('a');
                            link.href = resultImage || uploadedImage!;
                            link.download = resultImage ? `vector-${Date.now()}.png` : `reference-${Date.now()}.png`;
                            link.click();
                          }
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all shadow-lg"
                        title="Download Image"
                      >
                        <Download size={16} />
                      </button>
                      {resultImage && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            saveToGallery();
                          }}
                          className="w-8 h-8 md:w-10 md:h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-lg"
                          title="Save to Gallery"
                        >
                          <Save size={16} />
                        </button>
                      )}
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowClearConfirm(true);
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all shadow-lg"
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
                                    setResultImage(img);
                                    addLog(`Variation ${idx + 1} selected as primary.`, 'success');
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
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all group relative z-10 ${uploadedImage ? 'bg-accent/5' : ''}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                      
                      {/* Camera Trigger */}
                      {!uploadedImage && (
                        <div className="absolute top-4 left-4 z-20 flex flex-col items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCamera(true);
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

              {/* Synthesis Trigger: Full Width */}
              <div className="w-full flex-shrink-0 flex flex-col order-2 transition-all duration-300">
                {/* Toggles Row */}
                <div className="flex items-center justify-between px-6 py-3 mb-4 bg-bg-secondary border border-border-primary rounded-full shadow-lg">
                  {/* Strict Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsStrictModeEnabled(!isStrictModeEnabled)}
                      className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isStrictModeEnabled ? 'bg-accent' : 'bg-bg-secondary border border-border-primary'}`}
                      title="High Fidelity Tracking"
                    >
                      <motion.div 
                        animate={{ x: isStrictModeEnabled ? 16 : 2 }}
                        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isStrictModeEnabled ? 'bg-bg-primary' : 'bg-text-secondary'}`}
                      />
                    </button>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Hi-Fi</span>
                  </div>

                  {/* Illustrated Toggle */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsIllustrated(!isIllustrated)}
                      className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isIllustrated ? 'bg-purple-500' : 'bg-bg-secondary border border-border-primary'}`}
                      title="Illustrated Finish"
                    >
                      <motion.div 
                        animate={{ x: isIllustrated ? 16 : 2 }}
                        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isIllustrated ? 'bg-bg-primary' : 'bg-text-secondary'}`}
                      />
                    </button>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Illust</span>
                  </div>

                  {/* Subject Only Toggle */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsSubjectOnly(!isSubjectOnly)}
                      className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isSubjectOnly ? 'bg-green-500' : 'bg-bg-secondary border border-border-primary'}`}
                      title="Subject Isolation"
                    >
                      <motion.div 
                        animate={{ x: isSubjectOnly ? 16 : 2 }}
                        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isSubjectOnly ? 'bg-bg-primary' : 'bg-text-secondary'}`}
                      />
                    </button>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Subject</span>
                  </div>

                  {/* Batch Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsBatchMode(!isBatchMode)}
                      className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isBatchMode ? 'bg-orange-500' : 'bg-bg-secondary border border-border-primary'}`}
                      title="2x2 Batch Synthesis"
                    >
                      <motion.div 
                        animate={{ x: isBatchMode ? 16 : 2 }}
                        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${isBatchMode ? 'bg-bg-primary' : 'bg-text-secondary'}`}
                      />
                    </button>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Batch</span>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-bg-secondary border border-border-primary rounded-[32px] overflow-hidden shadow-xl"
                >
                  {/* Top: Input Area */}
                  <div className="relative group border-b border-border-primary">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="ENTER VISUAL DIRECTIVES..."
                      className="w-full bg-bg-secondary p-6 pb-16 text-sm font-mono uppercase tracking-widest focus:outline-none resize-none h-32 lg:h-[400px] xl:h-[500px] placeholder:opacity-30 relative z-10 transition-all duration-300"
                    />
                    <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
                      {userInput && (
                        <button 
                          onClick={() => setUserInput('')}
                          className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    </div>

                    {/* Model Selector */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                      {MODEL_OPTIONS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelChange(model.id)}
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
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Action Bar */}
                  <div className="flex">
                    {activeTab === 'image analyzer' && uploadedImage && (
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex-1 bg-bg-secondary text-text-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-bg-primary transition-all border-r border-border-primary"
                      >
                        {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={14} className="text-accent" />}
                        Extract DNA
                      </button>
                    )}

                    
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || (activeTab !== 'vectorize' && activeTab !== 'logo design' && !selectedPreset)}
                      className="flex-[2] bg-accent text-bg-primary py-4 text-sm font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap size={20} className="fill-current" />}
                      {isGenerating ? 'Synthesizing' : 'Initiate Synthesis'}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Library: Presets at Bottom */}
        <AnimatePresence>
          {activeTab !== 'chat' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <PresetPanel
                categories={currentCategories}
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
                previewCategory={
                  activeTab === 'core lettering' ? 'lettering' :
                  activeTab === 'logo design' ? 'logo design' :
                  'vector'
                }
                usedPresets={usedPresets}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-t border-border-primary px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex justify-around items-center md:hidden">
        {(['vectorize', 'core lettering', 'logo design', 'image analyzer', 'chat'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab === 'vectorize' && <ImageIcon size={20} className="mb-1" />}
            {tab === 'core lettering' && <TypeIcon size={20} className="mb-1" />}
            {tab === 'logo design' && <Aperture size={20} className="mb-1" />}
            {tab === 'image analyzer' && <Sparkles size={20} className="mb-1" />}
            {tab === 'chat' && <MessageCircle size={20} className="mb-1" />}
            {tab === 'core lettering' ? 'Lettering' : tab === 'image analyzer' ? 'Analyzer' : tab === 'logo design' ? 'Logo' : tab}
          </button>
        ))}
      </nav>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <X size={18} onClick={() => setError(null)} className="cursor-pointer" />
            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <CameraModal 
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(imageData) => {
          setUploadedImage(imageData);
          setUploadedMimeType('image/jpeg');
          addLog('Visual captured via camera.', 'success');
        }}
      />
      </div>
    </PullToRefresh>
  );
}
