
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database, Instruction } from '@/lib/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  const supabase = (await createClient()) as SupabaseClient<Database>;
  const workflowsDir = path.join(process.cwd(), '.agent/workflows');

  try {
    // 1. Fetch available tags/libs from Supabase to serve as "Stack" options
    // We want distinct tags to let users build their own stack
    const { data } = await supabase
      .from('instructions')
      .select('tags, libs, title, slug')
      .eq('category', 'rule');
    
    const rules = data as Instruction[] | null;

    // Aggregate tags for the UI "Custom Stack" picker
    const tagCounts: Record<string, number> = {};
    rules?.forEach(rule => {
      rule.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([tag]) => tag);

    // 2. Scan available workflows from local file system
    let workflows: string[] = [];
    try {
        const files = await fs.readdir(workflowsDir);
        workflows = files.filter(f => f.endsWith('.md'));
    } catch (e) {
        console.warn("Could not read workflows dir", e);
    }

    return NextResponse.json({
      tags: popularTags,
      workflows: workflows.map(w => w.replace('.md', '')),
      // We can also send full rule objects if we want a smarter client picker
      rules: rules?.map(r => ({ ...r, content: undefined })) // Light payload
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}
