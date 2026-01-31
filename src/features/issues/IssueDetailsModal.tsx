import { formatDistanceToNow } from 'date-fns';
import { User as UserIcon, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Issue } from '../../lib/issue-store';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';

interface IssueDetailsModalProps {
    issue: Issue | null;
    isOpen: boolean;
    onClose: () => void;
}

export function IssueDetailsModal({ issue, isOpen, onClose }: IssueDetailsModalProps) {
    if (!issue) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={issue.id}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={issue.status} />
                        <PriorityBadge priority={issue.priority} />
                    </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{issue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <UserIcon size={16} />
                        <span className="font-medium text-foreground">Assignee:</span>
                        <span>{issue.assignee || 'Unassigned'}</span>
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
            </div>
        </Modal>
    );
}
