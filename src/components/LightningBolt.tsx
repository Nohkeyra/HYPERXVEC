import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LightningBoltProps {
  id: string;
  x: number;
  y: number;
  color: string;
  coreColor?: string;
  initialAngle?: number;
  onRemove: (id: string) => void;
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  delay: number;
}

const LightningBolt: React.FC<LightningBoltProps> = ({ id, x, y, color, coreColor = '#fff', initialAngle = 180, onRemove }) => {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const generateBolt = () => {
      const allLines: Line[] = [];
      
      const createBranch = (
        startX: number,
        startY: number,
        angle: number,
        length: number,
        width: number,
        delay: number,
        depth: number,
        branchId: string
      ) => {
        if (depth > 12) return; 

        const endX = startX + length * Math.sin(angle * Math.PI / 180);
        const endY = startY + length * Math.cos(angle * Math.PI / 180);

        allLines.push({
          id: `${branchId}-${depth}`,
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          width,
          delay
        });

        const numNext = Math.random() < 0.2 ? 2 : 1;
        for (let i = 0; i < numNext; i++) {
          const nextAngle = angle + (Math.random() - 0.5) * 45; 
          const nextLength = length * (Math.random() * 0.3 + 0.7);
          const nextWidth = width * 0.9;
          const nextDelay = delay + 15;
          
          createBranch(endX, endY, nextAngle, nextLength, nextWidth, nextDelay, depth + 1, `${branchId}-${i}`);
        }

        if (Math.random() < 0.1 && depth < 8) {
          const sideAngle = angle + (Math.random() < 0.5 ? -60 : 60);
          createBranch(endX, endY, sideAngle, length * 0.6, width * 0.6, delay + 50, depth + 1, `${branchId}-side`);
        }
      };

      const baseAngle = initialAngle + (Math.random() - 0.5) * 20; 
      createBranch(0, 0, baseAngle, 30 + Math.random() * 20, 3, 0, 0, 'main');
      
      setLines(allLines);
    };

    generateBolt();

    const timer = setTimeout(() => {
      onRemove(id);
    }, 2500);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  // Calculate bounds for SVG
  const bounds = useMemo(() => {
    if (lines.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    lines.forEach(l => {
      minX = Math.min(minX, l.x1, l.x2);
      maxX = Math.max(maxX, l.x1, l.x2);
      minY = Math.min(minY, l.y1, l.y2);
      maxY = Math.max(maxY, l.y1, l.y2);
    });
    // Add padding for glow
    return {
      minX: minX - 50,
      maxX: maxX + 50,
      minY: minY - 50,
      maxY: maxY + 50
    };
  }, [lines]);

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  if (lines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0.8, 1, 0.9, 1, 0], // Rapid flicker
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.8, 
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
        ease: "linear" 
      }}
      className="absolute pointer-events-none z-[99]"
      style={{ 
        left: x + bounds.minX, 
        top: y + bounds.minY,
        width,
        height
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`${bounds.minX} ${bounds.minY} ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id={`halo-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={color} result="color" />
            <feComposite in="color" in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#halo-${id})`}>
          {lines.map((line) => (
            <motion.line
              key={`halo-${line.id}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={color}
              strokeWidth={line.width * 2.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: line.delay / 1000, duration: 0.1 }}
            />
          ))}
        </g>

        <g filter={`url(#glow-${id})`}>
          {lines.map((line) => (
            <motion.line
              key={`core-${line.id}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={coreColor}
              strokeWidth={line.width * 0.8}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: line.delay / 1000, duration: 0.05 }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
};

export default LightningBolt;
