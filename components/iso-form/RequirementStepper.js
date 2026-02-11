// export default function RequirementStepper({ 
//   requirements, 
//   currentIndex, 
//   formData, 
//   onRequirementClick,
//   isAnnex 
// }) {
//   const totalRequirements = requirements.length;
//   const completedCount = requirements.filter(req => formData[req.id]?.status).length;

//   // Show max 10 steps on desktop, 5 on mobile
//   const maxVisible = typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 10;
  
//   // Calculate which requirements to show
//   let startIndex = Math.max(0, currentIndex - Math.floor(maxVisible / 2));
//   let endIndex = Math.min(totalRequirements, startIndex + maxVisible);
  
//   // Adjust if we're near the end
//   if (endIndex - startIndex < maxVisible) {
//     startIndex = Math.max(0, endIndex - maxVisible);
//   }

//   const visibleRequirements = requirements.slice(startIndex, endIndex);

//   const getStepStatus = (index) => {
//     const req = requirements[index];
//     if (formData[req.id]?.status) return 'completed';
//     if (index === currentIndex) return 'current';
//     return 'pending';
//   };

//   const getStepColor = (status) => {
//     if (status === 'completed') return isAnnex ? 'bg-[#14B8A6] border-[#14B8A6]' : 'bg-[#14B8A6] border-[#14B8A6]';
//     if (status === 'current') return isAnnex ? 'bg-[#14B8A6] border-[#14B8A6] ring-4 ring-[#14B8A6]/20' : 'bg-[#1e3a8a] border-[#1e3a8a] ring-4 ring-[#1e3a8a]/20';
//     return 'bg-white border-[#dbeafe]';
//   };

//   const getLineColor = (index) => {
//     const req = requirements[index];
//     return formData[req.id]?.status ? (isAnnex ? 'bg-[#14B8A6]' : 'bg-[#14B8A6]') : 'bg-[#dbeafe]';
//   };

//   return (
//     <div className="bg-white border-b border-[#dbeafe] py-6 px-4 md:px-6 sticky top-0 z-30">
//       <div className="max-w-5xl mx-auto">
//         {/* Progress text */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-sm font-semibold text-[#0f172a]">
//             Requirement {currentIndex + 1} of {totalRequirements}
//           </div>
//           <div className="text-sm text-[#1e3a8a]/70">
//             {completedCount} completed
//           </div>
//         </div>

//         {/* Stepper */}
//         <div className="relative flex items-center justify-between">
//           {visibleRequirements.map((req, idx) => {
//             const actualIndex = startIndex + idx;
//             const status = getStepStatus(actualIndex);
//             const isLast = idx === visibleRequirements.length - 1;

//             return (
//               <div key={req.id} className="flex items-center flex-1">
//                 <div className="flex flex-col items-center flex-1">
//                   {/* Step circle */}
//                   <button
//                     onClick={() => onRequirementClick(actualIndex)}
//                     className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
//                       getStepColor(status)
//                     } ${status === 'current' ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
//                   >
//                     {status === 'completed' ? (
//                       <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     ) : (
//                       <span className={status === 'current' ? 'text-white' : 'text-[#1e3a8a]/50'}>
//                         {actualIndex + 1}
//                       </span>
//                     )}
//                   </button>

//                   {/* Step label (hide on mobile) */}
//                   <div className="hidden md:block mt-2 text-xs text-[#1e3a8a]/60 text-center">
//                     {status === 'completed' ? '✓' : status === 'current' ? '→' : ''}
//                   </div>
//                 </div>

//                 {/* Connecting line */}
//                 {!isLast && (
//                   <div className="flex-1 h-0.5 mx-1 md:mx-2">
//                     <div className={`h-full transition-all duration-300 ${getLineColor(actualIndex)}`}></div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Show ellipsis if there are hidden requirements */}
//         <div className="flex items-center justify-between mt-2 text-xs text-[#1e3a8a]/50">
//           <div>{startIndex > 0 ? '...' : ''}</div>
//           <div>{endIndex < totalRequirements ? '...' : ''}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function RequirementStepper({ 
  requirements, 
  currentIndex, 
  formData, 
  onRequirementClick,
  isAnnex 
}) {
  const totalRequirements = requirements.length;
  const completedCount = requirements.filter(req => formData[req.id]?.status).length;

  // Show max 10 steps on desktop, 5 on mobile
  const maxVisible = typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 10;
  
  // Calculate which requirements to show
  let startIndex = Math.max(0, currentIndex - Math.floor(maxVisible / 2));
  let endIndex = Math.min(totalRequirements, startIndex + maxVisible);
  
  // Adjust if we're near the end
  if (endIndex - startIndex < maxVisible) {
    startIndex = Math.max(0, endIndex - maxVisible);
  }

  const visibleRequirements = requirements.slice(startIndex, endIndex);

  const getStepStatus = (index) => {
    const req = requirements[index];
    if (formData[req.id]?.status) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (status) => {
    if (status === 'completed') return isAnnex ? 'bg-[#14B8A6] border-[#14B8A6]' : 'bg-[#14B8A6] border-[#14B8A6]';
    if (status === 'current') return isAnnex ? 'bg-[#14B8A6] border-[#14B8A6] ring-4 ring-[#14B8A6]/20' : 'bg-[#002366] border-[#002366] ring-4 ring-[#002366]/20';
    return 'bg-white border-[#dbeafe]';
  };

  const getLineColor = (index) => {
    const req = requirements[index];
    return formData[req.id]?.status ? (isAnnex ? 'bg-[#14B8A6]' : 'bg-[#14B8A6]') : 'bg-[#dbeafe]';
  };

  return (
    <div className="bg-white border-b border-[#dbeafe] py-6 px-4 md:px-6 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto">
        {/* Progress text */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#0f172a]">
            Requirement {currentIndex + 1} of {totalRequirements}
          </div>
          <div className="text-sm text-[#002366]/70">
            {completedCount} completed
          </div>
        </div>

        {/* Stepper */}
        <div className="relative flex items-center justify-between">
          {visibleRequirements.map((req, idx) => {
            const actualIndex = startIndex + idx;
            const status = getStepStatus(actualIndex);
            const isLast = idx === visibleRequirements.length - 1;

            return (
              <div key={req.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step circle */}
                  <button
                    onClick={() => onRequirementClick(actualIndex)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                      getStepColor(status)
                    } ${status === 'current' ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                  >
                    {status === 'completed' ? (
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className={status === 'current' ? 'text-white' : 'text-[#002366]/50'}>
                        {actualIndex + 1}
                      </span>
                    )}
                  </button>

                  {/* Step label (hide on mobile) */}
                  <div className="hidden md:block mt-2 text-xs text-[#002366]/60 text-center">
                    {status === 'completed' ? '✓' : status === 'current' ? '→' : ''}
                  </div>
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-1 md:mx-2">
                    <div className={`h-full transition-all duration-300 ${getLineColor(actualIndex)}`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show ellipsis if there are hidden requirements */}
        <div className="flex items-center justify-between mt-2 text-xs text-[#002366]/50">
          <div>{startIndex > 0 ? '...' : ''}</div>
          <div>{endIndex < totalRequirements ? '...' : ''}</div>
        </div>
      </div>
    </div>
  );
}