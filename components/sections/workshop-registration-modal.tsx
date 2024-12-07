'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Workshop } from '@/types/workshop';

interface RegistrationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  expectations: string;
}

interface Props {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: RegistrationFormData) => void;
}

export const WorkshopRegistrationModal: FC<Props> = ({
  workshop,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    experience: '',
    expectations: '',
  });

  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Partial<RegistrationFormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(formData);
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all"
            >
              <div className="absolute right-4 top-4">
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Register for Workshop
                </h3>
                <p className="mt-2 text-gray-600">
                  {workshop.title}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-xl border ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      } px-4 py-2 focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-xl border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } px-4 py-2 focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-xl border ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      } px-4 py-2 focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expectations" className="block text-sm font-medium text-gray-700">
                      What do you hope to learn?
                    </label>
                    <textarea
                      id="expectations"
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-2 font-medium text-white transition-colors ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>

              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-4 rounded-xl p-4 ${
                      submitStatus === 'success'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {submitStatus === 'success' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                      <p className="text-sm font-medium">
                        {submitStatus === 'success'
                          ? 'Registration successful! Redirecting...'
                          : 'Registration failed. Please try again.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
