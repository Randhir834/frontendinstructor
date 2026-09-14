import api from './api';

export const lessonCompletionService = {
  // Mark a lesson as completed
  markComplete: async (enrollmentId: number, lessonNumber: number, notes?: string) => {
    const response = await api.post('/lessons/complete', {
      enrollment_id: enrollmentId,
      lesson_number: lessonNumber,
      notes
    });
    return response.data;
  },

  // Unmark a lesson (mark as incomplete)
  unmarkComplete: async (enrollmentId: number, lessonNumber: number) => {
    const response = await api.delete('/lessons/complete', {
      data: {
        enrollment_id: enrollmentId,
        lesson_number: lessonNumber
      }
    });
    return response.data;
  },

  // Get completed lessons for an enrollment
  getCompleted: async (enrollmentId: number) => {
    const response = await api.get(`/lessons/completed/${enrollmentId}`);
    return response.data;
  },

  // Bulk mark multiple lessons as complete
  bulkMarkComplete: async (enrollmentId: number, lessonNumbers: number[]) => {
    const response = await api.post('/lessons/bulk-complete', {
      enrollment_id: enrollmentId,
      lesson_numbers: lessonNumbers
    });
    return response.data;
  },

  // Get instructor view of student progress
  getStudentProgress: async (studentId: number) => {
    const response = await api.get(`/lessons/student/${studentId}/progress`);
    return response.data;
  }
};
