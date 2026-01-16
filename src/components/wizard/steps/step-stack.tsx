
'use client';

import { useEffect, useState } from "react";
import { WizardData } from "../project-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface StepStackProps {
    data: WizardData;
    updateData: (updates: Partial<WizardData>) => void;
}

export function StepStack({ data, updateData }: StepStackProps) {
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch('/api/resources');
                const json = await res.json();
                if (json.tags) setAvailableTags(json.tags);
            } catch (error) {
                console.error("Failed to fetch stack tags", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const toggleTag = (tag: string) => {
        const current = data.techStack;
        if (current.includes(tag)) {
            updateData({ techStack: current.filter(t => t !== tag) });
        } else {
            updateData({ techStack: [...current, tag] });
        }
    };

    const filteredTags = availableTags.filter(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
             <div className="space-y-2">
                <h2 className="text-2xl font-bold font-mono text-[var(--terminal-purple)]">Tech Stack Matrix</h2>
                <p className="text-muted-foreground">Select the technologies for your blueprint. The Wizard will inject relevant rules.</p>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Input 
                    placeholder="Search technologies (e.g., 'React', 'Supabase')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/20 border-border focus:border-[var(--terminal-purple)] font-mono"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {filteredTags.length > 0 ? (
                            filteredTags.map(tag => {
                                const isSelected = data.techStack.includes(tag);
                                return (
                                    <div
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`
                                            cursor-pointer px-4 py-2 rounded-md border text-sm font-medium transition-all
                                            ${isSelected 
                                                ? 'border-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10 text-[var(--terminal-purple)] shadow-[0_0_10px_var(--terminal-purple)]' 
                                                : 'border-border bg-background hover:border-[var(--terminal-purple)]/50 text-muted-foreground'
                                            }
                                        `}
                                    >
                                        {tag}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-muted-foreground italic text-sm py-4">
                                No matching technologies found. Try a different search term.
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="p-4 rounded-lg bg-[var(--terminal-purple)]/5 border border-[var(--terminal-purple)]/20 text-[var(--terminal-purple)] text-sm flex items-start gap-2">
                 <span className="text-lg">💡</span>
                 <span>
                    <strong>Pro Tip:</strong> Select a cohesive stack (e.g., &quot;Next.js&quot; + &quot;Tailwind&quot;). The AI uses these tags to select the best coding rules for your project.
                 </span>
            </div>
        </div>
    );
}
