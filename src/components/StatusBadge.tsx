import { IssueStatus } from '../lib/issue-store';
import { cn } from '../lib/utils';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: IssueStatus;
    className?: string;
}

const config: Record<IssueStatus, { icon: any; color: string; label: string }> = {
    OPEN: {
        icon: Circle,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        label: 'Open'
    },
    IN_PROGRESS: {
        icon: Clock,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        label: 'In Progress'
    },
    DONE: {
        icon: CheckCircle2,
        color: 'text-green-500 bg-green-500/10 border-green-500/20',
        label: 'Done'
    },
    CANCELED: {
        icon: XCircle,
        color: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
        label: 'Canceled'
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const { icon: Icon, color, label } = config[status];

    return (
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", color, className)}>
            <Icon size={14} />
            <span>{label}</span>
        </div>
    );
}
