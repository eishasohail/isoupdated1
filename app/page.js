'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import SectionCard from '@/components/iso-form/SectionCard';
import Sidebar from '@/components/Sidebar';
import isoData from '@/lib/iso27001_data.json';

export default function ISOFormHome() {
  const router = useRouter();
  const [formProgress, setFormProgress] = useState({});
  const [, startTransition] = useTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('isoFormData');
    if (saved) {
      try {
        startTransition(() => {
          setFormProgress(JSON.parse(saved));
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const getSectionProgress = (section) => {
    const requirements = section.subsections[0]?.requirements || [];
    const total = requirements.length;
    const completed = requirements.filter(req => formProgress[req.id]?.status).length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const overallProgress = (() => {
    const allRequirements = isoData.sections.flatMap(section => 
      section.subsections[0]?.requirements || []
    );
    const total = allRequirements.length;
    const completed = allRequirements.filter(req => formProgress[req.id]?.status).length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  })();

  const handleSectionClick = (sectionId) => {
    router.push(`/section/${sectionId}`);
  };

  const mainClauses = isoData.sections.filter(section => !section.id.startsWith('A.'));
  const annexControls = isoData.sections.filter(section => section.id.startsWith('A.'));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="lg:ml-72 min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#002366] via-[#0f172a] to-[#14B8A6] overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden absolute top-6 left-4 text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="text-center space-y-6 animate-fadeIn">
              {/* Main Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slideUp">
                ISO 27001 Gap Assessment
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Evaluate your organizations ISMS against 140 requirements across 11 sections. 
                Identify gaps and achieve certification.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#14B8A6]">140</div>
                  <div className="text-xs md:text-sm text-white/70 mt-1">Requirements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#14B8A6]">11</div>
                  <div className="text-xs md:text-sm text-white/70 mt-1">Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#14B8A6]">{Math.round(overallProgress.percentage)}%</div>
                  <div className="text-xs md:text-sm text-white/70 mt-1">Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 60h1440V0c-360 30-720 30-1080 0C240 30 0 30 0 60z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white border-b border-[#dbeafe]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">Assessment Progress</h2>
                <p className="text-sm md:text-base text-[#002366]/70 mt-1">
                  Track your compliance across all requirements
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#002366]/70 mb-1">Completed</div>
                <div className="text-2xl md:text-3xl font-bold text-[#14B8A6]">
                  {overallProgress.completed}/{overallProgress.total}
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-[#dbeafe] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Main Clauses Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 md:w-1.5 h-8 md:h-10 bg-[#002366] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Main Clauses (4-10)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mainClauses.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  progress={getSectionProgress(section)}
                  onClick={() => handleSectionClick(section.id)}
                  isAnnex={false}
                />
              ))}
            </div>
          </div>

          {/* Annex A Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 md:w-1.5 h-8 md:h-10 bg-[#14B8A6] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Annex A Controls</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {annexControls.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  progress={getSectionProgress(section)}
                  onClick={() => handleSectionClick(section.id)}
                  isAnnex={true}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {overallProgress.completed > 0 && (
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push('/report')}
                className="w-full sm:w-auto px-8 py-4 bg-[#14B8A6] text-white rounded-xl font-semibold hover:bg-[#0D9488] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                View Report
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}
        </main>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease-out;
          }

          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </>
  );
}
