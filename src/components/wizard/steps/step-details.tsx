
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WizardData } from "../project-wizard";

interface StepDetailsProps {
    data: WizardData;
    updateData: (updates: Partial<WizardData>) => void;
}

export function StepDetails({ data, updateData }: StepDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-mono text-[var(--terminal-purple)]">Project Initialization</h2>
                <p className="text-muted-foreground">Define the identity of your new creation.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-[var(--terminal-purple)]">Project Name</Label>
                    <Input
                        id="projectName"
                        placeholder="my-vibe-app"
                        value={data.projectName}
                        onChange={(e) => updateData({ projectName: e.target.value })}
                        className="bg-black/20 border-border focus:border-[var(--terminal-purple)] font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-[var(--terminal-purple)]">Mission Brief (Description)</Label>
                    <Textarea
                        id="description"
                        placeholder="A cyber-industrial dashboard for monitoring AI agents..."
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        rows={5}
                        className="bg-black/20 border-border focus:border-[var(--terminal-purple)]"
                    />
                    <p className="text-xs text-muted-foreground">This will be used to generate your initial PRD context.</p>
                </div>
            </div>
        </div>
    );
}
