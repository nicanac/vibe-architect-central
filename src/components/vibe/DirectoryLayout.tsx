'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Plus, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DirectoryGridProps {
  children: ReactNode
  className?: string
}

export function DirectoryGrid({ children, className = '' }: DirectoryGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  )
}

interface DirectoryShellProps {
  children: ReactNode
  title: string
  description?: string
  searchSlot?: ReactNode
}

export function DirectoryShell({ children, title, description, searchSlot }: DirectoryShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="vibe-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {searchSlot}
              <Button asChild variant="outline" className="border-primary-accent/50 hover:bg-primary-accent/20">
                <Link href="/wizard">
                  <Wand2 className="w-4 h-4 text-primary-accent" />
                  Wizard
                </Link>
              </Button>
              <Button asChild className="bg-neon-success hover:bg-neon-success/80">
                <Link href="/submit">
                  <Plus className="w-4 h-4" />
                  Submit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

// Simple layout wrapper for pages without full shell
interface DirectoryLayoutProps {
  children: ReactNode
}

export function DirectoryLayout({ children }: DirectoryLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="vibe-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary-accent transition-colors">
              Vibe Architect Central
            </Link>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="border-primary-accent/50 hover:bg-primary-accent/20">
                <Link href="/wizard">
                  <Wand2 className="w-4 h-4 text-primary-accent" />
                  Wizard
                </Link>
              </Button>
              <Button asChild className="bg-neon-success hover:bg-neon-success/80">
                <Link href="/submit">
                  <Plus className="w-4 h-4" />
                  Submit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
