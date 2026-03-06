/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, Suspense, lazy, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { 
  Sparkles, 
  X
} from 'lucide-react';
import { NvidiaIcon, BytePlusIcon } from './components/icons/ModelIcons';

// Presets & Constants
import { VECTOR_PRESETS, TYPOGRAPHY_PRESETS, Preset, PresetCategory } from './presets';
import { ColorPalette } from './colorPalettes';
import { LOGO_PRESETS } from './modules/LogoModule';
import { modelRegistry, ImageModel } from './services/modelRegistry';

// Services & Utils
import { analyzeImage, describeImageSubject, generateVisual } from './services/geminiService';
import { generateImage } from './services/imageService';
import { getModule } from './modules';
import { formatForGeminiAttention, formatForSDAttention } from './utils/promptUtils';
import { resizeImage } from './services/imageUtils';
import { playClickSound, playGenerateSound, playSuccessSound } from './utils/soundUtils';
import { initHighResAssets } from './assets/HighResAssets';

// Components
import LightningBolt from './components/LightningBolt';
import { ChatPanel } from './components/ChatPanel';
import { CameraModal } from './components/CameraModal';
import { PresetPanel } from './components/PresetPanel';
import { PullToRefresh } from './components/PullToRefresh';
import { HistoryPanel } from './components/HistoryPanel';
import { AppHeader } from './components/AppHeader';
import { AppNavigation } from './components/AppNavigation';
import { Viewport } from './components/Viewport';
import { SynthesisControls } from './components/SynthesisControls';

// Hooks
import { useLogs } from './hooks/useLogs';
import { useHistory } from './hooks/useHistory';
import { useGallery } from './hooks/useGallery';
import { useLightningBolts } from './hooks/useLightningBolts';
import { useGeminiKeys } from './hooks/useGeminiKeys';

const SettingsPanel = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const LogsPanel = lazy(() => import('./components/LogsPanel').then(m => ({ default: m.LogsPanel })));
const GalleryPanel = lazy(() => import('./components/GalleryPanel').then(m => ({ default: m.GalleryPanel })));

type Tab = 'vectorize' | 'core lettering' | 'logo design' | 'image analyzer' | 'chat';

const MODEL_OPTIONS: { id: ImageModel; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'gemini', label: modelRegistry['gemini'].label, icon: Sparkles, color: 'text-blue-400' },
  { id: 'seedream-4.5', label: modelRegistry['seedream-4.5'].label, icon: BytePlusIcon, color: 'text-indigo-400' },
  { id: 'seedream-4.0', label: modelRegistry['seedream-4.0'].label, icon: BytePlusIcon, color: 'text-indigo-400' },
];

export default function App() {
  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('vectorize');
  const [userInput, setUserInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [selectedModel, setSelectedModel] = useState<ImageModel>('gemini');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isStrictModeEnabled, setIsStrictModeEnabled] = useState(false);
  const [isIllustrated, setIsIllustrated] = useState(false);
  const [isSubjectOnly, setIsSubjectOnly] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isHoldingCompare, setIsHoldingCompare] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [usedPresets, setUsedPresets] = useState<Set<string>>(new Set());
  const [userPresets, setUserPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('userPresets');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom Hooks
  const { logs, addLog, clearLogs, logEndRef } = useLogs();
  const { history, addToHistory, clearHistory } = useHistory(addLog);
  const { galleryImages, setGalleryImages, saveToGallery, deleteFromGallery } = useGallery(addLog);
  const { lightningBolts, setLightningBolts } = useLightningBolts(isDarkMode);
  const { geminiKeys, setGeminiKeys, activeKeyIndex, setActiveKeyIndex, getActiveGeminiKey, switchToNextKey } = useGeminiKeys(addLog);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effects
  useEffect(() => {
    initHighResAssets();
    clearLogs();
    addLog('VΞCTOR Engine Initialized', 'success');
    addLog('System Version: 1.4 (Free Tier Build)', 'info');
    addLog('Mode: Free Tier / Image Generation Only', 'info');
    addLog('Awaiting visual directives...', 'info');
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true }).catch(console.error);
      StatusBar.setStyle({ style: isDarkMode ? Style.Dark : Style.Light }).catch(console.error);
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('userPresets', JSON.stringify(userPresets));
  }, [userPresets]);

  // Handlers
  const handleRateLimit = useCallback(() => {
    const switched = switchToNextKey();
    if (!switched) {
      addLog('All Gemini Free Tier Nodes exhausted. Please update API keys in settings.', 'error');
      setShowSettings(true);
      return false;
    }
    return true;
  }, [switchToNextKey, addLog]);

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

  const handleAnalyze = async () => {
    if (!uploadedImage || !uploadedMimeType) return;
    setIsAnalyzing(true);
    setError(null);
    addLog('Initiating Visual DNA Extraction...', 'process');
    try {
      const preset = await analyzeImage(uploadedImage, uploadedMimeType, activeTab, getActiveGeminiKey());
      const newPreset = { ...preset, name: `Style ${userPresets.length + 1}` };
      setUserPresets(prev => [newPreset, ...prev]);
      setSelectedPreset(newPreset);
      addLog(`Style identified: ${newPreset.name}`, 'success');
      addLog('Preset auto-saved to library', 'info');
    } catch (err: any) {
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        if (handleRateLimit()) {
          return handleAnalyze();
        }
      }
      setError(err.message || 'Analysis failed');
      addLog(`Analysis failed: ${err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedPreset && activeTab !== 'vectorize') {
      setError('Please select a style preset first.');
      return;
    }

    playGenerateSound();
    setIsGenerating(true);
    setError(null);
    addLog('[PROCESS START] Synthesizing visual geometry... (ETA: 15-45s)', 'process');
    
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
      const currentModule = getModule(activeTab);
      const generationContext = {
        prompt,
        preset: presetToUse,
        base64Image: uploadedImage || undefined,
        mimeType: uploadedMimeType || undefined,
        strictMode,
        isIllustrated,
        isSubjectOnly,
        selectedPalette
      };

      // API Key Checks
      if (selectedModel.startsWith('seedream') && !localStorage.getItem('arkApiKey')) {
        throw new Error('BytePlus API Key Required. Please configure it in Settings > Node_02.');
      }

      let finalPrompt = currentModule.constructPrompt(generationContext);
      
      // Apply attention mechanisms based on the selected model
      if (selectedModel === 'gemini') {
        finalPrompt = formatForGeminiAttention(finalPrompt);
      } else {
        finalPrompt = formatForSDAttention(finalPrompt);
      }

      let finalNegativePrompt = currentModule.constructNegativePrompt 
        ? currentModule.constructNegativePrompt(generationContext)
        : presetToUse.negativePrompt;
      
      let result: string | string[] | null = null;
      
      if (selectedModel !== 'gemini') {
        const engineName = MODEL_OPTIONS.find(m => m.id === selectedModel)?.label || selectedModel;
        addLog(`Using ${engineName} Engine...`, 'info');
        
        let basePrompt = finalPrompt;
        if (uploadedImage && uploadedMimeType && activeTab !== 'core lettering' && activeTab !== 'logo design') {
          const geminiKey = getActiveGeminiKey();
          if (geminiKey) {
            addLog('Analyzing image subject for vectorization...', 'process');
            const subjectDescription = await describeImageSubject(uploadedImage, uploadedMimeType, geminiKey);
            const poseConstraint = "CRITICAL: Maintain the EXACT original pose, position, and composition of the subject. Do NOT reposition. Apply style with minimal structural adjustment.";
            basePrompt = `${poseConstraint} Subject: ${subjectDescription}. ${finalPrompt}`;
            if (strictMode) basePrompt = `${poseConstraint} STRICTLY RECREATE this subject: ${subjectDescription}. ${finalPrompt}`;
            addLog('Subject analysis complete.', 'success');
          }
        }

        // Modules construct the full prompt including style, so we don't need to append it again.
        const enhancedPrompt = basePrompt;
        
        if (isBatchMode) {
          addLog('Batch Mode Active: Initiating 2x2 parallel synthesis...', 'process');
          const batchPromises = Array(4).fill(null).map((_, i) => 
            // Pass empty string for presetBasePrompt as it's already baked into enhancedPrompt
            generateImage(`${enhancedPrompt} (variation ${i + 1})`, selectedModel, "", finalNegativePrompt, uploadedImage || undefined)
          );
          result = await Promise.all(batchPromises);
          result.forEach((img, i) => addToHistory(img, `${prompt} (v${i+1})`, presetToUse.name));
          addLog('[PROCESS END] Batch synthesis complete.', 'success');
        } else {
          // Pass empty string for presetBasePrompt as it's already baked into enhancedPrompt
          result = await generateImage(enhancedPrompt, selectedModel, "", finalNegativePrompt, uploadedImage || undefined);
          addToHistory(result, prompt, presetToUse.name);
        }
      } else {
        addLog('Using Gemini Engine...', 'info');
        try {
          result = await generateVisual(finalPrompt, presetToUse, uploadedImage || undefined, uploadedMimeType || undefined, activeTab, strictMode, getActiveGeminiKey(), finalNegativePrompt);
          if (result) addToHistory(result, prompt, presetToUse.name);
        } catch (geminiErr: any) {
          if (geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')) {
            if (handleRateLimit()) return handleGenerate();
          }
          throw geminiErr;
        }
      }
      
      setResultImage(result);
      if (selectedPreset) setUsedPresets(prev => new Set(prev).add(selectedPreset.name));
      if (uploadedImage) setGenerationCount(prev => prev + 1);
      addLog('[PROCESS END] Synthesis complete.', 'success');
      playSuccessSound();
    } catch (err: any) {
      if (err.message && err.message.includes('failed to connect to websocket')) {
        // Suppress benign Vite HMR errors
        return;
      }
      setError(err.message);
      addLog(`Synthesis failed: ${err.message}`, 'error');
      if (err.message.includes('API key') || err.message.includes('Required')) setShowSettings(true);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPreset, activeTab, userInput, isStrictModeEnabled, generationCount, uploadedImage, uploadedMimeType, isIllustrated, isSubjectOnly, selectedPalette, selectedModel, isBatchMode, getActiveGeminiKey, handleRateLimit, addToHistory, addLog]);

  const handleModelChange = useCallback((modelId: ImageModel) => {
    if (modelId === 'gemini' && typeof window !== 'undefined' && window.aistudio) {
      window.aistudio.hasSelectedApiKey().then(hasKey => {
        if (!hasKey) {
          window.aistudio.openSelectKey().catch(console.error);
        }
      });
    }
    setSelectedModel(modelId);
    addLog(`Engine switched to: ${modelRegistry[modelId].label}`, 'info');
  }, [addLog]);

  const handleTabChange = (tab: Tab) => {
    playClickSound();
    setActiveTab(tab);
    addLog(`Module activated: ${tab.toUpperCase()}`, 'info');
    if (!(activeTab === 'image analyzer' && tab === 'vectorize')) setSelectedPreset(null);
    setResultImage(null);
    setError(null);
  };

  const handleAppRefresh = async () => {
    addLog('System Refresh Initiated...', 'process');
    await new Promise(resolve => setTimeout(resolve, 800));
    window.location.reload();
  };

  const currentCategories: readonly PresetCategory[] = 
    activeTab === 'vectorize' ? [...VECTOR_PRESETS, { category: 'User Library', presets: userPresets }] :
    activeTab === 'core lettering' ? [...TYPOGRAPHY_PRESETS, { category: 'User Library', presets: userPresets }] :
    activeTab === 'logo design' ? [...LOGO_PRESETS, { category: 'User Library', presets: userPresets }] :
    activeTab === 'image analyzer' ? [{ category: 'User Library', presets: userPresets }] : [];

  return (
    <PullToRefresh onRefresh={handleAppRefresh}>
      <div className="min-h-dvh flex flex-col overflow-x-hidden bg-bg-primary text-text-primary font-sans selection:bg-accent selection:text-bg-primary transition-colors duration-500 relative">
        {lightningBolts.map(bolt => (
          <LightningBolt 
            key={bolt.id} id={bolt.id} x={bolt.x} y={bolt.y} color={bolt.color} coreColor={bolt.coreColor} initialAngle={bolt.initialAngle}
            onRemove={(id) => setLightningBolts(prev => prev.filter(b => b.id !== id))} 
          />
        ))}

        <main className="flex-1 container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-32 relative z-10">
          <AppHeader 
            isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowSettings={setShowSettings} setShowLogs={setShowLogs} 
            setShowHistory={setShowHistory} setShowGallery={setShowGallery} setShowCamera={setShowCamera} generationCount={generationCount}
          />

          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div key="chat-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex justify-center py-4 md:py-8">
                <ChatPanel onClose={() => handleTabChange('vectorize')} addLog={addLog} apiKey={localStorage.getItem('arkApiKey') || '68c4b074-d2ee-4465-9de5-6d5f83f80b53'} />
              </motion.div>
            ) : (
              <motion.div key="main-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                <Viewport 
                  isGenerating={isGenerating} resultImage={resultImage} uploadedImage={uploadedImage} selectedModel={selectedModel} modelOptions={MODEL_OPTIONS}
                  selectedPreset={selectedPreset} isHoldingCompare={isHoldingCompare} setIsHoldingCompare={setIsHoldingCompare}
                  onDownload={() => {
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
                  }} 
                  onSaveToGallery={() => saveToGallery(resultImage)} 
                  onShare={async (img) => {
                    const imgToShare = img || (Array.isArray(resultImage) ? resultImage[0] : resultImage);
                    if (!imgToShare) return;
                    try {
                      const blob = await fetch(imgToShare).then(r => r.blob());
                      const file = new File([blob], 'synthesis.png', { type: 'image/png' });
                      if (navigator.share) {
                        await navigator.share({
                          files: [file],
                          title: 'VΞCTOR Synthesis',
                          text: 'Check out this vector synthesis I generated!'
                        });
                      } else {
                        addLog('Sharing not supported on this browser.', 'error');
                      }
                    } catch (err) {
                      console.error('Share failed', err);
                    }
                  }} 
                  onClear={() => {setUploadedImage(null); setResultImage(null); addLog('Canvas cleared.', 'info');}}
                  onSelectVariation={(img) => {setResultImage(img); addLog('Variation selected as primary.', 'success');}} 
                  onUploadClick={() => fileInputRef.current?.click()} onCameraClick={() => setShowCamera(true)}
                  onColorPaletteClick={() => setShowColorPalette(true)} onFileUpload={handleFileUpload} fileInputRef={fileInputRef}
                />
                <SynthesisControls 
                  userInput={userInput} setUserInput={setUserInput} selectedModel={selectedModel} onModelChange={handleModelChange} modelOptions={MODEL_OPTIONS}
                  isGenerating={isGenerating} isAnalyzing={isAnalyzing} onGenerate={handleGenerate} onAnalyze={handleAnalyze} activeTab={activeTab}
                  uploadedImage={uploadedImage} selectedPreset={selectedPreset} isStrictModeEnabled={isStrictModeEnabled} setIsStrictModeEnabled={setIsStrictModeEnabled}
                  isIllustrated={isIllustrated} setIsIllustrated={setIsIllustrated} isSubjectOnly={isSubjectOnly} setIsSubjectOnly={setIsSubjectOnly}
                  isBatchMode={isBatchMode} setIsBatchMode={setIsBatchMode}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab !== 'chat' && (
            <PresetPanel categories={currentCategories} selectedPreset={selectedPreset} onSelectPreset={setSelectedPreset} usedPresets={usedPresets}
              previewCategory={activeTab === 'core lettering' ? 'lettering' : activeTab === 'logo design' ? 'logo design' : 'vector'}
            />
          )}
        </main>

        <AppNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
              <X size={18} onClick={() => setError(null)} className="cursor-pointer" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={null}>
          {showSettings && (
            <div className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4">
              <SettingsPanel 
                onClose={() => setShowSettings(false)} 
                addLog={addLog} 
                geminiKeys={geminiKeys} 
                setGeminiKeys={setGeminiKeys} 
                activeKeyIndex={activeKeyIndex} 
                setActiveKeyIndex={setActiveKeyIndex} 
                galleryImages={galleryImages} 
                setGalleryImages={setGalleryImages} 
                userPresets={userPresets} 
                setUserPresets={setUserPresets} 
              />
            </div>
          )}
          {showGallery && <div className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"><GalleryPanel images={galleryImages} onClose={() => setShowGallery(false)} onDelete={deleteFromGallery} /></div>}
          {showHistory && <HistoryPanel history={history} onClose={() => setShowHistory(false)} onRestore={(item) => {setUserInput(item.prompt); setShowHistory(false);}} onClear={clearHistory} />}
          {showLogs && <div className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4"><LogsPanel logs={logs} addLog={addLog} clearLogs={clearLogs} selectedModel={selectedModel} onClose={() => setShowLogs(false)} /></div>}
        </Suspense>

        <CameraModal isOpen={showCamera} onClose={() => setShowCamera(false)} onCapture={(data) => {setUploadedImage(data); setUploadedMimeType('image/jpeg'); addLog('Visual captured via camera.', 'success');}} />
      </div>
    </PullToRefresh>
  );
}
