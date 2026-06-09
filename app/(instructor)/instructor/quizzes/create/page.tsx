'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { Plus, Trash2, Save } from 'lucide-react';

interface Course {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface QuestionOption {
  option_text: string;
  is_correct: boolean;
}

interface Question {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  marks: number;
  explanation: string;
  options: QuestionOption[];
}

export default function CreateQuizPage() {
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
    quiz_type: 'test',
    time_limit_minutes: '',
    total_marks: 100,
    passing_marks: 40,
    allow_retake: false,
    max_attempts: 1,
    show_results_immediately: true,
    show_correct_answers: false,
    randomize_questions: false,
    randomize_options: false,
    is_published: true,
    start_date: '',
    due_date: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
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

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'multiple_choice',
        marks: 1,
        explanation: '',
        options: [
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ option_text: '', is_correct: false });
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[questionIndex].options[optionIndex] as any)[field] = value;
    
    // If marking as correct, unmark others for single-answer questions
    if (field === 'is_correct' && value === true && updated[questionIndex].question_type === 'multiple_choice') {
      updated[questionIndex].options.forEach((opt, idx) => {
        if (idx !== optionIndex) opt.is_correct = false;
      });
    }
    
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (assignmentType === 'specific' && selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Calculate total marks from questions
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Create quiz
      const quizResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          course_id: parseInt(formData.course_id),
          total_marks: totalMarks,
          time_limit_minutes: formData.time_limit_minutes ? parseInt(formData.time_limit_minutes) : null,
          assign_to_all: assignmentType === 'all',
          student_ids: assignmentType === 'specific' ? selectedStudents : undefined,
        }),
      });

      if (!quizResponse.ok) throw new Error('Failed to create quiz');

      const quizData = await quizResponse.json();
      const quizId = quizData.quiz.id;

      // Add questions
      for (const question of questions) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(question),
        });
      }

      alert('Quiz created successfully!');
      router.push('/instructor/quizzes');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Create Quiz / Test</h1>
        <p className="text-sm text-text-muted mt-1">Create a new quiz or test for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Quiz Type *
                </label>
                <select
                  required
                  value={formData.quiz_type}
                  onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="exam">Exam</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
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
                placeholder="Provide instructions for students..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.time_limit_minutes}
                  onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="No limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Passing Marks
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.passing_marks}
                  onChange={(e) => setFormData({ ...formData, passing_marks: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_attempts}
                  onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

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
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_retake}
                  onChange={(e) => setFormData({ ...formData, allow_retake: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Allow retake</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.show_results_immediately}
                  onChange={(e) => setFormData({ ...formData, show_results_immediately: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Show results immediately after submission</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.show_correct_answers}
                  onChange={(e) => setFormData({ ...formData, show_correct_answers: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Show correct answers after submission</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.randomize_questions}
                  onChange={(e) => setFormData({ ...formData, randomize_questions: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Randomize question order</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.randomize_options}
                  onChange={(e) => setFormData({ ...formData, randomize_options: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">Randomize option order</span>
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

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p className="mb-4">No questions added yet</p>
                <Button type="button" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              questions.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-text-primary">Question {qIndex + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Question Type
                      </label>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) => updateQuestion(qIndex, 'marks', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Question Text *
                    </label>
                    <textarea
                      required
                      value={question.question_text}
                      onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>

                  {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-text-primary">
                          Options
                        </label>
                        {question.question_type === 'multiple_choice' && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(qIndex)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={option.is_correct}
                              onChange={(e) => updateOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                              className="rounded"
                            />
                            <input
                              type="text"
                              required
                              value={option.option_text}
                              onChange={(e) => updateOption(qIndex, oIndex, 'option_text', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            {question.question_type === 'multiple_choice' && question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Explanation (optional)
                    </label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      placeholder="Explanation shown to students after submission..."
                    />
                  </div>
                </div>
              ))
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Marks:</strong> {questions.reduce((sum, q) => sum + q.marks, 0)}
              </p>
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
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {loadingStudents ? (
                    <p className="text-sm text-text-muted">Loading students...</p>
                  ) : students.length === 0 ? (
                    <p className="text-sm text-text-muted">No students enrolled in this course</p>
                  ) : (
                    students.map((student) => (
                      <label key={student.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter((id) => id !== student.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-text-primary">
                          {student.name} ({student.email})
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/instructor/quizzes')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
}
