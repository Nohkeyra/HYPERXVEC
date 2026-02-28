import React, { useState, useEffect, useRef } from 'react';
import { X, Key, Save, Trash2, AlertCircle, Loader2, Sparkles, Zap, Shield, Terminal, Download, Upload, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Preset } from '../presets';

interface SettingsProps {
  onClose: () => void;
  addLog: (message: string, type?: 'info' | 'success' | 'error' | 'process') => void;
  geminiKeys: string[];
  setGeminiKeys: (keys: string[]) => void;
  activeKeyIndex: number;
  setActiveKeyIndex: (index: number) => void;
  galleryImages: string[];
  setGalleryImages: (images: string[]) => void;
  userPresets: Preset[];
  setUserPresets: (presets: Preset[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onClose,
  addLog,
  geminiKeys,
  setGeminiKeys,
  activeKeyIndex,
  setActiveKeyIndex,
  galleryImages,
  setGalleryImages,
  userPresets,
  setUserPresets,
}) => {
  const [arkApiKey, setArkApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testGeminiConnection = async (apiKey: string) => {
    if (!apiKey) return;
    setIsTestingKey(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      // Use a lightweight text model for connection testing
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: 'test' }] }
      });
      addLog('Uplink Verified: Connection Established', 'success');
    } catch (error: any) {
      console.error('Connection Test Failed:', error);
      addLog(`Uplink Failed: ${error.message || 'Unknown Error'}`, 'error');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleExport = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings: {
        arkApiKey,
        geminiKeys,
        activeKeyIndex
      },
      gallery: galleryImages,
      presets: userPresets
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VECTOR_SYSTEM_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog('System Backup Exported Successfully.', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Restore Settings
        if (data.settings) {
          if (data.settings.arkApiKey) setArkApiKey(data.settings.arkApiKey);
          if (data.settings.geminiKeys) setGeminiKeys(data.settings.geminiKeys);
          if (data.settings.activeKeyIndex !== undefined) setActiveKeyIndex(data.settings.activeKeyIndex);
        }

        // Restore Gallery
        if (data.gallery && Array.isArray(data.gallery)) {
          setGalleryImages(data.gallery);
        }

        // Restore Presets
        if (data.presets && Array.isArray(data.presets)) {
          setUserPresets(data.presets);
        }

        addLog('System Restore Complete. Data synchronized.', 'success');
      } catch (err) {
        console.error('Import Failed:', err);
        addLog('System Restore Failed: Invalid Backup File.', 'error');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const storedArkKey = localStorage.getItem('arkApiKey');
    if (storedArkKey) setArkApiKey(storedArkKey);
  }, []);

  const handleSave = () => {
    let savedKeys = [];

    const trimmedArkKey = arkApiKey.trim();
    if (trimmedArkKey) { 
      localStorage.setItem('arkApiKey', trimmedArkKey); 
      savedKeys.push('BytePlus'); 
    } else {
      localStorage.removeItem('arkApiKey');
    }

    if (savedKeys.length > 0) {
      addLog(`[SETTINGS SAVED] API keys updated for: ${savedKeys.join(', ')}`, 'success');
    } else {
      addLog('[SETTINGS SAVED] No external API keys configured.', 'info');
    }
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('arkApiKey');
    setArkApiKey('');
    addLog('API keys cleared.', 'info');
  };

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...geminiKeys];
    newKeys[index] = value;
    setGeminiKeys(newKeys);
  };

  return (
    <div className="w-full max-w-xl bg-bg-secondary border border-border-primary rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border-primary shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Shield size={20} className="text-accent" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Security & Synthesis</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* System Backup Panel */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
              <Save size={12} /> System Backup & Restore
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="flex flex-col items-center justify-center p-4 bg-black/60 border border-accent/10 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all group/btn"
            >
              <Download size={20} className="text-accent mb-2 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Export System</span>
              <span className="text-[8px] font-mono text-accent/40 mt-1">SAVE_CONFIG.JSON</span>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 bg-black/60 border border-accent/10 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all group/btn"
            >
              <Upload size={20} className="text-accent mb-2 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Import System</span>
              <span className="text-[8px] font-mono text-accent/40 mt-1">LOAD_CONFIG.JSON</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
          
          <div className="mt-2 pt-2 border-t border-accent/10">
             <p className="text-[9px] font-mono text-accent/40 leading-relaxed uppercase tracking-tighter">
              CAUTION: Importing a configuration will overwrite current settings and gallery data.
            </p>
          </div>
        </div>

        {/* Secret Panel: Gemini Multi-Key Management */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="text-[8px] font-mono text-accent animate-pulse">ENCRYPTED_LINK_ACTIVE</div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
              <Terminal size={12} /> Secret Panel: Gemini Free Tier Nodes
            </h3>
          </div>

          <div className="space-y-3">
            {/* Node 1: Gemini */}
            <div className={`relative transition-all duration-300 ${activeKeyIndex === 0 ? 'scale-[1.02]' : 'opacity-60 hover:opacity-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-accent/70">Node_01: Gemini</label>
                {activeKeyIndex === 0 && (
                  <span className="text-[8px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">ACTIVE_UPLINK</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={geminiKeys[0] || ''}
                  onChange={(e) => handleKeyChange(0, e.target.value)}
                  placeholder="GEMINI_KEY_REQUIRED..."
                  className="flex-1 bg-black/60 border border-accent/10 rounded-lg p-2.5 text-xs font-mono text-accent focus:outline-none focus:border-accent/40 placeholder:text-accent/20"
                />

                <button
                  onClick={() => testGeminiConnection(geminiKeys[0])}
                  disabled={isTestingKey || !geminiKeys[0]}
                  className="px-3 rounded-lg border border-accent/20 text-accent hover:bg-accent/10 disabled:opacity-50 transition-all flex items-center gap-2"
                  title="Test Connection"
                >
                  {isTestingKey ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  <span className="text-[9px] font-bold uppercase">Test</span>
                </button>
                <button
                  onClick={() => setActiveKeyIndex(0)}
                  className={`px-3 rounded-lg border transition-all ${
                    activeKeyIndex === 0 
                      ? 'bg-accent border-accent text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                      : 'border-accent/20 text-accent hover:bg-accent/10'
                  }`}
                  title="Switch to this node"
                >
                  <Zap size={14} className={activeKeyIndex === 0 ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Node 2: BytePlus (Seedream) */}
            <div className="relative opacity-60 hover:opacity-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-accent/70">Node_02: BytePlus (Seedream)</label>
                {arkApiKey && (
                  <span className="text-[8px] font-mono text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20 flex items-center gap-1">
                    <CheckCircle2 size={10} /> KEY_LOADED
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={arkApiKey}
                  onChange={(e) => setArkApiKey(e.target.value)}
                  placeholder="ARK_API_KEY_REQUIRED..."
                  className="flex-1 bg-black/60 border border-accent/10 rounded-lg p-2.5 text-xs font-mono text-accent focus:outline-none focus:border-accent/40 placeholder:text-accent/20"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-accent/10">
            <p className="text-[9px] font-mono text-accent/40 leading-relaxed uppercase tracking-tighter">
              SYSTEM_NOTE: Synthesis Engine Nodes established. 
              Node_01 handles primary neural processing. 
              Node_02 handles external specialized generation.
            </p>
          </div>
        </div>

        {/* Gemini API Key Selection (Platform) */} 
      </div>

      <div className="flex justify-between items-center p-6 border-t border-border-primary mt-auto shrink-0 bg-bg-secondary">
        <button onClick={handleClear} className="flex items-center gap-2 text-xs text-red-500 opacity-60 hover:opacity-100 transition-opacity">
          <Trash2 size={14} /> Clear Keys
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-accent text-bg-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
          <Save size={14} /> Save & Close
        </button>
      </div>
    </div>
  );
};
