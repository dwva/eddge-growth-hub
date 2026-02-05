import { cn } from '@/lib/utils';
import {
  BookOpen,
  BookText,
  Dumbbell,
  Star,
  LifeBuoy,
  Gift,
  Lock,
  Check,
  Play,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { LearningNode as LearningNodeType, LearningNodeType as NodeType, NodeStatus } from './types';
import { NODE_COLORS } from './types';

interface LearningNodeProps {
  node: LearningNodeType;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_MAP = {
  core: BookOpen,
  concept: BookText,
  practice: Dumbbell,
  mastery: Star,
  support: LifeBuoy,
  reward: Gift,
};

const SIZE_MAP = {
  sm: {
    container: 'w-12 h-12',
    icon: 'w-5 h-5',
    ring: 'w-14 h-14',
    stroke: 3,
  },
  md: {
    container: 'w-16 h-16',
    icon: 'w-7 h-7',
    ring: 'w-20 h-20',
    stroke: 4,
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'w-9 h-9',
    ring: 'w-24 h-24',
    stroke: 5,
  },
};

function ProgressRing({ 
  progress, 
  size, 
  status,
  nodeType,
}: { 
  progress: number; 
  size: 'sm' | 'md' | 'lg';
  status: NodeStatus;
  nodeType: NodeType;
}) {
  const sizeConfig = SIZE_MAP[size];
  const radius = size === 'sm' ? 24 : size === 'md' ? 36 : 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Determine ring color based on status
  const ringColor = status === 'completed' 
    ? 'stroke-green-500' 
    : status === 'active' 
      ? 'stroke-purple-500'
      : status === 'partial'
        ? 'stroke-yellow-500'
        : NODE_COLORS[nodeType]?.ring || 'stroke-gray-300';

  return (
    <svg 
      className={cn('absolute transform -rotate-90', sizeConfig.ring)}
      viewBox={`0 0 ${(radius + sizeConfig.stroke) * 2} ${(radius + sizeConfig.stroke) * 2}`}
    >
      {/* Background circle */}
      <circle
        cx={radius + sizeConfig.stroke}
        cy={radius + sizeConfig.stroke}
        r={radius}
        fill="none"
        className="stroke-gray-200 dark:stroke-gray-700"
        strokeWidth={sizeConfig.stroke}
      />
      {/* Progress circle */}
      {progress > 0 && (
        <circle
          cx={radius + sizeConfig.stroke}
          cy={radius + sizeConfig.stroke}
          r={radius}
          fill="none"
          className={cn(ringColor, 'transition-all duration-500')}
          strokeWidth={sizeConfig.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function LearningNode({ 
  node, 
  isActive = false, 
  onClick,
  size = 'md',
}: LearningNodeProps) {
  const Icon = ICON_MAP[node.type];
  const sizeConfig = SIZE_MAP[size];
  const progress = node.totalFrames > 0
    ? Math.round((node.completedFrames / node.totalFrames) * 100)
    : 0;
  
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';
  const isPartial = node.status === 'partial';
  const canInteract = !isLocked;

  // Get status-based styles (calm, premium – no harsh visuals)
  const getNodeStyles = () => {
    if (isLocked) {
      return cn(
        'bg-gray-200/90 dark:bg-gray-700/80',
        'opacity-70 cursor-default',
        'border border-gray-300/50 dark:border-gray-600/50',
        'transition-all duration-300'
      );
    }
    if (isCompleted) {
      return cn(
        'bg-emerald-500/90 dark:bg-emerald-600/90',
        'cursor-pointer transition-all duration-300',
        'hover:scale-105 hover:shadow-md',
        'shadow-sm',
        'animate-path-sparkle-once'
      );
    }
    if (isActive || node.status === 'active') {
      return cn(
        NODE_COLORS[node.type].bg,
        'cursor-pointer transition-all duration-500',
        'ring-4 ring-purple-300/80 dark:ring-purple-400/80',
        'shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30',
        'animate-path-breathe',
        'hover:scale-105'
      );
    }
    if (isPartial) {
      return cn(
        'bg-amber-50 dark:bg-amber-900/40',
        'border-2 border-amber-400/80',
        'cursor-pointer transition-all duration-300 hover:scale-105'
      );
    }
    if (node.status === 'available') {
      return cn(
        'bg-white dark:bg-gray-800',
        'border-2 border-purple-300 dark:border-purple-600',
        'cursor-pointer transition-all duration-300',
        'hover:scale-105 hover:border-purple-500 hover:shadow-md'
      );
    }
    if (node.status === 'skipped') {
      return cn(
        'bg-blue-50 dark:bg-blue-900/30',
        'border-2 border-blue-300 dark:border-blue-700',
        'cursor-pointer transition-all duration-300 hover:scale-105'
      );
    }
    return 'bg-gray-200 dark:bg-gray-700';
  };

  // Get icon color
  const getIconColor = () => {
    if (isLocked) return 'text-gray-500 dark:text-gray-400';
    if (isCompleted) return 'text-white';
    if (isActive || node.status === 'active') return 'text-white';
    if (isPartial) return 'text-yellow-600 dark:text-yellow-400';
    if (node.status === 'available') return NODE_COLORS[node.type].text;
    return 'text-gray-600 dark:text-gray-300';
  };

  const tooltipText = isLocked
    ? "You'll reach this soon — unlocks after one key skill"
    : isCompleted && (node.confidenceScore ?? 0) >= 70
      ? 'Exam-ready skill'
      : null;

  const nodeButton = (
    <button
      onClick={canInteract ? onClick : undefined}
      disabled={isLocked}
      className={cn(
        'relative rounded-full flex items-center justify-center',
        'transition-all duration-300 shadow-lg',
        sizeConfig.container,
        getNodeStyles()
      )}
      aria-label={`${node.skillGoal} — ${node.status}`}
    >
      {isLocked ? (
        <Lock className={cn(sizeConfig.icon, 'text-gray-400 dark:text-gray-500')} />
      ) : isCompleted ? (
        <Check className={cn(sizeConfig.icon, 'text-white')} strokeWidth={3} />
      ) : node.status === 'available' && !isActive ? (
        <Play className={cn(sizeConfig.icon, getIconColor())} />
      ) : (
        <Icon className={cn(sizeConfig.icon, getIconColor())} />
      )}
    </button>
  );

  const wrappedNode = tooltipText ? (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex flex-col items-center">{nodeButton}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-[200px]">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    nodeButton
  );

  return (
    <div className="relative flex flex-col items-center">
      {/* Progress ring – frames traversed, not mastery */}
      {!isLocked && progress > 0 && (
        <ProgressRing 
          progress={progress} 
          size={size} 
          status={node.status}
          nodeType={node.type}
        />
      )}
      
      {wrappedNode}

      {/* Node label */}
      <span className={cn(
        'mt-2 text-xs font-medium text-center max-w-20 line-clamp-2',
        isLocked 
          ? 'text-gray-400 dark:text-gray-500' 
          : 'text-gray-700 dark:text-gray-300'
      )}>
        {node.skillGoal}
      </span>

      {isPartial && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
          <span className="text-[8px] font-bold text-amber-900">!</span>
        </span>
      )}
      
      {/* 1–3 stars for mastery quality (not speed) */}
      {isCompleted && node.confidenceScore != null && (
        <div className="flex gap-0.5 mt-1" title="Exam-ready skill">
          {[1, 2, 3].map((star) => (
            <Star 
              key={star}
              className={cn(
                'w-3 h-3 transition-colors duration-300',
                node.confidenceScore >= star * 33 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LearningNode;
