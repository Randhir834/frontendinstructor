'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Edit, Users, FileText, Clock, Calendar, 
  CheckCircle, XCircle, Download, Search, AlertCircle 
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions: string;
  course_title: string;
  course_id: number;
  due_date: string | null;
  max_score: number;
  is_published: boolean;
  allow_resubmission: boolean;
  allow_late_submission: boolean;
  file_requirements: string;
  submission_format: string;
  created_at: string;
}

interface Student {
  id: number;
  student_id: number;
  name: string;
  email: string;
  profile_photo: string | null;
  assigned_at: string;
  submission_count: number;
  latest_status: string | null;
  latest_score: number | null;
  phone?: string;
  grade?: string;
  school?: string;
}

interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  profile_photo: string | null;
  file_url: string | null;
  file_name: string | null;
  notes: string | null;
  status: string;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  is_late: boolean;
  submission_count: number;
}

interface Statistics {
  total_assigned: number;
  total_submitted: number;
  total_graded: number;
  avg_score: number;
  submission_rate: number;
}

type TabType = 'details' | 'students' | 'submitted' | 'pending';

export default function AssignmentViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({
    score: 0,
    feedback: '',
    status: 'graded',
  });

  useEffect(() => {
    if (id) {
      fetchAssignment();
      fetchStatistics();
      fetchStudents();
      fetchSubmissions();
    }
  }, [id]);

  // Auto-refresh submissions every 30 seconds for real-time updates
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      fetchSubmissions();
      fetchStatistics();
      fetchStudents();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch assignment');

      const data = await response.json();
      setAssignment(data.assignment);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/statistics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics);
      }
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const mappedStudents = (data.assignments || []).map((item: any) => ({
          id: item.id,
          student_id: item.student_id,
          name: item.name,
          email: item.email,
          profile_photo: item.profile_photo,
          assigned_at: item.assigned_at,
          submission_count: item.submission_count || 0,
          latest_status: item.latest_status,
          latest_score: item.latest_score,
          phone: item.phone,
          grade: item.grade,
          school: item.school,
        }));
        setStudents(mappedStudents);
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (err: any) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } else {
        console.error('Failed to fetch submissions:', response.status, response.statusText);
      }
    } catch (err: any) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/submissions/${gradingSubmission.id}/grade`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gradeForm),
        }
      );

      if (!response.ok) throw new Error('Failed to grade submission');

      alert('Submission graded successfully');
      setGradingSubmission(null);
      // Refetch all data to update the display
      fetchStudents();
      fetchSubmissions();
      fetchStatistics();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openGradingModal = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeForm({
      score: submission.score ?? 0,
      feedback: submission.feedback || '',
      status: 'graded',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string | null, isSubmitted: boolean, isLate?: boolean) => {
    if (isLate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
          <Clock className="w-3 h-3" />
          Late
        </span>
      );
    }

    if (!isSubmitted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
          <XCircle className="w-3 h-3" />
          Not Submitted
        </span>
      );
    }

    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
            <CheckCircle className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
            <CheckCircle className="w-3 h-3" />
            Graded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            Pending
          </span>
        );
    }
  };

  // Filter students and submissions based on search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submittedStudents = filteredStudents.filter((s) => s.submission_count > 0);
  const pendingStudents = filteredStudents.filter((s) => s.submission_count === 0);

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.student_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">Assignment not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            {assignment.title}
          </h1>
          <p className="text-sm text-text-muted">{assignment.course_title}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/instructor/assignments/${id}/edit`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Assignment
        </Button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-600">
                {statistics.total_assigned}
              </div>
              <div className="text-sm text-text-muted">Total Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {statistics.total_submitted}
              </div>
              <div className="text-sm text-text-muted">Submitted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {statistics.total_assigned - statistics.total_submitted}
              </div>
              <div className="text-sm text-text-muted">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.total_graded}
              </div>
              <div className="text-sm text-text-muted">Graded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.submission_rate}%
              </div>
              <div className="text-sm text-text-muted">Submission Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'students'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              All Students
            </button>
            <button
              onClick={() => setActiveTab('submitted')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'submitted'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline-block mr-2" />
              Submitted
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'pending'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline-block mr-2" />
              Pending
            </button>
          </nav>
        </div>

        <CardContent className="p-4 sm:p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-muted">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded ${
                        assignment.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {assignment.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Maximum Score</label>
                  <p className="mt-1 text-text-primary">{assignment.max_score} points</p>
                </div>
                {assignment.due_date && (
                  <div>
                    <label className="text-sm font-medium text-text-muted">Due Date</label>
                    <div className="mt-1 flex items-center gap-2 text-text-primary">
                      <Calendar className="w-4 h-4" />
                      {formatDate(assignment.due_date)}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-text-muted">Submission Format</label>
                  <p className="mt-1 text-text-primary capitalize">{assignment.submission_format}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted">Description</label>
                <p className="mt-1 text-text-primary">{assignment.description || 'No description'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted">Instructions</label>
                <p className="mt-1 text-text-primary whitespace-pre-wrap">
                  {assignment.instructions || 'No instructions provided'}
                </p>
              </div>

              {assignment.file_requirements && (
                <div>
                  <label className="text-sm font-medium text-text-muted">File Requirements</label>
                  <p className="mt-1 text-text-primary">{assignment.file_requirements}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={assignment.allow_resubmission}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm text-text-primary">Allow resubmission</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={assignment.allow_late_submission}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm text-text-primary">Allow late submission</span>
                </div>
              </div>
            </div>
          )}

          {/* All Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Students List */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  {searchQuery ? 'No students match your search' : 'No students assigned yet'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                          Student
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                          Score
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                          Submissions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {student.profile_photo ? (
                                <img
                                  src={student.profile_photo}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-600">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="font-medium text-text-primary">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-text-muted">{student.email}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(student.latest_status, student.submission_count > 0)}
                          </td>
                          <td className="py-3 px-4 text-sm text-text-primary">
                            {student.latest_score !== null
                              ? `${student.latest_score}/${assignment.max_score}`
                              : '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-text-primary">
                            {student.submission_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Submitted Tab */}
          {activeTab === 'submitted' && (
            <div className="space-y-4">
              {/* Submitted Students List */}
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      No submissions received yet.
                    </h3>
                    <p className="text-sm text-text-muted max-w-md">
                      {searchQuery 
                        ? 'No submitted students match your search criteria.' 
                        : 'Students haven\'t submitted their assignments yet. They will appear here once they submit.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => {
                    return (
                      <div
                        key={submission.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              {submission.profile_photo ? (
                                <img
                                  src={submission.profile_photo}
                                  alt={submission.student_name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-lg font-medium text-primary-600">
                                    {submission.student_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-text-primary text-lg">
                                  {submission.student_name}
                                </h3>
                                <p className="text-sm text-text-muted">{submission.student_email}</p>
                                
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {getStatusBadge(submission.status, true, submission.is_late)}
                                  <span className="text-xs text-text-muted">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {formatDate(submission.submitted_at)}
                                  </span>
                                  {submission.submission_count > 1 && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                      {submission.submission_count} submission(s)
                                    </span>
                                  )}
                                </div>

                                {submission.file_name && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-text-primary bg-gray-50 p-2 rounded">
                                    <FileText className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium">File:</span>
                                    <span className="truncate">{submission.file_name}</span>
                                  </div>
                                )}

                                {submission.notes && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                    <p className="text-sm text-text-primary">
                                      <strong className="text-blue-700">Student Notes:</strong> {submission.notes}
                                    </p>
                                  </div>
                                )}

                                {submission.score !== null && (
                                  <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-bold text-primary-600">
                                        {submission.score}
                                      </span>
                                      <span className="text-lg text-text-muted">
                                        /{assignment.max_score}
                                      </span>
                                    </div>
                                    <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                                      {Math.round((submission.score / assignment.max_score) * 100)}%
                                    </span>
                                  </div>
                                )}

                                {submission.feedback && (
                                  <div className="mt-2 p-3 bg-green-50 rounded border border-green-100">
                                    <p className="text-sm text-text-primary">
                                      <strong className="text-green-700">Instructor Feedback:</strong> {submission.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 lg:flex-col">
                            {submission.file_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(submission.file_url!, '_blank')}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => openGradingModal(submission)}
                            >
                              {submission.score !== null ? 'Re-grade' : 'Grade'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pending Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {/* Pending Students List */}
              {pendingStudents.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  {searchQuery ? 'No pending students match your search' : 'All students have submitted!'}
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingStudents.map((student) => (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        {student.profile_photo ? (
                          <img
                            src={student.profile_photo}
                            alt={student.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-text-primary">
                                {student.name}
                              </h3>
                              <p className="text-sm text-text-muted">{student.email}</p>
                            </div>
                            {getStatusBadge(null, false)}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                            <Clock className="w-4 h-4" />
                            {assignment.due_date ? (
                              <>
                                Due: {formatDate(assignment.due_date)}
                                {new Date(assignment.due_date) < new Date() && (
                                  <span className="text-red-600 font-medium">(Overdue)</span>
                                )}
                              </>
                            ) : (
                              'No due date set'
                            )}
                          </div>
                          <div className="mt-1 text-xs text-text-muted">
                            Assigned on {formatDate(student.assigned_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Grade Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGradeSubmission} className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted mb-2">
                    Student: <strong>{gradingSubmission.student_name}</strong>
                  </p>
                  <p className="text-xs text-text-muted">
                    Submitted: {formatDate(gradingSubmission.submitted_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Score (out of {assignment.max_score})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={assignment.max_score}
                    step="0.5"
                    required
                    value={gradeForm.score || ''}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, score: e.target.value === '' ? 0 : parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Feedback
                  </label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="Provide feedback to the student..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGradingSubmission(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Grade
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Submission Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submission Details</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingSubmission(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student Info */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                {viewingSubmission.profile_photo ? (
                  <img
                    src={viewingSubmission.profile_photo}
                    alt={viewingSubmission.student_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-medium text-primary-600">
                      {viewingSubmission.student_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-text-primary">
                    {viewingSubmission.student_name}
                  </h3>
                  <p className="text-sm text-text-muted">{viewingSubmission.student_email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(viewingSubmission.status, true, viewingSubmission.is_late)}
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-muted">Submission Date & Time</label>
                  <div className="mt-1 flex items-center gap-2 text-text-primary">
                    <Calendar className="w-4 h-4" />
                    {formatDate(viewingSubmission.submitted_at)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Submission Count</label>
                  <p className="mt-1 text-text-primary">
                    {viewingSubmission.submission_count} time(s)
                  </p>
                </div>
                {viewingSubmission.score !== null && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-text-muted">Score</label>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary-600">
                          {viewingSubmission.score}
                        </span>
                        <span className="text-lg text-text-muted">
                          /{assignment.max_score}
                        </span>
                        <span className="ml-2 text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                          {Math.round((viewingSubmission.score / assignment.max_score) * 100)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submitted File */}
              {viewingSubmission.file_name ? (
                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">
                    Submitted File/Document
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{viewingSubmission.file_name}</p>
                      {viewingSubmission.file_url && (
                        <a
                          href={viewingSubmission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          View file
                        </a>
                      )}
                    </div>
                    {viewingSubmission.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(viewingSubmission.file_url!, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">
                    Submitted File/Document
                  </label>
                  <p className="text-sm text-text-muted italic">No file submitted</p>
                </div>
              )}

              {/* Student Notes */}
              {viewingSubmission.notes && (
                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">
                    Student Notes
                  </label>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-text-primary whitespace-pre-wrap">
                      {viewingSubmission.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Instructor Feedback */}
              {viewingSubmission.feedback && (
                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">
                    Instructor Feedback
                  </label>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-text-primary whitespace-pre-wrap">
                      {viewingSubmission.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingSubmission(null);
                    openGradingModal(viewingSubmission);
                  }}
                  className="flex-1"
                >
                  {viewingSubmission.score !== null ? 'Re-grade' : 'Grade Submission'}
                </Button>
                {viewingSubmission.file_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(viewingSubmission.file_url!, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
