import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  filter?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, action, filter, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filter}
        {action}
      </div>
    </div>
  );
};

export default PageHeader;
