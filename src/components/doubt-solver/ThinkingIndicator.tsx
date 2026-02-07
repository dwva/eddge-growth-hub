import { MessageCircle } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex gap-2 md:gap-4 py-2 md:py-4">
      <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center">
        <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
      </div>
      <div className="bg-muted rounded-2xl px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>Thinking...</span>
        </div>
      </div>
    </div>
  );
}
