'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Save, Loader2, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { attendanceService, type AttendanceStudent, type AttendanceRecord } from '@/services/attendanceService';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function MarkAttendancePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const courseIdNum = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceRecord>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseData, studentsData] = await Promise.all([
          courseService.getCourseById(courseIdNum),
          attendanceService.getCourseStudents(courseIdNum)
        ]);
        
        setCourse(courseData.course);
        setStudents(studentsData.students || []);
        
        // Initialize attendance state
        const initialAttendance: Record<number, AttendanceRecord> = {};
        (studentsData.students || []).forEach((student: AttendanceStudent) => {
          initialAttendance[student.id] = {
            student_id: student.id,
            status: 'present',
            notes: ''
          };
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseIdNum]);

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      if (!selectedDate) return;
      
      try {
        const data = await attendanceService.getAttendanceByDate(courseIdNum, selectedDate);
        setExistingAttendance(data.attendance || []);
        
        // Update attendance state with existing data
        const updatedAttendance = { ...attendance };
        (data.attendance || []).forEach((record: any) => {
          if (updatedAttendance[record.student_id]) {
            updatedAttendance[record.student_id] = {
              student_id: record.student_id,
              status: record.status,
              notes: record.notes || ''
            };
          }
        });
        setAttendance(updatedAttendance);
      } catch (error) {
        console.error('Failed to fetch existing attendance:', error);
      }
    };
    
    if (students.length > 0) {
      fetchExistingAttendance();
    }
  }, [selectedDate, students.length]);

  const updateAttendance = (studentId: number, field: 'status' | 'notes', value: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const markAllPresent = () => {
    const updatedAttendance = { ...attendance };
    students.forEach(student => {
      updatedAttendance[student.id] = {
        ...updatedAttendance[student.id],
        status: 'present'
      };
    });
    setAttendance(updatedAttendance);
  };

  const markAllAbsent = () => {
    const updatedAttendance = { ...attendance };
    students.forEach(student => {
      updatedAttendance[student.id] = {
        ...updatedAttendance[student.id],
        status: 'absent'
      };
    });
    setAttendance(updatedAttendance);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      const attendanceData = {
        course_id: courseIdNum,
        date: selectedDate,
        students: Object.values(attendance)
      };
      
      await attendanceService.markAttendance(attendanceData);
      alert('Attendance marked successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Failed to mark attendance';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-[#1E88E5] bg-[#C5E1A5]';
      case 'absent': return 'text-[#EC407A] bg-[#FEE2E2]';
      case 'late': return 'text-[#D97706] bg-[#FEF3C7]';
      default: return 'text-[#78909C] bg-[#FAFAFA]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="size-4" />;
      case 'absent': return <XCircle className="size-4" />;
      case 'late': return <Clock className="size-4" />;
      default: return null;
    }
  };

  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length;
  const absentCount = Object.values(attendance).filter(a => a.status === 'absent').length;
  const lateCount = Object.values(attendance).filter(a => a.status === 'late').length;

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-sm text-[#78909C]">Course not found.</p>
              <Link href="/instructor/attendance" className="inline-block mt-4">
                <Button variant="outline">Back to Attendance</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">{course.title}</h1>
          <p className="text-sm text-[#78909C]">Mark attendance for your students</p>
        </div>
        <Link href={`/instructor/attendance/${courseId}/summary`}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Users className="size-4" />
            View Summary
          </Button>
        </Link>
      </div>

      {/* Date Selection and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#374151]">
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E88E5]">{presentCount}</div>
              <div className="text-sm text-[#78909C]">Present</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#EC407A]">{absentCount}</div>
              <div className="text-sm text-[#78909C]">Absent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-[#78909C]" />
              <span className="font-medium text-[#1E3A5F]">
                {students.length} Students
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllPresent}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="size-4" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAbsent}
                className="flex items-center gap-2"
              >
                <XCircle className="size-4" />
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="size-12 text-[#E0E0E0] mx-auto mb-3" />
              <p className="text-sm text-[#78909C]">No students enrolled in this course.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border border-[#E0E0E0] rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Student Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1E3A5F]">{student.name}</h4>
                      <p className="text-sm text-[#78909C]">{student.email}</p>
                    </div>

                    {/* Attendance Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {['present', 'absent'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateAttendance(student.id, 'status', status)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors flex items-center gap-2 ${
                              attendance[student.id]?.status === status
                                ? `${getStatusColor(status)} border-current`
                                : 'text-[#78909C] bg-white border-[#E0E0E0] hover:border-[#1E88E5]'
                            }`}
                          >
                            {getStatusIcon(status)}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      {students.length > 0 && (
        <div className="flex items-center justify-end gap-4">
          <Link href="/instructor/attendance">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      )}
    </div>
  );
}