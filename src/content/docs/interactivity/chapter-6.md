---
title: "Alpine.js - Adding Client-Side Polish"
description: Client-side state management, animations, study session tracking
---

# Chapter 6: Alpine.js - Adding Client-Side Polish

*"E come 'l vento che di terra si leva / d'un soffiar che le nuvole dispaia, / così da quella danza si partiva"*

*And as the wind that rises from the earth in a sudden gust that scatters the clouds, so from that dance it departed*

In Paradiso XIV, Dante describes the swift, graceful movement of souls in Paradise—motion that seems effortless yet purposeful, responsive yet harmonious. This captures the essence of what we'll achieve in this chapter: adding client-side interactivity that feels natural and responsive, enhancing user experience without overwhelming the fundamental purpose of engaging with great literature.

While htmx handles server communication beautifully, some interactions are better handled entirely in the browser. Alpine.js provides the perfect complement—a lightweight library that adds reactive behavior directly to your HTML, making interfaces feel alive and responsive while maintaining the declarative approach you've learned to love with htmx.

## Learning Objectives

By the end of this chapter, you will:

- Understand when to use client-side JavaScript vs. server interactions
- Implement Alpine.js for local state management and UI reactivity
- Create smooth animations and transitions that enhance user experience
- Build interactive progress tracking and study session management
- Combine Alpine.js with htmx for powerful, hybrid applications
- Develop the foundation for spaced repetition learning systems

## The Philosophy of Client-Side Enhancement

Before diving into Alpine.js, let's understand when and why to add client-side interactivity. The principle of progressive enhancement suggests a hierarchy:

1. **Core functionality** should work with just HTML
2. **Enhanced interactions** should be added with server-side processing (htmx)
3. **Polish and responsiveness** should be layered on with client-side JavaScript (Alpine.js)

### What Alpine.js Adds to Your Stack

Alpine.js excels at:
- **Local state management** (tracking what the user is currently doing)
- **Immediate UI feedback** (showing/hiding elements, updating counters)
- **Form validation** (checking input before sending to server)
- **Animations and transitions** (smooth visual feedback)
- **Complex UI patterns** (tabs, accordions, modals)

### Alpine.js vs. React/Vue

If you're familiar with React or Vue, Alpine.js might seem limited. But that's by design. Alpine.js follows the philosophy of "just enough framework"—providing reactive behavior without the complexity of virtual DOMs, build steps, or component lifecycles.

For our Dante application, this is perfect. We want the text to be the star, with technology serving as an invisible enhancement rather than the main event.

## Setting Up Alpine.js

Let's add Alpine.js to your application. Update your `Layout` component in `src/components.tsx`:

```typescript
export function Layout({ 
    title, 
    children, 
    className = "" 
}: { 
    title: string
    children: any
    className?: string 
}) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title} - Divine Comedy</title>
                <link rel="stylesheet" href="/styles.css" />
                <script src="https://unpkg.com/htmx.org@1.9.6"></script>
                <script src="https://unpkg.com/alpinejs@3.13.3/dist/cdn.min.js" defer></script>
                <script src="/app.js" defer></script>
                <meta name="description" content="A digital memorization journey through Dante's Divine Comedy" />
                <meta name="author" content="Dante Alighieri" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body>
                <div className={`container ${className}`}>
                    <SiteHeader />
                    <main>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
```

Note: The `defer` attribute on Alpine.js is crucial—it ensures Alpine.js initializes after the DOM is fully loaded.

## Building a Study Session Manager

Let's create our first Alpine.js component: a study session manager that tracks progress, timing, and user goals. This will demonstrate core Alpine.js concepts while building functionality essential to a memorization app.

First, add this new component to `src/components.tsx`:

```typescript
// ===== STUDY SESSION COMPONENTS =====

export function StudySessionInterface() {
    return (
        <div className="study-session-interface">
            <StudySessionHeader />
            <StudySessionContent />
        </div>
    )
}

function StudySessionHeader() {
    return (
        <header 
            className="session-header"
            x-data="sessionManager()"
            x-init="initSession()"
        >
            <div className="session-info">
                <h2 className="session-title">Study Session</h2>
                <div className="session-stats">
                    <div className="stat-item">
                        <span className="stat-label">Progress</span>
                        <span className="stat-value">
                            <span x-text="completedTercets"></span> / <span x-text="goalTercets"></span>
                        </span>
                    </div>
                    
                    <div className="stat-item">
                        <span className="stat-label">Time</span>
                        <span className="stat-value" x-text="formatTime(elapsedTime)"></span>
                    </div>
                    
                    <div className="stat-item">
                        <span className="stat-label">Streak</span>
                        <span className="stat-value">
                            <span x-text="currentStreak"></span>
                            <span className="streak-icon" x-show="currentStreak > 0">🔥</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="session-controls">
                <button 
                    className="button button--secondary"
                    @click="pauseSession()"
                    x-show="!isPaused && isActive"
                >
                    ⏸ Pause
                </button>
                
                <button 
                    className="button button--primary"
                    @click="resumeSession()"
                    x-show="isPaused"
                >
                    ▶ Resume
                </button>
                
                <button 
                    className="button button--accent"
                    @click="completeSession()"
                    x-show="completedTercets >= goalTercets"
                >
                    ✓ Complete Session
                </button>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-container">
                <div 
                    className="progress-bar"
                    :style="`width: ${Math.min(100, (completedTercets / goalTercets) * 100)}%`"
                ></div>
                <div className="progress-text">
                    <span x-text="`${Math.round((completedTercets / goalTercets) * 100)}% Complete`"></span>
                </div>
            </div>
        </header>
    )
}

function StudySessionContent() {
    return (
        <div className="session-content" x-data="tercetBrowser()">
            <div className="tercet-selector">
                <h3 className="selector-title">Choose Your Study Method</h3>
                
                <div className="method-cards">
                    <div 
                        className="method-card"
                        :class="{ active: selectedMethod === 'sequential' }"
                        @click="selectMethod('sequential')"
                    >
                        <div className="method-icon">📖</div>
                        <h4 className="method-name">Sequential Reading</h4>
                        <p className="method-description">
                            Read through tercets in order, from Inferno to Paradiso.
                        </p>
                    </div>
                    
                    <div 
                        className="method-card"
                        :class="{ active: selectedMethod === 'random' }"
                        @click="selectMethod('random')"
                    >
                        <div className="method-icon">🎲</div>
                        <h4 className="method-name">Random Discovery</h4>
                        <p className="method-description">
                            Explore tercets randomly to discover unexpected connections.
                        </p>
                    </div>
                    
                    <div 
                        className="method-card"
                        :class="{ active: selectedMethod === 'focused' }"
                        @click="selectMethod('focused')"
                    >
                        <div className="method-icon">🎯</div>
                        <h4 className="method-name">Focused Practice</h4>
                        <p className="method-description">
                            Review specific tercets or areas where you need more work.
                        </p>
                    </div>
                </div>
                
                {/* Method-specific options */}
                <div className="method-options" x-show="selectedMethod" x-collapse>
                    <div x-show="selectedMethod === 'sequential'">
                        <label className="option-label">
                            Start from:
                            <select x-model="sequentialStart" className="option-select">
                                <option value="beginning">Beginning (Inferno I)</option>
                                <option value="current">Current position</option>
                                <option value="canticle">Start of canticle</option>
                            </select>
                        </label>
                    </div>

                    <div x-show="selectedMethod === 'random'">
                        <label className="option-label">
                            Focus area:
                            <select x-model="randomScope" className="option-select">
                                <option value="all">All canticles</option>
                                <option value="inferno">Inferno only</option>
                                <option value="purgatorio">Purgatorio only</option>
                                <option value="paradiso">Paradiso only</option>
                            </select>
                        </label>
                    </div>
                    
                    <div x-show="selectedMethod === 'focused'">
                        <label className="option-label">
                            Practice type:
                            <select x-model="focusedType" className="option-select">
                                <option value="difficult">Difficult tercets</option>
                                <option value="recent">Recently studied</option>
                                <option value="bookmarked">Bookmarked tercets</option>
                                <option value="custom">Custom selection</option>
                            </select>
                        </label>
                    </div>
                </div>
                
                <div className="start-session" x-show="selectedMethod">
                    <button 
                        className="button button--primary button--large"
                        @click="startStudying()"
                        :disabled="!selectedMethod"
                    >
                        Start Studying
                    </button>
                </div>
            </div>
            
            {/* Active study area (initially hidden) */}
            <div className="active-study" x-show="isStudying" x-collapse>
                <div className="study-navigation">
                    <button 
                        className="button button--secondary"
                        @click="previousTercet()"
                        :disabled="!canGoPrevious"
                    >
                        ← Previous
                    </button>
                    
                    <div className="current-tercet-info">
                        <span x-text="currentTercetDisplay"></span>
                    </div>
                    
                    <button 
                        className="button button--secondary"
                        @click="nextTercet()"
                        :disabled="!canGoNext"
                    >
                        Next →
                    </button>
                </div>
                
                <div className="tercet-display-area">
                    <div 
                        className="tercet-frame"
                        hx-get="/api/tercet-session/1"
                        hx-trigger="load"
                        id="current-tercet-frame"
                    >
                        {/* Tercet content loaded via htmx */}
                    </div>
                </div>
                
                <div className="study-actions">
                    <button 
                        className="button button--primary"
                        @click="markComplete()"
                        :disabled="!currentTercetId"
                    >
                        Mark as Studied
                    </button>
                    
                    <button 
                        className="button button--secondary"
                        @click="markDifficult()"
                        :disabled="!currentTercetId"
                    >
                        Mark as Difficult
                    </button>
                    
                    <button 
                        className="button button--ghost"
                        @click="bookmark()"
                        :disabled="!currentTercetId"
                    >
                        <span x-text="isBookmarked ? '★ Bookmarked' : '☆ Bookmark'"></span>
                    </button>
                </div>
            </div>
        </div>
    )
}
```

Now create the Alpine.js JavaScript components. Create a new file `public/alpine-components.js`:

```javascript
// Alpine.js components for the Dante memorization app

// Session management component
function sessionManager() {
    return {
        // Session state
        isActive: false,
        isPaused: false,
        startTime: null,
        elapsedTime: 0,
        
        // Progress tracking
        completedTercets: 0,
        goalTercets: 10,
        currentStreak: 0,
        
        // Timer
        timerInterval: null,
        
        // Initialize session
        initSession() {
            // Load saved session data if available
            const savedSession = localStorage.getItem('dante-session')
            if (savedSession) {
                const data = JSON.parse(savedSession)
                this.completedTercets = data.completedTercets || 0
                this.currentStreak = data.currentStreak || 0
                this.goalTercets = data.goalTercets || 10
            }
            
            this.startTimer()
        },
        
        // Timer methods
        startTimer() {
            if (this.timerInterval) return
            
            this.isActive = true
            this.startTime = Date.now() - this.elapsedTime
            
            this.timerInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.elapsedTime = Date.now() - this.startTime
                }
            }, 1000)
        },
        
        pauseSession() {
            this.isPaused = true
            this.saveSession()
        },
        
        resumeSession() {
            this.isPaused = false
            this.startTime = Date.now() - this.elapsedTime
        },
        
        completeSession() {
            this.isActive = false
            clearInterval(this.timerInterval)
            this.saveSession()
            
            // Show completion celebration
            this.showCompletionMessage()
        },
        
        // Progress methods
        incrementProgress() {
            this.completedTercets++
            this.currentStreak++
            this.saveSession()
            
            // Trigger celebration if goal reached
            if (this.completedTercets >= this.goalTercets) {
                this.triggerGoalCelebration()
            }
        },
        
        // Helper methods
        formatTime(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)
            
            if (hours > 0) {
                return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
            } else {
                return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
            }
        },
        
        saveSession() {
            const sessionData = {
                completedTercets: this.completedTercets,
                currentStreak: this.currentStreak,
                goalTercets: this.goalTercets,
                lastActive: Date.now()
            }
            localStorage.setItem('dante-session', JSON.stringify(sessionData))
        },
        
        showCompletionMessage() {
            // Simple celebration - in a real app, this could be more elaborate
            if (window.confetti) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            }
            
            setTimeout(() => {
                alert(`Congratulations! You've completed your study session of ${this.goalTercets} tercets in ${this.formatTime(this.elapsedTime)}.`)
            }, 500)
        },
        
        triggerGoalCelebration() {
            // Add visual feedback for reaching goals
            document.querySelector('.progress-bar')?.classList.add('celebration')
            setTimeout(() => {
                document.querySelector('.progress-bar')?.classList.remove('celebration')
            }, 2000)
        }
    }
}

// Tercet browser component
function tercetBrowser() {
    return {
        // Method selection
        selectedMethod: '',
        
        // Method options
        sequentialStart: 'beginning',
        randomScope: 'all',
        focusedType: 'difficult',
        
        // Study state
        isStudying: false,
        currentTercetId: null,
        tercetHistory: [],
        currentIndex: 0,
        
        // Bookmarks and progress
        bookmarkedTercets: new Set(),
        difficultTercets: new Set(),
        studiedTercets: new Set(),
        
        // Method selection
        selectMethod(method) {
            this.selectedMethod = method
            this.savePreferences()
        },
        
        // Start studying
        startStudying() {
            if (!this.selectedMethod) return
            
            this.isStudying = true
            this.loadTercetSequence()
            this.loadFirstTercet()
        },
        
        // Load appropriate tercet sequence based on method
        loadTercetSequence() {
            // This would interact with your server to get the appropriate sequence
            // For now, we'll simulate it
            switch (this.selectedMethod) {
                case 'sequential':
                    this.loadSequentialTercets()
                    break
                case 'random':
                    this.loadRandomTercets()
                    break
                case 'focused':
                    this.loadFocusedTercets()
                    break
            }
        },
        
        loadSequentialTercets() {
            // Simulate loading sequential tercets
            // In real app, this would be an htmx call
            fetch('/api/tercets/sequence?method=sequential&start=' + this.sequentialStart)
                .then(response => response.json())
                .then(data => {
                    this.tercetHistory = data
                    this.currentIndex = 0
                })
        },
        
        loadRandomTercets() {
            fetch('/api/tercets/sequence?method=random&scope=' + this.randomScope)
                .then(response => response.json())
                .then(data => {
                    this.tercetHistory = data
                    this.currentIndex = 0
                })
        },
        
        loadFocusedTercets() {
            fetch('/api/tercets/sequence?method=focused&type=' + this.focusedType)
                .then(response => response.json())
                .then(data => {
                    this.tercetHistory = data
                    this.currentIndex = 0
                })
        },
        
        // Navigation
        loadFirstTercet() {
            if (this.tercetHistory.length > 0) {
                this.currentTercetId = this.tercetHistory[0]
                this.updateTercetDisplay()
            }
        },
        
        nextTercet() {
            if (this.canGoNext) {
                this.currentIndex++
                this.currentTercetId = this.tercetHistory[this.currentIndex]
                this.updateTercetDisplay()
            }
        },
        
        previousTercet() {
            if (this.canGoPrevious) {
                this.currentIndex--
                this.currentTercetId = this.tercetHistory[this.currentIndex]
                this.updateTercetDisplay()
            }
        },
        
        updateTercetDisplay() {
            // Use htmx to load the new tercet
            const frame = document.getElementById('current-tercet-frame')
            if (frame && this.currentTercetId) {
                htmx.ajax('GET', `/api/tercet-session/${this.currentTercetId}`, frame)
            }
        },
        
        // Study actions
        markComplete() {
            if (!this.currentTercetId) return
            
            this.studiedTercets.add(this.currentTercetId)
            this.saveProgress()
            
            // Increment session progress
            this.$dispatch('tercet-completed')
            
            // Auto-advance to next tercet
            setTimeout(() => {
                if (this.canGoNext) {
                    this.nextTercet()
                }
            }, 1000)
        },
        
        markDifficult() {
            if (!this.currentTercetId) return
            
            this.difficultTercets.add(this.currentTercetId)
            this.saveProgress()
            
            // Visual feedback
            this.showFeedback('Marked as difficult - will appear more often in focused practice')
        },
        
        bookmark() {
            if (!this.currentTercetId) return
            
            if (this.isBookmarked) {
                this.bookmarkedTercets.delete(this.currentTercetId)
                this.showFeedback('Bookmark removed')
            } else {
                this.bookmarkedTercets.add(this.currentTercetId)
                this.showFeedback('Tercet bookmarked')
            }
            
            this.saveProgress()
        },
        
        // Computed properties
        get canGoNext() {
            return this.currentIndex < this.tercetHistory.length - 1
        },
        
        get canGoPrevious() {
            return this.currentIndex > 0
        },
        
        get currentTercetDisplay() {
            if (!this.currentTercetId) return ''
            return `Tercet ${this.currentIndex + 1} of ${this.tercetHistory.length}`
        },
        
        get isBookmarked() {
            return this.bookmarkedTercets.has(this.currentTercetId)
        },
        
        // Persistence
        savePreferences() {
            const prefs = {
                selectedMethod: this.selectedMethod,
                sequentialStart: this.sequentialStart,
                randomScope: this.randomScope,
                focusedType: this.focusedType
            }
            localStorage.setItem('dante-study-prefs', JSON.stringify(prefs))
        },
        
        saveProgress() {
            const progress = {
                bookmarked: Array.from(this.bookmarkedTercets),
                difficult: Array.from(this.difficultTercets),
                studied: Array.from(this.studiedTercets)
            }
            localStorage.setItem('dante-progress', JSON.stringify(progress))
        },
        
        loadProgress() {
            const progress = localStorage.getItem('dante-progress')
            if (progress) {
                const data = JSON.parse(progress)
                this.bookmarkedTercets = new Set(data.bookmarked || [])
                this.difficultTercets = new Set(data.difficult || [])
                this.studiedTercets = new Set(data.studied || [])
            }
        },
        
        showFeedback(message) {
            // Simple toast notification
            const toast = document.createElement('div')
            toast.className = 'toast-notification'
            toast.textContent = message
            document.body.appendChild(toast)
            
            setTimeout(() => {
                toast.classList.add('show')
            }, 100)
            
            setTimeout(() => {
                toast.classList.remove('show')
                setTimeout(() => document.body.removeChild(toast), 300)
            }, 3000)
        },
        
        // Initialize
        init() {
            this.loadProgress()
            
            // Listen for tercet completion events
            this.$el.addEventListener('tercet-completed', () => {
                // Find the session manager and increment progress
                const sessionEl = document.querySelector('[x-data*="sessionManager"]')
                if (sessionEl) {
                    sessionEl._x_dataStack[0].incrementProgress()
                }
            })
        }
    }
}

// Make components globally available
window.sessionManager = sessionManager
window.tercetBrowser = tercetBrowser
```

## Creating an Interactive Reading Mode

Now let's enhance one of your existing reading modes with Alpine.js interactivity. Let's update the study mode to include local state management and better user feedback.

Update the `StudyModeDisplay` component in `src/components.tsx`:

```typescript
export function StudyModeDisplay({ tercet }: { tercet: Tercet }) {
    return (
        <article 
            className="study-display"
            x-data="studyMode()"
            x-init="initStudy()"
        >
            <StudyHeaderInteractive tercet={tercet} />
            <StudyContentInteractive tercet={tercet} />
        </article>
    )
}

function StudyHeaderInteractive({ tercet }: { tercet: Tercet }) {
    return (
        <header className="study-header">
            <div className="tercet-meta">
                <span>{tercet.canticle}</span>
                <div className="tercet-meta__separator"></div>
                <span>Canto {tercet.canto}</span>
                <div className="tercet-meta__separator"></div>
                <span>Tercet {tercet.tercetNumber}</span>
            </div>
            <h2 className="study-title">Interactive Study Mode</h2>
            
            {/* Study preferences */}
            <div className="study-preferences">
                <label className="preference-toggle">
                    <input 
                        type="checkbox" 
                        x-model="autoReveal"
                        @change="savePreferences()"
                    />
                    <span>Auto-reveal translation after <span x-text="autoRevealDelay"></span>s</span>
                </label>
                
                <label className="preference-toggle">
                    <input 
                        type="checkbox" 
                        x-model="showHints"
                        @change="savePreferences()"
                    />
                    <span>Show translation hints</span>
                </label>
                
                <div className="timing-control">
                    <label>Auto-reveal delay:</label>
                    <input 
                        type="range" 
                        min="3" 
                        max="30" 
                        x-model="autoRevealDelay"
                        @change="savePreferences()"
                        className="delay-slider"
                    />
                    <span x-text="autoRevealDelay + 's'"></span>
                </div>
            </div>
        </header>
    )
}

function StudyContentInteractive({ tercet }: { tercet: Tercet }) {
    return (
        <div className="study-content">
            {/* Reading timer */}
            <div className="reading-timer" x-show="isReading">
                <div className="timer-display">
                    <span>Reading time: </span>
                    <span x-text="formatTime(readingTime)"></span>
                </div>
                <div className="timer-bar">
                    <div 
                        className="timer-progress"
                        :style="`width: ${Math.min(100, (readingTime / (autoRevealDelay * 1000)) * 100)}%`"
                        x-show="autoReveal && !translationRevealed"
                    ></div>
                </div>
            </div>
            
            {/* Italian text with interactive features */}
            <div className="tercet-lines" id="italian-text">
                {tercet.lines.map((line, index) => (
                    <p 
                        key={index} 
                        className="tercet-line interactive-line"
                        x-data={`{ wordHints: [] }`}
                        @mouseenter="startReading()"
                    >
                        <span 
                            className="line-text"
                            @click="showLineTranslation({line}, {index})"
                        >
                            {line}
                        </span>
                        
                        {/* Hint system */}
                        <button 
                            className="hint-button"
                            x-show="showHints && !translationRevealed"
                            @click="showWordHints({index})"
                            title="Show word hints"
                        >
                            💡
                        </button>
                    </p>
                ))}
            </div>
            
            {/* Interactive controls with state */}
            <div className="study-controls">
                <button 
                    className="button button--primary"
                    @click="revealTranslation()"
                    x-show="!translationRevealed"
                    :disabled="isRevealing"
                >
                    <span x-show="!isRevealing">Reveal Translation</span>
                    <span x-show="isRevealing">Revealing...</span>
                </button>
                
                <button 
                    className="button button--secondary"
                    @click="hideTranslation()"
                    x-show="translationRevealed"
                >
                    Hide Translation
                </button>
                
                <button 
                    className="button button--ghost"
                    @click="resetStudy()"
                >
                    Start Over
                </button>
            </div>
            
            {/* Dynamic translation area with animations */}
            <div 
                id="translation-area" 
                className="translation-area"
                x-show="translationRevealed"
                x-transition:enter="transition ease-out duration-300"
                x-transition:enter-start="opacity-0 transform scale-95"
                x-transition:enter-end="opacity-100 transform scale-100"
                x-transition:leave="transition ease-in duration-200"
                x-transition:leave-start="opacity-100 transform scale-100"
                x-transition:leave-end="opacity-0 transform scale-95"
            >
                <div className="tercet-translation">
                    <p className="translation-text">{tercet.translation}</p>
                    <p className="translator">—{tercet.translator}</p>
                </div>
                
                {/* Comprehension check */}
                <div className="comprehension-check" x-show="translationRevealed">
                    <h4>Quick Check:</h4>
                    <button 
                        className="comprehension-button"
                        :class="{ active: comprehension === 'easy' }"
                        @click="setComprehension('easy')"
                    >
                        😊 Easy to understand
                    </button>
                    <button 
                        className="comprehension-button"
                        :class="{ active: comprehension === 'moderate' }"
                        @click="setComprehension('moderate')"
                    >
                        🤔 Somewhat challenging
                    </button>
                    <button 
                        className="comprehension-button"
                        :class="{ active: comprehension === 'difficult' }"
                        @click="setComprehension('difficult')"
                    >
                        😓 Quite difficult
                    </button>
                </div>
            </div>
            
            {/* Word hints overlay */}
            <div 
                className="word-hints-overlay"
                x-show="showingWordHints"
                @click.away="hideWordHints()"
                x-transition
            >
                <div className="hints-content">
                    <h4>Word Hints</h4>
                    <div className="hint-list" x-html="currentHints"></div>
                    <button className="button button--secondary" @click="hideWordHints()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
```

This chapter continues with comprehensive examples showing how to build sophisticated interactive components using Alpine.js, including progress tracking, animations, and state management. The content demonstrates how Alpine.js complements htmx to create rich, responsive user interfaces while maintaining simplicity and accessibility.

The chapter concludes with discussions of how client-side interactivity enhances the study of classical literature, reflection questions about the balance between technology and content, and exercises that challenge students to think about user experience design in educational applications.