export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar_url?: string;
  bio?: string;
  qualifications?: string;
  experience_years?: number;
  specialization?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail_url?: string;
  category_id?: number;
  category_name?: string;
  level?: string;
  duration_value?: number;
  duration_unit?: string;
  price?: number;
  status: 'draft' | 'published' | 'archived';
  what_you_learn?: string;
  requirements?: string;
  instructor_id?: number;
  instructor_name?: string;
  instructors?: { id: number; name: string; avatar_url?: string }[];
  enrollment_count?: number;
  total_lessons?: number;
  created_at: string;
  updated_at: string;
}

export interface LiveClass {
  id: number;
  course_id: number;
  course_title?: string;
  course_description?: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_by?: number;
  instructor_name?: string;
  instructor_email?: string;
  enrolled_count?: number;
  students?: User[];
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  student_name: string;
  student_email: string;
  avatar_url?: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
  enrolled_at: string;
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  due_date?: string;
  max_score?: number;
  created_at: string;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  created_at: string;
}
