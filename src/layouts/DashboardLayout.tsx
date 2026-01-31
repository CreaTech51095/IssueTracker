import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';
import { LogOut, LayoutDashboard, ListTodo, Plus, Archive } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
    const { logout, user } = useAuthStore();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: ListTodo, label: 'Issues', href: '/issues' },
        { icon: Archive, label: 'Archived', href: '/archive' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col">
                <div className="p-6 h-16 flex items-center border-b border-border">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            IT
                        </div>
                        <span>Tracker</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-muted/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header - could be extracted */}
                <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg">
                        {/* Dynamic title based on route logic or state */}
                        {location.pathname === '/' ? 'Dashboard' : 'Workspace'}
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
