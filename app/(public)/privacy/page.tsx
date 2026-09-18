'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
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
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Instructor Privacy Policy
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Your privacy and data security are our top priorities
          </p>
          <p className="text-sm text-blue-200">
            Last Updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-blue-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="#information-collection" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Information We Collect
            </a>
            <a href="#how-we-use" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → How We Use Your Data
            </a>
            <a href="#data-sharing" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Data Sharing & Disclosure
            </a>
            <a href="#data-security" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Data Security
            </a>
            <a href="#your-rights" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Your Privacy Rights
            </a>
            <a href="#contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
              → Contact Us
            </a>
          </div>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to PlayFit Classes ("we," "our," or "us"). This Privacy Policy is specifically designed for instructors who teach on our platform. We are committed to protecting your personal information and maintaining transparency about how we collect, use, and safeguard your data.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By registering as an instructor and using our Services, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our platform.
          </p>
        </section>

        {/* Information We Collect */}
        <section id="information-collection" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect from Instructors</h2>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Personal & Professional Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you register as an instructor or use our platform, we collect:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>Full name and contact details (email, phone number, address)</li>
            <li>Professional qualifications and certifications</li>
            <li>Teaching experience and subject expertise</li>
            <li>Profile photo and bio</li>
            <li>Government-issued ID for verification purposes</li>
            <li>Bank account details and tax information for payments</li>
            <li>Availability and scheduling preferences</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Additional information collected includes:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Course content uploaded by you (videos, documents, materials)</li>
              <li>Class schedules and attendance records</li>
              <li>Student interactions and communications</li>
              <li>Performance metrics and ratings/reviews</li>
              <li>Payment history and earnings data</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you access our instructor platform, we automatically collect:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>IP address and device information</li>
            <li>Browser type and operating system</li>
            <li>Login times and activity logs</li>
            <li>Pages visited and features used</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        {/* How We Use Your Data */}
        <section id="how-we-use" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We use your personal information for the following purposes:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">👨‍🏫 Instructor Onboarding & Management</h4>
              <p className="text-gray-700 text-sm">
                To verify your qualifications, create your instructor profile, match you with suitable students, and manage your teaching schedule.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">💸 Payment Processing</h4>
              <p className="text-gray-700 text-sm">
                To calculate earnings, process payments, handle tax documentation, and maintain financial records in compliance with regulations.
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📧 Communication</h4>
              <p className="text-gray-700 text-sm">
                To send class reminders, platform updates, payment notifications, policy changes, and respond to your inquiries.
              </p>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📊 Platform Improvement</h4>
              <p className="text-gray-700 text-sm">
                To analyze teaching performance, gather feedback, improve platform features, and enhance instructor support services.
              </p>
            </div>

            <div className="border-l-4 border-pink-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Security & Compliance</h4>
              <p className="text-gray-700 text-sm">
                To prevent fraud, ensure platform security, enforce our instructor terms, comply with legal obligations, and protect intellectual property.
              </p>
            </div>

            <div className="border-l-4 border-indigo-400 pl-4">
              <h4 className="font-bold text-gray-900 mb-2">📣 Marketing & Promotion</h4>
              <p className="text-gray-700 text-sm">
                To promote your courses, feature outstanding instructors, and market our platform to attract students (with your consent).
              </p>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section id="data-sharing" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Sharing & Disclosure</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            We may share your instructor information with the following parties:
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">👨‍🎓 Students & Parents</h4>
              <p className="text-gray-700 text-sm">
                Your profile information, qualifications, teaching experience, ratings, and reviews are visible to students and parents to help them choose the right instructor. Your contact details are shared only when necessary for class coordination.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">💼 Service Providers</h4>
              <p className="text-gray-700 text-sm">
                We work with trusted third-party service providers for payment processing (Razorpay), video conferencing, email services, cloud hosting, analytics, and background verification services.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">🏛️ Tax & Legal Authorities</h4>
              <p className="text-gray-700 text-sm">
                We may share your information with tax authorities and government agencies as required by law, including income reporting and tax compliance.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">⚖️ Legal Requirements</h4>
              <p className="text-gray-700 text-sm">
                We may disclose your information if required by law, court order, or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">🤝 Business Transfers</h4>
              <p className="text-gray-700 text-sm">
                In the event of a merger, acquisition, or sale of assets, instructor information may be transferred to the acquiring entity.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-6">
            <p className="text-sm font-bold text-red-900 mb-1">We will NEVER:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm ml-4">
              <li>Sell your personal information to third parties</li>
              <li>Share your bank account details without encryption</li>
              <li>Disclose your earnings to other instructors or students</li>
              <li>Use your course content without permission</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section id="data-security" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            We implement comprehensive security measures to protect your instructor information from unauthorized access, alteration, or disclosure.
          </p>

          <h4 className="font-bold text-gray-900 mb-3 mt-6">Security measures include:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure password hashing and two-factor authentication</li>
            <li>Encrypted storage of sensitive financial information</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and role-based permissions</li>
            <li>Automated backup systems with disaster recovery</li>
            <li>Employee confidentiality agreements and training</li>
            <li>Secure video streaming infrastructure</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
            <p className="text-sm text-yellow-900">
              <strong>Please note:</strong> While we use industry-standard security measures, no method of transmission or storage is 100% secure. We cannot guarantee absolute security but continuously work to enhance our protection systems.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section id="your-rights" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights as an Instructor</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            As an instructor, you have the following rights regarding your personal information:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">✅ Access & Review</h4>
              <p className="text-gray-700 text-sm">
                You can access and review all your personal information, including profile details, earnings history, and student feedback through your instructor dashboard.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">✏️ Correction & Update</h4>
              <p className="text-gray-700 text-sm">
                You can update your profile information, qualifications, availability, and preferences at any time through your account settings.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">📥 Data Portability</h4>
              <p className="text-gray-700 text-sm">
                You can request a copy of your data in a structured, machine-readable format for your records or to transfer to another service.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🗑️ Account Deletion</h4>
              <p className="text-gray-700 text-sm">
                You can request deletion of your account and personal data, subject to legal retention requirements (e.g., tax records, payment history for 7 years).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🚫 Marketing Opt-Out</h4>
              <p className="text-gray-700 text-sm">
                You can unsubscribe from promotional emails and marketing communications while still receiving essential platform notifications.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Restrict Processing</h4>
              <p className="text-gray-700 text-sm">
                You can request limitations on how we process your data in certain circumstances, such as disputing data accuracy.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:cplayfit@gmail.com" className="text-blue-600 hover:underline font-medium">
                cplayfit@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Instructor-Specific Policies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor-Specific Policies</h2>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">Background Verification</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            To ensure student safety and maintain platform quality, we may conduct background verification checks on instructors, including credential verification and identity confirmation. This information is kept confidential and used solely for verification purposes.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Monitoring</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            We monitor instructor performance metrics (attendance, ratings, student retention) to maintain quality standards and identify areas for support. This data is used internally and shared with you through your dashboard.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Intellectual Property</h3>
          <p className="text-gray-700 leading-relaxed">
            You retain ownership of your original course content. By uploading content to our platform, you grant us a license to host, display, and distribute your materials to enrolled students. We will not use your content for purposes outside of providing our services without your explicit consent.
          </p>
        </section>

        {/* Data Retention */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain instructor information for as long as necessary to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
            <li>Provide instructor services and platform access</li>
            <li>Comply with tax and financial regulations (minimum 7 years)</li>
            <li>Resolve disputes and enforce agreements</li>
            <li>Meet legal and regulatory obligations</li>
            <li>Maintain business records and analytics</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            After your account is closed, we will delete or anonymize your personal data, except where retention is required by law.
          </p>
        </section>

        {/* International Data Transfers */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your instructor data may be stored and processed on servers located outside India. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy periodically. We will notify instructors of material changes through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
            <li>Email notification to your registered email address</li>
            <li>In-platform notifications on your instructor dashboard</li>
            <li>Updated "Last Updated" date at the top of this policy</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of our instructor platform after changes are posted constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-6 text-blue-100">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:cplayfit@gmail.com" className="text-blue-200 hover:text-white hover:underline">
                  cplayfit@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <a href="tel:+918910484299" className="text-blue-200 hover:text-white hover:underline">
                  +91 8910484299
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-blue-200">
                  18, Rabindra Sarani, Terita Bazar<br />
                  Poddar Court, 4th floor, Tiretti<br />
                  Kolkata, West Bengal 700012
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
