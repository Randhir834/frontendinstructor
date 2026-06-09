'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';


interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions: string;
  course_id: number;
  due_date: string | null;
  max_score: number;
  file_requirements: string;
  allow_resubmission: boolean;
  allow_late_submission: boolean;
  is_published: boolean;
  submission_format: string;
}

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    due_date: '',
    max_score: 100,
    file_requirements: '',
    allow_resubmission: false,
    allow_late_submission: false,
    is_published: true,
    submission_format: 'file',
  });

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch assignment');

      const data = await response.json();
      const assignment = data.assignment;

      // Format due_date for datetime-local input
      let formattedDueDate = '';
      if (assignment.due_date) {
        const date = new Date(assignment.due_date);
        formattedDueDate = date.toISOString().slice(0, 16);
      }

      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        instructions: assignment.instructions || '',
        due_date: formattedDueDate,
        max_score: assignment.max_score || 100,
        file_requirements: assignment.file_requirements || '',
        allow_resubmission: assignment.allow_resubmission || false,
        allow_late_submission: assignment.allow_late_submission || false,
        is_published: assignment.is_published !== false,
        submission_format: assignment.submission_format || 'file',
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update assignment');

      alert('Assignment updated successfully!');
      router.push(`/instructor/assignments/${id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Edit Assignment</h1>
        <p className="text-sm text-text-muted mt-1">Update assignment details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={5}
                placeholder="Enter detailed instructions for students"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Maximum Score *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.max_score}
                  onChange={(e) =>
                    setFormData({ ...formData, max_score: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                File Requirements
              </label>
              <input
                type="text"
                value={formData.file_requirements}
                onChange={(e) => setFormData({ ...formData, file_requirements: e.target.value })}
                placeholder="e.g., PDF, DOC, Max 10MB"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Submission Format
              </label>
              <select
                value={formData.submission_format}
                onChange={(e) => setFormData({ ...formData, submission_format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="file">File Upload</option>
                <option value="text">Text</option>
                <option value="link">Link</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_resubmission}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_resubmission: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Allow resubmission</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_late_submission}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_late_submission: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Allow late submission</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Published</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
