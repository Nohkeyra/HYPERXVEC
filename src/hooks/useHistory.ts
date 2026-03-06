import { useState, useEffect } from 'react';
import { Preset } from '../presets';
import { safeLocalStorage } from '../utils/storageUtils';

export interface HistoryItem {
  id: string;
  prompt: string;
  presetName: string;
  timestamp: string;
  image: string;
}

export function useHistory(addLog: (msg: string, type?: any) => void) {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = safeLocalStorage.getItem('genHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    safeLocalStorage.setItem('genHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (image: string, prompt: string, presetName: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      prompt,
      presetName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image
    };
    setHistory(prev => [newItem, ...prev.slice(0, 19)]);
  };

  const clearHistory = () => {
    setHistory([]);
    safeLocalStorage.removeItem('genHistory');
    addLog('Generation history cleared', 'info');
  };

  return { history, setHistory, addToHistory, clearHistory };
}
