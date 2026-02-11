export default function NavigationButtons({ 
  onPrevious, 
  onNext, 
  isFirst, 
  isLast, 
  isAnnex,
  showKeyboardHint = true,
  isDisabled = false
}) {
  return (
    <div className="p-6 bg-[#dbeafe]/30 border-t border-[#dbeafe] flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className="px-6 py-3 bg-white border-2 border-[#dbeafe] text-[#002366] rounded-lg font-semibold hover:bg-[#dbeafe] hover:border-[#002366]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {showKeyboardHint && (
        <div className="text-sm text-[#002366]/70 font-medium">
          Use keyboard: <kbd className="px-2 py-1 bg-white border border-[#dbeafe] rounded text-[#002366] font-mono">←</kbd> <kbd className="px-2 py-1 bg-white border border-[#dbeafe] rounded text-[#002366] font-mono">→</kbd>
        </div>
      )}

      {isLast ? (
        <button
          onClick={onNext}
          disabled={isDisabled}
          className="px-6 py-3 bg-[#14B8A6] text-white rounded-lg font-semibold hover:bg-[#0D9488] transition-all duration-200 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#14B8A6]"
        >
          Complete Section
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={isDisabled}
          className={`px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAnnex 
              ? 'bg-[#14B8A6] hover:bg-[#0D9488] disabled:hover:bg-[#14B8A6]' 
              : 'bg-[#002366] hover:bg-[#0f172a] disabled:hover:bg-[#002366]'
          }`}
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}