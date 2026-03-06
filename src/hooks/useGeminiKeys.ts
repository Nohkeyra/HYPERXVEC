import { useState, useEffect } from 'react';
import { safeLocalStorage } from '../utils/storageUtils';

export function useGeminiKeys(addLog: (msg: string, type?: any) => void) {
  const [geminiKeys, setGeminiKeys] = useState<string[]>(() => {
    const saved = safeLocalStorage.getItem('geminiKeys');
    return saved ? JSON.parse(saved) : [''];
  });
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(() => {
    const saved = safeLocalStorage.getItem('activeKeyIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    safeLocalStorage.setItem('geminiKeys', JSON.stringify(geminiKeys));
  }, [geminiKeys]);

  useEffect(() => {
    safeLocalStorage.setItem('activeKeyIndex', activeKeyIndex.toString());
  }, [activeKeyIndex]);

  const getActiveGeminiKey = () => {
    const key = geminiKeys[activeKeyIndex];
    return key || process.env.API_KEY || process.env.GEMINI_API_KEY;
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

  return { geminiKeys, setGeminiKeys, activeKeyIndex, setActiveKeyIndex, getActiveGeminiKey, switchToNextKey };
}
