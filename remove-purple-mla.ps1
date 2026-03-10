# Purple Color Removal Script
# This script removes ALL purple/pink/violet/magenta colors from the codebase

$replacements = @(
    # MLA Theme (Red/Orange)
    @{Pattern = 'purple-50'; Replacement = 'red-50'; Context = 'MLA'},
    @{Pattern = 'purple-100'; Replacement = 'red-100'; Context = 'MLA'},
    @{Pattern = 'purple-200'; Replacement = 'red-200'; Context = 'MLA'},
    @{Pattern = 'purple-300'; Replacement = 'red-300'; Context = 'MLA'},
    @{Pattern = 'purple-500'; Replacement = 'red-500'; Context = 'MLA'},
    @{Pattern = 'purple-600'; Replacement = 'red-600'; Context = 'MLA'},
    @{Pattern = 'purple-700'; Replacement = 'red-700'; Context = 'MLA'},
    @{Pattern = 'purple-800'; Replacement = 'red-800'; Context = 'MLA'},
    @{Pattern = 'purple-900'; Replacement = 'red-900'; Context = 'MLA'},
    @{Pattern = 'pink-50'; Replacement = 'orange-50'; Context = 'MLA'},
    @{Pattern = 'pink-200'; Replacement = 'orange-200'; Context = 'MLA'},
    @{Pattern = 'pink-600'; Replacement = 'orange-600'; Context = 'MLA'},
    @{Pattern = 'pink-700'; Replacement = 'orange-700'; Context = 'MLA'}
)

# MLA Files
$mlaFiles = @(
    "src\Pages\MLA\MLAResponseModal.jsx",
    "src\Pages\MLA\MLARegister.jsx",
    "src\Pages\MLA\MLALogin.jsx",
    "src\Pages\MLA\MLAHelpRequests.jsx",
    "src\Pages\MLA\MLAHelpRequestCard.jsx",
    "src\components\AssignToDepartmentModal.jsx"
)

Write-Host "🎨 Starting Purple Color Removal..." -ForegroundColor Cyan
Write-Host ""

$totalChanges = 0

foreach ($file in $mlaFiles) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "📝 Processing: $file" -ForegroundColor Yellow
        $content = Get-Content $filePath -Raw
        $originalContent = $content
        $fileChanges = 0
        
        foreach ($rep in $replacements) {
            $pattern = $rep.Pattern
            $replacement = $rep.Replacement
            
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $replacement
                $count = ([regex]::Matches($originalContent, $pattern)).Count
                $fileChanges += $count
                Write-Host "  ✓ Replaced $count instances of '$pattern' with '$replacement'" -ForegroundColor Green
            }
        }
        
        if ($fileChanges -gt 0) {
            Set-Content $filePath -Value $content -NoNewline
            $totalChanges += $fileChanges
            Write-Host "  ✅ Saved $fileChanges changes to $file" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  No changes needed" -ForegroundColor Gray
        }
        Write-Host ""
    } else {
        Write-Host "  ⚠️  File not found: $file" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "🎉 Complete! Total changes made: $totalChanges" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run this script for Official and Citizen pages with yellow/amber colors" -ForegroundColor Yellow
