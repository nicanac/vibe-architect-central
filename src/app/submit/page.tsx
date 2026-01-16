'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench, BookOpen, FileCode2 } from 'lucide-react'
import { ToolSubmissionForm } from '@/components/vibe/ToolSubmissionForm'
import { PromptSubmissionForm } from '@/components/vibe/PromptSubmissionForm'
import { InstructionForm } from '@/components/vibe/InstructionForm'
import { MainContainer } from '@/components/layout/main-container'

type SubmissionType = 'tool' | 'prompt' | 'instruction'

export default function SubmitPage() {
  const searchParams = useSearchParams()
  const [activeType, setActiveType] = useState<SubmissionType>('tool')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'instruction') {
      setActiveType('instruction')
    } else if (type === 'prompt') {
      setActiveType('prompt')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b-2 border-[var(--terminal-green)]/30">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors font-mono text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <h1 className="text-2xl font-bold text-[var(--terminal-green)] uppercase font-mono">
            Submit_to_Vibe_Architect_Central
          </h1>
          <p className="text-[var(--terminal-green)]/70 mt-1 font-mono text-sm">
            &gt; Share your favorite tools, prompts, or agent instructions with the community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <MainContainer>
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
            Tool
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
            Prompt
          </button>
          <button
            onClick={() => setActiveType('instruction')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-industrial transition-all
              ${activeType === 'instruction'
                ? 'bg-yellow-500 text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }
            `}
          >
            <FileCode2 className="w-4 h-4" />
            Instruction
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
          ) : activeType === 'prompt' ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Prompt Submission</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Contribute an orchestration prompt or technique to the Vault.
                </p>
              </div>
              <PromptSubmissionForm />
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Instruction Submission</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share agent instructions, commands, skills, hooks, or rules for AI tools.
                </p>
              </div>
              <InstructionForm />
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
      </MainContainer>
    </div>
  )
}
