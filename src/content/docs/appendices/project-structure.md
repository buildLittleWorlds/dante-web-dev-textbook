---
title: "Complete Code Repository Structure"
description: "Recommended project organization for professional development practices"
---

# Appendix A: Complete Code Repository Structure

## Recommended Project Organization

Your final Dante memorization application should follow this comprehensive directory structure for maintainability, scalability, and professional development practices:

```
dante-memorization-app/
├── README.md                          # Project overview and setup instructions
├── LICENSE                           # Open source license (MIT recommended)
├── .gitignore                        # Files to exclude from version control
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── bun.lockb                         # Dependency lock file
├── .env.example                      # Environment variables template
├── .env                              # Local environment variables (not in repo)
│
├── docs/                             # Documentation
│   ├── DEPLOYMENT.md                 # Deployment instructions
│   ├── DEVELOPMENT.md                # Development setup and guidelines
│   ├── API.md                        # API documentation
│   ├── ACCESSIBILITY.md              # Accessibility compliance notes
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   └── CHANGELOG.md                  # Version history
│
├── src/                              # Source code
│   ├── server.ts                     # Main server entry point
│   ├── database/                     # Database layer
│   │   ├── schema.sql                # Database schema definition
│   │   ├── migrations/               # Database migration files
│   │   │   ├── 001_initial_schema.sql
│   │   │   ├── 002_add_user_progress.sql
│   │   │   └── 003_add_plugins.sql
│   │   ├── seeds/                    # Sample data
│   │   │   ├── canticles.sql
│   │   │   ├── cantos.sql
│   │   │   └── tercets.sql
│   │   └── database.ts               # Database connection and utilities
│   │
│   ├── components/                   # React/JSX components
│   │   ├── Layout.tsx                # Base layout component
│   │   ├── TercetCard.tsx           # Tercet display component
│   │   ├── StudyInterface.tsx       # Study session interface
│   │   ├── ProgressTracker.tsx      # Progress visualization
│   │   ├── SettingsPanel.tsx        # Configuration interface
│   │   ├── PluginManager.tsx        # Plugin management
│   │   └── forms/                   # Form components
│   │       ├── SearchForm.tsx
│   │       ├── AnnotationForm.tsx
│   │       └── PreferencesForm.tsx
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── fsrs.ts                   # Spaced repetition algorithm
│   │   ├── validation.ts             # Input validation
│   │   ├── auth.ts                   # Authentication utilities
│   │   ├── analytics.ts              # Analytics and tracking
│   │   └── utils.ts                  # General utilities
│   │
│   ├── plugins/                      # Plugin system
│   │   ├── types.ts                  # Plugin type definitions
│   │   ├── manager.ts                # Plugin manager
│   │   ├── registry.ts               # Plugin registry
│   │   └── examples/                 # Example plugins
│   │       ├── visual-memory.ts
│   │       ├── medieval-theme.ts
│   │       └── classical-texts.ts
│   │
│   ├── config/                       # Configuration management
│   │   ├── types.ts                  # Configuration types
│   │   ├── manager.ts                # Configuration manager
│   │   └── defaults.ts               # Default settings
│   │
│   ├── api/                          # API route handlers
│   │   ├── tercets.ts                # Tercet-related endpoints
│   │   ├── study.ts                  # Study session endpoints
│   │   ├── progress.ts               # Progress tracking endpoints
│   │   ├── search.ts                 # Search endpoints
│   │   ├── annotations.ts            # Annotation endpoints
│   │   ├── plugins.ts                # Plugin management endpoints
│   │   └── preferences.ts            # User preferences endpoints
│   │
│   └── types/                        # TypeScript type definitions
│       ├── index.ts                  # Main type exports
│       ├── database.ts               # Database types
│       ├── study.ts                  # Study-related types
│       └── plugins.ts                # Plugin types
│
├── public/                           # Static assets
│   ├── styles.css                    # Main stylesheet
│   ├── favicon.ico                   # Site icon
│   ├── manifest.json                 # Web app manifest
│   ├── images/                       # Image assets
│   │   ├── dante-portrait.jpg
│   │   ├── medieval-border.svg
│   │   └── icons/
│   └── fonts/                        # Custom fonts
│       ├── cinzel-regular.woff2
│       └── uncial-antiqua.woff2
│
├── tests/                            # Test files
│   ├── unit/                         # Unit tests
│   │   ├── fsrs.test.ts
│   │   ├── database.test.ts
│   │   └── components.test.tsx
│   ├── integration/                  # Integration tests
│   │   ├── api.test.ts
│   │   └── plugins.test.ts
│   ├── e2e/                          # End-to-end tests
│   │   ├── study-session.test.ts
│   │   └── accessibility.test.ts
│   └── fixtures/                     # Test data
│       └── sample-tercets.json
│
├── scripts/                          # Build and deployment scripts
│   ├── build.ts                      # Production build script
│   ├── deploy.ts                     # Deployment script
│   ├── setup-dev.ts                  # Development environment setup
│   └── seed-database.ts              # Database seeding script
│
├── deployment/                       # Deployment configurations
│   ├── docker/                       # Docker configurations
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── nginx.conf
│   ├── vercel/                       # Vercel deployment
│   │   └── vercel.json
│   ├── netlify/                      # Netlify deployment
│   │   └── netlify.toml
│   └── railway/                      # Railway deployment
│       └── railway.toml
│
└── accessibility/                    # Accessibility resources
    ├── audit-reports/                # Accessibility audit results
    ├── wcag-checklist.md            # WCAG compliance checklist
    └── testing-guide.md             # Accessibility testing guide
```

## Essential Configuration Files

### package.json
```json
{
  "name": "dante-memorization-app",
  "version": "1.0.0",
  "description": "A web application for memorizing Dante's Divine Comedy using spaced repetition",
  "main": "src/server.ts",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/server.ts",
    "build": "bun run scripts/build.ts",
    "start": "bun run src/server.ts",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:e2e": "bun run tests/e2e/*.test.ts",
    "lint": "eslint src/ --ext .ts,.tsx",
    "format": "prettier --write src/",
    "setup": "bun run scripts/setup-dev.ts",
    "seed": "bun run scripts/seed-database.ts",
    "deploy": "bun run scripts/deploy.ts"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/node-server": "^1.8.0",
    "sqlite": "^5.0.0",
    "bcrypt": "^5.1.0",
    "jose": "^5.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/bcrypt": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": [
    "digital-humanities",
    "dante",
    "memorization",
    "spaced-repetition",
    "literature",
    "education"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/dante-memorization-app.git"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Git Workflow and Version Control

### .gitignore
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite
*.sqlite3

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Bun
.bun
```

This structure provides a solid foundation for professional development practices, from initial development through production deployment and ongoing maintenance.