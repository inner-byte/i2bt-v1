'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/sections/hero';
import { Header } from '@/components/sections/header';
import { FeaturedEvents } from '@/components/sections/featured-events';
import { MemberSpotlight } from '@/components/sections/member-spotlight';
import { ForumDiscussions } from '@/components/sections/forum-discussions';
import { ProjectShowcase } from '@/components/sections/project-showcase';
import { ResourceHub } from '@/components/sections/resource-hub';
import { UpcomingWorkshops } from '@/components/sections/upcoming-workshops';
import { CommunityStats } from '@/components/sections/community-stats';
import { CallToAction } from '@/components/sections/call-to-action';
import { Footer } from '@/components/sections/footer';
import { MobileNav } from '@/components/ui/mobile-nav';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Toaster } from 'react-hot-toast';
import { HeroSkeleton, StatsSkeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF4F7] to-[#FFFFFF]">
      {/* Toast Container */}
      <Toaster position="bottom-right" />

      {/* Header */}
      <Header />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            // Skeleton Loading State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 p-4"
            >
              {/* Hero Skeleton */}
              <HeroSkeleton />

              {/* Stats Skeleton */}
              <StatsSkeleton />

              {/* Content Skeletons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <Hero />

              {/* Community Stats Section */}
              <CommunityStats />

              {/* Featured Events Section */}
              <div ref={ref} className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <FeaturedEvents />
              </div>

              {/* Member Spotlight Section */}
              <div className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <MemberSpotlight />
              </div>

              {/* Forum Discussions */}
              <div className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <ForumDiscussions />
              </div>

              {/* Project Showcase */}
              <div className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <ProjectShowcase />
              </div>

              {/* Resource Hub */}
              <div className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <ResourceHub />
              </div>

              {/* Upcoming Workshops */}
              <div className="relative bg-gradient-to-b from-[#EDF4F7] via-[#E5EEF3] to-[#EDF4F7]">
                <UpcomingWorkshops />
              </div>

              {/* Call to Action Section */}
              <CallToAction />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Footer */}
      <Footer />
    </div>
  );
}
