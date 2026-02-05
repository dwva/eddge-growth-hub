// EDDGE Learn Engine Types
// Candy-Crush Path + Frame-Based Mastery System

export type LearningNodeType = 
  | 'core'       // Core Learning Node (Blue) - Main learning node, runs full Learn Engine
  | 'concept'    // Concept-Heavy Node (Book) - More Concept frames, lighter A.C.E
  | 'practice'   // Practice Node (Dumbbell) - A.C.E focused, no concept teaching
  | 'mastery'    // Mastery/Exam Node (Star) - Mixed exam-level questions
  | 'support'    // Support/Rescue Node (Character) - Triggered dynamically for struggling students
  | 'reward';    // Reward/Gate Node (Chest) - Unlocks next topic/revision set

export type NodeStatus = 
  | 'locked'     // Not yet available
  | 'available'  // Can be started
  | 'active'     // Currently in progress
  | 'partial'    // Completed with needs reinforcement
  | 'completed'  // Successfully completed
  | 'skipped';   // Auto-completed by strong students

export type EngineStage = 'foundation' | 'concept' | 'ace' | 'exit';

export type FrameType = 
  // Foundation frames
  | 'what'           // Explain what the topic is
  | 'why-real'       // Why it matters in real life
  | 'why-exam'       // Exam importance
  | 'curiosity'      // Trigger curiosity
  // Concept frames
  | 'definition'     // Definition
  | 'example'        // Example
  | 'diagram'        // Visual diagram
  | 'equation'       // Equations/formulas
  | 'derivation'     // Derivations
  | 'intuition'      // Build intuition
  // A.C.E frames
  | 'mcq'            // Multiple choice
  | 'numerical'      // Numerical answer
  | 'error-detect'   // Error detection
  | 'short-explain'  // Short explanation
  // Support Lock (A.C.E soft lock)
  | 'ace-ack'        // Friendly acknowledgment only
  | 'ace-reteach'    // Micro re-teach (1–2 frames)
  | 'ace-repair'     // Repair attempt question
  // Exit frames
  | 'takeaway'       // Key takeaways
  | 'formulas'       // Important formulas
  | 'mistakes'       // Common mistakes
  | 'recall';        // One-step recall prompt

export interface LearningFrame {
  id: string;
  type: FrameType;
  stage: EngineStage;
  content: {
    title?: string;
    body?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number | string;
    hint?: string;
    explanation?: string;
    imageUrl?: string;
    formula?: string;
  };
  order: number;
}

export interface LearningNode {
  id: string;
  topicId: string;
  skillGoal: string;           // One atomic learning skill
  type: LearningNodeType;
  status: NodeStatus;
  order: number;               // Position on the path
  
  // Progress tracking
  currentStage?: EngineStage;
  currentFrameIndex?: number;
  totalFrames: number;
  completedFrames: number;
  
  // Adaptive signals
  errorCount?: number;
  sameErrorCount?: number;     // For triggering support node
  responseTimeAvg?: number;    // For fatigue detection
  confidenceScore?: number;    // 0-100
  
  // Dependencies
  prerequisiteNodeIds?: string[];
  
  // Learning content
  frames: LearningFrame[];
}

export interface LearningPath {
  id: string;
  topicId: string;
  topicName: string;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  subjectName: string;
  
  nodes: LearningNode[];
  currentNodeId?: string;
  completedNodeCount: number;
  totalNodeCount: number;
  
  // Path-level metrics
  masteryScore?: number;       // Overall mastery 0-100
  lastAccessedAt?: string;
}

/** A.C.E Support Lock: at most one per concept; guidance, not punishment */
export type SupportLockPhase =
  | 'acknowledgment'   // Step 1: friendly acknowledgment
  | 'micro-reteach'    // Step 2: 1–2 repair frames
  | 'repair-attempt'; // Step 3: one closely related question

/** Correction tone for Support Lock (personalization) */
export type CorrectionPreference =
  | 'GENTLE_GUIDE'    // Softer language, guided hints
  | 'DIRECT_CORRECT'  // Clear mistake ID, brief explanation, retry
  | 'CHALLENGE_MODE'; // Minimal explanation, sharp focus

export interface LearnEngineSession {
  nodeId: string;
  stage: EngineStage;
  frameIndex: number;
  
  // Session state
  startedAt: string;
  pausedAt?: string;
  completedAt?: string;
  
  // Responses and metrics
  responses: FrameResponse[];
  totalCorrect: number;
  totalIncorrect: number;
  
  // Adaptive state
  fatigueDetected: boolean;
  needsSupport: boolean;
  
  /** True when A.C.E was exited early after failed repair (insert Support Node) */
  exitEarlyFromAce?: boolean;
}

export interface FrameResponse {
  frameId: string;
  userAnswer?: string | number;
  isCorrect?: boolean;
  responseTimeMs?: number;
  attemptCount: number;
  timestamp: string;
}

// Engine stage configurations
export const STAGE_CONFIG = {
  foundation: {
    frameCount: 4,
    maxDurationSeconds: 60,
    allowedFrameTypes: ['what', 'why-real', 'why-exam', 'curiosity'] as FrameType[],
  },
  concept: {
    frameCount: { min: 15, max: 20 },
    allowedFrameTypes: ['definition', 'example', 'diagram', 'equation', 'derivation', 'intuition'] as FrameType[],
  },
  ace: {
    frameCount: 15,
    allowedFrameTypes: ['mcq', 'numerical', 'error-detect', 'short-explain'] as FrameType[],
    requireNonMcq: true,
  },
  exit: {
    frameCount: { min: 2, max: 3 },
    allowedFrameTypes: ['takeaway', 'formulas', 'mistakes', 'recall'] as FrameType[],
  },
} as const;

// Node type icon mapping
export const NODE_ICONS = {
  core: 'BookOpen',      // Main learning
  concept: 'BookText',   // Concept-heavy
  practice: 'Dumbbell',  // Practice focused
  mastery: 'Star',       // Exam/mastery
  support: 'LifeBuoy',   // Support/rescue
  reward: 'Gift',        // Reward/gate
} as const;

// Node type colors
export const NODE_COLORS = {
  core: {
    bg: 'bg-blue-500',
    ring: 'ring-blue-400',
    text: 'text-blue-600',
  },
  concept: {
    bg: 'bg-indigo-500',
    ring: 'ring-indigo-400',
    text: 'text-indigo-600',
  },
  practice: {
    bg: 'bg-orange-500',
    ring: 'ring-orange-400',
    text: 'text-orange-600',
  },
  mastery: {
    bg: 'bg-amber-500',
    ring: 'ring-amber-400',
    text: 'text-amber-600',
  },
  support: {
    bg: 'bg-purple-500',
    ring: 'ring-purple-400',
    text: 'text-purple-600',
  },
  reward: {
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-400',
    text: 'text-emerald-600',
  },
} as const;

// Status colors for nodes
export const STATUS_COLORS = {
  locked: {
    bg: 'bg-gray-300 dark:bg-gray-600',
    ring: 'ring-gray-300 dark:ring-gray-500',
    opacity: 'opacity-50',
  },
  available: {
    bg: 'bg-white dark:bg-gray-800',
    ring: 'ring-2 ring-purple-400',
    border: 'border-2 border-purple-400',
  },
  active: {
    bg: 'bg-purple-500',
    ring: 'ring-4 ring-purple-300',
    animate: 'animate-pulse',
  },
  partial: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    ring: 'ring-2 ring-yellow-400',
  },
  completed: {
    bg: 'bg-green-500',
    ring: 'ring-2 ring-green-400',
  },
  skipped: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    ring: 'ring-2 ring-blue-400',
  },
} as const;
