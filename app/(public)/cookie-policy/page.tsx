import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy | Playfit Instructor',
  description: 'Learn about how Playfit uses cookies and similar tracking technologies.',
};

export default function CookiePolicyPage() {
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
                Cookie Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2026
              </p>
            </div>

            {/* Introduction */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                This Cookie Policy explains how Playfit uses cookies and similar tracking technologies when you visit our learning platform. It describes what these technologies are, why we use them, and your rights to control their use.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  1. What Are Cookies?
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.
                  </p>
                  <p className="leading-relaxed">
                    Cookies allow websites to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Keep you signed in to your account</li>
                    <li>Understand how you use the website</li>
                    <li>Improve your user experience</li>
                    <li>Show you relevant content and advertisements</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  2. Types of Cookies We Use
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies are necessary for the platform to function properly. They enable core functionality such as security, authentication, and account access. You cannot opt out of essential cookies.
                  </p>
                  <p className="leading-relaxed italic text-gray-600">
                    Examples: Session cookies, authentication tokens, security cookies
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Functional Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and course progress.
                  </p>
                  <p className="leading-relaxed italic text-gray-600">
                    Examples: Language preference cookies, user interface customization, video player settings
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Analytics Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies help us understand how users interact with our platform by collecting and reporting information anonymously. This helps us improve our services and user experience.
                  </p>
                  <p className="leading-relaxed italic text-gray-600">
                    Examples: Google Analytics, page view tracking, feature usage analytics
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Marketing Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies track your browsing habits to show you relevant advertisements and measure the effectiveness of our marketing campaigns. They may be set by us or our advertising partners.
                  </p>
                  <p className="leading-relaxed italic text-gray-600">
                    Examples: Retargeting cookies, advertising platform cookies, conversion tracking
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  3. First-Party and Third-Party Cookies
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">First-Party Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies are set directly by Playfit and are used to operate and improve our platform. We have full control over these cookies and the data they collect.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Third-Party Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies are set by external services that we use on our platform. We do not control these cookies directly, but they help us provide better services. Third parties we work with include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> For website analytics and insights</li>
                    <li><strong>Payment Providers:</strong> For secure payment processing</li>
                    <li><strong>Video Platforms:</strong> For video content delivery</li>
                    <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                    <li><strong>Advertising Partners:</strong> For targeted advertising</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  4. Session vs. Persistent Cookies
                </h2>
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900">Session Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies are temporary and are deleted when you close your browser. They help us manage your session and keep you logged in while you navigate through the platform.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Persistent Cookies</h3>
                  <p className="leading-relaxed">
                    These cookies remain on your device for a set period or until you delete them. They remember your preferences and help provide a personalized experience when you return to our platform.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  5. Other Tracking Technologies
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    In addition to cookies, we may use other tracking technologies:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-2">Web Beacons (Pixels)</h3>
                  <p className="leading-relaxed">
                    Small graphic images that allow us to track page visits, email opens, and user behavior.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Local Storage</h3>
                  <p className="leading-relaxed">
                    Browser storage that allows us to save data locally on your device for improved performance and user experience.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Device Fingerprinting</h3>
                  <p className="leading-relaxed">
                    Techniques to identify your device based on its unique characteristics for security and fraud prevention purposes.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  6. Why We Use Cookies
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We use cookies and similar technologies for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Authentication:</strong> To identify you when you log in and keep you signed in</li>
                    <li><strong>Security:</strong> To protect your account and detect fraudulent activity</li>
                    <li><strong>Preferences:</strong> To remember your settings and choices</li>
                    <li><strong>Performance:</strong> To optimize page load times and functionality</li>
                    <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
                    <li><strong>Personalization:</strong> To provide relevant course recommendations</li>
                    <li><strong>Marketing:</strong> To show you relevant advertisements</li>
                    <li><strong>Features:</strong> To enable social sharing and embedded content</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  7. Your Cookie Choices
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    You have several options to control and manage cookies:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 pt-2">Browser Settings</h3>
                  <p className="leading-relaxed">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete cookies after each browsing session</li>
                    <li>View and delete individual cookies</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Cookie Preferences</h3>
                  <p className="leading-relaxed">
                    When you first visit our platform, we will ask for your cookie preferences. You can change these preferences at any time through your account settings.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 pt-4">Opt-Out Tools</h3>
                  <p className="leading-relaxed">
                    You can opt out of certain third-party cookies using these tools:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Google Analytics Opt-out Browser Add-on</li>
                    <li>Your Online Choices (EU)</li>
                    <li>Digital Advertising Alliance (US)</li>
                    <li>Network Advertising Initiative</li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Please note:</strong> Blocking or deleting cookies may affect your experience on our platform. Some features may not work properly, and you may need to re-enter your preferences each time you visit.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  8. Do Not Track Signals
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activities tracked. Currently, there is no industry standard for responding to Do Not Track signals. At this time, our platform does not respond to Do Not Track signals.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  9. Mobile Devices
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    When you access our platform through a mobile device, we may collect device identifiers and use mobile-specific tracking technologies. You can control tracking through your mobile device settings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>iOS:</strong> Settings → Privacy → Tracking</li>
                    <li><strong>Android:</strong> Settings → Google → Ads</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  10. Cookie Retention
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Different cookies have different retention periods:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Short-term cookies:</strong> Typically expire within 24 hours to 30 days</li>
                    <li><strong>Long-term cookies:</strong> May persist for up to 2 years</li>
                  </ul>
                  <p className="leading-relaxed pt-3">
                    You can delete cookies at any time through your browser settings.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  11. Updates to This Cookie Policy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any significant changes by posting a notice on our platform or sending you an email.
                  </p>
                  <p className="leading-relaxed">
                    We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  12. More Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    For more information about how we handle your personal data, please see our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>.
                  </p>
                  <p className="leading-relaxed">
                    If you have questions about cookies or this Cookie Policy, please contact us:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li><strong>Email:</strong> privacy@playfit.com</li>
                    <li><strong>Website:</strong> www.playfit.com</li>
                    <li><strong>Address:</strong> Playfit Learning Platform, Your City, Your Country</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  13. Browser-Specific Cookie Management
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed">
                    Learn how to manage cookies in different browsers:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                    <li><strong>Opera:</strong> Settings → Privacy & security → Cookies and other site data</li>
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
