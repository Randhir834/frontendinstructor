'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Award, TrendingUp, Mail, Phone, Sparkles, Zap, Heart, Target, Briefcase, Clock, DollarSign, Video, MessageSquare, BarChart3, Shield, Rocket, GraduationCap, Globe } from 'lucide-react';
import { instructorRegistrationService } from '@/services/instructorRegistrationService';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', qualification: '', subject: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
      {/* Fixed Premium Header */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-xl border-b border-gray-100 safe-top shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80">
              <img
                src="/logo.jpg"
                alt="Playfit"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'About', 'Contact', 'Apply Now'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={(e) => scrollToSection(e, item.toLowerCase().replace(' ', '-'))}
                  className="px-4 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-purple-600 transition-all relative group cursor-pointer"
                >
                  {item}
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </a>
              ))}
              <Link 
                href="/login" 
                className="ml-3 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white text-[15px] font-semibold rounded-full transition-all hover:shadow-lg shadow-purple-500/20 duration-300"
              >
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl">
            <nav className="px-4 py-3 space-y-1 max-w-md mx-auto">
              {['Features', 'About', 'Contact', 'Apply Now'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={(e) => scrollToSection(e, item.toLowerCase().replace(' ', '-'))}
                  className="block py-3 px-4 text-[15px] font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                >
                  {item}
                </a>
              ))}
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-[15px] font-semibold rounded-xl text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 shadow-lg shadow-purple-500/30"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Fixed Responsive Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-pink-400/8 to-orange-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/20">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">Trusted by 500+ Instructors</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.15] tracking-tight pb-2">
                  Transform Your{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 pb-1">
                    Teaching Career
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-normal max-w-2xl">
                  Join Playfit as an instructor and teach live online classes in Art, Chess, Piano, Public Speaking, and more. Share your expertise with eager learners worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#features"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Benefits
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </a>
                <a 
                  href="#apply-now"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-base font-semibold rounded-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Apply Now
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {[
                  { number: "500+", label: "Instructors", gradient: "from-blue-600 to-purple-600" },
                  { number: "10K+", label: "Students", gradient: "from-purple-600 to-pink-600" },
                  { number: "4.9", label: "Rating", gradient: "from-orange-600 to-pink-600", icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      {stat.icon}
                      <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.number}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium whitespace-nowrap">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Fixed Feature Cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {[
                { icon: Users, title: "Live Classes", desc: "Interactive teaching", color: "from-blue-500 to-blue-600", badge: "Live", badgeColor: "bg-blue-50 text-blue-700 border-blue-100" },
                { icon: Sparkles, title: "AI Learning", desc: "Smart personalization", color: "from-purple-500 to-purple-600", badge: "Smart", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" },
                { icon: BookOpen, title: "Practice Tests", desc: "Interactive exercises", color: "from-pink-500 to-pink-600", badge: "Interactive", badgeColor: "bg-pink-50 text-pink-700 border-pink-100" },
                { icon: TrendingUp, title: "Analytics", desc: "Track progress", color: "from-orange-500 to-orange-600", badge: "Track", badgeColor: "bg-orange-50 text-orange-700 border-orange-100" }
              ].map((feature, i) => (
                <div key={i} className={`group bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]`}>
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/25 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 group-hover:scale-105 group-hover:bg-white/35 transition-all duration-300 flex-shrink-0">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 leading-tight">{feature.title}</h3>
                    <p className="text-sm sm:text-[15px] text-white/95 leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-1.5 ${feature.badgeColor} backdrop-blur-sm rounded-full self-start mt-3 sm:mt-4 border`}>
                    <span className="text-xs font-semibold">{feature.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Stats Section - No Overlap */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] bg-pink-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full mb-6 lg:mb-7 border border-white/20 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-white">Trusted Worldwide</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-5 leading-[1.15] tracking-tight px-4 pb-2">
              Join The Teaching Revolution
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Hundreds of expert instructors are inspiring students with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: "500+", label: "Active Instructors", subtext: "Teaching Daily", gradient: "from-cyan-400 to-blue-500", icon: "👨‍🏫" },
              { number: "50+", label: "Subject Experts", subtext: "Certified & Trained", gradient: "from-pink-400 to-rose-500", icon: "🎓" },
              { number: "11+", label: "Course Categories", subtext: "And Growing", gradient: "from-amber-400 to-orange-500", icon: "📚" },
              { number: "98%", label: "Satisfaction", subtext: "Instructor Approved", gradient: "from-emerald-400 to-green-500", icon: "⭐" }
            ].map((stat, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-[22px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`}></div>
                
                <div className="relative bg-white rounded-[20px] p-6 sm:p-7 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/80 min-h-[240px] sm:min-h-[260px] flex flex-col">
                  <div className="mb-5">
                    <div className={`inline-flex w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg flex-shrink-0`}>
                      <span className="text-3xl sm:text-4xl">{stat.icon}</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2.5 leading-tight`}>
                      {stat.number}
                    </div>
                    
                    <div className="text-base sm:text-[17px] font-bold text-gray-900 mb-1.5 leading-tight">{stat.label}</div>
                    <div className="text-sm sm:text-[15px] text-gray-600 font-medium">{stat.subtext}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Simple 3-Step Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 pb-2 leading-[1.2]">
              Getting Started Is{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1">
                Super Easy
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join expert instructors in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>

            {[
              { step: "01", title: "Choose Your Subject", desc: "Select from 11+ course categories that match your expertise", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
              { step: "02", title: "Submit Application", desc: "Quick online application with your qualifications and experience", icon: Target, color: "from-purple-500 to-pink-500" },
              { step: "03", title: "Start Teaching", desc: "Get approved within 48 hours and begin inspiring students", icon: Zap, color: "from-orange-500 to-yellow-500" }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-xl h-full min-h-[320px] flex flex-col">
                  <div className="mb-6">
                    <div className={`inline-flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a 
              href="#apply-now" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-1"
            >
              Apply to Teach Now
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">11+ Teaching Subjects</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 pb-2 leading-[1.2]">
              Teach What You Love
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share your expertise in subjects you're passionate about
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🎨", title: "Creative Arts", subjects: "Art & Drawing, Music, Piano" },
              { icon: "♟️", title: "Strategic Thinking", subjects: "Chess, Rubik's Cube" },
              { icon: "🎤", title: "Communication", subjects: "Public Speaking, Toastmaster" },
              { icon: "📚", title: "Language & Reading", subjects: "Phonics, Reader's Club" },
              { icon: "🧮", title: "Mathematics", subjects: "Abacus, Mental Math" },
              { icon: "💻", title: "Technology", subjects: "Computers, Coding" }
            ].map((area, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 hover:border-purple-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-5xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-gray-600">{area.subjects}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="#apply-now"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5"
            >
              Apply to Teach Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Fixed Testimonials Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <Heart className="w-5 h-5 text-pink-600 fill-pink-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-purple-900">Instructor Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 pb-2 leading-[1.2]">
              Real Stories, Real Success
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Hear from instructors who've transformed their teaching careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {[
              { name: "Prof. Ananya Sharma", location: "Mumbai", role: "Top Rated Teacher", quote: "Teaching on Playfit has been incredibly rewarding! The platform is intuitive and students are engaged.", gradient: "from-rose-500 to-pink-600", image: "👩‍🎨" },
              { name: "Rohan Patel", location: "Delhi", role: "Expert Instructor", quote: "I've taught 200+ students so far! The earning potential is great and seeing students win tournaments is worthwhile.", gradient: "from-blue-500 to-cyan-600", image: "♟️" },
              { name: "Dr. Priya Reddy", location: "Bangalore", role: "Music Specialist", quote: "The quality of students and support from Playfit team is exceptional. I can focus on teaching.", gradient: "from-purple-500 to-indigo-600", image: "🎹" },
              { name: "Mr. Rajesh Kumar", location: "Pune", role: "Senior Instructor", quote: "Best decision joining Playfit! I reach students across India and earn more than my previous job.", gradient: "from-green-500 to-emerald-600", image: "🎤" },
              { name: "Ms. Kavita Singh", location: "Hyderabad", role: "Top Performer", quote: "The platform makes online teaching so easy! Live classes and payment system all work flawlessly.", gradient: "from-amber-500 to-orange-600", image: "🧮" },
              { name: "Prof. Amit Verma", location: "India", role: "Tech Instructor", quote: "Teaching coding to kids has never been more fun! Playfit gives me all the tools I need.", gradient: "from-teal-500 to-cyan-600", image: "💻" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col min-h-[320px]">
                <p className="text-gray-700 leading-relaxed mb-6 flex-grow text-sm sm:text-base">{testimonial.quote}</p>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  ))}
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${testimonial.gradient} rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0`}>
                    {testimonial.image}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{testimonial.location}</p>
                    <p className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent truncate`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            {[
              { icon: "⭐", number: "4.9/5", label: "Average Rating" },
              { icon: "💬", number: "500+", label: "Happy Instructors" },
              { icon: "🏆", number: "98%", label: "Would Recommend" },
              { icon: "❤️", number: "10K+", label: "Students Taught" }
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">About Playfit</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 pb-2 leading-[1.2]">
              Joyful Learning for Young Minds
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl mb-12 border border-white">
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
              <strong className="text-purple-600">Playfit</strong> is a fun and engaging learning platform designed to help young children build <strong>confidence</strong>, <strong>communication skills</strong>, <strong>reading habits</strong>, and <strong>creative thinking</strong>. Our programs are carefully created with age-appropriate lessons, interactive activities, and practice sessions.
            </p>
            <p className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2 leading-relaxed">
              Playfit aims to make every child a confident learner, active thinker, and happy communicator.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12 pb-2 leading-tight">Meet the Founders</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Puja Agarwal",
                  role: "Co-Founder & Lead Educator",
                  image: "/images/puja.jpg",
                  description: "Puja Agarwal is an experienced educator with over 15 years of teaching experience globally. She holds a Phonics Teacher's Degree with expertise in early reading and language development.",
                  color: "purple"
                },
                {
                  name: "Sonika Goel",
                  role: "Co-Founder & Marketing Lead",
                  image: "/images/sonika.jpg",
                  description: "Sonika Goel is a marketing professional with a postgraduate degree and over 10 years of industry experience. She also holds certifications in Public Speaking and a diploma in French.",
                  color: "blue"
                }
              ].map((founder, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-${founder.color}-100`}>
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{founder.name}</h4>
                      <p className={`text-${founder.color}-600 font-semibold`}>{founder.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{founder.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 pb-2 leading-[1.2]">
              Why 500+ Instructors Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best online teaching experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Small Class Sizes", desc: "Maximum 8 students per class for quality interaction", color: "from-blue-500 to-cyan-500" },
              { icon: Target, title: "Full Teaching Support", desc: "Comprehensive platform with lesson planning tools", color: "from-purple-500 to-pink-500" },
              { icon: Video, title: "Live Interactive Platform", desc: "State-of-the-art video with engagement tools", color: "from-orange-500 to-red-500" },
              { icon: Clock, title: "Flexible Scheduling", desc: "Set your own availability and teach on your terms", color: "from-green-500 to-emerald-500" },
              { icon: DollarSign, title: "Performance Bonuses", desc: "Earn more with performance-based incentives", color: "from-amber-500 to-orange-500" },
              { icon: Heart, title: "Dedicated Support", desc: "24/7 instructor support with quick response times", color: "from-pink-500 to-rose-500" }
            ].map((benefit, i) => (
              <div key={i} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold">Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 pb-2 leading-[1.2]">
              We'd Love to Hear From You!
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have questions about teaching with Playfit? Our team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Phone, title: "Phone", content: "+91 8910484299", link: "tel:+918910484299", color: "from-green-500 to-emerald-500" },
              { icon: Mail, title: "Email", content: "cplayfit@gmail.com", link: "mailto:cplayfit@gmail.com", color: "from-blue-500 to-cyan-500" },
              { icon: Target, title: "Visit Us", content: "18, Rabindra Sarani, Terita Bazar, Kolkata 700012", link: "#", color: "from-purple-500 to-pink-500" }
            ].map((contact, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <contact.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{contact.title}</h3>
                {contact.link !== "#" ? (
                  <a href={contact.link} className="text-gray-300 hover:text-white transition-colors">
                    {contact.content}
                  </a>
                ) : (
                  <p className="text-gray-300">{contact.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-10 border border-white/10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 pb-1 leading-tight">Ready to Join Our Teaching Team?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Apply now to become an instructor at Playfit and inspire students worldwide.
            </p>
            <a 
              href="#apply-now"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5" />
              Apply to Teach
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-now" className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Limited Slots Available</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 pb-2 leading-[1.2]">
              Start Teaching Today - Join Us!
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Apply now to become an instructor. Share your expertise and inspire students worldwide.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 pb-1 leading-tight">🎉 Application Submitted!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your interest. We'll review your application within 48 hours.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 rounded-full text-green-800 font-semibold">
                  <span>✓</span> Check your email for confirmation
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">!</div>
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-semibold text-gray-900 mb-2">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="e.g., Master's in Computer Science"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject/Expertise *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                  className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-xl transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Application...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Submit Instructor Application
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  )}
                </button>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  {[
                    { icon: "✓", text: "Quick Review" },
                    { icon: "✓", text: "48 Hours Response" },
                    { icon: "✓", text: "Start Teaching" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </form>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/90 text-lg">
              <strong>Join 500+ expert instructors</strong> who trust Playfit to grow their teaching careers
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 lg:py-16 safe-bottom relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="inline-block mb-4">
                <img src="/logo.jpg" alt="Playfit" className="h-12 w-auto object-contain" />
              </Link>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Join our platform to teach, inspire, and earn. Share your expertise with students worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                Teaching Subjects
              </h4>
              <ul className="space-y-2">
                {[
                  { icon: "🎨", text: "Art & Drawing" },
                  { icon: "♟️", text: "Chess" },
                  { icon: "🎹", text: "Piano" },
                  { icon: "🎤", text: "Public Speaking" },
                  { icon: "🧮", text: "Abacus" }
                ].map((item, i) => (
                  <li key={i}>
                    <a href="#features" className="text-sm text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">For Instructors</h4>
              <ul className="space-y-2">
                {[
                  { text: "Features", link: "#features" },
                  { text: "About Us", link: "#about" },
                  { text: "Contact", link: "#contact" },
                  { text: "Apply Now", link: "#apply-now" },
                  { text: "Instructor Login", link: "/login" }
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.link} className="text-sm text-gray-300 hover:text-purple-400 transition-colors block">
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:cplayfit@gmail.com" className="hover:text-blue-400 transition-colors break-all">
                    cplayfit@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+918910484299" className="hover:text-green-400 transition-colors">
                    +91 8910484299
                  </a>
                </li>
              </ul>
              
              <div className="mt-6">
                <Link 
                  href="#contact" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-400 text-center">
              © 2026 Playfit Classes. Built by{' '}
              <a 
                href="https://devcastle.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline"
              >
                DevCastle.in
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
