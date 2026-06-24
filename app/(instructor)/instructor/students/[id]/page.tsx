'use client';

import { useEffect, useState, use } from 'react';
import { Calendar, BookOpen, User, Mail, Phone, GraduationCap, Video, Loader2, Clock, Plus, X, Minus, CheckCircle } from 'lucide-react';
import { enrollmentService } from '@/services/enrollmentService';
import { liveClassService } from '@/services/liveClassService';
import type { StudentEnrolledCourse } from '@/types';

interface StudentInfo {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  avatar_url: string | null;
  grade: string | null;
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const studentId = Number(id);
  
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [courses, setCourses] = useState<StudentEnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [schedulingCourseId, setSchedulingCourseId] = useState<number | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState<number | null>(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch student info from students list
      const studentsResponse = await enrollmentService.getInstructorStudents();
      const studentInfo = studentsResponse.students.find((s: any) => s.student_id === studentId);
      
      if (studentInfo) {
        setStudent({
          student_id: studentInfo.student_id,
          student_name: studentInfo.student_name,
          student_email: studentInfo.student_email,
          student_phone: studentInfo.student_phone || null,
          avatar_url: studentInfo.avatar_url || null,
          grade: studentInfo.grade || null
        });
      }
      
      // Fetch enrolled courses for this student (only instructor's courses)
      const coursesResponse = await enrollmentService.getStudentEnrolledCourses(studentId);
      setCourses(coursesResponse.courses || []);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (enrollmentId: number, currentCompleted: number, increment: boolean, totalLessons: number) => {
    const newCompleted = increment ? currentCompleted + 1 : currentCompleted - 1;
    
    // Validate bounds
    if (newCompleted < 0 || newCompleted > totalLessons) {
      return;
    }

    try {
      setUpdatingProgress(enrollmentId);
      
      await enrollmentService.updateCompletedLessons(enrollmentId, newCompleted);
      
      // Update local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.enrollment_id === enrollmentId 
            ? { ...course, completed_lessons: newCompleted }
            : course
        )
      );
    } catch (error: any) {
      console.error('Error updating progress:', error);
      alert(error.response?.data?.error || 'Failed to update lesson progress');
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleScheduleClass = async (courseId: number) => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      setScheduling(true);
      
      // Combine date and time into ISO string
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      
      const course = courses.find(c => c.course_id === courseId);
      
      await liveClassService.scheduleForStudent({
        student_id: studentId,
        course_id: courseId,
        scheduled_at: scheduledAt,
        title: `Live Class - ${course?.course_title}`,
        description: `Live class with ${student?.student_name}`,
      });

      // Success notification
      alert('Live class scheduled successfully! The student will see it on their Live Classes page.');
      
      // Reset form
      setSchedulingCourseId(null);
      setScheduleDate('');
      setScheduleTime('');
    } catch (error: any) {
      console.error('Error scheduling class:', error);
      alert(error.response?.data?.error || 'Failed to schedule live class');
    } finally {
      setScheduling(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    // Set minimum to current date
    return now.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4" />
            <p className="text-[#78909C]">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-[#E0E0E0] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Student Not Found</h3>
          <p className="text-[#78909C]">This student is not enrolled in any of your courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Student Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#EC407A] px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {student.avatar_url ? (
              <img
                src={student.avatar_url}
                alt={student.student_name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-white text-[#EC407A] flex items-center justify-center font-bold text-3xl border-4 border-white shadow-lg">
                {student.student_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {student.student_name}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{student.student_email}</span>
                </div>
                {student.student_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{student.student_phone}</span>
                  </div>
                )}
                {student.grade && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">Grade {student.grade}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#1E88E5]" />
          Enrolled Courses (Assigned to You)
        </h2>
        
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-flex p-6 bg-gradient-to-br from-[#EFF6FF] via-[#FFF1F2] to-[#FCE7F3] rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-[#EC407A]" />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">No Assigned Courses</h3>
            <p className="text-[#78909C]">This student is not enrolled in any courses assigned to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => {
              const progressPercentage = course.total_lessons > 0 
                ? (course.completed_lessons / course.total_lessons) * 100 
                : 0;
              const isScheduling = schedulingCourseId === course.course_id;

              return (
                <div key={course.course_id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#E0E0E0] hover:border-[#1E88E5] transition-all">
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-[#FAFAFA] to-[#F5F5F5] px-6 py-4 border-b border-[#E0E0E0]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">{course.course_title}</h3>
                        {course.course_description && (
                          <p className="text-sm text-[#78909C] line-clamp-2">{course.course_description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        course.enrollment_status === 'active'
                          ? 'bg-[#C5E1A5] text-[#2E7D32]'
                          : course.enrollment_status === 'completed'
                          ? 'bg-[#BBDEFB] text-[#1565C0]'
                          : 'bg-[#E0E0E0] text-[#424242]'
                      }`}>
                        {course.enrollment_status.charAt(0).toUpperCase() + course.enrollment_status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-6 py-4 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#1E3A5F]">Lesson Progress</span>
                      <span className="text-sm font-bold text-[#1E88E5]">
                        {course.completed_lessons}/{course.total_lessons} Lessons
                      </span>
                    </div>
                    
                    {/* Manual Progress Controls */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <button
                        onClick={() => handleUpdateProgress(course.enrollment_id, course.completed_lessons, false, course.total_lessons)}
                        disabled={course.completed_lessons === 0 || updatingProgress === course.enrollment_id}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-[#E0E0E0] hover:border-[#EC407A] hover:bg-[#FCE4EC] text-[#EC407A] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E0E0E0] disabled:hover:bg-white"
                        title="Decrease completed lessons"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-[#E0E0E0] min-w-[140px] justify-center">
                        {updatingProgress === course.enrollment_id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#1E88E5]" />
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                            <span className="text-lg font-bold text-[#1E3A5F]">
                              {course.completed_lessons}
                            </span>
                            <span className="text-sm text-[#78909C]">/ {course.total_lessons}</span>
                          </>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleUpdateProgress(course.enrollment_id, course.completed_lessons, true, course.total_lessons)}
                        disabled={course.completed_lessons >= course.total_lessons || updatingProgress === course.enrollment_id}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-[#E0E0E0] hover:border-[#2E7D32] hover:bg-[#E8F5E9] text-[#2E7D32] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E0E0E0] disabled:hover:bg-white"
                        title="Increase completed lessons"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="w-full bg-[#E0E0E0] rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#78909C]">
                        {Math.round(progressPercentage)}% Complete
                      </p>
                      {course.completed_lessons === course.total_lessons && course.total_lessons > 0 && (
                        <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Schedule Live Class Section */}
                  <div className="px-6 py-4">
                    {!isScheduling ? (
                      <button
                        onClick={() => {
                          if (!course.google_meet_link) {
                            alert('No Google Meet link is set for this course. Please add one in the course settings first.');
                            return;
                          }
                          setSchedulingCourseId(course.course_id);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] rounded-lg hover:from-[#1565C0] hover:to-[#1E88E5] transition-all shadow-md hover:shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        Schedule Live Class
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[#1E3A5F] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#1E88E5]" />
                            Schedule New Live Class
                          </h4>
                          <button
                            onClick={() => {
                              setSchedulingCourseId(null);
                              setScheduleDate('');
                              setScheduleTime('');
                            }}
                            className="text-[#78909C] hover:text-[#424242]"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              min={getMinDateTime()}
                              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] text-sm"
                            />
                          </div>

                          <div className="bg-[#EFF6FF] border border-[#BBDEFB] rounded-lg p-3">
                            <div className="flex items-start gap-2 text-xs text-[#1565C0]">
                              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium mb-1">Duration: 1 Hour (Fixed)</p>
                                <p className="text-[#78909C]">
                                  Google Meet link: {course.google_meet_link ? 'Available' : 'Not set'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleScheduleClass(course.course_id)}
                              disabled={scheduling || !scheduleDate || !scheduleTime}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2E7D32] to-[#43A047] rounded-lg hover:from-[#1B5E20] hover:to-[#2E7D32] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {scheduling ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Scheduling...
                                </>
                              ) : (
                                <>
                                  <Video className="w-4 h-4" />
                                  Schedule Class
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSchedulingCourseId(null);
                                setScheduleDate('');
                                setScheduleTime('');
                              }}
                              disabled={scheduling}
                              className="px-4 py-2.5 text-sm font-semibold text-[#424242] bg-[#F5F5F5] rounded-lg hover:bg-[#E0E0E0] transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Google Meet Link */}
                  {course.google_meet_link && (
                    <div className="px-6 py-3 bg-[#FAFAFA] border-t border-[#E0E0E0]">
                      <a
                        href={course.google_meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm font-medium text-[#1E88E5] hover:text-[#1565C0] transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        View Course Meet Link
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
