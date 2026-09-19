import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Playfit Instructor',
  description: 'Learn how Playfit collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Playfit" className="h-8 w-auto" />
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2026
              </p>
            </div>

            {/* Introduction */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                At Playfit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our learning management platform.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  1. Information We Collect
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                  <p className="leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Profile information and photos</li>
                    <li>Payment and billing information</li>
                    <li>Course enrollment and progress data</li>
                    <li>Communication preferences</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Automatically Collected Information</h3>
                  <p className="leading-relaxed">
                    When you use our platform, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Learning analytics and course interaction data</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your transactions and send related information</li>
                    <li>Send you technical notices, updates, and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Personalize your learning experience</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, prevent, and address technical issues and fraud</li>
                    <li>Send you promotional communications (with your consent)</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  3. Information Sharing and Disclosure
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>With Students:</strong> Students enrolled in your courses can view your profile and course information</li>
                    <li><strong>With Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
                    <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                  </ul>
                  <p className="leading-relaxed pt-3">
                    We do not sell your personal information to third parties.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  4. Data Security
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="leading-relaxed pt-3">
                    However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  5. Your Rights and Choices
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You have the following rights regarding your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                  </ul>
                  <p className="leading-relaxed pt-3">
                    To exercise these rights, please contact us at privacy@playfit.com
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  6. Cookies and Tracking Technologies
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We use cookies and similar tracking technologies to collect and track information about your activities on our platform. You can control cookies through your browser settings. For more details, please see our <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">Cookie Policy</Link>.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  7. Children's Privacy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  8. International Data Transfers
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and that your information receives adequate protection.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  9. Changes to This Privacy Policy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  10. Contact Us
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li><strong>Email:</strong> privacy@playfit.com</li>
                    <li><strong>Website:</strong> www.playfit.com</li>
                    <li><strong>Address:</strong> Playfit Learning Platform, Your City, Your Country</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
