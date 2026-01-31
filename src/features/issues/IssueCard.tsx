import { formatDistanceToNow } from 'date-fns';
import { Trash2, User as UserIcon, UserPlus, Archive, ArchiveRestore } from 'lucide-react';
import { Issue, useIssueStore, IssueStatus, IssuePriority } from '../../lib/issue-store';
import { useAuthStore } from '../../lib/auth-store';
import { cn } from '../../lib/utils';
import { TrendingUp, Minus, ChevronsDown } from 'lucide-react';

interface IssueCardProps {
    issue: Issue;
    onClick?: () => void;
}

export function IssueCard({ issue, onClick }: IssueCardProps) {
    const { deleteIssue, updateIssue, toggleArchive } = useIssueStore();
    const { user } = useAuthStore();

    const isAssigned = !!issue.assignee;
    const isAssignedToMe = user && issue.assignee === user.name;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to permanently delete this issue?')) {
            deleteIssue(issue.id);
        }
    };

    const canArchive = issue.status === 'DONE' || issue.status === 'CANCELED';

    const handleArchive = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (issue.isArchived) {
            toggleArchive(issue.id);
            return;
        }

        if (canArchive) {
            toggleArchive(issue.id);
        }
    };

    const handleTakeIssue = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (user) {
            updateIssue(issue.id, { assignee: user.name });
        }
    };

    const statusColors: Record<IssueStatus, string> = {
        OPEN: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        IN_PROGRESS: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        DONE: 'text-green-500 bg-green-500/10 border-green-500/20',
        CANCELED: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    };

    const priorityConfig: Record<IssuePriority, { icon: any; color: string; label: string }> = {
        HIGH: { icon: TrendingUp, color: 'text-red-500', label: 'High' },
        MEDIUM: { icon: Minus, color: 'text-orange-500', label: 'Medium' },
        LOW: { icon: ChevronsDown, color: 'text-slate-500', label: 'Low' },
    };

    const PriorityIcon = priorityConfig[issue.priority].icon;

    return (
        <div
            onClick={onClick}
            className={cn(
                "group bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:border-primary/50 relative flex flex-col h-full cursor-pointer",
                issue.isArchived && "opacity-75 bg-muted/20 border-border/50"
            )}
        >
            <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-mono">#{issue.id.slice(0, 4)}</span>

                    <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
                        <PriorityIcon size={14} className={cn("absolute left-0 pointer-events-none", priorityConfig[issue.priority].color)} />
                        <select
                            value={issue.priority}
                            onChange={(e) => updateIssue(issue.id, { priority: e.target.value as IssuePriority })}
                            className={cn(
                                "text-xs font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-0 appearance-none pl-5 py-0.5",
                                priorityConfig[issue.priority].color
                            )}
                        >
                            <option value="LOW" className="bg-card text-foreground">Low</option>
                            <option value="MEDIUM" className="bg-card text-foreground">Medium</option>
                            <option value="HIGH" className="bg-card text-foreground">High</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleArchive}
                        disabled={!issue.isArchived && !canArchive}
                        className={cn(
                            "opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all",
                            issue.isArchived || canArchive
                                ? "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                : "text-muted-foreground/30 cursor-not-allowed"
                        )}
                        title={
                            issue.isArchived
                                ? "Restore Issue"
                                : canArchive
                                    ? "Archive Issue"
                                    : "Only done or canceled issues can be archived"
                        }
                    >
                        {issue.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>

                    {issue.isArchived && (
                        <button
                            onClick={handleDelete}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                            title="Delete Permanently"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4 flex-1">
                <h3 className="font-semibold text-base leading-tight mb-1.5 group-hover:text-primary transition-colors">
                    {issue.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {issue.description}
                </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border mt-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <select
                        value={issue.status}
                        onChange={(e) => updateIssue(issue.id, { status: e.target.value as IssueStatus })}
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded-md border bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring transition-colors appearance-none",
                            statusColors[issue.status]
                        )}
                    >
                        <option value="OPEN" className="bg-card text-foreground">Open</option>
                        <option value="IN_PROGRESS" className="bg-card text-foreground">In Progress</option>
                        <option value="DONE" className="bg-card text-foreground">Done</option>
                        <option value="CANCELED" className="bg-card text-foreground">Canceled</option>
                    </select>

                    <div className="flex items-center gap-2">
                        {isAssigned ? (
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors",
                                    isAssignedToMe ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground"
                                )}
                                title={isAssignedToMe ? "Assigned to you" : `Assigned to ${issue.assignee}`}
                            >
                                <UserIcon size={12} />
                                <span className="max-w-[80px] truncate">{issue.assignee}</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleTakeIssue}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground cursor-pointer"
                            >
                                <UserPlus size={12} />
                                <span>Take</span>
                            </button>
                        )}

                        {isAssigned && !isAssignedToMe && (
                            <button
                                onClick={handleTakeIssue}
                                className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-primary underline decoration-dotted transition-opacity"
                                title={`Take over from ${issue.assignee}`}
                            >
                                Take
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-[10px] text-muted-foreground text-right w-full">
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                </div>
            </div>
        </div>
    );
}
