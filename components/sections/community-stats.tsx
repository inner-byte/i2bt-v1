'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  RocketLaunchIcon, 
  CalendarIcon, 
  ChartBarIcon,
  CommandLineIcon,
  HeartIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AnimatedCounter } from '../ui/animated-counter';
import { ErrorBoundary } from 'react-error-boundary';

interface CommunityStats {
  totalMembers: number;
  activeProjects: number;
  monthlyEvents: number;
  contributions: number;
  techTrends: Array<{
    name: string;
    percentage: number;
  }>;
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

export const CommunityStats = () => {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/community');
        if (!response.ok) {
          throw new Error('Failed to fetch community stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const achievements = stats ? [
    {
      title: 'Community Members',
      value: `${stats.totalMembers}+`,
      description: 'Active community members',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Projects',
      value: `${stats.activeProjects}+`,
      description: 'Ongoing projects',
      icon: RocketLaunchIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Monthly Events',
      value: `${stats.monthlyEvents}+`,
      description: 'Learning sessions',
      icon: CalendarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Contributions',
      value: `${stats.contributions}+`,
      description: 'Code contributions',
      icon: CommandLineIcon,
      color: 'bg-red-500',
    },
  ] : [];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (percentage: number) => ({
      width: `${percentage}%`,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    }),
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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <section className="relative py-24 overflow-hidden bg-[#EDF4F7]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Gradient Spots */}
        <div className="absolute inset-0">
          <div className="absolute -top-48 right-0 h-96 w-96 opacity-20">
            <div className="absolute inset-0 bg-blue-500 blur-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 h-96 w-96 opacity-20">
            <div className="absolute inset-0 bg-purple-500 blur-3xl" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            >
              <SparklesIcon className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-800 font-medium">Community Milestones</span>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Growing Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Together we're building a thriving tech community, fostering innovation and growth
            </p>
          </motion.div>

          {/* Achievement Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity"
                  style={{
                    background: achievement.color.replace('bg-', ''),
                  }}
                />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 h-full">
                  <div className={`w-12 h-12 mb-4 rounded-xl ${achievement.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {achievement.value}
                  </div>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-blue-500" />
              Technology Trends
            </h3>
            <div className="space-y-6">
              {stats?.techTrends.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{tech.name}</span>
                    <span className="text-gray-600">{tech.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      custom={tech.percentage}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={progressVariants}
                      className={`h-full rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
