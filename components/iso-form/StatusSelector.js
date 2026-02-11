export default function StatusSelector({ value, onChange, requirementId }) {
  const statuses = [
    { 
      id: 'compliant', 
      label: 'Compliant',
      bgColor: 'bg-[#10b981]',
      hoverBg: 'hover:bg-[#059669]',
      borderColor: 'border-[#34d399]',
      hoverBorder: 'hover:border-[#10b981]',
      ring: 'ring-[#10b981]/20'
    },
    { 
      id: 'non_compliant', 
      label: 'Non-Compliant',
      bgColor: 'bg-[#ef4444]',
      hoverBg: 'hover:bg-[#dc2626]',
      borderColor: 'border-[#f87171]',
      hoverBorder: 'hover:border-[#ef4444]',
      ring: 'ring-[#ef4444]/20'
    },
    { 
      id: 'partially_compliant', 
      label: 'Partially Compliant',
      bgColor: 'bg-[#f59e0b]',
      hoverBg: 'hover:bg-[#d97706]',
      borderColor: 'border-[#fbbf24]',
      hoverBorder: 'hover:border-[#f59e0b]',
      ring: 'ring-[#f59e0b]/20'
    },
    { 
      id: 'not_applicable', 
      label: 'Not Applicable',
      bgColor: 'bg-[#64748b]',
      hoverBg: 'hover:bg-[#475569]',
      borderColor: 'border-[#94a3b8]',
      hoverBorder: 'hover:border-[#64748b]',
      ring: 'ring-[#64748b]/20'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0f172a] mb-4">
        Compliance Status <span className="text-[#ef4444]">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statuses.map((status) => {
          const isSelected = value === status.id;
          return (
            <button
              key={status.id}
              onClick={() => onChange(status.id)}
              className={`
                relative px-6 py-5 rounded-xl border-2 font-medium text-base
                transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? `${status.bgColor} border-transparent text-white shadow-lg ring-4 ${status.ring} scale-[1.02]`
                  : `bg-white ${status.borderColor} text-[#0f172a] hover:scale-[1.01] ${status.hoverBorder} hover:shadow-md`
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className={isSelected ? 'font-semibold' : ''}>{status.label}</span>
                {isSelected && (
                  <svg className="w-5 h-5 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[#64748b] mt-3">
        Select the current compliance status for this requirement
      </p>
    </div>
  );
}