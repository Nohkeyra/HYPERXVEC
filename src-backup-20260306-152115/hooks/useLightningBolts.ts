import { useState, useEffect } from 'react';

export interface LightningBoltData {
  id: string;
  x: number;
  y: number;
  color: string;
  coreColor?: string;
  initialAngle: number;
}

export function useLightningBolts(isDarkMode: boolean) {
  const [lightningBolts, setLightningBolts] = useState<LightningBoltData[]>([]);

  useEffect(() => {
    const strikeInterval = setInterval(() => {
      const edge = Math.floor(Math.random() * 4);
      let startX, startY, initialAngle;
      
      if (edge === 0) {
        startX = Math.random() * window.innerWidth;
        startY = 0;
        initialAngle = 180;
      } else if (edge === 1) {
        startX = window.innerWidth;
        startY = Math.random() * window.innerHeight;
        initialAngle = 270;
      } else if (edge === 2) {
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight;
        initialAngle = 0;
      } else {
        startX = 0;
        startY = Math.random() * window.innerHeight;
        initialAngle = 90;
      }

      const color = isDarkMode ? '#CCFF00' : '#000000';
      const coreColor = isDarkMode ? '#000000' : '#000000';
      const id = Math.random().toString(36).substring(2, 9);
      
      const strikes = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < strikes; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 50;
          const offsetY = (Math.random() - 0.5) * 50;
          const idSub = `${id}-${i}`;
          setLightningBolts(prev => [...prev, { 
            id: idSub, 
            x: startX + offsetX, 
            y: startY + offsetY, 
            color,
            coreColor,
            initialAngle 
          }]);
        }, i * 50);
      }
    }, Math.random() * 2000 + 8000);

    return () => clearInterval(strikeInterval);
  }, [isDarkMode]);

  return { lightningBolts, setLightningBolts };
}
