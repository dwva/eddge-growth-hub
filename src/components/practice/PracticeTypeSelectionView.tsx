import { Card, CardContent } from '@/components/ui/card';
import {
  ListChecks,
  FileText,
  FileStack,
  CaseSensitive,
  MessageSquareQuote,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type PracticeType =
  | 'mcq'
  | 'short'
  | 'long'
  | 'case-study'
  | 'very-short';

const PRACTICE_TYPES: {
  id: PracticeType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'mcq',
    label: 'MCQs',
    description: 'Multiple choice questions. Choose the correct option.',
    icon: <ListChecks className="w-5 h-5" />,
  },
  {
    id: 'short',
    label: 'Short answers',
    description: 'Brief written answers in a few sentences.',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'long',
    label: 'Long answers',
    description: 'Extended answers with structure and detail.',
    icon: <FileStack className="w-5 h-5" />,
  },
  {
    id: 'case-study',
    label: 'Case study',
    description: 'Scenario-based questions with context.',
    icon: <CaseSensitive className="w-5 h-5" />,
  },
  {
    id: 'very-short',
    label: 'Very short answer (with hint)',
    description: 'One-word or one-line answers. Hints available.',
    icon: <MessageSquareQuote className="w-5 h-5" />,
  },
];

type PracticeTypeSelectionViewProps = {
  subjectName: string;
  chapterName: string;
  topicName: string;
  onSelectType: (type: PracticeType) => void;
};

export function PracticeTypeSelectionView({
  subjectName,
  chapterName,
  topicName,
  onSelectType,
}: PracticeTypeSelectionViewProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{topicName}</span>
        {' · '}
        {chapterName} · {subjectName}
      </p>
      <p className="text-sm text-muted-foreground">
        Choose a practice type. You can try any type in any order.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRACTICE_TYPES.map((type) => (
          <Card
            key={type.id}
            className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
            onClick={() => onSelectType(type.id)}
          >
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {type.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{type.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
              </div>
              {type.id === 'very-short' && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded w-fit">
                  <Lightbulb className="w-3 h-3" />
                  Hint always available
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { PRACTICE_TYPES };
