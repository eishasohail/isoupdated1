'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import isoData from '@/lib/iso27001_data.json';

export default function ReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [, startTransition] = useTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Calculate statistics
  const allRequirements = isoData.sections.flatMap(section => 
    section.subsections[0]?.requirements || []
  );

  const stats = {
    total: allRequirements.length,
    compliant: 0,
    nonCompliant: 0,
    partial: 0,
    na: 0,
    notAssessed: 0
  };

  allRequirements.forEach(req => {
    const status = formData[req.id]?.status;
    if (status === 'compliant') stats.compliant++;
    else if (status === 'non_compliant') stats.nonCompliant++;
    else if (status === 'partially_compliant') stats.partial++;
    else if (status === 'not_applicable') stats.na++;
    else stats.notAssessed++;
  });

  const assessed = stats.total - stats.notAssessed;
  const overallProgress = (assessed / stats.total) * 100;
  const complianceRate = assessed > 0 ? ((stats.compliant + stats.partial * 0.5) / assessed) * 100 : 0;

  // Section statistics
  const sectionStats = isoData.sections.map(section => {
    const requirements = section.subsections[0]?.requirements || [];
    const total = requirements.length;
    const completed = requirements.filter(req => formData[req.id]?.status).length;
    const compliant = requirements.filter(req => formData[req.id]?.status === 'compliant').length;
    const nonCompliant = requirements.filter(req => formData[req.id]?.status === 'non_compliant').length;
    const partial = requirements.filter(req => formData[req.id]?.status === 'partially_compliant').length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const complianceRate = completed > 0 ? ((compliant + partial * 0.5) / completed) * 100 : 0;
    
    return {
      ...section,
      total,
      completed,
      compliant,
      nonCompliant,
      partial,
      completionRate,
      complianceRate
    };
  });

  // Get action items
  const actionItems = allRequirements.filter(req => {
    const status = formData[req.id]?.status;
    return status === 'non_compliant' || status === 'partially_compliant';
  });

  const handleExportPDF = () => {
    alert('PDF export will be implemented with backend integration');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:ml-72 min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-br from-[#002366] to-[#0f172a] shadow-sm border-b border-[#14B8A6]/20 print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="flex items-center justify-between mb-6">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white">Gap Assessment Report</h1>
                <p className="text-[#5EEAD4] mt-1 md:mt-2 text-sm md:text-base">
                  ISO 27001 Assessment Summary
                </p>
              </div>
              
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Overview Stats - GDPR Style with Subtle Animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Total Requirements */}
            <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Total Requirements</div>
            </div>
            
            {/* Assessed */}
            <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#14B8A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{assessed}</div>
              <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Assessed</div>
              <div className="text-xs md:text-sm text-slate-400 mt-1">{Math.round(overallProgress)}%</div>
            </div>
            
            {/* Compliant */}
            <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stats.compliant}</div>
              <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Compliant</div>
            </div>
            
            {/* Gaps Found */}
            <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stats.nonCompliant}</div>
              <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide font-medium mt-1">Gaps Found</div>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-white border border-[#dbeafe] rounded-xl p-6 md:p-8 mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">Compliance Score</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="#dbeafe"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 90 * (complianceRate / 100)} ${2 * Math.PI * 90}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl md:text-5xl font-bold text-[#0f172a]">{Math.round(complianceRate)}%</div>
                  <div className="text-sm text-[#002366]/70 mt-1">Compliant</div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
                    <span className="text-sm md:text-base text-[#0f172a]">Compliant</span>
                  </div>
                  <span className="text-sm md:text-base font-semibold text-[#0f172a]">{stats.compliant}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#f59e0b]"></div>
                    <span className="text-sm md:text-base text-[#0f172a]">Partially Compliant</span>
                  </div>
                  <span className="text-sm md:text-base font-semibold text-[#0f172a]">{stats.partial}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                    <span className="text-sm md:text-base text-[#0f172a]">Non-Compliant</span>
                  </div>
                  <span className="text-sm md:text-base font-semibold text-[#0f172a]">{stats.nonCompliant}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#64748b]"></div>
                    <span className="text-sm md:text-base text-[#0f172a]">Not Applicable</span>
                  </div>
                  <span className="text-sm md:text-base font-semibold text-[#0f172a]">{stats.na}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Progress */}
          <div className="bg-white border border-[#dbeafe] rounded-xl p-6 md:p-8 mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">Section Progress</h2>
            <div className="space-y-4 md:space-y-6">
              {sectionStats.map((section) => (
                <div key={section.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                        section.id.startsWith('A.') ? 'bg-[#14B8A6]' : 'bg-[#002366]'
                      }`}>
                        {section.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-base text-[#0f172a]">{section.title}</h3>
                        <p className="text-xs md:text-sm text-[#002366]/70">
                          {section.completed} of {section.total} assessed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold text-[#14B8A6]">
                        {Math.round(section.completionRate)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-[#dbeafe] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] h-full rounded-full transition-all duration-500"
                      style={{ width: `${section.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          {actionItems.length > 0 && (
            <div className="bg-white border border-[#dbeafe] rounded-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">
                Action Items ({actionItems.length})
              </h2>
              <div className="space-y-4">
                {actionItems.map((item) => (
                  <div key={item.id} className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                    formData[item.id]?.status === 'non_compliant'
                      ? 'border-[#ef4444] bg-[#fef2f2]'
                      : 'border-[#f59e0b] bg-[#fffbeb]'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-sm md:text-base text-[#0f172a] mb-1">{item.text}</p>
                        {formData[item.id]?.comment && (
                          <p className="text-xs md:text-sm text-[#002366]/70 mt-2">
                            Note: {formData[item.id].comment}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        formData[item.id]?.status === 'non_compliant' 
                          ? 'bg-[#ef4444] text-white' 
                          : 'bg-[#f59e0b] text-white'
                      }`}>
                        {formData[item.id]?.status === 'non_compliant' ? 'Non-Compliant' : 'Partial'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {assessed === 0 && (
            <div className="bg-[#dbeafe] border border-[#14B8A6] rounded-xl p-8 md:p-12 text-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-[#002366] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-2">No Assessment Data</h3>
              <p className="text-sm md:text-base text-[#002366]/70 mb-6">
                Start assessing requirements to generate your compliance report.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer"
              >
                Start Assessment
              </button>
            </div>
          )}

          {/* Export/Print Actions - At Bottom */}
          {assessed > 0 && (
            <div className="mt-12 pt-8 border-t border-[#dbeafe]">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-8 py-4 bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-[#002366]/20 text-[#002366] rounded-xl font-semibold hover:border-[#002366]/40 hover:bg-[#dbeafe] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

