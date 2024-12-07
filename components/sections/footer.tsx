'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CodeBracketIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  HashtagIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Forum', href: '/forum' },
    { name: 'Contact', href: '/contact' },
  ],
  community: [
    { name: 'Join Us', href: '#' },
    { name: 'Mentorship', href: '#' },
    { name: 'Code of Conduct', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
  social: [
    { name: 'GitHub', href: '#', icon: CodeBracketIcon },
    { name: 'LinkedIn', href: '#', icon: LinkIcon },
    { name: 'Twitter', href: '#', icon: ChatBubbleLeftRightIcon },
    { name: 'Discord', href: '#', icon: HashtagIcon },
  ],
};

const contactInfo = [
  { icon: MapPinIcon, text: 'University Campus, Innovation Hub' },
  { icon: EnvelopeIcon, text: 'contact@i2bt.org' },
  { icon: PhoneIcon, text: '(555) 123-4567' },
];

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              I2BT
            </Link>
            <p className="text-gray-600 text-sm">
              Empowering students through technology and innovation.
            </p>
            {/* Contact Information */}
            <div className="space-y-3 pt-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-600"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Quick Links</h3>
            <motion.ul 
              role="list" 
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Community</h3>
            <motion.ul 
              role="list" 
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {navigation.community.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Stay Updated</h3>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe to our newsletter for the latest updates and opportunities.
            </p>
            <form className="mt-6">
              <motion.div 
                className="flex gap-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-lg border-0 bg-gray-50 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6"
                  placeholder="Enter your email"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-none rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <motion.div 
          className="mt-10 border-t border-gray-900/10 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center space-x-10">
            {navigation.social.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.p 
          className="mt-10 text-center text-xs leading-5 text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Made with <HeartIcon className="w-4 h-4 inline-block text-red-500 mx-1" /> by I2BT Team &copy; {new Date().getFullYear()}
        </motion.p>
      </div>
    </footer>
  );
};
