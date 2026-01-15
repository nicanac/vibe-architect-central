'use client'

import Image from 'next/image'
import { ExternalLink, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/vibe/FavoriteButton'
import type { Tool, VibeLevel } from '@/lib/supabase/types'

interface ToolCardProps {
  tool: Tool
  isFavorited?: boolean
  showFavorite?: boolean
  index?: number
}

const vibeLevelLabels: Record<VibeLevel, string> = {
  'no-code': 'No-Code',
  'low-code': 'Low-Code',
  'agentic': 'Agentic',
  'pro-orchestration': 'Pro Orchestration',
}

export function ToolCard({ tool, isFavorited = false, showFavorite = true, index = 0 }: ToolCardProps) {
  const hexIndex = `0x${(index + 1).toString(16).padStart(2, '0').toUpperCase()}`
  
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
            {tool.name}
          </h3>
          
          {/* Description */}
          <p className="mt-2 text-[var(--terminal-green)]/70 text-sm leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
        
        {/* Logo */}
        {tool.logo_url && (
          <div className="shrink-0 w-12 h-12 border-2 border-[var(--terminal-border)] overflow-hidden relative bg-[var(--terminal-bg)]">
            <Image 
              src={tool.logo_url} 
              alt={tool.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className="border-[var(--terminal-purple)] text-[var(--terminal-purple)] bg-[var(--terminal-purple)]/10"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {vibeLevelLabels[tool.vibe_level]}
          </Badge>
          <Badge 
            variant="outline" 
            className="border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70"
          >
            {tool.pricing}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {showFavorite && (
            <FavoriteButton
              itemId={tool.id}
              itemType="tool"
              initialFavorited={isFavorited}
            />
          )}
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-[var(--terminal-green)]/50 hover:text-[var(--terminal-purple)] transition-colors opacity-0 group-hover:opacity-100"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="sr-only">Visit {tool.name}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
