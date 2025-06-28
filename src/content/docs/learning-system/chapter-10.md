---
title: "Building the Spaced Repetition System"
description: FSRS algorithm implementation, advanced study sessions, intelligent scheduling
---

# Chapter 10: Building the Spaced Repetition System

*"Trasumanar significar per verba / non si poria" — To transcend humanity cannot be signified in words*

## Opening Vignette: The Science of Forgetting

In 1885, Hermann Ebbinghaus spent months memorizing lists of nonsense syllables, then testing his own memory at carefully measured intervals. His painstaking self-experimentation revealed the mathematical nature of forgetting—how memory decays predictably over time, and how strategic review can combat this decay.

What Ebbinghaus discovered about memory, Dante understood intuitively about poetry. The *Divine Comedy* is structured to be memorable: the interlocking rhyme scheme creates a chain of associations, the dramatic imagery provides vivid anchors for recall, and the journey structure gives readers a spatial framework for organizing 14,233 lines of verse.

Today, we'll implement the most sophisticated version of Ebbinghaus's insights: the FSRS (Free Spaced Repetition Scheduler) algorithm. This isn't just about efficient memorization—it's about creating a learning system that adapts to the unique patterns of how each individual reader encounters and internalizes Dante's poetry.

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

### Core FSRS Algorithm Implementation

Now implement the core FSRS algorithm. Create a new file `src/fsrs.ts`:

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

Now let's create sophisticated study interfaces that leverage the power of FSRS while providing an engaging user experience. 

### Enhanced Study Dashboard

The study dashboard serves as mission control for the learning experience:

```typescript
// src/components.tsx (additions)

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
        </div>

        <div className="study-modes">
          <div className="study-mode-card priority">
            <div className="mode-header">
              <h3>Priority Review</h3>
              <span className="urgency-badge">Due Now</span>
            </div>
            <p>Focus on tercets that need immediate attention</p>
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
      </div>
    </Layout>
  );
}
```

### Interactive FSRS Study Session

The study session component creates a sophisticated learning experience with multiple study modes and intelligent feedback:

```typescript
// src/components.tsx (continued)

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

            {/* FSRS Rating Section */}
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

## Dante and the Science of Memory

As we implement these sophisticated algorithms, it's worth reflecting on how Dante himself understood memory and learning. In the *Paradiso*, he writes about the divine light that "makes the will keen to act, and keen the intellect" (*Paradiso* XXXIII, 97-99). This isn't just poetic imagery—it's a recognition that true learning engages both emotional and intellectual faculties.

Our FSRS implementation embodies this insight. By tracking not just correctness but difficulty ratings, we're acknowledging that learning poetry isn't merely about information transfer—it's about the gradual development of personal relationship with the text. When a user rates a tercet as "easy," they're not just indicating successful recall; they're marking a moment where Dante's words have become, in some small way, their own.

The medieval "art of memory" that Dante knew wasn't fundamentally different from what we're implementing here. Both systems recognize that memory is not passive storage but active, personal reconstruction. Both understand that spacing and repetition, properly timed, can transform fleeting encounters into lasting knowledge.

## Looking Forward

You've now implemented a sophisticated, scientifically-grounded learning system that adapts to individual users and optimizes for long-term retention. Your application can model individual memory patterns, adapt scheduling based on performance, provide rich analytics, support multiple study methods, and create engaging user experiences.

In Chapter 11, our final chapter in Part IV, we'll add the finishing touches with advanced htmx patterns for real-time updates, sophisticated session management, and the kind of smooth, responsive interface that makes users forget they're using software at all.