'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Users, BookOpen, FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { courseMaterialService, type CourseMaterial } from '@/services/courseMaterialService';
import { enrollmentService } from '@/services/enrollmentService';
import { useSocket } from '@/hooks/useSocket';
import { socketService } from '@/services/socketService';
import { getAvatarUrl } from '@/utils/avatarUtils';
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
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Toggle folder expansion
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

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
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="size-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card gradient>
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 inline-block mb-4">
                <BookOpen className="size-16 text-blue-500 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Course not found</h3>
              <p className="text-sm text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
              <Link href="/instructor/courses">
                <Button variant="gradient">Back to My Courses</Button>
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
      
      // For DOC/DOCX/PPT/PPTX files, use online viewer
      if (['ppt', 'document'].includes(material.file_type)) {
        const fileUrl = encodeURIComponent(urlResponse.secureUrl);
        
        // Use Microsoft Office Online Viewer for better compatibility
        // This works for both PPT and DOC files
        const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`;
        
        // Open in new tab
        window.open(viewerUrl, '_blank');
      } else {
        // For PDF and other files, open directly
        window.open(urlResponse.secureUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to view material:', error);
      alert('Failed to open material. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{course.title}</h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              course.status === 'published' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
              course.status === 'archived' ? 'bg-red-50 text-red-600 border border-red-200' :
              'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </span>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            {instructorNames} • {course.duration_value} {course.duration_unit} • {course.level}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow" gradient>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{enrollmentCount}</div>
              <div className="text-sm md:text-base text-gray-600 mt-3 font-medium">Students Enrolled</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow" gradient>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{course.total_lessons || 0}</div>
              <div className="text-sm md:text-base text-gray-600 mt-3 font-medium">Total Lessons</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Google Meet Link Management */}
        <Card gradient className="hover:shadow-md transition-shadow">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Google Meet Link for Live Classes</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Set a default Google Meet link that will be automatically used for all live classes of this course. 
                You can override it for individual classes if needed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={course.google_meet_link || ''}
                  onChange={(e) => setCourse(prev => prev ? { ...prev, google_meet_link: e.target.value } : null)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Button
                  onClick={async () => {
                    try {
                      await courseService.updateCourse(courseId, {
                        google_meet_link: course.google_meet_link || undefined
                      });
                      alert('Google Meet link updated successfully!');
                    } catch (error) {
                      console.error('Failed to update Google Meet link:', error);
                      alert('Failed to update Google Meet link. Please try again.');
                    }
                  }}
                  className="whitespace-nowrap"
                >
                  Save Link
                </Button>
              </div>
              
              {course.google_meet_link && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <ExternalLink className="size-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 mb-1">Current Meet Link</p>
                    <a
                      href={course.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {course.google_meet_link}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Overview */}
        <Card gradient className="hover:shadow-md transition-shadow">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-6">
            {course.description && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <BookOpen className="size-4 text-blue-600" />
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{course.description}</p>
              </div>
            )}

            {course.what_you_learn && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">What Students Will Learn</h4>
                <div className="space-y-2.5">
                  {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="size-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.requirements && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
                <div className="space-y-2.5">
                  {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="size-2 bg-gray-400 rounded-full mt-2 flex-shrink-0 group-hover:bg-gray-600 transition-colors" />
                      <span className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors">{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Materials */}
        <Card gradient className="hover:shadow-md transition-shadow">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Course Materials</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {materialsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-blue-500" />
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 inline-block mb-4">
                  <FileText className="size-16 text-blue-500 mx-auto" />
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">No materials uploaded yet</p>
                <p className="text-sm text-gray-500">Materials will be uploaded by the admin</p>
                <p className="text-sm text-blue-600 mt-3 font-medium">New materials will appear automatically when uploaded</p>
              </div>
            ) : (
              (() => {
                // Group materials by folder
                const groupedMaterials = materials.reduce((acc, material) => {
                  const folder = material.folder_path || 'Root';
                  if (!acc[folder]) {
                    acc[folder] = [];
                  }
                  acc[folder].push(material);
                  return acc;
                }, {} as Record<string, CourseMaterial[]>);

                return (
                  <div className="space-y-6">
                    {Object.keys(groupedMaterials).map((folderPath) => {
                      const isExpanded = expandedFolders[folderPath] !== false; // Default to expanded
                      const fileCount = groupedMaterials[folderPath].length;
                      
                      return (
                        <div key={folderPath} className="space-y-3">
                          {folderPath !== 'Root' && (
                            <button
                              onClick={() => toggleFolder(folderPath)}
                              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                            >
                              {isExpanded ? (
                                <ChevronDown className="size-5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="size-5 text-blue-600 flex-shrink-0" />
                              )}
                              <svg className="size-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              <div className="flex-1 text-left">
                                <h4 className="font-semibold text-blue-900">{folderPath}</h4>
                                <p className="text-xs text-blue-600 mt-0.5">
                                  {fileCount} file{fileCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </button>
                          )}
                          
                          {isExpanded && (
                            <div className="space-y-3">
                              {groupedMaterials[folderPath].map((material) => (
                                <div key={material.id} className="group flex items-center justify-between p-4 md:p-5 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 hover:shadow-md">
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                                      {courseMaterialService.getFileIcon(material.file_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">{material.title}</h4>
                                      {material.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{material.description}</p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span className="font-medium">{courseMaterialService.formatFileSize(material.file_size)}</span>
                                        <span>•</span>
                                        <span>Uploaded by {material.uploaded_by_name}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden sm:inline">{courseMaterialService.formatDate(material.created_at)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewMaterial(material)}
                                      className="flex items-center gap-2 group-hover:border-blue-500 group-hover:text-blue-600 group-hover:bg-blue-50"
                                    >
                                      <span>View</span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </CardContent>
        </Card>

        {/* Student Enrollments */}
        <Card gradient className="hover:shadow-md transition-shadow">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {enrollmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-blue-500" />
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 inline-block mb-4">
                  <Users className="size-16 text-blue-500 mx-auto" />
                </div>
                <p className="text-base font-medium text-gray-700">No students enrolled yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.slice(0, 5).map((enrollment, index) => {
                  const avatarUrl = getAvatarUrl(enrollment.avatar_url, enrollment.student_name);
                  const showFallback = !enrollment.avatar_url;
                  
                  return (
                    <div key={index} className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:border-blue-200 hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 hover:shadow-sm">
                      {!showFallback ? (
                        <img 
                          src={avatarUrl} 
                          alt={enrollment.student_name}
                          className="size-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            // Fallback to default avatar if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`size-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${!showFallback ? 'hidden' : ''}`}>
                        <Users className="size-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{enrollment.student_name}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
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
  );
}