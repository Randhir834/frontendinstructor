'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import CourseCard from '@/components/ui/CourseCard';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import type { Course, Category } from '@/types';
import { PageLoading } from '@/components/ui/LoadingSpinner';

function InstructorCoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    category_id?: string;
    level?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }>({
    search: searchParams?.get('search') || undefined,
    status: searchParams?.get('status') || undefined,
    category_id: searchParams?.get('category_id') || undefined,
    level: searchParams?.get('level') || undefined,
    sort_by: searchParams?.get('sort_by') || 'created_at',
    sort_order: (searchParams?.get('sort_order') as 'asc' | 'desc') || 'desc'
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await courseService.getMyCourses(cleanFilters);
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id: number) => {
    window.location.href = `/instructor/courses/${id}/edit`;
  };

  const handleFiltersChange = (newFilters: {
    search?: string;
    status?: string;
    category_id?: string;
    level?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Header with Gradient */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              My Courses
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 ml-0 sm:ml-14 lg:ml-16">
          Manage your courses and engage with students
        </p>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div className="relative mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <Loader2 className="absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 animate-spin text-white" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading your courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex p-4 sm:p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full mb-4 sm:mb-6">
                <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">No courses found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                {filters.search || Object.values(filters).some(v => v && v !== 'created_at' && v !== 'desc')
                  ? 'Try adjusting your filters or search terms.'
                  : 'You haven\'t been assigned to any courses yet. Contact your administrator to get started.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userRole="instructor"
              onEdit={handleEdit}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InstructorCoursesPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading courses..." />}>
      <InstructorCoursesContent />
    </Suspense>
  );
}