'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './glass-card';

interface CarouselProps {
  items: Array<{
    id: string;
    title: string;
    date: string;
    image: string;
    description: string;
    category: string;
  }>;
}

export const Carousel = ({ items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  return (
    <motion.div
      ref={carousel}
      className="cursor-grab overflow-hidden"
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.div
        className="flex gap-4"
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="min-w-[300px] md:min-w-[400px]"
          >
            <GlassCard variant="frosted" className="p-6 h-full">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 text-sm text-white rounded-full bg-primary/50 backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-200/80 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-200/60">{item.date}</span>
                <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  RSVP
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
