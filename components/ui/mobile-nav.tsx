'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  Bars3Icon as Bars3IconSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: 'Community', href: '/community', icon: UserGroupIcon, activeIcon: UserGroupIconSolid },
  { name: 'Projects', href: '/projects', icon: RocketLaunchIcon, activeIcon: RocketLaunchIconSolid },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
  { name: 'Menu', href: '/menu', icon: Bars3Icon, activeIcon: Bars3IconSolid },
];

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe"
    >
      <div className="flex justify-around items-center p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
