# ==============================================================================
# ShopSphere - Stop All Services Script
# ==============================================================================

Write-Host "Stopping all Java backend processes and Vite dev servers..." -ForegroundColor Yellow

# Kill Java / Spring Boot processes running on port 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Kill Vite dev server on port 5173
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "All ShopSphere processes stopped successfully." -ForegroundColor Green
