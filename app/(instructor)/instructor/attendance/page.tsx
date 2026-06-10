'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Calendar, CheckCircle2, Loader2, ClipboardCheck } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { attendanceService } from '@/services/attendanceService';
import type { Course } from '@/types';

import AttendanceInsights from '@/components/AttendanceInsights';

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getInstructorCourses();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">Attendance Management</h1>
          <p className="text-sm text-[#78909C] mt-1">
            Mark attendance for your courses and track student participation
          </p>
        </div>
      </div>

      {/* Insights */}
      <AttendanceInsights />

      {/* Course Cards */}
      {courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">No courses found</h3>
              <p className="text-sm text-[#78909C]">
                You don't have any published courses assigned to you yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#1E88E5]/10 to-[#1E88E5]/20 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="size-12 text-[#1E88E5]/60" />
                  </div>
                )}
                
                {/* Category Badge */}
                {course.category_name && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-xs font-medium bg-white/90 text-[#1E3A5F] rounded-full shadow-sm">
                      {course.category_name}
                    </span>
                  </div>
                )}

                {/* Student Count Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-bold bg-[#1E88E5] text-white rounded-full shadow-sm flex items-center gap-1">
                    <Users className="size-3" />
                    {course.enrolled_students || 0}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-[#1E3A5F] line-clamp-2 group-hover:text-[#1E88E5] transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-[#78909C] line-clamp-2 mt-1">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-[#78909C]">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{course.duration_value} {course.duration_unit}</span>
                    </div>
                    {course.level && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.level === 'beginner' ? 'bg-[#EFF6FF] text-[#1E40AF]' :
                        course.level === 'intermediate' ? 'bg-[#FEF3C7] text-[#D97706]' :
                        'bg-[#FEE2E2] text-[#EC407A]'
                      }`}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E0E0E0]">
                    <Link href={`/instructor/attendance/${course.id}`} className="flex-1">
                      <Button className="w-full flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Mark Attendance
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}