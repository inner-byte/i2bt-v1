'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  initialData?: {
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    skills?: string[];
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    skills: initialData?.skills || [],
  });

  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium">
          Location
        </label>
        <input
          type="text"
          id="location"
          className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="City, Country"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium">
          Website
        </label>
        <input
          type="url"
          id="website"
          className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="github" className="block text-sm font-medium">
            GitHub
          </label>
          <input
            type="text"
            id="github"
            className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="username"
          />
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium">
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedin"
            className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            value={formData.linkedin}
            onChange={(e) =>
              setFormData({ ...formData, linkedin: e.target.value })
            }
            placeholder="username"
          />
        </div>

        <div>
          <label htmlFor="twitter" className="block text-sm font-medium">
            Twitter
          </label>
          <input
            type="text"
            id="twitter"
            className="mt-1 block w-full px-3 py-2 border border-secondary/20 rounded-md shadow-sm focus:ring-accent focus:border-accent"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            placeholder="username"
          />
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium">
          Skills
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="skills"
            className="flex-1 block w-full px-3 py-2 border border-secondary/20 rounded-l-md focus:ring-accent focus:border-accent"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center px-4 py-2 border border-l-0 border-secondary/20 text-sm font-medium rounded-r-md hover:bg-secondary/5 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-accent/20"
              >
                <span className="sr-only">Remove {skill}</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent button-hover"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </motion.form>
  );
}
