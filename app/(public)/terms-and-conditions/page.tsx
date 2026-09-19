import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Playfit Instructor',
  description: 'Review the terms and conditions for using the Playfit instructor platform.',
};

export default function TermsAndConditionsPage() {
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
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2026
              </p>
            </div>

            {/* Introduction */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Playfit. By accessing or using our platform as an instructor, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    By creating an account, accessing, or using Playfit's learning platform as an instructor, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy and Cookie Policy.
                  </p>
                  <p className="leading-relaxed">
                    If you do not agree to these terms, you must not use our services.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  2. Instructor Eligibility
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    To become an instructor on Playfit, you must:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Be at least 18 years of age</li>
                    <li>Have the legal capacity to enter into binding contracts</li>
                    <li>Provide accurate and complete registration information</li>
                    <li>Have the necessary qualifications and expertise to teach your subject matter</li>
                    <li>Not be prohibited from using our services under applicable law</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  3. Instructor Accounts
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Account Creation</h3>
                  <p className="leading-relaxed">
                    You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Keeping your account information accurate and up to date</li>
                    <li>Ensuring your profile information is professional and appropriate</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Account Termination</h3>
                  <p className="leading-relaxed">
                    We reserve the right to suspend or terminate your account if you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violate these Terms and Conditions</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Misuse our platform or services</li>
                    <li>Harm students or the platform</li>
                    <li>Receive consistent negative feedback or complaints</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  4. Course Creation and Content
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Content Quality</h3>
                  <p className="leading-relaxed">
                    As an instructor, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide high-quality, accurate, and up-to-date course content</li>
                    <li>Ensure all content is original or properly licensed</li>
                    <li>Structure courses in a logical and educational manner</li>
                    <li>Provide clear learning objectives and outcomes</li>
                    <li>Respond to student questions and provide support</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Prohibited Content</h3>
                  <p className="leading-relaxed">
                    You may not create or upload content that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains malicious code or viruses</li>
                    <li>Is offensive, discriminatory, or inappropriate</li>
                    <li>Promotes illegal activities or violence</li>
                    <li>Contains false or misleading information</li>
                    <li>Violates any applicable laws or regulations</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  5. Revenue Sharing and Payments
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Revenue Model</h3>
                  <p className="leading-relaxed">
                    Instructors earn revenue from course enrollments according to our revenue sharing model:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Revenue share percentages are specified in your instructor agreement</li>
                    <li>Payments are processed monthly, subject to minimum thresholds</li>
                    <li>All amounts are subject to applicable taxes and fees</li>
                    <li>Payment methods and schedules are determined by Playfit</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Pricing</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You may set your course prices within platform guidelines</li>
                    <li>Playfit reserves the right to offer promotional pricing</li>
                    <li>Price changes do not affect existing student enrollments</li>
                    <li>Refunds are processed according to our refund policy</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  6. Intellectual Property Rights
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Your Content</h3>
                  <p className="leading-relaxed">
                    You retain ownership of your course content. However, by uploading content to Playfit, you grant us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>A worldwide, non-exclusive license to host and distribute your content</li>
                    <li>The right to market and promote your courses</li>
                    <li>Permission to use excerpts for promotional purposes</li>
                    <li>The right to create derivative works for platform optimization</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Platform Content</h3>
                  <p className="leading-relaxed">
                    All Playfit branding, features, and platform technology remain the exclusive property of Playfit and are protected by intellectual property laws.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  7. Live Classes and Student Interaction
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    When conducting live classes, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Attend scheduled sessions punctually</li>
                    <li>Provide advance notice for cancellations or rescheduling</li>
                    <li>Maintain professional conduct at all times</li>
                    <li>Respect student privacy and confidentiality</li>
                    <li>Create a safe and inclusive learning environment</li>
                    <li>Follow platform guidelines for online instruction</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  8. Student Data and Privacy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You may access limited student information necessary for course delivery. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use student data only for educational purposes</li>
                    <li>Not share student information with third parties</li>
                    <li>Protect student privacy and confidentiality</li>
                    <li>Comply with applicable data protection laws</li>
                    <li>Report any data breaches immediately</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  9. Instructor Conduct and Prohibited Activities
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the platform for any illegal or unauthorized purpose</li>
                    <li>Solicit students to leave the platform</li>
                    <li>Share personal contact information with students</li>
                    <li>Engage in inappropriate relationships with students</li>
                    <li>Discriminate against students based on protected characteristics</li>
                    <li>Manipulate reviews or ratings</li>
                    <li>Spam or send unsolicited communications</li>
                    <li>Compete directly with Playfit using platform resources</li>
                    <li>Create duplicate or misleading course listings</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  10. Course Reviews and Ratings
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Students may review and rate your courses. You acknowledge that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Reviews are student opinions and may not always be favorable</li>
                    <li>Playfit does not guarantee specific ratings</li>
                    <li>You may respond professionally to reviews</li>
                    <li>Fake or manipulated reviews will result in account termination</li>
                    <li>Playfit may remove reviews that violate our policies</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  11. Platform Changes and Updates
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Playfit reserves the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Modify platform features and functionality</li>
                    <li>Update pricing and revenue sharing models</li>
                    <li>Change course guidelines and requirements</li>
                    <li>Discontinue services with reasonable notice</li>
                    <li>Remove or delist courses that violate policies</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  12. Disclaimers and Limitations of Liability
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Service Disclaimer</h3>
                  <p className="leading-relaxed">
                    Our services are provided "as is" without warranties of any kind. We do not guarantee:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Specific enrollment numbers or revenue</li>
                    <li>Uninterrupted or error-free service</li>
                    <li>Course visibility or promotion</li>
                    <li>Student satisfaction or outcomes</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Limitation of Liability</h3>
                  <p className="leading-relaxed">
                    To the maximum extent permitted by law, Playfit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or loss of revenue.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  13. Indemnification
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You agree to indemnify and hold harmless Playfit, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use of the platform</li>
                    <li>Your course content and materials</li>
                    <li>Your violation of these Terms and Conditions</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Your conduct or interactions with students</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  14. Modifications to Terms
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes are posted constitutes your acceptance of the modified terms.
                  </p>
                  <p className="leading-relaxed">
                    We will notify you of significant changes via email or through the platform.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  15. Governing Law and Dispute Resolution
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    These Terms and Conditions are governed by the laws of your jurisdiction. Any disputes arising from these terms or your use of the platform shall be resolved through:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Good faith negotiation between the parties</li>
                    <li>Mediation if negotiation fails</li>
                    <li>Binding arbitration or court proceedings as a last resort</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  16. Contact Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li><strong>Email:</strong> legal@playfit.com</li>
                    <li><strong>Instructor Support:</strong> instructors@playfit.com</li>
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
