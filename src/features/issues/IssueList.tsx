import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useIssueStore, IssueStatus, IssuePriority, Issue } from '../../lib/issue-store';
import { IssueCard } from './IssueCard';
import { CreateIssueModal } from './CreateIssueModal';
import { IssueDetailsModal } from './IssueDetailsModal';
import { cn } from '../../lib/utils';

export default function IssueList() {
    const issues = useIssueStore((state) => state.issues);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<IssueStatus | 'ALL'>('ALL');
    const [filterPriority, setFilterPriority] = useState<IssuePriority | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            // Filter out archived issues by default in the main list
            if (issue.isArchived) return false;

            const matchesStatus = filterStatus === 'ALL' || issue.status === filterStatus;
            const matchesPriority = filterPriority === 'ALL' || issue.priority === filterPriority;
            const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesPriority && matchesSearch;
        });
    }, [issues, filterStatus, filterPriority, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 flex-1 w-full sm:w-auto flex-wrap">
                    <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'ALL')}
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="CANCELED">Canceled</option>
                        </select>

                        <select
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value as IssuePriority | 'ALL')}
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus size={16} />
                    New Issue
                </button>
            </div>

            {/* Grid */}
            {filteredIssues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredIssues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onClick={() => setSelectedIssueId(issue.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed border-muted-foreground/25">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Filter className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No active issues found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                        Try adjusting your filters or create a new issue.
                    </p>
                </div>
            )}

            <CreateIssueModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <IssueDetailsModal
                issueId={selectedIssueId}
                isOpen={!!selectedIssueId}
                onClose={() => setSelectedIssueId(null)}
            />
        </div>
    );
}
