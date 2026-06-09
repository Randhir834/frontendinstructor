'use client';

import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { liveClassService } from '@/services/liveClassService';

interface ScheduleLiveClassModalProps {
  courseId: number;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleLiveClassModal({
  courseId,
  courseName,
  isOpen,
  onClose,
  onSuccess,
}: ScheduleLiveClassModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meet_link: '',
    scheduled_at: '',
    duration_minutes: 60,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Class title is required');
      return false;
    }

    if (!formData.meet_link.trim()) {
      setError('Google Meet link is required');
      return false;
    }

    if (!formData.meet_link.includes('meet.google.com')) {
      setError('Please enter a valid Google Meet link (must contain meet.google.com)');
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

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      await liveClassService.createLiveClass({
        course_id: courseId,
        title: formData.title,
        description: formData.description,
        meet_link: formData.meet_link,
        scheduled_at: formData.scheduled_at,
        duration_minutes: formData.duration_minutes,
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        meet_link: '',
        scheduled_at: '',
        duration_minutes: 60,
      });

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule live class');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="modal-responsive w-full max-w-2xl bg-white">
        <CardHeader className="flex items-center justify-between border-b border-[#E0E0E0] sticky top-0 bg-white z-10 p-3 sm:p-4">
          <CardTitle className="text-base sm:text-lg">Schedule Live Class</CardTitle>
          <button
            onClick={onClose}
            disabled={loading}
            className="touch-target p-1.5 sm:p-1 hover:bg-[#FAFAFA] rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="size-5 text-[#78909C]" />
          </button>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 md:p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="size-16 bg-[#C5E1A5] rounded-full flex items-center justify-center mb-4">
                <svg className="size-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">Live Class Scheduled!</h3>
              <p className="text-sm text-[#78909C] text-center">
                Your live class has been scheduled successfully. All enrolled students will be notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Course Info */}
              <div className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E0E0E0]">
                <p className="text-sm text-[#78909C]">Course</p>
                <p className="font-medium text-[#1E3A5F]">{courseName}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-[#FEE2E2] border border-[#FECACA] rounded-lg flex items-start gap-3">
                  <AlertCircle className="size-5 text-[#EC407A] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#991B1B]">{error}</p>
                </div>
              )}

              {/* Class Title */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Class Title <span className="text-[#EC407A]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>

              {/* Google Meet Link */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Google Meet Link <span className="text-[#EC407A]">*</span>
                </label>
                <input
                  type="url"
                  name="meet_link"
                  value={formData.meet_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-[#78909C] mt-2">
                  Create a Google Meet room first, then paste the link here
                </p>
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Date & Time <span className="text-[#EC407A]">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-[#78909C] mt-2">
                  Must be in the future
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={loading}
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes (1 hour)</option>
                  <option value={90}>90 minutes (1.5 hours)</option>
                  <option value={120}>120 minutes (2 hours)</option>
                  <option value={150}>150 minutes (2.5 hours)</option>
                  <option value={180}>180 minutes (3 hours)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="button-group-responsive pt-4 border-t border-[#E0E0E0] sticky bottom-0 bg-white -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 touch-target"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 touch-target flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  <span className="hidden sm:inline">{loading ? 'Scheduling...' : 'Schedule Live Class'}</span>
                  <span className="sm:hidden">{loading ? 'Scheduling...' : 'Schedule'}</span>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
