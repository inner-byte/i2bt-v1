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
} from '@heroicons/react/24/outline';
import { AnimatedCounter } from '../ui/animated-counter';

// Mock data - replace with real API data in production
const MOCK_STATS = {
  totalMembers: 1500,
  activeProjects: 48,
  monthlyEvents: 12,
  contributions: 856,
  techTrends: [
    { name: 'React', percentage: 85 },
    { name: 'Next.js', percentage: 75 },
    { name: 'TypeScript', percentage: 70 },
    { name: 'Node.js', percentage: 65 },
    { name: 'Python', percentage: 60 },
  ],
  achievements: [
    {
      title: 'Community Members',
      value: '1500+',
      description: 'Active community members',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Projects',
      value: '48+',
      description: 'Ongoing projects',
      icon: RocketLaunchIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Monthly Events',
      value: '12+',
      description: 'Learning sessions',
      icon: CalendarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Contributions',
      value: '850+',
      description: 'Code contributions',
      icon: CommandLineIcon,
      color: 'bg-red-500',
    },
  ],
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
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

export const CommunityStats = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
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
          {MOCK_STATS.achievements.map((achievement, index) => (
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
            {MOCK_STATS.techTrends.map((tech, index) => (
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
  );
};
