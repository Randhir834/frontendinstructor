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
      <div className="relative overflow-hidden flex-shrink-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-32 sm:h-36 lg:h-40 xl:h-44 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-32 sm:h-36 lg:h-40 xl:h-44 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400" />
          </div>
        )}
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price Badge - Hidden for instructors */}
        {userRole !== 'instructor' && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-white/95 backdrop-blur-sm text-gray-800 rounded-full shadow-lg">
              {formatPrice(course.price)}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
        <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Title and Level */}
          <div className="space-y-1.5 sm:space-y-2 flex-shrink-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight flex-1 min-w-0 pb-0.5">
                {course.title}
              </h3>
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 shadow-sm ${
                course.level ? levelColors[course.level] || defaultLevelColor : defaultLevelColor
              }`}>
                {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'N/A'}
              </span>
            </div>
            
            {course.description && (
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-shrink-0">
            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
            </div>
            <span className="truncate font-medium flex-1 min-w-0">{instructorNames}</span>
          </div>

          {/* Course Stats - Hidden for instructors */}
          {userRole !== 'instructor' && course.duration_value && course.duration_unit && (
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span>{formatDuration(course.duration_value, course.duration_unit)}</span>
              </div>
              {course.enrollment_count !== undefined && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
              )}
            </div>
          )}

          {/* Enrollment Status for Students */}
          {userRole === 'student' && course.is_enrolled && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-blue-200 flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-semibold">Enrolled</span>
            </div>
          )}

          {/* Actions - Only show for non-instructor roles */}
          {showActions && userRole !== 'instructor' && (
            <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-gray-100 flex-shrink-0 mt-auto">
              {/* Show large View button for students and admin */}
              <Button 
                variant="gradient" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = getViewLink();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 touch-manipulation"
              >
                {userRole === 'student' ? (
                  course.is_enrolled ? (
                    <>
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Continue</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>View</span>
                    </>
                  )
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>View</span>
                  </>
                )}
              </Button>

              {/* Only show Edit button for admin users */}
              {userRole === 'admin' && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(course.id)}
                  className="px-2.5 sm:px-3 hover:bg-blue-50 hover:border-blue-300 touch-manipulation"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              )}

              {userRole === 'admin' && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(course.id)}
                  disabled={deleting}
                  className="px-2.5 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 touch-manipulation"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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