---
title: "Deployment Guide for Educational Institutions"
description: "Comprehensive deployment strategies for different institutional contexts and technical resources"
---

# Appendix B: Deployment Guide for Educational Institutions

## Overview

Modern web application deployment in 2025 follows containerized approaches with Git-based workflows, emphasizing automated deployment pipelines and scalable cloud infrastructure. This guide provides comprehensive deployment strategies suitable for educational institutions with varying technical resources.

## Deployment Strategy Selection

### 1. Simple Shared Hosting (Beginner Level)
**Best for**: Small classes, individual projects, limited technical resources  
**Cost**: $5-20/month  
**Technical Requirements**: Basic

```bash
# Traditional shared hosting with cPanel
# Upload built files via FTP/SFTP
bun run build
rsync -avz dist/ user@yourhost.com:/public_html/
```

### 2. Platform-as-a-Service (Recommended)
**Best for**: Most educational deployments, automatic scaling  
**Cost**: Free tier available, $0-25/month  
**Technical Requirements**: Moderate

#### Vercel Deployment (Recommended)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

```bash
# Deployment commands
npm install -g vercel
vercel login
vercel --prod
```

#### Netlify Deployment
```toml
# netlify.toml
[build]
  command = "bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "bun run dev"
  port = 3000
```

#### Railway Deployment
```toml
# railway.toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "bun run start"
  healthcheckPath = "/health"
  healthcheckTimeout = 100
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10

[environment]
  NODE_ENV = "production"
```

### 3. Containerized Deployment (Advanced)
**Best for**: Large institutions, multiple environments, DevOps practices  
**Cost**: $10-100/month depending on scale  
**Technical Requirements**: Advanced

#### Docker Configuration
```dockerfile
# Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production
WORKDIR /app

# Copy built application
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser
USER bunuser

EXPOSE 3000
CMD ["bun", "run", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  dante-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=sqlite:./data/dante.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - dante-app
    restart: unless-stopped
```

## Environment Configuration

### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=sqlite:./data/dante.db
JWT_SECRET=your-secure-jwt-secret-here
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
CORS_ORIGIN=https://yourdomain.edu
LOG_LEVEL=info
```

## Security Considerations

Security is fundamental in 2025 web development, requiring HTTPS everywhere, strong authentication, regular security audits, and compliance with regulations like GDPR.

```typescript
// Security middleware setup
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'
import { rateLimiter } from 'hono/rate-limiter'

app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin'
}))

app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

app.use('/api/*', rateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP'
}))
```

## Institutional Deployment Patterns

### Single Sign-On (SSO) Integration
```typescript
// SAML/OAuth integration for institutional authentication
import { OAuth2 } from 'oauth2-server'

app.get('/auth/institution', async (c) => {
  const authUrl = `${process.env.INSTITUTION_SSO_URL}?` + 
    `client_id=${process.env.SSO_CLIENT_ID}&` +
    `redirect_uri=${process.env.SSO_REDIRECT_URL}&` +
    `response_type=code&` +
    `scope=openid profile email`
  
  return c.redirect(authUrl)
})

app.get('/auth/callback', async (c) => {
  const code = c.req.query('code')
  // Exchange code for token and create user session
  // Implementation depends on institution's SSO provider
})
```

### Learning Management System (LMS) Integration
```typescript
// LTI (Learning Tools Interoperability) integration
app.post('/lti/launch', async (c) => {
  const ltiData = await c.req.formData()
  
  // Validate LTI signature
  const isValid = validateLTISignature(ltiData)
  if (!isValid) {
    return c.text('Invalid LTI signature', 401)
  }
  
  // Create or update user based on LTI data
  const user = await createOrUpdateLTIUser(ltiData)
  
  // Set session and redirect to application
  setUserSession(c, user)
  return c.redirect('/study')
})
```

## Monitoring and Analytics

### Application Performance Monitoring
```typescript
// Performance monitoring setup
import { prometheus } from 'hono/prometheus'

const { printMetrics, registerMetrics } = prometheus()

app.use('*', registerMetrics)

app.get('/metrics', printMetrics)

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  })
})
```

### Educational Analytics
```typescript
// Learning analytics for educational insights
interface StudyEvent {
  userId: string
  eventType: 'tercet_viewed' | 'answer_submitted' | 'session_completed'
  timestamp: Date
  data: any
}

app.post('/api/analytics/event', async (c) => {
  const event: StudyEvent = await c.req.json()
  
  // Store for institutional analytics
  await db.execute(`
    INSERT INTO learning_analytics (user_id, event_type, timestamp, data)
    VALUES (?, ?, ?, ?)
  `, [event.userId, event.eventType, event.timestamp, JSON.stringify(event.data)])
  
  return c.json({ success: true })
})
```

## Backup and Disaster Recovery

Effective rollback strategies and disaster recovery are essential components of modern deployment practices.

```bash
#!/bin/bash
# Automated backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/dante-app"

# Database backup
sqlite3 /app/data/dante.db ".backup $BACKUP_DIR/dante_$DATE.db"

# Application files backup
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /app

# Rotate old backups (keep last 30 days)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
aws s3 cp "$BACKUP_DIR/dante_$DATE.db" s3://your-backup-bucket/
```

## Scaling Considerations

### Database Scaling
```typescript
// Connection pooling for high-traffic deployments
import { Database } from 'sqlite3'
import { Pool } from 'generic-pool'

const factory = {
  create: () => {
    return new Promise((resolve, reject) => {
      const db = new Database('./data/dante.db', (err) => {
        if (err) reject(err)
        else resolve(db)
      })
    })
  },
  destroy: (db) => {
    return new Promise((resolve) => {
      db.close(resolve)
    })
  }
}

const dbPool = Pool.createPool(factory, {
  max: 10,
  min: 2,
  acquireTimeoutMillis: 3000,
  createTimeoutMillis: 3000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
})
```

This deployment guide provides practical strategies for institutions of all sizes and technical capabilities, ensuring your Dante memorization application can serve educational communities effectively and sustainably.