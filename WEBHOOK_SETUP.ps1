# ============================================================
# Stripe Webhook Testing Setup Script
# ============================================================
# This script sets up local webhook testing with ngrok tunnel

Write-Host "🔧 Stripe Webhook Testing Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Step 1: Start ngrok tunnel (runs in background)
Write-Host "📡 Starting ngrok tunnel..." -ForegroundColor Yellow
$ngrokPath = "$env:TEMP\ngrok\ngrok.exe"
$ngrokProcess = Start-Process -FilePath $ngrokPath -ArgumentList "http", "3000" -PassThru -WindowStyle Minimized

# Give ngrok time to start
Start-Sleep -Seconds 3

# Step 2: Get ngrok tunnel URL
Write-Host "🌐 Retrieving tunnel URL..." -ForegroundColor Yellow
$tunnelUrl = $null
try {
    $ngrokStatus = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction SilentlyContinue
    $tunnelUrl = $ngrokStatus.tunnels[0].public_url
    Write-Host "✓ Tunnel URL: $tunnelUrl" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "⚠ Could not connect to ngrok status API" -ForegroundColor Yellow
}

if (-not $tunnelUrl) {
    $tunnelUrl = "https://your-ngrok-url.ngrok.io"
}

# Step 3: Instructions for webhook setup
Write-Host "📋 WEBHOOK SETUP INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://dashboard.stripe.com/test/webhooks"
Write-Host ""
Write-Host "2. Click 'Add an endpoint'"
Write-Host ""
Write-Host "3. For 'Endpoint URL', enter:"
Write-Host "   $tunnelUrl/api/webhook/stripe" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Select these events:"
Write-Host "   ✓ checkout.session.completed"
Write-Host "   ✓ customer.subscription.created"
Write-Host "   ✓ customer.subscription.updated"
Write-Host "   ✓ customer.subscription.deleted"
Write-Host ""
Write-Host "5. Click 'Create endpoint'"
Write-Host ""
Write-Host "6. Copy the 'Signing Secret' (whsec_...)"
Write-Host ""
Write-Host "7. Update .env file:"
Write-Host "   STRIPE_WEBHOOK_SECRET=whsec_..." -ForegroundColor Yellow
Write-Host ""
Write-Host "8. Restart your server (npm start) in another terminal"
Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🟢 ngrok tunnel is ACTIVE - Keep this terminal open!" -ForegroundColor Green
Write-Host "Tunnel URL: $tunnelUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the tunnel when done"
Write-Host ""

# Keep ngrok running
Wait-Process -InputObject $ngrokProcess
