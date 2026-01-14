
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const AGENT_DIR = path.join(process.cwd(), '.agent');
const SKILLS_DIR = path.join(AGENT_DIR, 'skills');
const WORKFLOWS_DIR = path.join(AGENT_DIR, 'workflows');
const RULES_DIR = path.join(AGENT_DIR, 'rules');

// Ensure directories exist
[SKILLS_DIR, WORKFLOWS_DIR, RULES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function syncAntigravity() {
  console.log('🔄 Syncing instructions from Supabase to .agent directory...');

  const { data: instructions, error } = await supabase
    .from('instructions')
    .select('*');

  if (error) {
    console.error('Error fetching instructions:', error);
    return;
  }

  console.log(`Found ${instructions.length} instructions.`);

  for (const instruction of instructions) {
    const { category, slug, title, description, content } = instruction;
    
    // SKILLS
    if (category === 'skill') {
      const skillDir = path.join(SKILLS_DIR, slug);
      if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
      }

      const skillContent = `---
name: ${slug}
description: ${description}
---

# ${title}

${content}
`;
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);
      console.log(`✅ Synced SKILL: ${slug}`);
    } 
    
    // COMMANDS (Mapped to Workflows for now, or just scripts if strictly commands)
    // Antigravity docs say workflows are .md files in .agent/workflows
    else if (category === 'command' || category === 'workflow') {
       const workflowContent = `---
description: ${description}
---

${content}
`;
      fs.writeFileSync(path.join(WORKFLOWS_DIR, `${slug}.md`), workflowContent);
      console.log(`✅ Synced WORKFLOW: ${slug}`);
    }

    // RULES
    else if (category === 'rule') {
       const ruleContent = `---
description: ${description}
---

${content}
`;
      fs.writeFileSync(path.join(RULES_DIR, `${slug}.md`), ruleContent);
      console.log(`✅ Synced RULE: ${slug}`);
    }
  }

  console.log('✅ Antigravity Agent Sync Complete!');
}

syncAntigravity();
