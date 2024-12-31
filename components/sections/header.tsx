'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'react-hot-toast';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Events', href: '/events' },
  { name: 'Resources', href: '/resources' },
  { name: 'Contact', href: '/contact' },
];

const dropdownMenus = {
  Projects: [
    { name: 'Featured Projects', href: '/projects/featured' },
    { name: 'Start a Project', href: '/projects/new' },
    { name: 'Project Guidelines', href: '/projects/guidelines' },
    { name: 'Browse All', href: '/projects' },
  ],
  Resources: [
    { name: 'Learning Paths', href: '/resources/learning-paths' },
    { name: 'Documentation', href: '/resources/docs' },
    { name: 'Tutorials', href: '/resources/tutorials' },
    { name: 'Community Wiki', href: '/resources/wiki' },
  ],
};

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: NotificationProps[] = [
  {
    id: '1',
    title: 'New Project Invitation',
    message: "You've been invited to collaborate on 'AI Study Assistant'",
    time: '5m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: "Tech Talk: 'Future of Web Development' starts in 1 hour",
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'Project Update',
    message: 'Your pull request has been approved and merged',
    time: '2h ago',
    read: true,
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>(sampleNotifications);
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      setUserMenuOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300`}
    >
      <nav className={`max-w-4xl w-full mx-4 rounded-full h-14 px-4 flex items-center ${
        isScrolled ? 'my-2 bg-white/80 shadow-sm backdrop-blur-sm' : 'my-4 bg-[#E5EEF3]/80'
      }`}>
        {/* Left Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.slice(0, 3).map((item) => {
            const isDropdown = item.name in dropdownMenus;
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => isDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => isDropdown && setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {item.name}
                  {isDropdown && (
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {isDropdown && activeDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-56 mt-1 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="py-2">
                      {dropdownMenus[item.name as keyof typeof dropdownMenus].map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Logo - Centered */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-gray-900"
            >
              I2BT
            </motion.div>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {isLoading ? (
            <div className="p-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full"
              />
            </div>
          ) : user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BellIcon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name || 'User'}</span>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Your Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-2xl md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-base font-medium rounded-lg ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
