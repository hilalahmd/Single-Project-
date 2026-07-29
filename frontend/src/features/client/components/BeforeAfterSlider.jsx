import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({ 
  beforeImage = '/images/transform-pair.png', 
  afterImage = '/images/transform-pair.png' 
}) {
  const [position, setPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const autoPlayRef.current = null;

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

  // Handle Dragging
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

  const isSamePair = beforeImage === '/images/transform-pair.png' || beforeImage === afterImage;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[450px] md:h-[500px] bg-black border border-white/20 rounded-none overflow-hidden group shadow-[0_30px_70px_rgba(0,0,0,0.9)] select-none touch-none cursor-ew-resize"
      onMouseMove={(e) => {
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      
      {/* 1. BEFORE LAYER (Unfit / Soft Body Before Workout) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
        <img 
          src={beforeImage} 
          alt="Before Workout Transformation" 
          className={`h-full object-cover filter grayscale contrast-110 ${
            isSamePair ? 'w-[185%] max-w-none object-left' : 'w-full'
          }`} 
        />
      </div>

      {/* 2. AFTER LAYER (Shredded 6-Pack Muscular Body After Workout) */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden transition-none z-10"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <img 
          src={afterImage} 
          alt="After Workout Transformation" 
          className={`h-full object-cover ${
            isSamePair ? 'w-[185%] max-w-none object-right' : 'w-full'
          }`} 
        />
      </div>

      {/* 3. STATIC CORNER LABELS */}
      <div className="absolute bottom-5 left-5 pointer-events-none z-20">
        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded-none backdrop-blur-md border border-white/20">
          BEFORE
        </span>
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none z-20">
        <span className="text-[11px] font-black text-white uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded-none backdrop-blur-md border border-white/30">
          AFTER
        </span>
      </div>

      {/* 4. DRAG SLIDER HANDLE */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] pointer-events-none z-30"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Circular handle */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-transform duration-300 ${isPulsing ? 'animate-pulse scale-110' : ''}`}
        >
          <MoveHorizontal size={18} className="text-black" />
        </div>
      </div>
      
    </div>
  );
}
