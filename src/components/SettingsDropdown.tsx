import { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '../lib/utils';

export function SettingsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
        // Optional: Close dropdown on selection if desired, or keep open for multiple changes
        // setIsOpen(false); 
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                title="Settings"
            >
                <Settings size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Appearance
                    </div>

                    <div className="px-2 space-y-1">
                        <button
                            onClick={() => toggleTheme('light')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                theme === 'light'
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            <Sun size={16} />
                            <span>Light Mode</span>
                        </button>
                        <button
                            onClick={() => toggleTheme('dark')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                theme === 'dark'
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            <Moon size={16} />
                            <span>Dark Mode</span>
                        </button>
                        <button
                            onClick={() => toggleTheme('system')}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                theme === 'system'
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            <Monitor size={16} />
                            <span>System</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
