'use client';

import { useEffect, useMemo, useState } from 'react';
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

type SchemaFieldKey =
  | 'name'
  | 'email'
  | 'whatsapp'
  | 'country'
  | 'role'
  | 'experienceLevel'
  | 'whatBuilding'
  | 'interests';

interface SchemaField {
  key: SchemaFieldKey;
  propertyName: string;
  propertyType: string;
  required: boolean;
  options: string[];
}

interface JoinSchemaResponse {
  fields: SchemaField[];
}

interface JoinFormProps {
  onSuccess?: () => void;
}

const fallbackInterests = [
  'AI & Machine Learning',
  'Robotics',
  'FinTech',
  'HealthTech',
  'Agriculture',
  'Climate Tech',
  'Education',
  'Energy',
  'Other',
];

const fallbackExperienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const formShellClass = 'h-full flex flex-col gap-4';

const defaultFormData: FormData = {
  name: '',
  email: '',
  whatsapp: '',
  country: '',
  role: '',
  interests: [],
  experienceLevel: '',
  whatBuilding: '',
};

export function JoinForm({ onSuccess }: JoinFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [schemaFields, setSchemaFields] = useState<Partial<Record<SchemaFieldKey, SchemaField>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSchemaLoading, setIsSchemaLoading] = useState(true);
  const [schemaLoadError, setSchemaLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSchema = async () => {
    setIsSchemaLoading(true);
    setSchemaLoadError(null);

    try {
      const response = await fetch('/api/join/schema', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Unable to load form schema');
      }

      const data = (await response.json()) as JoinSchemaResponse;
      const nextSchemaFields: Partial<Record<SchemaFieldKey, SchemaField>> = {};
      for (const field of data.fields) {
        nextSchemaFields[field.key] = field;
      }

      if (!nextSchemaFields.name) {
        throw new Error('Notion schema is missing a Name field');
      }

      setSchemaFields(nextSchemaFields);
    } catch (schemaError) {
      setSchemaFields(null);
      setSchemaLoadError(schemaError instanceof Error ? schemaError.message : 'Failed to load form schema');
    } finally {
      setIsSchemaLoading(false);
    }
  };

  useEffect(() => {
    loadSchema();
  }, []);

  const experienceLevels = useMemo(() => {
    const schemaOptions = schemaFields?.experienceLevel?.options ?? [];
    return schemaOptions.length > 0 ? schemaOptions : fallbackExperienceLevels;
  }, [schemaFields]);

  const interests = useMemo(() => {
    const schemaOptions = schemaFields?.interests?.options ?? [];
    return schemaOptions.length > 0 ? schemaOptions : fallbackInterests;
  }, [schemaFields]);

  const isFieldVisible = (field: SchemaFieldKey): boolean => {
    return Boolean(schemaFields?.[field]);
  };

  const isFieldRequired = (field: SchemaFieldKey, fallback: boolean): boolean => {
    if (!schemaFields) {
      return fallback;
    }

    return schemaFields[field]?.required ?? false;
  };

  const fieldType = (field: SchemaFieldKey): string | undefined => schemaFields?.[field]?.propertyType;
  const fieldOptions = (field: SchemaFieldKey): string[] => schemaFields?.[field]?.options ?? [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateBeforeSubmit = () => {
    const errors: string[] = [];

    if (isFieldRequired('name', true) && !formData.name.trim()) {
      errors.push('Name is required');
    }

    if (isFieldVisible('email') && !formData.email.trim()) {
      errors.push('Email is required');
    }

    if (isFieldVisible('whatsapp') && !formData.whatsapp.trim()) {
      errors.push('WhatsApp number is required');
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validationErrors = validateBeforeSubmit();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('. '));
      }

      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setFormData(defaultFormData);
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSchemaLoading) {
    return (
      <div className={formShellClass}>
        <div className="h-full flex flex-col gap-4">
          <div className="px-1">
            <div className="h-3 w-28 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="animate-pulse space-y-6">
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
                <div className="h-3 w-40 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
              </div>
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-24 w-full rounded-md bg-muted" />
              </div>
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
                <div className="h-3 w-36 rounded bg-muted" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-8 rounded bg-muted" />
                  <div className="h-8 rounded bg-muted" />
                  <div className="h-8 rounded bg-muted" />
                  <div className="h-8 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-11 w-full rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (schemaLoadError || !schemaFields) {
    return (
      <div className={formShellClass}>
        <div className="h-full flex items-center">
          <div className="w-full space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Unable to load the form schema.</p>
            <p className="text-sm text-red-700/90">{schemaLoadError ?? 'Please try again.'}</p>
            <Button type="button" onClick={loadSchema} className="bg-foreground text-background hover:bg-foreground/90">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={formShellClass}>
      <div className="px-1">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">Community Intake</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6">
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
          <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">Basic Information</h3>

        {isFieldVisible('name') && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name {isFieldRequired('name', true) ? '*' : ''}
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required={isFieldRequired('name', true)}
            />
          </div>
        )}

        {isFieldVisible('email') && (
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
        )}

        {isFieldVisible('whatsapp') && (
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
              placeholder="+234 801 234 5678"
              required
            />
          </div>
        )}

        {isFieldVisible('country') && (
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            {fieldType('country') === 'select' && fieldOptions('country').length > 0 ? (
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Select country</option>
                {fieldOptions('country').map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Nigeria"
              />
            )}
          </div>
        )}
        </div>

        {(isFieldVisible('role') || isFieldVisible('experienceLevel') || isFieldVisible('whatBuilding')) && (
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
            <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">Your Profile</h3>

          {isFieldVisible('role') && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role / Title
              </label>
              {fieldType('role') === 'select' && fieldOptions('role').length > 0 ? (
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select role</option>
                  {fieldOptions('role').map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Founder, Data Scientist, Designer"
                />
              )}
            </div>
          )}

          {isFieldVisible('experienceLevel') && (
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">
                Experience Level
              </label>
              {fieldType('experienceLevel') === 'select' ? (
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="experienceLevel"
                  name="experienceLevel"
                  type="text"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  placeholder="Your experience level"
                />
              )}
            </div>
          )}

          {isFieldVisible('whatBuilding') && (
            <div>
              <label htmlFor="whatBuilding" className="block text-sm font-medium mb-2">
                What are you building, and why now?
              </label>
              <textarea
                id="whatBuilding"
                name="whatBuilding"
                value={formData.whatBuilding}
                onChange={handleInputChange}
                placeholder="Share the problem, who it serves, and what stage you are in."
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
            </div>
          )}
          </div>
        )}

        {isFieldVisible('interests') && (
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4 md:p-5">
            <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">Areas of Interest</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interests.map((interest) => (
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
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
      >
        {isLoading ? 'Joining...' : 'Join the Community'}
      </Button>
    </form>
  );
}
