'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Wrench, BookOpen } from 'lucide-react'
import { ToolSubmissionForm } from '@/components/vibe/ToolSubmissionForm'
import { PromptSubmissionForm } from '@/components/vibe/PromptSubmissionForm'

type SubmissionType = 'tool' | 'prompt'

export default function SubmitPage() {
  const [activeType, setActiveType] = useState<SubmissionType>('tool')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="vibe-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4">
            Submit to Vibe Architect Central
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your favorite tools or orchestration prompts with the community
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Type Selector */}
        <div className="flex items-center gap-2 p-1 bg-surface rounded-industrial border border-border mb-8">
          <button
            onClick={() => setActiveType('tool')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-industrial transition-all
              ${activeType === 'tool'
                ? 'bg-primary-accent text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }
            `}
          >
            <Wrench className="w-4 h-4" />
            Submit a Tool
          </button>
          <button
            onClick={() => setActiveType('prompt')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-industrial transition-all
              ${activeType === 'prompt'
                ? 'bg-neon-success text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }
            `}
          >
            <BookOpen className="w-4 h-4" />
            Submit a Prompt
          </button>
        </div>

        {/* Form Container */}
        <div className="vibe-card p-6">
          {activeType === 'tool' ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Tool Submission</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share an AI-powered development tool that helps vibe architects build faster.
                </p>
              </div>
              <ToolSubmissionForm />
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Prompt Submission</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Contribute an orchestration prompt or technique to the Vault.
                </p>
              </div>
              <PromptSubmissionForm />
            </>
          )}
        </div>

        {/* Guidelines */}
        <div className="mt-8 p-4 rounded-industrial border border-border bg-surface/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">Submission Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All submissions are reviewed before publishing</li>
            <li>• Ensure descriptions are accurate and helpful</li>
            <li>• No spam, affiliate links, or low-quality content</li>
            <li>• Focus on tools and prompts relevant to AI-assisted development</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
