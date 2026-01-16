import { ProjectWizard } from "@/components/wizard/project-wizard";
import { MainContainer } from "@/components/layout/main-container";

export default function NewProjectPage() {
  return (
    <MainContainer>
      <div className="space-y-16">
        {/* Header Section */}
        <section className="space-y-4 border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
          <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
            /WIZARD/NEW_PROJECT/
          </span>
          <h1 className="text-4xl font-bold tracking-tight uppercase font-mono text-[var(--terminal-green)] glitch-text">
            Project_Initialize
          </h1>
          <p className="text-[var(--terminal-text-muted)] max-w-2xl font-mono">
            &gt; Configure your AI Agent&apos;s brain. Select your stack, define your mission, and download a battle-ready blueprint.
          </p>
        </section>

        {/* Wizard Component */}
        <ProjectWizard />
      </div>
    </MainContainer>
  );
}
