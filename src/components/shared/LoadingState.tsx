import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">{message}</span>
    </div>
  );
}
