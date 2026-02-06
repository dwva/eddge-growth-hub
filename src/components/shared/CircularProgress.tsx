import React from 'react';

type CircularProgressProps = {
  value: number; // 0–100
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  label,
  size = 140,
  strokeWidth = 10,
  className,
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <g transform={`rotate(-90 ${center} ${center})`}>
          {/* Dark gray track (remaining portion) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#6b7280"
            strokeWidth={strokeWidth}
          />
          {/* Pink progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-gray-600">
          {clamped}%
        </span>
        {label && (
          <span className="mt-0.5 text-[11px] text-gray-500 text-center px-2 line-clamp-2">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

