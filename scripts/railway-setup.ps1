# Nita Clinics - Railway setup script (v3 - simple Start-Process)
$ErrorActionPreference = 'Stop'

$PG_URL = 'postgresql://postgres:XCwekcbXOePBHcohGdzSiwMFBWBdyoEG@altaria.proxy.rlwy.net:27455/railway'
$REDIS_URL = 'redis://default:dVuZEDniTadgjRfeZSHEvVyzUNmMVgpG@hopper.proxy.rlwy.net:13472'

$BACKEND_NAME  = 'backend'
$FRONTEND_NAME = 'frontend'

function New-Secret([int]$len = 64) {
  # Use only URL/cmd-safe chars: A-Z a-z 0-9 + _ - =
  $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_=-'
  -join ((1..$len) | ForEach-Object { $chars[(Get-Random -Max $chars.Length)] })
}
$JWT_SECRET       = New-Secret 64
$JWT_REF_SECRET   = New-Secret 64
$JWT_RESET_SECRET = New-Secret 64

function Set-RailwayVar([string]$key, [string]$value) {
  if ([string]::IsNullOrEmpty($value)) {
    Write-Host "  $key = (skipped - empty)" -ForegroundColor DarkGray
    return
  }
  Write-Host "  $key = <hidden>" -ForegroundColor Gray
  # Use cmd /c to call railway with proper escaping
  $cmdLine = "railway variable set `"$key=$value`" --skip-deploys"
  cmd /c $cmdLine
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to set $key"
  }
}

Write-Host '=== Linking to backend service ===' -ForegroundColor Cyan
railway service link $BACKEND_NAME

Write-Host '=== Setting backend env vars ===' -ForegroundColor Cyan
Set-RailwayVar 'NODE_ENV' 'production'
Set-RailwayVar 'PORT' '3001'
Set-RailwayVar 'API_PREFIX' 'api/v1'
Set-RailwayVar 'FRONTEND_URL' 'https://PLACEHOLDER.up.railway.app'
Set-RailwayVar 'DATABASE_URL' $PG_URL
Set-RailwayVar 'REDIS_URL' $REDIS_URL
Set-RailwayVar 'JWT_SECRET' $JWT_SECRET
Set-RailwayVar 'JWT_EXPIRES_IN' '7d'
Set-RailwayVar 'JWT_REFRESH_SECRET' $JWT_REF_SECRET
Set-RailwayVar 'JWT_REFRESH_EXPIRES_IN' '30d'
Set-RailwayVar 'JWT_RESET_SECRET' $JWT_RESET_SECRET
Set-RailwayVar 'JWT_RESET_EXPIRES_IN' '15m'
Set-RailwayVar 'CLOUDINARY_CLOUD_NAME' ''
Set-RailwayVar 'CLOUDINARY_API_KEY' ''
Set-RailwayVar 'CLOUDINARY_API_SECRET' ''
Set-RailwayVar 'SMTP_HOST' 'localhost'
Set-RailwayVar 'SMTP_PORT' '1025'
Set-RailwayVar 'SMTP_USER' ''
Set-RailwayVar 'SMTP_PASS' ''
Set-RailwayVar 'SMTP_FROM' 'noreply@nitaclinics.com'
Set-RailwayVar 'SMS_PROVIDER' 'mock'
Set-RailwayVar 'WHATSAPP_PROVIDER' 'mock'
Set-RailwayVar 'OPENAI_API_KEY' 'sk-local-development-placeholder'
Set-RailwayVar 'AZURE_OPENAI_ENDPOINT' 'https://dhirendrayadav4999-1977-resource.services.ai.azure.com/openai/deployments'
Set-RailwayVar 'AZURE_OPENAI_API_KEY' ''
Set-RailwayVar 'AZURE_OPENAI_DEPLOYMENT' 'Deepseek-V4-Pro'
Set-RailwayVar 'AZURE_OPENAI_API_VERSION' '2024-12-01-preview'
Set-RailwayVar 'PAYMENT_SANDBOX_MODE' 'true'
Set-RailwayVar 'ESEWA_MERCHANT_CODE' 'EPAYTEST'
Set-RailwayVar 'ESEWA_SECRET_KEY' '8gBm/:&EnhH.1/q'
Set-RailwayVar 'ESEWA_BASE_URL' 'https://rc-epay.esewa.com.np'
Set-RailwayVar 'KHALTI_PUBLIC_KEY' ''
Set-RailwayVar 'KHALTI_SECRET_KEY' ''
Set-RailwayVar 'KHALTI_BASE_URL' 'https://a.khalti.com'
Set-RailwayVar 'FONEPAY_MERCHANT_CODE' ''
Set-RailwayVar 'FONEPAY_SECRET_KEY' ''
Set-RailwayVar 'FONEPAY_BASE_URL' 'https://dev-clientapi.fonepay.com'
Set-RailwayVar 'FONEPAY_VERIFY_URL' 'https://dev-merchantapi.fonepay.com'
Set-RailwayVar 'FONEPAY_USERNAME' ''
Set-RailwayVar 'FONEPAY_PASSWORD' ''
Set-RailwayVar 'APP_URL' 'https://PLACEHOLDER.up.railway.app'
Set-RailwayVar 'THROTTLE_TTL' '60'
Set-RailwayVar 'THROTTLE_LIMIT' '100'

Write-Host '=== Backend vars set. Deploying backend ===' -ForegroundColor Cyan
railway up $BACKEND_NAME

Write-Host '=== Generating backend public domain ===' -ForegroundColor Cyan
railway domain *> $null
$backendDomain = (railway domain 2>$null | Select-Object -First 1).Trim()
Write-Host "Backend domain: $backendDomain" -ForegroundColor Green

Write-Host '=== Linking to frontend service ===' -ForegroundColor Cyan
railway service link $FRONTEND_NAME

Write-Host '=== Setting frontend env vars ===' -ForegroundColor Cyan
Set-RailwayVar 'NEXT_PUBLIC_API_URL' "https://$backendDomain/api/v1"
Set-RailwayVar 'NEXT_PUBLIC_SITE_URL' 'https://PLACEHOLDER.up.railway.app'
Set-RailwayVar 'NEXT_PUBLIC_APP_URL' 'https://PLACEHOLDER.up.railway.app'
Set-RailwayVar 'API_URL' "https://$backendDomain/api/v1"
Set-RailwayVar 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME' 'your_cloud_name'
Set-RailwayVar 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET' 'nita_clinics_uploads'
Set-RailwayVar 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY' 'your_google_maps_key'
Set-RailwayVar 'NEXT_PUBLIC_ENABLE_CHATBOT' 'true'
Set-RailwayVar 'NEXT_PUBLIC_ENABLE_VIRTUAL_TOUR' 'true'
Set-RailwayVar 'NEXT_PUBLIC_ESEWA_MERCHANT_ID' 'EPAYTEST'
Set-RailwayVar 'NEXT_PUBLIC_KHALTI_PUBLIC_KEY' 'test_public_key_dc74e0fd57cb46cd93832aee0a390234'
Set-RailwayVar 'NEXT_PUBLIC_FONEPAY_MERCHANT_CODE' 'TESTMERCHANT'

Write-Host '=== Frontend vars set. Deploying frontend ===' -ForegroundColor Cyan
railway up $FRONTEND_NAME

Write-Host '=== Generating frontend public domain ===' -ForegroundColor Cyan
railway domain *> $null
$feDomain = (railway domain 2>$null | Select-Object -First 1).Trim()
Write-Host "Frontend domain: $feDomain" -ForegroundColor Green

Write-Host ''
Write-Host '=== Updating FRONTEND_URL/APP_URL on backend, re-deploying ===' -ForegroundColor Cyan
railway service link $BACKEND_NAME
Set-RailwayVar 'FRONTEND_URL' "https://$feDomain"
Set-RailwayVar 'APP_URL' "https://$feDomain"
railway up $BACKEND_NAME

Write-Host '=== Updating NEXT_PUBLIC_SITE_URL/APP_URL on frontend, re-deploying ===' -ForegroundColor Cyan
railway service link $FRONTEND_NAME
Set-RailwayVar 'NEXT_PUBLIC_SITE_URL' "https://$feDomain"
Set-RailwayVar 'NEXT_PUBLIC_APP_URL' "https://$feDomain"
railway up $FRONTEND_NAME

Write-Host ''
Write-Host '=== DONE ===' -ForegroundColor Green
Write-Host "Backend:  https://$backendDomain"
Write-Host "Frontend: https://$feDomain"
