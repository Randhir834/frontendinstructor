'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Search,
  Filter,
} from 'lucide-react';

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

interface Assignment {
  id: number;
  title: string;
  max_score: number;
}

export default function AssignmentSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({
    score: 0,
    feedback: '',
    status: 'graded',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (id) {
      fetchAssignment();
      fetchSubmissions();
    }
  }, [id]);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchQuery, statusFilter]);

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (searchQuery) {
      filtered = filtered.filter(
        (sub) =>
          sub.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.student_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'graded') {
        filtered = filtered.filter((sub) => sub.status === 'graded');
      } else if (statusFilter === 'submitted') {
        filtered = filtered.filter((sub) => sub.status === 'submitted');
      } else if (statusFilter === 'late') {
        filtered = filtered.filter((sub) => sub.is_late);
      }
    }

    setFilteredSubmissions(filtered);
  };

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch submissions' }));
        throw new Error(errorData.error || 'Failed to fetch submissions');
      }

      const data = await response.json();
      console.log('Submissions data:', data); // Debug log
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      alert(err.message);
    } finally {
      setLoading(false);
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
      fetchSubmissions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openGradingModal = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeForm({
      score: submission.score || 0,
      feedback: submission.feedback || '',
      status: 'graded',
    });
  };

  const getStatusBadge = (status: string, isLate: boolean) => {
    if (isLate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
          <Clock className="w-3 h-3" />
          Late
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubmissionStats = () => {
    const total = submissions.length;
    const graded = submissions.filter((s) => s.status === 'graded').length;
    const pending = submissions.filter((s) => s.status === 'submitted').length;
    const late = submissions.filter((s) => s.is_late).length;
    
    return { total, graded, pending, late };
  };

  const stats = getSubmissionStats();

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            {assignment?.title} - Submissions
          </h1>
          <p className="text-sm text-text-muted">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-text-muted">Total Submissions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
            <div className="text-sm text-text-muted">Graded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-text-muted">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            <div className="text-sm text-text-muted">Late</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {submission.profile_photo ? (
                          <img
                            src={submission.profile_photo}
                            alt={submission.student_name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {submission.student_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary">
                            {submission.student_name}
                          </h3>
                          <p className="text-sm text-text-muted">{submission.student_email}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(submission.status, submission.is_late)}
                            <span className="text-xs text-text-muted">
                              Submitted {formatDate(submission.submitted_at)}
                            </span>
                            {submission.submission_count > 1 && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Resubmission #{submission.submission_count}
                              </span>
                            )}
                          </div>
                          {submission.file_name && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-text-primary">
                              <FileText className="w-4 h-4" />
                              {submission.file_name}
                            </div>
                          )}
                          {submission.notes && (
                            <p className="text-sm text-text-muted mt-2">
                              <strong>Notes:</strong> {submission.notes}
                            </p>
                          )}
                          {submission.score !== null && (
                            <div className="mt-2">
                              <span className="text-lg font-semibold text-primary-600">
                                {submission.score}/{assignment?.max_score}
                              </span>
                            </div>
                          )}
                          {submission.feedback && (
                            <div className="mt-2 p-2 bg-blue-50 rounded">
                              <p className="text-sm text-text-primary">
                                <strong>Feedback:</strong> {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {submission.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(submission.file_url!, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
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
              ))}
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
                    Score (out of {assignment?.max_score})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={assignment?.max_score}
                    step="0.5"
                    required
                    value={gradeForm.score}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, score: parseFloat(e.target.value) })
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
    </div>
  );
}
