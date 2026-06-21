'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Loader2, AlertCircle, PlayCircle, Users } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService } from '@/services/liveClassService';

interface LiveClass {
  id: number;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  meet_link: string;
  course_title: string;
  enrollment_count?: number;
}

export default function InstructorUpcomingLiveClasses() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLiveClasses();

    // Auto-refresh every 30 seconds to update class statuses
    const interval = setInterval(() => {
      fetchLiveClasses();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const data = await liveClassService.getLiveClasses();
      const allClasses = data.liveClasses || data.data || data || [];
      
      // Filter classes that are not yet completed (upcoming or ongoing)
      const activeClasses = allClasses.filter((liveClass: LiveClass) => 
        !isCompleted(liveClass.scheduled_at, liveClass.duration_minutes)
      );

      // Sort: ongoing classes first, then by scheduled time
      const sortedClasses = activeClasses.sort((a: LiveClass, b: LiveClass) => {
        const aIsOngoing = isOngoing(a.scheduled_at, a.duration_minutes);
        const bIsOngoing = isOngoing(b.scheduled_at, b.duration_minutes);

        // Ongoing classes come first
        if (aIsOngoing && !bIsOngoing) return -1;
        if (!aIsOngoing && bIsOngoing) return 1;

        // For same status, sort by scheduled time (earliest first)
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
      });

      // Get only the top 3 classes
      const topClasses = sortedClasses.slice(0, 3);
      setClasses(topClasses);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch live classes:', err);
      
      // Don't show error for 404 (not found) - just show empty state
      const status = err.response?.status;
      if (!status || status >= 500) {
        setError('Failed to load live classes');
      } else {
        setError('');
      }
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const isOngoing = (scheduledAt: string, durationMinutes: number): boolean => {
    const now = new Date();
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    return now >= startTime && now <= endTime;
  };

  const isCompleted = (scheduledAt: string, durationMinutes: number): boolean => {
    const now = new Date();
    const endTime = new Date(new Date(scheduledAt).getTime() + durationMinutes * 60 * 1000);
    return now > endTime;
  };

  const isStartingSoon = (scheduledAt: string): boolean => {
    const now = new Date();
    const startTime = new Date(scheduledAt);
    const diff = startTime.getTime() - now.getTime();
    const minutes = diff / (1000 * 60);
    return minutes > 0 && minutes <= 30;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntilClass = (scheduledAt: string) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime.getTime() - now.getTime();

    if (diff < 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `In ${days}d`;
    }

    if (hours > 0) {
      return `In ${hours}h`;
    }

    return `In ${minutes}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (classes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              No upcoming live classes scheduled
            </p>
            <Link href="/instructor/scheduled-classes">
              <Button variant="outline" size="sm">
                Schedule a Class
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Live Classes</CardTitle>
          <Link href="/instructor/scheduled-classes">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((liveClass) => {
            const classIsOngoing = isOngoing(liveClass.scheduled_at, liveClass.duration_minutes);
            const classIsStartingSoon = isStartingSoon(liveClass.scheduled_at);
            const timeUntil = getTimeUntilClass(liveClass.scheduled_at);

            return (
              <div
                key={liveClass.id}
                className={`p-4 border rounded-lg transition-all ${
                  classIsOngoing
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-500/20'
                    : classIsStartingSoon
                    ? 'border-[#1E88E5] bg-[#F1F8E9]'
                    : 'border-[#E0E0E0] hover:border-[#1E88E5]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#1E3A5F] truncate">
                        {liveClass.title}
                      </h4>
                      {classIsOngoing && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white animate-pulse">
                          <PlayCircle className="size-3" />
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#78909C] mt-1">
                      {liveClass.course_title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#78909C]">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDateTime(liveClass.scheduled_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {liveClass.duration_minutes} min
                      </div>
                      {liveClass.enrollment_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          {liveClass.enrollment_count} students
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!classIsOngoing && timeUntil && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        classIsStartingSoon
                          ? 'bg-[#1E88E5] text-white'
                          : 'bg-[#E0E0E0] text-[#78909C]'
                      }`}>
                        {timeUntil}
                      </span>
                    )}
                    <a
                      href={liveClass.meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        classIsOngoing
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'text-[#1E88E5] hover:text-[#1565C0] hover:bg-blue-50'
                      }`}
                    >
                      {classIsOngoing ? (
                        <>
                          <PlayCircle className="size-3" />
                          Start Class
                        </>
                      ) : (
                        <>
                          <ExternalLink className="size-3" />
                          Join Link
                        </>
                      )}
                    </a>
                  </div>
                </div>
                {classIsOngoing && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      🔴 Your class is live! Students are waiting for you.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
