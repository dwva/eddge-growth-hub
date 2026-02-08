import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'outline' | 'gradient';
  iconBg?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className,
  variant = 'default',
  iconBg
}: StatCardProps) => {
  const baseStyles = "relative overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-lg";
  
  const variantStyles = {
    default: "bg-white border border-gray-100 shadow-sm",
    outline: "bg-white/50 border-2 border-gray-100",
    gradient: "bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10"
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <p className="text-xs sm:text-[13px] font-medium text-gray-500 tracking-wide">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
              {trend && (
                <span className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                  trend.isPositive 
                    ? "text-emerald-700 bg-emerald-50" 
                    : "text-red-700 bg-red-50"
                )}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
          <div className={cn(
            "w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5",
            iconBg || "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
