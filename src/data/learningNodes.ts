// EDDGE Learn Engine Mock Data
// Learning Nodes and Paths for the Candy-Crush style learning system

import type {
  LearningNode,
  LearningPath,
  LearningFrame,
} from '@/components/learn-engine/types';

// Helper to generate frames for a topic
function generateFramesForNode(
  nodeId: string,
  skillGoal: string,
  nodeType: 'core' | 'concept' | 'practice' | 'mastery'
): LearningFrame[] {
  const frames: LearningFrame[] = [];
  let order = 0;

  // Foundation frames (4 frames, ~60 seconds)
  if (nodeType !== 'practice') {
    frames.push(
      {
        id: `${nodeId}-f1`,
        type: 'what',
        stage: 'foundation',
        order: order++,
        content: {
          title: `What is ${skillGoal}?`,
          body: `${skillGoal} is a fundamental concept that forms the building block for understanding more advanced topics. It helps you understand how mathematical or scientific principles work in the real world.`,
        },
      },
      {
        id: `${nodeId}-f2`,
        type: 'why-real',
        stage: 'foundation',
        order: order++,
        content: {
          title: 'Why does this matter in real life?',
          body: 'This concept appears in everyday situations - from calculating shopping discounts to understanding how machines work. Professionals in engineering, science, and technology use these principles daily.',
        },
      },
      {
        id: `${nodeId}-f3`,
        type: 'why-exam',
        stage: 'foundation',
        order: order++,
        content: {
          title: 'Exam Importance',
          body: 'This topic carries significant weightage in CBSE board exams. Questions from this section appear regularly and are often scoring if you understand the fundamentals well.',
        },
      },
      {
        id: `${nodeId}-f4`,
        type: 'curiosity',
        stage: 'foundation',
        order: order++,
        content: {
          title: 'Did you know?',
          body: 'The principles behind this concept were discovered centuries ago but are still used in modern technology. Can you think of how this might apply to your smartphone or computer?',
        },
      }
    );
  }

  // Concept frames (15-20 frames for core/concept, fewer for others)
  if (nodeType === 'core' || nodeType === 'concept') {
    frames.push(
      {
        id: `${nodeId}-c1`,
        type: 'definition',
        stage: 'concept',
        order: order++,
        content: {
          title: 'Definition',
          body: `${skillGoal} can be formally defined as a mathematical/scientific relationship that describes how quantities relate to each other. Understanding this definition is key to solving problems.`,
        },
      },
      {
        id: `${nodeId}-c2`,
        type: 'example',
        stage: 'concept',
        order: order++,
        content: {
          title: 'Example 1: Basic Application',
          body: 'Consider a simple scenario where we need to apply this concept. If we have values A and B, we can use the principle to find the relationship between them.',
        },
      },
      {
        id: `${nodeId}-c3`,
        type: 'equation',
        stage: 'concept',
        order: order++,
        content: {
          title: 'Key Formula',
          body: 'The fundamental equation that governs this concept is:',
          formula: 'Result = Operation(Input₁, Input₂)',
        },
      },
      {
        id: `${nodeId}-c4`,
        type: 'intuition',
        stage: 'concept',
        order: order++,
        content: {
          title: 'Building Intuition',
          body: 'Think of this concept like building blocks. Each piece fits together in a specific way. When you change one piece, it affects how the others connect. This intuition will help you solve complex problems.',
        },
      },
      {
        id: `${nodeId}-c5`,
        type: 'example',
        stage: 'concept',
        order: order++,
        content: {
          title: 'Example 2: Advanced Application',
          body: 'Now let\'s look at a more complex scenario. Here, we combine multiple concepts to solve a real-world problem step by step.',
        },
      }
    );
  }

  // A.C.E frames (Assessment → Correct → Elevate)
  frames.push(
    {
      id: `${nodeId}-a1`,
      type: 'mcq',
      stage: 'ace',
      order: order++,
      content: {
        question: `Which of the following best describes ${skillGoal}?`,
        options: [
          'A relationship between two or more quantities',
          'A single fixed value',
          'A random occurrence',
          'None of the above',
        ],
        correctAnswer: 0,
        hint: 'Think about what we learned in the definition section.',
        explanation: 'The correct answer describes the fundamental nature of this concept as a relationship between quantities.',
      },
    },
    {
      id: `${nodeId}-a2`,
      type: 'mcq',
      stage: 'ace',
      order: order++,
      content: {
        question: 'If we apply this concept with input values 5 and 3, what principle should we follow?',
        options: [
          'Always add the values first',
          'Apply the operation according to the formula',
          'Ignore one of the values',
          'The order doesn\'t matter',
        ],
        correctAnswer: 1,
        hint: 'Remember the key formula we discussed.',
        explanation: 'We must always apply the operation according to the established formula to get correct results.',
      },
    },
    {
      id: `${nodeId}-a3`,
      type: 'numerical',
      stage: 'ace',
      order: order++,
      content: {
        question: 'Using the concept you learned, if the initial value is 10 and we need to find the result after applying the standard operation, what do you get? Show your working.',
        hint: 'Apply the formula step by step.',
      },
    },
    {
      id: `${nodeId}-a4`,
      type: 'short-explain',
      stage: 'ace',
      order: order++,
      content: {
        question: `In your own words, explain why ${skillGoal} is important for solving real-world problems. Give one example.`,
        hint: 'Think about the real-life applications we discussed.',
      },
    }
  );

  // Exit frames (2-3 frames)
  frames.push(
    {
      id: `${nodeId}-e1`,
      type: 'takeaway',
      stage: 'exit',
      order: order++,
      content: {
        title: 'Key Takeaways',
        body: `You've learned the fundamentals of ${skillGoal}. Remember:\n\n• It describes relationships between quantities\n• The formula helps us calculate precise results\n• Real-world applications are everywhere\n• Practice is key to mastery`,
      },
    },
    {
      id: `${nodeId}-e2`,
      type: 'formulas',
      stage: 'exit',
      order: order++,
      content: {
        title: 'Formulas to Remember',
        body: 'Keep these formulas handy for quick reference:',
        formula: 'Result = Operation(Input₁, Input₂)\nVariant = Modified_Operation(Result)',
      },
    },
    {
      id: `${nodeId}-e3`,
      type: 'mistakes',
      stage: 'exit',
      order: order++,
      content: {
        title: 'Common Mistakes to Avoid',
        body: '• Don\'t forget to check your units\n• Remember the order of operations\n• Always verify your answer makes sense\n• Watch out for negative values',
      },
    }
  );

  return frames;
}

// Create nodes for a topic – includes a support node that can be unlocked dynamically
function createNodesForTopic(
  topicId: string,
  topicName: string
): LearningNode[] {
  const nodes: LearningNode[] = [];

  // Node 1: Foundation concept (Core)
  nodes.push({
    id: `${topicId}-n1`,
    topicId,
    skillGoal: `Understand ${topicName} basics`,
    type: 'core',
    status: 'available',
    order: 0,
    totalFrames: 16,
    completedFrames: 0,
    frames: generateFramesForNode(`${topicId}-n1`, `${topicName} basics`, 'core'),
  });

  // Node 2: Deep concept (Concept-heavy)
  nodes.push({
    id: `${topicId}-n2`,
    topicId,
    skillGoal: `${topicName} formulas in action`,
    type: 'concept',
    status: 'locked',
    order: 1,
    totalFrames: 16,
    completedFrames: 0,
    prerequisiteNodeIds: [`${topicId}-n1`],
    frames: generateFramesForNode(`${topicId}-n2`, `${topicName} formulas`, 'concept'),
  });

  // Node 3: Support / Rescue node (initially locked, unlocked on struggle)
  nodes.push({
    id: `${topicId}-n3-support`,
    topicId,
    skillGoal: `Quick rescue for ${topicName}`,
    type: 'support',
    status: 'locked',
    order: 2,
    totalFrames: 8,
    completedFrames: 0,
    // Can be triggered after either core or concept node if the student struggles
    prerequisiteNodeIds: [`${topicId}-n1`, `${topicId}-n2`],
    frames: generateFramesForNode(`${topicId}-n3-support`, `${topicName} helper`, 'concept'),
  });

  // Node 4: Practice (Practice-focused)
  nodes.push({
    id: `${topicId}-n4`,
    topicId,
    skillGoal: `Apply ${topicName} in problems`,
    type: 'practice',
    status: 'locked',
    order: 3,
    totalFrames: 8,
    completedFrames: 0,
    prerequisiteNodeIds: [`${topicId}-n2`, `${topicId}-n3-support`],
    frames: generateFramesForNode(`${topicId}-n4`, `${topicName} problems`, 'practice'),
  });

  // Node 5: Mastery check (Mastery)
  nodes.push({
    id: `${topicId}-n5`,
    topicId,
    skillGoal: `Exam-level ${topicName}`,
    type: 'mastery',
    status: 'locked',
    order: 4,
    totalFrames: 10,
    completedFrames: 0,
    prerequisiteNodeIds: [`${topicId}-n4`],
    frames: generateFramesForNode(`${topicId}-n5`, `${topicName} mastery`, 'mastery'),
  });

  // Node 6: Reward gate – only unlocks after strong mastery
  nodes.push({
    id: `${topicId}-n6`,
    topicId,
    skillGoal: 'Unlock Next Topic',
    type: 'reward',
    status: 'locked',
    order: 5,
    totalFrames: 1,
    completedFrames: 0,
    prerequisiteNodeIds: [`${topicId}-n5`],
    frames: [{
      id: `${topicId}-n6-r1`,
      type: 'takeaway',
      stage: 'exit',
      order: 0,
      content: {
        title: 'Congratulations!',
        body: `You've mastered ${topicName}! You can now move on to the next topic.`,
      },
    }],
  });

  return nodes;
}

// Learning paths by topic
export const learningPaths: Record<string, LearningPath> = {
  // Linear Expressions (Mathematics - Algebra Basics)
  't1': {
    id: 'path-t1',
    topicId: 't1',
    topicName: 'Linear Expressions',
    chapterId: 'c1',
    chapterName: 'Algebra Basics',
    subjectId: '1',
    subjectName: 'Mathematics',
    nodes: createNodesForTopic('t1', 'Linear Expressions'),
    currentNodeId: 't1-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },
  
  // Factorization (Mathematics - Algebra Basics)
  't2': {
    id: 'path-t2',
    topicId: 't2',
    topicName: 'Factorization',
    chapterId: 'c1',
    chapterName: 'Algebra Basics',
    subjectId: '1',
    subjectName: 'Mathematics',
    nodes: createNodesForTopic('t2', 'Factorization'),
    currentNodeId: 't2-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },

  // One Variable Equations (Mathematics - Linear Equations)
  't3': {
    id: 'path-t3',
    topicId: 't3',
    topicName: 'One Variable Equations',
    chapterId: 'c2',
    chapterName: 'Linear Equations',
    subjectId: '1',
    subjectName: 'Mathematics',
    nodes: createNodesForTopic('t3', 'One Variable Equations'),
    currentNodeId: 't3-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },

  // Word Problems (Mathematics - Linear Equations)
  't4': {
    id: 'path-t4',
    topicId: 't4',
    topicName: 'Word Problems',
    chapterId: 'c2',
    chapterName: 'Linear Equations',
    subjectId: '1',
    subjectName: 'Mathematics',
    nodes: createNodesForTopic('t4', 'Word Problems'),
    currentNodeId: 't4-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },

  // Newton's Laws (Science - Force and Motion)
  't11': {
    id: 'path-t11',
    topicId: 't11',
    topicName: "Newton's Laws",
    chapterId: 'c2',
    chapterName: 'Force and Motion',
    subjectId: '2',
    subjectName: 'Science',
    nodes: createNodesForTopic('t11', "Newton's Laws"),
    currentNodeId: 't11-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },

  // Friction and Motion (Science - Force and Motion)
  't12': {
    id: 'path-t12',
    topicId: 't12',
    topicName: 'Friction and Motion',
    chapterId: 'c2',
    chapterName: 'Force and Motion',
    subjectId: '2',
    subjectName: 'Science',
    nodes: createNodesForTopic('t12', 'Friction and Motion'),
    currentNodeId: 't12-n1',
    completedNodeCount: 0,
    totalNodeCount: 6,
    masteryScore: 0,
  },
};

// Helper function to get learning path for a topic
export function getLearningPathForTopic(topicId: string): LearningPath | undefined {
  return learningPaths[topicId];
}

// Outcome of a Learn Engine run used to drive unlocking logic
export interface NodeOutcome {
  completed: boolean;
  partial: boolean;
  needsSupport: boolean;
  confidenceScore: number; // 0–100, based on assessment frames
}

// Helper function to update node status based on signals (not raw completion)
export function updateNodeStatus(
  path: LearningPath,
  nodeId: string,
  outcome: NodeOutcome
): LearningPath {
  const { completed, partial, needsSupport, confidenceScore } = outcome;

  const updatedNodes = path.nodes.map((node) => {
    // Update the node that just ran
    if (node.id === nodeId) {
      return {
        ...node,
        status: completed ? (partial ? 'partial' : 'completed') : node.status,
        completedFrames: completed ? node.totalFrames : node.completedFrames,
        confidenceScore,
      } as LearningNode;
    }

    // Unlock nodes that depend on this one, using signal-aware rules
    if (node.prerequisiteNodeIds?.includes(nodeId)) {
      // Support nodes only unlock when the engine signals struggle
      if (node.type === 'support') {
        if (needsSupport || partial) {
          return {
            ...node,
            status: node.status === 'locked' ? 'available' : node.status,
          } as LearningNode;
        }
        return node;
      }

      // Reward nodes only unlock for strong mastery (high confidence, no support)
      if (node.type === 'reward') {
        const strongMastery = !partial && !needsSupport && confidenceScore >= 80;
        if (strongMastery) {
          return {
            ...node,
            status: node.status === 'locked' ? 'available' : node.status,
          } as LearningNode;
        }
        return node;
      }

      // Regular learning nodes: unlock when the prerequisite was at least completed
      if (completed) {
        return {
          ...node,
          status: node.status === 'locked' ? 'available' : node.status,
        } as LearningNode;
      }
    }

    return node;
  });

  const completedCount = updatedNodes.filter(
    (n) => n.status === 'completed' || n.status === 'partial'
  ).length;

  // Choose next node:
  // 1) If a support node just became available, prefer it
  // 2) Otherwise, first available learning node
  const nextSupport = updatedNodes.find(
    (n) => n.type === 'support' && n.status === 'available'
  );
  const nextNode = nextSupport ?? updatedNodes.find((n) => n.status === 'available');

  return {
    ...path,
    nodes: updatedNodes,
    completedNodeCount: completedCount,
    currentNodeId: nextNode?.id,
    masteryScore: Math.round(
      (completedCount / Math.max(path.totalNodeCount, 1)) * 100
    ),
  };
}
