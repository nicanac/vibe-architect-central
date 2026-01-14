'use client'

import { useState } from 'react'
import { Copy, Check, Play, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/vibe/FavoriteButton'
import { useVibeClipboard } from '@/lib/hooks/useVibeClipboard'
import { generateAiLink, supportsDeepLink, type AIPlatform } from '@/lib/utils/aiLinks'
import type { Prompt } from '@/lib/supabase/types'

interface PromptCardProps {
  prompt: Prompt
  isFavorited?: boolean
  showFavorite?: boolean
}

const techniqueColors: Record<string, string> = {
  'Chain of Thought': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'ReAct': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  'Persona': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  'Tree of Thoughts': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  'Few-Shot': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
}

export function PromptCard({ prompt, isFavorited = false, showFavorite = true }: PromptCardProps) {
  const { copy, copied } = useVibeClipboard({
    successMessage: 'Prompt copied! Ready to orchestrate.',
  })
  const [selectedPlatform] = useState<AIPlatform>('gemini')

  const handleCopy = () => {
    copy(prompt.content)
  }

  const handleRunInAI = () => {
    const link = generateAiLink(prompt.content, selectedPlatform)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const techniqueClass = techniqueColors[prompt.technique] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'

  return (
    <Card className="group vibe-card hover:border-neon-success/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-neon-success transition-colors">
              {prompt.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={techniqueClass}>
                {prompt.technique}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
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
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Prompt Content - Monospace Block */}
        <div className="code-block p-4 max-h-48 overflow-y-auto">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
            {prompt.content}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="flex-1 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-neon-success" />
                <span className="text-neon-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Prompt
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRunInAI}
            className="flex-1 glow-primary"
          >
            <Play className="w-4 h-4" />
            Run in AI
            {!supportsDeepLink(selectedPlatform) && (
              <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
