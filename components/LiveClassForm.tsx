'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { liveClassService } from '@/services/liveClassService';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

interface LiveClassFormProps {
  courseId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LiveClassForm({ courseId, onClose, onSuccess }: LiveClassFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    course_id: courseId || '',
    title: '',
    description: '',
    meet_link: '',
    scheduled_at: '',
    duration_minutes: 60,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getMyCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.course_id) {
      setError('Please select a course');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Class title is required');
      return false;
    }
    if (!formData.meet_link.trim()) {
      setError('Google Meet link is required');
      return false;
    }
    if (!formData.meet_link.includes('meet.google.com')) {
      setError('Please provide a valid Google Meet link');
      return false;
    }
    if (!formData.scheduled_at) {
      setError('Date and time are required');
      return false;
    }

    const scheduledDate = new Date(formData.scheduled_at);
    if (scheduledDate <= new Date()) {
      setError('Scheduled time must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await liveClassService.createLiveClass({
        course_id: parseInt(formData.course_id as string),
        title: formData.title,
        description: formData.description,
        meet_link: formData.meet_link,
        scheduled_at: formData.scheduled_at,
        duration_minutes: formData.duration_minutes,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create live class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
          <CardTitle>Schedule Live Class</CardTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Select Course *
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Title */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Class Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Description / Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
              />
            </div>

            {/* Google Meet Link */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Google Meet Link *
              </label>
              <div className="flex items-center gap-2">
                <LinkIcon className="size-5 text-[#78909C]" />
                <input
                  type="url"
                  name="meet_link"
                  value={formData.meet_link}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                />
              </div>
              <p className="text-xs text-[#78909C] mt-1">
                Copy the link from your Google Meet room
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Date & Time *
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-[#78909C]" />
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Duration (minutes)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-[#78909C]" />
                  <select
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={150}>2.5 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#E0E0E0]">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Scheduling...' : 'Schedule Class'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
