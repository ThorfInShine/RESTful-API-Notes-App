#!/bin/bash

# Configuration
SERVER_USER="your-user"
SERVER_HOST="your-server.com"
APP_DIR="/opt/notes-app"
GITHUB_REPO="https://github.com/yourusername/notes-app.git"

echo "🚀 Starting deployment..."

# SSH ke server dan jalankan commands
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
  # Navigate to app directory
  cd $APP_DIR || exit 1
  
  # Pull latest code
  echo "📦 Pulling latest code..."
  git pull origin main
  
  # Build and restart containers
  echo "🔨 Building Docker image..."
  docker-compose down
  docker-compose build --no-cache
  docker-compose up -d
  
  # Clean up
  echo "🧹 Cleaning up..."
  docker image prune -f
  
  # Check status
  echo "✅ Checking container status..."
  docker-compose ps
  
  echo "🎉 Deployment completed!"
ENDSSH