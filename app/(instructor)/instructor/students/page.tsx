'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { enrollmentService } from '@/services/enrollmentService';
import { InstructorStudent } from '@/types';
import { Users, Mail, Phone, BookOpen } from 'lucide-react';

export default function InstructorStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getInstructorStudents({});
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight pb-1">
                My Students
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 ml-0 sm:ml-14 lg:ml-16">
            View students enrolled in your courses
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-b-2 border-primary mx-auto"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              My Students
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 ml-0 sm:ml-14 lg:ml-16">
          View students enrolled in your courses
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center shadow border border-gray-200">
          <Users className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600">No students enrolled in your courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {students.map((student) => (
            <div 
              key={student.student_id} 
              onClick={() => router.push(`/instructor/students/${student.student_id}`)}
              className="bg-white rounded-xl sm:rounded-2xl shadow hover:shadow-lg transition-all p-4 sm:p-5 lg:p-6 cursor-pointer border border-gray-200 hover:border-gray-300 touch-manipulation active:scale-[0.98]"
            >
              {/* Student Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.student_name}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-base sm:text-lg flex-shrink-0">
                    {student.student_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {student.student_name}
                  </h3>
                  {student.grade && (
                    <p className="text-xs sm:text-sm text-gray-500">Grade {student.grade}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{student.student_email}</span>
                </div>
                {student.student_phone && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span>{student.student_phone}</span>
                  </div>
                )}
              </div>

              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {student.total_courses_enrolled} {student.total_courses_enrolled === 1 ? 'Course' : 'Courses'}
                  </span>
                  {student.directly_assigned_courses && student.directly_assigned_courses > 0 && (
                    <span className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      {student.directly_assigned_courses} Assigned
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {student.courses.map((course) => (
                    <div
                      key={course.enrollment_id}
                      className="bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs sm:text-sm text-gray-800 truncate flex-1">
                          {course.course_title}
                        </span>
                        <span className={`text-[10px] sm:text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${
                          course.enrollment_status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : course.enrollment_status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.enrollment_status}
                        </span>
                      </div>
                      {course.is_directly_assigned && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-[10px] sm:text-xs text-purple-600 font-medium">Directly assigned to you</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
