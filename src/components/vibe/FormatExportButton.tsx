'use client';

import { useState } from 'react';
import { Download, RefreshCw, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectFormat, convertToAntigravity, convertToClaude } from '@/lib/utils/format-converter';
import { toast } from 'sonner';

interface FormatExportButtonProps {
  title: string;
  content: string;
  className?: string;
}

export function FormatExportButton({ title, content, className }: FormatExportButtonProps) {
  const [currentContent, setCurrentContent] = useState(content);

  const handleDownload = (format: 'antigravity' | 'claude') => {
    try {
      let finalContent = currentContent;
      let extension = 'md';
      
      if (format === 'antigravity') {
        finalContent = convertToAntigravity(currentContent);
      } else {
        finalContent = convertToClaude(currentContent);
      }
      
      // Create blob and download
      const blob = new Blob([finalContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${format}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded as ${format === 'antigravity' ? 'Antigravity Markdown' : 'Claude XML'}`);
    } catch (e) {
      toast.error('Failed to convert content');
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <Button 
        variant="outline" 
        onClick={() => handleDownload('antigravity')}
        className="text-xs font-mono uppercase border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)]"
      >
        <Download className="w-3 h-3 mr-2" />
        Export .md
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleDownload('claude')}
        className="text-xs font-mono uppercase border-[var(--terminal-purple)] text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)] hover:text-white"
      >
        <FileJson className="w-3 h-3 mr-2" />
        Export .xml
      </Button>
    </div>
  );
}
