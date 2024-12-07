'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay: 0.3 }
};

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="relative z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-6"
            >
              <span className="text-sm font-medium">Welcome to I2BT</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl font-bold text-gray-800 leading-tight"
              variants={fadeIn}
            >
              Innovate,<br />
              Create,<br />
              <span className="text-blue-600">Lead</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-gray-600 max-w-md"
              variants={slideIn}
            >
              Join the forefront of technology and innovation with our student organization.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-4"
              variants={slideIn}
            >
              <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:bg-blue-700 hover:scale-105 flex items-center">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:bg-blue-50 hover:scale-105">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-purple-500/10 rounded-3xl transform -rotate-3"></div>
            <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
              <Image
                src="/images/stock7.jpg"
                alt="Student working on laptop"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
