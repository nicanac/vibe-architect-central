#!/usr/bin/env npx tsx
/**
 * Cursor Directory Rules Parser
 * 
 * Parses TypeScript rule files from the cloned cursor.directory repo
 * and imports them into the Supabase instructions table.
 * 
 * Prerequisites:
 *   git clone https://github.com/pontusab/directories.git ../cursor-directory-data --depth 1
 * 
 * Usage: npx tsx scripts/scrape-cursor-rules.ts [--dry-run]
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabase client (uses env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to cloned repository - relative to project root
const REPO_PATH = path.resolve(process.cwd(), '../cursor-directory-data');
const RULES_PATH = path.join(REPO_PATH, 'packages/data/src/rules');

interface ParsedRule {
  title: string;
  slug: string;
  tags: string[];
  libs?: string[];
  content: string;
  author?: {
    name: string;
    url: string | null;
    avatar: string | null;
  };
}

/**
 * Parse TypeScript rule files using regex to extract rule objects
 */
function parseRuleFile(filePath: string): ParsedRule[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rules: ParsedRule[] = [];
  
  // Match each rule object in the array
  // This regex looks for objects with title, slug, tags, content fields
  const rulePattern = /\{\s*title:\s*["'`](.+?)["'`]\s*,\s*(?:tags:\s*\[(.*?)\]\s*,)?\s*(?:libs:\s*\[(.*?)\]\s*,)?\s*slug:\s*["'`](.+?)["'`]\s*,\s*content:\s*`([\s\S]*?)`\s*(?:,\s*author:\s*\{([\s\S]*?)\})?\s*\}/g;
  
  // Simpler approach: use a line-by-line parser
  // Extract title, slug, tags, content blocks
  
  let match;
  
  // Try to find title/slug/tags/libs/content patterns
  const titleMatches = content.matchAll(/title:\s*["'`](.+?)["'`]/g);
  const slugMatches = content.matchAll(/slug:\s*["'`](.+?)["'`]/g);
  const tagsMatches = content.matchAll(/tags:\s*\[(.*?)\]/g);
  const libsMatches = content.matchAll(/libs:\s*\[(.*?)\]/g);
  const contentMatches = content.matchAll(/content:\s*`([\s\S]*?)`/g);
  
  const titles = Array.from(titleMatches).map(m => m[1]);
  const slugs = Array.from(slugMatches).map(m => m[1]);
  const tags = Array.from(tagsMatches).map(m => 
    m[1].split(',').map(t => t.trim().replace(/["']/g, '')).filter(Boolean)
  );
  const libs = Array.from(libsMatches).map(m => 
    m[1].split(',').map(t => t.trim().replace(/["']/g, '')).filter(Boolean)
  );
  const contents = Array.from(contentMatches).map(m => m[1].trim());
  
  // Match them up
  const count = Math.min(titles.length, slugs.length, contents.length);
  
  for (let i = 0; i < count; i++) {
    // Merge tags and libs for the final tags array
    const combinedTags = [...(tags[i] || []), ...(libs[i] || [])];
    
    rules.push({
      title: titles[i],
      slug: slugs[i],
      tags: [...new Set(combinedTags)], // Deduplicate
      libs: libs[i] || [],
      content: contents[i],
    });
  }
  
  return rules;
}

/**
 * Get all TypeScript rule files from the cloned repo
 */
function getRuleFiles(): string[] {
  if (!fs.existsSync(RULES_PATH)) {
    console.error(`❌ Rules directory not found: ${RULES_PATH}`);
    console.error('   Make sure to clone the repo first:');
    console.error('   git clone https://github.com/pontusab/directories.git ../cursor-directory-data --depth 1');
    process.exit(1);
  }
  
  const files = fs.readdirSync(RULES_PATH)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => path.join(RULES_PATH, f));
  
  console.log(`📂 Debug: Found ${files.length} files in ${RULES_PATH}`);
  // Check if shadcn-ui.ts is in the list
  const shadcn = files.find(f => f.includes('shadcn'));
  if (shadcn) console.log(`   ✅ Found shadcn file: ${shadcn}`);
  else console.log(`   ❌ Shadcn file NOT found`);
  
  return files;
}

/**
 * Insert or update rules in Supabase
 */
async function upsertRules(rules: ParsedRule[], dryRun: boolean): Promise<number> {
  if (dryRun) {
    console.log(`\n🔍 [DRY RUN] Would insert ${rules.length} rules`);
    rules.slice(0, 5).forEach(r => {
      console.log(`   - ${r.title} [Tags: ${r.tags.join(', ')}]`);
    });
    if (rules.length > 5) {
      console.log(`   ... and ${rules.length - 5} more`);
    }
    return rules.length;
  }
  
  let successCount = 0;
  
  for (const rule of rules) {
    const instruction = {
      title: rule.title,
      slug: `cursor-${rule.slug}`, // Prefix to avoid conflicts
      description: `Cursor IDE coding rules for ${rule.tags.join(', ')}. Imported from cursor.directory.`,
      content: rule.content,
      category: 'rule',
      agent_types: ['cursor'],
      difficulty: 'intermediate',
      file_format: 'markdown',
      tags: rule.tags.map(t => t.toLowerCase()),
      source_url: `https://cursor.directory/rules/${rule.slug}`,
      submitted_by: null,
      usage_example: null,
    };
    
    // Upsert based on slug
    const { error } = await supabase
      .from('instructions')
      .upsert(instruction, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Failed to insert "${rule.title}":`, error.message);
    } else {
      successCount++;
    }
  }
  
  return successCount;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  console.log('🚀 Cursor Directory Rules Parser');
  console.log('=================================\n');
  
  if (dryRun) {
    console.log('🔍 Running in DRY RUN mode (no database writes)\n');
  }
  
  // Get all rule files
  const ruleFiles = getRuleFiles();
  console.log(`📂 Found ${ruleFiles.length} rule files in repo\n`);
  
  // Parse all files
  const allRules: ParsedRule[] = [];
  
  for (const file of ruleFiles) {
    const filename = path.basename(file);
    console.log(`📄 Parsing: ${filename}`);
    
    try {
      const rules = parseRuleFile(file);
      allRules.push(...rules);
      console.log(`   ✅ Found ${rules.length} rules`);
    } catch (error) {
      console.error(`   ❌ Failed to parse ${filename}:`, error);
    }
  }
  
  console.log(`\n📊 Total rules parsed: ${allRules.length}`);
  
  // Insert into database
  console.log('\n💾 Inserting into Supabase...');
  const inserted = await upsertRules(allRules, dryRun);
  
  console.log(`\n✅ Successfully processed ${inserted} rules`);
}

main();
