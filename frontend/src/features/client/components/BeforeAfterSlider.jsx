import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function BeforeAfterSlider({ 
  beforeImage = '/images/athlete-chubby.png', 
  afterImage = '/images/athlete-fit.png' 
}) {
  const [position, setPosition] = useState(50); // 0 to 100
  const [isHovering, setIsHovering] = useState(false);
  
  const containerRef = useRef(null);

  // Continuous smooth auto-swapping animation when cursor is NOT over the image
  useEffect(() => {
    if (isHovering) return;

    let animationFrameId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // Smooth, slow continuous back-and-forth oscillation
      const pos = 50 + 38 * Math.sin(elapsed * 0.0006);
      setPosition(pos);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovering]);

  // Handle Mouse / Touch movement across the image when user hovers
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setPosition(percentage);
  }, []);

  const onMouseMove = useCallback((e) => {
    setIsHovering(true);
    handleMove(e.clientX);
  }, [handleMove]);

  const onTouchMove = useCallback((e) => {
    setIsHovering(true);
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[460px] md:h-[520px] bg-black border border-white/20 rounded-none overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none cursor-pointer"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchStart={(e) => {
        setIsHovering(true);
        handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={() => setIsHovering(false)}
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
    </div>
  );
}
