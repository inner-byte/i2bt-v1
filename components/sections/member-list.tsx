'use client';

import { useState, useEffect } from 'react';
import { MemberCard } from './member-card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';

export function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const debouncedSearch = useDebounce(search, 300);
  const debouncedSkill = useDebounce(skill, 300);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });

        if (debouncedSearch) {
          params.append('search', debouncedSearch);
        }

        if (debouncedSkill) {
          params.append('skill', debouncedSkill);
        }

        const response = await fetch(`/api/members?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch members');
        }

        setMembers(data.users);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [page, debouncedSearch, debouncedSkill]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            />
          </div>
        </div>
        <div className="sm:w-64">
          <input
            type="text"
            placeholder="Filter by skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <div className="h-8 w-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          </motion.div>
        ) : members.length > 0 ? (
          <motion.div
            key="members"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-secondary"
          >
            No members found
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-secondary/20 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed button-hover"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-secondary/20 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed button-hover"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
