'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Star, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  Eye,
  Filter,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  email?: string;
  phone?: string;
  course_name?: string;
  created_at: string;
}

export default function InstructorReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [authError, setAuthError] = useState(false);

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token) {
        setAuthError(true);
        toast.error('Please login to access this page');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
      
      try {
        const userData = user ? JSON.parse(user) : null;
        if (userData?.role !== 'instructor' && userData?.role !== 'admin') {
          setAuthError(true);
          toast.error('Access denied. Instructor privileges required.');
          setTimeout(() => router.push('/instructor'), 2000);
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!authError) {
      fetchReviews();
    }
  }, [selectedStatus, authError]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fetch approved reviews from public endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/approved?limit=100`);
      const data = await response.json();
      
      let filteredReviews = data.reviews || [];
      
      // Filter by status if not 'all'
      if (selectedStatus !== 'all') {
        filteredReviews = filteredReviews.filter((r: Review) => r.status === selectedStatus);
      }
      
      setReviews(filteredReviews);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            Course Reviews
          </h1>
          <p className="text-gray-600 mt-2">
            View student and parent reviews for courses
          </p>
        </div>

        {/* Authentication Error */}
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Authentication Required</h3>
                <p className="text-red-700 text-sm">
                  Please login as an instructor to access this page. Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Viewing Approved Reviews</h3>
              <p className="text-blue-700 text-sm mt-1">
                You can view all approved reviews for courses. Only administrators can approve or reject reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Approved Reviews</p>
              <p className="text-3xl font-bold text-green-600">{reviews.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">
              No approved reviews available yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          {getStatusBadge(review.status)}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{review.role}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 leading-relaxed mb-3 pl-15">
                      "{review.message}"
                    </p>

                    {/* Additional Info */}
                    <div className="pl-15 space-y-1">
                      {review.course_name && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Course:</span> {review.course_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
