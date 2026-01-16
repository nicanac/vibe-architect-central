# Database Backups

This directory contains database backups for the Supabase project.

## Automated Backup Script

We have created a PowerShell script to automate the backup process for the remote project "vibe code".

**Location**: `scripts/backup-db.ps1`

**Usage**:

```powershell
./scripts/backup-db.ps1
```

## Troubleshooting

- **Local Backup**: Requires Docker to be running. If `npx supabase status` fails, local backups with `--local` will not work.
- **Remote Backup**: Requires authentication. Run `npx supabase login` if the script fails to link the project.

## Manual Commands

To manually backup the remote production database ("vibe code"):

```bash
# Link Project (ID: qlsgscizfvqbdajzqtgb)
npx supabase link --project-ref qlsgscizfvqbdajzqtgb

# Dump Data
npx supabase db dump -f supabase/backups/my_backup.sql
```
