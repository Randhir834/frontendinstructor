import { courseService } from './courseService';
import { liveClassService } from './liveClassService';
import { enrollmentService } from './enrollmentService';

function normalizeToArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];

  const obj = value as Record<string, unknown>;

  if (Array.isArray(obj.data)) return obj.data;
  if (obj.data && typeof obj.data === 'object') {
    const dataObj = obj.data as Record<string, unknown>;
    if (Array.isArray(dataObj.courses)) return dataObj.courses as any[];
    if (Array.isArray(dataObj.data)) return dataObj.data as any[];
  }
  if (Array.isArray(obj.courses)) return obj.courses as any[];
  return [];
}

export interface InstructorDashboardStats {
  coursesCreated: number;
  liveClassesConducted: number;
  totalStudents: number;
  totalEarnings: number;
}

export interface InstructorCourse {
  id: number;
  title: string;
  enrolledStudents: number;
  price: number;
  status: string;
}

export interface InstructorAchievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface InstructorDashboardData {
  stats: InstructorDashboardStats;
  courses: InstructorCourse[];
  achievements: InstructorAchievement[];
}

export const instructorDashboardService = {
  getDashboardStats: async (): Promise<InstructorDashboardStats> => {
    try {
      const [courses, liveClasses, enrollments] = await Promise.all([
        courseService.getCourses(),
        liveClassService.getLiveClasses(),
        enrollmentService.getEnrollments()
      ]);

      return {
        coursesCreated: courses?.data?.length || courses?.length || 0,
        liveClassesConducted: liveClasses?.data?.length || liveClasses?.length || 0,
        totalStudents: enrollments?.data?.length || enrollments?.length || 0,
        totalEarnings: 0
      };
    } catch (error) {
      console.error('Error fetching instructor dashboard stats:', error);
      return {
        coursesCreated: 0,
        liveClassesConducted: 0,
        totalStudents: 0,
        totalEarnings: 0
      };
    }
  },

  getInstructorCourses: async (): Promise<InstructorCourse[]> => {
    try {
      const response = await courseService.getCourses();
      const courses = normalizeToArray(response);
      return courses.map((course: any) => ({
        id: course.id,
        title: course.title || 'Untitled Course',
        enrolledStudents: course.enrollment_count || 0,
        price: course.price || 0,
        status: course.status || 'published'
      }));
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      return [];
    }
  },

  getAchievements: async (): Promise<InstructorAchievement[]> => {
    return [
      {
        id: 1,
        title: 'Course Creator',
        description: 'Created your first course',
        icon: 'star',
        earned_at: '2024-05-10T10:00:00Z'
      },
      {
        id: 2,
        title: 'Popular Instructor',
        description: 'Got 50+ student enrollments',
        icon: 'target',
        earned_at: '2024-05-08T15:30:00Z'
      },
      {
        id: 3,
        title: 'Live Class Pro',
        description: 'Conducted 10+ live classes',
        icon: 'award',
        earned_at: '2024-05-05T09:00:00Z'
      },
      {
        id: 4,
        title: 'Top Earner',
        description: 'Earned ₹10,000+ in revenue',
        icon: 'trophy',
        earned_at: '2024-05-01T14:20:00Z'
      }
    ];
  },

  getDashboardData: async (): Promise<InstructorDashboardData> => {
    const [stats, courses, achievements] = await Promise.all([
      instructorDashboardService.getDashboardStats(),
      instructorDashboardService.getInstructorCourses(),
      instructorDashboardService.getAchievements()
    ]);

    return {
      stats,
      courses,
      achievements
    };
  }
};
