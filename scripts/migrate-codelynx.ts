
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BASE_URL = 'https://codelynx.dev';

const PAGES = [
  // Setup
  { path: '/docs/claude-code-setup', category: 'rule', difficulty: 'beginner', agent_types: ['claude-code'] },
  // Commands
  { path: '/docs/claude-code-pro/apex-skills', category: 'skill', difficulty: 'advanced', agent_types: ['claude-code'] }, // APEX is a skill/methodology
  { path: '/docs/claude-code-pro/brainstorm', category: 'command', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/debug', category: 'command', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/clean-code', category: 'command', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/review-code', category: 'command', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/ci-experts', category: 'command', difficulty: 'advanced', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/claude-memory', category: 'rule', difficulty: 'intermediate', agent_types: ['claude-code'] },
  // Creators
  { path: '/docs/claude-code-pro/create-prompt', category: 'prompt', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/create-meta-prompts', category: 'prompt', difficulty: 'advanced', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/create-slash-commands', category: 'command', difficulty: 'advanced', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/create-skills-workflow', category: 'skill', difficulty: 'advanced', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/create-agent-skills', category: 'agent', difficulty: 'advanced', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-pro/create-hooks', category: 'hook', difficulty: 'advanced', agent_types: ['claude-code'] },
  // Agents
  { path: '/docs/agents/action', category: 'agent', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/agents/explore-codebase', category: 'agent', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/agents/explore-docs', category: 'agent', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/agents/websearch', category: 'agent', difficulty: 'intermediate', agent_types: ['claude-code'] },
  // Skills
  { path: '/docs/skills/code-review', category: 'skill', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/skills/commit-message', category: 'skill', difficulty: 'intermediate', agent_types: ['claude-code'] },
  // Hooks
  { path: '/docs/hooks/pre-commit', category: 'hook', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/hooks/post-edit', category: 'hook', difficulty: 'intermediate', agent_types: ['claude-code'] },
  // General
  { path: '/docs/claude-code-configuration', category: 'rule', difficulty: 'intermediate', agent_types: ['claude-code'] },
  { path: '/docs/claude-code-security', category: 'rule', difficulty: 'intermediate', agent_types: ['claude-code'] },
];

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Helper to extract clean text
function extractText(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().trim();
}

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function migratePage(pageDef: any) {
  const url = `${BASE_URL}${pageDef.path}`;
  console.log(`Fetching ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Title (H1)
    const title = $('h1').first().text().trim() || pageDef.path.split('/').pop();
    
    // Extract Content (Main article body)
    // Adjust selector based on CodeLynx page structure (usually main or article)
    let contentHtml = $('main').html() || $('article').html() || $('body').html();
    
    // Clean up content before markdown conversion if needed
    if (contentHtml) {
        // Remove h1 as we store it separately
        const content$ = cheerio.load(contentHtml);
        content$('h1').remove();
        contentHtml = content$.html();
    }

    const content = turndownService.turndown(contentHtml || '');

    // Extract Description (Meta or first paragraph)
    const metaDesc = $('meta[name="description"]').attr('content');
    const firstPara = $('p').first().text().trim();
    const description = metaDesc || firstPara || `Documentation for ${title}`;

    // Extract tags from keywords or content analysis
    const tags = ['codelynx', 'migration'];
    if (title.toLowerCase().includes('git')) tags.push('git');
    if (title.toLowerCase().includes('debug')) tags.push('debug');
    if (title.toLowerCase().includes('test')) tags.push('testing');
    if (content.toLowerCase().includes('typescript')) tags.push('typescript');

    const slug = generateSlug(title);

    const instruction = {
      title,
      slug,
      description,
      content,
      category: pageDef.category,
      difficulty: pageDef.difficulty,
      agent_types: pageDef.agent_types,
      file_format: 'markdown',
      tags,
      source_url: url,
    };

    // Upsert into Supabase
    const { error } = await supabase
      .from('instructions')
      .upsert(instruction, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error inserting ${title}:`, error.message);
    } else {
      console.log(`✅ Successfully migrated: ${title} (${slug})`);
    }

  } catch (error) {
    console.error(`❌ Failed to migrate ${url}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting CodeLynx migration...');
  
  for (const page of PAGES) {
    await migratePage(page);
    // Add small delay to be nice
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('✨ Migration complete!');
}

main();
