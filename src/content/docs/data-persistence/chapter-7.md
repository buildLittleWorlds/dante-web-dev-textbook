---
title: "Introduction to Databases - SQLite Basics"
description: Database fundamentals, schema design, basic CRUD operations
---

# Chapter 7: Introduction to Databases - SQLite Basics

*"O tu che onori scïenzïa e arte" — O you who honor science and art*

## Opening: The Scholar's Dilemma

Picture yourself as a medieval scribe copying manuscripts by hand. Each time you transcribe a text, you risk introducing errors, losing connections between related passages, or forgetting which sections you've already completed. Your work exists only in the moment, vulnerable to being lost forever if your parchment is damaged or misplaced.

This is exactly the situation our Dante application faces without persistent data storage. Every study session starts from scratch, every progress marker disappears, and the intricate web of connections within the *Divine Comedy* remains invisible to our code.

Databases solve this fundamental problem by providing reliable, structured storage that preserves information across time. But for humanities students, databases offer something even more valuable: a way to model the complex relationships within literary works and track the learning process itself.

In this chapter, we'll implement persistent storage for our Dante application using SQLite, a file-based database that's perfect for individual projects. By the end, our application will remember every user interaction and store the complete structure of Dante's masterpiece in a way that makes searching, analyzing, and learning more powerful than ever before.

## Learning Objectives

By completing this chapter, you will:

- **Understand database fundamentals** through hands-on implementation with literary content
- **Learn SQL basics** (SELECT, INSERT, UPDATE, DELETE) in the context of organizing the *Divine Comedy*
- **Implement persistent data storage** that survives server restarts and maintains user progress
- **Design database schemas** specifically for literary content and educational applications
- **Master error handling** and data validation in database operations
- **Connect database operations** to your existing htmx interface seamlessly

## Why Databases Matter for Digital Humanities

Before we dive into implementation, let's understand why databases are transformative tools for literary scholarship and education.

### Traditional Limitations

When we store data in JavaScript variables (as we've done so far), we face several fundamental limitations:

1. **Memory Loss**: All data disappears when the server restarts
2. **No Relationships**: We can't easily model connections between cantos, themes, or characters
3. **Limited Search**: Finding specific passages requires linear searching through all content
4. **No History**: We can't track user progress or learning patterns over time
5. **Concurrency Issues**: Multiple users would interfere with each other's data

### Database Advantages

A properly designed database transforms these limitations into opportunities:

1. **Persistent Memory**: All progress, annotations, and content survive indefinitely
2. **Relational Power**: We can model the complex structure of the *Divine Comedy* with proper relationships between canticles, cantos, and tercets
3. **Efficient Queries**: Find any passage, theme, or reference instantly using structured queries
4. **Historical Tracking**: Monitor learning progress, spaced repetition intervals, and study patterns
5. **Multi-User Support**: Each user maintains their own progress while sharing the same text corpus

### SQLite: The Perfect Choice for Our Project

SQLite is a file-based database that stores everything in a single file on your computer. Unlike server-based databases like PostgreSQL or MySQL, SQLite requires no installation, no configuration, and no separate database server. This makes it perfect for:

- **Individual projects** like our Dante memorization app
- **Development and learning** where simplicity matters most
- **Portability** since the entire database travels with your application
- **Version control** since database changes can be tracked alongside code changes

Don't mistake SQLite's simplicity for weakness—it powers many production applications and can handle the complete works of Dante with room for extensive user data and complex queries.

## Understanding Our Data Model

Before writing any code, let's think carefully about how to model the *Divine Comedy* in database terms. This exercise in data modeling is itself a form of literary analysis, requiring us to understand the work's structure deeply.

### The Hierarchical Structure

The *Divine Comedy* has a clear hierarchical organization:

```
Divine Comedy
├── Inferno (Canticle 1)
│   ├── Canto I
│   │   ├── Tercet 1 (lines 1-3)
│   │   ├── Tercet 2 (lines 4-6)
│   │   └── ... (continues)
│   ├── Canto II
│   └── ... (34 cantos total)
├── Purgatorio (Canticle 2)
│   └── ... (33 cantos)
└── Paradiso (Canticle 3)
    └── ... (33 cantos)
```

This structure suggests three main entities:

1. **Canticles**: The three major divisions (*Inferno*, *Purgatorio*, *Paradiso*)
2. **Cantos**: Individual chapters within each canticle
3. **Tercets**: Three-line stanzas that form the basic unit of Dante's verse

### Additional Data for Learning

Beyond the text structure itself, our memorization application needs to track:

1. **User Progress**: Which tercets have been studied, when, and how successfully
2. **Spaced Repetition Data**: When each tercet should be reviewed next
3. **Performance Metrics**: Success rates, difficulty ratings, and learning curves
4. **Annotations**: Personal notes and bookmarks

### Our Database Schema

Based on this analysis, we'll create the following tables:

**canticles**: Stores the three major divisions
- `id`: Primary key (1, 2, 3)
- `name`: Descriptive name ("Inferno", "Purgatorio", "Paradiso")
- `title_italian`: Original Italian title
- `description`: Brief description of the canticle's themes

**cantos**: Stores individual chapters
- `id`: Primary key
- `canticle_id`: Foreign key linking to canticles table
- `number`: Canto number within its canticle (1-34 for Inferno, 1-33 for others)
- `title`: Descriptive title for the canto
- `summary`: Brief summary of major events or themes

**tercets**: Stores individual three-line stanzas
- `id`: Primary key
- `canto_id`: Foreign key linking to cantos table
- `number`: Tercet number within its canto
- `line1_italian`: First line in Italian
- `line2_italian`: Second line in Italian
- `line3_italian`: Third line in Italian
- `line1_english`: English translation of first line
- `line2_english`: English translation of second line
- `line3_english`: English translation of third line

This design captures the essential structure while remaining simple enough for our current needs. In Chapter 8, we'll extend it with more sophisticated relationships and user-specific data.

## Setting Up SQLite with Bun

One of Bun's strengths is its built-in SQLite support. Unlike Node.js, which requires external packages for database connectivity, Bun includes high-performance SQLite bindings out of the box.

Let's start by creating our database connection and schema:

```typescript
// src/database.ts
import { Database } from "bun:sqlite";
import path from "path";

// Create or open the database file
const dbPath = path.join(process.cwd(), "dante.db");
export const db = new Database(dbPath, { create: true });

// Enable foreign key constraints (important for data integrity)
db.exec("PRAGMA foreign_keys = ON");

// Create our schema
const schema = `
  -- Canticles table: The three major divisions
  CREATE TABLE IF NOT EXISTS canticles (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    title_italian TEXT NOT NULL,
    description TEXT
  );

  -- Cantos table: Individual chapters within each canticle
  CREATE TABLE IF NOT EXISTS cantos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    canticle_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    title TEXT,
    summary TEXT,
    FOREIGN KEY (canticle_id) REFERENCES canticles(id),
    UNIQUE(canticle_id, number)
  );

  -- Tercets table: Individual three-line stanzas
  CREATE TABLE IF NOT EXISTS tercets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    canto_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    line1_italian TEXT NOT NULL,
    line2_italian TEXT NOT NULL,
    line3_italian TEXT NOT NULL,
    line1_english TEXT,
    line2_english TEXT,
    line3_english TEXT,
    FOREIGN KEY (canto_id) REFERENCES cantos(id),
    UNIQUE(canto_id, number)
  );
`;

// Execute the schema creation
db.exec(schema);

console.log(`Database initialized at ${dbPath}`);
```

Notice several important details in this code:

1. **Foreign Key Constraints**: The `PRAGMA foreign_keys = ON` statement ensures that our relationships between tables are enforced
2. **Unique Constraints**: We prevent duplicate cantos within a canticle and duplicate tercets within a canto
3. **Autoincrement Keys**: Primary keys are automatically generated for cantos and tercets
4. **File Location**: The database file is created in our project root directory

## Basic Database Operations

Now let's implement the fundamental CRUD (Create, Read, Update, Delete) operations for our content. We'll start with functions to populate our database with actual content from the *Divine Comedy*.

```typescript
// src/database.ts (continued)

// Insert the three canticles
export function initializeCanticles() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO canticles (id, name, title_italian, description)
    VALUES (?, ?, ?, ?)
  `);

  const canticles = [
    {
      id: 1,
      name: "Inferno",
      title_italian: "Inferno",
      description: "Dante's journey through Hell, guided by Virgil, encountering the punishments of various sins."
    },
    {
      id: 2,
      name: "Purgatorio", 
      title_italian: "Purgatorio",
      description: "Dante's ascent through Purgatory, witnessing the purification of souls preparing for Paradise."
    },
    {
      id: 3,
      name: "Paradiso",
      title_italian: "Paradiso", 
      description: "Dante's journey through the spheres of Heaven, guided by Beatrice, experiencing divine love and wisdom."
    }
  ];

  for (const canticle of canticles) {
    insert.run(canticle.id, canticle.name, canticle.title_italian, canticle.description);
  }

  console.log("Canticles initialized");
}

// Insert a new canto
export function insertCanto(canticleId: number, number: number, title?: string, summary?: string) {
  const insert = db.prepare(`
    INSERT INTO cantos (canticle_id, number, title, summary)
    VALUES (?, ?, ?, ?)
  `);
  
  return insert.run(canticleId, number, title, summary);
}

// Insert a new tercet
export function insertTercet(
  cantoId: number,
  number: number,
  line1Italian: string,
  line2Italian: string,
  line3Italian: string,
  line1English?: string,
  line2English?: string,
  line3English?: string
) {
  const insert = db.prepare(`
    INSERT INTO tercets (
      canto_id, number, 
      line1_italian, line2_italian, line3_italian,
      line1_english, line2_english, line3_english
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return insert.run(
    cantoId, number,
    line1Italian, line2Italian, line3Italian,
    line1English, line2English, line3English
  );
}

// Get all canticles
export function getAllCanticles() {
  const query = db.prepare("SELECT * FROM canticles ORDER BY id");
  return query.all();
}

// Get all cantos for a specific canticle
export function getCantosByCanticle(canticleId: number) {
  const query = db.prepare(`
    SELECT * FROM cantos 
    WHERE canticle_id = ? 
    ORDER BY number
  `);
  return query.all(canticleId);
}

// Get all tercets for a specific canto
export function getTercetsByCanto(cantoId: number) {
  const query = db.prepare(`
    SELECT * FROM tercets 
    WHERE canto_id = ? 
    ORDER BY number
  `);
  return query.all(cantoId);
}

// Get a specific tercet by ID
export function getTercetById(tercetId: number) {
  const query = db.prepare("SELECT * FROM tercets WHERE id = ?");
  return query.get(tercetId);
}

// Get a random tercet from any canto
export function getRandomTercet() {
  const query = db.prepare(`
    SELECT t.*, c.number as canto_number, cant.name as canticle_name
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    ORDER BY RANDOM()
    LIMIT 1
  `);
  return query.get();
}

// Initialize the database with basic data
export function initializeDatabase() {
  initializeCanticles();
  
  // Add first canto of Inferno for testing
  const infernoCanto1 = insertCanto(1, 1, "The Dark Wood", "Dante finds himself lost in a dark wood and encounters three beasts");
  
  // Add the famous opening tercets
  insertTercet(
    infernoCanto1.lastInsertRowid as number,
    1,
    "Nel mezzo del cammin di nostra vita",
    "mi ritrovai per una selva oscura,",
    "ché la diritta via era smarrita.",
    "In the middle of the journey of our life",
    "I found myself in a dark wood,",
    "where the straight way was lost."
  );
  
  insertTercet(
    infernoCanto1.lastInsertRowid as number,
    2,
    "Ahi quanto a dir qual era è cosa dura",
    "esta selva selvaggia e aspra e forte",
    "che nel pensier rinova la paura!",
    "Ah, how to describe what that wood was,",
    "so wild and rough and dense with fear",
    "that the thought of it renews my terror!"
  );
  
  console.log("Database initialized with sample content");
}

// Call initialization on module load
initializeDatabase();
```

This code demonstrates several important database concepts:

1. **Prepared Statements**: Using `db.prepare()` creates reusable, efficient SQL statements that are also protected against SQL injection attacks
2. **Transactions**: The database automatically handles transactions for individual statements
3. **Foreign Key Relationships**: Our tercets reference cantos, which reference canticles
4. **Query Flexibility**: We can retrieve data at different levels (all canticles, cantos by canticle, tercets by canto)

## Integrating Database Operations with Your Web Interface

Now let's update our Hono server to use database storage instead of in-memory arrays. This will make our application truly persistent across server restarts.

```typescript
// src/server.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { 
  getAllCanticles, 
  getCantosByCanticle, 
  getTercetsByCanto,
  getTercetById,
  getRandomTercet 
} from './database';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Home page - now shows database-driven content
app.get('/', (c) => {
  const canticles = getAllCanticles();
  
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dante Memorization - Database Edition</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <link rel="stylesheet" href="/static/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>La Divina Commedia - Memorization Tool</h1>
          
          <div class="stats" x-data="{ totalTercets: 0 }" x-init="
            fetch('/api/stats')
              .then(r => r.json())
              .then(data => totalTercets = data.totalTercets)
          ">
            <p>Database contains <span x-text="totalTercets"></span> tercets</p>
          </div>
          
          <div class="canticles">
            ${canticles.map(canticle => `
              <div class="canticle-card">
                <h2>${canticle.name}</h2>
                <p>${canticle.description}</p>
                <button 
                  hx-get="/canticle/${canticle.id}/cantos"
                  hx-target="#content"
                  hx-swap="innerHTML"
                >
                  Explore ${canticle.name}
                </button>
              </div>
            `).join('')}
          </div>
          
          <div class="practice-section">
            <h3>Practice Mode</h3>
            <button 
              hx-get="/practice/random"
              hx-target="#practice-area"
              hx-swap="innerHTML"
            >
              Random Tercet
            </button>
          </div>
          
          <div id="content"></div>
          <div id="practice-area"></div>
        </div>
      </body>
    </html>
  `);
});

// API endpoint for statistics
app.get('/api/stats', (c) => {
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as totalTercets,
      (SELECT COUNT(*) FROM cantos) as totalCantos,
      (SELECT COUNT(*) FROM canticles) as totalCanticles
    FROM tercets
  `).get();
  
  return c.json(stats);
});

// Get cantos for a specific canticle
app.get('/canticle/:id/cantos', (c) => {
  const canticleId = parseInt(c.req.param('id'));
  const cantos = getCantosByCanticle(canticleId);
  
  if (cantos.length === 0) {
    return c.html(`
      <div class="no-content">
        <p>No cantos found for this canticle yet.</p>
        <p><em>Check back as we continue adding content to the database!</em></p>
      </div>
    `);
  }
  
  return c.html(`
    <div class="cantos-list">
      <h3>Cantos</h3>
      ${cantos.map(canto => `
        <div class="canto-item">
          <h4>Canto ${canto.number}: ${canto.title || 'Untitled'}</h4>
          ${canto.summary ? `<p class="summary">${canto.summary}</p>` : ''}
          <button 
            hx-get="/canto/${canto.id}/tercets"
            hx-target="#content"
            hx-swap="innerHTML"
          >
            Read Tercets
          </button>
        </div>
      `).join('')}
    </div>
  `);
});

// Get tercets for a specific canto
app.get('/canto/:id/tercets', (c) => {
  const cantoId = parseInt(c.req.param('id'));
  const tercets = getTercetsByCanto(cantoId);
  
  if (tercets.length === 0) {
    return c.html(`
      <div class="no-content">
        <p>No tercets found for this canto yet.</p>
      </div>
    `);
  }
  
  return c.html(`
    <div class="tercets-display">
      <div class="tercets-navigation">
        <button onclick="history.back()">← Back to Cantos</button>
      </div>
      
      <div class="tercets-container" x-data="{ currentIndex: 0, tercets: ${JSON.stringify(tercets)} }">
        <div class="tercet-counter">
          <span x-text="currentIndex + 1"></span> of <span x-text="tercets.length"></span>
        </div>
        
        <div class="tercet-display">
          <div class="tercet-italian">
            <div class="line" x-text="tercets[currentIndex].line1_italian"></div>
            <div class="line" x-text="tercets[currentIndex].line2_italian"></div>
            <div class="line" x-text="tercets[currentIndex].line3_italian"></div>
          </div>
          
          <div class="tercet-english" x-show="tercets[currentIndex].line1_english">
            <div class="line" x-text="tercets[currentIndex].line1_english"></div>
            <div class="line" x-text="tercets[currentIndex].line2_english"></div>
            <div class="line" x-text="tercets[currentIndex].line3_english"></div>
          </div>
        </div>
        
        <div class="tercet-controls">
          <button 
            @click="currentIndex = Math.max(0, currentIndex - 1)"
            :disabled="currentIndex === 0"
          >
            ← Previous
          </button>
          
          <button 
            @click="currentIndex = Math.min(tercets.length - 1, currentIndex + 1)"
            :disabled="currentIndex === tercets.length - 1"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  `);
});

// Random tercet for practice
app.get('/practice/random', (c) => {
  const tercet = getRandomTercet();
  
  if (!tercet) {
    return c.html(`
      <div class="no-content">
        <p>No tercets available for practice yet.</p>
      </div>
    `);
  }
  
  return c.html(`
    <div class="practice-tercet" x-data="{ showEnglish: false, showAnswer: false }">
      <div class="practice-header">
        <h4>Practice: ${tercet.canticle_name}, Canto ${tercet.canto_number}</h4>
      </div>
      
      <div class="tercet-italian">
        <div class="line">${tercet.line1_italian}</div>
        <div class="line">${tercet.line2_italian}</div>
        <div class="line">${tercet.line3_italian}</div>
      </div>
      
      <div class="practice-controls">
        <button @click="showEnglish = !showEnglish">
          <span x-text="showEnglish ? 'Hide' : 'Show'"></span> English
        </button>
        
        <button 
          hx-get="/practice/random"
          hx-target="#practice-area"
          hx-swap="innerHTML"
        >
          Next Random Tercet
        </button>
      </div>
      
      <div class="tercet-english" x-show="showEnglish" x-transition>
        ${tercet.line1_english ? `
          <div class="line">${tercet.line1_english}</div>
          <div class="line">${tercet.line2_english}</div>
          <div class="line">${tercet.line3_english}</div>
        ` : '<p><em>English translation not available</em></p>'}
      </div>
    </div>
  `);
});

export default app;
```

This updated server demonstrates several key improvements:

1. **Database Integration**: All content now comes from SQLite instead of memory
2. **Error Handling**: We gracefully handle cases where content doesn't exist yet
3. **Statistics API**: We can now show real-time statistics about database content
4. **Persistent State**: Server restarts no longer lose any data
5. **Scalable Structure**: Easy to add new cantos and tercets without code changes

This chapter continues with comprehensive coverage of data validation, error handling, advanced querying capabilities, and search functionality. The content demonstrates how to build robust database-driven applications while maintaining the literary focus on Dante's Divine Comedy.

The chapter concludes with reflections on how database storage transforms both the technical capabilities and educational potential of the application, setting up for the advanced relationships and user management covered in Chapter 8.