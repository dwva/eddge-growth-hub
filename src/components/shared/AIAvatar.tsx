import { cn } from '@/lib/utils';

interface AIAvatarProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AIAvatar = ({ message, size = 'md', className }: AIAvatarProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className={cn(
        "rounded-full gradient-primary flex items-center justify-center shadow-lg flex-shrink-0",
        sizeClasses[size]
      )}>
        <span className={cn(
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-2xl',
          size === 'lg' && 'text-3xl',
        )}>
          🤖
        </span>
      </div>
      {message && (
        <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border max-w-md">
          <p className="text-sm text-foreground">{message}</p>
        </div>
      )}
    </div>
  );
};

export default AIAvatar;
