
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';

// Simple frontmatter parser since we don't want unauthorized deps if possible, 
// but we might assume 'gray-matter' or similar isn't available. 
// We'll write a simple regex-based parser for robustness in this environment.

interface SkillData {
  name: string;
  description: string;
  content: string;
}

function parseMarkdown(content: string, filename: string): SkillData {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = content.match(frontmatterRegex);
  
  let name = path.basename(filename, path.extname(filename));
  let description = 'Converted from Claude Skill';
  let body = content;

  if (match) {
    const frontmatter = match[1];
    body = content.replace(frontmatterRegex, '').trim();
    
    // Simple YAML key-value parser
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    if (nameMatch) name = nameMatch[1].trim();
    
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    if (descMatch) description = descMatch[1].trim();
  }

  // Normalize content headers (e.g., # /command -> # command)
  body = body.replace(/^#\s*\//gm, '# ');

  return { name, description, content: body };
}

function parseJson(content: string, filename: string): SkillData {
  try {
    const data = JSON.parse(content);
    const name = data.name || data.title || path.basename(filename, path.extname(filename));
    const description = data.description || 'Converted from Claude JSON Skill';
    let body = data.content || data.instruction || data.body || '';
    
    if (Array.isArray(body)) {
      body = body.join('\n');
    }

    return { name, description, content: body };
  } catch (e) {
    console.error(`Error parsing JSON file ${filename}:`, e);
    return { 
      name: path.basename(filename, path.extname(filename)), 
      description: 'Error parsing JSON', 
      content: content 
    };
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      input: {
        type: 'string',
        short: 'i',
        default: '.',
      },
      output: {
        type: 'string',
        short: 'o',
        default: '.agent/skills',
      },
    },
  });

  const inputDir = values.input!;
  const outputDir = values.output!;

  console.log(`🚀 Starting conversion from '${inputDir}' to '${outputDir}'...`);

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory '${inputDir}' does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) continue;

    let skillData: SkillData | null = null;
    const content = fs.readFileSync(filePath, 'utf-8');

    if (file.endsWith('.md')) {
      console.log(`Processing Markdown: ${file}`);
      skillData = parseMarkdown(content, file);
    } else if (file.endsWith('.json')) {
      console.log(`Processing JSON: ${file}`);
      skillData = parseJson(content, file);
    }

    if (skillData) {
      const slug = slugify(skillData.name);
      const skillDir = path.join(outputDir, slug);
      
      if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
      }

      const skillContent = `---
name: ${skillData.name}
description: ${skillData.description}
---

${skillData.content}
`;
      
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);
      console.log(`✅ Created ${skillDir}/SKILL.md`);
      count++;
    }
  }

  console.log(`\n✨ Conversion complete! Converted ${count} skills.`);
}

main().catch(console.error);
