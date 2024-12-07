import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  description: string;
  imageUrl: string;
}

const sampleEvents: Event[] = [
  {
    id: 1,
    title: 'Tech Innovation Summit 2024',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'Main Campus Auditorium',
    category: 'Conference',
    attendees: 150,
    description: 'Join us for a day of inspiring talks and workshops on the latest tech innovations.',
    imageUrl: '/images/stock3.jpg'
  },
  {
    id: 2,
    title: 'AI Workshop Series',
    date: '2024-03-20',
    time: '2:00 PM',
    location: 'Innovation Lab',
    category: 'Workshop',
    attendees: 45,
    description: 'Hands-on workshop series exploring practical applications of AI and machine learning.',
    imageUrl: '/images/stock6.jpg'
  },
  {
    id: 3,
    title: 'Startup Networking Night',
    date: '2024-03-25',
    time: '6:00 PM',
    location: 'Student Center',
    category: 'Networking',
    attendees: 80,
    description: 'Connect with fellow entrepreneurs and industry professionals in a casual setting.',
    imageUrl: '/images/stock1.jpg'
  }
];

export const FeaturedEvents: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sampleEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#F3F8FA] to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Events</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover upcoming events and opportunities to learn, connect, and grow with our community
        </p>
      </motion.div>

      <div className="relative h-[500px] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex justify-center items-center px-4"
          >
            <div className="w-full max-w-4xl">
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sampleEvents[currentIndex].imageUrl})` }}
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                      {sampleEvents[currentIndex].category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {sampleEvents[currentIndex].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {sampleEvents[currentIndex].description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                      <span>{formatDate(sampleEvents[currentIndex].date)} at {sampleEvents[currentIndex].time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-5 h-5 text-blue-500" />
                      <span>{sampleEvents[currentIndex].location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-5 h-5 text-blue-500" />
                      <span>{sampleEvents[currentIndex].attendees} Attendees</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                      onClick={() => {}}
                    >
                      RSVP Now
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                      onClick={() => {}}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {sampleEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
