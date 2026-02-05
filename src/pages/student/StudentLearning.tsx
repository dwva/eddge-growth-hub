import { useState, useCallback } from 'react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  FileText,
  Target,
  ChevronLeft,
} from 'lucide-react';
import {
  subjects,
  chapters,
  learningTopics,
  recentlyStudiedChapters,
} from '@/data/mockData';
import {
  LearningPath,
  LearnEngine,
  type LearningPathData,
  type LearningNodeData,
  type LearnEngineSession,
} from '@/components/learn-engine';
import {
  getLearningPathForTopic,
  updateNodeStatus,
  learningPaths,
  type NodeOutcome,
} from '@/data/learningNodes';

type ViewMode = 'curriculum' | 'pathway' | 'engine';

const StudentLearning = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('curriculum');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Learning path state
  const [currentPath, setCurrentPath] = useState<LearningPathData | null>(null);
  const [activeNode, setActiveNode] = useState<LearningNodeData | null>(null);
  const [lastNodeFeedback, setLastNodeFeedback] = useState<{
    message: string;
    tone: 'safe' | 'nudge' | 'strong';
  } | null>(null);

  const chapterList = selectedSubjectId ? (chapters[selectedSubjectId as keyof typeof chapters] ?? []) : [];
  const topicKey = selectedSubjectId && selectedChapterId ? `${selectedSubjectId}-${selectedChapterId}` : '';
  const topicList = topicKey ? (learningTopics[topicKey] ?? []) : [];
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedChapter = chapterList.find((c: { id: string }) => c.id === selectedChapterId);
  const selectedTopic = topicList.find((t) => t.id === selectedTopicId);

  // Handle topic selection - load learning path
  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    const path = getLearningPathForTopic(topicId);
    if (path) {
      setCurrentPath(path);
      setViewMode('pathway');
    }
  }, []);

  // Handle node click on the path
  const handleNodeClick = useCallback((node: LearningNodeData) => {
    if (node.status === 'locked') return;
    
    setActiveNode(node);
    setViewMode('engine');
  }, []);

  // Handle engine completion – derive mastery and support signals
  const handleEngineComplete = useCallback(
    (session: LearnEngineSession) => {
      if (!currentPath || !activeNode) return;

      const totalAttempts =
        session.totalCorrect + session.totalIncorrect || 1;
      const accuracy = session.totalCorrect / totalAttempts;
      const confidenceScore = Math.round(accuracy * 100);

      const partial = accuracy < 0.8;

      const outcome: NodeOutcome = {
        completed: true,
        partial,
        needsSupport: session.needsSupport,
        confidenceScore,
      };

      // Generate a calm confidence message for the student
      let feedback: { message: string; tone: 'safe' | 'nudge' | 'strong' };
      if (session.needsSupport) {
        feedback = {
          tone: 'safe',
          message: 'One small thing to fix here. A quick helper step has been unlocked for you.',
        };
      } else if (accuracy >= 0.85) {
        feedback = {
          tone: 'strong',
          message: "You’re exam-ready on this skill. Great work.",
        };
      } else if (accuracy >= 0.5) {
        feedback = {
          tone: 'nudge',
          message: "You’re getting this. One more short practice step will lock it in.",
        };
      } else {
        feedback = {
          tone: 'safe',
          message: "Let’s try a gentler angle on this skill before we move ahead.",
        };
      }

      const updatedPath = updateNodeStatus(currentPath, activeNode.id, outcome);
      setCurrentPath(updatedPath);
      setLastNodeFeedback(feedback);

      // Return to pathway view
      setActiveNode(null);
      setViewMode('pathway');
    },
    [currentPath, activeNode]
  );

  // Back navigation
  const handleBackToCurriculum = useCallback(() => {
    setViewMode('curriculum');
    setCurrentPath(null);
    setActiveNode(null);
    setLastNodeFeedback(null);
  }, []);

  const handleBackToPath = useCallback(() => {
    setViewMode('pathway');
    setActiveNode(null);
  }, []);

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

              {/* Column 3 – Topics */}
              <Card className="rounded-2xl border border-gray-200 dark:border-border shadow-sm flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1 min-h-0">
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
                    <>
                      <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
                        {topicList.map((topic) => {
                          const diffClass =
                            topic.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                              : topic.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                                : topic.difficulty === 'hard'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                  : '';
                          
                          // Check if this topic has a learning path
                          const hasPath = !!learningPaths[topic.id];
                          
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => handleTopicSelect(topic.id)}
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
                                {hasPath && (
                                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                                    5 skills
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
                    </>
                  )}
                </CardContent>
              </Card>
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

        {/* Learning Path View – full-size widget */}
        {viewMode === 'pathway' && currentPath && selectedTopic && selectedChapter && selectedSubject && (
          <div className="flex flex-col min-h-[calc(100vh-11rem)] gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
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

            {lastNodeFeedback && (
              <Card className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 flex-shrink-0">
                <CardContent className="py-3 px-4 text-sm text-purple-900 dark:text-purple-100">
                  {lastNodeFeedback.message}
                </CardContent>
              </Card>
            )}

            <div className="flex-1 min-h-0 flex flex-col">
              <LearningPath 
                path={currentPath}
                onNodeClick={handleNodeClick}
                emotionalMessage={lastNodeFeedback?.message}
              />
            </div>
          </div>
        )}

        {/* Learn Engine View - Inside Node */}
        {viewMode === 'engine' && activeNode && currentPath && (
          <LearnEngine
            node={activeNode}
            onComplete={handleEngineComplete}
            onBack={handleBackToPath}
          />
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentLearning;
