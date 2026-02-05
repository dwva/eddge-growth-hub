import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Brain,
  Target,
  Flag,
  Lightbulb,
  AlertCircle,
  Pause,
  Play,
} from 'lucide-react';
import type { 
  LearningNode, 
  LearningFrame, 
  EngineStage, 
  FrameResponse,
  LearnEngineSession,
  SupportLockPhase,
} from './types';
import { STAGE_CONFIG } from './types';

// ——— A.C.E Support Lock: gentle phrases only (no wrong/failed/incorrect) ———
const SUPPORT_LOCK_ACKS = [
  'This is a very common confusion — let\'s clear it quickly.',
  'You\'re almost there. One small idea needs fixing.',
  'Good attempt. Let\'s tighten one step.',
];

interface SupportLockState {
  active: boolean;
  used: boolean;
  phase: SupportLockPhase;
  triggeredByFrameId: string;
  acknowledgment: string;
  reteachFrames: LearningFrame[];
  repairFrame: LearningFrame | null;
  reteachIndex: number;
  repairCorrect: boolean | null;
}

interface LearnEngineProps {
  node: LearningNode;
  onComplete: (results: LearnEngineSession) => void;
  onBack: () => void;
  onPause?: () => void;
  /** Optional: GENTLE_GUIDE | DIRECT_CORRECT | CHALLENGE_MODE */
  correctionPreference?: 'GENTLE_GUIDE' | 'DIRECT_CORRECT' | 'CHALLENGE_MODE';
}

const STAGE_ICONS = {
  foundation: BookOpen,
  concept: Brain,
  ace: Target,
  exit: Flag,
};

const STAGE_LABELS = {
  foundation: 'Foundation',
  concept: 'Concept Learning',
  ace: 'A.C.E Assessment',
  exit: 'Summary & Exit',
};

const STAGE_COLORS = {
  foundation: 'bg-blue-500',
  concept: 'bg-purple-500',
  ace: 'bg-orange-500',
  exit: 'bg-green-500',
};

/** Build Support Lock content from the frame that triggered it (micro re-teach + repair). */
function buildSupportLockContent(
  triggeredFrame: LearningFrame,
  ackIndex: number
): { acknowledgment: string; reteachFrames: LearningFrame[]; repairFrame: LearningFrame } {
  const ack = SUPPORT_LOCK_ACKS[ackIndex % SUPPORT_LOCK_ACKS.length];
  const reteachFrames: LearningFrame[] = [];
  if (triggeredFrame.content.explanation) {
    reteachFrames.push({
      id: `${triggeredFrame.id}-reteach-1`,
      type: 'ace-reteach',
      stage: 'ace',
      order: 0,
      content: {
        title: 'One small idea to fix',
        body: triggeredFrame.content.explanation,
      },
    });
  }
  reteachFrames.push({
    id: `${triggeredFrame.id}-reteach-2`,
    type: 'ace-reteach',
    stage: 'ace',
    order: 1,
    content: {
      body: 'Use this idea in the next question — same concept, just a quick check.',
    },
  });
  const repairFrame: LearningFrame = {
    ...triggeredFrame,
    id: `${triggeredFrame.id}-repair`,
    type: triggeredFrame.type === 'mcq' ? 'mcq' : (triggeredFrame.type as 'numerical' | 'short-explain'),
  };
  return { acknowledgment: ack, reteachFrames, repairFrame };
}

// Stage progress indicator
function StageProgress({ 
  currentStage, 
  stages 
}: { 
  currentStage: EngineStage;
  stages: EngineStage[];
}) {
  const currentIndex = stages.indexOf(currentStage);
  
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {stages.map((stage, index) => {
        const Icon = STAGE_ICONS[stage];
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLocked = index > currentIndex;

        return (
          <div key={stage} className="flex items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isComplete && 'bg-green-500 text-white',
                isCurrent && cn(STAGE_COLORS[stage], 'text-white ring-4 ring-offset-2 ring-purple-200'),
                isLocked && 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              )}
            >
              {isComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  'w-8 h-1 mx-1 rounded-full transition-all',
                  isComplete ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Individual frame renderer
function FrameContent({
  frame,
  response,
  onAnswer,
  showResult,
  guidanceMode = false,
}: {
  frame: LearningFrame;
  response?: FrameResponse;
  onAnswer: (answer: string | number) => void;
  showResult: boolean;
  /** When true, use soft/neutral styling only (no red, no wrong/failed language) */
  guidanceMode?: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    response?.userAnswer as number ?? null
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    (response?.userAnswer as string) ?? ''
  );

  const isCorrect = response?.isCorrect;
  const hasAnswered = response?.userAnswer !== undefined;

  // Content-based frames (Foundation, Concept, Exit, Support Lock re-teach)
  if (['what', 'why-real', 'why-exam', 'curiosity', 'definition', 'example', 
       'diagram', 'equation', 'derivation', 'intuition', 'takeaway', 
       'formulas', 'mistakes', 'ace-reteach', 'ace-ack'].includes(frame.type)) {
    return (
      <div className="space-y-4">
        {frame.content.title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
            {frame.content.title}
          </h3>
        )}
        {frame.content.body && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {frame.content.body}
          </p>
        )}
        {frame.content.formula && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <code className="text-lg font-mono text-purple-700 dark:text-purple-300">
              {frame.content.formula}
            </code>
          </div>
        )}
        {frame.content.imageUrl && (
          <img 
            src={frame.content.imageUrl} 
            alt={frame.content.title || 'Diagram'} 
            className="rounded-xl max-w-full h-auto"
          />
        )}
      </div>
    );
  }

  // MCQ frame
  if (frame.type === 'mcq' && frame.content.options) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">
          {frame.content.question}
        </h3>
        <div className="space-y-2">
          {frame.content.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = frame.content.correctAnswer === index;
            
            let optionStyle = 'border-gray-200 dark:border-gray-700 hover:border-purple-400';
            if (showResult && hasAnswered) {
              if (isCorrectOption) {
                optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
              } else if (isSelected && !isCorrect) {
                // Support Lock / guidance: no red; use neutral
                optionStyle = guidanceMode
                  ? 'border-slate-400 bg-slate-50 dark:bg-slate-800/50'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20';
              }
            } else if (isSelected) {
              optionStyle = 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!showResult) {
                    setSelectedOption(index);
                    onAnswer(index);
                  }
                }}
                disabled={showResult}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  optionStyle,
                  !showResult && 'cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    isSelected 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Hint */}
        {frame.content.hint && !hasAnswered && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Hint:</strong> {frame.content.hint}
            </p>
          </div>
        )}

        {/* Explanation after answer — guidanceMode: no red, neutral tone */}
        {showResult && frame.content.explanation && (
          <div className={cn(
            'flex items-start gap-2 p-3 rounded-lg',
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : guidanceMode 
                ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
                : 'bg-red-50 dark:bg-red-900/20'
          )}>
            <AlertCircle className={cn(
              'w-5 h-5 flex-shrink-0 mt-0.5',
              isCorrect ? 'text-green-500' : guidanceMode ? 'text-slate-500' : 'text-red-500'
            )} />
            <p className={cn(
              'text-sm',
              isCorrect 
                ? 'text-green-700 dark:text-green-300' 
                : guidanceMode 
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-red-700 dark:text-red-300'
            )}>
              {frame.content.explanation}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Short answer / Numerical frame
  if (['short-explain', 'numerical', 'recall'].includes(frame.type)) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">
          {frame.content.question}
        </h3>
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          onBlur={() => onAnswer(textAnswer)}
          disabled={showResult}
          placeholder="Type your answer here..."
          className={cn(
            'w-full p-4 rounded-xl border-2 min-h-24 resize-none',
            'bg-white dark:bg-gray-900',
            'text-gray-800 dark:text-gray-200',
            'placeholder:text-gray-400',
            showResult 
              ? 'border-gray-300 dark:border-gray-700' 
              : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
          )}
        />
        {frame.content.hint && !hasAnswered && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Hint:</strong> {frame.content.hint}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

const INIT_SUPPORT_LOCK: SupportLockState = {
  active: false,
  used: false,
  phase: 'acknowledgment',
  triggeredByFrameId: '',
  acknowledgment: '',
  reteachFrames: [],
  repairFrame: null,
  reteachIndex: 0,
  repairCorrect: null,
};

export function LearnEngine({ node, onComplete, onBack, onPause, correctionPreference = 'GENTLE_GUIDE' }: LearnEngineProps) {
  const stages: EngineStage[] = ['foundation', 'concept', 'ace', 'exit'];
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, FrameResponse>>(new Map());
  const [showResult, setShowResult] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supportLock, setSupportLock] = useState<SupportLockState>(INIT_SUPPORT_LOCK);
  const [repairResponse, setRepairResponse] = useState<FrameResponse | null>(null);
  const [repairShowResult, setRepairShowResult] = useState(false);

  const currentStage = stages[currentStageIndex];
  
  // Get frames for current stage
  const stageFrames = node.frames.filter(f => f.stage === currentStage);
  const currentFrame = stageFrames[currentFrameIndex];
  
  // Count A.C.E incorrect (for Support Lock: trigger only when same conceptual gap = 2+ wrong in A.C.E)
  const aceFrames = node.frames.filter(f => f.stage === 'ace');
  const aceIncorrectCount = aceFrames.filter(
    f => responses.get(f.id)?.isCorrect === false
  ).length;
  
  // Calculate frame-based progress (NOT mastery)
  const totalFrames = node.frames.length;
  const completedFrames = responses.size;
  const progressPercent = Math.round((completedFrames / Math.max(totalFrames, 1)) * 100);

  // Calculate stage progress
  const stageProgress = stageFrames.length > 0 
    ? Math.round(((currentFrameIndex + 1) / stageFrames.length) * 100)
    : 0;

  const handleAnswer = useCallback((answer: string | number) => {
    if (!currentFrame) return;

    const isCorrect = currentFrame.content.correctAnswer !== undefined
      ? currentFrame.content.correctAnswer === answer
      : true; // Content frames are always "correct"

    const response: FrameResponse = {
      frameId: currentFrame.id,
      userAnswer: answer,
      isCorrect,
      attemptCount: (responses.get(currentFrame.id)?.attemptCount ?? 0) + 1,
      timestamp: new Date().toISOString(),
    };

    setResponses(prev => {
      const next = new Map(prev).set(currentFrame.id, response);
      return next;
    });
    
    // A.C.E Support Lock: trigger only when conceptual gap (2+ wrong in A.C.E), at most once per session
    if (
      currentStage === 'ace' &&
      !isCorrect &&
      !supportLock.used &&
      ['mcq', 'numerical', 'error-detect', 'short-explain'].includes(currentFrame.type)
    ) {
      const nextResponses = new Map(responses).set(currentFrame.id, response);
      const wrongInAce = node.frames.filter(
        f => f.stage === 'ace' && nextResponses.get(f.id)?.isCorrect === false
      ).length;
      if (wrongInAce >= 2) {
        const { acknowledgment, reteachFrames, repairFrame } = buildSupportLockContent(
          currentFrame,
          Math.floor(Math.random() * SUPPORT_LOCK_ACKS.length)
        );
        setSupportLock({
          active: true,
          used: true,
          phase: 'acknowledgment',
          triggeredByFrameId: currentFrame.id,
          acknowledgment,
          reteachFrames,
          repairFrame,
          reteachIndex: 0,
          repairCorrect: null,
        });
      }
    }
    
    // Show result for assessment frames
    if (['mcq', 'numerical', 'error-detect', 'short-explain'].includes(currentFrame.type)) {
      setShowResult(true);
    }
  }, [currentFrame, currentStage, responses, supportLock.used, node.frames]);

  /** Silent unlock: resume A.C.E after successful repair (no announcement). */
  const advanceAfterRepair = useCallback(() => {
    setSupportLock(prev => ({ ...INIT_SUPPORT_LOCK, used: true, active: false }));
    setRepairResponse(null);
    setRepairShowResult(false);
    setShowResult(false);
    if (currentFrameIndex < stageFrames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    } else if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setCurrentFrameIndex(0);
    } else {
      // End of session
      const allResponses = Array.from(responses.values());
      const totalCorrect = allResponses.filter(r => r.isCorrect).length;
      const totalIncorrect = allResponses.filter(r => r.isCorrect === false).length;
      onComplete({
        nodeId: node.id,
        stage: 'exit',
        frameIndex: currentFrameIndex,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        responses: allResponses,
        totalCorrect,
        totalIncorrect,
        fatigueDetected: totalIncorrect >= 3,
        needsSupport: false,
      });
    }
  }, [currentFrameIndex, currentStageIndex, stageFrames.length, stages.length, node.id, responses, onComplete]);

  /** Exit A.C.E early and insert Support Node (repair failed). */
  const exitAceEarly = useCallback(() => {
    const allResponses = Array.from(responses.values());
    const totalCorrect = allResponses.filter(r => r.isCorrect).length;
    const totalIncorrect = allResponses.filter(r => r.isCorrect === false).length;
    onComplete({
      nodeId: node.id,
      stage: 'ace',
      frameIndex: currentFrameIndex,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      responses: allResponses,
      totalCorrect,
      totalIncorrect,
      fatigueDetected: totalIncorrect >= 3,
      needsSupport: true,
      exitEarlyFromAce: true,
    });
  }, [currentFrameIndex, node.id, responses, onComplete]);

  const handleNext = useCallback(() => {
    setShowResult(false);

    // Move to next frame in current stage
    if (currentFrameIndex < stageFrames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
      return;
    }

    // Move to next stage
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setCurrentFrameIndex(0);
      return;
    }

    // Complete the session – derive mastery and support signals
    const allResponses = Array.from(responses.values());
    const totalCorrect = allResponses.filter(r => r.isCorrect).length;
    const totalIncorrect = allResponses.filter(r => r.isCorrect === false).length;

    // Simple fatigue / struggle heuristics
    const totalAttempts = totalCorrect + totalIncorrect;
    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 1;
    const fatigueDetected = totalIncorrect >= 3;
    const needsSupport =
      totalIncorrect >= 2 &&
      totalIncorrect >= totalCorrect;

    const session: LearnEngineSession = {
      nodeId: node.id,
      stage: 'exit',
      frameIndex: currentFrameIndex,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      responses: allResponses,
      totalCorrect,
      totalIncorrect,
      fatigueDetected,
      needsSupport,
    };
    onComplete(session);
  }, [currentFrameIndex, currentStageIndex, stageFrames.length, stages.length, node.id, responses, onComplete]);

  const handlePrevious = useCallback(() => {
    setShowResult(false);

    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
      return;
    }

    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
      const prevStageFrames = node.frames.filter(f => f.stage === stages[currentStageIndex - 1]);
      setCurrentFrameIndex(prevStageFrames.length - 1);
    }
  }, [currentFrameIndex, currentStageIndex, node.frames, stages]);

  const canGoBack = currentFrameIndex > 0 || currentStageIndex > 0;
  const isLastFrame = currentStageIndex === stages.length - 1 && 
                      currentFrameIndex === stageFrames.length - 1;
  
  // Check if current frame needs an answer before proceeding
  const needsAnswer = ['mcq', 'numerical', 'error-detect', 'short-explain', 'recall'].includes(currentFrame?.type ?? '');
  const hasAnswered = currentFrame ? responses.has(currentFrame.id) : false;
  const canProceed = !needsAnswer || hasAnswered;

  /** Repair attempt answer: show result; user clicks Continue to silent unlock or exit early. */
  const handleRepairAnswer = useCallback((answer: string | number) => {
    if (!supportLock.repairFrame) return;
    const isCorrect = supportLock.repairFrame.content.correctAnswer !== undefined
      ? supportLock.repairFrame.content.correctAnswer === answer
      : true;
    const resp: FrameResponse = {
      frameId: supportLock.repairFrame.id,
      userAnswer: answer,
      isCorrect,
      attemptCount: 1,
      timestamp: new Date().toISOString(),
    };
    setRepairResponse(resp);
    setRepairShowResult(true);
  }, [supportLock.repairFrame]);

  if (!currentFrame && !supportLock.active) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No content available for this node.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // ——— A.C.E Support Lock flow (guidance, not punishment) ———
  if (supportLock.active) {
    const onLockContinue = () => {
      if (supportLock.phase === 'acknowledgment') {
        setSupportLock(prev => ({ ...prev, phase: 'micro-reteach' }));
        return;
      }
      if (supportLock.phase === 'micro-reteach') {
        if (supportLock.reteachIndex < supportLock.reteachFrames.length - 1) {
          setSupportLock(prev => ({ ...prev, reteachIndex: prev.reteachIndex + 1 }));
        } else {
          setSupportLock(prev => ({ ...prev, phase: 'repair-attempt' }));
        }
        return;
      }
    };

    const isRepairPhase = supportLock.phase === 'repair-attempt';
    const repairCorrect = repairResponse?.isCorrect === true;
    const repairWrong = repairResponse && !repairResponse.isCorrect;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="rounded-xl">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
        </div>
        <div className="space-y-2">
          <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
            {node.skillGoal}
          </span>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <StageProgress currentStage="ace" stages={stages} />
        <div className="text-center">
          <Badge className={cn(STAGE_COLORS.ace, 'text-white')}>
            A.C.E Assessment
          </Badge>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            One quick check — then we continue
          </p>
        </div>

        <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <CardContent className="p-6">
            {supportLock.phase === 'acknowledgment' && (
              <div className="space-y-4">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {supportLock.acknowledgment}
                </p>
                <Button onClick={onLockContinue} className="rounded-xl bg-purple-600 hover:bg-purple-700">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {supportLock.phase === 'micro-reteach' && supportLock.reteachFrames[supportLock.reteachIndex] && (
              <div className="space-y-4">
                <FrameContent
                  frame={supportLock.reteachFrames[supportLock.reteachIndex]}
                  onAnswer={() => {}}
                  showResult={false}
                  guidanceMode
                />
                <Button onClick={onLockContinue} className="rounded-xl bg-purple-600 hover:bg-purple-700">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {isRepairPhase && supportLock.repairFrame && (
              <div className="space-y-4">
                <FrameContent
                  frame={supportLock.repairFrame}
                  response={repairResponse ?? undefined}
                  onAnswer={handleRepairAnswer}
                  showResult={repairShowResult}
                  guidanceMode
                />
                {repairShowResult && (
                  <div className="flex justify-end gap-2 pt-2">
                    {repairCorrect && (
                      <Button onClick={advanceAfterRepair} className="rounded-xl bg-green-600 hover:bg-green-700">
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                    {repairWrong && (
                      <Button onClick={exitAceEarly} className="rounded-xl bg-slate-600 hover:bg-slate-700">
                        Continue — a helper step is unlocked for you
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-xl">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Exit
        </Button>
        <div className="flex items-center gap-2">
          {onPause && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setIsPaused(!isPaused);
                onPause();
              }}
              className="rounded-xl"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Overall progress – keep it soft, no numeric completion language */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {node.skillGoal}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Stage indicator */}
      <StageProgress currentStage={currentStage} stages={stages} />

      {/* Current stage label */}
      <div className="text-center">
        <Badge className={cn(STAGE_COLORS[currentStage], 'text-white')}>
          {STAGE_LABELS[currentStage]}
        </Badge>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Frame {currentFrameIndex + 1} of {stageFrames.length}
        </p>
      </div>

      {/* Frame content */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <FrameContent
            frame={currentFrame}
            response={responses.get(currentFrame.id)}
            onAnswer={handleAnswer}
            showResult={showResult}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoBack}
          className="rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {needsAnswer && !hasAnswered && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Answer to continue
            </span>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            'rounded-xl',
            isLastFrame 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-purple-600 hover:bg-purple-700'
          )}
        >
          {isLastFrame ? (
            <>
              Complete
              <CheckCircle className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default LearnEngine;
