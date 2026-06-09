'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Loader2, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Users, 
  Filter,
  Search,
  Eye,
  CalendarDays,
  Timer,
  User
} from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { liveClassService } from '@/services/liveClassService';
import Link from 'next/link';
import type { LiveClass } from '@/types';

interface ScheduledClassCard extends LiveClass {
  course_title?: string;
  instructor_name?: string;
  thumbnail_url?: string;
  enrolled_count?: number;
}

export default function ScheduledClassesPage() {
  const [classes, setClasses] = useState<ScheduledClassCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchScheduledClasses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await liveClassService.getLiveClasses();
      setClasses(data.liveClasses || []);
    } catch (err: any) {
      console.error('Failed to fetch scheduled classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledClasses();
  }, []);

  const getClassStatus = (scheduledAt: string, durationMinutes: number) => {
    const now = new Date();
    const scheduledDate = new Date(scheduledAt);
    const endDate = new Date(scheduledDate.getTime() + durationMinutes * 60000);

    if (now < scheduledDate) return 'upcoming';
    if (now >= scheduledDate && now <= endDate) return 'live';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'live': return 'Live';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const filteredClasses = classes.filter(c => {
    const status = getClassStatus(c.scheduled_at, c.duration_minutes);
    const matchesFilter = filter === 'all' || status === filter;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: classes.length,
    upcoming: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'upcoming').length,
    live: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'live').length,
    completed: classes.filter(c => getClassStatus(c.scheduled_at, c.duration_minutes) === 'completed').length,
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const handleJoinClass = (meetLink: string) => {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  };

  // Loading skeleton component
  const ClassCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-t-xl" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <CalendarDays className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Scheduled Classes Available
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {filter === 'upcoming' && "You don't have any upcoming classes scheduled."}
        {filter === 'live' && "No classes are currently live."}
        {filter === 'completed' && "No completed classes found."}
        {filter === 'all' && "You haven't scheduled any classes yet."}
      </p>
      <Link href="/instructor/live-classes">
        <Button variant="primary">
          <Video className="w-4 h-4 mr-2" />
          Schedule a Class
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduled Classes</h1>
        <p className="text-gray-600">Manage and view all your scheduled live classes</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ClassCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Classes Grid */}
      {!loading && (
        <>
          {filteredClasses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => {
                const status = getClassStatus(classItem.scheduled_at, classItem.duration_minutes);
                const { date, time } = formatDateTime(classItem.scheduled_at);
                
                return (
                  <Card 
                    key={classItem.id} 
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white border border-gray-200"
                  >
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-xl overflow-hidden">
                        {classItem.thumbnail_url ? (
                          <img 
                            src={classItem.thumbnail_url} 
                            alt={classItem.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-16 h-16 text-primary-600 opacity-60" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                          </span>
                        </div>

                        {/* Live Indicator */}
                        {status === 'live' && (
                          <div className="absolute top-4 left-4 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-medium bg-red-500 px-2 py-1 rounded">
                              LIVE
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title and Course */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {classItem.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span className="truncate">{classItem.course_title || 'Course Name'}</span>
                          </div>
                        </div>

                        {/* Class Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{date}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{time}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Timer className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{formatDuration(classItem.duration_minutes)}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{classItem.instructor_name || 'You'}</span>
                          </div>

                          {classItem.enrolled_count !== undefined && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{classItem.enrolled_count} students enrolled</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          {status === 'live' || status === 'upcoming' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleJoinClass(classItem.meet_link)}
                              className="flex-1"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {status === 'live' ? 'Join Now' : 'Join Class'}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              disabled
                            >
                              Class Ended
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}