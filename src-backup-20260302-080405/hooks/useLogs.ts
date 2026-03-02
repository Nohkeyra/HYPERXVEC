import { useState, useEffect, useRef } from 'react';

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  timestamp: string;
}

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev.slice(-19), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('System logs cleared', 'success');
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return { logs, addLog, clearLogs, logEndRef };
}
