'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Users, BookOpen, FileText, ExternalLink, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { courseMaterialService, type CourseMaterial } from '@/services/courseMaterialService';
import { enrollmentService } from '@/services/enrollmentService';
import { useSocket } from '@/hooks/useSocket';
import { socketService } from '@/services/socketService';
import { getAvatarUrl } from '@/utils/avatarUtils';
import ScheduleLiveClassModal from '@/components/modals/ScheduleLiveClassModal';
import type { Course } from '@/types';

export default function InstructorCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Get user ID from localStorage or auth context
  const [userId, setUserId] = useState<number | undefined>();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.userId);
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    }
  }, []);

  // Initialize Socket.IO connection
  const { onCourseMaterialUploaded, offCourseMaterialUploaded } = useSocket(userId);

  const fetchMaterials = useCallback(async () => {
    try {
      setMaterialsLoading(true);
      const response = await courseMaterialService.getCourseMaterials(courseId);
      setMaterials(response.materials || []);
    } catch (error) {
      console.error('Failed to fetch course materials:', error);
      setMaterials([]);
    } finally {
      setMaterialsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(courseId);
        setCourse(response.course || null);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setEnrollmentsLoading(true);
        const response = await enrollmentService.getCourseEnrollments(courseId);
        setEnrollments(response.enrollments || []);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        setEnrollments([]);
      } finally {
        setEnrollmentsLoading(false);
      }
    };
    fetchEnrollments();
  }, [courseId]);

  useEffect(() => {
    fetchMaterials();
    
    // Set up polling as fallback for real-time updates
    const pollInterval = setInterval(() => {
      // Only poll if socket is not connected
      if (!socketService.isSocketConnected()) {
        fetchMaterials();
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchMaterials]);

  // Set up real-time material upload listener
  useEffect(() => {
    const handleMaterialUploaded = (data: any) => {
      // Only update if it's for this course
      if (data.courseId === courseId) {
        console.log('New material uploaded:', data.material);
        
        // Add the new material to the list
        setMaterials(prevMaterials => [data.material, ...prevMaterials]);
      }
    };

    onCourseMaterialUploaded(handleMaterialUploaded);

    return () => {
      offCourseMaterialUploaded(handleMaterialUploaded);
    };
  }, [courseId, onCourseMaterialUploaded, offCourseMaterialUploaded]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">Course not found.</p>
              <Link href="/instructor/courses" className="inline-block mt-4">
                <Button variant="outline">Back to My Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';
  const enrollmentCount = course.enrollment_count || 0;

  const handleViewMaterial = async (material: CourseMaterial) => {
    try {
      const tokenResponse = await courseMaterialService.getViewingToken(material.id);
      const urlResponse = await courseMaterialService.getSecureUrl(tokenResponse.token);
      
      // Open in new tab
      window.open(urlResponse.secureUrl, '_blank');
    } catch (error) {
      console.error('Failed to view material:', error);
      alert('Failed to open material. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">{course.title}</h1>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              course.status === 'published' ? 'bg-[#DBEAFE] text-[#1E88E5]' :
              course.status === 'archived' ? 'bg-[#FEE2E2] text-[#991B1B]' :
              'bg-[#F1F5F9] text-[#64748B]'
            }`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-[#64748B]">
            {instructorNames} • {course.duration_value} {course.duration_unit} • {course.level}
          </p>
        </div>
        
        <Button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2"
        >
          <Video className="size-4" />
          Schedule Live Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1E293B]">{enrollmentCount}</div>
              <div className="text-sm text-[#64748B] mt-2">Students Enrolled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D97706]">{course.total_lessons || 0}</div>
              <div className="text-sm text-[#64748B] mt-2">Total Lessons</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.description && (
                <div>
                  <h4 className="font-medium text-[#1E293B] mb-2">Description</h4>
                  <p className="text-[#64748B] leading-relaxed">{course.description}</p>
                </div>
              )}

              {course.what_you_learn && (
                <div>
                  <h4 className="font-medium text-[#1E293B] mb-2">What Students Will Learn</h4>
                  <div className="space-y-1">
                    {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="size-1.5 bg-[#1E88E5] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-[#64748B]">{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.requirements && (
                <div>
                  <h4 className="font-medium text-[#1E293B] mb-2">Requirements</h4>
                  <div className="space-y-1">
                    {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="size-1.5 bg-[#64748B] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-[#64748B]">{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
                </div>
              ) : materials.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="size-12 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">No materials uploaded yet</p>
                  <p className="text-xs text-[#64748B] mt-1">Materials will be uploaded by the admin</p>
                  <p className="text-xs text-[#1E88E5] mt-2">New materials will appear automatically when uploaded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1E88E5]/20 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">
                          {courseMaterialService.getFileIcon(material.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#1E293B] truncate">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-[#64748B] line-clamp-2 mt-1">{material.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B]">
                            <span>{courseMaterialService.formatFileSize(material.file_size)}</span>
                            <span>•</span>
                            <span>Uploaded by {material.uploaded_by_name}</span>
                            <span>•</span>
                            <span>{courseMaterialService.formatDate(material.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMaterial(material)}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="size-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>



          {/* Student Enrollments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Enrollments</CardTitle>
                <Link href={`/instructor/courses/${courseId}/students`} className="text-sm text-[#1E88E5] hover:underline">
                  View All Students
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="size-12 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">No students enrolled yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.slice(0, 5).map((enrollment, index) => {
                    const avatarUrl = getAvatarUrl(enrollment.avatar_url, enrollment.student_name);
                    const showFallback = !enrollment.avatar_url;
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                        {!showFallback ? (
                          <img 
                            src={avatarUrl} 
                            alt={enrollment.student_name}
                            className="size-10 rounded-full object-cover"
                            onError={(e) => {
                              // Fallback to default avatar if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                              const fallback = (e.target as HTMLImageElement).nextElementSibling;
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`size-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center ${!showFallback ? 'hidden' : ''}`}>
                          <Users className="size-5 text-[#1E88E5]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#1E293B]">{enrollment.student_name}</h4>
                          <p className="text-sm text-[#64748B]">Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>


      </div>
      
      {/* Schedule Live Class Modal */}
      <ScheduleLiveClassModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        courseId={courseId}
        courseTitle={course.title}
        onSuccess={() => setShowScheduleModal(false)}
      />
    </div>
  );
}