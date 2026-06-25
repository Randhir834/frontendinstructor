import api from './api';
import { courseService } from './courseService';
import { liveClassService } from './liveClassService';
import { userService } from './userService';

export interface DashboardStats {
  coursesTeaching: number;
  totalStudents: number;
  upcomingClasses: number;
  totalHours: number;
}

export interface CourseWithStudents {
  id: number;
  title: string;
  thumbnail_url?: string;
  studentCount: number;
  status: string;
  level?: string;
}

export interface UpcomingClass {
  id: number;
  title: string;
  course_name: string;
  student_name: string;
  scheduled_at: string;
  meet_link?: string;
  duration_minutes: number;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  courses: CourseWithStudents[];
  upcomingClasses: UpcomingClass[];
}

export const dashboardService = {
  // Get dashboard summary stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const results = await Promise.allSettled([
        courseService.getMyCourses(),
        userService.getInstructorStats(),
        liveClassService.getLiveClasses({ status: 'scheduled' })
      ]);

      let coursesCount = 0;
      let totalStudents = 0;
      let upcomingClassesCount = 0;
      let totalHours = 0;

      // Count courses teaching
      if (results[0].status === 'fulfilled') {
        const courses = results[0].value.courses || [];
        coursesCount = courses.length;
      }

      // Get instructor stats
      if (results[1].status === 'fulfilled') {
        const stats = results[1].value;
        totalStudents = stats.totalStudents || 0;
        totalHours = stats.totalHours || 0;
      }

      // Count upcoming classes
      if (results[2].status === 'fulfilled') {
        const classes = results[2].value.liveClasses || [];
        upcomingClassesCount = classes.filter((cls: any) => {
          const classTime = new Date(cls.scheduled_at).getTime();
          const now = new Date().getTime();
          return classTime > now;
        }).length;
      }

      return {
        coursesTeaching: coursesCount,
        totalStudents,
        upcomingClasses: upcomingClassesCount,
        totalHours
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        coursesTeaching: 0,
        totalStudents: 0,
        upcomingClasses: 0,
        totalHours: 0
      };
    }
  },

  // Get courses with student counts
  getCoursesWithStudents: async (): Promise<CourseWithStudents[]> => {
    try {
      const coursesData = await courseService.getMyCourses();
      
      if (!coursesData.courses) return [];

      // Get enrollment counts for each course
      const results = await Promise.allSettled(
        coursesData.courses.map(async (course: any) => {
          try {
            const enrollmentData = await courseService.getEnrollmentCount(course.id);
            return {
              id: course.id,
              title: course.title || 'Unknown Course',
              thumbnail_url: course.thumbnail_url,
              studentCount: enrollmentData.count || 0,
              status: course.status || 'draft',
              level: course.level
            };
          } catch (error) {
            // If enrollment count fails, return course with 0 students
            return {
              id: course.id,
              title: course.title || 'Unknown Course',
              thumbnail_url: course.thumbnail_url,
              studentCount: 0,
              status: course.status || 'draft',
              level: course.level
            };
          }
        })
      );

      const coursesWithStudents = results
        .filter((result): result is PromiseFulfilledResult<CourseWithStudents> => result.status === 'fulfilled')
        .map(result => result.value);

      return coursesWithStudents;
    } catch (error) {
      console.error('Error fetching courses with students:', error);
      return [];
    }
  },

  // Get upcoming classes
  getUpcomingClasses: async (): Promise<UpcomingClass[]> => {
    try {
      const liveClasses = await liveClassService.getLiveClasses({ status: 'scheduled' });
      
      if (!liveClasses.liveClasses) return [];

      const now = new Date().getTime();
      const upcomingClasses = liveClasses.liveClasses
        .filter((cls: any) => {
          const classTime = new Date(cls.scheduled_at).getTime();
          return classTime > now;
        })
        .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
        .slice(0, 5) // Get next 5 upcoming classes
        .map((cls: any) => ({
          id: cls.id,
          title: cls.title,
          course_name: cls.course?.title || 'Unknown Course',
          student_name: cls.student?.name || 'Unknown Student',
          scheduled_at: cls.scheduled_at,
          meet_link: cls.meet_link,
          duration_minutes: cls.duration_minutes || 60,
          status: cls.status
        }));

      return upcomingClasses;
    } catch (error) {
      console.error('Error fetching upcoming classes:', error);
      return [];
    }
  },

  // Get all dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    const [stats, courses, upcomingClasses] = await Promise.all([
      dashboardService.getDashboardStats(),
      dashboardService.getCoursesWithStudents(),
      dashboardService.getUpcomingClasses()
    ]);

    return {
      stats,
      courses,
      upcomingClasses
    };
  }
};
