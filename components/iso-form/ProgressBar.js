export default function ProgressBar({ current, total, color = 'blue' }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-semibold text-gray-900">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            percentage === 100 ? colorClasses.green : colorClasses[color]
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-right">
        <span className="font-medium text-gray-700">{Math.round(percentage)}%</span>
        <span className="text-gray-500"> Complete</span>
      </div>
    </div>
  );
}