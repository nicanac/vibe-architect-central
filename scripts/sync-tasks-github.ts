import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TASKS_FILE = path.join(process.cwd(), 'memory-bank', 'TASKS.md');
const DRY_RUN = process.argv.includes('--dry-run');

// --- Helper Functions ---

function runCommand(command: string): string {
    const ghPath = `"C:\\Program Files\\GitHub CLI\\gh.exe"`; // Fallback path if 'gh' not in PATH
    // Try standard 'gh' first, then fallback
    try {
        if (DRY_RUN) {
            console.log(`[DRY RUN] ${command}`);
            return "";
        }
        return execSync(command, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
        // If 'gh' command fail, try absolute path
        try {
            const absoluteCommand = command.replace(/^gh/, ghPath);
            if (DRY_RUN) {
                console.log(`[DRY RUN] ${absoluteCommand}`);
                return "";
            }
            return execSync(absoluteCommand, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        } catch (error) {
            console.error(`Failed to execute command: ${command}`);
            return "";
        }
    }
}

interface GenericTask {
    status: 'done' | 'in_progress' | 'todo';
    text: string;
    phase?: string;
}

function parseTasks(): GenericTask[] {
    if (!fs.existsSync(TASKS_FILE)) {
        console.error(`Tasks file not found at ${TASKS_FILE}`);
        process.exit(1);
    }
    const content = fs.readFileSync(TASKS_FILE, 'utf-8');
    const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    console.log(`Scanning ${lines.length} lines from TASKS.md...`);

    const tasks: GenericTask[] = [];
    let currentPhase = "";

    for (const line of lines) {
        if (line.trim().startsWith('## ')) {
            currentPhase = line.trim().replace(/^##\s+/, '').trim();
        }

        const match = line.match(/^\s*-\s*\[([ x/])\]\s*(.*)$/);
        if (match) {
            const mark = match[1];
            // Remove <!-- id: ... --> comments if present
            const text = match[2].replace(/<!--.*?-->/g, '').trim();
            let status: GenericTask['status'] = 'todo';
            if (mark === 'x') status = 'done';
            if (mark === '/') status = 'in_progress';

            tasks.push({ status, text: text, phase: currentPhase });
        }
    }
    return tasks;
}

function getExistingIssues(): Map<string, number> {
    console.log("Fetching existing issues from GitHub...");
    // Get all issues (open and closed) to avoid re-creating completed ones
    // Limit to 100 for now, could page if needed
    const output = runCommand(`gh issue list --state all --limit 100 --json title,number`);
    if (!output) return new Map();

    try {
        const issues = JSON.parse(output) as { title: string; number: number }[];
        const map = new Map<string, number>();
        for (const issue of issues) {
            map.set(issue.title, issue.number);
        }
        return map;
    } catch (e) {
        console.error("Failed to parse existing issues", e);
        return new Map();
    }
}

// --- Main Sync Logic ---

async function sync() {
    console.log("Starting GitHub Sync...");
    if (DRY_RUN) console.log("--- DRY RUN MODE ---");

    // 1. Parse Tasks
    const tasks = parseTasks();
    console.log(`Parsed ${tasks.length} tasks from TASKS.md.`);

    // 2. Fetch Issues
    const existingIssues = getExistingIssues();
    console.log(`Found ${existingIssues.size} existing issues on GitHub.`);

    let created = 0;
    let skipped = 0;

    // 3. Sync
    for (const task of tasks) {
        if (task.status === 'done') continue;

        // Check for specific Issue ID reference in text: (Issue #123)
        const idMatch = task.text.match(/\(Issue #(\d+)\)/);
        const specificId = idMatch ? parseInt(idMatch[1]) : undefined;

        // Prepare Title and Body
        const title = task.text.replace(/"/g, '\\"');
        const body = `Synced from Memory Bank\n\nPhase: ${task.phase || 'General'}`;

        if (specificId) {
            // If we have a specific ID, we try to UPDATE that issue or just skip if it exists
            // Since we want to update the roadmap (Dates/Est) in the title, we should UPDATE.
            console.log(`Updating issue #${specificId}: ${task.text.substring(0, 50)}...`);
            // We use 'gh issue edit'
            // Check if it exists in 'existingIssues' just to be safe? 
            // The existingIssues map keys are titles, so can't check by ID easily without fetching IDs.
            // But 'gh issue edit' handles 404 gracefully usually or throws.
            runCommand(`gh issue edit ${specificId} --title "${title}" --body "${body}"`);
            continue;
        }

        if (existingIssues.has(task.text)) {
            skipped++;
            continue;
        }

        console.log(`Creating issue: [${task.phase}] ${task.text}`);
        runCommand(`gh issue create --title "${title}" --body "${body}" --label "sync"`);
        created++;
    }

    console.log(`\nSync Complete.`);
    console.log(`Created: ${created}`);
    console.log(`Skipped (Same Title): ${skipped}`);
}

sync().catch(console.error);
