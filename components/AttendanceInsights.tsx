'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Users, Calendar } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { attendanceService } from '@/services/attendanceService';

interface InsightData {
  totalStudents: number;
  avgAttendanceRate: number;
  trend: 'up' | 'down' | 'stable';
  lowAttendanceStudents: Array<{
    id: number;
    name: string;
    attendanceRate: number;
    courseTitle: string;
  }>;
  topPerformingCourses: Array<{
    id: number;
    title: string;
    attendanceRate: number;
    studentCount: number;
  }>;
  recentTrends: Array<{
    date: string;
    attendanceRate: number;
  }>;
}

interface AttendanceInsightsProps {
  className?: string;
}

export default function AttendanceInsights({ className = '' }: AttendanceInsightsProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        
        // Fetch attendance data for analysis
        const [coursesData, reportsData] = await Promise.all([
          attendanceService.getInstructorCourses(),
          attendanceService.getAttendanceReports()
        ]);

        const courses = coursesData.courses || [];
        const reports = reportsData.attendance || [];

        // Calculate insights
        const totalStudents = new Set(reports.map((r: any) => r.student_id)).size;
        
        const presentCount = reports.filter((r: any) => r.status === 'present').length;
        const lateCount = reports.filter((r: any) => r.status === 'late').length;
        const avgAttendanceRate = reports.length > 0 
          ? ((presentCount + lateCount) / reports.length * 100) 
          : 0;

        // Calculate trend (compare last 7 days vs previous 7 days)
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const recent = reports.filter((r: any) => {
          const date = new Date(r.date);
          return date >= last7Days;
        });

        const previous = reports.filter((r: any) => {
          const date = new Date(r.date);
          return date >= previous7Days && date < last7Days;
        });

        const recentRate = recent.length > 0 
          ? ((recent.filter((r: any) => r.status === 'present' || r.status === 'late').length) / recent.length * 100)
          : 0;

        const previousRate = previous.length > 0 
          ? ((previous.filter((r: any) => r.status === 'present' || r.status === 'late').length) / previous.length * 100)
          : 0;

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (recentRate > previousRate + 2) trend = 'up';
        else if (recentRate < previousRate - 2) trend = 'down';

        // Find low attendance students (< 70%)
        const studentAttendance: { [key: number]: { name: string; present: number; total: number; courses: Set<string> } } = {};
        
        reports.forEach((r: any) => {
          if (!studentAttendance[r.student_id]) {
            studentAttendance[r.student_id] = {
              name: r.student_name,
              present: 0,
              total: 0,
              courses: new Set()
            };
          }
          studentAttendance[r.student_id].total++;
          studentAttendance[r.student_id].courses.add(r.course_title);
          if (r.status === 'present' || r.status === 'late') {
            studentAttendance[r.student_id].present++;
          }
        });

        const lowAttendanceStudents = Object.entries(studentAttendance)
          .map(([id, data]) => ({
            id: parseInt(id),
            name: data.name,
            attendanceRate: (data.present / data.total * 100),
            courseTitle: Array.from(data.courses).join(', ')
          }))
          .filter(student => student.attendanceRate < 70)
          .sort((a, b) => a.attendanceRate - b.attendanceRate)
          .slice(0, 5);

        // Calculate course performance
        const courseAttendance: { [key: number]: { title: string; present: number; total: number; students: Set<number> } } = {};
        
        reports.forEach((r: any) => {
          if (!courseAttendance[r.course_id]) {
            courseAttendance[r.course_id] = {
              title: r.course_title,
              present: 0,
              total: 0,
              students: new Set()
            };
          }
          courseAttendance[r.course_id].total++;
          courseAttendance[r.course_id].students.add(r.student_id);
          if (r.status === 'present' || r.status === 'late') {
            courseAttendance[r.course_id].present++;
          }
        });

        const topPerformingCourses = Object.entries(courseAttendance)
          .map(([id, data]) => ({
            id: parseInt(id),
            title: data.title,
            attendanceRate: (data.present / data.total * 100),
            studentCount: data.students.size
          }))
          .sort((a, b) => b.attendanceRate - a.attendanceRate)
          .slice(0, 3);

        // Calculate recent trends (last 10 days)
        const recentTrends: { [key: string]: { present: number; total: number } } = {};
        
        reports.forEach((r: any) => {
          const date = r.date;
          if (!recentTrends[date]) {
            recentTrends[date] = { present: 0, total: 0 };
          }
          recentTrends[date].total++;
          if (r.status === 'present' || r.status === 'late') {
            recentTrends[date].present++;
          }
        });

        const trendsArray = Object.entries(recentTrends)
          .map(([date, data]) => ({
            date,
            attendanceRate: (data.present / data.total * 100)
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
          .reverse();

        setInsights({
          totalStudents,
          avgAttendanceRate,
          trend,
          lowAttendanceStudents,
          topPerformingCourses,
          recentTrends: trendsArray
        });

      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#78909C]">Total Students</p>
                <p className="text-2xl font-bold text-[#1E3A5F]">{insights.totalStudents}</p>
              </div>
              <Users className="size-8 text-[#1E88E5]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#78909C]">Avg Attendance</p>
                <p className="text-2xl font-bold text-[#1E3A5F]">{insights.avgAttendanceRate.toFixed(1)}%</p>
              </div>
              <div className="flex items-center">
                {insights.trend === 'up' && <TrendingUp className="size-8 text-[#1E88E5]" />}
                {insights.trend === 'down' && <TrendingDown className="size-8 text-[#EC407A]" />}
                {insights.trend === 'stable' && <Calendar className="size-8 text-[#78909C]" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#78909C]">Need Attention</p>
                <p className="text-2xl font-bold text-[#EC407A]">{insights.lowAttendanceStudents.length}</p>
              </div>
              <AlertTriangle className="size-8 text-[#EC407A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Attendance Alert */}
      {insights.lowAttendanceStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#EC407A]">
              <AlertTriangle className="size-5" />
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.lowAttendanceStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                  <div>
                    <p className="font-medium text-[#1E3A5F]">{student.name}</p>
                    <p className="text-sm text-[#78909C]">{student.courseTitle}</p>
                  </div>
                  <span className="px-2 py-1 text-sm font-bold text-[#EC407A] bg-[#FEE2E2] rounded-full">
                    {student.attendanceRate.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}