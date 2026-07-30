import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({ 
  beforeImage = '/images/athlete-chubby.png', 
  afterImage = '/images/athlete-fit.png' 
}) {
  const [position, setPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Auto-play animation function
  const startAutoPlay = useCallback(() => {
    if (hasAutoPlayed || isDragging) return;
    
    let startTimestamp = null;
    const duration = 2500; // 2.5 seconds
    const targetPosition = 75;

    const easeInOutQuad = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp) => {
      if (isDragging) return;
      
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentPos = 25 + easeInOutQuad(progress) * (targetPosition - 25);
      setPosition(currentPos);

      if (progress < 1) {
        autoPlayRef.current = requestAnimationFrame(step);
      } else {
        setHasAutoPlayed(true);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);
      }
    };

    autoPlayRef.current = requestAnimationFrame(step);
  }, [hasAutoPlayed, isDragging]);

  // Setup Intersection Observer for scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAutoPlayed) {
        setTimeout(startAutoPlay, 400);
      }
    }, { threshold: 0.5 });

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (autoPlayRef.current) cancelAnimationFrame(autoPlayRef.current);
    };
  }, [hasAutoPlayed, startAutoPlay]);

  // Handle Dragging / Touch / Pointer
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    
    if (autoPlayRef.current) cancelAnimationFrame(autoPlayRef.current);
    setIsPulsing(false);
    setHasAutoPlayed(true);

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setPosition(percentage);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const onTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, onMouseMove, onTouchMove, stopDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[460px] md:h-[520px] bg-black border border-white/20 rounded-none overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none touch-none cursor-ew-resize"
      onMouseMove={(e) => {
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      
      {/* 1. AFTER LAYER (Shredded Fit Body - Base Layer on Right) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden z-0">
        <img 
          src={afterImage} 
          alt="After Workout Transformation" 
          className="w-full h-full object-cover object-top" 
        />
      </div>

      {/* 2. BEFORE LAYER (Chubby Unfit Body - Clipped Layer on Left) */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden transition-none z-10"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before Workout Transformation" 
          className="w-full h-full object-cover object-top" 
        />
      </div>

      {/* 3. STATIC CORNER BADGES */}
      <div className="absolute bottom-5 left-5 pointer-events-none z-20">
        <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest bg-black/80 px-3 py-1.5 rounded-none backdrop-blur-md border border-white/20 shadow-lg">
          BEFORE
        </span>
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none z-20">
        <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest bg-black/80 px-3 py-1.5 rounded-none backdrop-blur-md border border-white/20 shadow-lg">
          AFTER
        </span>
      </div>

      {/* 4. DRAG SLIDER HANDLE */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] pointer-events-none z-30"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Circular handle */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.9)] transition-transform duration-300 ${
            isPulsing ? 'animate-pulse scale-110' : ''
          }`}
        >
          <MoveHorizontal size={20} className="text-black" />
        </div>
      </div>
      
    </div>
  );
}
