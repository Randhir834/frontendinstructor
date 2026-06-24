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
      <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Students
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-16">
            View students enrolled in your courses
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Students
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 ml-16">
          View students enrolled in your courses
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No students enrolled in your courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div 
              key={student.student_id} 
              onClick={() => router.push(`/instructor/students/${student.student_id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
            >
              {/* Student Header */}
              <div className="flex items-center gap-4 mb-4">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.student_name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                    {student.student_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {student.student_name}
                  </h3>
                  {student.grade && (
                    <p className="text-sm text-gray-500">Grade {student.grade}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{student.student_email}</span>
                </div>
                {student.student_phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{student.student_phone}</span>
                  </div>
                )}
              </div>

              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {student.total_courses_enrolled} {student.total_courses_enrolled === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
                <div className="space-y-2">
                  {student.courses.map((course) => (
                    <div
                      key={course.enrollment_id}
                      className="bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-800 truncate flex-1">
                          {course.course_title}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          course.enrollment_status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : course.enrollment_status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.enrollment_status}
                        </span>
                      </div>
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
