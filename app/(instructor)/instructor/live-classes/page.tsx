'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Calendar, Clock, Loader2, Plus, Trash2, ExternalLink, AlertCircle, BookOpen, Video, Users, X } from 'lucide-react';
import { liveClassService } from '@/services/liveClassService';
import { courseService } from '@/services/courseService';
import type { LiveClass, Course } from '@/types';

export default function InstructorLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('upcoming');
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    meet_link: '',
    date: '',
    start_time: '',
    end_time: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await liveClassService.getLiveClasses();
      setClasses(data.liveClasses || []);
    } catch (err: any) {
      console.error('Failed to fetch live classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseService.getMyCourses();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      await liveClassService.deleteLiveClass(id);
      setClasses(classes.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Failed to delete live class:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.course_id) {
      setFormError('Please select a course');
      return;
    }
    if (!formData.title.trim()) {
      setFormError('Class title is required');
      return;
    }
    if (!formData.meet_link.trim()) {
      setFormError('Google Meet link is required');
      return;
    }
    if (!formData.date || !formData.start_time) {
      setFormError('Date and start time are required');
      return;
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.meet_link)) {
      setFormError('Please enter a valid URL starting with http:// or https://');
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
        setFormError('End time must be after start time');
        return;
      }
    }

    // Combine date and time
    const scheduledAt = new Date(`${formData.date}T${formData.start_time}`);
    
    // Check if scheduled time is in the future
    if (scheduledAt <= new Date()) {
      setFormError('Scheduled time must be in the future');
      return;
    }

    try {
      setFormLoading(true);
      await liveClassService.createLiveClass({
        course_id: parseInt(formData.course_id),
        title: formData.title,
        description: formData.description || undefined,
        meet_link: formData.meet_link,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
      });

      // Reset form
      setFormData({
        course_id: '',
        title: '',
        description: '',
        meet_link: '',
        date: '',
        start_time: '',
        end_time: '',
      });

      fetchLiveClasses();
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to schedule live class');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    if (!formLoading) {
      setFormData({
        course_id: '',
        title: '',
        description: '',
        meet_link: '',
        date: '',
        start_time: '',
        end_time: '',
      });
      setFormError('');
      setShowForm(false);
    }
  };

  const getClassStatus = (scheduledAt: string, durationMinutes: number) => {
    const now = new Date();
    const scheduledDate = new Date(scheduledAt);
    const endDate = new Date(scheduledDate.getTime() + durationMinutes * 60000);

    if (now < scheduledDate) return 'upcoming';
    if (now >= scheduledDate && now <= endDate) return 'live';
    return 'completed';
  };

  const filteredClasses = classes.filter(c => {
    const status = getClassStatus(c.scheduled_at, c.duration_minutes);
    
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'live') return status === 'live';
    if (filter === 'completed') return status === 'completed';
    return true;
  });

  const stats = {
    total: classes.length,
    upcoming: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'upcoming').length,
    live: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'live').length,
    completed: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'completed').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-12 animate-spin text-[#1E88E5] mb-4" />
          <p className="text-[#64748B] text-sm">Loading live classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Live Classes</h1>
          <p className="text-[#64748B]">Schedule and manage your live classes</p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Schedule Live Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Video className="size-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E293B]">{stats.total}</div>
              <div className="text-xs text-[#64748B]">Total Classes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="size-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E293B]">{stats.upcoming}</div>
              <div className="text-xs text-[#64748B]">Upcoming</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="size-2 bg-red-600 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E293B]">{stats.live}</div>
              <div className="text-xs text-[#64748B]">Live Now</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="size-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E293B]">{stats.completed}</div>
              <div className="text-xs text-[#64748B]">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8F0]">
        {[
          { key: 'upcoming' as const, label: 'Upcoming' },
          { key: 'live' as const, label: 'Live Now' },
          { key: 'completed' as const, label: 'Completed' },
          { key: 'all' as const, label: 'All Classes' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.key
                ? 'border-[#1E88E5] text-[#1E88E5]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F8FAFC] rounded-full mb-4">
            <Video className="size-8 text-[#CBD5E1]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
            {classes.length === 0 ? 'No Live Classes Scheduled' : `No ${filter === 'all' ? '' : filter} classes`}
          </h3>
          <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">
            {classes.length === 0
              ? 'Get started by scheduling your first live class with your students.'
              : 'Try adjusting your filter to see other classes.'}
          </p>
          {classes.length === 0 && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="size-4" />
              Schedule Your First Class
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((liveClass) => {
            const status = getClassStatus(liveClass.scheduled_at, liveClass.duration_minutes);
            const statusConfig = {
              upcoming: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Upcoming' },
              live: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Live Now' },
              completed: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', label: 'Completed' },
            };
            
            const config = statusConfig[status];

            return (
              <div 
                key={liveClass.id} 
                className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-[#1E88E5] to-[#1565C0] overflow-hidden">
                  {liveClass.thumbnail_url ? (
                    <img 
                      src={liveClass.thumbnail_url} 
                      alt={liveClass.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="size-12 text-white/50" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} flex items-center gap-1`}>
                    {status === 'live' && (
                      <div className="size-2 bg-red-600 rounded-full animate-pulse" />
                    )}
                    {config.label}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-[#1E293B] line-clamp-2 group-hover:text-[#1E88E5] transition-colors mb-1">
                      {liveClass.title}
                    </h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {liveClass.course_title}
                    </p>
                  </div>

                  {/* Description */}
                  {liveClass.description && (
                    <p className="text-sm text-[#64748B] line-clamp-2">
                      {liveClass.description}
                    </p>
                  )}

                  {/* Date & Time */}
                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <Calendar className="size-4 flex-shrink-0" />
                      <span>{formatDate(liveClass.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <Clock className="size-4 flex-shrink-0" />
                      <span>{formatTime(liveClass.scheduled_at)} • {liveClass.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={liveClass.meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="size-4" />
                      Join
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(liveClass.id);
                      }}
                      className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Live Class Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B]">Schedule Live Class</h2>
              <button
                onClick={handleCloseForm}
                disabled={formLoading}
                className="text-[#64748B] hover:text-[#1E293B] disabled:opacity-50"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{formError}</span>
                </div>
              )}

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={formLoading}
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
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Class Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                  disabled={formLoading}
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
                  disabled={formLoading}
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
                  disabled={formLoading}
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
                  disabled={formLoading}
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end pt-4">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="min-w-[160px]"
                >
                  {formLoading ? 'Scheduling...' : 'Schedule Class'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
