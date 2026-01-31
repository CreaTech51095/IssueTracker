import { IssuePriority } from '../lib/issue-store';
import { cn } from '../lib/utils';
import { TrendingUp, Minus, ChevronsDown, LucideIcon } from 'lucide-react';

interface PriorityBadgeProps {
    priority: IssuePriority;
    className?: string;
}

const config: Record<IssuePriority, { icon: LucideIcon; color: string; label: string }> = {
    HIGH: {
        icon: TrendingUp,
        color: 'text-red-500',
        label: 'High'
    },
    MEDIUM: {
        icon: Minus,
        color: 'text-orange-500',
        label: 'Medium'
    },
    LOW: {
        icon: ChevronsDown,
        color: 'text-slate-500',
        label: 'Low'
    },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const { icon: Icon, color, label } = config[priority];

    return (
        <div className={cn("flex items-center gap-1.5 text-xs font-medium", color, className)}>
            <Icon size={14} />
            <span>{label}</span>
        </div>
    );
}
