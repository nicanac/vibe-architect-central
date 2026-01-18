---
description: Analyze codebase and generate a complete AI-ready project blueprint folder
---

## Important: For Interactive Blueprint Creation

If you are starting a **new project from scratch**, use the `/blueprint-init` workflow instead. It will:
- Ask at least 5 questions to understand your project
- Validate latest tech versions via Context7 MCP
- Generate fully customized, dynamic blueprints
- Suggest additional tools and MCP servers

This workflow (`/generate-project-blueprint`) is for **extracting blueprints from existing codebases**.

---

## Objective

Analyze the entire codebase to extract all architectural patterns, conventions, and AI context, then generate a comprehensive `blueprint/` folder containing everything needed to quickly initialize similar projects with full AI agent support.

This blueprint can be used to create GitHub template repositories for rapid project setup.

## Process

### Step 1: Initialize Blueprint Structure

Create the blueprint directory structure:

```
blueprint/
├── .agent/
│   ├── rules/           # Coding rules and conventions
│   ├── workflows/       # Reusable workflows
│   └── AI_USAGE_GUIDE.md
├── memory-bank/
│   ├── PRD.md          # Project template
│   ├── TSD.md          # Technical template
│   └── TASKS.md        # Task template
├── templates/
│   ├── components/     # Component templates
│   ├── api/           # API route templates
│   └── configs/       # Configuration templates
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── CONVENTIONS.md
└── scripts/
    └── init-project.sh
```

### Step 2: Analyze Codebase Architecture

Scan and document the following:

**Technology Stack:**
- Framework versions (Next.js, React, etc.)
- Database and ORM
- State management
- UI libraries
- Testing frameworks
- Build tools

**Directory Structure:**
- Map all key directories
- Document purpose of each directory
- Identify naming conventions

**Patterns & Conventions:**
- Component patterns
- API route patterns
- Data fetching patterns
- Error handling patterns
- Form handling
- Authentication patterns

### Step 3: Extract AI Context

**From `.agent/` directory:**
- Copy all reusable rules to `blueprint/.agent/rules/`
- Copy generic workflows to `blueprint/.agent/workflows/`
- Create AI_USAGE_GUIDE.md with:
  - How to use workflows
  - Common commands
  - Best practices for AI assistance

**From `memory-bank/`:**
- Create template versions of PRD.md, TSD.md, TASKS.md
- Include placeholders for project-specific content
- Add instructions for filling templates

### Step 4: Generate Documentation

Create comprehensive docs:

**ARCHITECTURE.md:**
```markdown
# Architecture Overview

## Tech Stack
[List all technologies with versions]

## Directory Structure
[Documented tree structure]

## Key Patterns
[Document recurring patterns]

## Data Flow
[How data moves through the application]

## State Management
[How state is managed]
```

**SETUP.md:**
```markdown
# Project Setup Guide

## Prerequisites
[Required software/tools]

## Installation Steps
1. Clone repository
2. Install dependencies
3. Configure environment
4. Run database migrations
5. Start development server

## Environment Variables
[List all required env vars]

## Development Workflow
[Step-by-step development process]
```

**CONVENTIONS.md:**
```markdown
# Coding Conventions

## File Naming
[Rules for naming files]

## Component Structure
[How to structure components]

## API Routes
[How to create API endpoints]

## Database Queries
[Query patterns and conventions]

## Testing
[Testing conventions]

## Git Workflow
[Branch naming, commit messages]
```

### Step 5: Create Code Templates

Extract reusable code templates:

**Component Templates:**
- Server component template
- Client component template
- Layout component template
- Form component template

**API Templates:**
- GET route template
- POST route template
- Protected route template
- Error handling template

**Configuration Templates:**
- TypeScript config
- ESLint config
- Tailwind config
- Environment template

### Step 6: Generate Setup Scripts

Create `scripts/init-project.sh`:

```bash
#!/bin/bash
# Project initialization script

echo "🚀 Initializing new project from blueprint..."

# Get project details
read -p "Project name: " PROJECT_NAME
read -p "Project description: " PROJECT_DESC

# Copy blueprint structure
cp -r blueprint/.agent ./
cp -r blueprint/memory-bank ./

# Initialize memory bank
sed -i "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" memory-bank/PRD.md
sed -i "s/{{PROJECT_DESC}}/$PROJECT_DESC/g" memory-bank/PRD.md

# Initialize git
git init
git add .
git commit -m "chore: initialize project from blueprint"

echo "✅ Project initialized successfully!"
echo "📝 Next steps:"
echo "   1. Review and update memory-bank/PRD.md"
echo "   2. Configure environment variables"
echo "   3. Run setup commands"
```

### Step 7: Create Blueprint Index

Create `blueprint/README.md`:

```markdown
# Project Blueprint

This blueprint contains everything needed to quickly start a new project with full AI agent support.

## What's Included

- **/.agent/** - AI agent rules and workflows
- **/memory-bank/** - Project documentation templates
- **/templates/** - Reusable code templates
- **/docs/** - Architecture and setup documentation
- **/scripts/** - Initialization scripts

## Quick Start

### Option 1: Use as GitHub Template
1. Click "Use this template" on GitHub
2. Clone your new repository
3. Run `./scripts/init-project.sh`

### Option 2: Manual Setup
1. Copy blueprint contents to new project
2. Update memory-bank templates
3. Configure environment variables
4. Install dependencies

## AI Agent Usage

This blueprint is optimized for AI coding assistants:

- Use workflows with `/workflow-name` commands
- Check `.agent/AI_USAGE_GUIDE.md` for all available commands
- Review `.agent/rules/` for coding conventions

## Customization

- Update `.agent/rules/` for project-specific conventions
- Add workflows to `.agent/workflows/`
- Modify templates in `/templates/`
- Update documentation in `/docs/`
```

### Step 8: Package for GitHub

Create instructions for creating a GitHub template repository:

**blueprint/GITHUB_TEMPLATE_SETUP.md:**
```markdown
# Creating a GitHub Template Repository

## Steps

1. **Create new repository on GitHub**
   - Name: `[your-project]-template`
   - Description: "Blueprint template for [project type] projects"
   - Check "Template repository" option

2. **Push blueprint contents**
   ```bash
   cd blueprint
   git init
   git add .
   git commit -m "feat: initial blueprint"
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

3. **Configure repository**
   - Add topics: `template`, `blueprint`, `ai-ready`
   - Create detailed README
   - Add LICENSE

4. **Test template**
   - Click "Use this template"
   - Follow quick start guide
   - Verify all files copied correctly

## Using the Template

Anyone can now:
1. Click "Use this template" on your repository
2. Create a new repository from the template
3. Run initialization script
4. Start coding immediately with AI support
```  

### Assessment

Verify the blueprint contains:

- ✅ Complete `.agent/` configuration
- ✅ Memory bank templates
- ✅ Comprehensive documentation
- ✅ Reusable code templates
- ✅ Setup scripts
- ✅ GitHub template instructions
- ✅ All conventions documented
- ✅ All patterns extracted
- ✅ Tech stack fully documented
- ✅ AI usage guide included

## Output

The workflow creates a `blueprint/` folder in the project root containing:
- All AI agent configuration
- Complete documentation
- Reusable templates
- Setup automation
- GitHub template creation guide

This blueprint can then be used to:
1. Create GitHub template repositories
2. Quickly initialize new projects
3. Share project patterns with team
4. Onboard AI agents instantly
5. Maintain consistency across projects