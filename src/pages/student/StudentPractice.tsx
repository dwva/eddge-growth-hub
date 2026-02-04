import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { practiceQuestions } from '@/data/mockData';

type PyqPracticeState = {
  fromPyq?: boolean;
  paperId?: string;
  mode?: 'full' | 'mcq' | 'case-study' | 'long-answer';
};

const MODE_LABELS: Record<string, string> = {
  full: 'Full Paper (Exam Mode)',
  mcq: 'MCQs',
  'case-study': 'Case Study',
  'long-answer': 'Long Answer',
};

const StudentPractice = () => {
  const location = useLocation();
  const pyqState = (location.state as PyqPracticeState) || {};
  const { fromPyq, mode } = pyqState;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = practiceQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  const handleAnswer = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setAnswered(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <StudentDashboardLayout title="Practice">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* PYQ context banner when opened from Previous Year Papers */}
        {fromPyq && mode && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  PYQ Practice · {MODE_LABELS[mode] ?? mode}
                </p>
                <p className="text-xs text-muted-foreground">
                  Answer the questions below. Your progress is saved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {practiceQuestions.length}
          </p>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>

        {/* Question Card */}
        <Card>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-4">{question.subject}</Badge>
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answered
                      ? index === question.correct
                        ? 'border-primary bg-primary/10'
                        : index === selectedAnswer
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border'
                      : selectedAnswer === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answered && index === question.correct && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                    {answered && index === selectedAnswer && index !== question.correct && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {answered && (
              <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                <p className={`font-semibold ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
                  {isCorrect ? '🎉 Correct! Well done!' : '😊 Not quite right, but keep trying!'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground mt-1">
                    The correct answer is: {question.options[question.correct]}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                disabled={answered}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              {answered && (
                <Button onClick={nextQuestion}>
                  Next Question
                </Button>
              )}
            </div>

            {/* Hint */}
            {showHint && !answered && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  {question.hint}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentPractice;