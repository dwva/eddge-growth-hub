import { Calculator, FlaskConical, BookOpen, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestions = [
  { icon: Calculator, label: 'Help with Math', color: 'text-blue-500' },
  { icon: FlaskConical, label: 'Explain Science', color: 'text-emerald-500' },
  { icon: BookOpen, label: 'Study Tips', color: 'text-amber-500' },
  { icon: PenTool, label: 'Writing Help', color: 'text-pink-500' },
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            What can I help with?
          </h1>
          <p className="text-muted-foreground text-sm">
            Ask me anything about your studies
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.label)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors border border-border"
            >
              <suggestion.icon className={cn("w-4 h-4", suggestion.color)} />
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
