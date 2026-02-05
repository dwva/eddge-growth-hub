import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LearningNode } from './LearningNode';
import { Trophy } from 'lucide-react';
import type { LearningPath as LearningPathType, LearningNode as NodeType } from './types';

interface LearningPathProps {
  path: LearningPathType;
  onNodeClick?: (node: NodeType) => void;
  /** Optional: show a short emotional feedback line when user has completed at least one node */
  emotionalMessage?: string | null;
}

/** Subject-based soft background (3–6% opacity), alive but quiet */
function PathBackground({ subjectId }: { subjectId: string }) {
  const isScience = subjectId === '2' || subjectId?.toLowerCase().includes('science');
  const isMath = subjectId === '1' || subjectId?.toLowerCase().includes('math');
  const isHistory = subjectId === '4' || subjectId?.toLowerCase().includes('history');

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
      aria-hidden
    >
      {isScience && (
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(129, 140, 248, 0.4), transparent 60%), linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
          }}
        />
      )}
      {isMath && (
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            background: 'repeating-linear-gradient( -45deg, transparent, transparent 40px, rgba(139, 92, 246, 0.06) 40px, rgba(139, 92, 246, 0.06) 41px ), linear-gradient(135deg, rgba(139, 92, 246, 0.04), transparent 50%)',
          }}
        />
      )}
      {isHistory && (
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            background: 'linear-gradient(180deg, rgba(180, 160, 120, 0.06) 0%, transparent 40%), radial-gradient(ellipse 100% 80% at 80% 80%, rgba(180, 160, 120, 0.05), transparent 50%)',
          }}
        />
      )}
      {!isScience && !isMath && !isHistory && (
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), transparent 50%)',
          }}
        />
      )}
    </div>
  );
}

// Calculate positions for nodes in a snake/candy-crush pattern
function calculateNodePositions(
  nodeCount: number,
  containerWidth: number,
  nodesPerRow: number = 4
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const nodeSpacing = containerWidth / (nodesPerRow + 1);
  const rowHeight = 140;
  const padding = 60;

  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / nodesPerRow);
    const posInRow = i % nodesPerRow;
    const isEvenRow = row % 2 === 0;

    // Calculate x position (zigzag pattern)
    const x = isEvenRow
      ? padding + posInRow * nodeSpacing + nodeSpacing / 2
      : containerWidth - padding - posInRow * nodeSpacing - nodeSpacing / 2;

    // Calculate y position
    const y = padding + row * rowHeight + rowHeight / 2;

    positions.push({ x, y });
  }

  return positions;
}

// Generate SVG path for the connecting line
function generatePathD(positions: { x: number; y: number }[]): string {
  if (positions.length < 2) return '';

  let d = `M ${positions[0].x} ${positions[0].y}`;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    // Check if we're moving to a new row
    const prevRow = Math.floor((i - 1) / 4);
    const currRow = Math.floor(i / 4);
    const isNewRow = prevRow !== currRow;

    if (isNewRow) {
      // Create a curved corner when moving to new row
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${midY} ${(prev.x + curr.x) / 2} ${midY}`;
      d += ` Q ${curr.x} ${midY} ${curr.x} ${curr.y}`;
    } else {
      // Simple curve between nodes in same row
      const midX = (prev.x + curr.x) / 2;
      d += ` Q ${midX} ${prev.y - 20} ${curr.x} ${curr.y}`;
    }
  }

  return d;
}

function PathLine({ 
  positions, 
  completedCount 
}: { 
  positions: { x: number; y: number }[];
  completedCount: number;
}) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Soft gradient along path direction */}
        <linearGradient id="pathGradientSoft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        {/* Soft shadow under path */}
        <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" floodColor="#374151" />
        </filter>
        <filter id="pathGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow path (depth) */}
      <path
        d={generatePathD(positions)}
        fill="none"
        stroke="transparent"
        strokeWidth="10"
        strokeLinecap="round"
        filter="url(#pathShadow)"
      />

      {/* Upcoming path: very light, shows direction */}
      <path
        d={generatePathD(positions)}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="5"
        strokeDasharray="10 6"
        strokeLinecap="round"
        className="dark:stroke-gray-700 transition-all duration-500"
      />

      {/* Completed path: soft fill with gradient */}
      {completedCount > 0 && (
        <path
          d={generatePathD(positions.slice(0, completedCount + 1))}
          fill="none"
          stroke="url(#completedGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#pathGlow)"
          className="transition-all duration-500 ease-out"
        />
      )}
    </svg>
  );
}

const EMOTIONAL_LINES = [
  'Nice progress 👍',
  "That skill is now solid",
  "You're building momentum",
  'One step closer',
  'Skill by skill.',
];

export function LearningPath({ path, onNodeClick, emotionalMessage }: LearningPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const updatePositions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        setPositions(calculateNodePositions(path.nodes.length, width));
      }
    };
    updatePositions();
    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [path.nodes.length]);

  const rowCount = Math.ceil(path.nodes.length / 4);
  const pathAreaMinHeight = rowCount * 140 + 120;
  const total = path.totalNodeCount || 1;
  const completed = path.completedNodeCount;
  const lastPos = positions[positions.length - 1];
  const showEmotional = (completed > 0) && (emotionalMessage ?? EMOTIONAL_LINES[Math.min(completed - 1, EMOTIONAL_LINES.length - 1)]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative w-full flex-1 min-h-0 flex flex-col overflow-hidden',
        'bg-gradient-to-b from-purple-50/30 to-white dark:from-gray-900/40 dark:to-gray-900',
        'rounded-3xl border border-gray-200/80 dark:border-gray-800',
        'shadow-sm',
        'p-5'
      )}
    >
      <PathBackground subjectId={path.subjectId} />

      {/* Header – progress without pressure */}
      <div className="relative z-10 mb-4 text-center flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
          {path.topicName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-muted-foreground">
          {path.chapterName} • {path.subjectName}
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {completed} of {total} skills learned
        </p>
        {/* Segmented progress (no harsh %) */}
        <div className="mt-2 flex justify-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i < completed
                  ? 'bg-green-400 dark:bg-green-500 w-6'
                  : 'bg-gray-200 dark:bg-gray-700 w-6'
              )}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
          Mastery builds skill by skill
        </p>
      </div>

      {/* Path + nodes – fills remaining space */}
      <div 
        className="relative flex-1 min-h-0 flex flex-col" 
        style={{ minHeight: pathAreaMinHeight }}
      >
        <PathLine positions={positions} completedCount={completed} />

        {path.nodes.map((node, index) => {
          const pos = positions[index];
          if (!pos) return null;
          const isActive = path.currentNodeId === node.id;
          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: pos.x,
                top: pos.y,
                transition: 'all 0.4s ease-out',
              }}
            >
              <LearningNode
                node={node}
                isActive={isActive}
                onClick={() => onNodeClick?.(node)}
                size={isActive ? 'lg' : 'md'}
              />
            </div>
          );
        })}

        {/* Destination landmark – clear end of journey */}
        {lastPos && (
          <div
            className="absolute z-[8] flex flex-col items-center"
            style={{
              left: lastPos.x,
              top: lastPos.y + 52,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-300 dark:border-amber-700 p-2.5 shadow-sm transition-transform duration-300 hover:scale-105">
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="mt-1.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 text-center max-w-[80px] leading-tight">
              {path.topicName} Mastery
            </span>
          </div>
        )}

        {/* Inline emotional feedback (no popup) */}
        {showEmotional && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50">
            <span className="text-xs text-purple-700 dark:text-purple-300">
              {emotionalMessage ?? EMOTIONAL_LINES[Math.min(completed - 1, EMOTIONAL_LINES.length - 1)]}
            </span>
          </div>
        )}
      </div>

      {/* Legend – calm labels */}
      <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-path-breathe" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-purple-300 bg-white dark:bg-gray-800" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 opacity-70" />
          <span>You&apos;ll reach this soon</span>
        </div>
      </div>
    </div>
  );
}

export default LearningPath;
