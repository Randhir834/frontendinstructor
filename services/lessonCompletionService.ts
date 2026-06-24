import api from './api';

export interface LessonCompletion {
  id: number;
  enrollment_id: number;
  lesson_number: number;
  completed_at: string;
  completed_by: number;
  notes: string | null;
  instructor_name?: string;
}

export interface CourseProgress {
  enrollment_id: number;
  enrollment_status: string;
  enrolled_at: string;
  course_id: number;
  course_title: string;
  course_description: string;
  total_lessons: number;
  google_meet_link: string | null;
  completed_lessons: number;
  progress_percentage: number;
  completed_lesson_details: Array<{
    lesson_number: number;
    completed_at: string;
    notes: string | null;
  }> | null;
}

export interface StudentProgressResponse {
  success: boolean;
  courses: CourseProgress[];
}

export const lessonCompletionService = {
  // Mark a lesson as completed
  async markLessonComplete(enrollmentId: number, lessonNumber: number, notes?: string) {
    const response = await api.post('/lessons/complete', {
      enrollment_id: enrollmentId,
      lesson_number: lessonNumber,
      notes: notes || null
    });
    return response.data as { success: boolean; message: string; completion: LessonCompletion };
  },

  // Unmark a lesson (mark as incomplete)
  async unmarkLessonComplete(enrollmentId: number, lessonNumber: number) {
    const response = await api.delete('/lessons/complete', {
      data: {
        enrollment_id: enrollmentId,
        lesson_number: lessonNumber
      }
    });
    return response.data as { success: boolean; message: string };
  },

  // Bulk mark multiple lessons as complete
  async bulkMarkLessonsComplete(enrollmentId: number, lessonNumbers: number[]) {
    const response = await api.post('/lessons/bulk-complete', {
      enrollment_id: enrollmentId,
      lesson_numbers: lessonNumbers
    });
    return response.data as { success: boolean; message: string; completions: LessonCompletion[] };
  },

  // Get completed lessons for an enrollment
  async getCompletedLessons(enrollmentId: number) {
    const response = await api.get(`/lessons/completed/${enrollmentId}`);
    return response.data as { success: boolean; completed_lessons: LessonCompletion[] };
  },

  // Get student progress across all instructor's courses
  async getStudentProgress(studentId: number): Promise<StudentProgressResponse> {
    const response = await api.get(`/lessons/student/${studentId}/progress`);
    return response.data as StudentProgressResponse;
  }
};
