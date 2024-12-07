'use client';

import { FC, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeBracketIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Technology {
  name: string;
  color: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  technologies: Technology[];
  githubUrl: string;
  demoUrl?: string;
  stars: number;
  contributors: number;
  progress: number;
  category: string;
}

const sampleProjects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Study Assistant",
    description: "An intelligent study companion that helps students optimize their learning through personalized recommendations and analytics.",
    thumbnail: "/images/stock8.jpg",
    technologies: [
      { name: "React", color: "blue" },
      { name: "Python", color: "yellow" },
      { name: "TensorFlow", color: "orange" },
      { name: "FastAPI", color: "green" }
    ],
    githubUrl: "https://github.com/i2bt/study-assistant",
    demoUrl: "https://study-assistant.i2bt.org",
    stars: 128,
    contributors: 8,
    progress: 85,
    category: "AI/ML"
  },
  {
    id: 2,
    title: "Campus Connect Hub",
    description: "A centralized platform for university students to collaborate, share resources, and organize events.",
    thumbnail: "/images/stock5.jpg",
    technologies: [
      { name: "Next.js", color: "black" },
      { name: "TypeScript", color: "blue" },
      { name: "Prisma", color: "purple" },
      { name: "PostgreSQL", color: "blue" }
    ],
    githubUrl: "https://github.com/i2bt/campus-hub",
    demoUrl: "https://campus.i2bt.org",
    stars: 95,
    contributors: 12,
    progress: 70,
    category: "Web App"
  },
  {
    id: 3,
    title: "EcoTrack Mobile",
    description: "Mobile application for tracking and reducing carbon footprint through daily activities and sustainable choices.",
    thumbnail: "/images/stock7.jpg",
    technologies: [
      { name: "React Native", color: "blue" },
      { name: "Node.js", color: "green" },
      { name: "MongoDB", color: "green" },
      { name: "AWS", color: "orange" }
    ],
    githubUrl: "https://github.com/i2bt/eco-track",
    stars: 76,
    contributors: 5,
    progress: 60,
    category: "Mobile"
  },
  {
    id: 4,
    title: "Smart Campus IoT",
    description: "IoT system for monitoring and optimizing energy usage across university buildings using smart sensors.",
    thumbnail: "/images/stock4.jpg",
    technologies: [
      { name: "Arduino", color: "teal" },
      { name: "Raspberry Pi", color: "red" },
      { name: "Python", color: "yellow" },
      { name: "InfluxDB", color: "purple" }
    ],
    githubUrl: "https://github.com/i2bt/smart-campus",
    stars: 142,
    contributors: 15,
    progress: 90,
    category: "IoT"
  }
];

const getTechColor = (color: string) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
    teal: "bg-teal-100 text-teal-700",
    black: "bg-gray-100 text-gray-700"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-orange-500";
};

export const ProjectShowcase: FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  const handleImageLoad = useCallback((projectId: number) => {
    setImageLoading(prev => ({ ...prev, [projectId]: false }));
  }, []);

  const filteredProjects = filter === "all" 
    ? sampleProjects 
    : sampleProjects.filter(p => p.category === filter);

  const categories = ["all", ...new Set(sampleProjects.map(p => p.category))];

  return (
    <section className="py-20 bg-gradient-to-br from-[#F8FAFC] to-white" role="region" aria-label="Project Showcase">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Project Showcase</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our innovative projects and contributions to the tech community
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-8" role="tablist" aria-label="Project categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              role="tab"
              aria-selected={filter === category}
              aria-controls={`${category}-panel`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          role="tabpanel"
          id={`${filter}-panel`}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <div 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
              >
                {/* Project Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
                  {imageLoading[project.id] !== false && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className={`object-cover transform group-hover:scale-105 transition-transform duration-500 ${
                      imageLoading[project.id] !== false ? 'opacity-0' : 'opacity-100'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
                    onLoad={() => handleImageLoad(project.id)}
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500/80 backdrop-blur-sm rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTechColor(tech.color)}`}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${getProgressColor(project.progress)}`}
                      />
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {project.contributors}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                      </a>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GlobeAltIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Preview Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
                  <Image
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 50vw"
                    priority
                    onLoad={() => handleImageLoad(selectedProject.id)}
                  />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 id="modal-title" className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedProject.description}
                  </p>

                  <div className="space-y-6">
                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 text-sm font-medium rounded-full ${getTechColor(tech.color)}`}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Project Stats</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <StarIcon className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                          <span className="block text-lg font-semibold text-gray-800">{selectedProject.stars}</span>
                          <span className="text-sm text-gray-600">Stars</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <UsersIcon className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <span className="block text-lg font-semibold text-gray-800">{selectedProject.contributors}</span>
                          <span className="text-sm text-gray-600">Contributors</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <ChartBarIcon className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <span className="block text-lg font-semibold text-gray-800">{selectedProject.progress}%</span>
                          <span className="text-sm text-gray-600">Complete</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                        <CodeBracketIcon className="w-5 h-5" />
                        View on GitHub
                      </a>
                      {selectedProject.demoUrl && (
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                        >
                          <GlobeAltIcon className="w-5 h-5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
