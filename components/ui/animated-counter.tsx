'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  label: string;
}

export const AnimatedCounter = ({ end, duration = 2, label }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        controls.start({ opacity: 1, y: 0 });
        let start = 0;
        const step = end / (duration * 60);
        const counter = setInterval(() => {
          start += step;
          if (start > end) {
            setCount(end);
            clearInterval(counter);
          } else {
            setCount(Math.floor(start));
          }
        }, 1000 / 60);
        return () => clearInterval(counter);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, end, duration, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="text-center"
    >
      <motion.div className="text-4xl font-bold mb-2">{count}</motion.div>
      <div className="text-sm text-gray-200/80">{label}</div>
    </motion.div>
  );
};
