'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  BellIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { Workshop } from '@/types/workshop';
import { WorkshopRegistrationModal } from './workshop-registration-modal';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

// Mock data for workshops
const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript in this comprehensive workshop.',
    date: '2024-02-15',
    time: '10:00 AM',
    duration: '2 hours',
    instructor: {
      name: 'Sarah Johnson',
      role: 'Senior Web Developer',
      avatar: '/images/stock4.jpg',
    },
    skillLevel: 'Beginner',
    maxParticipants: 30,
    currentParticipants: 15,
    prerequisites: ['Basic computer knowledge', 'Laptop with internet connection'],
    thumbnail: '/images/stock1.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    description: 'Deep dive into advanced React patterns and best practices.',
    date: '2024-02-20',
    time: '2:00 PM',
    duration: '3 hours',
    instructor: {
      name: 'Michael Chen',
      role: 'Lead Frontend Engineer',
      avatar: '/images/stock2.jpg',
    },
    skillLevel: 'Advanced',
    maxParticipants: 25,
    currentParticipants: 18,
    prerequisites: ['React basics', 'JavaScript fundamentals', 'ES6+ knowledge'],
    thumbnail: '/images/stock3.jpg',
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: 3,
    title: 'Cloud Architecture with AWS',
    description: 'Learn to design and implement scalable cloud solutions using AWS services.',
    date: '2024-02-25',
    time: '1:00 PM',
    duration: '3 hours',
    instructor: {
      name: 'James Wilson',
      role: 'Cloud Architect',
      avatar: '/images/stock4.jpg',
    },
    skillLevel: 'Intermediate',
    maxParticipants: 20,
    currentParticipants: 12,
    prerequisites: ['Basic cloud knowledge', 'Linux fundamentals'],
    thumbnail: '/images/stock1.jpg',
    tags: ['AWS', 'Cloud', 'DevOps'],
  },
];

const getSkillLevelColor = (level: Workshop['skillLevel']) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Advanced: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[level] || colors.Beginner;
};

export const UpcomingWorkshops = () => {
  const { user, login } = useAuth();
  const [workshops] = useState<Workshop[]>(MOCK_WORKSHOPS);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % workshops.length);
  }, [workshops.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + workshops.length) % workshops.length);
  }, [workshops.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoPlaying) {
      intervalId = setInterval(nextSlide, 10000); // Change slide every 10 seconds
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, nextSlide]);

  const handleRegister = async (workshop: Workshop) => {
    if (!user) {
      login();
      return;
    }
    setSelectedWorkshop(workshop);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (formData: any) => {
    console.log('Registration form submitted:', formData);
    if (selectedWorkshop) {
      setShowRegistrationModal(false);
    }
  };

  const addToCalendar = (workshop: Workshop) => {
    const startTime = new Date(`${workshop.date}T${workshop.time}`);
    const endTime = new Date(startTime.getTime() + parseInt(workshop.duration) * 60 * 60 * 1000);
    
    const event = {
      title: workshop.title,
      description: workshop.description,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      duration: workshop.duration,
    };

    console.log('Adding to calendar:', event);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Workshops</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our expert-led workshops to enhance your skills and stay ahead in technology
          </p>
        </motion.div>

        <div className="relative">
          {/* Workshop Slider */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <Image
                    src={workshops[currentIndex].thumbnail}
                    alt={workshops[currentIndex].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="max-w-3xl">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold mb-4"
                    >
                      {workshops[currentIndex].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-gray-200 mb-6"
                    >
                      {workshops[currentIndex].description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap items-center gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5" />
                        <span>{new Date(workshops[currentIndex].date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        <span>{workshops[currentIndex].time} ({workshops[currentIndex].duration})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5" />
                        <span>{workshops[currentIndex].currentParticipants}/{workshops[currentIndex].maxParticipants} Participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(workshops[currentIndex].skillLevel)}`}>
                          {workshops[currentIndex].skillLevel}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-4 mt-8"
                    >
                      <button
                        onClick={() => handleRegister(workshops[currentIndex])}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                      >
                        Register Now
                      </button>
                      <button
                        onClick={() => addToCalendar(workshops[currentIndex])}
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors"
                      >
                        Add to Calendar
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {workshops.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              />
            ))}
          </div>
        </div>

        {/* Workshop Details Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
            >
              {/* Ribbon */}
              {workshop.currentParticipants >= workshop.maxParticipants * 0.8 && (
                <div className="absolute -right-12 top-6 rotate-45 bg-red-500 px-12 py-1 text-sm font-medium text-white">
                  Almost Full
                </div>
              )}

              <div className="relative h-48">
                <Image
                  src={workshop.thumbnail}
                  alt={workshop.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="relative p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{workshop.title}</h3>
                <p className="mb-4 text-gray-600 line-clamp-2">{workshop.description}</p>

                <div className="mb-4 flex items-center gap-4">
                  <Image
                    src={workshop.instructor.avatar}
                    alt={workshop.instructor.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{workshop.instructor.name}</p>
                    <p className="text-sm text-gray-500">{workshop.instructor.role}</p>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Available Spots</span>
                    <span className="font-medium text-blue-600">
                      {workshop.maxParticipants - workshop.currentParticipants} left
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(workshop.currentParticipants / workshop.maxParticipants) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRegister(workshop)}
                    className="flex-1 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => addToCalendar(workshop)}
                    className="rounded-xl bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <CalendarDaysIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedWorkshop && (
        <WorkshopRegistrationModal
          workshop={selectedWorkshop}
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </section>
  );
};
