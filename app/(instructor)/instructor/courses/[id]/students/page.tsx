'use client';

import { useEffect, useState, use } from 'react';
import { Loader2, Users, Search, Filter, Mail, Phone, Calendar, BookOpen, BarChart3, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { getAvatarUrl } from '@/utils/avatarUtils';

export default function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = Number(id);

  const [course, setCourse] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('enrolled_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(courseId);
        setCourse(response.course || null);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const fetchEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);
      const filters: any = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (search) filters.search = search;
      
      const response = await enrollmentService.getCourseEnrollments(courseId, filters);
      setEnrollments(response.enrollments || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchEnrollments();
    }
  }, [courseId, statusFilter, sortBy, sortOrder, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnrollments();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    if (enrollments.length === 0) {
      alert('No students to export');
      return;
    }

    // Prepare CSV data
    const headers = ['Name', 'Email', 'Phone', 'Grade', 'Status', 'Enrolled Date'];
    const rows = enrollments.map(e => [
      e.student_name,
      e.student_email,
      e.student_phone || 'N/A',
      e.grade || 'N/A',
      e.status,
      formatDate(e.enrolled_at)
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students-${courseId}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#C5E1A5] text-[#1E88E5]';
      case 'completed': return 'bg-[#DBEAFE] text-[#1D4ED8]';
      case 'cancelled': return 'bg-[#FEE2E2] text-[#EC407A]';
      default: return 'bg-[#FAFAFA] text-[#78909C]';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-[#E0E0E0] mx-auto mb-3" />
              <p className="text-sm text-[#78909C]">Course not found.</p>
              <Link href="/instructor/courses" className="inline-block mt-4">
                <Button variant="outline">Back to My Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/instructor/courses/${courseId}`} className="text-[#1E88E5] hover:underline">
              {course.title}
            </Link>
            <span className="text-[#78909C]">/</span>
            <h1 className="text-xl md:text-2xl font-bold text-[#1E3A5F]">Students</h1>
          </div>
          <p className="text-sm text-[#78909C]">
            Manage and view enrolled students for this course
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total_students}</div>
                <div className="text-sm text-[#78909C]">Total Students</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E88E5]">{stats.active_students}</div>
                <div className="text-sm text-[#78909C]">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1D4ED8]">{stats.completed_students}</div>
                <div className="text-sm text-[#78909C]">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D97706]">{Math.round(stats.average_progress)}%</div>
                <div className="text-sm text-[#78909C]">Avg Progress</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#78909C] size-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[#78909C]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              >
                <option value="enrolled_at">Sort by Enrollment Date</option>
                <option value="progress">Sort by Progress</option>
                <option value="student_name">Sort by Name</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
              >
                {sortOrder === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Enrolled Students</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-[#1E88E5]" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="size-12 text-[#E0E0E0] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1E3A5F] mb-2">
                {search || statusFilter !== 'all' ? 'No matching students found' : 'No students enrolled yet'}
              </h3>
              <p className="text-sm text-[#78909C]">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Students will appear here once they enroll in this course.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const avatarUrl = getAvatarUrl(enrollment.avatar_url, enrollment.student_name);
                const showFallback = !enrollment.avatar_url;
                
                return (
                  <div key={enrollment.id} className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                    {/* Student Summary */}
                    <div className="p-4 bg-white hover:bg-[#FAFAFA] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {!showFallback ? (
                            <img 
                              src={avatarUrl} 
                              alt={enrollment.student_name}
                              className="size-12 rounded-full object-cover"
                              onError={(e) => {
                                // Fallback to default avatar if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`size-12 bg-[#1E88E5]/10 rounded-full flex items-center justify-center ${!showFallback ? 'hidden' : ''}`}>
                            <Users className="size-6 text-[#1E88E5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-[#1E3A5F] truncate">
                                {enrollment.student_name}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#78909C]">
                              <div className="flex items-center gap-1">
                                <Mail className="size-3" />
                                {enrollment.student_email}
                              </div>
                              {enrollment.student_phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="size-3" />
                                  {enrollment.student_phone}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                Enrolled {formatDate(enrollment.enrolled_at)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStudent(expandedStudent === enrollment.id ? null : enrollment.id)}
                          className="p-2"
                        >
                          {expandedStudent === enrollment.id ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedStudent === enrollment.id && (
                      <div className="border-t border-[#E0E0E0] bg-[#FAFAFA] p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Details */}
                          <div>
                            <h4 className="font-medium text-[#1E3A5F] mb-3">Student Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-[#78909C]">Email:</span>
                                <span className="font-medium text-[#1E3A5F]">{enrollment.student_email}</span>
                              </div>
                              {enrollment.student_phone && (
                                <div className="flex justify-between">
                                  <span className="text-[#78909C]">Phone:</span>
                                  <span className="font-medium text-[#1E3A5F]">{enrollment.student_phone}</span>
                                </div>
                              )}
                              {enrollment.date_of_birth && (
                                <div className="flex justify-between">
                                  <span className="text-[#78909C]">Age:</span>
                                  <span className="font-medium text-[#1E3A5F]">{calculateAge(enrollment.date_of_birth)} years</span>
                                </div>
                              )}
                              {enrollment.grade && (
                                <div className="flex justify-between">
                                  <span className="text-[#78909C]">Grade:</span>
                                  <span className="font-medium text-[#1E3A5F]">{enrollment.grade}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-[#78909C]">Enrolled Date:</span>
                                <span className="font-medium text-[#1E3A5F]">{formatDate(enrollment.enrolled_at)}</span>
                              </div>
                              {enrollment.completed_at && (
                                <div className="flex justify-between">
                                  <span className="text-[#78909C]">Completed Date:</span>
                                  <span className="font-medium text-[#1E3A5F]">{formatDate(enrollment.completed_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div>
                            <h4 className="font-medium text-[#1E3A5F] mb-3">Actions</h4>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Mail className="size-4 mr-2" />
                                Send Message
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <BarChart3 className="size-4 mr-2" />
                                View Progress Details
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <BookOpen className="size-4 mr-2" />
                                View Assignments
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats */}
      {stats && stats.new_enrollments_week > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F0F9FF] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1E88E5]/10 rounded-lg">
                    <Users className="size-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1E3A5F]">{stats.new_enrollments_week}</div>
                    <div className="text-sm text-[#78909C]">New enrollments this week</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#F0F9FF] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1E88E5]/10 rounded-lg">
                    <BarChart3 className="size-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1E3A5F]">{stats.new_enrollments_month}</div>
                    <div className="text-sm text-[#78909C]">New enrollments this month</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
