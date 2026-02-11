'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExportJSON = () => {
    const saved = localStorage.getItem('isoFormData');
    if (!saved) {
      alert('No data to export. Please complete some assessments first.');
      return;
    }

    try {
      const data = JSON.parse(saved);
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iso27001-assessment-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const handleResetData = () => {
    if (confirm('⚠️ WARNING: This will permanently delete all your assessment data. This action cannot be undone.\n\nAre you absolutely sure you want to continue?')) {
      if (confirm('Final confirmation: Delete all assessment data?')) {
        localStorage.removeItem('isoFormData');
        alert('✓ All assessment data has been deleted successfully.');
        router.push('/');
        window.location.reload();
      }
    }
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Settings & Data</h1>
              <p className="text-slate-600 mt-2">Manage your assessment data and preferences</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Export Data Section */}
          <div className="bg-white border border-[#dbeafe] rounded-xl p-6 md:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">Export Audit Data</h2>
                <p className="text-[#002366]/70 mb-4">
                  Download your current progress and findings as a JSON file for backup or external reporting.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-6 py-3 bg-[#002366] hover:bg-[#0F172A] text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Export JSON
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
                <p className="text-red-800 mb-4">
                  Resetting the audit will permanently delete all local progress. This action cannot be undone.
                </p>
                <button
                  onClick={handleResetData}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Reset All Data
                </button>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-[#dbeafe] border border-[#14B8A6] rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#002366] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-[#002366]">
                <p className="font-medium mb-1">About Data Storage</p>
                <p>All assessment data is stored locally in your browser. No data is sent to external servers. Make sure to export your data regularly for backup purposes.</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-white border-2 border-[#dbeafe] text-[#002366] rounded-lg font-semibold hover:border-[#14B8A6] hover:bg-[#dbeafe]/30 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </>
  );
}