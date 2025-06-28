---
title: "Advanced Data Operations - Relationships and Queries"
description: Complex database relationships, user management, advanced SQL operations
---

# Chapter 8: Advanced Data Operations - Relationships and Queries

*"L'acqua ch'io prendo già mai non si corse" — The water that I take was never run before*

## Opening: The Illuminated Manuscript

Imagine yourself in the scriptorium of a medieval monastery, where master scribes are creating an illuminated manuscript of the *Divine Comedy*. The text alone is not enough—margins teem with scholarly commentary, cross-references connect related passages across different cantos, and elaborate diagrams map the geography of Hell, Purgatory, and Paradise.

Each annotation creates a relationship: this line echoes an earlier passage, that character appears again in a different context, these tercets share a common theme. The manuscript becomes a web of interconnected meaning, where understanding emerges not just from individual passages but from the relationships between them.

This is exactly what we'll accomplish in this chapter by implementing advanced database relationships and queries. We'll transform our simple text storage into a sophisticated system that can model the complex connections within Dante's work and track each user's individual learning journey.

## Learning Objectives

By completing this chapter, you will:

- **Master database relationships** through implementing user accounts, progress tracking, and study statistics
- **Learn advanced SQL operations** including JOINs, subqueries, aggregations, and window functions
- **Implement comprehensive user management** with authentication, personal progress, and study histories
- **Design complex data models** that capture both textual relationships and learning analytics
- **Optimize database performance** using indexes, query planning, and efficient data access patterns
- **Build administrative interfaces** for content management and system monitoring

## Understanding Relational Database Design

Before diving into implementation, let's explore the theory behind relational databases and why they're particularly powerful for educational applications.

### The Relational Model for Literary Learning

Our current database structure models the *Divine Comedy* itself, but learning is fundamentally relational. When you study a tercet, you're creating relationships:

- **User ↔ Tercet**: Which tercets has this user studied?
- **Study Session ↔ Performance**: How well did they perform?
- **Time ↔ Retention**: When should they review again?
- **Difficulty ↔ Content**: Which passages are naturally harder to memorize?

These relationships require a more sophisticated data model:

```
Users (who is studying)
├── Study Sessions (individual practice sessions)
│   ├── Session Results (performance on specific tercets)
│   └── Review Schedule (when to study each tercet next)
├── User Preferences (interface settings, study goals)
└── Progress Tracking (long-term learning analytics)

Textual Content (what is being studied)
├── Themes (recurring topics across the work)
├── Characters (who appears where)
├── Cross References (textual connections)
└── Editorial Notes (scholarly commentary)
```

This extended model allows us to answer sophisticated questions:

- Which tercets does this user struggle with most?
- What are the optimal review intervals for different types of content?
- How does performance correlate with the literary difficulty of passages?
- Which thematic connections help users remember related tercets?

### Database Normalization and Integrity

Normalization is the process of organizing data to reduce redundancy and ensure consistency. For our application, this means:

**First Normal Form (1NF)**: Each column contains atomic values
- ✓ We don't store multiple values in a single field
- ✓ Each tercet has exactly three lines, stored separately

**Second Normal Form (2NF)**: All non-key attributes depend on the entire primary key
- ✓ Tercet content depends on the tercet ID, not just the canto
- ✓ User progress depends on both user ID and tercet ID

**Third Normal Form (3NF)**: No transitive dependencies
- ✓ Canto titles depend on canto ID, not on tercet ID
- ✓ User preferences depend on user ID, not on study session ID

This theoretical foundation ensures our database remains consistent and efficient as it grows.

## Implementing User Management and Authentication

Let's start by adding user management to our application. This requires new tables and updated application logic:

```typescript
// src/database.ts (additions)

// Create additional tables for user management and learning tracking
const userSchema = `
  -- Users table: Individual accounts and preferences
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    study_goal_tercets_per_day INTEGER DEFAULT 5,
    preferred_language TEXT DEFAULT 'both' CHECK (preferred_language IN ('italian', 'english', 'both')),
    preferred_translator TEXT DEFAULT 'singleton',
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'sepia')),
    text_size TEXT DEFAULT 'medium' CHECK (text_size IN ('small', 'medium', 'large', 'extra-large')),
    show_line_numbers BOOLEAN DEFAULT 0,
    auto_reveal_translation BOOLEAN DEFAULT 0,
    sound_effects BOOLEAN DEFAULT 1
  );

  -- Study sessions: Individual practice periods
  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    goal_tercets INTEGER DEFAULT 5,
    completed_tercets INTEGER DEFAULT 0,
    session_type TEXT DEFAULT 'general' CHECK (session_type IN ('general', 'sequential', 'random', 'focused', 'review')),
    focus_area TEXT CHECK (focus_area IN ('all', 'inferno', 'purgatorio', 'paradiso')),
    total_time_seconds INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Study results: Performance on individual tercets within sessions
  CREATE TABLE IF NOT EXISTS study_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    studied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    comprehension_rating INTEGER CHECK (comprehension_rating BETWEEN 1 AND 5),
    recall_success BOOLEAN,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES study_sessions(id),
    FOREIGN KEY (tercet_id) REFERENCES tercets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Spaced repetition schedule: When to review each tercet next
  CREATE TABLE IF NOT EXISTS spaced_repetition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    interval_days INTEGER DEFAULT 1,
    ease_factor REAL DEFAULT 2.5,
    repetitions INTEGER DEFAULT 0,
    next_review_date DATE NOT NULL,
    last_reviewed DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tercet_id) REFERENCES tercets(id),
    UNIQUE(user_id, tercet_id)
  );

  -- User bookmarks: Tercets saved for easy access
  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    tags TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tercet_id) REFERENCES tercets(id),
    UNIQUE(user_id, tercet_id)
  );

  -- User progress tracking: Long-term statistics
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tercets_studied INTEGER DEFAULT 0,
    total_study_time_seconds INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_study_date DATE,
    inferno_progress REAL DEFAULT 0.0,
    purgatorio_progress REAL DEFAULT 0.0,
    paradiso_progress REAL DEFAULT 0.0,
    average_difficulty_rating REAL,
    average_comprehension_rating REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
  );
`;

// Execute the user schema
db.exec(userSchema);
```

Now let's implement user management functions:

```typescript
// src/database.ts (continued)

import { hash, verify } from 'bun:password';

// User management functions
export async function createUser(
  username: string,
  email: string,
  password: string,
  displayName?: string
) {
  // Hash the password securely
  const passwordHash = await hash(password);
  
  try {
    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = insertUser.run(username, email, passwordHash, displayName);
    
    // Initialize user progress
    const insertProgress = db.prepare(`
      INSERT INTO user_progress (user_id)
      VALUES (?)
    `);
    insertProgress.run(result.lastInsertRowid);
    
    return result.lastInsertRowid;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export async function authenticateUser(username: string, password: string) {
  const query = db.prepare(`
    SELECT id, username, email, password_hash, display_name
    FROM users
    WHERE username = ? OR email = ?
  `);
  
  const user = query.get(username, username);
  
  if (!user) {
    return null;
  }
  
  const isValid = await verify(password, user.password_hash);
  
  if (!isValid) {
    return null;
  }
  
  // Update last login
  const updateLogin = db.prepare(`
    UPDATE users 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  updateLogin.run(user.id);
  
  // Return user without password hash
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export function getUserById(userId: number) {
  const query = db.prepare(`
    SELECT id, username, email, display_name, created_at, last_login,
           study_goal_tercets_per_day, preferred_language, preferred_translator,
           theme, text_size, show_line_numbers, auto_reveal_translation, sound_effects
    FROM users
    WHERE id = ?
  `);
  
  return query.get(userId);
}

export function updateUserPreferences(userId: number, preferences: Partial<UserPreferences>) {
  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(preferences)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  
  if (fields.length === 0) return;
  
  const query = db.prepare(`
    UPDATE users 
    SET ${fields.join(', ')}
    WHERE id = ?
  `);
  
  values.push(userId);
  return query.run(...values);
}
```

## Advanced Study Session Management

Now let's implement sophisticated study session tracking that captures the full context of how users interact with the text:

```typescript
// src/database.ts (continued)

export function startStudySession(
  userId: number,
  sessionType: string = 'general',
  goalTercets: number = 5,
  focusArea?: string
) {
  const insert = db.prepare(`
    INSERT INTO study_sessions (user_id, session_type, goal_tercets, focus_area)
    VALUES (?, ?, ?, ?)
  `);
  
  return insert.run(userId, sessionType, goalTercets, focusArea);
}

export function endStudySession(sessionId: number) {
  const update = db.prepare(`
    UPDATE study_sessions
    SET ended_at = CURRENT_TIMESTAMP,
        total_time_seconds = (
          strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', started_at)
        )
    WHERE id = ?
  `);
  
  return update.run(sessionId);
}

export function recordStudyResult(
  sessionId: number,
  tercetId: number,
  userId: number,
  timeSpentSeconds: number,
  difficultyRating?: number,
  comprehensionRating?: number,
  recallSuccess?: boolean,
  notes?: string
) {
  const insert = db.prepare(`
    INSERT INTO study_results (
      session_id, tercet_id, user_id, time_spent_seconds,
      difficulty_rating, comprehension_rating, recall_success, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    sessionId, tercetId, userId, timeSpentSeconds,
    difficultyRating, comprehensionRating, recallSuccess, notes
  );
  
  // Update session completed count
  const updateSession = db.prepare(`
    UPDATE study_sessions
    SET completed_tercets = completed_tercets + 1
    WHERE id = ?
  `);
  updateSession.run(sessionId);
  
  // Update user progress
  updateUserProgress(userId);
  
  // Update spaced repetition schedule
  updateSpacedRepetition(userId, tercetId, difficultyRating || 3);
  
  return result;
}

// Complex query to get user's study statistics
export function getUserStudyStatistics(userId: number) {
  const query = db.prepare(`
    WITH recent_sessions AS (
      SELECT 
        s.id,
        s.started_at,
        s.ended_at,
        s.completed_tercets,
        s.total_time_seconds,
        s.session_type
      FROM study_sessions s
      WHERE s.user_id = ? 
        AND s.started_at >= date('now', '-30 days')
      ORDER BY s.started_at DESC
    ),
    performance_stats AS (
      SELECT 
        AVG(sr.difficulty_rating) as avg_difficulty,
        AVG(sr.comprehension_rating) as avg_comprehension,
        COUNT(*) as total_results,
        SUM(sr.time_spent_seconds) as total_time,
        COUNT(CASE WHEN sr.recall_success = 1 THEN 1 END) as successful_recalls
      FROM study_results sr
      WHERE sr.user_id = ?
        AND sr.studied_at >= date('now', '-30 days')
    ),
    daily_progress AS (
      SELECT 
        date(sr.studied_at) as study_date,
        COUNT(DISTINCT sr.tercet_id) as tercets_studied,
        SUM(sr.time_spent_seconds) as daily_time
      FROM study_results sr
      WHERE sr.user_id = ?
        AND sr.studied_at >= date('now', '-30 days')
      GROUP BY date(sr.studied_at)
      ORDER BY study_date DESC
    )
    SELECT 
      (SELECT COUNT(*) FROM recent_sessions) as sessions_count,
      (SELECT AVG(completed_tercets) FROM recent_sessions) as avg_tercets_per_session,
      (SELECT SUM(total_time_seconds) FROM recent_sessions) as total_study_time,
      (SELECT avg_difficulty FROM performance_stats) as avg_difficulty_rating,
      (SELECT avg_comprehension FROM performance_stats) as avg_comprehension_rating,
      (SELECT 
        CASE WHEN total_results > 0 
        THEN ROUND((successful_recalls * 100.0 / total_results), 1)
        ELSE 0 END 
        FROM performance_stats) as recall_success_rate,
      (SELECT COUNT(*) FROM daily_progress) as active_days,
      (SELECT MAX(tercets_studied) FROM daily_progress) as best_day_tercets
  `);
  
  return query.get(userId, userId, userId);
}
```

## Implementing Spaced Repetition Algorithm

One of the most powerful features we can add is spaced repetition—an evidence-based learning technique that schedules reviews based on how well you know each tercet:

```typescript
// src/database.ts (continued)

function updateSpacedRepetition(
  userId: number, 
  tercetId: number, 
  performanceRating: number
) {
  // Get existing spaced repetition record or create new one
  const existing = db.prepare(`
    SELECT * FROM spaced_repetition
    WHERE user_id = ? AND tercet_id = ?
  `).get(userId, tercetId);
  
  if (existing) {
    // Update existing record using SM-2 algorithm
    const newValues = calculateNextReview(
      existing.ease_factor,
      existing.repetitions,
      existing.interval_days,
      performanceRating
    );
    
    const update = db.prepare(`
      UPDATE spaced_repetition
      SET 
        interval_days = ?,
        ease_factor = ?,
        repetitions = ?,
        next_review_date = date('now', '+' || ? || ' days'),
        last_reviewed = CURRENT_TIMESTAMP
      WHERE user_id = ? AND tercet_id = ?
    `);
    
    update.run(
      newValues.interval,
      newValues.easeFactor,
      newValues.repetitions,
      newValues.interval,
      userId,
      tercetId
    );
  } else {
    // Create new spaced repetition record
    const newValues = calculateNextReview(2.5, 0, 1, performanceRating);
    
    const insert = db.prepare(`
      INSERT INTO spaced_repetition (
        user_id, tercet_id, interval_days, ease_factor, repetitions, next_review_date
      ) VALUES (?, ?, ?, ?, ?, date('now', '+' || ? || ' days'))
    `);
    
    insert.run(
      userId, tercetId, newValues.interval, newValues.easeFactor, 
      newValues.repetitions, newValues.interval
    );
  }
}

// SM-2 spaced repetition algorithm implementation
function calculateNextReview(
  easeFactor: number,
  repetitions: number,
  currentInterval: number,
  performanceRating: number
): { interval: number, easeFactor: number, repetitions: number } {
  // Performance rating: 1-5 where 3+ is considered successful
  const success = performanceRating >= 3;
  
  if (!success) {
    // Reset on failure
    return {
      interval: 1,
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      repetitions: 0
    };
  }
  
  // Successful recall
  const newRepetitions = repetitions + 1;
  let newInterval: number;
  
  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(currentInterval * easeFactor);
  }
  
  // Adjust ease factor based on performance
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02))
  );
  
  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions
  };
}

// Get tercets due for review
export function getTercetsDueForReview(userId: number, limit: number = 10) {
  const query = db.prepare(`
    SELECT 
      t.id,
      t.canto_id,
      t.number as tercet_number,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      t.line1_english,
      t.line2_english,
      t.line3_english,
      c.number as canto_number,
      cant.name as canticle_name,
      sr.next_review_date,
      sr.repetitions,
      sr.ease_factor
    FROM spaced_repetition sr
    JOIN tercets t ON sr.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE sr.user_id = ?
      AND sr.next_review_date <= date('now')
    ORDER BY sr.next_review_date ASC, sr.ease_factor ASC
    LIMIT ?
  `);
  
  return query.all(userId, limit);
}
```

## Building Complex Analytical Queries

Let's implement some sophisticated analytical queries that provide insights into learning patterns:

```typescript
// src/database.ts (continued)

// Get learning analytics for a user
export function getLearningAnalytics(userId: number, days: number = 30) {
  const query = db.prepare(`
    WITH daily_stats AS (
      SELECT 
        date(sr.studied_at) as study_date,
        COUNT(DISTINCT sr.tercet_id) as unique_tercets,
        COUNT(*) as total_studies,
        AVG(sr.difficulty_rating) as avg_difficulty,
        AVG(sr.comprehension_rating) as avg_comprehension,
        SUM(sr.time_spent_seconds) as total_time,
        COUNT(CASE WHEN sr.recall_success = 1 THEN 1 END) as successful_recalls
      FROM study_results sr
      WHERE sr.user_id = ?
        AND sr.studied_at >= date('now', '-' || ? || ' days')
      GROUP BY date(sr.studied_at)
    ),
    canticle_progress AS (
      SELECT 
        cant.name as canticle,
        COUNT(DISTINCT sr.tercet_id) as studied_tercets,
        COUNT(DISTINCT t.id) as total_tercets,
        ROUND(COUNT(DISTINCT sr.tercet_id) * 100.0 / COUNT(DISTINCT t.id), 1) as progress_percent
      FROM canticles cant
      JOIN cantos c ON cant.id = c.canticle_id
      JOIN tercets t ON c.id = t.canto_id
      LEFT JOIN study_results sr ON t.id = sr.tercet_id AND sr.user_id = ?
      GROUP BY cant.id, cant.name
    ),
    difficulty_analysis AS (
      SELECT 
        CASE 
          WHEN sr.difficulty_rating <= 2 THEN 'Easy'
          WHEN sr.difficulty_rating = 3 THEN 'Medium'
          ELSE 'Hard'
        END as difficulty_category,
        COUNT(*) as count,
        AVG(sr.time_spent_seconds) as avg_time_spent
      FROM study_results sr
      WHERE sr.user_id = ?
        AND sr.studied_at >= date('now', '-' || ? || ' days')
        AND sr.difficulty_rating IS NOT NULL
      GROUP BY difficulty_category
    )
    SELECT 
      -- Daily statistics
      (SELECT COUNT(*) FROM daily_stats) as active_days,
      (SELECT AVG(unique_tercets) FROM daily_stats) as avg_tercets_per_day,
      (SELECT MAX(unique_tercets) FROM daily_stats) as best_day_tercets,
      (SELECT AVG(total_time) FROM daily_stats) as avg_study_time_per_day,
      
      -- Overall performance
      (SELECT AVG(avg_difficulty) FROM daily_stats) as overall_avg_difficulty,
      (SELECT AVG(avg_comprehension) FROM daily_stats) as overall_avg_comprehension,
      (SELECT 
        CASE WHEN SUM(total_studies) > 0 
        THEN ROUND(SUM(successful_recalls) * 100.0 / SUM(total_studies), 1)
        ELSE 0 END
        FROM daily_stats) as overall_recall_rate,
      
      -- Progress by canticle
      (SELECT json_group_array(
        json_object(
          'canticle', canticle,
          'studied', studied_tercets,
          'total', total_tercets,
          'progress', progress_percent
        )
      ) FROM canticle_progress) as canticle_progress,
      
      -- Difficulty distribution
      (SELECT json_group_array(
        json_object(
          'difficulty', difficulty_category,
          'count', count,
          'avg_time', avg_time_spent
        )
      ) FROM difficulty_analysis) as difficulty_distribution
  `);
  
  return query.get(userId, days, userId, userId, days);
}

// Get tercets that need more practice (low performance)
export function getTercetsNeedingPractice(userId: number, limit: number = 10) {
  const query = db.prepare(`
    SELECT 
      t.id,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      c.number as canto_number,
      cant.name as canticle_name,
      AVG(sr.difficulty_rating) as avg_difficulty,
      AVG(sr.comprehension_rating) as avg_comprehension,
      COUNT(*) as study_count,
      COUNT(CASE WHEN sr.recall_success = 1 THEN 1 END) as success_count,
      MAX(sr.studied_at) as last_studied
    FROM study_results sr
    JOIN tercets t ON sr.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE sr.user_id = ?
    GROUP BY t.id
    HAVING study_count >= 2
      AND (avg_difficulty >= 4 OR success_count * 1.0 / study_count < 0.7)
    ORDER BY avg_difficulty DESC, success_count * 1.0 / study_count ASC
    LIMIT ?
  `);
  
  return query.all(userId, limit);
}

// Get learning streaks and patterns
export function getLearningStreaks(userId: number) {
  const query = db.prepare(`
    WITH daily_activity AS (
      SELECT 
        date(sr.studied_at) as study_date,
        COUNT(DISTINCT sr.tercet_id) as tercets_studied
      FROM study_results sr
      WHERE sr.user_id = ?
      GROUP BY date(sr.studied_at)
      ORDER BY study_date DESC
    ),
    streak_calculation AS (
      SELECT 
        study_date,
        tercets_studied,
        LAG(study_date) OVER (ORDER BY study_date) as prev_date,
        ROW_NUMBER() OVER (ORDER BY study_date DESC) as row_num
      FROM daily_activity
    ),
    current_streak AS (
      SELECT COUNT(*) as days
      FROM streak_calculation
      WHERE row_num <= (
        SELECT COALESCE(MIN(row_num), 0)
        FROM streak_calculation
        WHERE date(study_date, '+1 day') != COALESCE(
          date((SELECT study_date FROM streak_calculation s2 
                WHERE s2.row_num = streak_calculation.row_num + 1)), 
          date(study_date, '+1 day')
        )
      )
    )
    SELECT 
      (SELECT days FROM current_streak) as current_streak_days,
      COUNT(DISTINCT da.study_date) as total_study_days,
      MIN(da.study_date) as first_study_date,
      MAX(da.study_date) as last_study_date,
      MAX(da.tercets_studied) as best_single_day
    FROM daily_activity da
  `);
  
  return query.get(userId);
}
```

## Creating Administrative and Monitoring Interfaces

Finally, let's add some administrative capabilities for content management and system monitoring:

```typescript
// src/database.ts (continued)

// Administrative functions for monitoring the system
export function getSystemStatistics() {
  const query = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM users WHERE last_login >= date('now', '-7 days')) as active_users_week,
      (SELECT COUNT(*) FROM users WHERE last_login >= date('now', '-30 days')) as active_users_month,
      (SELECT COUNT(*) FROM study_sessions) as total_sessions,
      (SELECT COUNT(*) FROM study_sessions WHERE started_at >= date('now', '-7 days')) as sessions_this_week,
      (SELECT COUNT(*) FROM study_results) as total_study_results,
      (SELECT COUNT(DISTINCT tercet_id) FROM study_results) as tercets_studied,
      (SELECT COUNT(*) FROM tercets) as total_tercets_available,
      (SELECT AVG(difficulty_rating) FROM study_results WHERE difficulty_rating IS NOT NULL) as avg_difficulty_rating,
      (SELECT AVG(comprehension_rating) FROM study_results WHERE comprehension_rating IS NOT NULL) as avg_comprehension_rating
  `);
  
  return query.get();
}

// Get content gaps - tercets that haven't been studied much
export function getContentGaps(limit: number = 20) {
  const query = db.prepare(`
    SELECT 
      t.id,
      t.line1_italian,
      c.number as canto_number,
      cant.name as canticle_name,
      COALESCE(study_count.count, 0) as times_studied,
      COALESCE(study_count.avg_difficulty, 0) as avg_difficulty
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    LEFT JOIN (
      SELECT 
        tercet_id,
        COUNT(*) as count,
        AVG(difficulty_rating) as avg_difficulty
      FROM study_results
      GROUP BY tercet_id
    ) study_count ON t.id = study_count.tercet_id
    ORDER BY COALESCE(study_count.count, 0) ASC, t.id ASC
    LIMIT ?
  `);
  
  return query.all(limit);
}

// Performance monitoring - identify slow queries or heavy usage
export function getPerformanceMetrics() {
  const query = db.prepare(`
    SELECT 
      'Average session duration' as metric,
      AVG(total_time_seconds) as value,
      'seconds' as unit
    FROM study_sessions
    WHERE ended_at IS NOT NULL
    
    UNION ALL
    
    SELECT 
      'Average tercets per session' as metric,
      AVG(completed_tercets) as value,
      'tercets' as unit
    FROM study_sessions
    WHERE ended_at IS NOT NULL
    
    UNION ALL
    
    SELECT 
      'Average time per tercet' as metric,
      AVG(time_spent_seconds) as value,
      'seconds' as unit
    FROM study_results
    WHERE time_spent_seconds > 0
    
    UNION ALL
    
    SELECT 
      'Database size' as metric,
      page_count * page_size as value,
      'bytes' as unit
    FROM pragma_page_count(), pragma_page_size()
  `);
  
  return query.all();
}
```

This chapter demonstrates how sophisticated database relationships and queries can transform a simple text application into a comprehensive learning platform. By modeling not just the content but the learning process itself, we create opportunities for personalization, optimization, and deep insights into how people engage with classical literature.

The implementation shows how proper database design enables features like spaced repetition, progress tracking, and learning analytics—all while maintaining the literary focus that makes studying Dante's work meaningful and enriching.

## Reflection and Next Steps

In this chapter, we've built a sophisticated data model that captures both the structure of Dante's masterpiece and the complexity of human learning. Our database now understands relationships between users and content, tracks performance over time, and provides insights that can improve the learning experience.

This foundation sets the stage for the advanced features we'll explore in Part IV, where we'll build user interfaces that leverage this rich data model to create personalized, adaptive learning experiences worthy of one of literature's greatest works.