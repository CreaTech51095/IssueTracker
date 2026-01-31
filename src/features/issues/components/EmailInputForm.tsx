import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface EmailInputFormProps {
    onProcess: (text: string) => void;
    isProcessing?: boolean;
}

const EmailInputForm: React.FC<EmailInputFormProps> = ({ onProcess, isProcessing = false }) => {
    const [emailContent, setEmailContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailContent.trim()) {
            onProcess(emailContent);
            setEmailContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email-content" className="block text-sm font-medium text-foreground mb-2">
                    Email Content
                </label>
                <textarea
                    id="email-content"
                    rows={8}
                    className={cn(
                        "w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none",
                        "text-foreground placeholder:text-muted-foreground bg-muted/50 border-input",
                        "focus:bg-background"
                    )}
                    placeholder="Paste the feedback email text here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    disabled={isProcessing}
                />
            </div>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={!emailContent.trim() || isProcessing}
                    className={cn(
                        "px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm",
                        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                        "flex items-center space-x-2"
                    )}
                >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isProcessing ? 'Processing AI...' : 'Generate Tasks'}</span>
                </button>
            </div>
        </form>
    );
};

export default EmailInputForm;
