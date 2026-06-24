'use client';

import Link from 'next/link';
import { BookOpen, Users, Edit, Trash2, Eye, Play, CheckCircle2, Clock, Star } from 'lucide-react';
import Card, { CardContent } from './Card';
import Button from './Button';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course & {
    is_enrolled?: boolean;
  };
  userRole: 'admin' | 'instructor' | 'student';
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  deleting?: boolean;
  showActions?: boolean;
  linkPrefix?: string;
}

export default function CourseCard({ 
  course, 
  userRole, 
  onDelete, 
  onEdit, 
  deleting = false, 
  showActions = true,
  linkPrefix = ''
}: CourseCardProps) {
  const levelColors: Record<string, string> = {
    beginner: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700',
    intermediate: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700',
    advanced: 'bg-gradient-to-r from-red-100 to-pink-100 text-pink-700',
  };

  const defaultLevelColor = 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600';

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return 'Free';
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit}${value > 1 ? '' : ''}`;
  };

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';

  const getViewLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}`;
    return `${linkPrefix}/student/course/${course.id}`;
  };

  const cardContent = (
    <>
      <div className="relative overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-40 sm:h-44 md:h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-float" />
          </div>
        )}
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price Badge - Hidden for instructors */}
        {userRole !== 'instructor' && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 text-xs font-bold bg-white/95 backdrop-blur-sm text-gray-800 rounded-full shadow-lg">
              {formatPrice(course.price)}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-5">
        <div className="space-y-3">
          {/* Title and Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                {course.title}
              </h3>
              <span className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 shadow-sm ${
                course.level ? levelColors[course.level] || defaultLevelColor : defaultLevelColor
              }`}>
                {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'N/A'}
              </span>
            </div>
            
            {course.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
              <Users className="size-3.5 text-purple-600" />
            </div>
            <span className="truncate font-medium">{instructorNames}</span>
          </div>

          {/* Course Stats */}
          {course.duration_value && course.duration_unit && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{formatDuration(course.duration_value, course.duration_unit)}</span>
              </div>
              {course.enrollment_count !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
              )}
            </div>
          )}

          {/* Enrollment Status for Students */}
          {userRole === 'student' && course.is_enrolled && (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-xl border border-blue-200">
              <CheckCircle2 className="size-4" />
              <span className="font-semibold">Enrolled</span>
            </div>
          )}

          {/* Actions - Only show for non-instructor roles */}
          {showActions && userRole !== 'instructor' && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {/* Show large View button for students and admin */}
              <Button 
                variant="gradient" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = getViewLink();
                }}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {userRole === 'student' ? (
                  course.is_enrolled ? (
                    <>
                      <Play className="size-4" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" />
                      View Details
                    </>
                  )
                ) : (
                  <>
                    <Eye className="size-4" />
                    View
                  </>
                )}
              </Button>

              {/* Only show Edit button for admin users */}
              {userRole === 'admin' && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(course.id)}
                  className="px-3 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="size-4" />
                </Button>
              )}

              {userRole === 'admin' && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(course.id)}
                  disabled={deleting}
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </>
  );

  // For instructors, wrap entire card in a Link to make it clickable
  if (userRole === 'instructor') {
    return (
      <Link href={getViewLink()} className="block h-full">
        <div className="group h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
          {cardContent}
        </div>
      </Link>
    );
  }

  // For other roles, return the card without making it clickable
  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {cardContent}
    </div>
  );
}