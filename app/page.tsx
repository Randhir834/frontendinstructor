'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, TrendingUp, Award, Mail, Phone } from 'lucide-react';
import { instructorRegistrationService } from '@/services/instructorRegistrationService';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', qualification: '', subject: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await instructorRegistrationService.registerInstructor(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', qualification: '', subject: '', phone: '' });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error submitting instructor registration:', err);
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to submit registration. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <Link href="/" className="flex items-center">
              <img
                src="/images/playfit-logo.jpg"
                alt="Playfit"
                className="h-12 md:h-16 lg:h-20 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#benefits" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Benefits
              </Link>
              <Link href="#register" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Join Now
              </Link>
              <Link href="/login" className="ml-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-6 py-4 space-y-4">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                Features
              </Link>
              <Link href="#benefits" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                Benefits
              </Link>
              <Link href="#register" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700">
                Join Now
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md text-center">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Clean & Professional */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Share Your Knowledge & Inspire Students
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Join Playfit as an instructor and teach <span className="font-semibold text-white">live online classes</span> in your area of expertise. Build your reputation, reach thousands of students, and earn competitive income on your schedule.
              </p>
              <div>
                <Link 
                  href="#register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                >
                  BECOME AN INSTRUCTOR
                </Link>
              </div>
            </div>

            {/* Right Visual - Abstract Shapes */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean Numbers */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Active Instructors" },
              { number: "10,000+", label: "Students Taught" },
              { number: "1,000+", label: "Courses Created" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Minimal Cards */}
      <section id="features" className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Teach With Playfit?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to create engaging courses and reach students worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Course Creation", desc: "Intuitive course builder with video upload, quizzes, and assignments", color: "bg-red-50 border-red-200", icon: "📚" },
              { title: "Live Classes", desc: "Conduct interactive live sessions with integrated video conferencing", color: "bg-pink-50 border-pink-200", icon: "🎥" },
              { title: "Student Management", desc: "Track student progress, provide feedback, and manage enrollments", color: "bg-purple-50 border-purple-200", icon: "👥" },
              { title: "Analytics Dashboard", desc: "Monitor course performance, student engagement, and earnings", color: "bg-blue-50 border-blue-200", icon: "📊" },
              { title: "Marketing Support", desc: "Reach thousands of students through our promotional platform", color: "bg-green-50 border-green-200", icon: "📢" },
              { title: "Reliable Payments", desc: "Get paid on time with transparent tracking and multiple payment options", color: "bg-yellow-50 border-yellow-200", icon: "💰" }
            ].map((feature, i) => (
              <div key={i} className={`${feature.color} border-2 rounded-lg p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Clean Layout */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-12">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Expert Teaching</h3>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Flexible Teaching Opportunities
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Teach what you love on your own schedule. Whether you're an expert in Art, Chess, Piano, Programming, or any other skill - create courses that inspire and educate students of all ages.
              </p>
              <Link 
                href="#register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                APPLY TO BECOME AN INSTRUCTOR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Dark Navy Background */}
      <section className="py-20 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Build Your Teaching Career
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Join our growing community of expert instructors. Create engaging courses, earn recognition, and make a meaningful impact on students' lives while enjoying competitive earnings and flexible schedules.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="px-4 py-2 bg-white/10 rounded">Flexible Hours</span>
                <span className="px-4 py-2 bg-white/10 rounded">Competitive Pay</span>
                <span className="px-4 py-2 bg-white/10 rounded">Global Reach</span>
              </div>
              <Link 
                href="#register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Instructor Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Hear from instructors who are making a difference through Playfit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "DR. PRIYA", subject: "COMPUTER SCIENCE", achievement: "TOP INSTRUCTOR", students: "500+ STUDENTS", color: "bg-gradient-to-br from-red-400 to-red-600" },
              { name: "PROF. RAJESH", subject: "MATHEMATICS", achievement: "MASTER EDUCATOR", students: "800+ STUDENTS", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
              { name: "MS. ANANYA", subject: "CREATIVE WRITING", achievement: "RISING STAR", students: "350+ STUDENTS", color: "bg-gradient-to-br from-purple-400 to-purple-600" }
            ].map((instructor, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-20 h-20 ${instructor.color} rounded-full flex items-center justify-center text-3xl flex-shrink-0`}>
                    👤
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{instructor.name}</h3>
                      <p className="text-sm text-gray-600">{instructor.subject}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{instructor.achievement}</p>
                      <p className="text-sm text-gray-600">{instructor.students}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Apply to Become an Instructor
              </h2>
              <p className="text-lg text-gray-600">
                Submit your application and our team will review it within 48 hours
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted Successfully!</h3>
                <p className="text-gray-600">Thank you for your interest. We'll review your application and contact you within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Master's in Computer Science"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject/Expertise *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="art">Art & Drawing</option>
                      <option value="chess">Chess</option>
                      <option value="piano">Piano</option>
                      <option value="phonics">Phonics</option>
                      <option value="speaking">Public Speaking</option>
                      <option value="abacus">Abacus</option>
                      <option value="readers">Reader's Club</option>
                      <option value="computers">Computers</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  We'll review your application within 48 hours and contact you with next steps.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="Playfit"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Join our platform to teach, inspire, and earn. Share your expertise with students worldwide.
              </p>
            </div>

            {/* For Instructors Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">For Instructors</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="text-sm text-gray-400 hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#register" className="text-sm text-gray-400 hover:text-white transition-colors">Apply Now</a></li>
                <li><Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Instructor Login</Link></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Become an Instructor</a></li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>instructors@playfit.com</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+1 (234) 567-890</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Playfit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
