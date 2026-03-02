import { useState } from 'react';
import { generateImage as apiGenerateImage } from '../services/imageService';
import { ImageModel } from '../services/modelRegistry';
import { playGenerateSound, playSuccessSound } from '../utils/soundUtils';

interface GenerationOptions {
  prompt: string;
  model: ImageModel;
  preset: any;
  isStrictMode: boolean;
  isIllustrated: boolean;
  isSubjectOnly: boolean;
  isBatchMode: boolean;
  uploadedImage: string | null;
  uploadedMimeType: string | null;
  selectedPalette: any;
}

export function useGeneration(
  addLog: (msg: string, type?: any) => void,
  addToHistory: (img: string, prompt: string, presetName: string) => void,
  handleRateLimit: () => boolean
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  const generate = async (options: GenerationOptions) => {
    const { 
      prompt, 
      model, 
      preset, 
      isStrictMode, 
      isIllustrated, 
      isSubjectOnly, 
      isBatchMode, 
      uploadedImage, 
      selectedPalette 
    } = options;

    if (!prompt && !preset) {
      addLog('Visual directives required for synthesis.', 'error');
      setError('Prompt or Preset Required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);
    playGenerateSound();
    addLog(`Initiating Synthesis: ${preset?.name || 'Custom'}`, 'process');

    try {
      const basePrompt = preset?.basePrompt || '';
      const negativePrompt = preset?.negativePrompt || '';
      
      let enhancedPrompt = prompt;
      if (isStrictMode) enhancedPrompt += ", high fidelity, sharp details, vector style";
      if (isIllustrated) enhancedPrompt += ", illustrated style, artistic finish";
      if (isSubjectOnly) enhancedPrompt += ", isolated subject, white background";
      if (selectedPalette) enhancedPrompt += `, color palette: ${selectedPalette.colors.join(', ')}`;

      if (isBatchMode) {
        addLog('Batch Mode Active: Generating 4 variations...', 'process');
        const batchResults = await Promise.all(
          Array(4).fill(0).map(() => 
            apiGenerateImage(enhancedPrompt, model, basePrompt, negativePrompt, uploadedImage || undefined)
          )
        );
        setResultImage(batchResults);
        batchResults.forEach(img => addToHistory(img, enhancedPrompt, preset?.name || 'Batch Variation'));
        addLog('Batch Synthesis Complete: 4 variations constructed.', 'success');
      } else {
        const result = await apiGenerateImage(enhancedPrompt, model, basePrompt, negativePrompt, uploadedImage || undefined);
        setResultImage(result);
        addToHistory(result, enhancedPrompt, preset?.name || 'Custom');
        addLog('Synthesis Complete: Visual asset constructed.', 'success');
      }

      playSuccessSound();
      setGenerationCount(prev => prev + 1);
    } catch (err: any) {
      if (err.message === 'USE_GEMINI_FALLBACK' || err.message?.includes('429')) {
        const handled = handleRateLimit();
        if (handled) {
          addLog('Retrying synthesis with secondary node...', 'process');
          return generate(options);
        }
      }
      addLog(`Synthesis Failed: ${err.message}`, 'error');
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, resultImage, setResultImage, error, setError, generationCount, setGenerationCount, generate };
}
