import React, { useRef, useEffect } from 'react';
import { 
  X, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Layers,
  Trash2,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { ImageModel, modelRegistry } from '../services/modelRegistry';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  timestamp: string;
}

interface LogsPanelProps {
  logs: LogEntry[];
  onClose: () => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  selectedModel: ImageModel;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClose, addLog, clearLogs, selectedModel }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getModelLabel = (model: ImageModel) => {
    const modelInfo = modelRegistry[model];
    return modelInfo ? modelInfo.label : model;
  };

  return (
    <div className="relative w-full max-w-xl bg-bg-secondary border border-border-primary rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-secondary z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TerminalIcon size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">System Logs</h2>
            <div className="flex items-center gap-2 mt-1 opacity-60">
              <Cpu size={10} />
              <span className="text-[9px] font-mono uppercase tracking-widest">
                Active Engine: <span className="text-accent">{getModelLabel(selectedModel)}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearLogs}
            className="p-2 hover:bg-bg-primary rounded-full transition-colors text-text-secondary hover:text-red-500"
            title="Clear Logs"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => {
              const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
              navigator.clipboard.writeText(text);
              addLog('Logs copied to clipboard', 'success');
            }}
            className="p-2 hover:bg-bg-primary rounded-full transition-colors text-text-secondary hover:text-accent"
            title="Copy Logs"
          >
            <Layers size={18} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg-primary">
        <div className="space-y-2">
          {logs.length === 0 && (
            <div className="text-center py-10 opacity-30 text-[10px] uppercase tracking-widest font-mono">
              No logs available
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-[10px] font-mono">
              <span className="opacity-30 flex-shrink-0">[{log.timestamp}]</span>
              <div className="flex items-center gap-2">
                {log.type === 'success' && <CheckCircle2 size={10} className="text-accent" />}
                {log.type === 'error' && <AlertCircle size={10} className="text-red-500" />}
                {log.type === 'process' && <Loader2 size={10} className="text-accent animate-spin" />}
                {log.type === 'info' && <TerminalIcon size={10} className="opacity-30" />}
                <span className={log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-accent' : 'opacity-70'}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
