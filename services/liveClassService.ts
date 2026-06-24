import api from './api';
import type { LiveClass } from '@/types';

export const liveClassService = {
  // Get all live classes for instructor
  getLiveClasses: async (filters?: { status?: string; course_id?: number; search?: string }) => {
    const response = await api.get('/live-classes', { params: filters });
    return response.data;
  },

  // Get live class by ID
  getLiveClassById: async (id: number) => {
    const response = await api.get(`/live-classes/${id}`);
    return response.data;
  },

  // Create a new live class
  createLiveClass: async (data: {
    course_id: number;
    student_id: number;
    title: string;
    description?: string;
    meet_link?: string;
    scheduled_at: string;
    duration_minutes?: number;
  }) => {
    const response = await api.post('/live-classes', data);
    return response.data;
  },

  // Update a live class
  updateLiveClass: async (id: number, data: Partial<LiveClass>) => {
    const response = await api.put(`/live-classes/${id}`, data);
    return response.data;
  },

  // Delete a live class
  deleteLiveClass: async (id: number) => {
    const response = await api.delete(`/live-classes/${id}`);
    return response.data;
  },

  // Get courses with live classes
  getCoursesWithLiveClasses: async () => {
    const response = await api.get('/live-classes/courses-with-classes');
    return response.data;
  },

  // Schedule live class for a specific student
  scheduleForStudent: async (data: {
    student_id: number;
    course_id: number;
    scheduled_at: string;
    title?: string;
    description?: string;
  }) => {
    const response = await api.post('/live-classes/schedule-for-student', data);
    return response.data;
  },
};
