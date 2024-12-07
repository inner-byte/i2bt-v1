'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  AcademicCapIcon,
  BookOpenIcon,
  VideoCameraIcon,
  LinkIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  ShareIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { AnimatedCounter } from '../ui/animated-counter';
import { useAuth } from '@/contexts/auth-context';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: 'Learning Path' | 'Study Material' | 'Workshop Recording';
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  enrolledCount: number;
  rating: number;
  progress?: number;
  tags: string[];
  url: string;
}

const sampleResources: Resource[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Master the basics of web development with HTML, CSS, and JavaScript through hands-on projects.",
    category: "Learning Path",
    thumbnail: "/images/stock8.jpg",
    difficulty: "Beginner",
    duration: "8 weeks",
    enrolledCount: 1250,
    rating: 4.8,
    progress: 65,
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    url: "/resources/web-dev-fundamentals"
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Comprehensive guide to essential computer science concepts with practical implementations.",
    category: "Study Material",
    thumbnail: "/images/stock4.jpg",
    difficulty: "Intermediate",
    duration: "12 weeks",
    enrolledCount: 890,
    rating: 4.9,
    progress: 30,
    tags: ["DSA", "Python", "Problem Solving", "Coding Interviews"],
    url: "/resources/dsa-guide"
  },
  {
    id: 3,
    title: "AI/ML Workshop Series",
    description: "Recorded sessions from our popular machine learning workshop series with industry experts.",
    category: "Workshop Recording",
    thumbnail: "/images/stock7.jpg",
    difficulty: "Advanced",
    duration: "6 hours",
    enrolledCount: 750,
    rating: 4.7,
    tags: ["Machine Learning", "Python", "TensorFlow", "Neural Networks"],
    url: "/resources/ai-ml-workshop"
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Learn to build cross-platform mobile applications using React Native and modern tools.",
    category: "Learning Path",
    thumbnail: "/images/stock5.jpg",
    difficulty: "Intermediate",
    duration: "10 weeks",
    enrolledCount: 980,
    rating: 4.6,
    progress: 45,
    tags: ["React Native", "Mobile Dev", "JavaScript", "UI/UX"],
    url: "/resources/mobile-dev"
  }
];

const getDifficultyColor = (difficulty: Resource['difficulty']) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700'
  };
  return colors[difficulty];
};

const getCategoryIcon = (category: Resource['category']) => {
  const icons = {
    'Learning Path': AcademicCapIcon,
    'Study Material': BookOpenIcon,
    'Workshop Recording': VideoCameraIcon
  };
  return icons[category];
};

export const ResourceHub: FC = () => {
  const { user, login } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Resource['category'] | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Resource['difficulty'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedResource, setExpandedResource] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async (resource: Resource) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.origin + resource.url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying link to clipboard
      const url = window.location.origin + resource.url;
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    }
  };

  const categories: (Resource['category'] | 'All')[] = ['All', 'Learning Path', 'Study Material', 'Workshop Recording'];
  const difficulties: (Resource['difficulty'] | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredResources = sampleResources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#F8FAFC] to-white" role="region" aria-label="Resource Hub">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Resource Hub</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access curated learning materials, workshops, and resources to accelerate your tech journey
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredResources.map((resource) => {
            const CategoryIcon = getCategoryIcon(resource.category);

            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative group h-full"
              >
                {/* Thumbnail Section - Fixed height */}
                <div className="relative h-52 flex-shrink-0">
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  
                  {/* Badges - Consistent spacing */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <span className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500/80 backdrop-blur-sm rounded-full">
                      {resource.category}
                    </span>
                  </div>

                  {/* Share Button - Consistent positioning */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(resource);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/30 z-10"
                    aria-label="Share resource"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Section - Flexible height with consistent padding */}
                <div className="flex flex-col flex-grow p-6 relative">
                  {!user && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-b-2xl">
                      <LockClosedIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium mb-4">Members Only Content</p>
                      <button
                        onClick={login}
                        className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                      >
                        Login to Access
                      </button>
                    </div>
                  )}

                  {/* Header with Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                    </div>
                    <CategoryIcon className="w-6 h-6 text-blue-500 flex-shrink-0 ml-4" />
                  </div>

                  <div className="space-y-4 mt-auto">
                    {/* Stats - Equal width columns */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-xl">
                        <ClockIcon className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-sm font-medium text-gray-600">{resource.duration}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-xl">
                        <UserGroupIcon className="w-5 h-5 text-gray-400 mb-1" />
                        <AnimatedCounter
                          value={resource.enrolledCount}
                          className="text-sm font-medium text-gray-600"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-xl">
                        <StarIcon className="w-5 h-5 text-yellow-400 mb-1" />
                        <span className="text-sm font-medium text-gray-600">{resource.rating}</span>
                      </div>
                    </div>

                    {/* Progress Bar - Consistent spacing */}
                    {resource.progress !== undefined && (
                      <div className="py-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${resource.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Tags - Consistent spacing and sizing */}
                    <div className="flex flex-wrap gap-2 py-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button - Consistent spacing */}
                    <a
                      href={resource.url}
                      className="block w-full text-center px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                      Access Resource
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State - Consistent with card styling */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
