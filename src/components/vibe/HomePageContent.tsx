'use client'

import { useState } from 'react'
import { Wrench, BookOpen, Sparkles } from 'lucide-react'
import { ToolCard } from '@/components/vibe/ToolCard'
import { PromptCard } from '@/components/vibe/PromptCard'
import { DirectoryGrid } from '@/components/vibe/DirectoryLayout'
import { VibeLevelFilter, useVibeLevelFilter } from '@/components/vibe/VibeLevelFilter'
import type { Tool, Prompt } from '@/lib/supabase/types'

interface HomePageContentProps {
  tools: Tool[]
  prompts: Prompt[]
  favoriteToolIds?: string[]
  favoritePromptIds?: string[]
}

type TabType = 'tools' | 'prompts'

export function HomePageContent({ 
  tools, 
  prompts, 
  favoriteToolIds = [], 
  favoritePromptIds = [] 
}: HomePageContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('tools')
  const { selectedLevel, setSelectedLevel, filterByLevel } = useVibeLevelFilter()

  const filteredTools = filterByLevel(tools)

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-0 border-2 border-[var(--terminal-green)]">
          <button
            onClick={() => setActiveTab('tools')}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase transition-all font-mono
              ${activeTab === 'tools'
                ? 'bg-[var(--terminal-green)] text-[var(--terminal-bg)]'
                : 'text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/20'
              }
            `}
          >
            <Wrench className="w-4 h-4" />
            Tools_Directory
            <span className="ml-1 px-1.5 py-0.5 text-xs border border-current">
              {filteredTools.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase transition-all font-mono border-l-2 border-[var(--terminal-green)]
              ${activeTab === 'prompts'
                ? 'bg-[var(--terminal-purple)] text-white'
                : 'text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)]/20'
              }
            `}
          >
            <BookOpen className="w-4 h-4" />
            Prompt_Vault
            <span className="ml-1 px-1.5 py-0.5 text-xs border border-current">
              {prompts.length}
            </span>
          </button>
        </div>

        {/* Filter - Only show for tools */}
        {activeTab === 'tools' && (
          <VibeLevelFilter
            selectedLevel={selectedLevel}
            onSelect={setSelectedLevel}
          />
        )}
      </div>

      {/* Content */}
      {activeTab === 'tools' ? (
        <DirectoryGrid>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isFavorited={favoriteToolIds.includes(tool.id)}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-[var(--terminal-green)]/30">
              <Sparkles className="w-12 h-12 text-[var(--terminal-purple)] mb-4" />
              <h3 className="text-lg font-bold text-white uppercase font-mono">No_Tools_Found</h3>
              <p className="text-[var(--terminal-green)]/70 mt-1 font-mono text-sm">
                &gt; Try adjusting your filter or check back later
              </p>
            </div>
          )}
        </DirectoryGrid>
      ) : (
        <DirectoryGrid>
          {prompts.map((prompt, index) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              isFavorited={favoritePromptIds.includes(prompt.id)}
              index={index}
            />
          ))}
        </DirectoryGrid>
      )}
    </div>
  )
}
