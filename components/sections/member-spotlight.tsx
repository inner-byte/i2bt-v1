'use client';

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { MemberCard } from '../ui/member-card';
import { ErrorBoundary } from 'react-error-boundary';

interface SpotlightMember {
  id: string;
  name: string;
  role?: string;
  image?: string;
  bio?: string;
  achievements?: string[];
  contributions?: number;
  joinedDate?: string;
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="text-center py-12">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export const MemberSpotlight: FC = () => {
  const [spotlightMembers, setSpotlightMembers] = useState<SpotlightMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchSpotlightMembers = async () => {
      try {
        const response = await fetch('/api/members/spotlight');
        if (!response.ok) {
          throw new Error('Failed to fetch spotlight members');
        }
        const data = await response.json();
        setSpotlightMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlightMembers();
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return spotlightMembers.length - 1;
      if (nextIndex >= spotlightMembers.length) return 0;
      return nextIndex;
    });
  };

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!spotlightMembers.length) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Member Spotlight</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our outstanding members who are making a difference in technology and innovation
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Background Cards */}
              <div className="relative w-[320px]">
                <motion.div
                  animate={{ opacity: 0.5, scale: 0.9, x: -60 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 -left-64 blur-[2px]"
                >
                  <MemberCard {...spotlightMembers[(currentIndex - 1 + spotlightMembers.length) % spotlightMembers.length]} />
                </motion.div>
                <motion.div
                  animate={{ opacity: 0.5, scale: 0.9, x: 60 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 -right-64 blur-[2px]"
                >
                  <MemberCard {...spotlightMembers[(currentIndex + 1) % spotlightMembers.length]} />
                </motion.div>

                {/* Active Card */}
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative z-10"
                  >
                    <MemberCard {...spotlightMembers[currentIndex]} variant="glass">
                      {spotlightMembers[currentIndex].achievements && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Recent Achievements</h4>
                          <ul className="space-y-1">
                            {spotlightMembers[currentIndex].achievements?.map((achievement, i) => (
                              <li key={i} className="text-sm text-gray-600">
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </MemberCard>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div className="container mx-auto px-4">
                <div className="flex justify-between max-w-[600px] mx-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(-1)}
                    className="bg-white shadow-md hover:shadow-lg p-3 rounded-full transition-all duration-200 z-20"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(1)}
                    className="bg-white shadow-md hover:shadow-lg p-3 rounded-full transition-all duration-200 z-20"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
              {spotlightMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
