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
        <div className="flex items-center gap-1 p-1 bg-surface rounded-industrial border border-border">
          <button
            onClick={() => setActiveTab('tools')}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-industrial transition-all
              ${activeTab === 'tools'
                ? 'bg-primary-accent text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }
            `}
          >
            <Wrench className="w-4 h-4" />
            Tools Directory
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-background/50">
              {filteredTools.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-industrial transition-all
              ${activeTab === 'prompts'
                ? 'bg-neon-success text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }
            `}
          >
            <BookOpen className="w-4 h-4" />
            Prompt Vault
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-background/50">
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
            filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isFavorited={favoriteToolIds.includes(tool.id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No tools found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filter or check back later
              </p>
            </div>
          )}
        </DirectoryGrid>
      ) : (
        <DirectoryGrid>
          {prompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              isFavorited={favoritePromptIds.includes(prompt.id)}
            />
          ))}
        </DirectoryGrid>
      )}
    </div>
  )
}
