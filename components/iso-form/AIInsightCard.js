export default function AIInsightCard({ sectionId, completedRequirements, totalRequirements, isAnnex }) {
  const isComplete = completedRequirements === totalRequirements;

  return (
    <div className={`rounded-xl border-2 p-6 ${
      isAnnex 
        ? 'bg-[#CCFBF1] border-[#14B8A6]' 
        : 'bg-[#dbeafe] border-[#002366]'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          isAnnex ? 'bg-[#14B8A6]' : 'bg-[#002366]'
        }`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#0f172a] mb-2">
            {isComplete ? 'Section Complete!' : 'AI Insight'}
          </h3>
          {isComplete ? (
            <p className="text-sm text-[#002366]">
              You have completed all {totalRequirements} requirements for this section. Great work! You can now review your responses or proceed to the next section.
            </p>
          ) : (
            <p className="text-sm text-[#002366]">
              You are making good progress! {completedRequirements} of {totalRequirements} requirements completed. Keep going to finish this section.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}