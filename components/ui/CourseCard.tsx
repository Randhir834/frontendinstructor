'use client';

import Link from 'next/link';
import { BookOpen, Users, Edit, Trash2, Eye, Play, CheckCircle2 } from 'lucide-react';
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
    beginner: 'bg-[#EFF6FF] text-[#1E40AF]',
    intermediate: 'bg-[#FEF3C7] text-[#D97706]',
    advanced: 'bg-[#FEE2E2] text-[#EC407A]',
  };

  const defaultLevelColor = 'bg-[#F3F4F6] text-[#6B7280]';

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return 'Free';
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';

  const getViewLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}`;
    return `${linkPrefix}/student/course/${course.id}`;
  };

  const cardContent = (
    <>
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

        {/* Price Badge - Hidden for instructors */}
        {userRole !== 'instructor' && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-bold bg-white/90 text-[#1E293B] rounded-full shadow-sm">
              {formatPrice(course.price)}
            </span>
          </div>
        )}

      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-[#1E3A5F] line-clamp-2 group-hover:text-[#1E88E5] transition-colors">
                {course.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${course.level ? levelColors[course.level] || defaultLevelColor : defaultLevelColor}`}>
                {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'N/A'}
              </span>
            </div>
            
            {course.description && (
              <p className="text-sm text-[#78909C] line-clamp-2">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-[#78909C]">
            <Users className="size-4" />
            <span className="truncate">{instructorNames}</span>
          </div>

          {/* Enrollment Status for Students */}
          {userRole === 'student' && course.is_enrolled && (
            <div className="flex items-center gap-2 text-sm text-[#1E88E5] bg-[#DBEAFE] px-3 py-2 rounded-lg">
              <CheckCircle2 className="size-4" />
              <span className="font-medium">Enrolled</span>
            </div>
          )}

          {/* Actions - Only show for non-instructor roles */}
          {showActions && userRole !== 'instructor' && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
              {/* Show large View button for students and admin */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = getViewLink();
                }}
                className="flex-1 flex items-center gap-2"
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
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(course.id)}
                  className="px-3"
                >
                  <Edit className="size-4" />
                </Button>
              )}

              {userRole === 'admin' && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(course.id)}
                  disabled={deleting}
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <Card className="group hover:shadow-lg transition-all duration-200 border-[#E0E0E0] hover:border-[#1E88E5]/20 h-full flex flex-col cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  // For other roles, return the card without making it clickable
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-[#E0E0E0] hover:border-[#1E88E5]/20 h-full flex flex-col">
      {cardContent}
    </Card>
  );
}