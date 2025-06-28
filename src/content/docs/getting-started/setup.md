---
title: "Development Environment Setup"
description: Getting your computer ready for web development with modern tools
---

## Prerequisites

Before beginning your journey through Dante's Digital Comedy, you'll need to set up a modern development environment. This guide will walk you through installing and configuring the essential tools.

### System Requirements

- **Operating System**: macOS, Windows 10/11, or Linux
- **Memory**: At least 4GB RAM (8GB recommended)
- **Storage**: 2GB free space for tools and projects
- **Internet**: Stable connection for downloading packages

## Core Tools Installation

### 1. Bun JavaScript Runtime

Bun is our primary development toola fast JavaScript runtime and package manager that will power your applications.

**macOS and Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
Option 1: Using PowerShell:
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Option 2: Using Windows Subsystem for Linux (WSL):
1. Install WSL2 from Microsoft Store
2. Open WSL terminal and run the macOS/Linux command above

**Verify Installation:**
```bash
bun --version
```

You should see a version number (1.0 or higher).

### 2. Code Editor

We recommend **Visual Studio Code** for its excellent TypeScript support and extensions.

**Download:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

**Essential Extensions:**
- TypeScript and JavaScript Language Features (built-in)
- Auto Rename Tag
- Bracket Pair Colorizer
- Prettier - Code formatter

**Install Extensions via Command Line:**
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension formulahendry.auto-rename-tag
```

### 3. Git Version Control

Git is essential for tracking your code changes and collaborating.

**macOS:**
```bash
# Using Homebrew (install Homebrew first from https://brew.sh)
brew install git

# Or download from https://git-scm.com/
```

**Windows:**
Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

**Configure Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Terminal/Command Line Setup

### macOS
- Use the built-in **Terminal** app
- For enhanced experience, consider **iTerm2**: [https://iterm2.com/](https://iterm2.com/)

### Windows
- **Command Prompt** or **PowerShell** (built-in)
- **Windows Terminal** (recommended): Install from Microsoft Store
- **Git Bash** (installed with Git)

### Linux
- Use your distribution's default terminal emulator

### Essential Commands

Learn these basic commands for navigating your system:

```bash
# Navigation
pwd                 # Show current directory
ls                  # List files (dir on Windows)
cd foldername       # Change to folder
cd ..               # Go up one level
cd ~                # Go to home directory

# File operations
mkdir foldername    # Create directory
touch filename      # Create empty file (Linux/macOS)
cp file newfile     # Copy file
mv file newlocation # Move/rename file
rm filename         # Delete file (careful!)

# Project commands
bun init            # Initialize new project
bun install         # Install dependencies
bun run dev         # Start development server
```

## Creating Your First Project

Let's verify everything works by creating a test project:

```bash
# Create a new directory for your projects
mkdir ~/dante-projects
cd ~/dante-projects

# Create a test project
bun create hono test-project
cd test-project

# Start the development server
bun run dev
```

You should see output like:
```
Server running at http://localhost:3000
```

Open your browser to `http://localhost:3000` to verify everything works.

## Browser Developer Tools

Modern browsers include powerful development tools. We recommend:

- **Chrome DevTools** (Chrome/Edge)
- **Firefox Developer Tools** (Firefox)
- **Safari Web Inspector** (Safari)

### Essential DevTools Features

**Console:** View JavaScript output and errors
- Open: F12 ’ Console tab

**Network:** Monitor server requests
- Open: F12 ’ Network tab

**Elements:** Inspect HTML and CSS
- Open: F12 ’ Elements tab

## Troubleshooting Common Issues

### Bun Installation Problems

**Permission errors (macOS/Linux):**
```bash
# If you get permission errors, try:
curl -fsSL https://bun.sh/install | bash
# Then restart your terminal
```

**Windows antivirus blocking:**
- Temporarily disable antivirus during installation
- Add Bun to antivirus exceptions

### Path Issues

**Command not found errors:**
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$HOME/.bun/bin:$PATH"

# Then restart terminal or run:
source ~/.bashrc  # or ~/.zshrc
```

### Port Already in Use

If port 3000 is busy:
```bash
# Kill processes using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (then use taskkill)

# Or use a different port
bun run dev --port 3001
```

## Optional Enhancements

### Terminal Improvements

**Zsh with Oh My Zsh (macOS/Linux):**
```bash
# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**PowerShell customization (Windows):**
```powershell
# Install PowerShell 7
winget install Microsoft.PowerShell

# Install Oh My Posh for themes
winget install JanDeDobbeleer.OhMyPosh
```

### Package Manager Alternatives

While Bun handles most needs, you might encounter projects using:

**Node.js and npm:**
- Download: [https://nodejs.org/](https://nodejs.org/)
- Provides `npm` and `npx` commands

**Yarn:**
```bash
npm install -g yarn
```

## Verification Checklist

Before proceeding to Chapter 1, verify you can:

- [ ] Open a terminal/command prompt
- [ ] Run `bun --version` successfully
- [ ] Run `git --version` successfully  
- [ ] Create and navigate directories with `mkdir` and `cd`
- [ ] Open VS Code from command line with `code .`
- [ ] Create a new Hono project with `bun create hono`
- [ ] Start a development server with `bun run dev`
- [ ] Access `http://localhost:3000` in your browser
- [ ] Open browser developer tools with F12

## Getting Help

If you encounter issues:

1. **Check the error message carefully** - it usually contains helpful information
2. **Search online** - Stack Overflow and GitHub issues often have solutions
3. **Restart your terminal** - many path issues are fixed this way
4. **Update your tools** - newer versions often fix bugs

## Next Steps

With your development environment ready, you're prepared to begin **Chapter 1: Why These Technologies Matter for Humanities Students**. You'll create your first web page displaying Dante's poetry and begin building the foundation for your memorization application.

The tools you've installed will serve you throughout this course and in future web development projects. Take time to familiarize yourself with the terminal and code editorthey'll become essential companions on your journey through both code and classical literature.