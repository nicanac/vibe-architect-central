import { PromptWizard } from "@/components/vibe/PromptWizard";
import { DirectoryLayout } from "@/components/vibe/DirectoryLayout";
import { Wand2 } from "lucide-react";

export const metadata = {
  title: "Prompt Wizard | Vibe Architect Central",
  description: "Build custom orchestration prompts with guided steps",
};

export default function WizardPage() {
  return (
    <DirectoryLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-accent/20 border border-primary-accent/50 mb-4">
            <Wand2 className="h-8 w-8 text-primary-accent" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Prompt <span className="text-primary-accent">Wizard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build powerful orchestration prompts step-by-step. Define your persona,
            set the context, and specify your task to generate production-ready prompts.
          </p>
        </div>

        {/* Wizard Component */}
        <PromptWizard />
      </div>
    </DirectoryLayout>
  );
}
