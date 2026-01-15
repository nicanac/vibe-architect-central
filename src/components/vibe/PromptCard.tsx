'use client'

import { useState } from 'react'
import { Copy, Check, Play, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/vibe/FavoriteButton'
import { useVibeClipboard } from '@/lib/hooks/useVibeClipboard'
import { generateAiLink, supportsDeepLink, type AIPlatform } from '@/lib/utils/aiLinks'
import type { Prompt } from '@/lib/supabase/types'

interface PromptCardProps {
  prompt: Prompt
  isFavorited?: boolean
  showFavorite?: boolean
  index?: number
}

const techniqueColors: Record<string, string> = {
  'Chain of Thought': 'border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10',
  'ReAct': 'border-[var(--terminal-green)] text-[var(--terminal-green)] bg-[var(--terminal-green)]/10',
  'Persona': 'border-amber-500 text-amber-400 bg-amber-500/10',
  'Tree of Thoughts': 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
  'Few-Shot': 'border-pink-500 text-pink-400 bg-pink-500/10',
}

export function PromptCard({ prompt, isFavorited = false, showFavorite = true, index = 0 }: PromptCardProps) {
  const { copy, copied } = useVibeClipboard({
    successMessage: 'Prompt copied! Ready to orchestrate.',
  })
  const [selectedPlatform] = useState<AIPlatform>('gemini')
  const hexIndex = `0x${(index + 1).toString(16).padStart(2, '0').toUpperCase()}`

  const handleCopy = () => {
    copy(prompt.content)
  }

  const handleRunInAI = () => {
    const link = generateAiLink(prompt.content, selectedPlatform)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const techniqueClass = techniqueColors[prompt.technique] || 'border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70'

  return (
    <div className="group border-2 border-[var(--terminal-green)]/30 p-6 hover:bg-[var(--terminal-green)]/10 transition-all relative">
      {/* Hex Index */}
      <span className="absolute top-2 right-2 text-xs text-[var(--terminal-green)]/30 font-mono">
        {hexIndex}
      </span>
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-[var(--terminal-green)] transition-colors font-mono">
            {prompt.title}
          </h3>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={techniqueClass}>
              {prompt.technique}
            </Badge>
            <Badge 
              variant="outline" 
              className="border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70"
            >
              {prompt.target_ai}
            </Badge>
          </div>
        </div>
        
        {showFavorite && (
          <FavoriteButton
            itemId={prompt.id}
            itemType="prompt"
            initialFavorited={isFavorited}
          />
        )}
      </div>
      
      {/* Prompt Content */}
      <div className="mt-4 border-2 border-[var(--terminal-border)] p-4 max-h-48 overflow-y-auto bg-[var(--terminal-bg)]">
        <pre className="text-sm text-[var(--terminal-green)] whitespace-pre-wrap font-mono leading-relaxed">
          {prompt.content}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold uppercase text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy_Prompt
            </>
          )}
        </button>
        <button
          onClick={handleRunInAI}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--terminal-purple)] text-white pixel-border-sm hover:translate-y-0.5 transition-all font-bold uppercase text-sm"
        >
          <Play className="w-4 h-4" />
          Run_In_AI
          {!supportsDeepLink(selectedPlatform) && (
            <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
          )}
        </button>
      </div>
    </div>
  )
}
