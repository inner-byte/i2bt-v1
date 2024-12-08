'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  GlobeAltIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface MemberCardProps {
  member: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    profile?: {
      bio: string | null;
      location: string | null;
      website: string | null;
      skills: string[];
    } | null;
  };
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect p-6 rounded-2xl hover-card"
    >
      <div className="flex items-start space-x-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={member.image || '/images/default-avatar.png'}
            alt={member.name || 'Member'}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/members/${member.id}`}
            className="text-lg font-semibold hover:text-accent transition-colors"
          >
            {member.name}
          </Link>
          {member.profile?.location && (
            <p className="mt-1 text-sm text-secondary flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {member.profile.location}
            </p>
          )}
          {member.profile?.website && (
            <p className="mt-1 text-sm text-secondary flex items-center">
              <GlobeAltIcon className="h-4 w-4 mr-1" />
              <a
                href={member.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {new URL(member.profile.website).hostname}
              </a>
            </p>
          )}
        </div>
      </div>

      {member.profile?.bio && (
        <p className="mt-4 text-sm text-secondary line-clamp-2">
          {member.profile.bio}
        </p>
      )}

      {member.profile?.skills && member.profile.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {member.profile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
