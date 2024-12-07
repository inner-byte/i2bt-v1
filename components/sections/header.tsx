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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [notifications, setNotifications] = useState(sampleNotifications);
  const pathname = usePathname();
  const { user, loading, login, logout, signup } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Successfully logged in!');
      } else {
        await signup(formData.email, formData.password, formData.name);
        toast.success('Successfully registered!');
      }
      setAuthModalOpen(false);
      setFormData({ email: '', password: '', name: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

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
        <div className="hidden md:flex items-center space-x-1">
          {navigation.slice(3).map((item) => {
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

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 ml-4">
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen(true)}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </motion.button>

          {/* Notifications */}
          {user && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                {unreadCount > 0 ? (
                  <BellIconSolid className="w-4 h-4" />
                ) : (
                  <BellIcon className="w-4 h-4" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-blue-600 text-[10px] text-white text-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notifications Panel */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <div className="mt-4 space-y-3">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              notification.read ? 'bg-gray-50' : 'bg-blue-50'
                            }`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Menu */}
          {!loading && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setAuthModalOpen(true)}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name ? user.name.charAt(0) : '?'}
                    </span>
                  </div>
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {userMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <CogIcon className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-4 h-4" />
            ) : (
              <Bars3Icon className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 pt-20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 text-lg outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAuthModalOpen(false);
            }}
          >
            <div className="container mx-auto px-4 h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isLogin ? 'Login' : 'Register'}
                    </h2>
                    <button
                      onClick={() => setAuthModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required={!isLogin}
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isLogin ? 'Login' : 'Register'}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
