import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { RefreshCw, Zap } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

const PULL_THRESHOLD = 100;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, disabled }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || window.scrollY > 0) return;
    
    // Only allow pull to refresh from the header
    const target = e.target as HTMLElement;
    if (!target.closest('.pull-to-refresh-header')) return;

    startY.current = e.touches[0].pageY;
    isPulling.current = true;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || disabled || isRefreshing) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && window.scrollY <= 0) {
      // Apply resistance
      const distance = Math.pow(diff, 0.8);
      setPullDistance(distance);
      
      // Haptic feedback when crossing threshold
      if (distance >= PULL_THRESHOLD && pullDistance < PULL_THRESHOLD) {
        if (Capacitor.isNativePlatform()) {
          Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
        }
      }
      
      if (e.cancelable) e.preventDefault();
    } else {
      isPulling.current = false;
      setPullDistance(0);
    }
  }, [disabled, isRefreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(60); // Hold at a visible position
      
      if (Capacitor.isNativePlatform()) {
        Haptics.notification({ type: 'SUCCESS' as any }).catch(() => {});
      }

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none z-40"
        style={{ height: pullDistance }}
      >
        <motion.div
          animate={{ 
            rotate: isRefreshing ? 360 : pullDistance * 2,
            scale: Math.min(pullDistance / 60, 1.2)
          }}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/20 border border-bg-primary/20">
            {isRefreshing ? (
              <RefreshCw className="text-bg-primary w-5 h-5" />
            ) : (
              <Zap className={`text-bg-primary w-5 h-5 ${pullDistance >= PULL_THRESHOLD ? 'fill-current' : ''}`} />
            )}
          </div>
          {pullDistance > 40 && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent opacity-60">
              {pullDistance >= PULL_THRESHOLD ? 'Release to Sync' : 'Pull to Refresh'}
            </span>
          )}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: pullDistance }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
