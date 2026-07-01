'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

interface FooterProps {
  handleSmoothScroll?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export default function Footer({ handleSmoothScroll }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const defaultSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollHandler = handleSmoothScroll || defaultSmoothScroll;

  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/images/playfit-logo.jpg" alt="Playfit" className="h-8 w-auto" />
            </Link>
            <h3 className="text-base font-semibold text-white pt-2">Your Teaching Platform</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Playfit brings teaching tools, student management, live classes, and more useful features into one powerful platform for instructors worldwide.
            </p>
            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Instructor Login
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Menu</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" onClick={(e) => scrollHandler(e, 'features')} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Features</a></li>
              <li><a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#updates" className="text-sm text-gray-400 hover:text-white transition-colors">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-5">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#roadmap" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
              <li><Link href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy policy</Link></li>
              <li><Link href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of service</Link></li>
              <li><Link href="#support" className="text-sm text-gray-400 hover:text-white transition-colors">Customer portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-5">More products</h4>
            <ul className="space-y-3">
              <li><a href="https://playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Playfit.com</a></li>
              <li><a href="https://student.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Student.app</a></li>
              <li><a href="https://admin.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Admin.app</a></li>
              <li><a href="https://courses.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Courses.co</a></li>
              <li><a href="https://resources.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Resources.site</a></li>
              <li><a href="https://academy.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Academy.io</a></li>
              <li><a href="https://learn.playfit.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Learn.com</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs text-gray-500">© {currentYear} Playfit - All rights reserved</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
              <span>by</span>
              <a href="https://playfit.com/team" className="text-gray-400 hover:text-white transition-colors">Playfit Team</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
