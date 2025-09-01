#!/bin/bash

# AgriChat Backend Quick Start Script
# This script helps you start the backend server with MySQL integration

echo "🚀 AgriChat Backend Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is running
if ! mysqladmin ping -h localhost -u root --silent 2>/dev/null; then
    echo "⚠️  MySQL is not running or not accessible."
    echo "   Please start MySQL service first:"
    echo "   - macOS: brew services start mysql"
    echo "   - Linux: sudo systemctl start mysql"
    echo "   - Windows: Start MySQL service from Services"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Please run this script from the agrichat project root directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp backend/env.example backend/.env
    echo ""
    echo "📝 Please edit backend/.env with your MySQL credentials:"
    echo "   DB_USER=your_mysql_username"
    echo "   DB_PASSWORD=your_mysql_password"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Check if database exists
echo "🔍 Checking database connection..."
cd backend

# Test database connection
if node -e "
const db = require('./config/database');
db.initialize().then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
}).catch(err => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
});
" 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo ""
    echo "Please ensure:"
    echo "1. MySQL service is running"
    echo "2. Database 'agrichat' exists"
    echo "3. Credentials in .env are correct"
    echo ""
    echo "To create database, run:"
    echo "mysql -u your_username -p < ../database/schema.sql"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo ""
echo "🚀 Starting AgriChat Backend Server..."
echo "📍 Server will run on http://localhost:3000"
echo "🔗 Health check: http://localhost:3000/health"
echo "📊 API base: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
