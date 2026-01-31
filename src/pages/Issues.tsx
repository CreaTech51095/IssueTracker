import IssueList from '../features/issues/IssueList';

export default function IssuesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Issues</h2>
                <p className="text-muted-foreground">Manage and track all project issues</p>
            </div>
            <IssueList />
        </div>
    );
}
