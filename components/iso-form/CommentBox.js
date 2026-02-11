export default function CommentBox({ value, onChange, requirementId }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0f172a] mb-3">
        Evidence / Comments <span className="text-[#14B8A6]">*</span>
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Provide evidence, documentation, or comments to support your compliance status..."
        rows={5}
        className="w-full px-4 py-3 border-2 border-[#dbeafe] rounded-lg focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all duration-200 resize-none text-[#0f172a] placeholder-[#002366]/40"
      />
      <div className="mt-2 text-xs text-[#002366]/60">
        Describe how your organization meets this requirement or explain any gaps.
      </div>
    </div>
  );
}