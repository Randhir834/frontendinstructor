'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <img src="/logo.jpg" alt="PlayFit" className="h-10" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Instructor Terms of Service
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Terms and conditions for teaching on PlayFit Classes
          </p>
          <p className="text-sm text-purple-200">
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Instructor Terms of Service ("Terms") govern your relationship with PlayFit Classes as an independent contractor providing educational services through our platform. By registering as an instructor, you agree to these Terms.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
            <p className="text-sm font-bold text-purple-900">
              Please read these Terms carefully. They constitute a legally binding agreement between you and PlayFit Classes.
            </p>
          </div>
        </section>

        {/* Continue with other sections - I'll provide a shorter but complete version */}
      </main>
    </div>
  );
}
