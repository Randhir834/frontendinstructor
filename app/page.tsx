'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Quote, Zap, Target, GraduationCap } from 'lucide-react';
import { instructorRegistrationService } from '@/services/instructorRegistrationService';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', qualification: '', subject: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className={`w-full py-4 pr-6 md:pr-12 pl-2 md:pl-4 flex justify-between items-center bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'shadow-lg py-3' : ''}`}>
        <div className="flex items-center">
          <Link href="/" className="relative flex items-center justify-start shrink-0 transition-all duration-300 h-12 sm:h-14 md:h-16 w-auto hover:scale-105">
            <img
              src="/images/navbarlogo.png"
              alt="PlayFit LMS"
              className="w-auto h-full object-contain max-w-full max-h-full"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 font-medium text-dark-600">
            <a href="#features" className="hover:text-primary-600 transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#benefits" className="hover:text-primary-600 transition-colors relative group">
              Benefits
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#register" className="hover:text-primary-600 transition-colors relative group">
              Register
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
          </nav>
          <Link href="/login" className="hidden md:flex bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2">
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl font-medium">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">Benefits</a>
            <a href="#register" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-colors">Register</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md flex items-center gap-2">
              Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="md:w-1/2 flex flex-col gap-6 max-w-2xl z-10 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold w-fit shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
              <GraduationCap className="w-4 h-4" />
              Join Our Teaching Community
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark-900 leading-tight">
              Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-size-200 animate-gradient">Knowledge</span> With The World.
            </h1>
            <p className="text-lg md:text-xl text-dark-600 leading-relaxed max-w-xl">
              Become an instructor at PlayFit LMS and inspire thousands of students. Create courses, share your expertise, and make a difference in education.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#register" className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#features" className="group bg-white border-2 border-primary-200 hover:border-primary-500 hover:text-primary-600 text-dark-700 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-xl flex items-center gap-2">
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-dark-500">Trusted by 500+ instructors</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative flex justify-center items-center z-10 w-full max-w-lg animate-in slide-in-from-right duration-700 delay-200">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-secondary-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-tr from-primary-300 to-secondary-300 rounded-full blur-2xl opacity-40 animate-blob"></div>
              <div className="absolute inset-8 bg-gradient-to-tr from-primary-200 to-secondary-200 rounded-full blur-xl opacity-50 animate-blob animation-delay-2000"></div>
              
              <div className="relative w-full h-full bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 rounded-[2.5rem] border-[12px] border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col transform hover:scale-[1.02] hover:rotate-1 transition-all duration-700">
                <div className="flex-1 w-full bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 flex items-center justify-center relative overflow-hidden p-8">
                  <div className="absolute top-6 left-6 w-48 h-48 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full mix-blend-multiply opacity-50 animate-blob blur-sm"></div>
                  <div className="absolute top-6 right-6 w-48 h-48 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-2000 blur-sm"></div>
                  <div className="absolute -bottom-16 left-1/2 w-56 h-56 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000 blur-sm"></div>
                  
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}></div>
                  

                  <div className="z-10 bg-white/95 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white/80 flex flex-col gap-5 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl text-white transform hover:rotate-12 hover:scale-110 transition-all duration-500">
                        <GraduationCap size={48} className="drop-shadow-lg" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-dark-900 text-3xl tracking-tight">Teach With Us</h3>
                      <p className="text-dark-600 text-lg font-medium mt-1">Inspire Students</p>
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        ))}
                        <span className="text-sm font-semibold text-dark-700 ml-2">5.0</span>
                      </div>
                      <p className="text-xs text-dark-500 mt-2 font-medium">Based on 500+ instructor reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="py-24 px-6 bg-gradient-to-b from-white to-primary-50/30 flex flex-col items-center">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">Why Teach With PlayFit?</h2>
              <p className="text-dark-600 max-w-2xl mx-auto text-lg">Our comprehensive platform provides everything you need to create and deliver exceptional learning experiences.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Course Creation", desc: "Create engaging courses with our intuitive course builder. Upload materials, create quizzes, and track student progress.", color: "from-blue-500 to-blue-600" },
                { icon: Users, title: "Student Engagement", desc: "Connect with students through live classes, discussion forums, and personalized feedback systems.", color: "from-purple-500 to-purple-600" },
                { icon: Trophy, title: "Earn Recognition", desc: "Build your reputation as an expert instructor. Get certified and recognized for your teaching excellence.", color: "from-green-500 to-green-600" }
              ].map((feature, i) => (
                <div key={i} className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:border-primary-200 transition-all duration-500 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                  <p className="text-dark-600 leading-relaxed">{feature.desc}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <a href="#register" className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Get started <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 px-6 bg-white flex flex-col items-center">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star className="w-4 h-4 fill-current" />
                Instructor Benefits
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">What You'll Get</h2>
              <p className="text-dark-600 max-w-2xl mx-auto text-lg">Join our platform and enjoy exclusive benefits designed to help you succeed as an instructor.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Flexible Schedule",
                  content: "Teach at your own pace. Create courses on your schedule and reach students globally without time constraints.",
                  icon: CheckCircle
                },
                {
                  title: "Competitive Earnings",
                  content: "Earn competitive rates for your courses. The more students you teach, the more you earn.",
                  icon: CheckCircle
                },
                {
                  title: "Professional Development",
                  content: "Access training resources and workshops to enhance your teaching skills and stay updated with best practices.",
                  icon: CheckCircle
                },
                {
                  title: "Supportive Community",
                  content: "Connect with fellow instructors, share experiences, and collaborate on course development.",
                  icon: CheckCircle
                }
              ].map((benefit, i) => (
                <div key={i} className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 border border-primary-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 text-xl mb-2">{benefit.title}</h4>
                      <p className="text-dark-600 leading-relaxed">{benefit.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="register" className="py-24 px-6 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 relative overflow-hidden flex justify-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400 rounded-full mix-blend-overlay blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 relative z-10 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Join Our Community
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to Start Teaching?</h2>
              <p className="text-dark-200 text-lg md:text-xl leading-relaxed">
                Register as an instructor today and start sharing your knowledge with thousands of eager students. Build your teaching career with PlayFit LMS.
              </p>
              <ul className="space-y-4 mt-8">
                {[
                  { icon: CheckCircle, text: "Create and sell your courses" },
                  { icon: CheckCircle, text: "Access teaching tools and resources" },
                  { icon: CheckCircle, text: "Connect with students worldwide" },
                  { icon: CheckCircle, text: "Earn competitive income" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-100 group">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                      <item.icon className="text-primary-400 w-5 h-5 flex-shrink-0" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 backdrop-blur-xl transform hover:scale-105 transition-transform duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-2">Instructor Registration</h3>
                <p className="text-sm text-dark-500">Fill out the form below to join our teaching community.</p>
              </div>
              
              {submitted ? (
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 text-primary-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Registration Submitted! 🎉</h4>
                    <p className="text-primary-700">Thanks for your interest. We'll contact you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center animate-in shake-in duration-300">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-semibold text-dark-900">Full Name</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="qualification" className="block text-sm font-semibold text-dark-900">Qualification</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        id="qualification" 
                        name="qualification"
                        required
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-sm font-semibold text-dark-900">Subject Expertise</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-semibold text-dark-900">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-sm text-dark-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Registration
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-dark-500 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="relative flex items-center justify-center shrink-0 transition-all duration-300 h-12 w-auto hover:scale-105">
                <img
                  src="/images/navbarlogo.png"
                  alt="PlayFit LMS"
                  className="w-full h-full object-contain max-w-full max-h-full"
                />
              </Link>
            </div>
            <p className="max-w-md text-gray-400 leading-relaxed mb-6">Empowering instructors to share knowledge and inspire students worldwide. Join our community of expert educators.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Features</a></li>
              <li><a href="#benefits" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Benefits</a></li>
              <li><a href="#register" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Register</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2024 PlayFit LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
