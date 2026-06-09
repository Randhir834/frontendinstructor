import api from './api';

export const courseService = {
  getCourses: async (filters?: { 
    search?: string; 
    status?: string; 
    category_id?: string; 
    level?: string; 
    price_range?: string; 
    instructor_id?: string; 
    sort_by?: string; 
    sort_order?: string; 
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/courses${query}`);
    return response.data;
  },

  getPublishedCourses: async (filters?: { 
    search?: string; 
    category_id?: string; 
    level?: string; 
    price_range?: string; 
    sort_by?: string; 
    sort_order?: string; 
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/courses/published${query}`);
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getMyCourses: async (filters?: { 
    search?: string; 
    status?: string; 
    level?: string; 
    sort_by?: string; 
    sort_order?: string; 
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/courses/my-courses${query}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching instructor courses:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch courses. Please check your connection and try again.');
    }
  },

  createCourse: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: number) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  getEnrollmentCount: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}/enrollment-count`);
    return response.data;
  },
};
