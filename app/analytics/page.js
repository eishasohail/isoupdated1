'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import isoData from '@/lib/iso27001_data.json';

export default function AnalyticsPage() {
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
    notAssessed: 0
  };

  allRequirements.forEach(req => {
    const status = formData[req.id]?.status;
    if (status === 'compliant') stats.compliant++;
    else if (status === 'non_compliant') stats.nonCompliant++;
    else if (status === 'partially_compliant') stats.partial++;
    else stats.notAssessed++;
  });

  const assessed = stats.total - stats.notAssessed;
  const complianceRate = assessed > 0 ? ((stats.compliant + stats.partial * 0.5) / assessed) * 100 : 0;

  // Section statistics
  const sectionStats = isoData.sections.map(section => {
    const requirements = section.subsections[0]?.requirements || [];
    const total = requirements.length;
    const completed = requirements.filter(req => formData[req.id]?.status).length;
    const compliant = requirements.filter(req => formData[req.id]?.status === 'compliant').length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const complianceRate = completed > 0 ? (compliant / completed) * 100 : 0;
    
    return {
      ...section,
      total,
      completed,
      compliant,
      completionRate,
      complianceRate
    };
  });

  const mainClauses = sectionStats.filter(s => !s.id.startsWith('A.'));
  const annexSections = sectionStats.filter(s => s.id.startsWith('A.'));

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
        <header className="bg-white border-b border-slate-200 shadow-sm border-b border-[#14B8A6]/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden absolute top-6 left-4 text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-2">In-depth breakdown of your organizations compliance posture</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Top Row - Overall Posture & Gap Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Overall Posture */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-xl font-bold text-slate-900">Overall Posture</h2>
              </div>

              <div className="flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-56 h-56 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="14"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="14"
                      strokeDasharray={`${2 * Math.PI * 100 * (complianceRate / 100)} ${2 * Math.PI * 100}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-slate-900">{Math.round(complianceRate)}%</div>
                    <div className="text-sm text-slate-500 mt-2">Compliant</div>
                  </div>
                </div>

                {/* Stats Below Circle */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="text-center p-3 bg-slate-100 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-xs text-slate-600 mt-1">Total</div>
                  </div>
                  <div className="text-center p-3 bg-teal/10 rounded-lg">
                    <div className="text-2xl font-bold text-teal">{assessed}</div>
                    <div className="text-xs text-slate-600 mt-1">Assessed</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
                    <div className="text-xs text-slate-600 mt-1">Gaps</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Distribution */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <h2 className="text-xl font-bold text-slate-900">Gap Distribution</h2>
              </div>

              <div className="flex flex-col items-center">
                {/* Donut Chart (simplified version) */}
                <div className="relative w-56 h-56 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="40"
                    />
                    {/* Segments */}
                    {assessed > 0 && (
                      <>
                        {/* Compliant segment */}
                        <circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="40"
                          strokeDasharray={`${2 * Math.PI * 56 * (stats.compliant / assessed)} ${2 * Math.PI * 56}`}
                          strokeDashoffset="0"
                        />
                        {/* Non-Compliant segment */}
                        <circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="40"
                          strokeDasharray={`${2 * Math.PI * 56 * (stats.nonCompliant / assessed)} ${2 * Math.PI * 56}`}
                          strokeDashoffset={`-${2 * Math.PI * 56 * (stats.compliant / assessed)}`}
                        />
                        {/* Partial segment */}
                        <circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="40"
                          strokeDasharray={`${2 * Math.PI * 56 * (stats.partial / assessed)} ${2 * Math.PI * 56}`}
                          strokeDashoffset={`-${2 * Math.PI * 56 * ((stats.compliant + stats.nonCompliant) / assessed)}`}
                        />
                      </>
                    )}
                  </svg>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="text-slate-900 font-semibold">{stats.compliant}</div>
                      <div className="text-xs text-slate-600">Compliant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="flex-1">
                      <div className="text-slate-900 font-semibold">{stats.nonCompliant}</div>
                      <div className="text-xs text-slate-600">Non-Compliant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="flex-1">
                      <div className="text-slate-900 font-semibold">{stats.partial}</div>
                      <div className="text-xs text-slate-600">Partial</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    <div className="flex-1">
                      <div className="text-slate-900 font-semibold">{stats.notAssessed}</div>
                      <div className="text-xs text-slate-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Performance */}
          <div className="bg-white border border-[#dbeafe] rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6">Performance by Section</h2>
            
            {/* Main Clauses */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Main Clauses (4-10)</h3>
              <div className="space-y-4">
                {mainClauses.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#002366] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {section.id}
                        </div>
                        <div>
                          <div className="font-medium text-[#0f172a]">{section.title}</div>
                          <div className="text-sm text-[#002366]/70">
                            {section.completed} of {section.total} assessed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#14B8A6]">
                          {Math.round(section.completionRate)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-[#dbeafe] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#002366] to-[#003399] h-full rounded-full transition-all duration-500"
                        style={{ width: `${section.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Annex A */}
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Annex A Controls</h3>
              <div className="space-y-4">
                {annexSections.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#14B8A6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {section.id}
                        </div>
                        <div>
                          <div className="font-medium text-[#0f172a]">{section.title}</div>
                          <div className="text-sm text-[#002366]/70">
                            {section.completed} of {section.total} assessed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#14B8A6]">
                          {Math.round(section.completionRate)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-[#CCFBF1] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] h-full rounded-full transition-all duration-500"
                        style={{ width: `${section.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}