import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { useIssueStore } from '../../lib/issue-store';
import { cn } from '../../lib/utils';

const issueSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED']),
    assignee: z.string().optional(),
});

type IssueForm = z.infer<typeof issueSchema>;

interface CreateIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateIssueModal({ isOpen, onClose }: CreateIssueModalProps) {
    const addIssue = useIssueStore((state) => state.addIssue);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            status: 'OPEN',
            priority: 'MEDIUM',
        }
    });

    const onSubmit = (data: IssueForm) => {
        addIssue(data);
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Issue">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Title</label>
                    <input
                        {...register('title')}
                        className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                            errors.title && "border-destructive focus-visible:ring-destructive"
                        )}
                        placeholder="Issue title"
                    />
                    {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Description</label>
                    <textarea
                        {...register('description')}
                        className={cn(
                            "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                            errors.description && "border-destructive focus-visible:ring-destructive"
                        )}
                        placeholder="Add a detailed description..."
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Status</label>
                        <select
                            {...register('status')}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="CANCELED">Canceled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Priority</label>
                        <select
                            {...register('priority')}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Assignee (Optional)</label>
                    <input
                        {...register('assignee')}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="e.g. j.doe"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors"
                    >
                        Create Issue
                    </button>
                </div>
            </form>
        </Modal>
    );
}
