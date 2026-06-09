'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Eye, Clock } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  course_title: string;
  course_id: number;
  due_date: string | null;
  max_score: number;
  is_published: boolean;
  submission_count: number;
  student_count: number;
  created_at: string;
  allow_late_submission: boolean;
}

export default function InstructorAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setAssignments([]);
        return;
      }

      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (err: any) {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete assignment');

      // Update the local state to remove the deleted assignment
      setAssignments(assignments.filter(a => a.id !== id));
      alert('Assignment deleted successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Assignments</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Assignments</h1>
          <p className="text-sm text-text-muted mt-1">Create and manage assignments for your courses</p>
        </div>
        <Button onClick={() => router.push('/instructor/assignments/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-text-muted mb-4">No assignments created yet</p>
            <Button onClick={() => router.push('/instructor/assignments/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const overdue = isOverdue(assignment.due_date);

            return (
              <Card key={assignment.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-text-muted mb-2">{assignment.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {assignment.course_title}
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {assignment.max_score} Points
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {assignment.submission_count} Submissions
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                              {assignment.student_count} Students
                            </span>
                            {assignment.due_date && (
                              <span className={`px-2 py-1 rounded flex items-center gap-1 ${
                                overdue
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                <Clock className="w-3 h-3" />
                                Due: {formatDate(assignment.due_date)}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded ${
                              assignment.is_published 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {assignment.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/instructor/assignments/${assignment.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/instructor/assignments/${assignment.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
