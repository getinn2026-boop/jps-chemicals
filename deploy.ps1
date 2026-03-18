# Vercel Deployment Script
Write-Host "🚀 Starting Vercel Deployment..."

# Set execution policy for current process
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

Write-Host "📦 Deploying to Vercel (Production)..."

# Run Vercel deployment with automatic yes response
$response = "Y"
$response | npx vercel --prod

Write-Host "✅ Deployment process completed!"
Write-Host "📋 Check the output above for your deployment URL"