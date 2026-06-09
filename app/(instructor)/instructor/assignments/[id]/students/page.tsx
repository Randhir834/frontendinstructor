'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, UserPlus, Trash2, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';

interface Student {
  id: number;
  student_id: number;
  name: string;
  email: string;
  profile_photo: string | null;
  assigned_at: string;
  is_submitted: boolean;
  submission_count: number;
  latest_status: string | null;
  latest_score: number | null;
  phone?: string;
  grade?: string;
  school?: string;
}

interface Assignment {
  id: number;
  title: string;
  course_id: number;
  course_title: string;
  max_score: number;
}

export default function AssignmentStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    school: '',
  });

  useEffect(() => {
    if (id) {
      fetchAssignment();
      fetchStudents();
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
      setAssignment(data.assignment);
    } catch (err: any) {
      alert(err.message);
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch students' }));
        throw new Error(errorData.error || 'Failed to fetch students');
      }

      const data = await response.json();
      console.log('Students data:', data); // Debug log
      
      // Map the data correctly from the API response
      const mappedStudents = (data.assignments || []).map((item: any) => ({
        id: item.id,
        student_id: item.student_id,
        name: item.name,
        email: item.email,
        profile_photo: item.profile_photo,
        assigned_at: item.assigned_at,
        is_submitted: item.submission_count > 0,
        submission_count: item.submission_count || 0,
        latest_status: item.latest_status,
        latest_score: item.latest_score,
        phone: item.phone,
        grade: item.grade,
        school: item.school,
      }));
      
      setStudents(mappedStudents);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm('Are you sure you want to remove this student from the assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/assignments/${studentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to remove student');

      setStudents(students.filter((s) => s.student_id !== studentId));
      alert('Student removed successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      grade: student.grade || '',
      school: student.school || '',
    });
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${editingStudent.student_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error('Failed to update student');

      alert('Student updated successfully');
      setEditingStudent(null);
      fetchStudents(); // Refresh the list
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string | null, isSubmitted: boolean) => {
    if (!isSubmitted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
          <Clock className="w-3 h-3" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
              {assignment?.title} - Students
            </h1>
            <p className="text-sm text-text-muted">
              {students.length} student{students.length !== 1 ? 's' : ''} assigned
            </p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assigned Students</CardTitle>
            <Button
              size="sm"
              onClick={() => router.push(`/instructor/assignments/${id}/edit`)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Manage Students
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              No students assigned to this assignment yet
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
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
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
                        {getStatusBadge(student.latest_status, student.is_submitted)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {student.latest_score !== null
                          ? `${student.latest_score}/${assignment?.max_score}`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        {student.submission_count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveStudent(student.student_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Student</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={editForm.grade}
                    onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    value={editForm.school}
                    onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingStudent(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Changes
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
