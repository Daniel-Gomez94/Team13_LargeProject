#!/bin/bash

# UCF Coding Practice - Production Deployment Script
# For server: 143.198.228.249

echo "?? Starting deployment process..."

# Set production environment
export NODE_ENV=production

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Create logs directory
mkdir -p logs

# Install dependencies
echo "?? Installing dependencies..."
npm run install-all

# Build frontend
echo "??? Building frontend..."
npm run build

# Seed database (only if needed)
echo "?? Seeding database..."
cd Backend
node seedDatabase.js
cd ..

# Stop existing PM2 process
echo "?? Stopping existing processes..."
pm2 stop ucf-coding-practice 2>/dev/null || true
pm2 delete ucf-coding-practice 2>/dev/null || true

# Start application with PM2
echo "?? Starting application..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Show status
pm2 status

echo "? Deployment completed!"
echo "?? Application is running on http://143.198.228.249:5000"
echo "?? Monitor with: pm2 monit"
echo "?? View logs with: pm2 logs ucf-coding-practice"