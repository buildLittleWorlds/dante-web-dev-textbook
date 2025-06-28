

# Chapter 10: Building the Spaced Repetition System

*"Trasumanar significar per verba / non si poria" — To transcend humanity cannot be signified in words*

---

## Opening Vignette: The Science of Forgetting

In 1885, Hermann Ebbinghaus spent months memorizing lists of nonsense syllables, then testing his own memory at carefully measured intervals. His painstaking self-experimentation revealed the mathematical nature of forgetting—how memory decays predictably over time, and how strategic review can combat this decay.

What Ebbinghaus discovered about memory, Dante understood intuitively about poetry. The *Divine Comedy* is structured to be memorable: the interlocking rhyme scheme creates a chain of associations, the dramatic imagery provides vivid anchors for recall, and the journey structure gives readers a spatial framework for organizing 14,233 lines of verse.

Today, we'll implement the most sophisticated version of Ebbinghaus's insights: the FSRS (Free Spaced Repetition Scheduler) algorithm. This isn't just about efficient memorization—it's about creating a learning system that adapts to the unique patterns of how each individual reader encounters and internalizes Dante's poetry.

When we finish this chapter, your application will embody a digital version of the medieval "art of memory," using modern cognitive science to help users create their own memory palaces filled with the treasures of one of literature's greatest works.

## Learning Objectives

By completing this chapter, you will:

- **Implement the FSRS algorithm** in TypeScript with full mathematical precision
- **Master advanced state management** for complex, multi-step learning workflows
- **Create adaptive learning systems** that optimize scheduling based on individual performance patterns
- **Build comprehensive analytics** that provide insights into learning effectiveness
- **Implement motivation systems** including streak tracking, achievements, and progress visualization
- **Design sophisticated user experiences** that make complex algorithms feel simple and intuitive

## Understanding FSRS: The Free Spaced Repetition Scheduler

### Why FSRS Over Traditional Algorithms

Traditional spaced repetition systems like SuperMemo-2 (which we implemented in Chapter 9) use simple mathematical formulas that treat all learners and all content similarly. FSRS takes a more sophisticated approach:

1. **Individual Modeling**: It builds a mathematical model of how each user's memory works
2. **Content Sensitivity**: Different types of content (visual, verbal, conceptual) are handled differently
3. **Forgetting Curve Optimization**: It directly models the probability of recall over time
4. **Data-Driven Adaptation**: The algorithm improves its predictions based on actual user performance

For poetry memorization, this sophistication matters enormously. Some tercets of Dante are inherently more memorable—vivid imagery, familiar concepts, strong emotional content. Others require more repetition—abstract theology, unfamiliar historical references, complex syntax. FSRS can learn these patterns and optimize scheduling accordingly.

### The Mathematical Foundation

FSRS models memory using four key parameters:

1. **Stability (S)**: How long the memory will last before dropping below the recall threshold
2. **Difficulty (D)**: How hard the item is to remember (intrinsic difficulty)
3. **Retrievability (R)**: Current probability of successful recall
4. **Workload (W)**: Recent learning burden that affects future performance

The algorithm uses these parameters to predict the optimal time for the next review, balancing efficiency (not reviewing too early) with effectiveness (not waiting until the memory has decayed too much).

### Implementation Strategy

We'll implement FSRS in several stages:

1. **Core Algorithm**: The mathematical functions that update memory parameters
2. **Database Schema**: Extended tables to store FSRS-specific data
3. **Learning Session Logic**: Integration with our existing study system
4. **Analytics Dashboard**: Visualization of learning patterns and effectiveness
5. **User Interface**: Controls for customization and optimization

## Implementing the FSRS Algorithm

### Extended Database Schema

First, let's extend our database to support FSRS parameters. Add these tables to your `src/database.ts`:

```typescript
// src/database.ts (additions)

// FSRS parameters for each user-tercet combination
CREATE TABLE IF NOT EXISTS fsrs_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tercet_id INTEGER NOT NULL,
  stability REAL DEFAULT 1.0,
  difficulty REAL DEFAULT 5.0,
  elapsed_days INTEGER DEFAULT 0,
  scheduled_days INTEGER DEFAULT 1,
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  state TEXT DEFAULT 'new' CHECK(state IN ('new', 'learning', 'review', 'relearning')),
  last_review DATETIME,
  next_review DATETIME DEFAULT datetime('now', '+1 day'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (tercet_id) REFERENCES tercets (id),
  UNIQUE(user_id, tercet_id)
);

// FSRS algorithm parameters for each user (customizable)
CREATE TABLE IF NOT EXISTS fsrs_parameters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  request_retention REAL DEFAULT 0.9, -- Target retention rate
  maximum_interval INTEGER DEFAULT 36500, -- Max days between reviews
  w REAL DEFAULT '[1.14, 1.01, 5.44, 14.67, 5.3024, 1.5662, 1.2503, 0.0028, 1.6181, 0.1541, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034, 0.6567]', -- FSRS weights
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(user_id)
);

// FSRS review log for each learning event
CREATE TABLE IF NOT EXISTS fsrs_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 4), -- 1=Again, 2=Hard, 3=Good, 4=Easy
  state TEXT NOT NULL CHECK(state IN ('new', 'learning', 'review', 'relearning')),
  due DATETIME NOT NULL,
  stability REAL NOT NULL,
  difficulty REAL NOT NULL,
  elapsed_days INTEGER NOT NULL,
  last_elapsed_days INTEGER,
  scheduled_days INTEGER NOT NULL,
  review_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES fsrs_cards (id)
);
```

### TypeScript Interfaces for FSRS

Add these interfaces to your `src/types.ts`:

```typescript
// src/types.ts (additions)

export interface FSRSCard {
  id: number;
  user_id: number;
  tercet_id: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  last_review?: string;
  next_review: string;
  created_at: string;
  updated_at: string;
}

export interface FSRSParameters {
  id: number;
  user_id: number;
  request_retention: number;
  maximum_interval: number;
  w: number[]; // Algorithm weights
  created_at: string;
  updated_at: string;
}

export interface FSRSReview {
  id: number;
  card_id: number;
  rating: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_elapsed_days?: number;
  scheduled_days: number;
  review_time: string;
}

export interface SchedulingInfo {
  card: FSRSCard;
  review_log: FSRSReview;
}

export interface SchedulingCards {
  again: SchedulingInfo;
  hard: SchedulingInfo;
  good: SchedulingInfo;
  easy: SchedulingInfo;
}
```

### Core FSRS Algorithm Implementation

Now implement the core FSRS algorithm. This is mathematically intensive but follows established formulas:

```typescript
// src/fsrs.ts (new file)

import type { FSRSCard, FSRSParameters, FSRSReview, SchedulingInfo, SchedulingCards } from './types';

export class FSRS {
  private parameters: FSRSParameters;

  constructor(parameters: FSRSParameters) {
    this.parameters = parameters;
  }

  // Core FSRS scheduling function
  schedule(card: FSRSCard, now: Date = new Date()): SchedulingCards {
    const { w } = this.parameters;
    
    if (card.state === 'new') {
      return this.scheduleNew(card, now, w);
    } else {
      return this.scheduleReview(card, now, w);
    }
  }

  private scheduleNew(card: FSRSCard, now: Date, w: number[]): SchedulingCards {
    const difficulty = this.initDifficulty(w);
    const stability = this.initStability(w);

    return {
      again: this.createSchedulingInfo(card, now, 1, 'learning', difficulty, stability, 1),
      hard: this.createSchedulingInfo(card, now, 2, 'learning', difficulty, stability, 6),
      good: this.createSchedulingInfo(card, now, 3, 'learning', difficulty, stability, 10),
      easy: this.createSchedulingInfo(card, now, 4, 'review', difficulty, stability, this.nextInterval(stability))
    };
  }

  private scheduleReview(card: FSRSCard, now: Date, w: number[]): SchedulingCards {
    const elapsedDays = this.calculateElapsedDays(card.last_review || card.created_at, now);
    const retrievability = this.forgettingCurve(elapsedDays, card.stability);

    return {
      again: this.scheduleAfterRating(card, now, 1, elapsedDays, retrievability, w),
      hard: this.scheduleAfterRating(card, now, 2, elapsedDays, retrievability, w),
      good: this.scheduleAfterRating(card, now, 3, elapsedDays, retrievability, w),
      easy: this.scheduleAfterRating(card, now, 4, elapsedDays, retrievability, w)
    };
  }

  private scheduleAfterRating(
    card: FSRSCard, 
    now: Date, 
    rating: number, 
    elapsedDays: number, 
    retrievability: number, 
    w: number[]
  ): SchedulingInfo {
    let newDifficulty = card.difficulty;
    let newStability = card.stability;
    let newState = card.state;
    let newLapses = card.lapses;

    if (rating === 1) { // Again
      newLapses += 1;
      newDifficulty = this.nextDifficulty(card.difficulty, 1, w);
      newStability = this.nextForgetStability(card.difficulty, card.stability, retrievability, w);
      newState = 'relearning';
    } else {
      newDifficulty = this.nextDifficulty(card.difficulty, rating, w);
      newStability = this.nextRecallStability(card.difficulty, card.stability, retrievability, rating, w);
      newState = 'review';
    }

    const interval = this.nextInterval(newStability);
    
    return this.createSchedulingInfo(card, now, rating, newState, newDifficulty, newStability, interval, newLapses);
  }

  private createSchedulingInfo(
    card: FSRSCard,
    now: Date,
    rating: number,
    state: 'new' | 'learning' | 'review' | 'relearning',
    difficulty: number,
    stability: number,
    scheduledDays: number,
    lapses: number = card.lapses
  ): SchedulingInfo {
    const elapsedDays = this.calculateElapsedDays(card.last_review || card.created_at, now);
    const nextReview = new Date(now.getTime() + scheduledDays * 24 * 60 * 60 * 1000);

    const newCard: FSRSCard = {
      ...card,
      stability,
      difficulty,
      elapsed_days: elapsedDays,
      scheduled_days: scheduledDays,
      reps: card.reps + 1,
      lapses,
      state,
      last_review: now.toISOString(),
      next_review: nextReview.toISOString(),
      updated_at: now.toISOString()
    };

    const reviewLog: FSRSReview = {
      id: 0, // Will be set by database
      card_id: card.id,
      rating,
      state,
      due: nextReview.toISOString(),
      stability,
      difficulty,
      elapsed_days: elapsedDays,
      last_elapsed_days: card.elapsed_days > 0 ? card.elapsed_days : undefined,
      scheduled_days: scheduledDays,
      review_time: now.toISOString()
    };

    return { card: newCard, review_log: reviewLog };
  }

  // FSRS mathematical functions
  private initStability(w: number[]): number {
    return Math.max(w[0], 0.1);
  }

  private initDifficulty(w: number[]): number {
    return Math.min(Math.max(w[2], 1), 10);
  }

  private forgettingCurve(elapsedDays: number, stability: number): number {
    return Math.pow(1 + elapsedDays / (9 * stability), -1);
  }

  private nextInterval(stability: number): number {
    const interval = stability * (Math.log(this.parameters.request_retention) / Math.log(0.9));
    return Math.min(Math.max(Math.round(interval), 1), this.parameters.maximum_interval);
  }

  private nextDifficulty(difficulty: number, rating: number, w: number[]): number {
    const deltaD = w[4] - (rating - 3) * w[5];
    const meanReversion = w[6] * (this.initDifficulty(w) - difficulty);
    const newDifficulty = difficulty + deltaD + meanReversion;
    return Math.min(Math.max(newDifficulty, 1), 10);
  }

  private nextRecallStability(
    difficulty: number, 
    stability: number, 
    retrievability: number, 
    rating: number, 
    w: number[]
  ): number {
    const hardPenalty = rating === 2 ? w[13] : 1;
    const easyBonus = rating === 4 ? w[14] : 1;
    
    const newStability = stability * (
      1 + 
      Math.exp(w[6]) * 
      (11 - difficulty) * 
      Math.pow(stability, w[7]) * 
      (Math.exp(w[8] * (1 - retrievability)) - 1) * 
      hardPenalty * 
      easyBonus
    );

    return Math.max(newStability, 0.1);
  }

  private nextForgetStability(
    difficulty: number, 
    stability: number, 
    retrievability: number, 
    w: number[]
  ): number {
    const newStability = w[9] * Math.pow(difficulty, w[10]) * Math.pow(stability, w[11]) * Math.exp(w[12] * (1 - retrievability));
    return Math.max(newStability, 0.1);
  }

  private calculateElapsedDays(lastReview: string, now: Date): number {
    const lastReviewDate = new Date(lastReview);
    const diffTime = now.getTime() - lastReviewDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }
}

// Utility functions for FSRS integration
export function getDefaultFSRSParameters(): Omit<FSRSParameters, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  return {
    request_retention: 0.9,
    maximum_interval: 36500,
    w: [1.14, 1.01, 5.44, 14.67, 5.3024, 1.5662, 1.2503, 0.0028, 1.6181, 0.1541, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034, 0.6567]
  };
}

export function createNewFSRSCard(userId: number, tercetId: number): Omit<FSRSCard, 'id' | 'created_at' | 'updated_at'> {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    user_id: userId,
    tercet_id: tercetId,
    stability: 1.0,
    difficulty: 5.0,
    elapsed_days: 0,
    scheduled_days: 1,
    reps: 0,
    lapses: 0,
    state: 'new',
    last_review: undefined,
    next_review: tomorrow.toISOString()
  };
}
```

### Database Integration for FSRS

Now integrate FSRS with your database operations. Add these functions to your `src/database.ts`:

```typescript
// src/database.ts (additions)

import { FSRS, getDefaultFSRSParameters, createNewFSRSCard } from './fsrs';
import type { FSRSCard, FSRSParameters, SchedulingCards } from './types';

// Initialize FSRS parameters for a new user
export function initializeFSRSParameters(userId: number): FSRSParameters {
  const defaults = getDefaultFSRSParameters();
  
  const insert = db.prepare(`
    INSERT INTO fsrs_parameters (user_id, request_retention, maximum_interval, w)
    VALUES (?, ?, ?, ?)
  `);

  const result = insert.run(
    userId,
    defaults.request_retention,
    defaults.maximum_interval,
    JSON.stringify(defaults.w)
  );

  return getFSRSParameters(userId)!;
}

// Get FSRS parameters for a user
export function getFSRSParameters(userId: number): FSRSParameters | null {
  const query = db.prepare(`
    SELECT * FROM fsrs_parameters WHERE user_id = ?
  `);

  const params = query.get(userId) as any;
  if (!params) return null;

  return {
    ...params,
    w: JSON.parse(params.w)
  };
}

// Get or create FSRS card for a tercet
export function getOrCreateFSRSCard(userId: number, tercetId: number): FSRSCard {
  let card = db.prepare(`
    SELECT * FROM fsrs_cards WHERE user_id = ? AND tercet_id = ?
  `).get(userId, tercetId) as FSRSCard | undefined;

  if (!card) {
    const newCard = createNewFSRSCard(userId, tercetId);
    
    const insert = db.prepare(`
      INSERT INTO fsrs_cards (
        user_id, tercet_id, stability, difficulty, elapsed_days, 
        scheduled_days, reps, lapses, state, last_review, next_review
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      newCard.user_id,
      newCard.tercet_id,
      newCard.stability,
      newCard.difficulty,
      newCard.elapsed_days,
      newCard.scheduled_days,
      newCard.reps,
      newCard.lapses,
      newCard.state,
      newCard.last_review,
      newCard.next_review
    );

    card = db.prepare(`
      SELECT * FROM fsrs_cards WHERE id = ?
    `).get(result.lastInsertRowid) as FSRSCard;
  }

  return card;
}

// Get cards due for review using FSRS
export function getFSRSCardsDue(userId: number, limit: number = 20): Array<FSRSCard & { tercet: any }> {
  const query = db.prepare(`
    SELECT 
      fc.*,
      t.number as tercet_number,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      t.line1_english,
      t.line2_english,
      t.line3_english,
      c.number as canto_number,
      cant.name as canticle_name
    FROM fsrs_cards fc
    JOIN tercets t ON fc.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE fc.user_id = ? 
      AND datetime(fc.next_review) <= datetime('now')
      AND fc.state IN ('learning', 'review', 'relearning')
    ORDER BY fc.next_review ASC
    LIMIT ?
  `);

  return query.all(userId, limit) as Array<FSRSCard & { tercet: any }>;
}

// Get new cards for learning using FSRS
export function getFSRSNewCards(userId: number, limit: number = 10): Array<FSRSCard & { tercet: any }> {
  const query = db.prepare(`
    SELECT 
      fc.*,
      t.number as tercet_number,
      t.line1_italian,
      t.line2_italian,
      t.line3_italian,
      t.line1_english,
      t.line2_english,
      t.line3_english,
      c.number as canto_number,
      cant.name as canticle_name
    FROM fsrs_cards fc
    JOIN tercets t ON fc.tercet_id = t.id
    JOIN cantos c ON t.canto_id = c.id
    JOIN canticles cant ON c.canticle_id = cant.id
    WHERE fc.user_id = ? 
      AND fc.state = 'new'
    ORDER BY t.id ASC
    LIMIT ?
  `);

  return query.all(userId, limit) as Array<FSRSCard & { tercet: any }>;
}

// Process FSRS review and update card
export function processFSRSReview(
  userId: number, 
  tercetId: number, 
  rating: number, 
  sessionId: number
): { card: FSRSCard; success: boolean } {
  const parameters = getFSRSParameters(userId);
  if (!parameters) {
    throw new Error('FSRS parameters not found for user');
  }

  const card = getOrCreateFSRSCard(userId, tercetId);
  const fsrs = new FSRS(parameters);
  const schedulingCards = fsrs.schedule(card);

  // Select the appropriate scheduling based on rating
  let selectedScheduling;
  switch (rating) {
    case 1: selectedScheduling = schedulingCards.again; break;
    case 2: selectedScheduling = schedulingCards.hard; break;
    case 3: selectedScheduling = schedulingCards.good; break;
    case 4: selectedScheduling = schedulingCards.easy; break;
    default: throw new Error('Invalid rating');
  }

  // Update the card in database
  const updateCard = db.prepare(`
    UPDATE fsrs_cards 
    SET 
      stability = ?,
      difficulty = ?,
      elapsed_days = ?,
      scheduled_days = ?,
      reps = ?,
      lapses = ?,
      state = ?,
      last_review = ?,
      next_review = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND tercet_id = ?
  `);

  updateCard.run(
    selectedScheduling.card.stability,
    selectedScheduling.card.difficulty,
    selectedScheduling.card.elapsed_days,
    selectedScheduling.card.scheduled_days,
    selectedScheduling.card.reps,
    selectedScheduling.card.lapses,
    selectedScheduling.card.state,
    selectedScheduling.card.last_review,
    selectedScheduling.card.next_review,
    userId,
    tercetId
  );

  // Log the review
  const insertReview = db.prepare(`
    INSERT INTO fsrs_reviews (
      card_id, rating, state, due, stability, difficulty,
      elapsed_days, last_elapsed_days, scheduled_days, review_time
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReview.run(
    card.id,
    rating,
    selectedScheduling.review_log.state,
    selectedScheduling.review_log.due,
    selectedScheduling.review_log.stability,
    selectedScheduling.review_log.difficulty,
    selectedScheduling.review_log.elapsed_days,
    selectedScheduling.review_log.last_elapsed_days,
    selectedScheduling.review_log.scheduled_days,
    selectedScheduling.review_log.review_time
  );

  // Also record in study_results for compatibility
  recordStudyResult(sessionId, tercetId, userId, rating >= 3, {
    difficulty_rating: rating,
    study_method: 'recognition'
  });

  return { 
    card: selectedScheduling.card, 
    success: rating >= 3 
  };
}

// Get learning statistics with FSRS data
export function getFSRSLearningStats(userId: number) {
  const stats = db.prepare(`
    SELECT 
      COUNT(CASE WHEN state = 'new' THEN 1 END) as new_cards,
      COUNT(CASE WHEN state = 'learning' THEN 1 END) as learning_cards,
      COUNT(CASE WHEN state = 'review' THEN 1 END) as review_cards,
      COUNT(CASE WHEN state = 'relearning' THEN 1 END) as relearning_cards,
      COUNT(CASE WHEN datetime(next_review) <= datetime('now') THEN 1 END) as due_cards,
      AVG(CASE WHEN state = 'review' THEN stability END) as avg_stability,
      AVG(difficulty) as avg_difficulty,
      SUM(reps) as total_reps,
      SUM(lapses) as total_lapses
    FROM fsrs_cards 
    WHERE user_id = ?
  `).get(userId) as any;

  return {
    new_cards: stats.new_cards || 0,
    learning_cards: stats.learning_cards || 0,
    review_cards: stats.review_cards || 0,
    relearning_cards: stats.relearning_cards || 0,
    due_cards: stats.due_cards || 0,
    avg_stability: stats.avg_stability || 0,
    avg_difficulty: stats.avg_difficulty || 5,
    total_reps: stats.total_reps || 0,
    total_lapses: stats.total_lapses || 0,
    mastery_rate: stats.review_cards / Math.max(1, (stats.review_cards + stats.learning_cards + stats.relearning_cards)) * 100
  };
}
```

## Building Advanced Study Sessions

### Enhanced Study Session Component

Now let's create a sophisticated study session that uses FSRS scheduling and provides rich feedback. Update your components in `src/components.tsx`:

```typescript
// src/components.tsx (updates and additions)

function AdvancedStudyDashboard({ user }: { user: User }) {
  const fsrsStats = getFSRSLearningStats(user.id);
  const dueCards = getFSRSCardsDue(user.id, 5);
  const newCards = getFSRSNewCards(user.id, 5);

  return (
    <Layout title="Advanced Study Dashboard" user={user}>
      <div className="advanced-study-dashboard">
        <header className="dashboard-header">
          <h1>Your FSRS Learning Journey</h1>
          <p>Intelligent spaced repetition powered by cognitive science</p>
        </header>

        <div className="fsrs-stats-grid">
          <div className="stat-card primary">
            <h3>Due for Review</h3>
            <div className="stat-number">{fsrsStats.due_cards}</div>
            <div className="stat-label">cards ready</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={`width: ${Math.min(100, (fsrsStats.due_cards / 20) * 100)}%`}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3>Mastery Rate</h3>
            <div className="stat-number">{Math.round(fsrsStats.mastery_rate)}%</div>
            <div className="stat-label">tercets mastered</div>
            <div className="mastery-breakdown">
              <div className="mastery-item">
                <span className="mastery-dot new"></span>
                <span>New: {fsrsStats.new_cards}</span>
              </div>
              <div className="mastery-item">
                <span className="mastery-dot learning"></span>
                <span>Learning: {fsrsStats.learning_cards}</span>
              </div>
              <div className="mastery-item">
                <span className="mastery-dot review"></span>
                <span>Review: {fsrsStats.review_cards}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3>Average Stability</h3>
            <div className="stat-number">{Math.round(fsrsStats.avg_stability)}</div>
            <div className="stat-label">days retention</div>
            <div className="stability-indicator">
              <div className="stability-bar">
                <div 
                  className="stability-fill"
                  style={`width: ${Math.min(100, (fsrsStats.avg_stability / 365) * 100)}%`}
                ></div>
              </div>
              <span className="stability-text">
                {fsrsStats.avg_stability < 7 ? 'Building...' : 
                 fsrsStats.avg_stability < 30 ? 'Developing' : 
                 fsrsStats.avg_stability < 90 ? 'Strong' : 'Excellent'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Learning Efficiency</h3>
            <div className="stat-number">
              {fsrsStats.total_reps > 0 ? Math.round((fsrsStats.total_reps - fsrsStats.total_lapses) / fsrsStats.total_reps * 100) : 0}%
            </div>
            <div className="stat-label">success rate</div>
            <div className="efficiency-details">
              <div>Reviews: {fsrsStats.total_reps}</div>
              <div>Lapses: {fsrsStats.total_lapses}</div>
            </div>
          </div>
        </div>

        <div className="study-modes">
          <div className="study-mode-card priority" x-show="$store.studyMode.dueCards > 0">
            <div className="mode-header">
              <h3>Priority Review</h3>
              <span className="urgency-badge">Due Now</span>
            </div>
            <p>Focus on tercets that need immediate attention</p>
            <div className="mode-preview">
              {dueCards.slice(0, 3).map(card => (
                <div key={card.id} className="preview-tercet">
                  <div className="tercet-info">
                    {card.canticle_name} {card.canto_number}:{card.tercet_number}
                  </div>
                  <div className="due-indicator overdue">
                    {Math.floor((new Date().getTime() - new Date(card.next_review).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="study-button priority"
              hx-post="/study/fsrs/start"
              hx-vals='{"mode": "review"}'
              hx-target="#study-area"
            >
              Start Priority Review ({fsrsStats.due_cards})
            </button>
          </div>

          <div className="study-mode-card">
            <div className="mode-header">
              <h3>Learn New</h3>
              <span className="info-badge">Discovery</span>
            </div>
            <p>Explore new passages from the Divine Comedy</p>
            <div className="mode-preview">
              {newCards.slice(0, 3).map(card => (
                <div key={card.id} className="preview-tercet">
                  <div className="tercet-info">
                    {card.canticle_name} {card.canto_number}:{card.tercet_number}
                  </div>
                  <div className="tercet-first-line">
                    {card.line1_italian}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="study-button"
              hx-post="/study/fsrs/start"
              hx-vals='{"mode": "new"}'
              hx-target="#study-area"
            >
              Learn New Tercets ({fsrsStats.new_cards})
            </button>
          </div>

          <div className="study-mode-card">
            <div className="mode-header">
              <h3>Balanced Session</h3>
              <span className="balance-badge">Optimal</span>
            </div>
            <p>AI-optimized mix of review and new learning</p>
            <div className="session-composition">
              <div className="composition-bar">
                <div 
                  className="composition-segment review"
                  style={`width: ${(fsrsStats.due_cards / (fsrsStats.due_cards + fsrsStats.new_cards)) * 100}%`}
                ></div>
                <div 
                  className="composition-segment new"
                  style={`width: ${(fsrsStats.new_cards / (fsrsStats.due_cards + fsrsStats.new_cards)) * 100}%`}
                ></div>
              </div>
              <div className="composition-legend">
                <span><span className="legend-dot review"></span>Review ({fsrsStats.due_cards})</span>
                <span><span className="legend-dot new"></span>New ({Math.min(fsrsStats.new_cards, 10)})</span>
              </div>
            </div>
            <button 
              className="study-button balanced"
              hx-post="/study/fsrs/start"
              hx-vals='{"mode": "balanced"}'
              hx-target="#study-area"
            >
              Start Balanced Session
            </button>
          </div>
        </div>

        <div id="study-area"></div>

        <div className="dashboard-footer">
          <div className="quick-actions">
            <a href="/analytics" className="quick-action">
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </a>
            <a href="/settings/fsrs" className="quick-action">
              <span className="action-icon">⚙️</span>
              <span>FSRS Settings</span>
            </a>
            <a href="/progress" className="quick-action">
              <span className="action-icon">📈</span>
              <span>Progress Report</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FSRSStudySession({ session, mode, user }: { 
  session: StudySession; 
  mode: 'review' | 'new' | 'balanced'; 
  user: User 
}) {
  // Get cards based on mode
  const reviewCards = mode !== 'new' ? getFSRSCardsDue(user.id, mode === 'balanced' ? 15 : 25) : [];
  const newCards = mode !== 'review' ? getFSRSNewCards(user.id, mode === 'balanced' ? 5 : 15) : [];
  const allCards = [...reviewCards, ...newCards].slice(0, 25);
  
  const currentCard = allCards[0];

  return (
    <div className="fsrs-study-session" x-data={`{
      currentIndex: 0,
      totalCards: ${allCards.length},
      sessionStartTime: Date.now(),
      currentCardStartTime: Date.now(),
      showAnswer: false,
      showRatingButtons: false,
      sessionStats: {
        again: 0,
        hard: 0,
        good: 0,
        easy: 0,
        total: 0
      },
      studyMethod: 'recognition'
    }`}>
      
      <div className="session-header">
        <div className="session-progress">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                :style="'width: ' + ((currentIndex / totalCards) * 100) + '%'"
              ></div>
            </div>
            <div className="progress-text">
              <span x-text="currentIndex"></span> / <span x-text="totalCards"></span>
              <span class="session-type">{mode} mode</span>
            </div>
          </div>
        </div>

        <div className="session-stats">
          <div className="stat-item">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value" x-text="Math.round(((sessionStats.good + sessionStats.easy) / Math.max(1, sessionStats.total)) * 100) + '%'"></span>
          </div>
          <div className="stat-item">
            <span class="stat-label">Time</span>
            <span class="stat-value" x-text="Math.floor((Date.now() - sessionStartTime) / 60000) + 'm'"></span>
          </div>
        </div>
      </div>

      {currentCard && (
        <div className="card-study-interface">
          <div className="card-context">
            <div className="location-breadcrumb">
              <span className="canticle">{currentCard.canticle_name}</span>
              <span className="separator">→</span>
              <span className="canto">Canto {currentCard.canto_number}</span>
              <span className="separator">→</span>
              <span className="tercet">Tercet {currentCard.tercet_number}</span>
            </div>
            
            <div className="card-metadata">
              <span className="card-state state-{currentCard.state}">{currentCard.state}</span>
              <span className="card-difficulty">
                Difficulty: {Math.round(currentCard.difficulty * 10) / 10}
              </span>
              <span className="card-stability">
                Stability: {Math.round(currentCard.stability)} days
              </span>
            </div>
          </div>

          <div className="study-content">
            <div className="study-modes">
              <div className="mode-selector">
                <button 
                  className="mode-button"
                  :class="{ active: studyMethod === 'recognition' }"
                  @click="studyMethod = 'recognition'"
                >
                  Recognition
                </button>
                <button 
                  className="mode-button"
                  :class="{ active: studyMethod === 'recall' }"
                  @click="studyMethod = 'recall'"
                >
                  Recall
                </button>
                <button 
                  className="mode-button"
                  :class="{ active: studyMethod === 'typing' }"
                  @click="studyMethod = 'typing'"
                >
                  Type It
                </button>
              </div>
            </div>

            {/* Recognition Mode */}
            <div className="study-question" x-show="studyMethod === 'recognition'">
              <h3>Do you remember this tercet?</h3>
              <div className="tercet-display">
                <div className="line italian highlighted">{currentCard.line1_italian}</div>
                <div className="line italian highlighted">{currentCard.line2_italian}</div>
                <div className="line italian highlighted">{currentCard.line3_italian}</div>
              </div>
              <div className="recognition-actions" x-show="!showAnswer">
                <button 
                  className="action-button secondary"
                  @click="showAnswer = true; showRatingButtons = true; currentCardStartTime = Date.now()"
                >
                  Show Translation & Rate
                </button>
              </div>
            </div>

            {/* Recall Mode */}
            <div className="study-question" x-show="studyMethod === 'recall'">
              <h3>Complete this tercet:</h3>
              <div className="tercet-input">
                <div className="line italian">{currentCard.line1_italian}</div>
                <div className="line-input-container" x-show="!showAnswer">
                  <input 
                    type="text" 
                    placeholder="Continue with the second line..." 
                    className="line-input"
                    @keydown.enter="showAnswer = true; showRatingButtons = true"
                  />
                </div>
                <div className="line italian" x-show="showAnswer">{currentCard.line2_italian}</div>
                <div className="line-input-container" x-show="!showAnswer">
                  <input 
                    type="text" 
                    placeholder="And the third line..." 
                    className="line-input"
                  />
                </div>
                <div className="line italian" x-show="showAnswer">{currentCard.line3_italian}</div>
              </div>
              <div className="recall-actions" x-show="!showAnswer">
                <button 
                  className="action-button"
                  @click="showAnswer = true; showRatingButtons = true; currentCardStartTime = Date.now()"
                >
                  Check Answer
                </button>
              </div>
            </div>

            {/* Typing Mode */}
            <div className="study-question" x-show="studyMethod === 'typing'">
              <h3>Type the complete tercet:</h3>
              <div className="typing-interface">
                <div className="context-hint">
                  <em>{currentCard.line1_english}</em>
                </div>
                <div className="typing-area" x-show="!showAnswer">
                  <textarea 
                    placeholder="Type the Italian tercet here..."
                    className="tercet-textarea"
                    rows="3"
                  ></textarea>
                </div>
                <div className="tercet-display" x-show="showAnswer">
                  <div className="line italian">{currentCard.line1_italian}</div>
                  <div className="line italian">{currentCard.line2_italian}</div>
                  <div className="line italian">{currentCard.line3_italian}</div>
                </div>
              </div>
              <div className="typing-actions" x-show="!showAnswer">
                <button 
                  className="action-button"
                  @click="showAnswer = true; showRatingButtons = true; currentCardStartTime = Date.now()"
                >
                  Check Answer
                </button>
              </div>
            </div>

            {/* Translation and Rating */}
            <div className="answer-section" x-show="showAnswer">
              <div className="translation">
                <h4>English Translation:</h4>
                <div className="tercet-translation">
                  <div className="line english">{currentCard.line1_english}</div>
                  <div className="line english">{currentCard.line2_english}</div>
                  <div className="line english">{currentCard.line3_english}</div>
                </div>
              </div>

              <div className="fsrs-rating" x-show="showRatingButtons">
                <h4>How was your recall?</h4>
                <div className="rating-explanation">
                  Rate your performance to optimize future scheduling
                </div>
                <div className="rating-buttons-fsrs">
                  <button 
                    className="fsrs-button again"
                    @click="recordFSRSResult(1)"
                  >
                    <span className="rating-label">Again</span>
                    <span className="rating-description">Couldn't recall</span>
                    <span className="rating-schedule">~1 day</span>
                  </button>
                  <button 
                    className="fsrs-button hard"
                    @click="recordFSRSResult(2)"
                  >
                    <span className="rating-label">Hard</span>
                    <span className="rating-description">Recalled with difficulty</span>
                    <span className="rating-schedule">~3 days</span>
                  </button>
                  <button 
                    className="fsrs-button good"
                    @click="recordFSRSResult(3)"
                  >
                    <span className="rating-label">Good</span>
                    <span className="rating-description">Recalled correctly</span>
                    <span className="rating-schedule">~7 days</span>
                  </button>
                  <button 
                    className="fsrs-button easy"
                    @click="recordFSRSResult(4)"
                  >
                    <span className="rating-label">Easy</span>
                    <span className="rating-description">Perfect recall</span>
                    <span className="rating-schedule">~15 days</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <script>
        {`
          function recordFSRSResult(rating) {
            const responseTime = (Date.now() - this.currentCardStartTime) / 1000;
            
            // Update session stats
            const ratingNames = ['', 'again', 'hard', 'good', 'easy'];
            this.sessionStats[ratingNames[rating]]++;
            this.sessionStats.total++;
            
            // Record the FSRS result
            fetch('/study/fsrs/review', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: ${session.id},
                tercetId: ${currentCard.tercet_id},
                rating: rating,
                responseTime: responseTime,
                studyMethod: this.studyMethod
              })
            })
            .then(response => response.json())
            .then(data => {
              // Move to next card or end session
              this.currentIndex++;
              if (this.currentIndex >= this.totalCards) {
                // End session
                htmx.ajax('POST', '/study/session/${session.id}/end', { 
                  target: '#study-area',
                  values: { fsrs: true }
                });
              } else {
                // Reset for next card
                this.showAnswer = false;
                this.showRatingButtons = false;
                this.currentCardStartTime = Date.now();
                
                // Load next card
                htmx.ajax('GET', '/study/fsrs/session/${session.id}/next', { 
                  target: '.card-study-interface',
                  values: { index: this.currentIndex }
                });
              }
            });
          }
        `}
      </script>
    </div>
  );
}
```

### Advanced CSS for FSRS Interface

Add comprehensive styles for the FSRS interface to your `src/styles.css`:

```css
/* ===== ADVANCED FSRS STUDY DASHBOARD ===== */

.advanced-study-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-8);
}

.fsrs-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.stat-card.primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: white;
  border: none;
}

.stat-card.primary .stat-number {
  color: white;
}

.stat-progress .progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--space-3);
}

.stat-progress .progress-fill {
  height: 100%;
  background: white;
  transition: width var(--transition-normal);
}

.mastery-breakdown {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.mastery-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.mastery-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.mastery-dot.new { background: var(--color-warning); }
.mastery-dot.learning { background: var(--color-info); }
.mastery-dot.review { background: var(--color-success); }

.stability-indicator {
  margin-top: var(--space-3);
}

.stability-bar {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.stability-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-warning), var(--color-success));
  transition: width var(--transition-normal);
}

.stability-text {
  font-size: var(--text-sm);
  font-weight: 600;
}

.efficiency-details {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-secondary);
}

/* ===== STUDY MODES ===== */

.study-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

.study-mode-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.study-mode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.study-mode-card.priority {
  border-color: var(--color-error);
  background: linear-gradient(135deg, #fff, #fef2f2);
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.urgency-badge {
  background: var(--color-error);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.info-badge {
  background: var(--color-info);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.balance-badge {
  background: var(--color-success);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.mode-preview {
  margin: var(--space-6) 0;
  padding: var(--space-4);
  background: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.preview-tercet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.preview-tercet:last-child {
  border-bottom: none;
}

.tercet-info {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--text-sm);
}

.due-indicator {
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-warning);
  color: white;
  font-weight: 600;
}

.due-indicator.overdue {
  background: var(--color-error);
}

.tercet-first-line {
  font-style: italic;
  color: var(--color-secondary);
  font-size: var(--text-sm);
}

.study-button.priority {
  background: var(--color-error);
  border: none;
}

.study-button.priority:hover {
  background: var(--color-error-dark);
}

.study-button.balanced {
  background: linear-gradient(135deg, var(--color-accent), var(--color-success));
  border: none;
}

.session-composition {
  margin: var(--space-4) 0;
}

.composition-bar {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  overflow: hidden;
  display: flex;
  margin-bottom: var(--space-3);
}

.composition-segment.review {
  background: var(--color-accent);
}

.composition-segment.new {
  background: var(--color-success);
}

.composition-legend {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: var(--space-2);
}

.legend-dot.review {
  background: var(--color-accent);
}

.legend-dot.new {
  background: var(--color-success);
}

/* ===== FSRS STUDY SESSION ===== */

.fsrs-study-session {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.progress-container {
  flex: 1;
  max-width: 300px;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
  font-size: var(--text-sm);
}

.session-type {
  background: var(--color-accent);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.session-stats {
  display: flex;
  gap: var(--space-6);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.stat-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.card-study-interface {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-xl);
}

.card-context {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.location-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.canticle {
  font-weight: 700;
  color: var(--color-accent);
}

.canto {
  font-weight: 600;
  color: var(--color-primary);
}

.tercet {
  color: var(--color-secondary);
}

.separator {
  color: var(--color-border);
}

.card-metadata {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
}

.card-state {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: 600;
  text-transform: uppercase;
  font-size: var(--text-xs);
}

.state-new { background: var(--color-warning); color: white; }
.state-learning { background: var(--color-info); color: white; }
.state-review { background: var(--color-success); color: white; }
.state-relearning { background: var(--color-error); color: white; }

.mode-selector {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  padding: var(--space-2);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.mode-button {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-secondary);
}

.mode-button.active {
  background: var(--color-accent);
  color: white;
  box-shadow: var(--shadow-sm);
}

.study-question h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-6);
  text-align: center;
}

.tercet-display {
  background: var(--color-background);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
}

.line.highlighted {
  background: linear-gradient(135deg, var(--color-accent-light), transparent);
  padding: var(--space-3);
  margin: var(--space-2) 0;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-accent);
}

.tercet-input {
  margin-bottom: var(--space-6);
}

.line-input-container {
  margin: var(--space-3) 0;
}

.tercet-textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.6;
  background: var(--color-surface);
  resize: vertical;
}

.tercet-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.context-hint {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  background: var(--color-info-light);
  border-radius: var(--radius-md);
  color: var(--color-info-dark);
  text-align: center;
}

.answer-section {
  margin-top: var(--space-8);
  padding-top: var(--space-8);
  border-top: 2px solid var(--color-border);
}

.translation {
  margin-bottom: var(--space-8);
}

.translation h4 {
  color: var(--color-secondary);
  margin-bottom: var(--space-4);
  text-align: center;
}

.tercet-translation {
  background: var(--color-background);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.fsrs-rating {
  text-align: center;
}

.fsrs-rating h4 {
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.rating-explanation {
  color: var(--color-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
}

.rating-buttons-fsrs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.fsrs-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.fsrs-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.fsrs-button.again {
  border-color: var(--color-error);
}

.fsrs-button.again:hover {
  background: var(--color-error);
  color: white;
}

.fsrs-button.hard {
  border-color: var(--color-warning);
}

.fsrs-button.hard:hover {
  background: var(--color-warning);
  color: white;
}

.fsrs-button.good {
  border-color: var(--color-success);
}

.fsrs-button.good:hover {
  background: var(--color-success);
  color: white;
}

.fsrs-button.easy {
  border-color: var(--color-info);
}

.fsrs-button.easy:hover {
  background: var(--color-info);
  color: white;
}

.rating-label {
  font-weight: 700;
  font-size: var(--text-base);
  margin-bottom: var(--space-2);
}

.rating-description {
  font-size: var(--text-sm);
  opacity: 0.8;
  margin-bottom: var(--space-1);
}

.rating-schedule {
  font-size: var(--text-xs);
  opacity: 0.6;
  font-weight: 600;
}

/* ===== DASHBOARD FOOTER ===== */

.dashboard-footer {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  text-decoration: none;
  color: var(--color-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.quick-action:hover {
  background: var(--color-surface);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5rem;
}

/* ===== RESPONSIVE DESIGN ===== */

@media (max-width: 768px) {
  .fsrs-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .study-modes {
    grid-template-columns: 1fr;
  }
  
  .session-header {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .rating-buttons-fsrs {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }
  
  .mode-selector {
    flex-direction: column;
  }
}
```

## Server Routes for FSRS

Add the server routes to handle FSRS functionality in your `src/index.tsx`:

```typescript
// src/index.tsx (additions)

// FSRS study routes
app.get('/study/fsrs', (c) => {
  const currentUser = getCurrentUser(c);
  if (!currentUser) {
    return c.redirect('/login');
  }

  // Initialize FSRS parameters if they don't exist
  let parameters = getFSRSParameters(currentUser.id);
  if (!parameters) {
    parameters = initializeFSRSParameters(currentUser.id);
  }

  return c.html(<AdvancedStudyDashboard user={currentUser} />);
});

app.post('/study/fsrs/start', async (c) => {
  const currentUser = getCurrentUser(c);
  if (!currentUser) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const { mode } = await c.req.json();
  const session = startStudySession(currentUser.id, mode);
  
  return c.html(<FSRSStudySession session={session} mode={mode} user={currentUser} />);
});

app.post('/study/fsrs/review', async (c) => {
  const currentUser = getCurrentUser(c);
  if (!currentUser) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const { sessionId, tercetId, rating, responseTime, studyMethod } = await c.req.json();
  
  try {
    const result = processFSRSReview(currentUser.id, tercetId, rating, sessionId);
    
    return c.json({ 
      success: true, 
      card: result.card,
      correct: result.success 
    });
  } catch (error) {
    console.error('FSRS review error:', error);
    return c.json({ error: 'Failed to process review' }, 500);
  }
});

app.get('/analytics', (c) => {
  const currentUser = getCurrentUser(c);
  if (!currentUser) {
    return c.redirect('/login');
  }

  const fsrsStats = getFSRSLearningStats(currentUser.id);
  const recentSessions = getUserStudyHistory(currentUser.id, 10);
  
  return c.html(<AnalyticsDashboard user={currentUser} stats={fsrsStats} sessions={recentSessions} />);
});
```

## Dante and the Science of Memory

As we implement these sophisticated algorithms, it's worth reflecting on how Dante himself understood memory and learning. In the *Paradiso*, he writes about the divine light that "makes the will keen to act, and keen the intellect" (*Paradiso* XXXIII, 97-99). This isn't just poetic imagery—it's a recognition that true learning engages both emotional and intellectual faculties.

Our FSRS implementation embodies this insight. By tracking not just correctness but difficulty ratings, we're acknowledging that learning poetry isn't merely about information transfer—it's about the gradual development of personal relationship with the text. When a user rates a tercet as "easy," they're not just indicating successful recall; they're marking a moment where Dante's words have become, in some small way, their own.

The medieval "art of memory" that Dante knew wasn't fundamentally different from what we're implementing here. Both systems recognize that memory is not passive storage but active, personal reconstruction. Both understand that spacing and repetition, properly timed, can transform fleeting encounters into lasting knowledge.

When we optimize our algorithms for retention curves and forgetting patterns, we're participating in a conversation about memory and learning that stretches back to antiquity and forward to the frontiers of cognitive science.

## Exercises and Reflection

### Technical Exercises

1. **FSRS Parameter Optimization**: Implement user-specific parameter optimization:
   - Track individual forgetting curves for different content types
   - Implement gradient descent optimization for FSRS weights
   - Create A/B testing framework for different scheduling strategies
   - Add machine learning models to predict optimal intervals

2. **Advanced Analytics**: Build comprehensive learning dashboards:
   - Retention probability graphs over time
   - Heat maps of difficult tercets and themes
   - Comparative analysis across users (anonymized)
   - Predictive models for learning trajectory

3. **Adaptive Content Presentation**: Implement intelligent content selection:
   - Difficulty estimation based on linguistic complexity
   - Thematic grouping for related tercets
   - Context-aware scheduling (related passages together)
   - Emotional difficulty tracking (theological vs. narrative passages)

### Reflection Questions

1. **Algorithm Ethics**: What are the implications of using algorithmic optimization in humanities education? How do we balance efficiency with deeper engagement?

2. **Individual vs. Universal**: How should learning systems account for different cultural backgrounds, learning styles, and personal connections to literature?

3. **Technology and Memory**: How does digital memorization compare to traditional methods? What aspects of embodied, contemplative reading might be lost or gained?

4. **Data and Privacy**: What learning data should be collected, stored, and potentially shared? How do we protect user privacy while enabling research?

### Extended Projects

1. **Collaborative Learning Features**: Implement social and collaborative elements:
   - Study groups with shared progress tracking
   - Peer teaching and explanation features
   - Community-contributed annotations and interpretations
   - Competitive elements and learning challenges

2. **Multimodal Learning**: Expand beyond text-based learning:
   - Audio pronunciation practice with speech recognition
   - Visual memory palace creation tools
   - Integration with historical and artistic context
   - Virtual reality environments for immersive learning

3. **Research Platform**: Create tools for learning science research:
   - Anonymized data export for educational research
   - A/B testing framework for different algorithms
   - Integration with learning analytics standards
   - Open dataset contribution for cognitive science research

## Looking Forward

You've now implemented a sophisticated, scientifically-grounded learning system that adapts to individual users and optimizes for long-term retention. Your application can:

- **Model individual memory patterns** using the FSRS algorithm
- **Adapt scheduling** based on performance and content difficulty
- **Provide rich analytics** about learning progress and effectiveness
- **Support multiple study methods** (recognition, recall, typing)
- **Create engaging user experiences** that make learning feel effortless

In Chapter 11, our final chapter in Part IV, we'll add the finishing touches that transform your learning application from functional to truly polished. You'll implement advanced htmx patterns for real-time updates, create sophisticated session management, and build the kind of smooth, responsive interface that makes users forget they're using software at all.

Like Dante's ascent through the spheres of Paradise, each feature we add brings us closer to the ultimate goal: technology that serves to illuminate and enhance the human encounter with great literature, making it more accessible, more memorable, and more transformative than ever before.

---