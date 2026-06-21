'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Clock, AlertCircle, Loader2, FileText, CheckSquare } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Submission {
  id: number;
  assignment_id: number;
  assignment_title: string;
  student_name: string;
  course_title: string;
  submitted_at: string;
  status: string;
}

export default function InstructorPendingSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Note: This requires an API endpoint that returns all submissions for instructor
        // For now, using mock data until the endpoint is available
        // const response = await assignmentService.getAllInstructorSubmissions();
        
        // Mock data - replace with actual API call when available
        const submissionsData: Submission[] = [];
        
        // Filter only pending/submitted assignments (not graded)
        const pending = submissionsData.filter(
          (sub: Submission) => sub.status === 'submitted' || sub.status === 'pending'
        );
        
        // Get only the 3 most recent pending submissions
        const recent = pending.slice(0, 3);
        setSubmissions(recent);
        setError('');
      } catch (err: any) {
        console.error('Failed to fetch submissions:', err);
        
        const status = err.response?.status;
        if (!status || status >= 500) {
          setError('Failed to load submissions');
        } else {
          setError('');
        }
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const submitted = new Date(dateString);
    const diffMs = now.getTime() - submitted.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[#1E88E5]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckSquare className="size-10 text-[#E0E0E0] mx-auto mb-3" />
            <p className="text-sm text-[#78909C] mb-4">
              All caught up! No pending submissions to grade.
            </p>
            <Link href="/instructor/assignments">
              <Button variant="outline" size="sm">
                View All Assignments
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Submissions</CardTitle>
          <Link href="/instructor/assignments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <Link
              key={submission.id}
              href={`/instructor/assignments/${submission.assignment_id}`}
              className="block"
            >
              <div className="p-4 border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1E3A5F] truncate">
                      {submission.assignment_title}
                    </h4>
                    <p className="text-xs text-[#78909C] mt-1">
                      Student: {submission.student_name}
                    </p>
                    <p className="text-xs text-[#78909C]">
                      Course: {submission.course_title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#78909C]">
                      <Clock className="size-3" />
                      Submitted: {getTimeAgo(submission.submitted_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
                      <FileText className="size-3" />
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
