'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import isoData from '@/lib/iso27001_data.json';

export default function DashboardPage() {
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

  // Get recent activity (last 5 assessed sections)
  const recentSections = isoData.sections
    .map(section => {
      const requirements = section.subsections[0]?.requirements || [];
      const lastAssessed = requirements.find(req => formData[req.id]?.status);
      return lastAssessed ? { section, lastAssessed } : null;
    })
    .filter(Boolean)
    .slice(0, 5);

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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-2">Real-time overview of your ISO 27001 assessment</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Top Stats Cards - GDPR Style with Subtle Animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Total Scope */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">{stats.total}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total Scope</div>
              <div className="text-xs text-slate-400 mt-1">Total articles in registry</div>
            </div>

            {/* Confirmed Compliant */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">{stats.compliant}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Confirmed Compliant</div>
              <div className="text-xs text-slate-400 mt-1">No remediation required</div>
            </div>

            {/* Critical Gaps */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">{stats.nonCompliant}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Critical Gaps</div>
              <div className="text-xs text-slate-400 mt-1">Immediate fix needed</div>
            </div>

            {/* Partial Gaps */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-1">{stats.partial}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Partial Gaps</div>
              <div className="text-xs text-slate-400 mt-1">Partial compliance found</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Compliance Score - Large */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-xl font-bold text-slate-900">Compliance Score</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 86 * (complianceRate / 100)} ${2 * Math.PI * 86}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-slate-900">{Math.round(complianceRate)}%</div>
                    <div className="text-sm text-slate-500 mt-1">Compliant</div>
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <span className="text-slate-700">Assessed</span>
                    <span className="text-teal font-bold">{assessed}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <span className="text-slate-700">Remaining</span>
                    <span className="text-slate-600 font-bold">{stats.notAssessed}</span>
                  </div>

                  <button
                    onClick={() => router.push('/')}
                    className="w-full mt-6 px-6 py-3 bg-teal hover:bg-teal/90 text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer"
                  >
                    Continue Assessment →
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700">Assessment Integrity</span>
                  <span className="text-sm text-teal font-medium">{Math.round((assessed/stats.total)*100)}% Evaluated</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal to-teal-light h-full rounded-full transition-all duration-500"
                    style={{ width: `${(assessed/stats.total)*100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-[#dbeafe] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#0f172a] mb-4">Recent Activity</h2>
              
              {recentSections.length > 0 ? (
                <div className="space-y-3">
                  {recentSections.map(({ section }) => (
                    <div key={section.id} className="p-3 bg-[#dbeafe]/30 rounded-lg hover:bg-[#dbeafe]/50 transition-colors cursor-pointer"
                         onClick={() => router.push(`/section/${section.id}`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                          section.id.startsWith('A.') ? 'bg-[#14B8A6]' : 'bg-[#002366]'
                        }`}>
                          {section.id}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#0f172a] line-clamp-1">{section.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#002366]/60">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">No assessments yet</p>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-4 py-2 bg-[#14B8A6] text-white rounded-lg text-sm font-medium hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    Start Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/')}
              className="p-6 bg-white border-2 border-[#dbeafe] rounded-xl hover:border-[#14B8A6] hover:shadow-lg transition-all duration-200 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#dbeafe] group-hover:bg-[#14B8A6] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-[#002366] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f172a]">Assessment</h3>
                  <p className="text-sm text-[#002366]/70">Evaluate requirements</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/report')}
              className="p-6 bg-white border-2 border-[#dbeafe] rounded-xl hover:border-[#14B8A6] hover:shadow-lg transition-all duration-200 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#dbeafe] group-hover:bg-[#14B8A6] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-[#002366] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f172a]">View Report</h3>
                  <p className="text-sm text-[#002366]/70">Compliance summary</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/analytics')}
              className="p-6 bg-white border-2 border-[#dbeafe] rounded-xl hover:border-[#14B8A6] hover:shadow-lg transition-all duration-200 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#dbeafe] group-hover:bg-[#14B8A6] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-[#002366] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0f172a]">Analytics</h3>
                  <p className="text-sm text-[#002366]/70">Detailed insights</p>
                </div>
              </div>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
