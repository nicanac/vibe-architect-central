import fs from 'fs';
import path from 'path';

const NOTION_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = "f89cc142-aa02-4a72-9e3c-fcfded8fffb0";
const TASKS_FILE = path.join(process.cwd(), 'memory-bank', 'TASKS.md');

const NOTION_VERSION = "2022-06-28";

async function notionRequest(endpoint: string, method: string, body?: any) {
    const headers = {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    };

    const url = `https://api.notion.com/v1/${endpoint}`;
    try {
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Notion API error: ${res.status} ${res.statusText} - ${text}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Request failed: ${method} ${url}`, error);
        throw error;
    }
}

// Fetch all existing tasks (title -> id)
async function fetchExistingTasks() {
    let hasMore = true;
    let cursor = undefined;
    const taskMap = new Map<string, string>(); // Title -> PageID

    while (hasMore) {
        const res: any = await notionRequest(`databases/${DATABASE_ID}/query`, 'POST', {
            page_size: 100,
            start_cursor: cursor,
            filter: {
                property: "Task",
                title: {
                    is_not_empty: true
                }
            }
        });

        for (const page of res.results) {
            const titleProp = page.properties["Task"];
            if (titleProp && titleProp.title && titleProp.title.length > 0) {
                const title = titleProp.title.map((t: any) => t.plain_text).join("");
                taskMap.set(title, page.id);
            }
        }

        hasMore = res.has_more;
        cursor = res.next_cursor;
    }

    return taskMap;
}

interface TaskItem {
    status: 'done' | 'in_progress' | 'todo';
    text: string;
    phase?: string;
}

function parseTasks(): TaskItem[] {
    const content = fs.readFileSync(TASKS_FILE, 'utf-8');
    // Normalize line endings to avoid regex issues with \r
    const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    console.log(`Scanning ${lines.length} lines from TASKS.md...`);

    const tasks: TaskItem[] = [];
    let currentPhase = "";

    for (const line of lines) {
        if (line.trim().startsWith('## ')) {
            currentPhase = line.trim().replace(/^##\s+/, '').trim();
        }

        const match = line.match(/^\s*-\s*\[([ x/])\]\s*(.*)$/);
        if (match) {
            const mark = match[1];
            const text = match[2].trim();
            let status: TaskItem['status'] = 'todo';
            if (mark === 'x') status = 'done';
            if (mark === '/') status = 'in_progress';

            tasks.push({ status, text, phase: currentPhase });
        }
    }
    return tasks;
}

async function sync() {
    console.log("Starting sync...");

    // 1. Get existing
    console.log("Fetching existing tasks from Notion...");
    const existingTasks = await fetchExistingTasks();
    console.log(`Found ${existingTasks.size} existing tasks.`);

    // 2. Parse Markdown
    const tasks = parseTasks();
    console.log(`Parsed ${tasks.length} tasks from TASKS.md.`);

    // 3. Sync
    let created = 0;
    let updated = 0;

    for (const task of tasks) {
        const existingId = existingTasks.get(task.text);

        const properties: any = {
            "Task": {
                title: [
                    {
                        text: {
                            content: task.text
                        }
                    }
                ]
            },
            "Checked": {
                checkbox: task.status === 'done'
            }
        };

        if (existingId) {
            process.stdout.write(`.`);
            await notionRequest(`pages/${existingId}`, 'PATCH', {
                properties: {
                    "Checked": { checkbox: task.status === 'done' }
                }
            });
            updated++;
        } else {
            process.stdout.write(`+`);
            await notionRequest(`pages`, 'POST', {
                parent: { database_id: DATABASE_ID },
                properties: properties
            });
            created++;
        }

        await new Promise(r => setTimeout(r, 350));
    }

    console.log(`\nSync Complete.`);
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
}

sync().catch(console.error);
