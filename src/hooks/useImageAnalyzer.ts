import { useState } from 'react';
import { analyzeImage, describeImageSubject } from '../services/geminiService';

export function useImageAnalyzer(addLog: (msg: string, type?: any) => void) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async (image: string, mimeType: string) => {
    if (!image) return null;
    
    setIsAnalyzing(true);
    addLog('Initiating Visual DNA Extraction...', 'process');
    
    try {
      const result = await analyzeImage(image, mimeType);
      addLog('Visual DNA Extracted Successfully.', 'success');
      return result;
    } catch (err: any) {
      addLog(`Extraction Failed: ${err.message}`, 'error');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const describe = async (image: string, mimeType: string) => {
    if (!image) return null;
    
    setIsAnalyzing(true);
    addLog('Analyzing Visual Context...', 'process');
    
    try {
      const result = await describeImageSubject(image, mimeType);
      addLog('Visual Context Analyzed.', 'success');
      return result;
    } catch (err: any) {
      addLog(`Context Analysis Failed: ${err.message}`, 'error');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, analyze, describe };
}
