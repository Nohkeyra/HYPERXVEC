import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, X, User, Bot, Loader2, FileText, Image as ImageIcon, Camera } from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { CameraModal } from './CameraModal';

interface Message {
  role: 'user' | 'model';
  text: string;
  files?: { name: string; type: string; data: string }[];
}

interface ChatPanelProps {
  onClose: () => void;
  addLog: (message: string, type?: 'info' | 'success' | 'error' | 'process') => void;
  apiKey: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = React.memo(({ onClose, addLog, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'VΞCTOR AI Assistant online. How can I assist with your visual synthesis today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; data: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or loading state changes
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    if (!apiKey) {
      addLog('Gemini API key required for chat.', 'error');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      text: input,
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Filter out the initial model greeting if it exists, as the API expects user turn first
      const history = messages.filter((_, index) => index > 0 || messages[0].role !== 'model');
      
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history.concat(userMessage).map(m => ({
          role: m.role,
          parts: [
            { text: m.text },
            ...(m.files || []).map(f => ({
              inlineData: {
                mimeType: f.type,
                data: f.data.split(',')[1]
              }
            }))
          ]
        })),
        config: {
          systemInstruction: "You are VΞCTOR AI, a specialized assistant for a high-end vector design and image synthesis platform. You are technical, precise, and helpful. You speak in a concise, terminal-like manner. Every letter is geometry. Every style is a rule system. You can analyze images, suggest design styles, and help users with the platform's features. When discussing Stability AI, mention that it is running on the KSD V1 Engine for deterministic vector output."
        }
      });

      const response = await model;
      const text = response.text;
      
      setMessages(prev => [...prev, { role: 'model', text: text || 'I encountered an issue processing that request.' }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      addLog(`Chat failed: ${error.message}`, 'error');
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl h-[80vh] bg-bg-secondary border border-border-primary rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border-primary shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bot size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">VΞCTOR Assistant</h2>
            <p className="text-[8px] font-mono opacity-40 uppercase tracking-widest">Neural Synthesis Interface</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-accent text-bg-primary' : 'bg-bg-primary border border-border-primary text-accent'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-accent/10 border border-accent/20 text-text-primary' : 'bg-bg-primary border border-border-primary text-text-primary'
              }`}>
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
              {msg.files && (
                <div className="flex flex-wrap gap-2">
                  {msg.files.map((file, fi) => (
                    <div key={fi} className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-[10px] font-mono opacity-60">
                      {file.type.startsWith('image/') ? <ImageIcon size={12} /> : <FileText size={12} />}
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border-primary text-accent flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-4 bg-bg-primary border border-border-primary rounded-2xl">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border-primary bg-bg-primary/50 shrink-0">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {attachedFiles.map((file, i) => (
              <div key={i} className="group relative">
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border-primary rounded-xl text-[10px] font-mono pr-8">
                  {file.type.startsWith('image/') ? <ImageIcon size={12} className="text-accent" /> : <FileText size={12} className="text-accent" />}
                  <span className="truncate max-w-[100px]">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCamera(true)}
            className="w-12 h-12 rounded-xl bg-bg-secondary border border-border-primary flex flex-col items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-all group/cam"
            title="Take Photo"
          >
            <Camera size={20} className="group-hover/cam:scale-110 transition-transform" />
            <span className="text-[7px] font-bold uppercase tracking-tighter mt-0.5 opacity-60 group-hover/cam:opacity-100">Cam</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-xl bg-bg-secondary border border-border-primary flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-all"
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask VΞCTOR Assistant..."
              className="w-full h-12 bg-bg-secondary border border-border-primary rounded-xl px-4 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-bg-primary rounded-lg flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
      <CameraModal 
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(imageData) => {
          setAttachedFiles(prev => [...prev, {
            name: `camera-capture-${Date.now()}.jpg`,
            type: 'image/jpeg',
            data: imageData
          }]);
          addLog('Camera capture attached to chat.', 'success');
        }}
      />
    </div>
  );
});
