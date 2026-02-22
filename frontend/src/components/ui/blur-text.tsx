'use client';

import { useRef, useEffect, useState } from 'react';
import { useSprings, animated } from '@react-spring/web';
// test

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: any;
  animationTo?: any;
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const animatedCount = useRef(0);

  // Default engagements
  const defaultFrom = animationFrom || { filter: 'blur(10px)', opacity: 0, transform: direction === 'top' ? 'translate3d(0,-50px,0)' : 'translate3d(0,50px,0)' };
  const defaultTo = animationTo || [
    { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: defaultFrom,
      to: inView
        ? async (next: any) => {
          for (const step of defaultTo) {
            await next(step);
          }
          animatedCount.current += 1;
          if (animatedCount.current === elements.length && onAnimationComplete) {
            onAnimationComplete();
          }
        }
        : defaultFrom,
      delay: i * delay,
      config: { tension: 200, friction: 20 },
    }))
  );

  return (
    <h2 ref={ref} className={`blur-text ${className} flex flex-wrap justify-center`}>
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={props}
          className="inline-block"
        >
          {elements[index] === ' ' ? '\u00A0' : elements[index]}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </animated.span>
      ))}
    </h2>
  );
};
