// 'use client';

// import { useRouter, usePathname } from 'next/navigation';

// export default function Sidebar({ onClose }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const menuItems = [
//     {
//       name: 'Assessment',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//       ),
//       path: '/',
//       active: pathname === '/' || pathname.startsWith('/section')
//     },
//     {
//       name: 'Report',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//       ),
//       path: '/report',
//       active: pathname === '/report'
//     },
//     {
//       name: 'Settings',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       path: '/settings',
//       active: pathname === '/settings'
//     }
//   ];

//   const handleNavigation = (path) => {
//     if (path === '/settings') {
//       alert('Settings page coming soon');
//       return;
//     }
//     router.push(path);
//     if (onClose) onClose(); // Close mobile menu after navigation
//   };

//   const handleProfile = () => {
//     alert('Profile feature available after authentication is implemented');
//   };

//   const handleLogout = () => {
//     if (confirm('Clear all assessment data? This will reset your progress.')) {
//       localStorage.clear();
//       alert('All data cleared! Page will refresh.');
//       window.location.reload();
//     }
//   };

//   return (
//     <div className="w-72 h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] flex flex-col fixed left-0 top-0 z-50">
//       {/* Logo/Brand */}
//       <div className="p-6 border-b border-white/10 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 bg-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg">
//             <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-white">ISO Assessment</h1>
//             <p className="text-xs text-[#5EEAD4]">Compliance Tool</p>
//           </div>
//         </div>
//         {/* Close button for mobile */}
//         {onClose && (
//           <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Navigation Menu */}
//       <nav className="flex-1 p-4 space-y-1">
//         {menuItems.map((item) => (
//           <button
//             key={item.name}
//             onClick={() => handleNavigation(item.path)}
//             className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 cursor-pointer relative group ${
//               item.active
//                 ? 'bg-[#14B8A6]/10 text-white border-l-4 border-[#14B8A6] pl-3'
//                 : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-3'
//             }`}
//           >
//             <span className={`transition-all duration-200 ${item.active ? 'text-[#14B8A6]' : 'text-white/70 group-hover:text-[#14B8A6]'}`}>
//               {item.icon}
//             </span>
//             <span className={`text-sm font-medium ${item.active ? 'font-semibold text-white' : ''}`}>
//               {item.name}
//             </span>
//           </button>
//         ))}
//       </nav>

//       {/* Footer (Profile & Logout) */}
//       <div className="p-4 border-t border-white/10 space-y-1">
//         <button
//           onClick={handleProfile}
//           className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-white/70 hover:text-white hover:bg-white/5 group"
//         >
//           <svg className="w-5 h-5 text-white/70 group-hover:text-[#14B8A6] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           <span className="text-sm font-medium">Profile</span>
//         </button>
        
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-white/70 hover:text-white hover:bg-red-500/10 group"
//         >
//           <svg className="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           <span className="text-sm font-medium">Logout</span>
//         </button>
        
//         <div className="text-xs text-white/40 text-center pt-3 font-light">
//           v1.0.0 • MVP
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      name: 'Assessment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/',
      active: pathname === '/' || pathname?.startsWith('/section')
    },
    {
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/analytics',
      active: pathname === '/analytics'
    },
    {
      name: 'Report',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/report',
      active: pathname === '/report'
    },
    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings',
      active: pathname === '/settings'
    }
  ];

  const handleNavigation = (path) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <div className="h-screen w-72 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 shadow-sm">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-[#002366] hover:text-[#001a4d] p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#002366] to-[#0F172A] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src="/logo.jpeg"
              alt="ComplyEncrypt"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">
              <span className="text-[#002366]">Comply</span>
              <span className="text-[#14B8A6]">Encrypt</span>
            </h2>
            <p className="text-slate-500 text-xs">ISO 27001 Assessment</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
              item.active
                ? 'bg-[#002366] text-white shadow-md'
                : 'text-[#002366] hover:bg-slate-50'
            }`}
          >
            <span className={`transition-all duration-200 ${item.active ? 'text-white' : 'text-[#002366]'}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#002366] hover:bg-slate-50 transition-all duration-200 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm font-medium">Profile</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#002366] hover:bg-slate-50 transition-all duration-200 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}