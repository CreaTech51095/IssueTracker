import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../lib/auth-store';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required (any string works)'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        login(data.email);
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                            <CheckCircle2 size={24} strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-muted-foreground">
                        Sign in to continue to the Issue Tracker
                    </p>
                </div>

                <div className="bg-card border rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    errors.email && "border-destructive focus-visible:ring-destructive"
                                )}
                                placeholder="demo@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                id="password"
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    errors.password && "border-destructive focus-visible:ring-destructive"
                                )}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>

                        <p className="text-xs text-center text-muted-foreground">
                            Note: This is a demo. Enter any email/password.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
