'use client';

import Link from 'next/link';
import { Sparkles, Target, Brain, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default function InstructorOpportunitySection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Find Your Teaching Niche
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Discover the <span className="text-blue-600">Perfect Subject</span> to Teach
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Share your expertise in subjects you're passionate about. From creative arts to strategic thinking, from music to public speaking - find where your skills can inspire students.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            {
              icon: Brain,
              title: 'Match Your Expertise',
              description: 'Teach in subjects that align with your qualifications, experience, and passion.',
              color: 'bg-blue-50 border-blue-200',
              iconBg: 'bg-blue-500'
            },
            {
              icon: Target,
              title: 'Flexible Schedule',
              description: 'Set your own availability and teach at times that work best for you.',
              color: 'bg-purple-50 border-purple-200',
              iconBg: 'bg-purple-500'
            },
            {
              icon: TrendingUp,
              title: 'Grow Your Career',
              description: 'Build your reputation, reach thousands of students, and earn competitive income.',
              color: 'bg-green-50 border-green-200',
              iconBg: 'bg-green-500'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`${feature.color} border-2 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.iconBg} rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4`}>
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Start Teaching?
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Join our community of expert instructors and start making an impact. Apply now and get started within 48 hours.
            </p>
            
            <Link
              href="#register"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 text-sm sm:text-base font-semibold rounded-md hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Apply to Teach
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-blue-100 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Quick Application</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>48-Hour Review</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start Earning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
