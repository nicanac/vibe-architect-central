'use client'

import Image from 'next/image'
import { ExternalLink, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/vibe/FavoriteButton'
import type { Tool, VibeLevel } from '@/lib/supabase/types'

interface ToolCardProps {
  tool: Tool
  isFavorited?: boolean
  showFavorite?: boolean
}

const vibeLevelLabels: Record<VibeLevel, string> = {
  'no-code': 'No-Code',
  'low-code': 'Low-Code',
  'agentic': 'Agentic',
  'pro-orchestration': 'Pro Orchestration',
}

export function ToolCard({ tool, isFavorited = false, showFavorite = true }: ToolCardProps) {
  return (
    <Card className="group vibe-card hover:border-primary-accent/50 transition-all duration-300 hover:glow-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-text-primary group-hover:text-primary-accent transition-colors truncate">
              {tool.name}
            </CardTitle>
            <CardDescription className="mt-1 text-text-muted line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
          {tool.logo_url && (
            <div className="shrink-0 w-12 h-12 rounded-industrial bg-background border border-border overflow-hidden relative">
              <Image 
                src={tool.logo_url} 
                alt={tool.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={tool.vibe_level}>
              <Sparkles className="w-3 h-3 mr-1" />
              {vibeLevelLabels[tool.vibe_level]}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
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
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span className="sr-only">Visit {tool.name}</span>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
