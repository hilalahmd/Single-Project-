import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({ beforeImage, afterImage }) {
  const [position, setPosition] = useState(0); // 0 to 100
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
    const targetPosition = 75; // Go to 75%

    // Easing function (ease-in-out)
    const easeInOutQuad = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp) => {
      if (isDragging) return; // Cancel if user interacted
      
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentPos = easeInOutQuad(progress) * targetPosition;
      setPosition(currentPos);

      if (progress < 1) {
        autoPlayRef.current = requestAnimationFrame(step);
      } else {
        setHasAutoPlayed(true);
        setIsPulsing(true);
        // Turn off pulse after 2 seconds
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
        // Add a small delay before starting auto-play
        setTimeout(startAutoPlay, 500);
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
    
    // If user interacts, cancel any running auto-play or pulse
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
      className="relative w-full h-[350px] bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-[20px] overflow-hidden group hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,107,26,0.15)] transition-all duration-500 select-none touch-none cursor-ew-resize"
      onMouseMove={(e) => {
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      
      {/* 1. BEFORE LAYER (Background) */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#07080a]">
        {beforeImage ? (
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center opacity-30 scale-90">
            <User size={80} className="text-gray-600 mb-4" strokeWidth={1} />
            <div className="h-2 w-24 bg-gray-700 rounded-full mb-2"></div>
            <div className="h-2 w-16 bg-gray-800 rounded-full"></div>
          </div>
        )}
      </div>

      {/* 2. AFTER LAYER (Clipped Overlay) */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-[#1a110d] transition-none"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        {afterImage ? (
          <img src={afterImage} alt="After" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff6b1a] blur-[40px] opacity-20 rounded-full"></div>
              <User size={80} className="text-[#ff6b1a] mb-4 relative z-10" strokeWidth={1.5} />
            </div>
            <div className="h-2 w-24 bg-[#ff6b1a]/40 rounded-full mb-2 shadow-[0_0_10px_rgba(255,107,26,0.3)]"></div>
            <div className="h-2 w-16 bg-[#ff6b1a]/30 rounded-full"></div>
          </div>
        )}
      </div>

      {/* 3. STATIC CORNER LABELS (Unclipped) */}
      <div className="absolute bottom-5 left-5 pointer-events-none">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
          Before
        </span>
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none">
        <span className="text-[10px] font-bold text-[#ff6b1a] uppercase tracking-widest bg-[#ff6b1a]/10 px-2 py-1 rounded backdrop-blur-sm border border-[#ff6b1a]/30">
          After
        </span>
      </div>

      {/* 4. DRAG SLIDER HANDLE */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff6b1a] to-[#ff8c3a] shadow-[0_0_15px_rgba(255,107,26,0.8)] pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* The circular handle */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-white to-gray-200 border-2 border-[#ff6b1a] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,107,26,0.6)] transition-transform duration-300 ${isPulsing ? 'animate-pulse scale-125' : ''}`}
        >
          <MoveHorizontal size={16} className="text-[#ff6b1a]" />
        </div>
      </div>
      
    </div>
  );
}
