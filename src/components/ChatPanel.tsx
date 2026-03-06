import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, X, User, Bot, Loader2, FileText, Image as ImageIcon, Camera, FileArchive, Mic, Plus, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { VectorAssistantApi, ChatMessage } from '../services/vectorAssistantService';
import { VECTOR_PRESETS, TYPOGRAPHY_PRESETS } from '../presets';
import { LOGO_PRESETS } from '../modules/LogoModule';
import { modelRegistry } from '../services/modelRegistry';
import { safeLocalStorage } from '../utils/storageUtils';
import { playClickSound, triggerHapticFeedback } from '../utils/soundUtils';
import { apiUrl } from '../utils/apiBase';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  files?: { name: string; type: string; data: string }[];
}

interface ChatPanelProps {
  addLog: (message: string, type?: 'info' | 'success' | 'error' | 'process') => void;
  apiKey: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = React.memo(({ addLog, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; data: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelName = "GPT-OSS 120B";

  const handleButtonClick = (callback: () => void) => {
    playClickSound();
    triggerHapticFeedback();
    callback();
  };

  useEffect(() => {
    // Initial message removed to show Hero state
  }, []);

  useEffect(() => {
    // Scroll logic handled by flex-col-reverse
  }, [messages, isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        setIsLoading(true);
        addLog(`Analyzing ZIP: ${file.name}...`, 'process');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const res = await fetch(apiUrl('/api/analyze-zip'), {
            method: 'POST',
            body: formData
          });
          
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'ZIP analysis failed');
          }
          
          const data = await res.json();
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            type: 'application/zip',
            data: data.content // Store extracted text content
          }]);
          addLog(`ZIP analysis complete: ${data.fileCount} files extracted.`, 'success');
        } catch (err: any) {
          console.error('ZIP Analysis Error:', err);
          addLog(`ZIP analysis failed: ${err.message}`, 'error');
        } finally {
          setIsLoading(false);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            type: file.type,
            data: reader.result as string
          }]);
        };
        reader.readAsDataURL(file);
      }
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() && attachedFiles.length === 0) return;
    
    if (!apiKey) {
      addLog('API key required for Vector Assistant. Please configure BytePlus (Node_02) in Settings.', 'error');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      text: text,
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      // Construct dynamic system prompt with app knowledge
      const availableModels = Object.values(modelRegistry).map(m => `${m.label} (${m.provider})`).join(', ');
      const vectorPresets = VECTOR_PRESETS.flatMap(c => c.presets.map(p => p.name)).join(', ');
      const typographyPresets = TYPOGRAPHY_PRESETS.flatMap(c => c.presets.map(p => p.name)).join(', ');
      const logoPresets = LOGO_PRESETS.flatMap(c => c.presets.map(p => p.name)).join(', ');

      const systemPrompt = `You are VΞCTOR Assistant, a specialized artificial intelligence assistant for a high-end vector design and image synthesis platform. 
      
      APP ARCHITECTURE:
      - Framework: React 18 + Vite
      - Styling: Tailwind CSS
      - Animation: Framer Motion
      - Mobile: Capacitor (iOS/Android)
      - State: React Hooks (useState, useEffect, etc.)

      CAPABILITIES:
      1. Vector Art Generation: Uses models like Gemini, NVIDIA Flux, and Seedream (BytePlus) to generate flat, clean vector art.
      2. Typography Art: Generates artistic text and lettering.
      3. Logo Design: Creates professional logos with specific constraints (minimalist, geometric, etc.).
      4. Image Analysis: Extracts "Visual DNA" from uploaded images to create new style presets.
      5. Chat: You are this chat interface.

      AVAILABLE MODELS:
      ${availableModels}
      (Note: Seedream 4.0 and 4.5 are BytePlus models optimized for high-fidelity generation and they understand all presets below.)

      AVAILABLE PRESETS (Styles):
      - Vector Art: ${vectorPresets}
      - Typography: ${typographyPresets}
      - Logo Design: ${logoPresets}

      YOUR ROLE:
      - You are technical, precise, and helpful. Speak in a concise, terminal-like manner.
      - Analyze design requests and suggest specific presets from the list above.
      - If the user asks about "Seedream", confirm it is a supported model family (4.0 & 4.5) and is fully integrated with all presets.
      - You can analyze ZIP files uploaded by the user (text content is extracted for you).
      - EXPERT DEBUGGER: If the user provides error logs, stack traces, or code snippets, analyze them deeply and provide specific, actionable fixes for this React/Vite codebase.`;

      // Prepare messages for the API
      const apiMessages: ChatMessage[] = [
        { 
          role: 'system', 
          content: systemPrompt
        }
      ];

      // Add history (limit to last 10 messages for context)
      const history = newMessages.slice(-10).map(m => {
        let content = m.text;
        if (m.files && m.files.length > 0) {
          const zipFiles = m.files.filter(f => f.type === 'application/zip');
          const otherFiles = m.files.filter(f => f.type !== 'application/zip');
          
          if (zipFiles.length > 0) {
            // Truncate content to avoid payload size issues (5k chars per file max)
            content += "\n\n[EXTRACTED ZIP CONTENT]:\n" + zipFiles.map(f => `--- ZIP: ${f.name} ---\n${f.data.substring(0, 5000)}${f.data.length > 5000 ? '... (truncated)' : ''}`).join('\n\n');
          }
          
          if (otherFiles.length > 0) {
            content += "\n\n[User attached files: " + otherFiles.map(f => f.name).join(', ') + "]";
            content += "\n(Note: Multimodal file analysis is handled by the Gemini node.)";
          }
        }
        return {
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: content || " " // Ensure content is not empty
        };
      });

      apiMessages.push(...(history as ChatMessage[]));
      
      const responseText = await VectorAssistantApi.chat(apiMessages, apiKey || '');
      
      setMessages(prev => [...prev, { role: 'assistant', text: responseText || 'I encountered an issue processing that request.' }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      addLog(`Chat failed: ${error.message}`, 'error');
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { icon: <ImageIcon size={16} className="text-yellow-400" />, label: 'Create image', prompt: 'Create a vector art image of ' },
    { icon: <FileText size={16} className="text-blue-400" />, label: 'Help me learn', prompt: 'Explain how vector synthesis works' },
    { icon: <Bot size={16} className="text-green-400" />, label: 'Analyze code', prompt: 'Analyze this code snippet: ' },
    { icon: <Sparkles size={16} className="text-purple-400" />, label: 'Boost my day', prompt: 'Give me a creative design idea' },
  ];

  return (
    <div className="fixed inset-0 z-40 md:relative md:inset-auto md:w-full md:h-full flex flex-col bg-black overflow-hidden pb-[calc(110px+env(safe-area-inset-bottom))] md:pb-0 pt-[env(safe-area-inset-top)]">
      {/* Header - Minimal */}
      <div className="flex justify-between items-center p-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="text-white font-medium">Gemini</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
             <User size={32} className="text-zinc-400 p-1" />
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar flex flex-col-reverse">
        {messages.length > 0 ? (
          <>
            {messages.slice().reverse().map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`text-base leading-relaxed ${
                    msg.role === 'user' ? 'bg-zinc-800 text-white px-5 py-3 rounded-[24px] rounded-tr-sm' : 'text-zinc-100'
                  }`}>
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                  {msg.files && (
                    <div className="flex flex-wrap gap-2">
                      {msg.files.map((file, fi) => (
                        <div key={fi} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-xs text-zinc-300">
                          {file.type.startsWith('image/') ? <ImageIcon size={12} /> : file.type === 'application/zip' ? <FileArchive size={12} /> : <FileText size={12} />}
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="p-3">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-end h-full pb-8">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 mb-2">Hi there</h1>
              <h2 className="text-4xl md:text-5xl font-medium text-zinc-500">Where should we start?</h2>
            </div>
            <div className="flex flex-col gap-3 items-start">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(s.prompt); }}
                  className="flex items-center gap-3 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors text-zinc-200 text-sm"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="px-4 pb-2 shrink-0 z-20">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-2">
            {attachedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-zinc-500 hover:text-white"><X size={12} /></button>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-zinc-800 rounded-[32px] flex items-center p-2 pr-2 gap-2 shadow-lg border border-zinc-700/50">
          <button
            onClick={() => handleButtonClick(() => fileInputRef.current?.click())}
            className="w-10 h-10 rounded-full bg-zinc-700/50 flex items-center justify-center text-zinc-200 hover:bg-zinc-600 transition-colors shrink-0"
          >
            <Plus size={20} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleButtonClick(() => handleSend())}
            placeholder="Ask Gemini"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-400 text-base px-2 h-10"
          />

          {input.trim() || attachedFiles.length > 0 ? (
             <button
              onClick={() => handleButtonClick(() => handleSend())}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          ) : (
             <button
              onClick={() => handleButtonClick(() => fileInputRef.current?.click())}
              className="w-10 h-10 rounded-full hover:bg-zinc-700/50 text-zinc-200 flex items-center justify-center transition-colors shrink-0"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
