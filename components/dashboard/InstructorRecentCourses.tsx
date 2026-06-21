'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Eye, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';

interface Course {
  id: number;
  title: string;
  enrollment_count?: number;
  status: string;
  thumbnail_url?: string;
  created_at?: string;
}

export default function InstructorRecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourses();
        const coursesData = Array.isArray(response) 
          ? response 
          : response?.data || response?.courses || [];
        
        // Get only the 3 most recent courses
        const recent = coursesData.slice(0, 3);
        setCourses(recent);
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch courses:', err);
        
        const status = err.response?.status;
        if (!status || status >= 500) {
          setError('Failed to load courses');
        } else {
          setError('');
        }
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
            <Eye className="size-3" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700">
            <BookOpen className="size-3" />
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
            <AlertCircle className="size-3" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
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
          <CardTitle>Recent Courses</CardTitle>
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

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              No courses created yet
            </p>
            <Link href="/instructor/courses">
              <Button variant="outline" size="sm">
                Create Course
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
          <CardTitle>Recent Courses</CardTitle>
          <Link href="/instructor/courses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/instructor/courses/${course.id}`}
              className="block"
            >
              <div className="p-4 border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1E3A5F] truncate">
                      {course.title}
                    </h4>
                    {course.created_at && (
                      <p className="text-xs text-[#78909C] mt-1">
                        Created: {formatDate(course.created_at)}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-[#78909C]">
                        <Users className="size-3" />
                        <span>{course.enrollment_count || 0} students</span>
                      </div>
                      {course.enrollment_count && course.enrollment_count > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-[#7CB342]">
                          <TrendingUp className="size-3" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {getStatusBadge(course.status)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
