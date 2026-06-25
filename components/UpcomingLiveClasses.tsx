'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Video, ExternalLink } from 'lucide-react';
import { liveClassService } from '@/services/liveClassService';

interface UpcomingClass {
  id: number;
  title: string;
  course_name: string;
  student_name: string;
  scheduled_at: string;
  meet_link?: string;
  duration_minutes: number;
  status: string;
}

export default function UpcomingLiveClasses() {
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await liveClassService.getLiveClasses({ status: 'scheduled' });
        
        const now = new Date().getTime();
        const upcoming = (response.liveClasses || [])
          .filter((cls: any) => {
            const classTime = new Date(cls.scheduled_at).getTime();
            return classTime > now;
          })
          .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
          .slice(0, 5)
          .map((cls: any) => ({
            id: cls.id,
            title: cls.title,
            course_name: cls.course?.title || 'Unknown Course',
            student_name: cls.student?.name || 'Unknown Student',
            scheduled_at: cls.scheduled_at,
            meet_link: cls.meet_link,
            duration_minutes: cls.duration_minutes || 60,
            status: cls.status
          }));

        setUpcomingClasses(upcoming);
      } catch (error) {
        console.error('Error fetching upcoming classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const classTime = new Date(dateString);
    const diff = classTime.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Starting soon';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (upcomingClasses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No upcoming classes scheduled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h2>
      </div>

      <div className="space-y-4">
        {upcomingClasses.map((cls) => (
          <div
            key={cls.id}
            className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-purple-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {cls.title}
                </h3>
                <p className="text-sm text-gray-600 truncate mb-3">
                  {cls.course_name}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{cls.student_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(cls.scheduled_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(cls.scheduled_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {getTimeUntil(cls.scheduled_at)}
                </span>
                {cls.meet_link && (
                  <a
                    href={cls.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
