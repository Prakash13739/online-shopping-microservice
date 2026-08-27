# ==============================================================================
# ShopSphere - 1-Click Launch Script
# ==============================================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting ShopSphere API-First Platform                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Start Backend on Port 8080
Write-Host "`n[1/2] Starting Java Spring Boot Unified Backend on http://localhost:8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\sample micro\backend'; & 'C:\Users\prakash kumar\.maven\maven-3.10.0-rc-1\bin\mvn.cmd' spring-boot:run"

# 2. Start Frontend on Port 5173
Write-Host "`n[2/2] Starting React Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\sample micro\frontend'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  ShopSphere Platform is Launching!                     " -ForegroundColor Green
Write-Host "  - Storefront UI:    http://localhost:5173             " -ForegroundColor Green
Write-Host "  - Admin Dashboard:  http://localhost:5173/admin       " -ForegroundColor Green
Write-Host "  - System Health:    http://localhost:5173/admin/system-health" -ForegroundColor Green
Write-Host "  - Live API Monitor: http://localhost:5173/admin/api-monitor  " -ForegroundColor Green
Write-Host "  - REST Backend API: http://localhost:8080/api/products" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
