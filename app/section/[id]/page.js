'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StatusSelector from '@/components/iso-form/StatusSelector';
import CommentBox from '@/components/iso-form/CommentBox';
import RequirementStepper from '@/components/iso-form/RequirementStepper';
import AIInsightCard from '@/components/iso-form/AIInsightCard';
import NavigationButtons from '@/components/iso-form/NavigationButtons';
import Sidebar from '@/components/Sidebar';
import isoData from '@/lib/iso27001_data.json';

export default function SectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.id;

  const [currentRequirementIndex, setCurrentRequirementIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [, startTransition] = useTransition();

  const currentSection = isoData.sections.find(s => s.id === sectionId);
  const allRequirements = currentSection?.subsections[0]?.requirements || [];
  const currentRequirement = allRequirements[currentRequirementIndex];
  const isAnnex = sectionId?.startsWith('A.');

  useEffect(() => {
    const saved = localStorage.getItem('isoFormData');
    if (saved) {
      try {
        startTransition(() => {
          setFormData(JSON.parse(saved));
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' && currentRequirementIndex < allRequirements.length - 1 && !isAnimating) {
        const hasStatus = formData[currentRequirement.id]?.status;
        const hasComment = formData[currentRequirement.id]?.comment;
        if (!hasStatus || !hasComment) return;
        
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentRequirementIndex(prev => prev + 1);
          setIsAnimating(false);
        }, 300);
      } else if (e.key === 'ArrowLeft' && currentRequirementIndex > 0 && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentRequirementIndex(prev => prev - 1);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentRequirementIndex, allRequirements.length, isAnimating, formData, currentRequirement?.id]);

  const saveToLocalStorage = (newData) => {
    try {
      localStorage.setItem('isoFormData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleStatusChange = (status) => {
    const newFormData = {
      ...formData,
      [currentRequirement.id]: {
        ...formData[currentRequirement.id],
        status: status
      }
    };
    setFormData(newFormData);
    saveToLocalStorage(newFormData);
  };

  const handleCommentChange = (comment) => {
    const newFormData = {
      ...formData,
      [currentRequirement.id]: {
        ...formData[currentRequirement.id],
        comment: comment
      }
    };
    setFormData(newFormData);
    saveToLocalStorage(newFormData);
  };

  const goToNext = () => {
    const hasStatus = formData[currentRequirement.id]?.status;
    const hasComment = formData[currentRequirement.id]?.comment;
    
    if (!hasStatus || !hasComment) {
      return;
    }

    if (currentRequirementIndex < allRequirements.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentRequirementIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      router.push('/');
    }
  };

  const goToPrevious = () => {
    if (currentRequirementIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentRequirementIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goToRequirement = (index) => {
    if (index !== currentRequirementIndex && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentRequirementIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const progress = (allRequirements.filter(req => formData[req.id]?.status).length / allRequirements.length) * 100;
  const completedCount = allRequirements.filter(req => formData[req.id]?.status).length;
  const isFirst = currentRequirementIndex === 0;
  const isLast = currentRequirementIndex === allRequirements.length - 1;

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="lg:ml-72 min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-br from-[#002366] to-[#0f172a] shadow-sm border-b border-[#14B8A6]/20 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Sections</span>
                <span className="sm:hidden">Back</span>
              </button>
              
              <div className="text-center flex-1 mx-4">
                <div className={`inline-block px-3 md:px-4 py-2 rounded-full text-white font-semibold text-xs md:text-sm ${isAnnex ? 'bg-[#14B8A6]' : 'bg-[#002366]/50 backdrop-blur-sm'}`}>
                  <span className="hidden sm:inline">Section {sectionId}: </span>
                  <span className="sm:hidden">{sectionId}</span>
                  <span className="hidden md:inline">{currentSection.title}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl md:text-2xl font-bold text-[#14B8A6]">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-white/60">
                  {completedCount}/{allRequirements.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Horizontal Stepper - REPLACES LEFT SIDEBAR */}
        <RequirementStepper
          requirements={allRequirements}
          currentIndex={currentRequirementIndex}
          formData={formData}
          onRequirementClick={goToRequirement}
          isAnnex={isAnnex}
        />

        {/* Main Content - FULL WIDTH */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div 
            className={`bg-white rounded-xl border border-[#dbeafe] transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Card Header */}
            <div className={`p-4 md:p-6 border-b-4 ${isAnnex ? 'bg-[#CCFBF1] border-[#14B8A6]' : 'bg-[#dbeafe] border-[#002366]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl text-white text-xl md:text-2xl font-bold ${isAnnex ? 'bg-[#14B8A6]' : 'bg-[#002366]'}`}>
                  {currentRequirementIndex + 1}
                </div>
                <div className="text-right">
                  {formData[currentRequirement.id]?.status && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14B8A6] text-white rounded-full text-xs md:text-sm font-medium">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden sm:inline">Completed</span>
                      <span className="sm:hidden">Done</span>
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[#0f172a] leading-relaxed">
                {currentRequirement.text}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              <StatusSelector
                value={formData[currentRequirement.id]?.status}
                onChange={handleStatusChange}
                requirementId={currentRequirement.id}
              />

              {/* Show CommentBox ONLY after status is selected */}
              {formData[currentRequirement.id]?.status && (
                <div className="animate-fadeIn">
                  <CommentBox
                    value={formData[currentRequirement.id]?.comment}
                    onChange={handleCommentChange}
                    requirementId={currentRequirement.id}
                  />
                </div>
              )}

              {/* Warning if status selected but no comment */}
              {formData[currentRequirement.id]?.status && !formData[currentRequirement.id]?.comment && (
                <div className="bg-[#CCFBF1] border-l-4 border-[#14B8A6] p-4 rounded">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#0D9488] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">Evidence/Comment Required</p>
                      <p className="text-sm text-[#002366] mt-1">Please provide evidence or comments before proceeding.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <NavigationButtons
              onPrevious={goToPrevious}
              onNext={goToNext}
              isFirst={isFirst}
              isLast={isLast}
              isAnnex={isAnnex}
              isDisabled={!formData[currentRequirement.id]?.status || !formData[currentRequirement.id]?.comment}
              showKeyboardHint={typeof window !== 'undefined' && window.innerWidth >= 768}
            />
          </div>

          {/* AI Insight Card - ONLY when last requirement is COMPLETED */}
          {isLast && formData[currentRequirement.id]?.status && formData[currentRequirement.id]?.comment && (
            <div className="mt-6">
              <AIInsightCard 
                sectionId={sectionId}
                completedRequirements={completedCount}
                totalRequirements={allRequirements.length}
                isAnnex={isAnnex}
              />
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}