

# Part III: Data Persistence

*"Ma perché le parole tue si chiare / faccian la vostra vista manifesta" — But so that your clear words / may make your vision manifest*

---

In the first six chapters of our journey, we've built an interactive Dante memorization application that runs entirely in memory. Users can navigate through tercets, practice with dynamic quizzes, and enjoy a polished experience with Alpine.js interactions. But like the souls in Dante's Purgatory who must climb the mountain repeatedly, our application "forgets" everything each time the server restarts.

This section transforms our ephemeral application into something permanent and powerful. We'll learn to store the complete text of the *Divine Comedy*, track user progress across sessions, and implement the sophisticated data operations that make modern web applications possible.

Think of databases not as cold storage for information, but as the memory of our application—a way to preserve the accumulated wisdom of countless study sessions and the intricate relationships within Dante's masterpiece.

---

## Chapter 7: Introduction to Databases - SQLite Basics

*"O tu che onori scïenzïa e arte" — O you who honor science and art*

### Opening: The Scholar's Dilemma

Picture yourself as a medieval scribe copying manuscripts by hand. Each time you transcribe a text, you risk introducing errors, losing connections between related passages, or forgetting which sections you've already completed. Your work exists only in the moment, vulnerable to being lost forever if your parchment is damaged or misplaced.

This is exactly the situation our Dante application faces without persistent data storage. Every study session starts from scratch, every progress marker disappears, and the intricate web of connections within the *Divine Comedy* remains invisible to our code.

Databases solve this fundamental problem by providing reliable, structured storage that preserves information across time. But for humanities students, databases offer something even more valuable: a way to model the complex relationships within literary works and track the learning process itself.

In this chapter, we'll implement persistent storage for our Dante application using SQLite, a file-based database that's perfect for individual projects. By the end, our application will remember every user interaction and store the complete structure of Dante's masterpiece in a way that makes searching, analyzing, and learning more powerful than ever before.

### Learning Objectives

By completing this chapter, you will:

- **Understand database fundamentals** through hands-on implementation with literary content
- **Learn SQL basics** (SELECT, INSERT, UPDATE, DELETE) in the context of organizing the *Divine Comedy*
- **Implement persistent data storage** that survives server restarts and maintains user progress
- **Design database schemas** specifically for literary content and educational applications
- **Master error handling** and data validation in database operations
- **Connect database operations** to your existing htmx interface seamlessly

### Why Databases Matter for Digital Humanities

Before we dive into implementation, let's understand why databases are transformative tools for literary scholarship and education.

#### Traditional Limitations

When we store data in JavaScript variables (as we've done so far), we face several fundamental limitations:

1. **Memory Loss**: All data disappears when the server restarts
2. **No Relationships**: We can't easily model connections between cantos, themes, or characters
3. **Limited Search**: Finding specific passages requires linear searching through all content
4. **No History**: We can't track user progress or learning patterns over time
5. **Concurrency Issues**: Multiple users would interfere with each other's data

#### Database Advantages

A properly designed database transforms these limitations into opportunities:

1. **Persistent Memory**: All progress, annotations, and content survive indefinitely
2. **Relational Power**: We can model the complex structure of the *Divine Comedy* with proper relationships between canticles, cantos, and tercets
3. **Efficient Queries**: Find any passage, theme, or reference instantly using structured queries
4. **Historical Tracking**: Monitor learning progress, spaced repetition intervals, and study patterns
5. **Multi-User Support**: Each user maintains their own progress while sharing the same text corpus

#### SQLite: The Perfect Choice for Our Project

SQLite is a file-based database that stores everything in a single file on your computer. Unlike server-based databases like PostgreSQL or MySQL, SQLite requires no installation, no configuration, and no separate database server. This makes it perfect for:

- **Individual projects** like our Dante memorization app
- **Development and learning** where simplicity matters most
- **Portability** since the entire database travels with your application
- **Version control** since database changes can be tracked alongside code changes

Don't mistake SQLite's simplicity for weakness—it powers many production applications and can handle the complete works of Dante with room for extensive user data and complex queries.

### Understanding Our Data Model

Before writing any code, let's think carefully about how to model the *Divine Comedy* in database terms. This exercise in data modeling is itself a form of literary analysis, requiring us to understand the work's structure deeply.

#### The Hierarchical Structure

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

#### Additional Data for Learning

Beyond the text structure itself, our memorization application needs to track:

1. **User Progress**: Which tercets have been studied, when, and how successfully
2. **Spaced Repetition Data**: When each tercet should be reviewed next
3. **Performance Metrics**: Success rates, difficulty ratings, and learning curves
4. **Annotations**: Personal notes and bookmarks

#### Our Database Schema

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

### Setting Up SQLite with Bun

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

### Basic Database Operations

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

### Integrating Database Operations with Your Web Interface

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

### Adding Data Validation and Error Handling

When working with databases, robust error handling becomes crucial. Let's add proper validation and error handling to our database operations:

```typescript
// src/database.ts (additions)

// Custom error classes for better error handling
export class DatabaseError extends Error {
  constructor(message: string, public operation: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Validation functions
function validateTercetData(
  line1Italian: string,
  line2Italian: string, 
  line3Italian: string
) {
  if (!line1Italian?.trim()) {
    throw new ValidationError("First line cannot be empty", "line1_italian");
  }
  if (!line2Italian?.trim()) {
    throw new ValidationError("Second line cannot be empty", "line2_italian");
  }
  if (!line3Italian?.trim()) {
    throw new ValidationError("Third line cannot be empty", "line3_italian");
  }
  
  // Basic length validation
  if (line1Italian.length > 200) {
    throw new ValidationError("Line 1 is too long (max 200 characters)", "line1_italian");
  }
  if (line2Italian.length > 200) {
    throw new ValidationError("Line 2 is too long (max 200 characters)", "line2_italian");
  }
  if (line3Italian.length > 200) {
    throw new ValidationError("Line 3 is too long (max 200 characters)", "line3_italian");
  }
}

// Improved tercet insertion with validation and error handling
export function insertTercetSafe(
  cantoId: number,
  number: number,
  line1Italian: string,
  line2Italian: string,
  line3Italian: string,
  line1English?: string,
  line2English?: string,
  line3English?: string
) {
  try {
    // Validate input data
    validateTercetData(line1Italian, line2Italian, line3Italian);
    
    // Check if canto exists
    const cantoExists = db.prepare("SELECT 1 FROM cantos WHERE id = ?").get(cantoId);
    if (!cantoExists) {
      throw new DatabaseError(`Canto with ID ${cantoId} does not exist`, "insert_tercet");
    }
    
    // Check if tercet number already exists for this canto
    const existingTercet = db.prepare(
      "SELECT 1 FROM tercets WHERE canto_id = ? AND number = ?"
    ).get(cantoId, number);
    
    if (existingTercet) {
      throw new DatabaseError(
        `Tercet ${number} already exists for canto ${cantoId}`, 
        "insert_tercet"
      );
    }
    
    // Insert the tercet
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
      line1Italian.trim(), line2Italian.trim(), line3Italian.trim(),
      line1English?.trim(), line2English?.trim(), line3English?.trim()
    );
    
  } catch (error) {
    if (error instanceof ValidationError || error instanceof DatabaseError) {
      throw error;
    }
    
    // Handle SQLite-specific errors
    if (error instanceof Error && error.message.includes('FOREIGN KEY')) {
      throw new DatabaseError("Invalid canto reference", "insert_tercet");
    }
    
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      throw new DatabaseError("Tercet number already exists", "insert_tercet");
    }
    
    // Re-throw other errors
    throw new DatabaseError(`Unexpected error: ${error}`, "insert_tercet");
  }
}

// Safe query functions with error handling
export function getTercetByIdSafe(tercetId: number) {
  try {
    if (!Number.isInteger(tercetId) || tercetId <= 0) {
      throw new ValidationError("Tercet ID must be a positive integer", "tercet_id");
    }
    
    const query = db.prepare("SELECT * FROM tercets WHERE id = ?");
    const result = query.get(tercetId);
    
    if (!result) {
      throw new DatabaseError(`Tercet with ID ${tercetId} not found`, "get_tercet");
    }
    
    return result;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(`Error retrieving tercet: ${error}`, "get_tercet");
  }
}

// Database health check function
export function checkDatabaseHealth() {
  try {
    // Check if tables exist
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('canticles', 'cantos', 'tercets')
    `).all();
    
    if (tables.length !== 3) {
      throw new DatabaseError("Database schema is incomplete", "health_check");
    }
    
    // Check foreign key integrity
    const integrityCheck = db.prepare("PRAGMA foreign_key_check").all();
    if (integrityCheck.length > 0) {
      throw new DatabaseError("Foreign key integrity violations found", "health_check");
    }
    
    // Check for basic content
    const canticleCount = db.prepare("SELECT COUNT(*) as count FROM canticles").get();
    if (canticleCount.count === 0) {
      console.warn("Warning: No canticles found in database");
    }
    
    return {
      status: "healthy",
      tablesCount: tables.length,
      canticlesCount: canticleCount.count
    };
    
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(`Health check failed: ${error}`, "health_check");
  }
}
```

### Advanced Querying: Search and Analysis

One of the greatest advantages of storing our text in a database is the ability to perform sophisticated searches and analysis. Let's implement some powerful query functions:

```typescript
// src/database.ts (continued)

// Search for tercets containing specific text
export function searchTercets(searchTerm: string, language: 'italian' | 'english' | 'both' = 'both') {
  const term = `%${searchTerm.toLowerCase()}%`;
  
  let whereClause = '';
  if (language === 'italian') {
    whereClause = `
      WHERE LOWER(t.line1_italian) LIKE ? 
         OR LOWER(t.line2_italian) LIKE ? 
         OR LOWER(t.line3_italian) LIKE ?
    `;
  } else if (language === 'english') {
    whereClause = `
      WHERE LOWER(t.line1_english) LIKE ? 
         OR LOWER(t.line2_english) LIKE ? 
         OR LOWER(t.line3_english) LIKE ?
    `;
  } else {
    whereClause = `
      WHERE LOWER(t.line1_italian) LIKE ? 
         OR LOWER(t.line2_italian) LIKE ? 
         OR LOWER(t.line3_italian) LIKE ?
         OR LOWER(t.line1_english) LIKE ?
         OR LOWER(t.line2_english) LIKE ?
         OR LOWER(t.line3_english) LIKE ?
    `;
  }
  
  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      c.title as canto_title,
      cant.name as canticle_name
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    ${whereClause}
    ORDER BY cant.id, c.number, t.number
  `);
  
  const params = language === 'both' 
    ? [term, term, term, term, term, term]
    : [term, term, term];
    
  return query.all(...params);
}

// Get tercets by line pattern (for analyzing Dante's rhyme schemes)
export function getTercetsByRhymePattern() {
  // This is a simplified example - real rhyme analysis would be much more complex
  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      cant.name as canticle_name,
      -- Extract the last word of each line for rhyme analysis
      SUBSTR(t.line1_italian, INSTR(t.line1_italian, ' ') + 1) as line1_last_word,
      SUBSTR(t.line2_italian, INSTR(t.line2_italian, ' ') + 1) as line2_last_word,
      SUBSTR(t.line3_italian, INSTR(t.line3_italian, ' ') + 1) as line3_last_word
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    ORDER BY cant.id, c.number, t.number
  `);
  
  return query.all();
}

// Get statistics about the database content
export function getDatabaseStatistics() {
  const stats = db.prepare(`
    SELECT 
      COUNT(DISTINCT cant.id) as total_canticles,
      COUNT(DISTINCT c.id) as total_cantos,
      COUNT(t.id) as total_tercets,
      COUNT(CASE WHEN t.line1_english IS NOT NULL THEN 1 END) as translated_tercets,
      MIN(c.number) as min_canto_number,
      MAX(c.number) as max_canto_number
    FROM canticles cant
    LEFT JOIN cantos c ON cant.id = c.canticle_id
    LEFT JOIN tercets t ON c.id = t.canto_id
  `).get();
  
  const canticleStats = db.prepare(`
    SELECT 
      cant.name,
      COUNT(DISTINCT c.id) as canto_count,
      COUNT(t.id) as tercet_count
    FROM canticles cant
    LEFT JOIN cantos c ON cant.id = c.canticle_id
    LEFT JOIN tercets t ON c.id = t.canto_id
    GROUP BY cant.id, cant.name
    ORDER BY cant.id
  `).all();
  
  return {
    overall: stats,
    byCanticle: canticleStats
  };
}

// Find tercets that might be good for memorization practice
export function getMemorizationCandidates(limit: number = 10) {
  // This selects tercets that are:
  // 1. Have both Italian and English translations
  // 2. Are not too long (for easier memorization)
  // 3. Come from early cantos (presumably more famous)
  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      c.title as canto_title,
      cant.name as canticle_name,
      (LENGTH(t.line1_italian) + LENGTH(t.line2_italian) + LENGTH(t.line3_italian)) as total_length
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE t.line1_english IS NOT NULL 
      AND t.line2_english IS NOT NULL 
      AND t.line3_english IS NOT NULL
      AND (LENGTH(t.line1_italian) + LENGTH(t.line2_italian) + LENGTH(t.line3_italian)) < 200
    ORDER BY 
      cant.id ASC,           -- Inferno first
      c.number ASC,          -- Earlier cantos first
      total_length ASC       -- Shorter tercets first
    LIMIT ?
  `);
  
  return query.all(limit);
}
```

### Implementing Database-Driven Search in the Web Interface

Now let's add a search feature to our web application that takes advantage of our database capabilities:

```typescript
// src/server.ts (additions)

// Search endpoint
app.get('/search', (c) => {
  const query = c.req.query('q');
  const language = c.req.query('lang') || 'both';
  
  if (!query) {
    return c.html(`
      <div class="search-results">
        <p>Please enter a search term.</p>
      </div>
    `);
  }
  
  try {
    const results = searchTercets(query, language as 'italian' | 'english' | 'both');
    
    if (results.length === 0) {
      return c.html(`
        <div class="search-results">
          <h3>No Results Found</h3>
          <p>No tercets found containing "${query}"</p>
          <p>Try searching for different terms or check your spelling.</p>
        </div>
      `);
    }
    
    return c.html(`
      <div class="search-results">
        <h3>Search Results for "${query}" (${results.length} found)</h3>
        <div class="results-list">
          ${results.map((result, index) => `
            <div class="search-result-item" data-result-index="${index}">
              <div class="result-header">
                <strong>${result.canticle_name}, Canto ${result.canto_number}, Tercet ${result.number}</strong>
              </div>
              
              <div class="result-content">
                <div class="italian-text">
                  <div class="line">${highlightSearchTerm(result.line1_italian, query)}</div>
                  <div class="line">${highlightSearchTerm(result.line2_italian, query)}</div>
                  <div class="line">${highlightSearchTerm(result.line3_italian, query)}</div>
                </div>
                
                ${result.line1_english ? `
                  <div class="english-text">
                    <div class="line">${highlightSearchTerm(result.line1_english, query)}</div>
                    <div class="line">${highlightSearchTerm(result.line2_english, query)}</div>
                    <div class="line">${highlightSearchTerm(result.line3_english, query)}</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="result-actions">
                <button 
                  hx-get="/practice/tercet/${result.id}"
                  hx-target="#practice-area"
                  hx-swap="innerHTML"
                >
                  Practice This Tercet
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
    
  } catch (error) {
    console.error('Search error:', error);
    return c.html(`
      <div class="search-results error">
        <h3>Search Error</h3>
        <p>An error occurred while searching. Please try again.</p>
      </div>
    `);
  }
});

// Helper function to highlight search terms
function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Database statistics endpoint
app.get('/api/database-stats', (c) => {
  try {
    const stats = getDatabaseStatistics();
    return c.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ error: 'Failed to retrieve database statistics' }, 500);
  }
});

// Update the home page to include search functionality
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
          
          <!-- Search Section -->
          <div class="search-section">
            <h3>Search the Divine Comedy</h3>
            <form hx-get="/search" hx-target="#search-results" hx-trigger="submit">
              <div class="search-controls">
                <input 
                  type="text" 
                  name="q" 
                  placeholder="Search for words or phrases..."
                  required
                  autocomplete="off"
                >
                <select name="lang">
                  <option value="both">Italian & English</option>
                  <option value="italian">Italian Only</option>
                  <option value="english">English Only</option>
                </select>
                <button type="submit">Search</button>
              </div>
            </form>
            <div id="search-results"></div>
          </div>
          
          <!-- Database Statistics -->
          <div class="stats" x-data="{ stats: null }" x-init="
            fetch('/api/database-stats')
              .then(r => r.json())
              .then(data => stats = data)
          ">
            <h3>Database Overview</h3>
            <div x-show="stats" class="stats-grid">
              <div class="stat-item">
                <span class="stat-number" x-text="stats?.overall?.total_tercets || 0"></span>
                <span class="stat-label">Total Tercets</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" x-text="stats?.overall?.total_cantos || 0"></span>
                <span class="stat-label">Total Cantos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" x-text="stats?.overall?.translated_tercets || 0"></span>
                <span class="stat-label">With Translation</span>
              </div>
            </div>
          </div>
          
          <!-- Existing canticles section -->
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
          
          <!-- Practice Section -->
          <div class="practice-section">
            <h3>Practice Mode</h3>
            <div class="practice-buttons">
              <button 
                hx-get="/practice/random"
                hx-target="#practice-area"
                hx-swap="innerHTML"
              >
                Random Tercet
              </button>
              
              <button 
                hx-get="/practice/memorization-candidates"
                hx-target="#practice-area"
                hx-swap="innerHTML"
              >
                Good for Memorization
              </button>
            </div>
          </div>
          
          <div id="content"></div>
          <div id="practice-area"></div>
        </div>
      </body>
    </html>
  `);
});
```

### Reflection: What We've Accomplished

In this chapter, we've transformed our Dante memorization application from a fragile, memory-based system into a robust, database-driven platform. The changes represent more than just technical improvements—they reflect a fundamental shift in how we can engage with literary texts through technology.

#### Technical Achievements

1. **Persistent Storage**: Our application now retains all data across server restarts
2. **Structured Data**: The hierarchical relationship between canticles, cantos, and tercets is properly modeled
3. **Efficient Querying**: We can search, filter, and analyze the text in ways impossible with flat files
4. **Error Handling**: Robust validation ensures data integrity and provides meaningful feedback
5. **Scalability**: Adding new content requires no code changes

#### Literary and Pedagogical Gains

1. **Scholarly Structure**: Our database schema reflects serious engagement with the *Divine Comedy's* organization
2. **Search Capabilities**: Students can now explore thematic connections across the entire work
3. **Statistical Analysis**: We can track which passages are studied most frequently and effectively
4. **Preservation**: The text is stored in a format that ensures long-term accessibility
5. **Scholarly Apparatus**: Our design allows for future additions like critical annotations and variant readings

### Looking Ahead to Chapter 8

We've established the foundation of our database-driven application, but we've only scratched the surface of what's possible with relational data. In Chapter 8, we'll explore advanced database concepts that will transform our simple text storage into a sophisticated learning platform:

1. **Complex Relationships**: We'll add user accounts, progress tracking, and spaced repetition scheduling
2. **Advanced Queries**: JOIN operations, aggregations, and analytical queries
3. **Data Integrity**: Transactions, constraints, and referential integrity
4. **Performance Optimization**: Indexes, query optimization, and efficient data access patterns
5. **Content Management**: Administrative tools for adding and editing content

Most importantly, we'll implement the user-specific data that makes personalized learning possible—tracking which tercets each user has studied, when they last reviewed them, and how well they performed.

Like Dante ascending from the Inferno to Purgatory, we've moved from the chaos of unstructured data to the ordered realm of persistent storage. In our next chapter, we'll climb higher still, creating the complex relationships and sophisticated queries that transform raw data into knowledge and wisdom.

---