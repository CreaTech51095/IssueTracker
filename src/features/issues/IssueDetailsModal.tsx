import { formatDistanceToNow } from 'date-fns';
import { User as UserIcon, Calendar, Tag, AlertCircle, Archive, ArchiveRestore, Trash2, TrendingUp, Minus, ChevronsDown, UserMinus } from 'lucide-react';
import { Issue, useIssueStore, IssueStatus, IssuePriority } from '../../lib/issue-store';
import { useAuthStore } from '../../lib/auth-store';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';
import { UserSelect } from '../../components/UserSelect';

interface IssueDetailsModalProps {
    issueId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function IssueDetailsModal({ issueId, isOpen, onClose }: IssueDetailsModalProps) {
    const issue = useIssueStore((state) => state.issues.find(i => i.id === issueId));
    const { updateIssue, toggleArchive, deleteIssue } = useIssueStore();
    const { user } = useAuthStore();

    if (!issue) return null;

    const isAssigned = !!issue.assignee;
    const isAssignedToMe = user && issue.assignee === user.name;
    const canArchive = issue.status === 'DONE' || issue.status === 'CANCELED';

    const handleArchive = () => {
        if (issue.isArchived) {
            toggleArchive(issue.id);
            return;
        }
        if (canArchive) {
            toggleArchive(issue.id);
            if (!issue.isArchived) {
                // Determine if we should close the modal? 
                // Perhaps keeping it open is fine to allow restore.
            }
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to permanently delete this issue?')) {
            deleteIssue(issue.id);
            onClose();
        }
    };

    const handleTakeIssue = () => {
        if (user) {
            updateIssue(issue.id, { assignee: user.name });
        }
    };

    const handleUnassign = () => {
        updateIssue(issue.id, { assignee: undefined });
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
        <Modal isOpen={isOpen} onClose={onClose} title={issue.id}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center">
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
                        </div>

                        <div className="relative flex items-center">
                            <PriorityIcon size={14} className={cn("absolute left-2 pointer-events-none", priorityConfig[issue.priority].color)} />
                            <select
                                value={issue.priority}
                                onChange={(e) => updateIssue(issue.id, { priority: e.target.value as IssuePriority })}
                                className={cn(
                                    "text-xs font-medium bg-transparent border rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring appearance-none pl-7 pr-2 py-1",
                                    priorityConfig[issue.priority].color,
                                    "border-border"
                                )}
                            >
                                <option value="LOW" className="bg-card text-foreground">Low</option>
                                <option value="MEDIUM" className="bg-card text-foreground">Medium</option>
                                <option value="HIGH" className="bg-card text-foreground">High</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{issue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 col-span-2">
                        <UserIcon size={16} />
                        <span className="font-medium text-foreground">Assignee:</span>
                        <div className="flex items-center gap-2">
                            {isAssigned ? (
                                <div className="flex items-center gap-2">
                                    <UserSelect
                                        value={issue.assignee}
                                        onChange={(value) => updateIssue(issue.id, { assignee: value })}
                                        className="min-w-[150px]"
                                    />
                                    <button
                                        onClick={handleUnassign}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors border border-border"
                                        title="Unassign"
                                    >
                                        <UserMinus size={14} />
                                        <span>Unassign</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground mr-2">Unassigned</span>
                                    <UserSelect
                                        value={undefined}
                                        onChange={(value) => updateIssue(issue.id, { assignee: value })}
                                        placeholder="Assign to..."
                                        className="min-w-[150px]"
                                    />
                                    <button
                                        onClick={handleTakeIssue}
                                        className="px-2 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
                                    >
                                        Take
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="font-medium text-foreground">Created:</span>
                        <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span className="font-medium text-foreground">ID:</span>
                        <span className="font-mono">{issue.id}</span>
                    </div>
                    {issue.isArchived && (
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertCircle size={16} />
                            <span className="font-medium">Archived</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <button
                        onClick={handleArchive}
                        disabled={!issue.isArchived && !canArchive}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                            issue.isArchived || canArchive
                                ? "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                : "text-muted-foreground/50 cursor-not-allowed"
                        )}
                        title={
                            issue.isArchived
                                ? "Restore Issue"
                                : canArchive
                                    ? "Archive Issue"
                                    : "Only done or canceled issues can be archived"
                        }
                    >
                        {issue.isArchived ? (
                            <>
                                <ArchiveRestore size={16} />
                                Restore
                            </>
                        ) : (
                            <>
                                <Archive size={16} />
                                Archive
                            </>
                        )}
                    </button>

                    {issue.isArchived && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
