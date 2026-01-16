# Vibe Architect - Database Backup Script
# Project: vibe code (qlsgscizfvqbdajzqtgb)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectRef = "qlsgscizfvqbdajzqtgb"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = "supabase\backups"
$BackupFile = "$BackupDir\backup_$Timestamp.sql"

Write-Host "🚀 Vibe Architect: Starting Database Backup..." -ForegroundColor Cyan

# 1. Ensure backup directory exists
if (-not (Test-Path -Path $BackupDir)) {
    Write-Host "📂 Creating backup directory: $BackupDir" -ForegroundColor Gray
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

# 2. Check Supabase Login Status (Basic check)
# We assume if they can't link, they aren't logged in.
Write-Host "🔗 Linking to Supabase Project: $ProjectRef" -ForegroundColor Yellow
try {
    # Attempt link. This might ask for password if not authenticated via token.
    # We use --password flag if we had it, but we don't.
    # Standard link command:
    npx supabase link --project-ref $ProjectRef
}
catch {
    Write-Host "❌ Failed to link project. You may need to run 'npx supabase login' first or check your internet connection." -ForegroundColor Red
    exit 1
}

# 3. Perform Dump
Write-Host "💾 Dumping database to: $BackupFile" -ForegroundColor Yellow
try {
    npx supabase db dump -f $BackupFile
    
    if (Test-Path -Path $BackupFile) {
        $Size = (Get-Item $BackupFile).Length / 1KB
        Write-Host "✅ Backup successful! Size: $($Size.ToString("N2")) KB" -ForegroundColor Green
    } else {
        throw "Backup file was not created."
    }
}
catch {
    Write-Host "❌ Database dump failed." -ForegroundColor Red
    Write-Host $_ -ForegroundColor Red
    exit 1
}
