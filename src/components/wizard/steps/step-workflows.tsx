
'use client';

import { useEffect, useState } from "react";
import { WizardData } from "../project-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle } from "lucide-react";

interface StepWorkflowsProps {
    data: WizardData;
    updateData: (updates: Partial<WizardData>) => void;
}

export function StepWorkflows({ data, updateData }: StepWorkflowsProps) {
    const [workflows, setWorkflows] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch('/api/resources');
                const json = await res.json();
                if (json.workflows) setWorkflows(json.workflows);
            } catch (error) {
                console.error("Failed to fetch workflows", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const toggleWorkflow = (wf: string) => {
        const current = data.selectedWorkflows;
        if (current.includes(wf)) {
            updateData({ selectedWorkflows: current.filter(w => w !== wf) });
        } else {
            updateData({ selectedWorkflows: [...current, wf] });
        }
    };

    // Simple grouping logic based on prefixes (future enhancement: real metadata)
    const groups = {
        "Core": workflows.filter(w => !w.includes('-') || w.startsWith('agent-')),
        "Dev Ops": workflows.filter(w => w.includes('commit') || w.includes('branch') || w.includes('rebase')),
        "Coding": workflows.filter(w => w.includes('code') || w.includes('feature') || w.includes('refactor')),
        "Other": workflows.filter(w => !w.startsWith('agent-') && !w.includes('commit') && !w.includes('code') && !w.includes('feature'))
    };


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-mono text-[var(--terminal-purple)]">Agent Protocols</h2>
                <p className="text-muted-foreground">Equip your agent with standard operating procedures (Workflows).</p>
            </div>

            {loading ? (
                <Skeleton className="h-[300px] w-full" />
            ) : (
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(groups).map(([category, items]) => {
                        if (items.length === 0) return null;
                        return (
                             <div key={category} className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest pl-1">{category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {items.map(wf => {
                                        const isSelected = data.selectedWorkflows.includes(wf);
                                        return (
                                            <div
                                                key={wf}
                                                onClick={() => toggleWorkflow(wf)}
                                                className={`
                                                    cursor-pointer p-3 rounded-md border flex items-center justify-between transition-all group
                                                    ${isSelected 
                                                        ? 'border-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10' 
                                                        : 'border-border bg-background hover:bg-muted'
                                                    }
                                                `}
                                            >
                                                <span className={`font-mono text-sm ${isSelected ? 'text-[var(--terminal-purple)]' : 'text-foreground'}`}>
                                                    /{wf}
                                                </span>
                                                {isSelected ? (
                                                    <Check className="w-4 h-4 text-[var(--terminal-purple)]" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
