'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, Eye, Clock, FileText, Users } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  course_title: string;
  course_id: number;
  quiz_type: string;
  due_date: string | null;
  total_marks: number;
  passing_marks: number;
  time_limit_minutes: number | null;
  is_published: boolean;
  attempt_count: number;
  student_count: number;
  question_count: number;
  created_at: string;
}

export default function InstructorQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setQuizzes([]);
        return;
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err: any) {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete quiz');

      setQuizzes(quizzes.filter(q => q.id !== id));
      alert('Quiz deleted successfully');
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
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Quizzes & Tests</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Quizzes & Tests</h1>
          <p className="text-sm text-text-muted mt-1">Create and manage quizzes and tests for your courses</p>
        </div>
        <Button onClick={() => router.push('/instructor/quizzes/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary-600">{quizzes.length}</div>
            <div className="text-sm text-text-muted">Total Quizzes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {quizzes.filter(q => q.is_published).length}
            </div>
            <div className="text-sm text-text-muted">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {quizzes.reduce((sum, q) => sum + q.attempt_count, 0)}
            </div>
            <div className="text-sm text-text-muted">Total Attempts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {quizzes.reduce((sum, q) => sum + q.student_count, 0)}
            </div>
            <div className="text-sm text-text-muted">Students Engaged</div>
          </CardContent>
        </Card>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-muted mb-4">No quizzes created yet</p>
            <Button onClick={() => router.push('/instructor/quizzes/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => {
            const overdue = isOverdue(quiz.due_date);

            return (
              <Card key={quiz.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-text-muted mb-3">{quiz.description}</p>
                          
                          <div className="flex flex-wrap gap-2 text-xs mb-3">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {quiz.course_title}
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded capitalize">
                              {quiz.quiz_type}
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {quiz.question_count} Questions
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                              {quiz.total_marks} Marks
                            </span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {quiz.attempt_count} Attempts
                            </span>
                            {quiz.time_limit_minutes && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {quiz.time_limit_minutes} min
                              </span>
                            )}
                            {quiz.due_date && (
                              <span className={`px-2 py-1 rounded flex items-center gap-1 ${
                                overdue ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                <Clock className="w-3 h-3" />
                                {overdue ? 'Overdue' : `Due: ${formatDate(quiz.due_date)}`}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded ${
                              quiz.is_published 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {quiz.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          <div className="flex gap-4 text-sm text-text-muted">
                            <span>Pass: {quiz.passing_marks}/{quiz.total_marks}</span>
                            <span>•</span>
                            <span>{quiz.student_count} students engaged</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/instructor/quizzes/${quiz.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/instructor/quizzes/${quiz.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(quiz.id)}
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
