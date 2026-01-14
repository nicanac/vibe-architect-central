
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
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

const SKILLS_DIR = path.join(process.cwd(), '.github/skills');

async function importSkills() {
  console.log(`🔍 Scanning ${SKILLS_DIR}...`);

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Directory not found: ${SKILLS_DIR}`);
    return;
  }

  // Find all SKILL.md files recursively
  const skillFiles: string[] = [];
  
  function findSkills(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findSkills(fullPath);
      } else if (file === 'SKILL.md') {
        skillFiles.push(fullPath);
      }
    }
  }

  findSkills(SKILLS_DIR);
  console.log(`Found ${skillFiles.length} skill files.`);

  for (const filePath of skillFiles) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Fallback if no frontmatter name
    const folderName = path.dirname(filePath).split(path.sep).pop()!;
    const title = data.name || data.title || folderName;
    const slug = (data.slug || title.toLowerCase().replace(/\s+/g, '-'));
    const description = data.description || `Skill definition for ${title}`;
    
    // Default metadata
    const category = 'skill';
    const difficulty = data.difficulty || 'intermediate';
    const agent_types = data.agent_types || ['claude-code', 'cursor'];
    const tags = data.tags || [folderName];

    console.log(`Processing: ${title} (${slug})...`);

    const instruction = {
      title,
      slug,
      description,
      content, // Content without frontmatter
      category,
      difficulty,
      agent_types,
      file_format: 'markdown',
      tags,
      source_url: `file://${filePath}`,
      submitted_by: null // System import
    };

    const { error } = await supabase
      .from('instructions')
      .upsert(instruction, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error importing ${title}:`, error.message);
    } else {
      console.log(`✅ Imported skill: ${title}`);
    }
  }
}

importSkills();
