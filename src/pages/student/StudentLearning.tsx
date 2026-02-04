import { useState } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  FileText,
  Target,
  Zap,
  Play,
  ChevronLeft,
  CheckCircle,
  Lock,
} from 'lucide-react';
import {
  subjects,
  chapters,
  learningTopics,
  learningStages,
  recentlyStudiedChapters,
} from '@/data/mockData';

type ViewMode = 'curriculum' | 'pathway' | 'stage';

const StudentLearning = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('curriculum');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [openStageId, setOpenStageId] = useState<string | null>(null);

  const chapterList = selectedSubjectId ? (chapters[selectedSubjectId as keyof typeof chapters] ?? []) : [];
  const topicKey = selectedSubjectId && selectedChapterId ? `${selectedSubjectId}-${selectedChapterId}` : '';
  const topicList = topicKey ? (learningTopics[topicKey] ?? []) : [];
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedChapter = chapterList.find((c: { id: string }) => c.id === selectedChapterId);
  const selectedTopic = topicList.find((t) => t.id === selectedTopicId);

  const handleStartLearning = () => {
    setCompletedStages([]);
    setOpenStageId(null);
    setViewMode('pathway');
  };

  const handleBackToCurriculum = () => {
    setViewMode('curriculum');
    setOpenStageId(null);
  };

  const handleBackToStages = () => {
    setOpenStageId(null);
  };

  const getStageStatus = (stageId: string, index: number) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (openStageId === stageId) return 'current';
    if (index === 0) return 'available';
    if (completedStages.includes(learningStages[index - 1].id)) return 'available';
    return 'locked';
  };

  const completeStage = (stageId: string) => {
    setCompletedStages((prev) => (prev.includes(stageId) ? prev : [...prev, stageId]));
    setOpenStageId(null);
  };

  const markTopicComplete = () => {
    setViewMode('curriculum');
    setSelectedTopicId(null);
    setOpenStageId(null);
    setCompletedStages([]);
  };

  const allStagesCompleted = learningStages.every((s) => completedStages.includes(s.id));

  return (
    <StudentDashboardLayout title="Learn">
      <div className="w-full space-y-6">
        {/* Curriculum selector */}
        {viewMode === 'curriculum' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1 – Subjects */}
              <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Subjects
                  </h3>
                  {subjects.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 dark:text-muted-foreground">
                      <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No subjects available...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {subjects.map((subject) => (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubjectId(selectedSubjectId === subject.id ? null : subject.id);
                            setSelectedChapterId(null);
                            setSelectedTopicId(null);
                          }}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            selectedSubjectId === subject.id
                              ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
                              : 'border-gray-200 dark:border-border hover:bg-gray-100/50 dark:hover:bg-muted/50'
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-foreground">{subject.name}</p>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            {subject.chapters} chapters
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Column 2 – Chapters */}
              <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Chapters
                  </h3>
                  {!selectedSubjectId ? (
                    <p className="py-8 text-center text-sm text-gray-500 dark:text-muted-foreground">
                      Select a subject first
                    </p>
                  ) : chapterList.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500 dark:text-muted-foreground">
                      No chapters available for this subject
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {chapterList.map((chapter: { id: string; name: string; concepts: number }) => (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => {
                            setSelectedChapterId(selectedChapterId === chapter.id ? null : chapter.id);
                            setSelectedTopicId(null);
                          }}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            selectedChapterId === chapter.id
                              ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
                              : 'border-gray-200 dark:border-border hover:bg-gray-100/50 dark:hover:bg-muted/50'
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-foreground">{chapter.name}</p>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            {chapter.concepts} topics
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Column 3 – Topics + Action */}
              <div className="space-y-4">
                <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Topics
                    </h3>
                    {!selectedChapterId ? (
                      <p className="py-6 text-center text-sm text-gray-500 dark:text-muted-foreground">
                        Select a chapter first
                      </p>
                    ) : !selectedSubjectId ? (
                      <p className="py-6 text-center text-sm text-gray-500 dark:text-muted-foreground">
                        Select a subject first
                      </p>
                    ) : topicList.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500 dark:text-muted-foreground">
                        No topics available...
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {topicList.map((topic) => {
                          const diffClass =
                            topic.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                              : topic.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                                : topic.difficulty === 'hard'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                  : '';
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() =>
                                setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id)
                              }
                              className={`w-full p-4 rounded-lg border text-left transition-all ${
                                selectedTopicId === topic.id
                                  ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
                                  : 'border-gray-200 dark:border-border hover:bg-gray-100/50 dark:hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-gray-900 dark:text-foreground">
                                  {topic.name}
                                </p>
                                {topic.difficulty && (
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${diffClass}`}
                                  >
                                    {topic.difficulty}
                                  </Badge>
                                )}
                              </div>
                              {topic.description && (
                                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                                  {topic.description}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                      <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Action
                    </h3>
                    {selectedSubject && selectedChapter && selectedTopic ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-500/5 dark:bg-purple-500/10 rounded-lg border border-purple-500/10">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Selected Topic:</span>{' '}
                            {selectedTopic.name} in {selectedChapter.name} from {selectedSubject.name}
                          </p>
                        </div>
                        <Button
                          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90"
                          onClick={handleStartLearning}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning Pathway
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500 dark:text-muted-foreground">
                        <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select a topic to begin learning</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recently studied */}
            <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm mt-6">
              <CardContent className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Recently Studied Chapters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {recentlyStudiedChapters.map((item) => (
                    <button
                      key={`${item.chapterId}-${item.subjectName}`}
                      type="button"
                      className="p-4 border border-gray-200 dark:border-border rounded-lg hover:bg-gray-100/50 dark:hover:bg-muted/50 text-left transition-all cursor-pointer"
                    >
                      <p className="font-medium text-gray-900 dark:text-foreground">{item.chapterName}</p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                        {item.subjectName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Progress</p>
                      <Progress value={item.progress} className="h-2 mt-1" />
                      <p className="text-xs text-gray-500 dark:text-muted-foreground mt-2">
                        {item.topicsCompleted}/{item.topicsTotal} topics · Last studied {item.lastStudied}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Learning pathway – stage overview */}
        {viewMode === 'pathway' && !openStageId && selectedTopic && selectedChapter && selectedSubject && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handleBackToCurriculum}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Back to Curriculum</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-foreground">
                {selectedTopic.name}
              </h2>
              <p className="text-gray-500 dark:text-muted-foreground mt-1">
                {selectedChapter.name} · {selectedSubject.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1">
                You are learning this topic step by step
              </p>
            </div>

            <div className="space-y-6">
              {learningStages.map((stage, index) => {
                const status = getStageStatus(stage.id, index);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const isAvailable = status === 'available' || status === 'current';

                return (
                  <Card
                    key={stage.id}
                    className={`rounded-2xl border-l-4 transition-all ${
                      isLocked
                        ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 opacity-60'
                        : isCompleted
                          ? 'border-green-500 bg-green-50/30 dark:bg-green-950/20'
                          : 'border-purple-500 bg-card'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isLocked
                              ? 'bg-gray-400 dark:bg-gray-600'
                              : isCompleted
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-8 h-8 text-white" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                          ) : (
                            <BookOpen className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={
                                isLocked
                                  ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  : isCompleted
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              }
                            >
                              Stage {index + 1}
                            </Badge>
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mt-1">
                            {stage.letter}. {stage.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            {stage.description}
                          </p>
                          {isLocked && (
                            <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">
                              Complete Stage {index} to unlock…
                            </p>
                          )}
                          <div className="mt-3">
                            {isLocked && (
                              <Button disabled className="rounded-xl" variant="secondary">
                                Locked
                              </Button>
                            )}
                            {isAvailable && (
                              <Button
                                className="rounded-xl bg-purple-600 hover:bg-purple-700"
                                onClick={() => setOpenStageId(stage.id)}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {index === 0 ? 'Start Foundation' : `Start ${stage.name}`}
                              </Button>
                            )}
                            {isCompleted && (
                              <Button
                                variant="outline"
                                className="rounded-xl border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                                onClick={() => setOpenStageId(stage.id)}
                              >
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {allStagesCompleted && (
              <div className="flex justify-center pt-4">
                <Button
                  className="rounded-xl bg-green-600 hover:bg-green-700"
                  onClick={markTopicComplete}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Topic as Complete
                </Button>
              </div>
            )}
          </>
        )}

        {/* Stage content view */}
        {viewMode === 'pathway' && openStageId && selectedTopic && selectedChapter && selectedSubject && (
          <StageContentView
            stageId={openStageId}
            stage={learningStages.find((s) => s.id === openStageId)!}
            topicName={selectedTopic.name}
            chapterName={selectedChapter.name}
            subjectName={selectedSubject.name}
            onBack={handleBackToStages}
            onComplete={() => completeStage(openStageId)}
          />
        )}
      </div>
    </StudentDashboardLayout>
  );
};

function StageContentView({
  stageId,
  stage,
  topicName,
  chapterName,
  subjectName,
  onBack,
  onComplete,
}: {
  stageId: string;
  stage: { id: string; letter: string; name: string; description: string };
  topicName: string;
  chapterName: string;
  subjectName: string;
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="rounded-xl">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-foreground">
            {stage.letter}. {stage.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            {topicName} · {chapterName} · {subjectName}
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border border-gray-200 dark:border-border">
        <CardContent className="p-6">
          {stageId === 'foundation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Why this topic matters
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                This topic forms the foundation for understanding more advanced concepts. Mastering it will help you in exams and real-world applications.
              </p>
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                Take your time to read through the overview. Click Continue when you are ready to move to the next stage.
              </p>
            </div>
          )}
          {stageId === 'deep' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Core concepts
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Here you will learn the main ideas step by step. Read each section carefully and use the examples to reinforce your understanding.
              </p>
              <div className="rounded-xl bg-gray-50 dark:bg-muted/50 p-4 text-sm">
                <p className="font-medium text-gray-800 dark:text-foreground mb-2">Key points</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Definition and key terms</li>
                  <li>Formulas and methods</li>
                  <li>Worked examples</li>
                </ul>
              </div>
            </div>
          )}
          {stageId === 'concept' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Concept anchoring
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Practice applying what you have learned. Short exercises will help anchor the concepts.
              </p>
            </div>
          )}
          {stageId === 'micro' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Micro check
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Quick checkpoints to validate your learning. Answer the following to confirm understanding.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-border">
            <Button onClick={onComplete} className="rounded-xl bg-purple-600 hover:bg-purple-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark stage complete and continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentLearning;
