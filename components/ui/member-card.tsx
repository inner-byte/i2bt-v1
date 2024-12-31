'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/auth-context';

interface MemberCardProps {
  member: {
    id: string;
    name: string;
    role?: string;
    image?: string;
    email?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
    graduationYear?: number;
    major?: string;
  };
  variant?: 'default' | 'compact' | 'glass';
  isCurrentUser?: boolean;
  isLoading?: boolean;
}

export const MemberCard: FC<MemberCardProps> = ({
  member,
  variant = 'default',
  isCurrentUser = false,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const {
    id,
    name,
    role,
    image,
    bio,
    location,
    website,
    github,
    linkedin,
    skills,
    graduationYear,
    major,
  } = member;

  if (isLoading) {
    return (
      <motion.div
        className={`animate-pulse ${
          variant === 'glass'
            ? 'glass-effect p-6 rounded-2xl'
            : variant === 'compact'
            ? 'bg-card rounded-lg shadow-sm p-4'
            : 'bg-card rounded-xl shadow-lg overflow-hidden'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-16 w-16" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </motion.div>
    );
  }

  if (variant === 'glass') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-2xl hover-card"
      >
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={image || '/images/default-avatar.png'}
              alt={name || 'Member'}
              fill
              className="rounded-full object-cover"
            />
            {isCurrentUser && (
              <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/members/${id}`}
              className="text-lg font-semibold hover:text-accent transition-colors"
            >
              {name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-green-500">(You)</span>
              )}
            </Link>
            {location && (
              <p className="mt-1 text-sm text-muted-foreground flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {location}
              </p>
            )}
            {website && (
              <p className="mt-1 text-sm text-muted-foreground flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-1" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {new URL(website).hostname}
                </a>
              </p>
            )}
          </div>
        </div>

        {bio && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {bio}
          </p>
        )}

        {skills && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {user && !isCurrentUser && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/members/${id}`}
              className="font-medium hover:underline"
            >
              {name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-green-500">(You)</span>
              )}
            </Link>
            {role && (
              <p className="text-sm text-muted-foreground">{role}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-xl shadow-lg overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary">
        <div className="absolute -bottom-16 inset-x-0 flex justify-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pt-20 pb-6">
        <div className="text-center mb-4">
          <Link
            href={`/members/${id}`}
            className="text-xl font-semibold hover:underline"
          >
            {name}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-green-500">(You)</span>
            )}
          </Link>
          {role && (
            <p className="text-muted-foreground">{role}</p>
          )}
        </div>

        {bio && (
          <p className="text-muted-foreground text-center mb-4 line-clamp-2">
            {bio}
          </p>
        )}

        {(major || graduationYear) && (
          <div className="text-center mb-4">
            {major && (
              <p className="text-sm text-muted-foreground">{major}</p>
            )}
            {graduationYear && (
              <p className="text-sm text-muted-foreground">Class of {graduationYear}</p>
            )}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary">+{skills.length - 4}</Badge>
            )}
          </div>
        )}

        <div className="flex justify-center gap-2">
          {github && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </a>
            </Button>
          )}

          {linkedin && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={`https://linkedin.com/in/${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>LinkedIn</span>
              </a>
            </Button>
          )}

          {isCurrentUser && (
            <Button variant="default" size="sm" asChild>
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
