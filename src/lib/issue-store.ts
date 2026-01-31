import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Issue {
    id: string;
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    isArchived: boolean;
    assignee?: string;
    createdAt: string;
    updatedAt: string;
}

interface IssueState {
    issues: Issue[];
    addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => void;
    updateIssue: (id: string, updates: Partial<Omit<Issue, 'id' | 'createdAt'>>) => void;
    deleteIssue: (id: string) => void;
    toggleArchive: (id: string) => void;
    getIssueById: (id: string) => Issue | undefined;
}

export const useIssueStore = create<IssueState>()(
    persist(
        (set, get) => ({
            issues: [
                {
                    id: '1',
                    title: 'Implement Authentication',
                    description: 'Set up Zustand store and Login page with mock JWT.',
                    status: 'DONE',
                    priority: 'HIGH',
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    assignee: 'demo',
                },
                {
                    id: '2',
                    title: 'Design Dashboard Layout',
                    description: 'Create responsive sidebar and header using Tailwind.',
                    status: 'IN_PROGRESS',
                    priority: 'MEDIUM',
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    assignee: 'demo',
                },
            ],
            addIssue: (issueData) => {
                const newIssue: Issue = {
                    ...issueData,
                    isArchived: false,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    issues: [newIssue, ...state.issues],
                }));
            },
            updateIssue: (id, updates) => {
                set((state) => ({
                    issues: state.issues.map((issue) =>
                        issue.id === id
                            ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
                            : issue
                    ),
                }));
            },
            deleteIssue: (id) => {
                set((state) => ({
                    issues: state.issues.filter((issue) => issue.id !== id),
                }));
            },
            toggleArchive: (id) => {
                set((state) => ({
                    issues: state.issues.map((issue) =>
                        issue.id === id ? { ...issue, isArchived: !issue.isArchived } : issue
                    ),
                }));
            },
            getIssueById: (id) => {
                return get().issues.find((issue) => issue.id === id);
            },
        }),
        {
            name: 'issue-storage',
        }
    )
);
