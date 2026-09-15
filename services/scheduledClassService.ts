import api from './api';
import { ScheduledClass } from '@/types';

export interface ScheduledClassFilters {
  status?: string;
  course_id?: number;
  search?: string;
}

export const scheduledClassService = {
  /**
   * Get all scheduled classes for the logged-in instructor
   */
  async getScheduledClasses(filters?: ScheduledClassFilters): Promise<ScheduledClass[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.course_id) params.append('course_id', filters.course_id.toString());
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = queryString ? `/live-classes?${queryString}` : '/live-classes';
      
      const response = await api.get(url);
      return response.data.liveClasses || [];
    } catch (error: any) {
      console.error('Failed to fetch scheduled classes:', error);
      throw error;
    }
  },

  /**
   * Get a single scheduled class by ID
   */
  async getScheduledClassById(id: number): Promise<ScheduledClass> {
    try {
      const response = await api.get(`/live-classes/${id}`);
      return response.data.liveClass;
    } catch (error: any) {
      console.error(`Failed to fetch scheduled class ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new scheduled class
   */
  async createScheduledClass(data: {
    course_id: number;
    title: string;
    description?: string;
    meet_link?: string;
    scheduled_at: string;
    duration_minutes?: number;
    lesson_id?: number;
    section_id?: number;
  }): Promise<ScheduledClass> {
    try {
      const response = await api.post('/live-classes', data);
      return response.data.liveClass;
    } catch (error: any) {
      console.error('Failed to create scheduled class:', error);
      throw error;
    }
  },

  /**
   * Update a scheduled class
   */
  async updateScheduledClass(id: number, data: Partial<ScheduledClass>): Promise<ScheduledClass> {
    try {
      const response = await api.put(`/live-classes/${id}`, data);
      return response.data.liveClass;
    } catch (error: any) {
      console.error(`Failed to update scheduled class ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a scheduled class
   */
  async deleteScheduledClass(id: number): Promise<void> {
    try {
      await api.delete(`/live-classes/${id}`);
    } catch (error: any) {
      console.error(`Failed to delete scheduled class ${id}:`, error);
      throw error;
    }
  },
};
