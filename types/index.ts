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

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
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
  enrolled_students?: number;
  total_lessons?: number;
  google_meet_link?: string;
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
  enrolled_at: string;
}

export interface InstructorStudent {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone?: string;
  date_of_birth?: string;
  grade?: string;
  school?: string;
  avatar_url?: string;
  total_courses_enrolled: number;
  courses: {
    course_id: number;
    course_title: string;
    enrollment_id: number;
    enrollment_status: string;
    enrolled_at: string;
    completed_at?: string;
  }[];
}

export interface StudentDetailCourse {
  course_id: number;
  course_title: string;
  google_meet_link?: string;
  total_lessons: number;
  enrollment_status: string;
  enrolled_at: string;
  total_slots_booked: number;
  classes_completed: number;
  classes_remaining: number;
  slots: {
    id: number;
    day_of_week: number;
    hour: number;
    status: string;
    registration_date: string;
  }[];
}

export interface StudentDetail {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone?: string;
  grade?: string;
  school?: string;
  avatar_url?: string;
  courses: StudentDetailCourse[];
}

export interface InstructorStudentStats {
  total_students: number;
  new_students_week: number;
  new_students_month: number;
  total_courses: number;
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

export interface LiveClass {
  id: number;
  course_id: number;
  lesson_id?: number;
  section_id?: number;
  title: string;
  description?: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_by: number;
  created_by_name?: string;
  instructor_name?: string;
  course_title?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentEnrolledCourse {
  course_id: number;
  course_title: string;
  course_description?: string;
  google_meet_link?: string;
  enrollment_id: number;
  enrollment_status: string;
  enrolled_at: string;
  total_lessons: number;
  completed_lessons: number;
}
