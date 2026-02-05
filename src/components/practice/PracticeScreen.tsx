import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BookOpen,
  ListOrdered,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  getPracticeSetForTopic,
  formulaSheetByChapter,
  glossaryByChapter,
  type PracticeQuestionMCQ,
  type PracticeQuestionShortAnswer,
  type PracticeQuestionLongAnswer,
  type PracticeQuestionCaseStudy,
  type PracticeQuestionVeryShort,
} from '@/data/mockData';
import { type PracticeType } from '@/components/practice/PracticeTypeSelectionView';
import { cn } from '@/lib/utils';

type PracticeScreenProps = {
  subjectId: string;
  chapterId: string;
  topicId: string;
  subjectName: string;
  chapterName: string;
  topicName: string;
  practiceType: PracticeType;
  onBackToTypes: () => void;
  onBackToSelection: () => void;
};

type FlattenedCaseItem = {
  caseStudy: PracticeQuestionCaseStudy;
  subQuestion: PracticeQuestionCaseStudy['questions'][number];
  subIndex: number;
};

const PRACTICE_TYPE_LABELS: Record<PracticeType, string> = {
  mcq: 'MCQs',
  short: 'Short answers',
  long: 'Long answers',
  'case-study': 'Case study',
  'very-short': 'Very short answer',
};

function getDifficultyColor(d: string) {
  if (d === 'easy') return 'bg-green-100 text-green-700';
  if (d === 'medium') return 'bg-amber-100 text-amber-700';
  if (d === 'hard') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

export function PracticeScreen({
  subjectId,
  chapterId,
  topicId,
  subjectName,
  chapterName,
  topicName,
  practiceType,
  onBackToTypes,
  onBackToSelection,
}: PracticeScreenProps) {
  const set = getPracticeSetForTopic(topicId);
  const chapterKey = `${subjectId}-${chapterId}`;
  const formulaItems = formulaSheetByChapter[chapterKey] ?? [];
  const glossaryItems = glossaryByChapter[chapterKey] ?? [];

  const { questions: rawQuestions, totalCount } = useMemo(() => {
    if (practiceType === 'mcq') {
      const q = set.mcq;
      return { questions: q, totalCount: q.length };
    }
    if (practiceType === 'short') {
      const q = set.shortAnswer;
      return { questions: q, totalCount: q.length };
    }
    if (practiceType === 'long') {
      const q = set.longAnswer;
      return { questions: q, totalCount: q.length };
    }
    if (practiceType === 'very-short') {
      const q = set.veryShort;
      return { questions: q, totalCount: q.length };
    }
    // case-study: flatten
    const flattened: FlattenedCaseItem[] = [];
    set.caseStudy.forEach((cs) => {
      cs.questions.forEach((sq, i) => {
        flattened.push({ caseStudy: cs, subQuestion: sq, subIndex: i });
      });
    });
    return { questions: flattened, totalCount: flattened.length };
  }, [set, practiceType]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [checkFeedback, setCheckFeedback] = useState<Record<string, string>>({});
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [doubtQuery, setDoubtQuery] = useState('');
  const [rubricOpen, setRubricOpen] = useState(false);
  const [frameworkOpen, setFrameworkOpen] = useState(false);

  const total = totalCount;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - 1;

  const currentItem = rawQuestions[currentIndex];
  const currentId =
    practiceType === 'case-study'
      ? (currentItem as FlattenedCaseItem).subQuestion.id
      : (currentItem as PracticeQuestionMCQ).id;
  const isSubmitted = submitted[currentId];
  const currentAnswer = answers[currentId];

  const handlePrev = () => {
    setShowHint(false);
    setCurrentIndex((i) => Math.max(0, i - 1));
  };
  const handleNext = () => {
    setShowHint(false);
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  };

  const handleSubmitAnswer = (id: string, value: number | string) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setSubmitted((s) => ({ ...s, [id]: true }));
  };

  const handleCheckAnswer = (id: string, value: string) => {
    setCheckFeedback((f) => ({
      ...f,
      [id]: 'Mock feedback: Review your steps. Check units and key terms.',
    }));
  };

  if (total === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No questions available for this practice type in the selected topic.</p>
          <Button variant="outline" className="mt-4" onClick={onBackToTypes}>
            Back to practice types
          </Button>
        </CardContent>
      </Card>
    );
  }

  const contextBreadcrumb = `${subjectName} · ${chapterName} · ${topicName} · ${PRACTICE_TYPE_LABELS[practiceType]}`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Context & progress */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" title={contextBreadcrumb}>
          {contextBreadcrumb}
        </p>
        <p className="text-sm font-medium">
          Question {currentIndex + 1} of {total}
        </p>
      </div>

      {/* Case study: show case text when current item is from a case */}
      {practiceType === 'case-study' && currentItem && (
        <Collapsible defaultOpen>
          <Card className="bg-muted/40">
            <CollapsibleTrigger asChild>
              <CardContent className="py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-muted/60">
                <span className="text-sm font-medium">Case / scenario</span>
                <ChevronDown className="w-4 h-4" />
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 px-4 pb-4 text-sm text-muted-foreground">
                {(currentItem as FlattenedCaseItem).caseStudy.caseText}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Reference & support (Formula sheet, Glossary, Ask doubt) */}
      <div className="flex flex-wrap gap-2">
        {formulaItems.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Formula sheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Formula sheet</DialogTitle>
              </DialogHeader>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {formulaItems.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        )}
        {glossaryItems.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ListOrdered className="w-4 h-4 mr-2" />
                Glossary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Glossary</DialogTitle>
              </DialogHeader>
              <dl className="space-y-2 text-sm">
                {glossaryItems.map((g, i) => (
                  <div key={i}>
                    <dt className="font-medium">{g.term}</dt>
                    <dd className="text-muted-foreground pl-2">{g.definition}</dd>
                  </div>
                ))}
              </dl>
            </DialogContent>
          </Dialog>
        )}
        <Sheet open={doubtOpen} onOpenChange={setDoubtOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask a doubt
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Ask a doubt</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Ask in context of the current question and topic. (Mock: no real AI.)
              </p>
              <Input
                placeholder="Type your doubt..."
                value={doubtQuery}
                onChange={(e) => setDoubtQuery(e.target.value)}
              />
              <div className="p-3 rounded-lg bg-muted text-sm">
                Mock response: Focus on the key concept (e.g. like terms, Newton’s first law).
                Try writing one step at a time.
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Question card by type */}
      <Card>
        <CardContent className="p-6">
          {practiceType === 'mcq' && (
            <MCQBlock
              question={currentItem as PracticeQuestionMCQ}
              selected={currentAnswer as number | undefined}
              submitted={isSubmitted}
              showHint={showHint}
              onToggleHint={() => setShowHint((h) => !h)}
              onSubmit={handleSubmitAnswer}
            />
          )}
          {practiceType === 'short' && (
            <ShortAnswerBlock
              question={currentItem as PracticeQuestionShortAnswer}
              value={(currentAnswer as string) ?? ''}
              onChange={(v) => setAnswers((a) => ({ ...a, [currentId]: v }))}
              submitted={isSubmitted}
              showHint={showHint}
              onToggleHint={() => setShowHint((h) => !h)}
              onSubmit={(v) => handleSubmitAnswer(currentId, v)}
              onCheckAnswer={handleCheckAnswer}
              checkFeedback={checkFeedback[currentId]}
              onToggleRubric={setRubricOpen}
              rubricOpen={rubricOpen}
            />
          )}
          {practiceType === 'long' && (
            <LongAnswerBlock
              question={currentItem as PracticeQuestionLongAnswer}
              value={(currentAnswer as string) ?? ''}
              onChange={(v) => setAnswers((a) => ({ ...a, [currentId]: v }))}
              submitted={isSubmitted}
              showHint={showHint}
              onToggleHint={() => setShowHint((h) => !h)}
              onSubmit={(v) => handleSubmitAnswer(currentId, v)}
              onCheckAnswer={handleCheckAnswer}
              checkFeedback={checkFeedback[currentId]}
              onToggleFramework={setFrameworkOpen}
              onToggleRubric={setRubricOpen}
              frameworkOpen={frameworkOpen}
              rubricOpen={rubricOpen}
            />
          )}
          {practiceType === 'case-study' && (
            <CaseStudyBlock
              item={currentItem as FlattenedCaseItem}
              answers={answers}
              onAnswerChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))}
              submitted={submitted}
              showHint={showHint}
              onToggleHint={() => setShowHint((h) => !h)}
              onSubmit={handleSubmitAnswer}
            />
          )}
          {practiceType === 'very-short' && (
            <VeryShortBlock
              question={currentItem as PracticeQuestionVeryShort}
              value={(currentAnswer as string) ?? ''}
              onChange={(v) => setAnswers((a) => ({ ...a, [currentId]: v }))}
              submitted={isSubmitted}
              showHint={showHint}
              onToggleHint={() => setShowHint((h) => !h)}
              onSubmit={(v) => handleSubmitAnswer(currentId, v)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBackToTypes}>
            Change practice type
          </Button>
          <Button variant="ghost" size="sm" onClick={onBackToSelection}>
            Change topic
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={!canPrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={!canNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- MCQ ---
function MCQBlock({
  question,
  selected,
  submitted,
  showHint,
  onToggleHint,
  onSubmit,
}: {
  question: PracticeQuestionMCQ;
  selected: number | undefined;
  submitted: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (id: string, value: number) => void;
}) {
  const isCorrect = submitted && selected === question.correct;
  return (
    <div className="space-y-4">
      {question.difficulty && (
        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
      )}
      <h2 className="text-lg font-semibold">{question.question}</h2>
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !submitted && onSubmit(question.id, i)}
            disabled={submitted}
            className={cn(
              'w-full p-4 rounded-lg border-2 text-left transition-all',
              submitted
                ? i === question.correct
                  ? 'border-primary bg-primary/10'
                  : i === selected
                    ? 'border-destructive bg-destructive/10'
                    : 'border-border'
                : selected === i
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{opt}</span>
              {submitted && i === question.correct && <CheckCircle2 className="w-5 h-5 text-primary" />}
              {submitted && i === selected && i !== question.correct && (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
            </div>
          </button>
        ))}
      </div>
      {submitted && (
        <div className={cn('p-4 rounded-lg', isCorrect ? 'bg-primary/10' : 'bg-destructive/10')}>
          <p className={cn('font-semibold', isCorrect ? 'text-primary' : 'text-destructive')}>
            {isCorrect ? 'Correct. Well done.' : 'Not quite. See the correct answer above.'}
          </p>
          {!isCorrect && question.explanation && (
            <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
          )}
        </div>
      )}
      {question.hint && (
        <Button variant="outline" size="sm" onClick={onToggleHint} disabled={submitted}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? 'Hide hint' : 'Show hint'}
        </Button>
      )}
      {showHint && question.hint && !submitted && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          {question.hint}
        </div>
      )}
    </div>
  );
}

// --- Short answer ---
function ShortAnswerBlock({
  question,
  value,
  onChange,
  submitted,
  showHint,
  onToggleHint,
  onSubmit,
  onCheckAnswer,
  checkFeedback,
  onToggleRubric,
  rubricOpen,
}: {
  question: PracticeQuestionShortAnswer;
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (value: string) => void;
  onCheckAnswer: (id: string, v: string) => void;
  checkFeedback?: string;
  onToggleRubric: (v: boolean) => void;
  rubricOpen: boolean;
}) {
  return (
    <div className="space-y-4">
      {question.difficulty && (
        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
      )}
      <h2 className="text-lg font-semibold">{question.question}</h2>
      {question.rubric && (
        <Collapsible open={rubricOpen} onOpenChange={onToggleRubric}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {rubricOpen ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              Show rubric
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{question.rubric}</p>
          </CollapsibleContent>
        </Collapsible>
      )}
      <Textarea
        placeholder="Write your answer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        rows={4}
        className="resize-none"
      />
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onSubmit(value)}>
            Submit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCheckAnswer(question.id, value)}>
            Check my answer
          </Button>
        </div>
      )}
      {checkFeedback && (
        <p className="text-sm text-muted-foreground p-2 bg-muted rounded">{checkFeedback}</p>
      )}
      {submitted && question.modelAnswer && (
        <div className="p-4 rounded-lg bg-primary/10">
          <p className="text-sm font-medium text-primary">Model answer</p>
          <p className="text-sm text-muted-foreground mt-1">{question.modelAnswer}</p>
        </div>
      )}
      {question.hint && (
        <Button variant="outline" size="sm" onClick={onToggleHint} disabled={submitted}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? 'Hide hint' : 'Get a hint'}
        </Button>
      )}
      {showHint && question.hint && !submitted && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          {question.hint}
        </div>
      )}
    </div>
  );
}

// --- Long answer ---
function LongAnswerBlock({
  question,
  value,
  onChange,
  submitted,
  showHint,
  onToggleHint,
  onSubmit,
  onCheckAnswer,
  checkFeedback,
  onToggleFramework,
  onToggleRubric,
  frameworkOpen,
  rubricOpen,
}: {
  question: PracticeQuestionLongAnswer;
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (value: string) => void;
  onCheckAnswer: (id: string, v: string) => void;
  checkFeedback?: string;
  onToggleFramework: (v: boolean) => void;
  onToggleRubric: (v: boolean) => void;
  frameworkOpen: boolean;
  rubricOpen: boolean;
}) {
  return (
    <div className="space-y-4">
      {question.difficulty && (
        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
      )}
      <h2 className="text-lg font-semibold">{question.question}</h2>
      {question.subParts?.map((sp, i) => (
        <p key={i} className="text-sm font-medium text-muted-foreground">
          ({sp.label}) {sp.question}
        </p>
      ))}
      {question.framework && (
        <Collapsible open={frameworkOpen} onOpenChange={onToggleFramework}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4 mr-1" />
              {frameworkOpen ? 'Hide framework' : 'Show answer framework'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{question.framework}</p>
          </CollapsibleContent>
        </Collapsible>
      )}
      {question.rubric && (
        <Collapsible open={rubricOpen} onOpenChange={onToggleRubric}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {rubricOpen ? 'Hide rubric' : 'Show rubric'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{question.rubric}</p>
          </CollapsibleContent>
        </Collapsible>
      )}
      <Textarea
        placeholder="Write your answer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        rows={6}
        className="resize-none"
      />
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onSubmit(value)}>
            Submit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onCheckAnswer(question.id, value)}>
            Check my answer
          </Button>
        </div>
      )}
      {checkFeedback && (
        <p className="text-sm text-muted-foreground p-2 bg-muted rounded">{checkFeedback}</p>
      )}
      {submitted && question.modelAnswer && (
        <div className="p-4 rounded-lg bg-primary/10">
          <p className="text-sm font-medium text-primary">Model answer</p>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{question.modelAnswer}</p>
        </div>
      )}
      {question.hint && (
        <Button variant="outline" size="sm" onClick={onToggleHint} disabled={submitted}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? 'Hide hint' : 'Get a hint'}
        </Button>
      )}
      {showHint && question.hint && !submitted && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          {question.hint}
        </div>
      )}
    </div>
  );
}

// --- Case study (one sub-question at a time) ---
function CaseStudyBlock({
  item,
  answers,
  onAnswerChange,
  submitted,
  showHint,
  onToggleHint,
  onSubmit,
}: {
  item: FlattenedCaseItem;
  answers: Record<string, number | string>;
  onAnswerChange: (id: string, value: string) => void;
  submitted: Record<string, boolean>;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (id: string, value: number | string) => void;
}) {
  const { subQuestion } = item;
  const id = subQuestion.id;
  const isSubmitted = submitted[id];
  const answer = answers[id];

  if (subQuestion.type === 'mcq') {
    const q = subQuestion as { type: 'mcq'; id: string; question: string; options: string[]; correct: number };
    const selected = answer as number | undefined;
    const isCorrect = isSubmitted && selected === q.correct;
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{q.question}</h2>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => !isSubmitted && onSubmit(q.id, i)}
              disabled={isSubmitted}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                isSubmitted
                  ? i === q.correct
                    ? 'border-primary bg-primary/10'
                    : i === selected
                      ? 'border-destructive bg-destructive/10'
                      : 'border-border'
                  : selected === i
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {isSubmitted && i === q.correct && <CheckCircle2 className="w-5 h-5 text-primary" />}
                {isSubmitted && i === selected && i !== q.correct && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </button>
          ))}
        </div>
        {isSubmitted && (
          <div
            className={cn(
              'p-4 rounded-lg',
              isCorrect ? 'bg-primary/10' : 'bg-destructive/10'
            )}
          >
            <p className={cn('font-semibold', isCorrect ? 'text-primary' : 'text-destructive')}>
              {isCorrect ? 'Correct.' : 'Not quite. See the correct option above.'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // short or long
  const q = subQuestion as { type: 'short' | 'long'; id: string; question: string };
  const value = (answer as string) ?? '';
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{q.question}</h2>
      <Textarea
        placeholder="Write your answer..."
        value={value}
        onChange={(e) => onAnswerChange(q.id, e.target.value)}
        disabled={isSubmitted}
        rows={4}
        className="resize-none"
      />
      {!isSubmitted && (
        <Button size="sm" onClick={() => onSubmit(q.id, value)}>
          Submit
        </Button>
      )}
    </div>
  );
}

// --- Very short answer (with hint) ---
function VeryShortBlock({
  question,
  value,
  onChange,
  submitted,
  showHint,
  onToggleHint,
  onSubmit,
}: {
  question: PracticeQuestionVeryShort;
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onSubmit: (value: string) => void;
}) {
  const correct = value.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  const isCorrect = submitted && correct;
  return (
    <div className="space-y-4">
      {question.difficulty && (
        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
      )}
      <h2 className="text-lg font-semibold">{question.question}</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleHint} disabled={submitted}>
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? 'Hide hint' : 'Show hint'}
        </Button>
      </div>
      {showHint && !submitted && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
          <Lightbulb className="w-4 h-4 inline mr-2" />
          {question.hint}
        </div>
      )}
      <Input
        placeholder="Your answer (one word or short phrase)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        className="max-w-md"
      />
      {!submitted && (
        <Button size="sm" onClick={() => onSubmit(value)}>
          Submit
        </Button>
      )}
      {submitted && (
        <div className={cn('p-4 rounded-lg', isCorrect ? 'bg-primary/10' : 'bg-destructive/10')}>
          <p className={cn('font-semibold', isCorrect ? 'text-primary' : 'text-destructive')}>
            {isCorrect ? 'Correct.' : 'Not quite.'}
          </p>
          {!isCorrect && (
            <p className="text-sm text-muted-foreground mt-1">
              Correct answer: {question.correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
