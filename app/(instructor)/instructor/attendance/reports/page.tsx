'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Filter, Calendar, Users, BarChart3, Loader2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { attendanceService } from '@/services/attendanceService';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function AttendanceReportsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getMyCourses();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );
        const data = await attendanceService.getAttendanceReports(cleanFilters);
        setAttendanceData(data.attendance || []);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-[#1E88E5] bg-[#DBEAFE]';
      case 'absent': return 'text-[#DC2626] bg-[#FEE2E2]';
      case 'late': return 'text-[#D97706] bg-[#FEF3C7]';
      default: return 'text-[#64748B] bg-[#F1F5F9]';
    }
  };

  // Calculate statistics
  const stats = {
    totalRecords: attendanceData.length,
    presentCount: attendanceData.filter(record => record.status === 'present').length,
    absentCount: attendanceData.filter(record => record.status === 'absent').length,
    lateCount: attendanceData.filter(record => record.status === 'late').length,
  };

  const attendanceRate = stats.totalRecords > 0 
    ? ((stats.presentCount + stats.lateCount) / stats.totalRecords * 100).toFixed(1)
    : '0';

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/instructor/attendance">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">Attendance Reports</h1>
          <p className="text-sm text-[#64748B]">View and analyze attendance data</p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Course
              </label>
              <select
                value={filters.course_id}
                onChange={(e) => handleFilterChange('course_id', e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E293B]">{stats.totalRecords}</div>
              <div className="text-sm text-[#64748B]">Total Records</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E88E5]">{stats.presentCount}</div>
              <div className="text-sm text-[#64748B]">Present</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#DC2626]">{stats.absentCount}</div>
              <div className="text-sm text-[#64748B]">Absent</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D97706]">{stats.lateCount}</div>
              <div className="text-sm text-[#64748B]">Late</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7C3AED]">{attendanceRate}%</div>
              <div className="text-sm text-[#64748B]">Attendance Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Data */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="size-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">No attendance records found for the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-3 px-4 font-medium text-[#374151]">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-[#374151]">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-[#374151]">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-[#374151]">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-[#374151]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 text-sm text-[#1E293B]">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#1E293B]">
                        {record.course_title}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm font-medium text-[#1E293B]">{record.student_name}</div>
                          <div className="text-xs text-[#64748B]">{record.student_email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#64748B]">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}