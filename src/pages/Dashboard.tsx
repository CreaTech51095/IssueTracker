import { useIssueStore } from '../lib/issue-store';
import IssueList from '../features/issues/IssueList';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function Dashboard() {
    const { issues } = useIssueStore();

    const stats = [
        {
            label: 'Open',
            value: issues.filter(i => i.status === 'OPEN').length,
            icon: Circle,
            color: 'text-blue-500'
        },
        {
            label: 'In Progress',
            value: issues.filter(i => i.status === 'IN_PROGRESS').length,
            icon: Clock,
            color: 'text-amber-500'
        },
        {
            label: 'Done',
            value: issues.filter(i => i.status === 'DONE').length,
            icon: CheckCircle2,
            color: 'text-green-500'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your project status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Recent Issues</h3>
                <IssueList />
            </div>
        </div>
    );
}
