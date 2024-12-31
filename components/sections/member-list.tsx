'use client';

import { useState, useEffect } from 'react';
import { MemberCard } from './member-card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  
  const debouncedSearch = useDebounce(search, 300);
  const debouncedSkill = useDebounce(skill, 300);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
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
        setError(error instanceof Error ? error.message : 'An error occurred');
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
              disabled={loading}
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
            disabled={loading}
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
            className="grid gap-6 md:grid-cols-2"
          >
            {[...Array(4)].map((_, i) => (
              <MemberCard
                key={i}
                member={{ id: `skeleton-${i}`, name: '' }}
                isLoading={true}
              />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="text-red-500 mb-2">{error}</div>
            <Button
              variant="outline"
              onClick={() => setPage(1)}
            >
              Try Again
            </Button>
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
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={user?.id === member.id}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-secondary mb-4">
              {debouncedSearch || debouncedSkill
                ? 'No members found matching your search criteria'
                : 'No members found'}
            </p>
            {(debouncedSearch || debouncedSkill) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setSkill('');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
