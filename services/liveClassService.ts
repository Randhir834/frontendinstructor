import api from './api';
import type { LiveClass } from '@/types';

export interface CreateLiveClassData {
  course_id: number;
  title: string;
  description?: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
}

export interface UpdateLiveClassData {
  title?: string;
  description?: string;
  meet_link?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export const liveClassService = {
  // Get all live classes for instructor
  async getLiveClasses(filters?: { course_id?: number; status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/live-classes?${params.toString()}`);
    return response.data;
  },

  // Get courses with their live classes
  async getCoursesWithLiveClasses() {
    const response = await api.get('/live-classes/courses');
    return response.data;
  },

  // Get live classes by course
  async getLiveClassesByCourse(courseId: number) {
    const response = await api.get(`/live-classes?course_id=${courseId}`);
    return response.data;
  },

  // Get single live class
  async getLiveClassById(id: number) {
    const response = await api.get(`/live-classes/${id}`);
    return response.data;
  },

  // Create live class
  async createLiveClass(data: CreateLiveClassData) {
    const response = await api.post('/live-classes', data);
    return response.data;
  },

  // Update live class
  async updateLiveClass(id: number, data: UpdateLiveClassData) {
    const response = await api.put(`/live-classes/${id}`, data);
    return response.data;
  },

  // Delete live class
  async deleteLiveClass(id: number) {
    const response = await api.delete(`/live-classes/${id}`);
    return response.data;
  },

  // Helper: Format date for display
  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Helper: Format time for display
  formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Helper: Format date and time for display
  formatDateTime(dateString: string) {
    return `${this.formatDate(dateString)} at ${this.formatTime(dateString)}`;
  },

  // Helper: Check if class is upcoming
  isUpcoming(scheduledAt: string) {
    return new Date(scheduledAt) > new Date();
  },

  // Helper: Check if class is today
  isToday(scheduledAt: string) {
    const classDate = new Date(scheduledAt);
    const today = new Date();
    return (
      classDate.getDate() === today.getDate() &&
      classDate.getMonth() === today.getMonth() &&
      classDate.getFullYear() === today.getFullYear()
    );
  },
};
