'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';

interface Course {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [formData, setFormData] = useState({
    course_id: '',
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

  const [assignmentType, setAssignmentType] = useState<'all' | 'specific'>('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.course_id) {
      fetchEnrolledStudents(parseInt(formData.course_id));
    }
  }, [formData.course_id]);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getMyCourses();
      setCourses(data.courses || []);
    } catch (err: any) {
      console.error('Failed to fetch courses:', err);
      alert('Failed to fetch courses. Please try again.');
    }
  };

  const fetchEnrolledStudents = async (courseId: number) => {
    setLoadingStudents(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data.enrollments?.map((e: any) => ({
        id: e.user_id,
        name: e.student_name,
        email: e.student_email,
      })) || []);
    } catch (err: any) {
      console.error('Failed to fetch students:', err);
      alert('Failed to fetch students. Please try again.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (assignmentType === 'specific' && selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          course_id: parseInt(formData.course_id),
          assign_to_all: assignmentType === 'all',
          student_ids: assignmentType === 'specific' ? selectedStudents : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create assignment');

      alert('Assignment created successfully!');
      router.push('/instructor/assignments');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Create Assignment</h1>
        <p className="text-sm text-text-muted mt-1">Create a new assignment for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Course *
              </label>
              <select
                required
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

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
                  Maximum Score
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_score}
                  onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_resubmission}
                  onChange={(e) => setFormData({ ...formData, allow_resubmission: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Allow resubmission</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_late_submission}
                  onChange={(e) => setFormData({ ...formData, allow_late_submission: e.target.checked })}
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
                <span className="text-sm text-text-primary">Publish immediately</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Student Assignment */}
        {formData.course_id && (
          <Card>
            <CardHeader>
              <CardTitle>Assign to Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignmentType === 'all'}
                    onChange={() => setAssignmentType('all')}
                    className="rounded-full"
                  />
                  <span className="text-sm text-text-primary">
                    Assign to all enrolled students
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignmentType === 'specific'}
                    onChange={() => setAssignmentType('specific')}
                    className="rounded-full"
                  />
                  <span className="text-sm text-text-primary">Assign to specific students</span>
                </label>
              </div>

              {assignmentType === 'specific' && (
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {loadingStudents ? (
                    <p className="text-sm text-text-muted">Loading students...</p>
                  ) : students.length === 0 ? (
                    <p className="text-sm text-text-muted">No students enrolled in this course</p>
                  ) : (
                    <div className="space-y-2">
                      {students.map((student) => (
                        <label key={student.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(
                                  selectedStudents.filter((id) => id !== student.id)
                                );
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-text-primary">
                            {student.name} ({student.email})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </div>
  );
}