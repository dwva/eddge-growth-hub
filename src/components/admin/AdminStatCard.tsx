import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  gradient?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'cyan';
  className?: string;
}

const gradientClasses = {
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-violet-500 to-purple-600',
  green: 'from-emerald-500 to-green-600',
  amber: 'from-amber-500 to-orange-600',
  red: 'from-red-500 to-rose-600',
  cyan: 'from-cyan-500 to-blue-600',
};

const shadowClasses = {
  blue: 'shadow-blue-500/25',
  purple: 'shadow-purple-500/25',
  green: 'shadow-emerald-500/25',
  amber: 'shadow-amber-500/25',
  red: 'shadow-red-500/25',
  cyan: 'shadow-cyan-500/25',
};

const AdminStatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  gradient = 'blue',
  className 
}: AdminStatCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 group card-hover",
      className
    )}>
      {/* Icon Container with Gradient */}
      <div className={cn(
        "w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-105 transition-transform shadow-lg",
        gradientClasses[gradient],
        shadowClasses[gradient]
      )}>
        <div className="w-5 h-5 sm:w-7 sm:h-7 text-white">
          {icon}
        </div>
      </div>

      {/* Large Number */}
      <div className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        {value}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{title}</div>

      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center mt-3 text-sm">
          {trend.isPositive ? (
            <ArrowUp className="w-4 h-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={cn(
            "font-medium",
            trend.isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-400 ml-2">{trend.label || 'from last month'}</span>
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
