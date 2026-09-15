'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, SlidersHorizontal, Loader2, CalendarX, AlertCircle, RefreshCw } from 'lucide-react';
import { scheduledClassService } from '@/services/scheduledClassService';
import { ScheduledClass } from '@/types';
import ScheduledClassCard from '@/components/ui/ScheduledClassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ScheduledClassesPage() {
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ScheduledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch scheduled classes
  const fetchScheduledClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduledClassService.getScheduledClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err: any) {
      console.error('Error fetching scheduled classes:', err);
      setError(err.response?.data?.error || 'Failed to load scheduled classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledClasses();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...classes];
    const now = new Date();

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.title.toLowerCase().includes(search) ||
          cls.course_title.toLowerCase().includes(search) ||
          cls.description?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((cls) => {
        const scheduledDate = new Date(cls.scheduled_at);
        const classEndTime = new Date(scheduledDate.getTime() + cls.duration_minutes * 60000);
        
        if (statusFilter === 'upcoming') {
          return scheduledDate > now && cls.status === 'scheduled';
        }
        if (statusFilter === 'live') {
          return scheduledDate <= now && now <= classEndTime && cls.status === 'scheduled';
        }
        if (statusFilter === 'completed') {
          return cls.status === 'completed' || (classEndTime < now && cls.status === 'scheduled');
        }
        return true;
      });
    }

    // Sort by scheduled date (upcoming first, then by date)
    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduled_at);
      const dateB = new Date(b.scheduled_at);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredClasses(filtered);
  }, [classes, searchTerm, statusFilter]);

  // Get counts for each status
  const getCounts = () => {
    const now = new Date();
    let upcoming = 0;
    let live = 0;
    let completed = 0;

    classes.forEach((cls) => {
      const scheduledDate = new Date(cls.scheduled_at);
      const classEndTime = new Date(scheduledDate.getTime() + cls.duration_minutes * 60000);
      
      if (scheduledDate > now && cls.status === 'scheduled') {
        upcoming++;
      } else if (scheduledDate <= now && now <= classEndTime && cls.status === 'scheduled') {
        live++;
      } else if (cls.status === 'completed' || (classEndTime < now && cls.status === 'scheduled')) {
        completed++;
      }
    });

    return { upcoming, live, completed, total: classes.length };
  };

  const counts = getCounts();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your scheduled classes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Classes</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={fetchScheduledClasses}>
            <RefreshCw className="size-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="relative">
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-10"></div>
          
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Scheduled Classes
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Manage all your upcoming and past live sessions
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={fetchScheduledClasses}
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
              >
                <RefreshCw className="size-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{counts.total}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{counts.upcoming}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Live Now</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{counts.live}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-600">{counts.completed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by class or course name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Toggle Filters Button */}
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto"
          >
            <SlidersHorizontal className="size-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Classes
              </button>
              <button
                onClick={() => setStatusFilter('upcoming')}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'upcoming'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setStatusFilter('live')}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'live'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Live Now
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarX className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No classes found' : 'No scheduled classes yet'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Your scheduled live classes will appear here. Create classes from your course pages.'}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-6"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredClasses.map((scheduledClass) => (
            <ScheduledClassCard key={scheduledClass.id} scheduledClass={scheduledClass} />
          ))}
        </div>
      )}
    </div>
  );
}
