#!/bin/bash

echo "=========================================="
echo "SplitMint Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Download the LTS version and follow installation instructions."
    echo ""
    echo "After installation, restart your terminal and run this script again."
    exit 1
fi

echo "[OK] Node.js is installed"
node --version
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not available!"
    echo "Please reinstall Node.js from: https://nodejs.org/"
    exit 1
fi

echo "[OK] npm is available"
npm --version
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "[WARNING] .env.local file not found!"
    echo ""
    echo "Creating .env.local from template..."
    cp .env.example .env.local 2>/dev/null
    echo ""
    echo "[ACTION REQUIRED] Please edit .env.local and add your Supabase credentials:"
    echo "  1. Go to https://supabase.com"
    echo "  2. Create a project"
    echo "  3. Get your Project URL and anon key from Settings -> API"
    echo "  4. Edit .env.local and replace the placeholder values"
    echo ""
    
    # Try to open the file in default editor
    if command -v nano &> /dev/null; then
        read -p "Press Enter to edit .env.local with nano (or Ctrl+C to exit and edit manually)..."
        nano .env.local
    elif command -v vim &> /dev/null; then
        read -p "Press Enter to edit .env.local with vim (or Ctrl+C to exit and edit manually)..."
        vim .env.local
    else
        echo "Please edit .env.local manually with your preferred text editor"
    fi
    echo ""
fi

echo "=========================================="
echo "Installing Dependencies..."
echo "=========================================="
echo ""
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "  1. Make sure you've set up Supabase:"
echo "     - Create account at https://supabase.com"
echo "     - Create a new project"
echo "     - Run the SQL from supabase-schema.sql"
echo "     - Add credentials to .env.local"
echo ""
echo "  2. Start the development server:"
echo "     npm run dev"
echo ""
echo "  3. Open your browser to:"
echo "     http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
