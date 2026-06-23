import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ 
  children, 
  className = "", 
  direction = "up", 
  delay = 0,
  duration = 700
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Only animate once
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15, // Trigger when 15% visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Directional initial states
  let initialTransform = 'translateY(40px)';
  if (direction === 'down') initialTransform = 'translateY(-40px)';
  if (direction === 'left') initialTransform = 'translateX(40px)';
  if (direction === 'right') initialTransform = 'translateX(-40px)';
  if (direction === 'none') initialTransform = 'none';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0px, 0px)' : initialTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
