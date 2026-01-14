'use client'

import { useState } from 'react'
import type { VibeLevel } from '@/lib/supabase/types'

interface VibeLevelFilterProps {
  selectedLevel: VibeLevel | 'all'
  onSelect: (level: VibeLevel | 'all') => void
}

const vibeLevels: { value: VibeLevel | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Levels', color: 'bg-surface hover:bg-surface/80 border-border' },
  { value: 'no-code', label: 'No-Code', color: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-400' },
  { value: 'low-code', label: 'Low-Code', color: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-400' },
  { value: 'agentic', label: 'Agentic', color: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-400' },
  { value: 'pro-orchestration', label: 'Pro Orchestration', color: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/50 text-orange-400' },
]

export function VibeLevelFilter({ selectedLevel, onSelect }: VibeLevelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {vibeLevels.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelect(level.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-industrial border transition-all
            ${selectedLevel === level.value 
              ? `${level.color} ring-2 ring-primary-accent/50` 
              : 'bg-surface/50 border-border text-muted-foreground hover:text-foreground hover:border-border/80'
            }
          `}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// Hook for managing filter state
export function useVibeLevelFilter() {
  const [selectedLevel, setSelectedLevel] = useState<VibeLevel | 'all'>('all')
  
  const filterByLevel = <T extends { vibe_level?: VibeLevel }>(items: T[]): T[] => {
    if (selectedLevel === 'all') return items
    return items.filter(item => item.vibe_level === selectedLevel)
  }
  
  return {
    selectedLevel,
    setSelectedLevel,
    filterByLevel,
  }
}
