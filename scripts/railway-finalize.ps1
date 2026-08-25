# Railway CORS finalize script
$ErrorActionPreference = 'Stop'

$BACKEND_URL  = 'https://backend-production-b83b.up.railway.app'
$FRONTEND_URL = 'https://frontend-production-b6c7b.up.railway.app'

function Set-RailwayVar([string]$key, [string]$value) {
  if ([string]::IsNullOrEmpty($value)) { return }
  Write-Host "  $key = $value" -ForegroundColor Cyan
  cmd /c "railway variable set `"$key=$value`" --skip-deploys" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Failed to set $key" }
}

Write-Host '=== Updating backend FRONTEND_URL/APP_URL ===' -ForegroundColor Yellow
railway service link backend
Set-RailwayVar 'FRONTEND_URL' $FRONTEND_URL
Set-RailwayVar 'APP_URL'      $FRONTEND_URL

Write-Host '=== Re-deploying backend ===' -ForegroundColor Yellow
railway up backend
Write-Host 'Backend re-deployed.' -ForegroundColor Green

Write-Host ''
Write-Host '=== Updating frontend NEXT_PUBLIC_SITE_URL/APP_URL ===' -ForegroundColor Yellow
railway service link frontend
Set-RailwayVar 'NEXT_PUBLIC_SITE_URL' $FRONTEND_URL
Set-RailwayVar 'NEXT_PUBLIC_APP_URL'  $FRONTEND_URL

Write-Host '=== Re-deploying frontend ===' -ForegroundColor Yellow
railway up frontend
Write-Host 'Frontend re-deployed.' -ForegroundColor Green

Write-Host ''
Write-Host '=== DONE ===' -ForegroundColor Green
Write-Host "Backend:  $BACKEND_URL"  -ForegroundColor Cyan
Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "API docs: $BACKEND_URL/docs" -ForegroundColor DarkCyan
