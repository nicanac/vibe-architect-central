
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const AI_DIR = path.join(ROOT_DIR, 'ai');
const DOT_AGENT_DIR = path.join(ROOT_DIR, '.agent');
const DOT_GITHUB_DIR = path.join(ROOT_DIR, '.github');

async function copyDir(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function syncAiFolder() {
  console.log('🔄 Syncing .agent and .github to ai folder...');

  try {
    // Ensure AI_DIR exists
    if (!fs.existsSync(AI_DIR)) {
        await fs.promises.mkdir(AI_DIR, { recursive: true });
    }

    // Sync .agent -> ai/.agent
    if (fs.existsSync(DOT_AGENT_DIR)) {
      const targetAgentDir = path.join(AI_DIR, '.agent');
      console.log(`📂 Copying ${DOT_AGENT_DIR} to ${targetAgentDir}...`);
      await copyDir(DOT_AGENT_DIR, targetAgentDir);
    } else {
        console.warn(`⚠️  Source directory not found: ${DOT_AGENT_DIR}`);
    }

    // Sync .github -> ai/.github
    if (fs.existsSync(DOT_GITHUB_DIR)) {
        const targetGithubDir = path.join(AI_DIR, '.github');
        console.log(`📂 Copying ${DOT_GITHUB_DIR} to ${targetGithubDir}...`);
        await copyDir(DOT_GITHUB_DIR, targetGithubDir);
    } else {
        console.warn(`⚠️  Source directory not found: ${DOT_GITHUB_DIR}`);
    }

    console.log('✅ AI folder sync complete!');
  } catch (error) {
    console.error('❌ Error syncing AI folder:', error);
    process.exit(1);
  }
}

syncAiFolder();
