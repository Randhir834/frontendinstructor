'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import CourseCard from '@/components/ui/CourseCard';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import type { Course, Category } from '@/types';

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
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">My Courses</h1>
        <p className="text-sm text-[#78909C] mt-1">
          Manage your courses and track student progress
        </p>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">No courses found</h3>
              <p className="text-sm text-[#78909C] mb-6">
                {filters.search || Object.values(filters).some(v => v && v !== 'created_at' && v !== 'desc')
                  ? 'Try adjusting your filters or search terms.'
                  : 'You haven\'t been assigned to any courses yet. Contact your administrator to get started.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Suspense fallback={
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    }>
      <InstructorCoursesContent />
    </Suspense>
  );
}