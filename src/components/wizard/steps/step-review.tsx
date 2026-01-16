
'use client';

import { useState } from "react";
import { WizardData } from "../project-wizard";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StepReviewProps {
    data: WizardData;
}

export function StepReview({ data }: StepReviewProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!data.projectName) {
            toast.error("Project name is required");
            return;
        }

        setIsGenerating(true);
        
        const generatePromise = (async () => {
            const response = await fetch('/api/project/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Generation failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.projectName}-blueprint.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            return "Project Blueprint downloaded!";
        })();

        generatePromise.finally(() => setIsGenerating(false));

        toast.promise(generatePromise, {
            loading: 'Initializing Blueprint Engine...',
            success: (data) => data,
            error: 'Failed to generate blueprint',
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-mono text-[var(--terminal-purple)]">System Check</h2>
                <p className="text-muted-foreground">Review your configuration before initializing the blueprint.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-md bg-black/20">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Project Identity</h3>
                        <p className="font-mono text-lg">{data.projectName || 'Untitled'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Mission</h3>
                        <p className="text-sm opacity-80 line-clamp-3">{data.description || 'No description provided.'}</p>
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-md bg-black/20 text-sm">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Tech Stack ({data.techStack.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.techStack.length > 0 ? (
                                data.techStack.map(t => (
                                    <span key={t} className="px-2 py-1 rounded bg-[var(--terminal-purple)]/10 text-[var(--terminal-purple)] border border-[var(--terminal-purple)]/20 text-xs">
                                        {t}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground italic">None selected</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Workflows ({data.selectedWorkflows.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.selectedWorkflows.length > 0 ? (
                                data.selectedWorkflows.map(w => (
                                    <span key={w} className="px-2 py-1 rounded bg-[var(--terminal-purple)]/10 text-[var(--terminal-purple)] border border-[var(--terminal-purple)]/20 text-xs font-mono">
                                        /{w}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground italic">None selected</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button 
                    onClick={handleDownload} 
                    disabled={isGenerating}
                    size="lg"
                    className="bg-[var(--terminal-purple)] text-black hover:bg-[var(--terminal-purple)]/90 font-bold"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Forging Blueprint...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Project ZIP
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
