
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database, Instruction } from '@/lib/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs/promises';
import { PassThrough } from 'stream';

// 1. Virtual File System Helper
type VFS = Record<string, string>;

class BlueprintService {
  static async generate(
    { name, description, stack, workflows }: 
    { name: string; description: string; stack: string[]; workflows: string[] }
  ): Promise<VFS> {
    const vfs: VFS = {};
    const supabase = (await createClient()) as SupabaseClient<Database>;
    
    // A. Generate Memory Bank
    vfs['memory-bank/PRD.md'] = `# Project: ${name}\n\n## Description\n${description}\n\n## Stack\n${stack.join(', ')}\n`;
    vfs['memory-bank/TASKS.md'] = `# Tasks\n\n- [ ] Initialize Project ${name}\n- [ ] Review PRD\n`;

    // B. Fetch Rules (Logic: Find rules matching ANY selected stack tag)
    // We explicitly cast the response to avoid strict type issues with the generic client
    const { data } = await supabase
      .from('instructions')
      .select('*')
      .overlaps('tags', stack)
      .eq('category', 'rule');
    
    const rules = data as Instruction[] | null;

    if (rules) {
      rules.forEach(rule => {
        // Use slug as filename
        vfs[`.agent/rules/${rule.slug}.md`] = rule.content;
      });
    }

    // C. Fetch Workflows
    const workflowsDir = path.join(process.cwd(), '.agent/workflows');
    for (const flow of workflows) {
      try {
        const content = await fs.readFile(path.join(workflowsDir, `${flow}.md`), 'utf-8');
        vfs[`.agent/workflows/${flow}.md`] = content;
      } catch (e) {
        console.error(`Missing workflow: ${flow}`);
      }
    }

    // D. Add Instructions on how to use
    vfs['README.md'] = `# ${name} - Agent Setup\n\nThis ZIP contains your AI Agent configuration.\n\n1. Copy \`.agent\` folder to your root.\n2. Copy \`memory-bank\` folder to your root.\n3. Configure your AI editor to use these rules.\n`;

    return vfs;
  }
}

// 2. API Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, description, techStack, selectedWorkflows } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name required' }, { status: 400 });
    }

    // Generate VFS
    const vfs = await BlueprintService.generate({
      name: projectName,
      description: description || '',
      stack: techStack || [],
      workflows: selectedWorkflows || []
    });

    // Create ZIP Stream
    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(passThrough);

    // Append files from VFS
    Object.entries(vfs).forEach(([filePath, content]) => {
      archive.append(content, { name: filePath });
    });

    archive.finalize();

    // Return stream with headers
    return new NextResponse(passThrough as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName.replace(/\s+/g, '-').toLowerCase()}-blueprint.zip"`,
      },
    });

  } catch (error) {
    console.error('Blueprint Generation Error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
