import { useMemo, useState } from 'react';
import { Archive, Search } from 'lucide-react';
import { useIssueStore, Issue } from '../lib/issue-store';
import { IssueCard } from '../features/issues/IssueCard';
import { IssueDetailsModal } from '../features/issues/IssueDetailsModal';

export default function ArchivedIssues() {
    const issues = useIssueStore((state) => state.issues);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const archivedIssues = useMemo(() => {
        return issues.filter((issue) => issue.isArchived);
    }, [issues]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Archived Issues</h2>
                <p className="text-muted-foreground">View and manage archived tasks</p>
            </div>

            {archivedIssues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {archivedIssues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={() => setSelectedIssue(issue)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed border-muted-foreground/25">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Archive className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No archived issues</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                        Archived items will appear here.
                    </p>
                </div>
            )}

            <IssueDetailsModal
                issueId={selectedIssue?.id ?? null}
                isOpen={!!selectedIssue}
                onClose={() => setSelectedIssue(null)}
            />
        </div>
    );
}
