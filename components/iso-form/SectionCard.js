export default function SectionCard({ section, progress, onClick, isAnnex }) {
  const getStatusColor = () => {
    if (progress.percentage === 100) return 'bg-[#14B8A6]';
    if (progress.percentage > 0) return 'bg-[#60a5fa]';
    return 'bg-[#dbeafe]';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#dbeafe] rounded-xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#14B8A6] hover:shadow-lg group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-lg text-white text-xl font-bold ${
          isAnnex ? 'bg-[#14B8A6]' : 'bg-[#002366]'
        }`}>
          {section.id}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#0f172a]">
            {Math.round(progress.percentage)}%
          </div>
          <div className="text-xs text-[#002366]/60">
            {progress.completed}/{progress.total}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#0f172a] mb-3 line-clamp-2 group-hover:text-[#002366]">
        {section.title}
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-[#dbeafe] rounded-full h-2 overflow-hidden">
          <div 
            className={`${getStatusColor()} h-full rounded-full transition-all duration-500`}
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#002366]/70 font-medium">
          {progress.total} requirements
        </span>
        {progress.percentage === 100 && (
          <div className="flex items-center gap-1 text-[#14B8A6]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Complete</span>
          </div>
        )}
      </div>
    </div>
  );
}