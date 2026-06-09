'use client';

import { useEffect, useState, Suspense } from 'react';
import { Calendar, Clock, Users, Loader2, Plus, Edit2, Trash2, ExternalLink, AlertCircle, BookOpen, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { liveClassService } from '@/services/liveClassService';
import LiveClassForm from '@/components/LiveClassForm';
import Link from 'next/link';

interface LiveClass {
  id: number;
  title: string;
  description: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  created_at: string;
}

interface CourseWithLiveClasses {
  course_id: number;
  course_title: string;
  course_description: string;
  thumbnail_url: string;
  course_status: string;
  enrollment_count: number;
  live_classes: LiveClass[];
}

function InstructorCourseLiveClassesContent() {
  const [courses, setCourses] = useState<CourseWithLiveClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [error, setError] = useState('');

  const fetchCoursesWithLiveClasses = async () => {
    try {
      setLoading(true);
      const data = await liveClassService.getCoursesWithLiveClasses();
      setCourses(data.courses || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch courses with live classes:', err);
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesWithLiveClasses();
  }, []);

  const handleScheduleClass = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowForm(true);
  };

  const handleDelete = async (classId: number) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      await liveClassService.deleteLiveClass(classId);
      fetchCoursesWithLiveClasses();
    } catch (err) {
      setError('Failed to delete live class');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getUpcomingClasses = (liveClasses: LiveClass[]) => {
    return liveClasses.filter(lc => new Date(lc.scheduled_at) > new Date());
  };

  const totalClasses = courses.reduce((sum, course) => sum + course.live_classes.length, 0);
  const totalUpcoming = courses.reduce((sum, course) => sum + getUpcomingClasses(course.live_classes).length, 0);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">Live Classes by Course</h1>
          <p className="text-sm text-[#78909C] mt-1">
            Manage live classes for each of your courses
          </p>
        </div>

        <Link href="/instructor/live-classes">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="size-4" />
            View All Classes
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E3A5F]">{courses.length}</div>
              <div className="text-sm text-[#78909C]">Total Courses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E88E5]">{totalUpcoming}</div>
              <div className="text-sm text-[#78909C]">Upcoming Classes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#AB47BC]">{totalClasses}</div>
              <div className="text-sm text-[#78909C]">Total Classes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">
                No courses assigned
              </h3>
              <p className="text-sm text-[#78909C]">
                You don't have any courses assigned yet. Contact your admin to get courses assigned.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => {
            const upcomingClasses = getUpcomingClasses(course.live_classes);
            
            return (
              <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b border-[#E0E0E0]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="size-5 text-[#1E88E5] flex-shrink-0" />
                        <CardTitle className="text-lg truncate">{course.course_title}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#78909C]">
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          {course.enrollment_count} students
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="size-3" />
                          {course.live_classes.length} classes
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {upcomingClasses.length} upcoming
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleScheduleClass(course.course_id)}
                      size="sm"
                      className="flex items-center gap-2 flex-shrink-0"
                    >
                      <Plus className="size-4" />
                      <span className="hidden sm:inline">Schedule</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {course.live_classes.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="size-10 text-[#E0E0E0] mx-auto mb-3" />
                      <p className="text-sm text-[#78909C] mb-4">
                        No live classes scheduled yet
                      </p>
                      <Button
                        onClick={() => handleScheduleClass(course.course_id)}
                        size="sm"
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus className="size-4" />
                        Schedule First Class
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {course.live_classes.map((liveClass) => {
                        const isUpcoming = new Date(liveClass.scheduled_at) > new Date();
                        
                        return (
                          <div
                            key={liveClass.id}
                            className={`p-3 rounded-lg border transition-all ${
                              isUpcoming
                                ? 'border-[#1E88E5] bg-[#1E88E5]/5'
                                : 'border-[#E0E0E0] bg-[#FAFAFA]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-[#1E3A5F] truncate">
                                  {liveClass.title}
                                </h4>
                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#78909C]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {formatDateTime(liveClass.scheduled_at)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {liveClass.duration_minutes} min
                                  </div>
                                </div>
                                {liveClass.description && (
                                  <p className="text-xs text-[#78909C] mt-2 line-clamp-2">
                                    {liveClass.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col gap-2">
                                <a
                                  href={liveClass.meet_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                                  title="Open Google Meet"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                                <button
                                  onClick={() => handleDelete(liveClass.id)}
                                  className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete class"
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Live Class Form Modal */}
      {showForm && (
        <LiveClassForm
          courseId={selectedCourseId}
          onClose={() => {
            setShowForm(false);
            setSelectedCourseId(undefined);
          }}
          onSuccess={() => {
            fetchCoursesWithLiveClasses();
          }}
        />
      )}
    </div>
  );
}

export default function InstructorCourseLiveClassesPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    }>
      <InstructorCourseLiveClassesContent />
    </Suspense>
  );
}
