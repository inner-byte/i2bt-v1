import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberCard } from '../ui/member-card';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const sampleMembers = [
  {
    name: 'Ali Ahmad',
    role: 'Full Stack Developer',
    image: '/images/stock3.jpg',
    bio: 'Senior CS student passionate about building scalable web applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    socialLinks: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen'
    }
  },
  {
    name: 'Muhsin Aminu',
    role: 'AI/ML Researcher',
    image: '/images/stock2.jpg',
    bio: 'Graduate researcher focusing on machine learning applications in healthcare. Published author in top AI conferences.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision'],
    socialLinks: {
      github: 'https://github.com/jameswilson',
      linkedin: 'https://linkedin.com/in/jameswilson'
    }
  },
  {
    name: 'Bakir Usman',
    role: 'UI/UX Designer',
    image: '/images/stock3.jpg',
    bio: 'Creative designer with a passion for creating intuitive and accessible user experiences. Advocate for inclusive design.',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    socialLinks: {
      twitter: 'https://twitter.com/emilyrodriguez',
      linkedin: 'https://linkedin.com/in/emilyrodriguez'
    }
  },
  {
    name: 'Muhammad Khalid',
    role: 'Cyber Sec. Professional',
    image: '/images/stock4.jpg',
    bio: 'Senior CS student passionate about building scalable web applications and mentoring junior developers.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    socialLinks: {
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen'
    }
  },
];

export const MemberSpotlight: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
      if (nextIndex < 0) return sampleMembers.length - 1;
      if (nextIndex >= sampleMembers.length) return 0;
      return nextIndex;
    });
  };

  return (
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
                <MemberCard {...sampleMembers[(currentIndex - 1 + sampleMembers.length) % sampleMembers.length]} />
              </motion.div>
              <motion.div
                animate={{ opacity: 0.5, scale: 0.9, x: 60 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 -right-64 blur-[2px]"
              >
                <MemberCard {...sampleMembers[(currentIndex + 1) % sampleMembers.length]} />
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
                  <MemberCard {...sampleMembers[currentIndex]} />
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
            {sampleMembers.map((_, index) => (
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
  );
};
