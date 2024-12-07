'use client';

import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  RocketLaunchIcon, 
  AcademicCapIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const socialLinks = [
  { icon: CodeBracketIcon, href: '#', label: 'GitHub', color: 'hover:bg-gray-800 hover:text-white' },
  { icon: LinkIcon, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white' },
  { icon: ChatBubbleLeftRightIcon, href: '#', label: 'Twitter', color: 'hover:bg-blue-400 hover:text-white' },
  { icon: HashtagIcon, href: '#', label: 'Discord', color: 'hover:bg-purple-600 hover:text-white' }
];

export const CallToAction = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Gradient Spots */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 h-96 w-96 opacity-20">
          <div className="absolute inset-0 bg-blue-500 blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 h-96 w-96 opacity-20">
          <div className="absolute inset-0 bg-purple-500 blur-3xl" />
        </div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Join Our Community</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900">
              Ready to Start Your Journey?
            </h2>
            
            <p className="text-lg text-gray-600 max-w-md">
              Connect with like-minded individuals, learn from industry experts, and build amazing projects together.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Join Community
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl font-medium shadow-lg hover:bg-purple-700 transition-colors"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Start Project
              </motion.button>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Mentor/Mentee Signup */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center mb-4">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Mentor/Mentee Program</h3>
              </div>
              <p className="text-gray-600 mb-4">Share knowledge or find a mentor to guide your journey.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  Become a Mentor
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                >
                  Find a Mentor
                </motion.button>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center mb-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Stay Updated</h3>
              </div>
              <p className="text-gray-600 mb-4">Get the latest updates about events and opportunities.</p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Subscribe to Newsletter
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
