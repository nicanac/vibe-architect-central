
import fs from 'fs';
import path from 'path';

const CLAUDE_CONFIG_DIR = 'claude-code-config';
const ANTIGRAVITY_AGENT_DIR = '.agent';
const SKILLS_DEST = path.join(ANTIGRAVITY_AGENT_DIR, 'skills');
const WORKFLOWS_DEST = path.join(ANTIGRAVITY_AGENT_DIR, 'workflows');

// Ensure destination directories exist
if (!fs.existsSync(SKILLS_DEST)) fs.mkdirSync(SKILLS_DEST, { recursive: true });
if (!fs.existsSync(WORKFLOWS_DEST)) fs.mkdirSync(WORKFLOWS_DEST, { recursive: true });

function copyRecursiveSync(src: string, dest: string) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    let content = fs.readFileSync(src, 'utf-8');
    // Apply transformations even to copied skills
    content = transformContent(content);
    fs.writeFileSync(dest, content);
  }
}

function transformContent(content: string): string {
  let newContent = content;

  // Terminology replacement
  newContent = newContent
    .replace(/Claude Code/g, 'Antigravity')
    .replace(/Claude/g, 'Antigravity')
    .replace(/CLAUDE.md/g, 'MEMORY.md')
    .replace(/\.claude/g, '.agent');

  // Tool Mapping (Regex for flexible matching)
  // Grep -> grep_search
  newContent = newContent.replace(/`Grep`/g, '`grep_search`');
  // Read -> view_file
  newContent = newContent.replace(/`Read`/g, '`view_file`');
  // LS -> list_dir
  newContent = newContent.replace(/`LS`/g, '`list_dir`');
  // Run -> run_command
  newContent = newContent.replace(/`Run`/g, '`run_command`');
  // AskUserQuestion -> notify_user
  newContent = newContent.replace(/`AskUserQuestion`/g, '`notify_user`');

  return newContent;
}

function processSkills() {
  const skillsSrc = path.join(CLAUDE_CONFIG_DIR, 'skills');
  if (!fs.existsSync(skillsSrc)) return;

  console.log('Migrating Skills...');
  const items = fs.readdirSync(skillsSrc);
  for (const item of items) {
    const srcPath = path.join(skillsSrc, item);
    const destPath = path.join(SKILLS_DEST, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      console.log(`  - Copying skill: ${item}`);
      copyRecursiveSync(srcPath, destPath);
    }
  }
}

function convertToWorkflow(srcFile: string, destFile: string, type: 'command' | 'agent') {
  const content = fs.readFileSync(srcFile, 'utf-8');
  let description = 'Converted workflow';
  
  // Extract description from frontmatter if exists
  const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    if (descMatch) description = descMatch[1].trim();
  } else {
      const lines = content.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#'));
      if (lines.length > 0) description = lines[0].substring(0, 100);
  }

  description = description.replace(/[\[\]]/g, '');

  let newContent = content;
  
  if (!frontmatterMatch) {
    newContent = `---\ndescription: ${description}\n---\n\n${content}`;
  }

  // Apply detailed transformations
  newContent = transformContent(newContent);
  
  fs.writeFileSync(destFile, newContent);
  console.log(`  - Converted ${type} to workflow: ${path.basename(destFile)}`);
}

function processCommands() {
  const commandsSrc = path.join(CLAUDE_CONFIG_DIR, 'commands');
  if (!fs.existsSync(commandsSrc)) return;

  console.log('Migrating Commands to Workflows...');
  const items = fs.readdirSync(commandsSrc);
  for (const item of items) {
    const srcPath = path.join(commandsSrc, item);
    if (item.endsWith('.md')) { 
        const destPath = path.join(WORKFLOWS_DEST, item); 
        convertToWorkflow(srcPath, destPath, 'command');
    }
  }
}

function processAgents() {
  const agentsSrc = path.join(CLAUDE_CONFIG_DIR, 'agents');
  if (!fs.existsSync(agentsSrc)) return;

  console.log('Migrating Agents to Workflows...');
  const items = fs.readdirSync(agentsSrc);
  for (const item of items) {
    const srcPath = path.join(agentsSrc, item);
    if (item.endsWith('.md')) {
        const destPath = path.join(WORKFLOWS_DEST, `agent-${item}`);
        convertToWorkflow(srcPath, destPath, 'agent');
    }
  }
}

async function main() {
  console.log('🚀 Starting Migration from Claude Config to Antigravity...');
  
  processSkills();
  processCommands();
  processAgents();
  
  console.log('✨ Migration Complete!');
}

main().catch(console.error);
