'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Video, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { liveClassService } from '@/services/liveClassService';

interface ScheduleLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
  onSuccess?: () => void;
}

export default function ScheduleLiveClassModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onSuccess,
}: ScheduleLiveClassModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meet_link: '',
    date: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Class title is required');
      return;
    }

    if (!formData.meet_link.trim()) {
      setError('Google Meet link is required');
      return;
    }

    if (!formData.date || !formData.start_time) {
      setError('Date and start time are required');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.meet_link)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    // Calculate duration in minutes
    let durationMinutes = 60; // Default
    if (formData.start_time && formData.end_time) {
      const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
      const [endHours, endMinutes] = formData.end_time.split(':').map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      durationMinutes = endTotalMinutes - startTotalMinutes;

      if (durationMinutes <= 0) {
        setError('End time must be after start time');
        return;
      }
    }

    // Combine date and time
    const scheduledAt = new Date(`${formData.date}T${formData.start_time}`);
    
    // Check if scheduled time is in the future
    if (scheduledAt <= new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    try {
      setLoading(true);
      await liveClassService.createLiveClass({
        course_id: courseId,
        title: formData.title,
        description: formData.description || undefined,
        meet_link: formData.meet_link,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        meet_link: '',
        date: '',
        start_time: '',
        end_time: '',
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule live class');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        meet_link: '',
        date: '',
        start_time: '',
        end_time: '',
      });
      setError('');
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Schedule Live Class</h2>
            <p className="text-sm text-[#64748B] mt-1">Course: {courseTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-[#64748B] hover:text-[#1E293B] disabled:opacity-50"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Class Title */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Class Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* Google Meet Link */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              Google Meet Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.meet_link}
              onChange={(e) => setFormData({ ...formData, meet_link: e.target.value })}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-[#64748B] mt-1">
              Create a Google Meet link and paste it here
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">
              <Calendar className="inline size-4 mr-1" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={today}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                <Clock className="inline size-4 mr-1" />
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                <Clock className="inline size-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Scheduling...' : 'Schedule Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
