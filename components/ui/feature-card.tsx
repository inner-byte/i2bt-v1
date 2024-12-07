'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './glass-card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: 'default' | 'neo' | 'frosted';
}

export const FeatureCard = ({
  title,
  description,
  icon,
  variant = 'default'
}: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <GlassCard variant={variant} className="p-6 h-full">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-4xl text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-200/80">{description}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
};
