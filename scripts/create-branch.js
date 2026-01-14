#!/usr/bin/env node

/**
 * Branch Creation Script
 * Creates properly formatted git branches following naming conventions.
 * 
 * Format: username/type/description
 * Example: nicanac/feature/add-user-authentication
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Branch types with descriptions
const BRANCH_TYPES = {
    '1': { type: 'feature', description: 'New feature or enhancement', emoji: '✨' },
    '2': { type: 'bugfix', description: 'Bug fix (non-urgent)', emoji: '🐛' },
    '3': { type: 'hotfix', description: 'Urgent fix for production', emoji: '🚑' },
    '4': { type: 'refactor', description: 'Code refactoring', emoji: '♻️' },
    '5': { type: 'docs', description: 'Documentation changes', emoji: '📚' },
    '6': { type: 'test', description: 'Adding or updating tests', emoji: '🧪' },
    '7': { type: 'chore', description: 'Maintenance tasks', emoji: '🔧' },
    '8': { type: 'release', description: 'Release preparation', emoji: '🚀' }
};

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m'
};

function print (text, color = 'reset') {
    console.log(`${colors[color]}${text}${colors.reset}`);
}

function printHeader () {
    console.log('\n');
    print('╔════════════════════════════════════════════════════════╗', 'cyan');
    print('║           🌿 Git Branch Creator                        ║', 'cyan');
    print('║     Create standardized branches with ease             ║', 'cyan');
    print('╚════════════════════════════════════════════════════════╝', 'cyan');
    console.log('\n');
}

function printBranchTypes () {
    print('Select the type of branch you want to create:\n', 'bright');

    Object.entries(BRANCH_TYPES).forEach(([key, { type, description, emoji }]) => {
        console.log(`  ${colors.cyan}[${key}]${colors.reset} ${emoji}  ${colors.bright}${type.padEnd(10)}${colors.reset} - ${colors.dim}${description}${colors.reset}`);
    });
    console.log('\n');
}

function ask (question) {
    return new Promise((resolve) => {
        rl.question(`${colors.yellow}${question}${colors.reset}`, (answer) => {
            resolve(answer.trim());
        });
    });
}

function exec (command, silent = false) {
    try {
        const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
        return { success: true, output: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function getGitUsername () {
    try {
        // Try to get GitHub username from remote URL
        const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
        const match = remoteUrl.match(/github\.com[:/]([^/]+)\//);
        if (match) return match[1];

        // Fallback to git config user.name
        const username = execSync('git config user.name', { encoding: 'utf8' }).trim();
        return username.toLowerCase().replace(/\s+/g, '-');
    } catch {
        return null;
    }
}

function getCurrentBranch () {
    try {
        return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch {
        return null;
    }
}

function getDefaultBranch () {
    try {
        // Try to get the default branch from remote
        const result = execSync('git remote show origin 2>/dev/null | grep "HEAD branch" | cut -d: -f2', {
            encoding: 'utf8',
            shell: true
        }).trim();
        return result || 'main';
    } catch {
        // Check if main or master exists
        try {
            execSync('git rev-parse --verify main', { encoding: 'utf8', stdio: 'pipe' });
            return 'main';
        } catch {
            return 'master';
        }
    }
}

function slugify (text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single
        .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
        .substring(0, 50);             // Limit length
}

function printNextSteps (branchName, branchType) {
    console.log('\n');
    print('╔════════════════════════════════════════════════════════╗', 'green');
    print('║                 ✅ Branch Created!                     ║', 'green');
    print('╚════════════════════════════════════════════════════════╝', 'green');
    console.log('\n');

    print(`📍 You are now on branch: ${branchName}`, 'bright');
    console.log('\n');

    print('📋 Next Steps:', 'yellow');
    console.log('\n');

    print('1. Make your changes to the codebase', 'dim');
    console.log('\n');

    print('2. Stage your changes:', 'dim');
    print(`   git add .`, 'cyan');
    console.log('\n');

    print('3. Commit with a conventional message:', 'dim');
    const commitType = branchType === 'bugfix' || branchType === 'hotfix' ? 'fix' :
        branchType === 'docs' ? 'docs' :
            branchType === 'test' ? 'test' :
                branchType === 'refactor' ? 'refactor' :
                    branchType === 'chore' ? 'chore' : 'feat';
    print(`   git commit -m "${commitType}(scope): your message here"`, 'cyan');
    console.log('\n');

    print('4. Push your branch to remote:', 'dim');
    print(`   git push -u origin ${branchName}`, 'cyan');
    console.log('\n');

    print('5. Create a Pull Request to merge into main', 'dim');
    console.log('\n');

    print('─────────────────────────────────────────────────────────', 'dim');
    print('💡 Quick copy-paste command:', 'yellow');
    print(`   git add . && git commit -m "${commitType}: " && git push -u origin ${branchName}`, 'cyan');
    console.log('\n');
}

async function main () {
    printHeader();

    // Check if we're in a git repository
    const gitCheck = exec('git rev-parse --is-inside-work-tree', true);
    if (!gitCheck.success) {
        print('❌ Error: Not a git repository. Please run this from a git project.', 'red');
        rl.close();
        process.exit(1);
    }

    // Get username
    let username = getGitUsername();
    if (!username) {
        username = await ask('👤 Enter your username: ');
    } else {
        print(`👤 Detected username: ${username}`, 'dim');
    }

    if (!username) {
        print('❌ Error: Username is required.', 'red');
        rl.close();
        process.exit(1);
    }

    // Show branch types
    printBranchTypes();

    // Get branch type
    let typeChoice = await ask('Enter your choice [1-8]: ');

    while (!BRANCH_TYPES[typeChoice]) {
        print('❌ Invalid choice. Please enter a number between 1 and 8.', 'red');
        typeChoice = await ask('Enter your choice [1-8]: ');
    }

    const selectedType = BRANCH_TYPES[typeChoice];
    print(`\n${selectedType.emoji} Selected: ${selectedType.type}`, 'green');

    // Get branch description
    console.log('\n');
    const description = await ask('📝 Describe your branch (e.g., "add user authentication"): ');

    if (!description) {
        print('❌ Error: Description is required.', 'red');
        rl.close();
        process.exit(1);
    }

    const slugifiedDescription = slugify(description);
    const branchName = `${username}/${selectedType.type}/${slugifiedDescription}`;

    console.log('\n');
    print('─────────────────────────────────────────────────────────', 'dim');
    print(`🌿 Branch to create: ${branchName}`, 'magenta');
    print('─────────────────────────────────────────────────────────', 'dim');
    console.log('\n');

    const confirm = await ask('Proceed? [Y/n]: ');

    if (confirm.toLowerCase() === 'n') {
        print('❌ Cancelled.', 'red');
        rl.close();
        process.exit(0);
    }

    // Get default branch
    const defaultBranch = getDefaultBranch();
    const currentBranch = getCurrentBranch();

    console.log('\n');
    print('🔄 Setting up branch...', 'yellow');

    // Step 1: Checkout to main/master
    if (currentBranch !== defaultBranch) {
        print(`\n📍 Switching to ${defaultBranch} branch...`, 'dim');
        const checkoutResult = exec(`git checkout ${defaultBranch}`, true);
        if (!checkoutResult.success) {
            print(`❌ Error switching to ${defaultBranch}: ${checkoutResult.error}`, 'red');
            rl.close();
            process.exit(1);
        }
        print(`   ✓ Switched to ${defaultBranch}`, 'green');
    }

    // Step 2: Pull latest changes
    print(`\n📥 Pulling latest changes from ${defaultBranch}...`, 'dim');
    const pullResult = exec(`git pull origin ${defaultBranch}`, true);
    if (pullResult.success) {
        print('   ✓ Updated with latest changes', 'green');
    } else {
        print('   ⚠️ Could not pull (might be offline or no remote)', 'yellow');
    }

    // Step 3: Create and checkout new branch
    print(`\n🌿 Creating branch: ${branchName}...`, 'dim');
    const createResult = exec(`git checkout -b "${branchName}"`, true);
    if (!createResult.success) {
        print(`❌ Error creating branch: ${createResult.error}`, 'red');
        rl.close();
        process.exit(1);
    }
    print('   ✓ Branch created and checked out', 'green');

    // Print next steps
    printNextSteps(branchName, selectedType.type);

    rl.close();
}

main().catch((error) => {
    print(`❌ Error: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
});
