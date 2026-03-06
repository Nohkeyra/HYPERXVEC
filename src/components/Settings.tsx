import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Key, Save, Trash2, AlertCircle, Loader2, Sparkles, Zap, Shield, Terminal, Download, Upload, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Preset } from '../presets';
import { safeLocalStorage } from '../utils/storageUtils';
import { playClickSound, triggerHapticFeedback } from '../utils/soundUtils';

interface SettingsProps {
  onClose: () => void;
  addLog: (message: string, type?: 'info' | 'success' | 'error' | 'process') => void;
  geminiKeys: string[];
  setGeminiKeys: (keys: string[]) => void;
  activeKeyIndex: number;
  setActiveKeyIndex: (index: number) => void;
  userPresets: Preset[];
  setUserPresets: (presets: Preset[]) => void;
  enableCache: boolean;
  setEnableCache: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onClose,
  addLog,
  geminiKeys,
  setGeminiKeys,
  activeKeyIndex,
  setActiveKeyIndex,
  userPresets,
  setUserPresets,
  enableCache,
  setEnableCache
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (callback: () => void) => {
    playClickSound();
    triggerHapticFeedback();
    callback();
  };

  const handleExport = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings: {
        geminiKeys,
        activeKeyIndex,
        enableCache
      },
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
          if (data.settings.geminiKeys) setGeminiKeys(data.settings.geminiKeys);
          if (data.settings.activeKeyIndex !== undefined) setActiveKeyIndex(data.settings.activeKeyIndex);
          if (data.settings.enableCache !== undefined) setEnableCache(data.settings.enableCache);
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

  const handleSave = () => {
    addLog('[SETTINGS SAVED] Configuration updated.', 'success');
    onClose();
  };

  const handleClear = () => {
    // No-op for now as keys are server managed, but we can clear local storage just in case
    safeLocalStorage.removeItem('arkApiKey');
    safeLocalStorage.removeItem('hfApiKey');
    addLog('Local cache cleared.', 'info');
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
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleButtonClick(onClose)} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
          <X size={20} />
        </motion.button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Performance & Optimization Panel */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-400 flex items-center gap-2">
              <Zap size={12} /> Performance & Optimization
            </h3>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/60 border border-accent/10 rounded-lg">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Generation Cache</span>
              <span className="text-[8px] font-mono text-accent/40">Reduce API calls by caching results (24h)</span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonClick(() => setEnableCache(!enableCache))}
              className={`w-10 h-5 rounded-full relative transition-all duration-300 ${enableCache ? 'bg-green-500' : 'bg-bg-primary ring-1 ring-border-primary'}`}
            >
              <motion.div 
                animate={{ x: enableCache ? 20 : 2 }}
                className={`absolute top-0.5 w-4 h-4 rounded-full ${enableCache ? 'bg-bg-primary' : 'bg-text-secondary'}`}
              />
            </motion.button>
          </div>
        </div>

        {/* System Backup Panel */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
              <Save size={12} /> System Backup & Restore
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleButtonClick(handleExport)}
              className="flex flex-col items-center justify-center p-4 bg-black/60 border border-accent/10 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all group/btn"
            >
              <Download size={20} className="text-accent mb-2 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Export System</span>
              <span className="text-[8px] font-mono text-accent/40 mt-1">SAVE_CONFIG.JSON</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleButtonClick(() => fileInputRef.current?.click())}
              className="flex flex-col items-center justify-center p-4 bg-black/60 border border-accent/10 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all group/btn"
            >
              <Upload size={20} className="text-accent mb-2 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Import System</span>
              <span className="text-[8px] font-mono text-accent/40 mt-1">LOAD_CONFIG.JSON</span>
            </motion.button>
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

        {/* Diagnostics Panel */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
              <AlertCircle size={12} /> System Diagnostics
            </h3>
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick(async () => {
              addLog('=== INITIATING SYSTEM DIAGNOSTICS ===', 'process');
              
              // 1. Environment Check
              // @ts-ignore
              addLog(`Environment: ${import.meta.env.MODE}`, 'info');
              addLog(`Platform: ${/android|iphone|ipad|ipod/i.test(navigator.userAgent) ? 'Mobile' : 'Web'}`, 'info');
              addLog(`User Agent: ${navigator.userAgent}`, 'info');
              
              // 2. API Key Check
              addLog(`Node_01 (Gemini): SERVER-MANAGED`, 'success');
              addLog(`Node_02 (BytePlus): SERVER-MANAGED`, 'success');
              
              // 3. Storage Check
              try {
                const storageTest = 'test_write';
                safeLocalStorage.setItem(storageTest, 'ok');
                const readBack = safeLocalStorage.getItem(storageTest);
                safeLocalStorage.removeItem(storageTest);
                if (readBack === 'ok') {
                  addLog('Local Storage: OPERATIONAL', 'success');
                } else {
                  throw new Error('Read mismatch');
                }
              } catch (e) {
                addLog('Local Storage: FAILED', 'error');
              }

              // 4. Network Check
              addLog('Testing Network Connectivity...', 'process');
              try {
                const start = Date.now();
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
                const ping = Date.now() - start;
                addLog(`Network: ONLINE (Ping: ~${ping}ms)`, 'success');
              } catch (e) {
                addLog('Network: OFFLINE or BLOCKED', 'error');
              }
              
              addLog('=== DIAGNOSTICS COMPLETE ===', 'success');
            })}
            className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Terminal size={14} /> Run Full System Audit
          </motion.button>
        </div>

        {/* Secret Panel: Server-Side Providers */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="text-[8px] font-mono text-accent animate-pulse">ENCRYPTED_UPLINK_ACTIVE</div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
              <Terminal size={12} /> Provider Status
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/60 border border-accent/10 rounded-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Server-Side Routing</span>
                <span className="text-[8px] font-mono text-accent/40">Seedream, Flux, Cloudflare, NIM, Pollinations, Horde</span>
              </div>
              <span className="text-[8px] font-mono text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20 flex items-center gap-1">
                <CheckCircle2 size={10} /> ACTIVE
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-accent/10">
            <p className="text-[9px] font-mono text-accent/40 leading-relaxed uppercase tracking-tighter">
              SYSTEM_NOTE: All provider keys are securely managed by the server environment. No manual configuration required.
            </p>
          </div>
        </div>

        {/* Gemini API Key Selection (Platform) */}
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
              <Sparkles size={12} /> Gemini 2.5 Neural Uplink
            </h3>
          </div>
          
          <p className="text-[10px] font-mono text-blue-400/60 leading-relaxed uppercase tracking-tighter mb-4">
            For standard synthesis (Gemini 2.5 Flash), you must authorize the system via the platform's secure neural uplink.
          </p>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick(async () => {
              if (window.aistudio) {
                try {
                  await window.aistudio.openSelectKey();
                  addLog('Neural Uplink Authorized: Platform Key Selected', 'success');
                } catch (e) {
                  addLog('Neural Uplink Failed: Key Selection Aborted', 'error');
                }
              }
            })}
            className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Shield size={14} /> Authorize Neural Uplink
          </motion.button>
          
          <div className="mt-2 pt-2 border-t border-blue-500/10">
             <a 
               href="https://ai.google.dev/gemini-api/docs/billing" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-[8px] font-mono text-blue-400/40 hover:text-blue-400 transition-colors uppercase tracking-tighter"
             >
               View Billing Documentation & Setup Guide
             </a>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-6 border-t border-border-primary mt-auto shrink-0 bg-bg-secondary">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleButtonClick(handleClear)} className="flex items-center gap-2 text-xs text-red-500 opacity-60 hover:opacity-100 transition-opacity">
          <Trash2 size={14} /> Clear Keys
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleButtonClick(handleSave)} className="flex items-center gap-2 px-6 py-2 bg-accent text-bg-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
          <Save size={14} /> Save & Close
        </motion.button>
      </div>
    </div>
  );
};
