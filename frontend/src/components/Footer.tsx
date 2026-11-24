import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-800 text-slate-300 border-t border-brand-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                JAYA AKADEMISI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official University Learning Management Platform of Universitas Pembangunan Jaya. Enhancing higher education with modern digital learning experiences.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-brand-300" />
                <span>Bintaro Jaya, Tangerang Selatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-300" />
                <span>lms@jayaakademisi.local</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses" className="hover:text-white transition">Course Catalog</Link>
              </li>
              <li>
                <Link to="/courses?category=computer-science-it" className="hover:text-white transition">Computer Science & IT</Link>
              </li>
              <li>
                <Link to="/courses?category=business-management" className="hover:text-white transition">Business & Management</Link>
              </li>
              <li>
                <Link to="/courses?category=design-creative-media" className="hover:text-white transition">Design & Media</Link>
              </li>
            </ul>
          </div>

          {/* Academic Portal */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Academic Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-white transition">Student Portal</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Faculty Access</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">System Administration</Link>
              </li>
            </ul>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-brand-900/60 p-4 rounded-xl border border-brand-700/50">
            <h4 className="text-xs font-bold text-brand-200 uppercase tracking-wider mb-2">Local Demo Accounts</h4>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
              <p><strong className="text-brand-300">Admin:</strong> admin@jayaakademisi.local / Admin123!</p>
              <p><strong className="text-brand-300">Lecturer:</strong> lecturer@jayaakademisi.local / Lecturer123!</p>
              <p><strong className="text-brand-300">Student:</strong> student@jayaakademisi.local / Student123!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Universitas Pembangunan Jaya. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium">Jaya Akademisi LMS • Coursera-inspired Learning Platform</p>
        </div>
      </div>
    </footer>
  );
};
