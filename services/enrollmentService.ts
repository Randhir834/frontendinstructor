import api from './api';

export const enrollmentService = {
  enrollCourse: async (courseId: number) => {
    const response = await api.post('/enrollments', { course_id: courseId });
    return response.data;
  },

  getEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  getEnrollmentById: async (id: number) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  checkEnrollment: async (courseId: number) => {
    const response = await api.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  getCourseEnrollments: async (courseId: number, filters?: { status?: string; search?: string; sort_by?: string; sort_order?: string }) => {
    const response = await api.get(`/enrollments/course/${courseId}`, { params: filters });
    return response.data;
  },

  getInstructorStudents: async (filters?: { search?: string; sort_by?: string; sort_order?: string; course_id?: number }) => {
    const response = await api.get('/enrollments/instructor/students', { params: filters });
    return response.data;
  },

  getStudentSlots: async (studentId: number) => {
    const response = await api.get(`/enrollments/instructor/students/${studentId}/slots`);
    return response.data;
  },

  cancelStudentSlot: async (studentId: number, registrationId: number) => {
    const response = await api.delete(`/enrollments/instructor/students/${studentId}/slots/${registrationId}`);
    return response.data;
  },

  // Get student's enrolled courses for an instructor
  getStudentEnrolledCourses: async (studentId: number) => {
    const response = await api.get(`/enrollments/instructor/students/${studentId}/courses`);
    return response.data;
  },

  // Update manual completed lessons for an enrollment
  updateCompletedLessons: async (enrollmentId: number, completedLessons: number) => {
    const response = await api.patch(`/enrollments/instructor/enrollments/${enrollmentId}/completed-lessons`, {
      completed_lessons: completedLessons
    });
    return response.data;
  },
};

