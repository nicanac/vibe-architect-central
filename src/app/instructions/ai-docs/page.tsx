import { AIDocsSearch } from '@/components/vibe/AIDocsSearch';
import { Sparkles, Brain } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AIDocsPage() {
    return (
        <div className="space-y-12">
            {/* Header Section */}
            <section className="space-y-4 border-l-4 border-[var(--terminal-purple)] pl-6 py-4">
                <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase">
                    /DIRECTORY/INSTRUCTIONS/AI-DOCS/
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-[var(--terminal-purple)] flex items-center justify-center bg-[var(--terminal-purple)]/10">
                        <Brain className="w-6 h-6 text-[var(--terminal-purple)]" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase font-mono text-[var(--terminal-green)] glitch-text">
                        AI_Docs_Search
                    </h1>
                </div>
                <p className="text-[var(--terminal-text-muted)] max-w-2xl font-mono">
                    &gt; Search the indexed AI tools documentation using semantic search.
                    Find skills, workflows, rules, and guides that match your query.
                </p>
            </section>

            {/* Info Box */}
            <section className="border-2 border-[var(--terminal-border-muted)] bg-[var(--terminal-bg)] p-4">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[var(--terminal-purple)] mt-0.5 flex-shrink-0" />
                    <div className="text-sm font-mono text-[var(--terminal-text-muted)]">
                        <span className="text-[var(--terminal-green)]">INDEXED:</span>{' '}
                        18 documents including skills, workflows, rules, and guides from the .agent directory.
                        Powered by Pinecone vector search with multilingual-e5-large embeddings.
                    </div>
                </div>
            </section>

            {/* Search Component */}
            <section>
                <AIDocsSearch />
            </section>
        </div>
    );
}
