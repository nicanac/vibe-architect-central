'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface DirectoryGridProps {
  children: ReactNode
  className?: string
}

export function DirectoryGrid({ children, className = '' }: DirectoryGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 ${className}`}>
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
    <div className="min-h-screen">
      {/* Terminal Header */}
      <header className="sticky top-16 z-40 border-b-2 border-[var(--terminal-green)]/30 bg-[var(--terminal-bg)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[var(--terminal-purple)] font-mono text-sm uppercase mb-2 block">
                /DIRECTORY/
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--terminal-green)] uppercase font-mono tracking-tight glitch-text">
                {title}
              </h1>
              {description && (
                <p className="text-[var(--terminal-green)]/70 mt-2 font-mono text-sm">
                  &gt; {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {searchSlot}
              <Link
                href="/submit"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--terminal-green)] text-[var(--terminal-bg)] pixel-border-sm hover:bg-white transition-colors font-bold uppercase text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit</span>
              </Link>
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
    <div className="min-h-screen">
      {/* Terminal Header */}
      <header className="sticky top-16 z-40 border-b-2 border-[var(--terminal-green)]/30 bg-[var(--terminal-bg)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-[var(--terminal-green)] hover:text-[var(--terminal-purple)] transition-colors uppercase font-mono tracking-tight"
            >
              Vibe_Architect_Central
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/submit"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--terminal-green)] text-[var(--terminal-bg)] pixel-border-sm hover:bg-white transition-colors font-bold uppercase text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit</span>
              </Link>
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
