'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon as SearchIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { slideIn } from '@/lib/animations';

const navigation = [
  { name: 'Home', href: '/', Icon: HomeIcon },
  { name: 'Search', href: '/search', Icon: SearchIcon },
  { name: 'Notifications', href: '/notifications', Icon: BellIcon },
  { name: 'Profile', href: '/profile', Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideIn}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="bg-white/80 backdrop-blur-lg border-t">
        <div className="flex items-center justify-around h-16">
          {navigation.map(({ name, href, Icon }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={name}
                href={href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNav"
                      className="absolute -bottom-2 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2"
                    />
                  )}
                </motion.div>
                <span className="text-xs">{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
