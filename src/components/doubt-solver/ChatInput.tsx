import { useRef, useEffect } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="p-2 md:p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-muted rounded-2xl border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask any doubt…"
            rows={1}
            className="w-full bg-transparent resize-none px-3 py-2.5 pr-24 md:px-4 md:py-3 md:pr-28 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px]"
          />
          <div className="absolute right-1.5 md:right-2 bottom-1.5 md:bottom-2 flex items-center gap-0.5 md:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Paperclip className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
            <Button
              size="icon"
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="h-7 w-7 md:h-8 md:w-8 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              type="button"
            >
              <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
