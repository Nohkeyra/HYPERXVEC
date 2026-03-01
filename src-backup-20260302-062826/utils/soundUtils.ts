export const playClickSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const playGenerateSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Oscillator 1: High tech charge up
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(200, audioContext.currentTime);
  osc1.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.3);
  
  gain1.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain1.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

  // Oscillator 2: Low thud
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(100, audioContext.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  gain2.gain.setValueAtTime(0.5, audioContext.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  osc1.connect(gain1);
  osc2.connect(gain2);
  
  gain1.connect(audioContext.destination);
  gain2.connect(audioContext.destination);

  osc1.start();
  osc2.start();
  
  osc1.stop(audioContext.currentTime + 0.3);
  osc2.stop(audioContext.currentTime + 0.5);
};

export const playSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, audioContext.currentTime);
  osc.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#
  osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E
  
  gain.gain.setValueAtTime(0.1, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.4);
};
