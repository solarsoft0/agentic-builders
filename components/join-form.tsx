'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  role: string;
  interests: string[];
  experienceLevel: string;
  whatBuilding: string;
}

interface JoinFormProps {
  onSuccess?: () => void;
}

const interests = [
  'AI & Machine Learning',
  'Robotics',
  'FinTech',
  'HealthTech',
  'Agriculture',
  'Climate Tech',
  'Education',
  'Energy',
  'Other'
];

const experienceLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export function JoinForm({ onSuccess }: JoinFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    country: '',
    role: '',
    interests: [],
    experienceLevel: '',
    whatBuilding: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.whatsapp) {
        throw new Error('Name, email, and WhatsApp number are required');
      }

      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      // Success - reset form and call callback
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        country: '',
        role: '',
        interests: [],
        experienceLevel: '',
        whatBuilding: ''
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
            WhatsApp Number *
          </label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            Country
          </label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Your country"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Profile</h3>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-2">
            Role / Title
          </label>
          <Input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g., Founder, Data Scientist, Designer"
          />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="whatBuilding" className="block text-sm font-medium mb-2">
            What are you building on?
          </label>
          <textarea
            id="whatBuilding"
            name="whatBuilding"
            value={formData.whatBuilding}
            onChange={handleInputChange}
            placeholder="Tell us about your current project or idea..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          />
        </div>
      </div>

      {/* Interests Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Areas of Interest</h3>
        <div className="grid grid-cols-2 gap-3">
          {interests.map(interest => (
            <label key={interest} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="w-4 h-4 rounded border-input"
              />
              <span className="text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-foreground text-background hover:bg-foreground/90"
      >
        {isLoading ? 'Joining...' : 'Join the Community'}
      </Button>
    </form>
  );
}
