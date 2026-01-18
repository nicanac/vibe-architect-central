"use client";

import * as React from "react";
import { Search, Copy, Check, Sparkles, FileText, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
    id: string;
    title: string;
    content: string;
    category: string;
    type: string;
    score: number;
}

const TYPE_COLORS: Record<string, string> = {
    skill: "text-[var(--terminal-purple)]",
    workflow: "text-[var(--terminal-green)]",
    rule: "text-[var(--terminal-cyan)]",
    guide: "text-amber-400",
};

const TYPE_LABELS: Record<string, string> = {
    skill: "SKILL",
    workflow: "WORKFLOW",
    rule: "RULE",
    guide: "GUIDE",
};

export function AIDocsSearch() {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/ai-docs/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query.trim() }),
            });

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setResults(data.results || []);
        } catch {
            setError("Failed to search documentation. Please try again.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (content: string, id: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--terminal-text-muted)]" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search AI documentation... (e.g., 'how to create a workflow')"
                            className={cn(
                                "w-full pl-10 pr-4 py-3 font-mono text-sm",
                                "bg-[var(--terminal-bg)] border-2 border-[var(--terminal-border-muted)]",
                                "text-[var(--terminal-green)] placeholder:text-[var(--terminal-text-muted)]",
                                "focus:border-[var(--terminal-green)] focus:outline-none focus:ring-0",
                                "transition-colors"
                            )}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className={cn(
                            "px-6 py-3 font-mono text-sm uppercase font-bold",
                            "border-2 border-[var(--terminal-green)] bg-[var(--terminal-green)]",
                            "text-[var(--terminal-bg)]",
                            "hover:bg-transparent hover:text-[var(--terminal-green)]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors flex items-center gap-2"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        Search
                    </button>
                </div>
            </form>

            {/* Error State */}
            {error && (
                <div className="p-4 border-2 border-red-500/50 bg-red-500/10 text-red-400 font-mono text-sm">
                    {error}
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-3">
                    <div className="text-xs text-[var(--terminal-text-muted)] font-mono uppercase">
                        Found {results.length} result{results.length !== 1 ? "s" : ""}
                    </div>

                    {results.map((result, index) => {
                        const isExpanded = expandedId === result.id;
                        const isCopied = copiedId === result.id;
                        const hexIndex = `0x${(index + 1).toString(16).padStart(2, "0").toUpperCase()}`;

                        return (
                            <div
                                key={result.id}
                                className={cn(
                                    "border-2 border-[var(--terminal-border-muted)]",
                                    "bg-[var(--terminal-bg)]",
                                    "hover:border-[var(--terminal-green)]/50",
                                    "transition-colors"
                                )}
                            >
                                {/* Result Header */}
                                <div
                                    className="p-4 cursor-pointer flex items-start justify-between gap-4"
                                    onClick={() => toggleExpand(result.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs text-[var(--terminal-text-muted)] font-mono">
                                                {hexIndex}
                                            </span>
                                            <FileText className="w-4 h-4 text-[var(--terminal-purple)]" />
                                            <h3 className="font-mono font-bold text-[var(--terminal-green)] truncate">
                                                {result.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "text-xs font-mono uppercase font-bold",
                                                    TYPE_COLORS[result.type] || "text-[var(--terminal-text-muted)]"
                                                )}
                                            >
                                                [{TYPE_LABELS[result.type] || result.type}]
                                            </span>
                                            <span className="text-xs text-[var(--terminal-text-muted)] font-mono">
                                                {result.category}
                                            </span>
                                            <span className="text-xs text-[var(--terminal-purple)] font-mono ml-auto">
                                                {result.score}% match
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(result.content, result.id);
                                            }}
                                            className={cn(
                                                "p-2 border border-[var(--terminal-border-muted)]",
                                                "hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]",
                                                "text-[var(--terminal-text-muted)]",
                                                "transition-colors"
                                            )}
                                            title="Copy content"
                                        >
                                            {isCopied ? (
                                                <Check className="w-4 h-4 text-[var(--terminal-green)]" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-[var(--terminal-text-muted)]" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-[var(--terminal-text-muted)]" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t border-[var(--terminal-border-muted)] p-4">
                                        <pre className="font-mono text-sm text-[var(--terminal-text)] whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto">
                                            {result.content}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State - only show after search */}
            {!isLoading && results.length === 0 && query && !error && (
                <div className="text-center py-12 text-[var(--terminal-text-muted)] font-mono">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No results found for &quot;{query}&quot;</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                </div>
            )}

            {/* Initial State */}
            {!query && results.length === 0 && (
                <div className="text-center py-12 text-[var(--terminal-text-muted)] font-mono border-2 border-dashed border-[var(--terminal-border-muted)]">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-[var(--terminal-purple)]" />
                    <p className="text-[var(--terminal-green)]">Search your AI tools documentation</p>
                    <p className="text-sm mt-2">
                        Try: &quot;how to create a workflow&quot; or &quot;commit message format&quot;
                    </p>
                </div>
            )}
        </div>
    );
}
