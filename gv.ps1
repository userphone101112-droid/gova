#!/usr/bin/env pwsh
# gova Git Setup Script
# Configures local git settings isolated from Windows/global SSH settings

param(
    [switch]$Setup,
    [switch]$Push,
    [switch]$Pull,
    [switch]$Status,
    [string]$Message = "",
    [switch]$Help,
    [switch]$NoVerify
)

$KEY_FILE = "$env:USERPROFILE\.ssh_local\gova\.git_deploy_key"
$KEY_FILE_UNIX = $KEY_FILE -replace '\\', '/'
$REMOTE_URL = "git@github.com-gova:userphone101112-droid/gova.git"
$SSH_CMD = "ssh -i '$KEY_FILE_UNIX' -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"

function Verify-Key {
    if (-not (Test-Path $KEY_FILE)) {
        Write-Host "[ERROR] Deploy key not found at: $KEY_FILE" -ForegroundColor Red
        Write-Host "        Run: .\setup-deploy-key.ps1 -Setup" -ForegroundColor Yellow
        return $false
    }
    return $true
}

function Run-Setup {
    Write-Host "Configuring local git settings (isolated from Windows)..." -ForegroundColor Cyan

    if (-not (Verify-Key)) { return }

    # Set SSH command locally inside .git/config (never touches Windows SSH agent or global config)
    git config --local core.sshCommand $SSH_CMD
    git config --local remote.origin.url $REMOTE_URL

    Write-Host "[OK] core.sshCommand set" -ForegroundColor Green
    Write-Host "[OK] remote.origin.url set" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying connection..." -ForegroundColor Cyan
    $result = ssh -i $KEY_FILE -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -T git@github.com 2>&1
    if ($result -match "successfully authenticated") {
        Write-Host "[OK] GitHub authentication successful" -ForegroundColor Green
    } else {
        Write-Host "[WARN] $result" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Setup complete. You can now use:" -ForegroundColor Green
    Write-Host "  git push origin main" -ForegroundColor White
    Write-Host "  .\gv.ps1 -Push" -ForegroundColor White
    Write-Host "  .\gv.ps1 -Push -Message 'your commit message'" -ForegroundColor White
}

function Run-Push {
    if (-not (Verify-Key)) { return }

    Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
    if ($NoVerify) {
        Write-Host "[INFO] Skipping pre-commit and pre-push hooks..." -ForegroundColor Yellow
        $output = git push --no-verify origin main 2>&1
    } else {
        $output = git push origin main 2>&1
    }
    Write-Host $output

    if ($output -match "main -> main" -or $output -match "up-to-date") {
        Write-Host "[OK] Push successful" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Push may have failed. Check output above." -ForegroundColor Red
    }
}

function Run-Pull {
    if (-not (Verify-Key)) { return }

    Write-Host "Pulling from origin/main..." -ForegroundColor Cyan
    $output = git pull origin main 2>&1
    Write-Host $output
    Write-Host "[OK] Pull complete" -ForegroundColor Green
}

function Run-Status {
    Write-Host "=== Git Status ===" -ForegroundColor Cyan
    git status
    Write-Host ""
    Write-Host "=== Local Git Config ===" -ForegroundColor Cyan
    git config --local --list
}

function Show-Help {
    Write-Host @"

gova Git Helper (isolated from Windows SSH/credential settings)

Usage:
    .\gv.ps1 -Setup              Configure SSH deploy key locally
    .\gv.ps1 -Push               Push current commits to origin/main
    .\gv.ps1 -Push -NoVerify      Push without pre-commit/pre-push hooks
    .\gv.ps1 -Pull               Pull latest from origin/main
    .\gv.ps1 -Status             Show git status and local config

"@
}

# Main
if ($Help -or (-not ($Setup -or $Push -or $Pull -or $Status))) {
    Show-Help
} elseif ($Setup) {
    Run-Setup
} elseif ($Push) {
    Run-Push
} elseif ($Pull) {
    Run-Pull
} elseif ($Status) {
    Run-Status
}
