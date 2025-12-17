'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>
          {current} of {total} questions
        </span>
        <span>{percentage}% complete</span>
      </div>
    </div>
  );
}

