import { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../lib/auth-store';

export interface UserOption {
    id: string;
    name: string;
    email: string;
}

const MOCK_USERS: UserOption[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
    { id: '4', name: 'David', email: 'david@example.com' },
    { id: '5', name: 'Eve', email: 'eve@example.com' },
];

interface UserSelectProps {
    value: string | undefined; // The selected username
    onChange: (username: string) => void;
    placeholder?: string;
    className?: string;
}

export function UserSelect({ value, onChange, placeholder = "Assign to...", className }: UserSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuthStore();

    // Combine mock users with current user if not already present
    const allUsers = [...MOCK_USERS];
    if (currentUser && !allUsers.find(u => u.name === currentUser.name)) {
        allUsers.unshift({
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
        });
    }

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle selection
    const handleSelect = (username: string) => {
        onChange(username);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm border rounded-md bg-background hover:bg-muted/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring text-left",
                    !value && "text-muted-foreground"
                )}
            >
                <UserIcon size={16} />
                <span className="flex-1 truncate">{value || placeholder}</span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-8 pr-2 py-1.5 text-xs bg-muted/50 border rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleSelect(user.name)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{user.name}</div>
                                        <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                                    </div>
                                    {value === user.name && <Check size={14} className="text-primary" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-2 text-xs text-center text-muted-foreground">
                                No users found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
