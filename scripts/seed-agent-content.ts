
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const AGENT_DIR = path.join(process.cwd(), '.agent');

async function processDirectory(dirPath: string, category: string) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  console.log(`Found ${files.length} items in ${dirPath}`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const skillFile = path.join(filePath, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        await processFile(skillFile, category, file);
      } else {
        await processDirectory(filePath, category);
      }
    } else if (file.endsWith('.md')) {
      await processFile(filePath, category, path.parse(file).name);
    }
  }
}

async function processFile(filePath: string, category: string, slugHint: string) {
  try {
    console.log(`Reading: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const title = data.title || data.name || slugHint.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const description = data.description || '';
    const slug = (data.slug || slugHint).toLowerCase();
    
    console.log(`Processing: ${title} (${category})`);

    const { error } = await supabase
      .from('instructions')
      .upsert({
        title,
        slug,
        description,
        content,
        category: category as any,
        file_format: 'markdown',
        difficulty: 'intermediate',
        agent_types: ['claude'],
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`ERROR inserting ${slug}:`, error.message);
    } else {
      console.log(`SUCCESS: ${slug}`);
    }
  } catch (err) {
    console.error(`PARSE ERROR in file: ${filePath}`);
    console.error(err);
  }
}

async function main() {
  console.log('=== Starting seed process ===');
  
  console.log('\n--- Processing Workflows ---');
  await processDirectory(path.join(AGENT_DIR, 'workflows'), 'workflow');
  
  console.log('\n--- Processing Skills ---');
  await processDirectory(path.join(AGENT_DIR, 'skills'), 'skill');
  
  console.log('\n--- Processing Rules ---');
  await processDirectory(path.join(AGENT_DIR, 'rules'), 'rule');

  console.log('\n=== Seed process complete ===');
}

main().catch(console.error);
