'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Zap, Target, GraduationCap, Rocket, BarChart3, Video, Award, MessageCircle, Shield, TrendingUp, Clock, Mail, Phone, MapPin, Globe, CheckCircle2, ChevronRight, Sparkles, Heart, Brain, UserCheck, PlayCircle, Calendar } from 'lucide-react';
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
          <Link href="/" className="relative flex items-center justify-start shrink-0 transition-all duration-300 h-12 sm:h-14 md:h-16 w-auto hover:scale-105 group">
            <img
              src="/images/playfit-logo.jpg"
              alt="PlayFit"
              className="w-auto h-full object-contain max-w-full max-h-full transform group-hover:rotate-2 transition-transform"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 font-semibold text-dark-700">
            <a href="#features" className="hover:text-primary-600 transition-all relative group py-2">
              Features
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#benefits" className="hover:text-primary-600 transition-all relative group py-2">
              Benefits
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#testimonials" className="hover:text-primary-600 transition-all relative group py-2">
              Testimonials
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#faq" className="hover:text-primary-600 transition-all relative group py-2">
              FAQ
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
            <a href="#register" className="hover:text-primary-600 transition-all relative group py-2">
              Register
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
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
          <nav className="flex flex-col items-center justify-center h-full gap-8 text-xl font-semibold p-6">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Features</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Benefits</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">FAQ</a>
            <a href="#register" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary-600 transition-all hover:scale-110 active:scale-95">Register</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-10 py-4 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 mt-6">
              Login
              <ArrowRight className="w-5 h-5" />
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
              Become an instructor at PlayFit and inspire thousands of students. Create courses, share your expertise, and make a difference in education.
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

        {/* Feature Highlights - Enhanced to 6 cards */}
        <section id="features" className="py-28 px-6 bg-gradient-to-b from-white to-primary-50/30 flex flex-col items-center">
          <div className="max-w-7xl w-full">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Zap className="w-5 h-5" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">Why Teach With PlayFit?</h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">Our comprehensive platform provides everything you need to create and deliver exceptional learning experiences.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Course Creation", desc: "Create engaging courses with our intuitive course builder. Upload materials, create quizzes, and track student progress.", color: "from-blue-500 to-blue-600", topBorder: "border-t-8 border-blue-500" },
                { icon: Users, title: "Student Engagement", desc: "Connect with students through live classes, discussion forums, and personalized feedback systems.", color: "from-purple-500 to-purple-600", topBorder: "border-t-8 border-purple-500" },
                { icon: Trophy, title: "Earn Recognition", desc: "Build your reputation as an expert instructor. Get certified and recognized for your teaching excellence.", color: "from-green-500 to-green-600", topBorder: "border-t-8 border-green-500" },
                { icon: BarChart3, title: "Analytics Dashboard", desc: "Track your performance with detailed analytics. Monitor student progress, course completion rates, and earnings in real-time.", color: "from-orange-400 to-orange-600", topBorder: "border-t-8 border-orange-500" },
                { icon: Rocket, title: "Marketing Tools", desc: "Promote your courses with built-in marketing tools. Reach thousands of students through our platform's promotional features.", color: "from-pink-400 to-pink-600", topBorder: "border-t-8 border-pink-500" },
                { icon: Award, title: "Payment & Earnings", desc: "Earn competitive income with transparent payment tracking. Get paid twice monthly via direct deposit or PayPal.", color: "from-teal-400 to-teal-600", topBorder: "border-t-8 border-teal-500" }
              ].map((feature, i) => (
                <div key={i} className={`group bg-white rounded-[32px] p-8 ${feature.topBorder} hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 transform hover:-translate-y-3 hover:scale-105`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-4 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                  <p className="text-dark-600 leading-relaxed mb-6 font-medium">{feature.desc}</p>
                  <div className="pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                    <a href="#register" className="text-primary-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-28 px-6 bg-white flex flex-col items-center">
          <div className="max-w-7xl w-full">
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

        {/* How It Works - Step by Step Process */}
        <section className="py-28 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Sparkles className="w-5 h-5 text-accent-yellow" />
                Simple Process
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Your Teaching Journey
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  In 4 Simple Steps
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                From application to earning income, we've made the process simple, clear, and rewarding for every instructor.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: UserCheck,
                  title: "Apply & Get Approved",
                  desc: "Submit your application with credentials. Our team reviews within 48 hours and provides onboarding support.",
                  color: "from-blue-400 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  step: "02",
                  icon: BookOpen,
                  title: "Create Your Course",
                  desc: "Use our intuitive course builder to create engaging content. Upload videos, materials, and quizzes.",
                  color: "from-purple-400 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                },
                {
                  step: "03",
                  icon: Video,
                  title: "Teach & Engage",
                  desc: "Conduct live classes, interact with students, and provide personalized feedback through our platform.",
                  color: "from-pink-400 to-pink-600",
                  bgColor: "from-pink-50 to-pink-100"
                },
                {
                  step: "04",
                  icon: Trophy,
                  title: "Earn & Grow",
                  desc: "Track your earnings in real-time, receive payments twice monthly, and grow your instructor reputation.",
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                }
              ].map((item, i) => (
                <div key={i} className="group relative">
                  {/* Connecting Line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-24 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary-200 to-secondary-200 z-0"></div>
                  )}
                  
                  <div className={`relative bg-gradient-to-br ${item.bgColor} rounded-[32px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border-2 border-white z-10`}>
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                      <span className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                        {item.step}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <item.icon size={36} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h3>
                    <p className="text-dark-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <a href="#register" className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <Rocket className="w-6 h-6" />
                Start Your Journey
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* Instructor Testimonials Section */}
        <section id="testimonials" className="py-28 px-6 bg-gradient-to-b from-white via-secondary-50/30 to-white flex flex-col items-center relative overflow-hidden">
          <div className="max-w-7xl w-full relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-accent-yellow-light text-secondary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-secondary-200/50">
                <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Loved By Instructors
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-600">
                  Around The World
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Join thousands of instructors who have transformed their teaching careers and impacted students globally through PlayFit.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Dr. Priya Sharma",
                  role: "Computer Science Instructor", 
                  subject: "Python Programming",
                  content: "Teaching on PlayFit has been incredibly rewarding. The platform is intuitive, students are engaged, and the support team is always there when I need help. I've taught over 500 students and the earnings are consistent and transparent.",
                  rating: 5,
                  avatar: "👩‍💻",
                  color: "from-blue-400 to-blue-600",
                  achievement: "Top Rated",
                  stats: {
                    courses: "8 Courses",
                    students: "523 Students",
                    rating: "4.9 ⭐",
                    joined: "Since 2023"
                  }
                },
                {
                  name: "Prof. Rajesh Kumar", 
                  role: "Mathematics Instructor",
                  subject: "Advanced Calculus",
                  content: "PlayFit's course creation tools make it easy to design engaging content. The analytics dashboard helps me understand student progress, and the community of instructors is incredibly supportive. Best decision I made for my teaching career!",
                  rating: 5,
                  avatar: "👨‍🏫", 
                  color: "from-purple-400 to-purple-600",
                  achievement: "Master Educator",
                  stats: {
                    courses: "12 Courses",
                    students: "892 Students",
                    rating: "4.95 ⭐",
                    joined: "Since 2022"
                  }
                },
                {
                  name: "Ms. Ananya Patel",
                  role: "Language Arts Instructor", 
                  subject: "Creative Writing", 
                  content: "The flexibility to teach on my own schedule while reaching students worldwide is amazing. PlayFit handles all the technical aspects, so I can focus on what I do best - teaching. The earning potential exceeded my expectations!",
                  rating: 5,
                  avatar: "👩‍🎓",
                  color: "from-pink-400 to-pink-600", 
                  achievement: "Rising Star",
                  stats: {
                    courses: "6 Courses",
                    students: "347 Students",
                    rating: "4.92 ⭐",
                    joined: "Since 2024"
                  }
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-white rounded-[32px] p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 transform hover:-translate-y-3 relative overflow-hidden">
                  <div className="relative z-10">
                    {/* Instructor Avatar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {testimonial.avatar}
                      </div>
                      <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {testimonial.achievement}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-dark-700 leading-relaxed mb-8 font-medium text-lg">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    
                    {/* Author Info */}
                    <div className="pt-6 border-t-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                      <h4 className="font-bold text-dark-900 text-lg mb-1">{testimonial.name}</h4>
                      <p className="text-sm text-dark-600 font-semibold mb-1">{testimonial.role}</p>
                      <p className="text-xs text-primary-600 font-bold mb-4">{testimonial.subject}</p>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-lg font-black text-primary-600">{testimonial.stats.courses}</p>
                          <p className="text-xs text-dark-500 font-semibold">Created</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-lg font-black text-primary-600">{testimonial.stats.students}</p>
                          <p className="text-xs text-dark-500 font-semibold">Taught</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-sm font-black text-primary-600">{testimonial.stats.rating}</p>
                          <p className="text-xs text-dark-500 font-semibold">Rating</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-sm font-black text-primary-600">{testimonial.stats.joined}</p>
                          <p className="text-xs text-dark-500 font-semibold">Member</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  number: "2,500+", 
                  label: "Active Instructors", 
                  icon: Users,
                  color: "from-primary-500 to-primary-600",
                  bgColor: "from-primary-50 to-primary-100"
                },
                { 
                  number: "95%", 
                  label: "Satisfaction Rate", 
                  icon: Heart,
                  color: "from-secondary-500 to-secondary-600", 
                  bgColor: "from-secondary-50 to-secondary-100"
                },
                { 
                  number: "10K+", 
                  label: "Courses Created", 
                  icon: BookOpen,
                  color: "from-orange-400 to-orange-600",
                  bgColor: "from-orange-50 to-orange-100"
                },
                { 
                  number: "$2.5M+", 
                  label: "Paid to Instructors", 
                  icon: TrendingUp,
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                }
              ].map((stat, i) => (
                <div key={i} className={`group bg-gradient-to-br ${stat.bgColor} rounded-[32px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 text-center`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <stat.icon size={32} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black mb-2 text-dark-900 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-dark-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-28 px-6 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-primary-200/50">
                <Zap className="w-5 h-5 text-primary-600" />
                Common Questions
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Frequently Asked
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Questions
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Have questions about teaching on PlayFit? We've got answers to help you get started with confidence.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How and when do I get paid?",
                  answer: "Instructors receive payments twice monthly via direct deposit or PayPal. You earn revenue from every course enrollment and can track your earnings in real-time through your dashboard. Payments are processed within 5 business days of each pay period. We offer transparent payment tracking with no hidden fees."
                },
                {
                  question: "What are the technical requirements to teach?",
                  answer: "You'll need a computer with a stable internet connection, a webcam, and a microphone for live classes. Our platform works on Windows, Mac, and Linux. For course creation, we support various file formats including videos (MP4, MOV), documents (PDF, DOC), and presentations (PPT). No special software required - everything is web-based."
                },
                {
                  question: "How long does the approval process take?",
                  answer: "Our team reviews applications within 48 hours. We look for subject expertise, teaching experience, and quality credentials. Once approved, you'll receive onboarding materials and can start creating your first course immediately. We provide step-by-step guidance throughout the setup process."
                },
                {
                  question: "What support and training do you provide?",
                  answer: "We offer comprehensive onboarding with video tutorials, live training sessions, and detailed documentation. Our support team is available 24/7 via chat and email. You'll also join our instructor community for peer support, best practices sharing, and networking opportunities. Monthly workshops cover advanced teaching techniques."
                },
                {
                  question: "How much time do I need to commit?",
                  answer: "Teaching on PlayFit is completely flexible! You set your own schedule and decide how many courses to create and classes to teach. Some instructors teach part-time (5-10 hours/week) while others make it a full-time career. You can start small and scale up as you grow your student base."
                },
                {
                  question: "Do you help with marketing my courses?",
                  answer: "Yes! We provide built-in marketing tools including promotional campaigns, email marketing to students, featured placement opportunities, and social media promotion. Our team helps optimize your course descriptions and titles for better discoverability. Top instructors also get additional promotional support."
                },
                {
                  question: "What about intellectual property and content ownership?",
                  answer: "You retain full ownership of your course content and intellectual property. Our agreement simply grants PlayFit a license to host and distribute your content on our platform. You're free to use your materials elsewhere. We take copyright protection seriously and have systems in place to prevent unauthorized use."
                },
                {
                  question: "Can I stop teaching or remove my courses anytime?",
                  answer: "Absolutely! There's no long-term commitment required. You can pause or remove your courses anytime through your dashboard. If you decide to leave, we'll process any pending payments and you can download your student data. Many instructors take seasonal breaks and return when ready."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-[2rem] p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                  <summary className="flex items-start justify-between cursor-pointer list-none">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white font-black text-lg">{i + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors flex-1">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronRight className="w-6 h-6 text-primary-600 flex-shrink-0 ml-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-6 ml-14 text-dark-600 text-lg leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-16 text-center bg-gradient-to-br from-primary-50 to-secondary-50 rounded-[2rem] p-8 border-2 border-primary-200">
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Still have questions?</h3>
              <p className="text-dark-600 font-medium mb-6">Our friendly support team is here to help you!</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="mailto:instructors@playfit.com" className="group inline-flex items-center gap-2 bg-white hover:bg-primary-50 text-primary-700 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
                <a href="tel:+1234567890" className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-28 px-6 bg-gradient-to-br from-blue-50 via-white to-green-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-900 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg border border-green-200/50">
                <Shield className="w-5 h-5 text-green-600" />
                Our Commitment
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-6 tracking-tight">
                Teach With
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Complete Confidence
                </span>
              </h2>
              <p className="text-dark-600 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                Your success and security are our top priorities. Here's our commitment to every instructor.
              </p>
            </div>

            {/* Main Guarantee Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Shield,
                  title: "Payment Security",
                  desc: "Secure, on-time payments with transparent tracking. Bank-level encryption protects your financial information.",
                  highlight: "100% Secure",
                  color: "from-green-400 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                },
                {
                  icon: Award,
                  title: "Content Protection",
                  desc: "Your intellectual property is protected. You retain full ownership with built-in copyright safeguards.",
                  highlight: "IP Rights Protected",
                  color: "from-blue-400 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  icon: Heart,
                  title: "Lifetime Support",
                  desc: "24/7 access to our support team, training resources, and instructor community whenever you need help.",
                  highlight: "Always Here",
                  color: "from-purple-400 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                }
              ].map((item, i) => (
                <div key={i} className={`group bg-gradient-to-br ${item.bgColor} rounded-[32px] p-8 border-2 border-white hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-3 text-center`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <item.icon size={36} />
                  </div>
                  <div className={`inline-flex px-4 py-2 bg-gradient-to-r ${item.color} rounded-full text-white font-bold text-sm shadow-lg mb-4`}>
                    {item.highlight}
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h3>
                  <p className="text-dark-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border-2 border-gray-100">
              <h3 className="text-3xl font-black text-dark-900 mb-12 text-center">Trusted & Certified Platform</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {[
                  { icon: Shield, label: "SSL Secured", sublabel: "Bank-level encryption" },
                  { icon: CheckCircle2, label: "Verified Platform", sublabel: "Trusted by 2,500+" },
                  { icon: Award, label: "Industry Leader", sublabel: "Award-winning platform" },
                  { icon: Star, label: "4.8/5 Rating", sublabel: "1,200+ instructor reviews" }
                ].map((badge, i) => (
                  <div key={i} className="group text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl shadow-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <badge.icon size={36} />
                    </div>
                    <p className="font-bold text-dark-900 text-lg">{badge.label}</p>
                    <p className="text-sm text-dark-600 font-medium">{badge.sublabel}</p>
                  </div>
                ))}
              </div>
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
                Register as an instructor today and start sharing your knowledge with thousands of eager students. Build your teaching career with PlayFit.
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

      {/* 🔗 Simple Footer */}
      <footer className="bg-dark-900 text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center mb-4">
                <img
                  src="/images/playfit-logo.jpg"
                  alt="PlayFit"
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Where kids learn through play! Empowering children aged 8-18 with interactive learning experiences.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Courses</a></li>
                <li><a href="#why-choose" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</a></li>
                <li><a href="#register" className="text-gray-400 hover:text-white transition-colors text-sm">Register</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Kolkata, India</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@playfit.com" className="text-gray-400 hover:text-white transition-colors">support@playfit.com</a>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">+91 123 456 7890</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} PlayFit. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
