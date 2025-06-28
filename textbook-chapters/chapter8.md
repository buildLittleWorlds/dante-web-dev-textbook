

## Chapter 8: Advanced Data Operations - Relationships and Queries

*"L'acqua ch'io prendo già mai non si corse" — The water that I take was never run before*

### Opening: The Illuminated Manuscript

Imagine yourself in the scriptorium of a medieval monastery, where master scribes are creating an illuminated manuscript of the *Divine Comedy*. The text alone is not enough—margins teem with scholarly commentary, cross-references connect related passages across different cantos, and elaborate diagrams map the geography of Hell, Purgatory, and Paradise.

Each annotation creates a relationship: this line echoes an earlier passage, that character appears again in a different context, these tercets share a common theme. The manuscript becomes a web of interconnected meaning, where understanding emerges not just from individual passages but from the relationships between them.

This is exactly what we'll accomplish in this chapter by implementing advanced database relationships and queries. We'll transform our simple text storage into a sophisticated system that can model the complex connections within Dante's work and track each user's individual learning journey.

### Learning Objectives

By completing this chapter, you will:

- **Master database relationships** through implementing user accounts, progress tracking, and study statistics
- **Learn advanced SQL operations** including JOINs, subqueries, aggregations, and window functions
- **Implement comprehensive user management** with authentication, personal progress, and study histories
- **Design complex data models** that capture both textual relationships and learning analytics
- **Optimize database performance** using indexes, query planning, and efficient data access patterns
- **Build administrative interfaces** for content management and system monitoring

### Understanding Relational Database Design

Before diving into implementation, let's explore the theory behind relational databases and why they're particularly powerful for educational applications.

#### The Relational Model for Literary Learning

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

#### Database Normalization and Integrity

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

### Implementing User Management and Authentication

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
    timezone TEXT DEFAULT 'UTC'
  );

  -- Study sessions: Individual practice sessions
  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_end DATETIME,
    total_tercets_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    session_type TEXT DEFAULT 'practice' CHECK (session_type IN ('practice', 'review', 'test')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Study results: Performance on individual tercets within sessions
  CREATE TABLE IF NOT EXISTS study_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    result_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    response_time_seconds INTEGER,
    was_correct BOOLEAN DEFAULT FALSE,
    study_method TEXT DEFAULT 'recognition' CHECK (study_method IN ('recognition', 'recall', 'typing')),
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES study_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tercet_id) REFERENCES tercets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Spaced repetition schedule: When each user should review each tercet
  CREATE TABLE IF NOT EXISTS review_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    next_review_date DATETIME NOT NULL,
    interval_days INTEGER DEFAULT 1,
    repetition_number INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    last_studied DATETIME,
    total_reviews INTEGER DEFAULT 0,
    consecutive_correct INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tercet_id) REFERENCES tercets(id) ON DELETE CASCADE,
    UNIQUE(user_id, tercet_id)
  );

  -- User preferences and settings
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference_key TEXT NOT NULL,
    preference_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, preference_key)
  );

  -- Bookmarks and personal annotations
  CREATE TABLE IF NOT EXISTS user_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tercet_id INTEGER NOT NULL,
    bookmark_type TEXT DEFAULT 'favorite' CHECK (bookmark_type IN ('favorite', 'difficult', 'memorized')),
    annotation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tercet_id) REFERENCES tercets(id) ON DELETE CASCADE,
    UNIQUE(user_id, tercet_id, bookmark_type)
  );
`;

// Execute the user schema
db.exec(userSchema);

// Create indexes for better query performance
const indexes = `
  -- Indexes for common query patterns
  CREATE INDEX IF NOT EXISTS idx_study_results_user_tercet ON study_results(user_id, tercet_id);
  CREATE INDEX IF NOT EXISTS idx_study_results_session ON study_results(session_id);
  CREATE INDEX IF NOT EXISTS idx_review_schedule_user_date ON review_schedule(user_id, next_review_date);
  CREATE INDEX IF NOT EXISTS idx_study_sessions_user_start ON study_sessions(user_id, session_start);
  CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_type ON user_bookmarks(user_id, bookmark_type);
`;

db.exec(indexes);
```

Now let's implement user management functions:

```typescript
// src/database.ts (continued)

import bcrypt from 'bcrypt';

// User management functions
export interface User {
  id: number;
  username: string;
  email: string;
  display_name?: string;
  created_at: string;
  last_login?: string;
  study_goal_tercets_per_day: number;
  preferred_language: 'italian' | 'english' | 'both';
  timezone: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  study_goal_tercets_per_day?: number;
  preferred_language?: 'italian' | 'english' | 'both';
  timezone?: string;
}

// Create a new user account
export async function createUser(userData: CreateUserData): Promise<User> {
  const {
    username,
    email,
    password,
    display_name,
    study_goal_tercets_per_day = 5,
    preferred_language = 'both',
    timezone = 'UTC'
  } = userData;

  // Validate input
  if (!username || username.length < 3) {
    throw new ValidationError("Username must be at least 3 characters", "username");
  }
  
  if (!email || !email.includes('@')) {
    throw new ValidationError("Valid email address required", "email");
  }
  
  if (!password || password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters", "password");
  }

  // Check if username or email already exists
  const existingUser = db.prepare(`
    SELECT id FROM users WHERE username = ? OR email = ?
  `).get(username, email);

  if (existingUser) {
    throw new DatabaseError("Username or email already exists", "create_user");
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, 12);

  // Insert new user
  const insert = db.prepare(`
    INSERT INTO users (
      username, email, password_hash, display_name,
      study_goal_tercets_per_day, preferred_language, timezone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    username, email, password_hash, display_name,
    study_goal_tercets_per_day, preferred_language, timezone
  );

  // Return the created user (without password hash)
  const newUser = db.prepare(`
    SELECT id, username, email, display_name, created_at,
           study_goal_tercets_per_day, preferred_language, timezone
    FROM users WHERE id = ?
  `).get(result.lastInsertRowid) as User;

  return newUser;
}

// Authenticate user login
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const userWithPassword = db.prepare(`
    SELECT * FROM users WHERE username = ? OR email = ?
  `).get(username, username);

  if (!userWithPassword) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password_hash);
  if (!isValid) {
    return null;
  }

  // Update last login
  db.prepare(`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
  `).run(userWithPassword.id);

  // Return user without password hash
  const { password_hash, ...user } = userWithPassword;
  return user as User;
}

// Get user by ID
export function getUserById(userId: number): User | null {
  const user = db.prepare(`
    SELECT id, username, email, display_name, created_at, last_login,
           study_goal_tercets_per_day, preferred_language, timezone
    FROM users WHERE id = ?
  `).get(userId) as User | undefined;

  return user || null;
}

// Update user preferences
export function updateUserPreference(userId: number, key: string, value: string) {
  const upsert = db.prepare(`
    INSERT INTO user_preferences (user_id, preference_key, preference_value, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, preference_key) 
    DO UPDATE SET preference_value = ?, updated_at = CURRENT_TIMESTAMP
  `);

  return upsert.run(userId, key, value, value);
}

// Get user preferences
export function getUserPreferences(userId: number): Record<string, string> {
  const preferences = db.prepare(`
    SELECT preference_key, preference_value
    FROM user_preferences WHERE user_id = ?
  `).all(userId) as Array<{ preference_key: string; preference_value: string }>;

  return preferences.reduce((acc, pref) => {
    acc[pref.preference_key] = pref.preference_value;
    return acc;
  }, {} as Record<string, string>);
}
```

### Implementing Study Session Tracking

Now let's implement the functions that track user study sessions and performance:

```typescript
// src/database.ts (continued)

export interface StudySession {
  id: number;
  user_id: number;
  session_start: string;
  session_end?: string;
  total_tercets_studied: number;
  correct_answers: number;
  session_type: 'practice' | 'review' | 'test';
}

export interface StudyResult {
  id: number;
  session_id: number;
  tercet_id: number;
  user_id: number;
  result_timestamp: string;
  difficulty_rating?: number;
  response_time_seconds?: number;
  was_correct: boolean;
  study_method: 'recognition' | 'recall' | 'typing';
  notes?: string;
}

// Start a new study session
export function startStudySession(
  userId: number,
  sessionType: 'practice' | 'review' | 'test' = 'practice'
): StudySession {
  const insert = db.prepare(`
    INSERT INTO study_sessions (user_id, session_type)
    VALUES (?, ?)
  `);

  const result = insert.run(userId, sessionType);
  
  const session = db.prepare(`
    SELECT * FROM study_sessions WHERE id = ?
  `).get(result.lastInsertRowid) as StudySession;

  return session;
}

// End a study session
export function endStudySession(sessionId: number): StudySession {
  // Calculate session statistics
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_tercets_studied,
      SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct_answers
    FROM study_results
    WHERE session_id = ?
  `).get(sessionId) as { total_tercets_studied: number; correct_answers: number };

  // Update session with end time and statistics
  const update = db.prepare(`
    UPDATE study_sessions 
    SET session_end = CURRENT_TIMESTAMP,
        total_tercets_studied = ?,
        correct_answers = ?
    WHERE id = ?
  `);

  update.run(stats.total_tercets_studied, stats.correct_answers, sessionId);

  // Return updated session
  const session = db.prepare(`
    SELECT * FROM study_sessions WHERE id = ?
  `).get(sessionId) as StudySession;

  return session;
}

// Record a study result for a specific tercet
export function recordStudyResult(
  sessionId: number,
  tercetId: number,
  userId: number,
  wasCorrect: boolean,
  options: {
    difficulty_rating?: number;
    response_time_seconds?: number;
    study_method?: 'recognition' | 'recall' | 'typing';
    notes?: string;
  } = {}
): StudyResult {
  const {
    difficulty_rating,
    response_time_seconds,
    study_method = 'recognition',
    notes
  } = options;

  const insert = db.prepare(`
    INSERT INTO study_results (
      session_id, tercet_id, user_id, was_correct,
      difficulty_rating, response_time_seconds, study_method, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    sessionId, tercetId, userId, wasCorrect,
    difficulty_rating, response_time_seconds, study_method, notes
  );

  // Update spaced repetition schedule
  updateSpacedRepetitionSchedule(userId, tercetId, wasCorrect, difficulty_rating || 3);

  const studyResult = db.prepare(`
    SELECT * FROM study_results WHERE id = ?
  `).get(result.lastInsertRowid) as StudyResult;

  return studyResult;
}

// Get study history for a user
export function getUserStudyHistory(
  userId: number,
  limit: number = 50,
  offset: number = 0
): Array<StudySession & { success_rate: number }> {
  const query = db.prepare(`
    SELECT 
      s.*,
      CASE 
        WHEN s.total_tercets_studied > 0 
        THEN ROUND((s.correct_answers * 100.0) / s.total_tercets_studied, 1)
        ELSE 0 
      END as success_rate
    FROM study_sessions s
    WHERE s.user_id = ?
    ORDER BY s.session_start DESC
    LIMIT ? OFFSET ?
  `);

  return query.all(userId, limit, offset) as Array<StudySession & { success_rate: number }>;
}

// Get detailed results for a specific session
export function getSessionResults(sessionId: number) {
  const query = db.prepare(`
    SELECT 
      sr.*,
      t.number as tercet_number,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      c.number as canto_number,
      cant.name as canticle_name
    FROM study_results sr
    JOIN tercets t ON sr.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE sr.session_id = ?
    ORDER BY sr.result_timestamp
  `);

  return query.all(sessionId);
}

### Implementing Spaced Repetition Algorithm

The spaced repetition system is the heart of effective memorization. We'll implement a simplified version of the SuperMemo algorithm:

```typescript
// src/database.ts (continued)

// Update spaced repetition schedule based on performance
export function updateSpacedRepetitionSchedule(
  userId: number,
  tercetId: number,
  wasCorrect: boolean,
  difficultyRating: number // 1 (hardest) to 5 (easiest)
) {
  // Get existing schedule or create new one
  let schedule = db.prepare(`
    SELECT * FROM review_schedule 
    WHERE user_id = ? AND tercet_id = ?
  `).get(userId, tercetId) as any;

  if (!schedule) {
    // Create initial schedule for new tercet
    const insert = db.prepare(`
      INSERT INTO review_schedule (
        user_id, tercet_id, next_review_date, interval_days,
        repetition_number, ease_factor, last_studied, total_reviews
      )
      VALUES (?, ?, datetime('now', '+1 day'), 1, 0, 2.5, CURRENT_TIMESTAMP, 1)
    `);
    
    insert.run(userId, tercetId);
    return;
  }

  // Calculate new parameters based on performance
  let newInterval = schedule.interval_days;
  let newEaseFactor = schedule.ease_factor;
  let newRepetitionNumber = schedule.repetition_number + 1;
  let consecutiveCorrect = wasCorrect ? schedule.consecutive_correct + 1 : 0;

  if (wasCorrect) {
    // Successful recall - increase interval
    if (newRepetitionNumber === 1) {
      newInterval = 1;
    } else if (newRepetitionNumber === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(schedule.interval_days * newEaseFactor);
    }

    // Adjust ease factor based on difficulty rating
    // difficultyRating: 5 = very easy, 4 = easy, 3 = normal, 2 = hard, 1 = very hard
    const performanceAdjustment = 0.1 - (5 - difficultyRating) * (0.08 + (5 - difficultyRating) * 0.02);
    newEaseFactor = Math.max(1.3, newEaseFactor + performanceAdjustment);

  } else {
    // Failed recall - reset interval but keep some progress
    newInterval = 1;
    newRepetitionNumber = 0;
    consecutiveCorrect = 0;
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  // Update the schedule
  const update = db.prepare(`
    UPDATE review_schedule 
    SET 
      next_review_date = ?,
      interval_days = ?,
      repetition_number = ?,
      ease_factor = ?,
      last_studied = CURRENT_TIMESTAMP,
      total_reviews = total_reviews + 1,
      consecutive_correct = ?
    WHERE user_id = ? AND tercet_id = ?
  `);

  update.run(
    nextReviewDate.toISOString(),
    newInterval,
    newRepetitionNumber,
    newEaseFactor,
    consecutiveCorrect,
    userId,
    tercetId
  );
}

// Get tercets due for review
export function getTercetsDueForReview(userId: number, limit: number = 20) {
  const query = db.prepare(`
    SELECT 
      rs.*,
      t.number as tercet_number,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      t.line1_english,
      t.line2_english,
      t.line3_english,
      c.number as canto_number,
      c.title as canto_title,
      cant.name as canticle_name
    FROM review_schedule rs
    JOIN tercets t ON rs.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE rs.user_id = ? 
      AND rs.next_review_date <= datetime('now')
    ORDER BY rs.next_review_date ASC, rs.interval_days ASC
    LIMIT ?
  `);

  return query.all(userId, limit);
}

// Get new tercets for learning (not yet studied)
export function getNewTercetsForLearning(userId: number, limit: number = 10) {
  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      c.title as canto_title,
      cant.name as canticle_name
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE t.id NOT IN (
      SELECT DISTINCT tercet_id 
      FROM review_schedule 
      WHERE user_id = ?
    )
    ORDER BY cant.id, c.number, t.number
    LIMIT ?
  `);

  return query.all(userId, limit);
}

// Get learning statistics for a user
export function getUserLearningStats(userId: number) {
  // Overall statistics
  const overallStats = db.prepare(`
    SELECT 
      COUNT(DISTINCT rs.tercet_id) as total_tercets_studied,
      COUNT(CASE WHEN rs.consecutive_correct >= 3 THEN 1 END) as mastered_tercets,
      COUNT(CASE WHEN rs.next_review_date <= datetime('now') THEN 1 END) as due_for_review,
      AVG(rs.ease_factor) as average_ease_factor,
      SUM(rs.total_reviews) as total_reviews_completed
    FROM review_schedule rs
    WHERE rs.user_id = ?
  `).get(userId);

  // Recent performance (last 30 days)
  const recentPerformance = db.prepare(`
    SELECT 
      COUNT(*) as total_sessions,
      AVG(CASE WHEN total_tercets_studied > 0 
          THEN (correct_answers * 100.0) / total_tercets_studied 
          ELSE 0 END) as average_success_rate,
      SUM(total_tercets_studied) as total_tercets_practiced
    FROM study_sessions
    WHERE user_id = ? 
      AND session_start >= datetime('now', '-30 days')
      AND session_end IS NOT NULL
  `).get(userId);

  // Study streak (consecutive days with study sessions)
  const studyStreak = db.prepare(`
    WITH daily_sessions AS (
      SELECT DISTINCT date(session_start) as study_date
      FROM study_sessions
      WHERE user_id = ? AND session_end IS NOT NULL
      ORDER BY study_date DESC
    ),
    streak_calculation AS (
      SELECT 
        study_date,
        ROW_NUMBER() OVER (ORDER BY study_date DESC) as row_num,
        julianday('now') - julianday(study_date) as days_ago
      FROM daily_sessions
    )
    SELECT COUNT(*) as current_streak
    FROM streak_calculation
    WHERE days_ago = row_num - 1 OR (row_num = 1 AND days_ago <= 1)
  `).get(userId);

  return {
    overall: overallStats,
    recent: recentPerformance,
    streak: studyStreak?.current_streak || 0
  };
}

### Advanced Queries and Analytics

Now let's implement some sophisticated queries that provide insights into learning patterns and content difficulty:

```typescript
// src/database.ts (continued)

// Get tercet difficulty analysis based on user performance
export function getTercetDifficultyAnalysis(limit: number = 50) {
  const query = db.prepare(`
    SELECT 
      t.id,
      t.number as tercet_number,
      t.line1_italian,
      c.number as canto_number,
      cant.name as canticle_name,
      COUNT(sr.id) as total_attempts,
      AVG(CASE WHEN sr.was_correct THEN 1.0 ELSE 0.0 END) as success_rate,
      AVG(sr.difficulty_rating) as avg_difficulty_rating,
      AVG(sr.response_time_seconds) as avg_response_time,
      AVG(rs.ease_factor) as avg_ease_factor
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    LEFT JOIN study_results sr ON t.id = sr.tercet_id
    LEFT JOIN review_schedule rs ON t.id = rs.tercet_id
    WHERE sr.id IS NOT NULL
    GROUP BY t.id
    HAVING total_attempts >= 5  -- Only include tercets with sufficient data
    ORDER BY success_rate ASC, avg_difficulty_rating DESC
    LIMIT ?
  `);

  return query.all(limit);
}

// Get learning progress over time for a user
export function getUserProgressOverTime(userId: number, days: number = 30) {
  const query = db.prepare(`
    SELECT 
      date(s.session_start) as study_date,
      COUNT(s.id) as sessions_count,
      SUM(s.total_tercets_studied) as tercets_studied,
      AVG(CASE WHEN s.total_tercets_studied > 0 
          THEN (s.correct_answers * 100.0) / s.total_tercets_studied 
          ELSE 0 END) as daily_success_rate,
      AVG(sr.response_time_seconds) as avg_response_time
    FROM study_sessions s
    LEFT JOIN study_results sr ON s.id = sr.session_id
    WHERE s.user_id = ? 
      AND s.session_start >= datetime('now', '-' || ? || ' days')
      AND s.session_end IS NOT NULL
    GROUP BY date(s.session_start)
    ORDER BY study_date ASC
  `);

  return query.all(userId, days);
}

// Get tercets that are challenging for a specific user
export function getUserChallengingTercets(userId: number, limit: number = 20) {
  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      cant.name as canticle_name,
      rs.ease_factor,
      rs.total_reviews,
      rs.consecutive_correct,
      AVG(sr.difficulty_rating) as avg_difficulty_rating,
      COUNT(sr.id) as attempt_count,
      AVG(CASE WHEN sr.was_correct THEN 1.0 ELSE 0.0 END) as success_rate
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    JOIN review_schedule rs ON t.id = rs.tercet_id
    LEFT JOIN study_results sr ON t.id = sr.tercet_id AND sr.user_id = ?
    WHERE rs.user_id = ?
      AND rs.total_reviews >= 3  -- Has been studied multiple times
      AND (rs.ease_factor < 2.0 OR rs.consecutive_correct < 2)
    GROUP BY t.id
    ORDER BY rs.ease_factor ASC, success_rate ASC
    LIMIT ?
  `);

  return query.all(userId, userId, limit);
}

// Get recommended study plan for a user
export function getRecommendedStudyPlan(userId: number) {
  // Get user's study goal and preferences
  const userGoal = db.prepare(`
    SELECT study_goal_tercets_per_day FROM users WHERE id = ?
  `).get(userId)?.study_goal_tercets_per_day || 5;

  // Get due reviews (high priority)
  const dueReviews = getTercetsDueForReview(userId, Math.ceil(userGoal * 0.7));

  // Get new tercets if we have room
  const remainingSlots = userGoal - dueReviews.length;
  const newTercets = remainingSlots > 0 
    ? getNewTercetsForLearning(userId, remainingSlots)
    : [];

  return {
    total_recommended: userGoal,
    due_reviews: dueReviews,
    new_tercets: newTercets,
    review_count: dueReviews.length,
    new_count: newTercets.length
  };
}

// Comprehensive search with user context
export function searchTercetsWithUserContext(
  searchTerm: string,
  userId?: number,
  language: 'italian' | 'english' | 'both' = 'both'
) {
  const term = `%${searchTerm.toLowerCase()}%`;
  
  let whereClause = '';
  let params: any[] = [];
  
  if (language === 'italian') {
    whereClause = `
      WHERE (LOWER(t.line1_italian) LIKE ? 
         OR LOWER(t.line2_italian) LIKE ? 
         OR LOWER(t.line3_italian) LIKE ?)
    `;
    params = [term, term, term];
  } else if (language === 'english') {
    whereClause = `
      WHERE (LOWER(t.line1_english) LIKE ? 
         OR LOWER(t.line2_english) LIKE ? 
         OR LOWER(t.line3_english) LIKE ?)
    `;
    params = [term, term, term];
  } else {
    whereClause = `
      WHERE (LOWER(t.line1_italian) LIKE ? 
         OR LOWER(t.line2_italian) LIKE ? 
         OR LOWER(t.line3_italian) LIKE ?
         OR LOWER(t.line1_english) LIKE ?
         OR LOWER(t.line2_english) LIKE ?
         OR LOWER(t.line3_english) LIKE ?)
    `;
    params = [term, term, term, term, term, term];
  }

  const userContextJoin = userId ? `
    LEFT JOIN review_schedule rs ON t.id = rs.tercet_id AND rs.user_id = ?
    LEFT JOIN user_bookmarks ub ON t.id = ub.tercet_id AND ub.user_id = ?
  ` : '';

  const userContextSelect = userId ? `, 
    rs.ease_factor,
    rs.total_reviews,
    rs.next_review_date,
    ub.bookmark_type,
    ub.annotation
  ` : '';

  if (userId) {
    params.push(userId, userId);
  }

  const query = db.prepare(`
    SELECT 
      t.*,
      c.number as canto_number,
      c.title as canto_title,
      cant.name as canticle_name
      ${userContextSelect}
    FROM tercets t
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    ${userContextJoin}
    ${whereClause}
    ORDER BY cant.id, c.number, t.number
  `);

  return query.all(...params);
}

### Content Management and Administrative Functions

Let's add functions for managing content and system administration:

```typescript
// src/database.ts (continued)

// Add multiple tercets efficiently using transactions
export function addMultipleTercets(cantoId: number, tercetsData: Array<{
  number: number;
  line1_italian: string;
  line2_italian: string;
  line3_italian: string;
  line1_english?: string;
  line2_english?: string;
  line3_english?: string;
}>) {
  const insertTercet = db.prepare(`
    INSERT INTO tercets (
      canto_id, number,
      line1_italian, line2_italian, line3_italian,
      line1_english, line2_english, line3_english
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Use a transaction for efficiency and consistency
  const transaction = db.transaction((data: typeof tercetsData) => {
    for (const tercet of data) {
      insertTercet.run(
        cantoId, tercet.number,
        tercet.line1_italian, tercet.line2_italian, tercet.line3_italian,
        tercet.line1_english, tercet.line2_english, tercet.line3_english
      );
    }
  });

  return transaction(tercetsData);
}

// Get system-wide statistics for administrators
export function getSystemStatistics() {
  const contentStats = db.prepare(`
    SELECT 
      COUNT(DISTINCT cant.id) as total_canticles,
      COUNT(DISTINCT c.id) as total_cantos,
      COUNT(t.id) as total_tercets,
      COUNT(CASE WHEN t.line1_english IS NOT NULL THEN 1 END) as translated_tercets
    FROM canticles cant
    LEFT JOIN cantos c ON cant.id = c.canticle_id
    LEFT JOIN tercets t ON c.id = t.canto_id
  `).get();

  const userStats = db.prepare(`
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN last_login >= datetime('now', '-7 days') THEN 1 END) as active_weekly,
      COUNT(CASE WHEN last_login >= datetime('now', '-30 days') THEN 1 END) as active_monthly
    FROM users
  `).get();

  const studyStats = db.prepare(`
    SELECT 
      COUNT(*) as total_sessions,
      COUNT(CASE WHEN session_start >= datetime('now', '-7 days') THEN 1 END) as sessions_this_week,
      SUM(total_tercets_studied) as total_tercets_studied,
      AVG(CASE WHEN total_tercets_studied > 0 
          THEN (correct_answers * 100.0) / total_tercets_studied 
          ELSE 0 END) as overall_success_rate
    FROM study_sessions
    WHERE session_end IS NOT NULL
  `).get();

  return {
    content: contentStats,
    users: userStats,
    study: studyStats
  };
}

// Clean up old data (for maintenance)
export function cleanupOldData(daysToKeep: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  // Delete old study sessions and results
  const deleteOldSessions = db.prepare(`
    DELETE FROM study_sessions 
    WHERE session_start < ? AND session_end IS NOT NULL
  `);

  const result = deleteOldSessions.run(cutoffDate.toISOString());
  return result.changes;
}

### Updating the Web Interface for User Management

Now let's update our web server to support user accounts and advanced features:

```typescript
// src/server.ts (updated for user management)
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { getCookie, setCookie } from 'hono/cookie';
import { 
  getAllCanticles, 
  getCantosByCanticle, 
  getTercetsByCanto,
  createUser,
  authenticateUser,
  getUserById,
  startStudySession,
  endStudySession,
  recordStudyResult,
  getRecommendedStudyPlan,
  getUserLearningStats,
  searchTercetsWithUserContext,
  getTercetsDueForReview,
  getUserChallengingTercets
} from './database';

const app = new Hono();

// Middleware to check authentication
const requireAuth = async (c: any, next: any) => {
  const userId = getCookie(c, 'user_id');
  if (!userId) {
    return c.redirect('/login');
  }
  
  const user = getUserById(parseInt(userId));
  if (!user) {
    return c.redirect('/login');
  }
  
  c.set('user', user);
  await next();
};

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Login page
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login - Dante Memorization</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="/static/styles.css">
      </head>
      <body>
        <div class="container">
          <div class="auth-form">
            <h1>Login to Dante Memorization</h1>
            
            <form hx-post="/auth/login" hx-target="#auth-message">
              <div class="form-group">
                <label for="username">Username or Email</label>
                <input type="text" name="username" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" required>
              </div>
              
              <button type="submit">Login</button>
            </form>
            
            <div id="auth-message"></div>
            
            <p>
              Don't have an account? 
              <a href="/register">Register here</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Registration page
app.get('/register', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Register - Dante Memorization</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="/static/styles.css">
      </head>
      <body>
        <div class="container">
          <div class="auth-form">
            <h1>Create Account</h1>
            
            <form hx-post="/auth/register" hx-target="#auth-message">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" name="username" required minlength="3">
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" required minlength="6">
              </div>
              
              <div class="form-group">
                <label for="display_name">Display Name (optional)</label>
                <input type="text" name="display_name">
              </div>
              
              <div class="form-group">
                <label for="study_goal">Daily Study Goal (tercets)</label>
                <select name="study_goal_tercets_per_day">
                  <option value="3">3 tercets (light)</option>
                  <option value="5" selected>5 tercets (recommended)</option>
                  <option value="10">10 tercets (intensive)</option>
                  <option value="20">20 tercets (advanced)</option>
                </select>
              </div>
              
              <button type="submit">Create Account</button>
            </form>
            
            <div id="auth-message"></div>
            
            <p>
              Already have an account? 
              <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Authentication endpoints
app.post('/auth/login', async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return c.html(`
        <div class="error-message">
          Invalid username or password. Please try again.
        </div>
      `);
    }

    setCookie(c, 'user_id', user.id.toString(), {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return c.html(`
      <div class="success-message">
        Login successful! Redirecting...
        <script>
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        </script>
      </div>
    `);

  } catch (error) {
    return c.html(`
      <div class="error-message">
        An error occurred during login. Please try again.
      </div>
    `);
  }
});

app.post('/auth/register', async (c) => {
  const formData = await c.req.formData();
  
  try {
    const userData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      display_name: formData.get('display_name') as string || undefined,
      study_goal_tercets_per_day: parseInt(formData.get('study_goal_tercets_per_day') as string) || 5
    };

    const user = await createUser(userData);

    setCookie(c, 'user_id', user.id.toString(), {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60
    });

    return c.html(`
      <div class="success-message">
        Account created successfully! Redirecting...
        <script>
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        </script>
      </div>
    `);

  } catch (error: any) {
    return c.html(`
      <div class="error-message">
        ${error.message || 'An error occurred during registration.'}
      </div>
    `);
  }
});

// Logout
app.post('/auth/logout', (c) => {
  setCookie(c, 'user_id', '', { maxAge: 0 });
  return c.redirect('/login');
});

// Protected home page with personalized dashboard
app.get('/', requireAuth, (c) => {
  const user = c.get('user');
  const stats = getUserLearningStats(user.id);
  const studyPlan = getRecommendedStudyPlan(user.id);

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dante Memorization - Dashboard</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <link rel="stylesheet" href="/static/styles.css">
      </head>
      <body>
        <div class="container">
          <header class="user-header">
            <h1>Welcome, ${user.display_name || user.username}</h1>
            <nav class="user-nav">
              <button hx-get="/study" hx-target="#main-content">Study</button>
              <button hx-get="/progress" hx-target="#main-content">Progress</button>
              <button hx-get="/search" hx-target="#main-content">Search</button>
              <button hx-post="/auth/logout">Logout</button>
            </nav>
          </header>

          <div class="dashboard">
            <div class="stats-overview">
              <div class="stat-card">
                <h3>Study Streak</h3>
                <span class="stat-number">${stats.streak}</span>
                <span class="stat-label">days</span>
              </div>
              
              <div class="stat-card">
                <h3>Tercets Studied</h3>
                <span class="stat-number">${stats.overall.total_tercets_studied || 0}</span>
                <span class="stat-label">total</span>
              </div>
              
              <div class="stat-card">
                <h3>Mastered</h3>
                <span class="stat-number">${stats.overall.mastered_tercets || 0}</span>
                <span class="stat-label">tercets</span>
              </div>
              
              <div class="stat-card">
                <h3>Due for Review</h3>
                <span class="stat-number">${stats.overall.due_for_review || 0}</span>
                <span class="stat-label">tercets</span>
              </div>
            </div>

            <div class="study-plan">
              <h3>Today's Recommended Study Plan</h3>
              <div class="plan-summary">
                <p><strong>${studyPlan.review_count}</strong> tercets due for review</p>
                <p><strong>${studyPlan.new_count}</strong> new tercets to learn</p>
                <p><strong>Goal:</strong> ${studyPlan.total_recommended} tercets today</p>
              </div>
              
              <div class="study-actions">
                <button 
                  hx-post="/study/start-session"
                  hx-target="#main-content"
                  class="primary-button"
                >
                  Start Study Session
                </button>
                
                <button 
                  hx-get="/study/review"
                  hx-target="#main-content"
                >
                  Review Mode
                </button>
              </div>
            </div>
          </div>

          <div id="main-content">
            <!-- Dynamic content loads here -->
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start a study session
app.post('/study/start-session', requireAuth, (c) => {
  const user = c.get('user');
  const session = startStudySession(user.id, 'practice');
  const studyPlan = getRecommendedStudyPlan(user.id);

  return c.html(`
    <div class="study-session" x-data="{ 
      sessionId: ${session.id},
      currentTercetIndex: 0,
      tercets: ${JSON.stringify([...studyPlan.due_reviews, ...studyPlan.new_tercets])},
      showAnswer: false,
      sessionActive: true
    }">
      <div class="session-header">
        <h2>Study Session</h2>
        <div class="session-progress">
          <span x-text="currentTercetIndex + 1"></span> of <span x-text="tercets.length"></span>
        </div>
      </div>

      <div x-show="sessionActive && currentTercetIndex < tercets.length">
        <div class="tercet-study-card">
          <div class="tercet-content">
            <div class="italian-text">
              <div class="line" x-text="tercets[currentTercetIndex]?.line1_italian"></div>
              <div class="line" x-text="tercets[currentTercetIndex]?.line2_italian"></div>
              <div class="line" x-text="tercets[currentTercetIndex]?.line3_italian"></div>
            </div>
            
            <div class="context-info">
              <p><strong x-text="tercets[currentTercetIndex]?.canticle_name"></strong>, 
                 Canto <span x-text="tercets[currentTercetIndex]?.canto_number"></span></p>
            </div>
          </div>

          <div class="study-controls">
            <button @click="showAnswer = !showAnswer">
              <span x-text="showAnswer ? 'Hide Translation' : 'Show Translation'"></span>
            </button>
          </div>

          <div x-show="showAnswer" x-transition class="english-translation">
            <div class="line" x-text="tercets[currentTercetIndex]?.line1_english"></div>
            <div class="line" x-text="tercets[currentTercetIndex]?.line2_english"></div>
            <div class="line" x-text="tercets[currentTercetIndex]?.line3_english"></div>
          </div>

          <div x-show="showAnswer" class="difficulty-rating">
            <h4>How difficult was this?</h4>
            <div class="rating-buttons">
              <button @click="recordResult(1, false)">Very Hard</button>
              <button @click="recordResult(2, false)">Hard</button>
              <button @click="recordResult(3, true)">Normal</button>
              <button @click="recordResult(4, true)">Easy</button>
              <button @click="recordResult(5, true)">Very Easy</button>
            </div>
          </div>
        </div>
      </div>

      <div x-show="!sessionActive || currentTercetIndex >= tercets.length">
        <div class="session-complete">
          <h3>Session Complete!</h3>
          <p>Great work! You studied <span x-text="tercets.length"></span> tercets.</p>
          <button hx-get="/" hx-target="body" hx-swap="outerHTML">Return to Dashboard</button>
        </div>
      </div>

      <script>
        document.body.addEventListener('alpine:init', () => {
          Alpine.data('studySession', () => ({
            recordResult(difficulty, wasCorrect) {
              const tercet = this.tercets[this.currentTercetIndex];
              
              fetch('/api/record-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId: this.sessionId,
                  tercetId: tercet.id,
                  wasCorrect: wasCorrect,
                  difficultyRating: difficulty
                })
              }).then(() => {
                this.showAnswer = false;
                this.currentTercetIndex++;
                
                if (this.currentTercetIndex >= this.tercets.length) {
                  // End session
                  fetch(\`/api/end-session/\${this.sessionId}\`, { method: 'POST' });
                  this.sessionActive = false;
                }
              });
            }
          }));
        });
      </script>
    </div>
  `);
});

// API endpoint to record study results
app.post('/api/record-result', requireAuth, async (c) => {
  const user = c.get('user');
  const { sessionId, tercetId, wasCorrect, difficultyRating } = await c.req.json();

  try {
    const result = recordStudyResult(
      sessionId,
      tercetId,
      user.id,
      wasCorrect,
      { difficulty_rating: difficultyRating }
    );

    return c.json({ success: true, result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// API endpoint to end study session
app.post('/api/end-session/:sessionId', requireAuth, (c) => {
  const sessionId = parseInt(c.req.param('sessionId'));

  try {
    const session = endStudySession(sessionId);
    return c.json({ success: true, session });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
```

### Reflection: The Power of Relational Thinking

In this chapter, we've accomplished something remarkable: we've transformed our simple text storage into a sophisticated learning platform that models the complex relationships inherent in both literary study and the learning process itself.

#### Technical Mastery Achieved

1. **Advanced Database Design**: Our schema now captures not just textual content, but the entire ecosystem of learning
2. **Complex Queries**: We can analyze patterns across users, content, and time using sophisticated SQL operations
3. **Performance Optimization**: Indexes and query optimization ensure our application remains fast as data grows
4. **Data Integrity**: Foreign key constraints and transactions maintain consistency across related data
5. **User Management**: Secure authentication and personalized experiences for each learner

#### Pedagogical Innovation

1. **Spaced Repetition**: We've implemented scientifically-backed algorithms that optimize memory retention
2. **Adaptive Learning**: Our system responds to each user's performance, adjusting difficulty and timing
3. **Progress Tracking**: Comprehensive analytics reveal learning patterns and guide study decisions
4. **Personalization**: Each user's journey through Dante is unique, shaped by their performance and preferences
5. **Community Insights**: Aggregate data reveals which passages are universally challenging or memorable

#### Literary Scholarship Enhanced

1. **Contextual Relationships**: Our database can model thematic connections, character appearances, and cross-references
2. **Scholarly Apparatus**: The foundation is laid for critical editions, variant readings, and academic commentary
3. **Research Possibilities**: Our data structure enables digital humanities research into memory, learning, and textual reception
4. **Accessibility**: Complex literary works become more approachable through guided, personalized study paths

### Looking Forward: The Complete Application

We've now built the data foundation for a truly sophisticated educational application. Our database captures not just the text of the *Divine Comedy*, but the rich ecosystem of relationships that make learning possible:

- **Content relationships** between canticles, cantos, and tercets
- **User relationships** with specific passages and learning progress
- **Temporal relationships** that track how memory and understanding develop over time
- **Performance relationships** that reveal which content is challenging and why

In our next section, we'll build upon this foundation to create the complete learning application, implementing advanced features like:

1. **Real-time progress tracking** with beautiful visualizations
2. **Collaborative features** allowing users to share insights and annotations
3. **Advanced analytics** that provide insights into learning effectiveness
4. **Content management tools** for adding new texts and scholarly apparatus
5. **Export capabilities** for research and academic use

Like Dante emerging from Purgatory into the Earthly Paradise, we've moved from the fundamental discipline of data organization into the realm where technology truly serves learning and understanding. Our database has become not just storage, but a living memory that preserves and enhances the encounter between reader and text.

The relationships we've modeled in code mirror the relationships that make literature meaningful: the connection between reader and text, the accumulation of understanding over time, and the way great works reveal new depths through repeated encounter. In building these database relationships, we've created digital infrastructure that serves the fundamentally human work of learning and remembering.

*"Ma perché le parole tue si chiare / faccian la vostra vista manifesta" — But so that your clear words / may make your vision manifest.* Our database has become the clear structure that makes the vision of personalized, effective literary education manifest in working code.