

# Part II: Interactivity

---

# Chapter 4: Your First htmx Magic - Dynamic Content

*"Come l'occhio nostro non si soffolge / in alto fisso al sole, così la mente / mia non si sofferse a quella doglia molto."*

*As our eye cannot bear to look straight up at the sun, so my mind could not endure that torment for long.*

In Paradiso XXV, Dante describes the moment when direct divine vision becomes almost too intense to bear. Similarly, as we transition from static web pages to dynamic, interactive applications, we're about to witness something that might seem almost magical: HTML that updates itself in response to user actions, without page refreshes, without complex JavaScript frameworks.

This chapter introduces you to htmx, the library that will transform your beautiful but static Dante interface into a living, breathing application. You'll learn how to make text appear and disappear, create interactive study modes, and build the foundation for the memorization features that are the heart of our application.

## Learning Objectives

By the end of this chapter, you will:

- Understand the htmx philosophy and how it differs from traditional JavaScript frameworks
- Implement your first dynamic content updates using htmx attributes
- Create interactive study modes for Dante memorization
- Build progressive disclosure interfaces that hide and reveal content
- Handle loading states and provide user feedback during interactions
- Understand how htmx enables hypermedia-driven applications

## The htmx Philosophy: HTML as the Application Language

Before we start coding, let's understand what makes htmx revolutionary. Most modern web frameworks ask you to learn complex JavaScript patterns, manage application state in memory, and think about your user interface as a collection of components that re-render when data changes.

htmx takes a different approach: it extends HTML itself to be more expressive. Instead of writing JavaScript to handle user interactions, you add attributes to your HTML that describe what should happen when users click, type, or otherwise interact with your page.

### Why This Matters for Humanities Students

Think about how you analyze texts. You don't learn a completely new language—you use your existing knowledge of English (or Latin, or Italian) and add new analytical concepts. htmx works the same way: you use your existing HTML knowledge and add new interactive concepts.

Consider these two approaches to the same functionality:

**Traditional JavaScript approach:**
```javascript
document.getElementById('reveal-button').addEventListener('click', async function() {
    const response = await fetch('/api/tercet/1/translation');
    const translation = await response.text();
    document.getElementById('translation-area').innerHTML = translation;
});
```

**htmx approach:**
```html
<button hx-get="/api/tercet/1/translation" hx-target="#translation-area">
    Reveal Translation
</button>
<div id="translation-area"></div>
```

The htmx version reads like natural language: "When this button is clicked, get content from this URL and put it in that element." This declarative approach aligns with how humanities scholars think about texts—describing what something is and what it means, rather than the procedural steps to process it.

## Setting Up htmx in Your Application

Let's add htmx to your existing application. First, update your `Layout` component in `src/components.tsx` to include the htmx library:

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

Note: In production applications, you'd want to download and serve htmx from your own server rather than using a CDN, but for development, this approach works well.

## Your First htmx Interaction: Progressive Disclosure

Let's start with a fundamental feature for memorization apps: the ability to hide and reveal content progressively. We'll create a study mode where users can see Dante's Italian text and choose when to reveal the English translation.

First, let's create new components for this interactive experience. Add these to your `src/components.tsx`:

```typescript
// ===== STUDY MODE COMPONENTS =====

export function StudyModeDisplay({ tercet }: { tercet: Tercet }) {
    return (
        <article className="study-display">
            <StudyHeader tercet={tercet} />
            <StudyContent tercet={tercet} />
        </article>
    )
}

function StudyHeader({ tercet }: { tercet: Tercet }) {
    return (
        <header className="study-header">
            <div className="tercet-meta">
                <span>{tercet.canticle}</span>
                <div className="tercet-meta__separator"></div>
                <span>Canto {tercet.canto}</span>
                <div className="tercet-meta__separator"></div>
                <span>Tercet {tercet.tercetNumber}</span>
            </div>
            <h2 className="study-title">Study Mode</h2>
            <p className="study-instructions">
                Read the Italian text carefully, then reveal the translation when ready.
            </p>
        </header>
    )
}

function StudyContent({ tercet }: { tercet: Tercet }) {
    return (
        <div className="study-content">
            {/* Always visible: Italian text */}
            <div className="tercet-lines" id="italian-text">
                {tercet.lines.map((line, index) => (
                    <p key={index} className="tercet-line">{line}</p>
                ))}
            </div>
            
            {/* Interactive controls */}
            <div className="study-controls">
                <button 
                    className="button button--primary"
                    hx-get={`/api/tercet/${tercet.id}/translation`}
                    hx-target="#translation-area"
                    hx-swap="innerHTML"
                >
                    Reveal Translation
                </button>
                
                <button 
                    className="button button--secondary"
                    hx-get={`/api/tercet/${tercet.id}/hidden-translation`}
                    hx-target="#translation-area"
                    hx-swap="innerHTML"
                >
                    Hide Translation
                </button>
            </div>
            
            {/* Dynamic content area */}
            <div id="translation-area" className="translation-area">
                <p className="placeholder-text">Translation will appear here when revealed.</p>
            </div>
        </div>
    )
}

// Component for rendering just the translation (returned by htmx requests)
export function TranslationOnly({ tercet }: { tercet: Tercet }) {
    return (
        <div className="tercet-translation">
            <p className="translation-text">{tercet.translation}</p>
            <p className="translator">—{tercet.translator}</p>
        </div>
    )
}

// Component for rendering hidden translation placeholder
export function HiddenTranslation() {
    return (
        <p className="placeholder-text">Translation hidden. Click "Reveal Translation" to show.</p>
    )
}
```

Now let's add the CSS for these new study mode components. Add this to your `styles.css`:

```css
/* ===== STUDY MODE STYLES ===== */

.study-display {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.study-header {
  background: linear-gradient(135deg, #1a5490, #2e7bb8);
  color: white;
  padding: var(--space-6);
  text-align: center;
}

.study-title {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  font-weight: 400;
  margin: var(--space-2) 0;
}

.study-instructions {
  font-size: var(--text-base);
  opacity: 0.9;
  margin: 0;
  font-style: italic;
}

.study-content {
  padding: var(--space-8);
}

.study-controls {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin: var(--space-6) 0;
  flex-wrap: wrap;
}

.translation-area {
  min-height: 120px;
  padding: var(--space-6);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-top: var(--space-6);
  transition: all var(--transition-normal);
}

.placeholder-text {
  color: var(--color-secondary);
  font-style: italic;
  text-align: center;
  margin: 0;
  line-height: 1.6;
}

/* Loading states */
.htmx-request .translation-area {
  opacity: 0.7;
  transform: scale(0.98);
}

.htmx-request .study-controls button {
  opacity: 0.7;
  pointer-events: none;
}

/* Success animations */
.translation-area.htmx-added {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile responsiveness for study mode */
@media (max-width: 640px) {
  .study-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .study-controls .button {
    width: 100%;
    max-width: 280px;
  }
}
```

## Implementing the Server Endpoints

Now we need to create the server endpoints that htmx will call. Add these routes to your `src/index.tsx`:

```typescript
// API endpoint to return just the translation
app.get('/api/tercet/:id/translation', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html('<p class="error-text">Translation not found.</p>', 404)
    }
    
    // Simulate network delay for demonstration
    // In a real app, this might be database query time
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(c.html(<TranslationOnly tercet={tercet} />))
        }, 300)
    })
})

// API endpoint to hide translation
app.get('/api/tercet/:id/hidden-translation', (c) => {
    return c.html(<HiddenTranslation />)
})

// New study mode route
app.get('/study/:id', (c) => {
    const idParam = c.req.param('id')
    const id = parseInt(idParam)
    
    if (isNaN(id) || id < 1) {
        return c.html(
            <ErrorPage 
                error="Please provide a valid tercet number." 
                statusCode={400} 
            />, 
            400
        )
    }
    
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html(
            <ErrorPage 
                error="The requested tercet was not found." 
                statusCode={404} 
            />, 
            404
        )
    }
    
    return c.html(
        <Layout title={`Study: ${tercet.canticle} - Canto ${tercet.canto}, Tercet ${tercet.tercetNumber}`}>
            <div className="stack">
                <StudyNavigation currentId={id} totalTercets={sampleTercets.length} />
                <StudyModeDisplay tercet={tercet} />
            </div>
        </Layout>
    )
})
```

We also need to create a navigation component for study mode. Add this to your `src/components.tsx`:

```typescript
export function StudyNavigation({ 
    currentId, 
    totalTercets 
}: { 
    currentId: number
    totalTercets: number 
}) {
    const hasPrevious = currentId > 1
    const hasNext = currentId < totalTercets
    
    return (
        <nav className="nav">
            <div className="nav__content">
                <a 
                    href={`/study/${currentId - 1}`}
                    className={`button button--secondary nav__button ${!hasPrevious ? 'button--disabled' : ''}`}
                    style={!hasPrevious ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    ← Previous
                </a>
                
                <div className="nav__mode-info">
                    <div className="nav__current">Study Mode</div>
                    <div className="nav__progress">Tercet {currentId} of {totalTercets}</div>
                </div>
                
                <a 
                    href={`/study/${currentId + 1}`}
                    className={`button button--secondary nav__button ${!hasNext ? 'button--disabled' : ''}`}
                    style={!hasNext ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    Next →
                </a>
            </div>
            
            <div className="nav__mode-switcher">
                <a href={`/tercet/${currentId}`} className="button button--ghost">
                    Switch to Reading Mode
                </a>
                <a href="/index" className="button button--ghost">
                    Browse All Tercets
                </a>
            </div>
        </nav>
    )
}
```

Add the corresponding CSS:

```css
.nav__mode-info {
  text-align: center;
}

.nav__current {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-1);
}

.nav__progress {
  font-size: var(--text-sm);
  color: var(--color-secondary);
}

.nav__mode-switcher {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .nav__mode-switcher {
    flex-direction: column;
    align-items: center;
  }
}
```

## Understanding htmx Attributes

Let's examine the htmx attributes we've used and understand what each one does:

### Core Interaction Attributes

**`hx-get`**: Specifies that clicking this element should send a GET request to the given URL.
```html
<button hx-get="/api/tercet/1/translation">Reveal Translation</button>
```

**`hx-target`**: Specifies which element should receive the response HTML.
```html
<button hx-get="/api/data" hx-target="#results">Load Data</button>
<div id="results">Results will appear here</div>
```

**`hx-swap`**: Specifies how the response should be inserted relative to the target.
- `innerHTML` (default): Replace the target's content
- `outerHTML`: Replace the target element entirely
- `beforebegin`: Insert before the target element
- `afterbegin`: Insert as the first child of the target
- `beforeend`: Insert as the last child of the target
- `afterend`: Insert after the target element

### Making It Feel Responsive

One of the challenges with any web application is managing the time between user actions and server responses. htmx provides several attributes to make these interactions feel smooth and responsive.

Let's enhance our study mode with better loading states and user feedback:

```typescript
function StudyContent({ tercet }: { tercet: Tercet }) {
    return (
        <div className="study-content">
            {/* Italian text */}
            <div className="tercet-lines" id="italian-text">
                {tercet.lines.map((line, index) => (
                    <p key={index} className="tercet-line">{line}</p>
                ))}
            </div>
            
            {/* Enhanced controls with loading indicators */}
            <div className="study-controls">
                <button 
                    className="button button--primary"
                    hx-get={`/api/tercet/${tercet.id}/translation`}
                    hx-target="#translation-area"
                    hx-swap="innerHTML"
                    hx-indicator="#loading-spinner"
                >
                    <span className="button-text">Reveal Translation</span>
                    <span className="button-spinner htmx-indicator" id="loading-spinner">
                        ⟳
                    </span>
                </button>
                
                <button 
                    className="button button--secondary"
                    hx-get={`/api/tercet/${tercet.id}/hidden-translation`}
                    hx-target="#translation-area"
                    hx-swap="innerHTML"
                >
                    Hide Translation
                </button>
            </div>
            
            {/* Enhanced content area with better feedback */}
            <div 
                id="translation-area" 
                className="translation-area"
                hx-indicator=".translation-area"
            >
                <p className="placeholder-text">Translation will appear here when revealed.</p>
            </div>
        </div>
    )
}
```

Add CSS for the loading states:

```css
/* Loading indicator styles */
.button {
  position: relative;
  overflow: hidden;
}

.button-spinner {
  display: none;
  margin-left: var(--space-2);
  animation: spin 1s linear infinite;
}

.htmx-request .button-spinner {
  display: inline;
}

.htmx-request .button-text {
  opacity: 0.7;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Global loading indicator */
.htmx-indicator {
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.htmx-request .htmx-indicator {
  opacity: 1;
}

.htmx-request.htmx-indicator {
  opacity: 1;
}
```

## Building a Memory Training Interface

Now let's create a more sophisticated interface that supports actual memorization practice. This will hide the Italian text initially and allow users to try recalling it before revealing the answer.

Add these new components to `src/components.tsx`:

```typescript
// ===== MEMORY TRAINING COMPONENTS =====

export function MemoryTrainingDisplay({ tercet }: { tercet: Tercet }) {
    return (
        <article className="memory-display">
            <MemoryHeader tercet={tercet} />
            <MemoryContent tercet={tercet} />
        </article>
    )
}

function MemoryHeader({ tercet }: { tercet: Tercet }) {
    return (
        <header className="memory-header">
            <div className="tercet-meta">
                <span>{tercet.canticle}</span>
                <div className="tercet-meta__separator"></div>
                <span>Canto {tercet.canto}</span>
                <div className="tercet-meta__separator"></div>
                <span>Tercet {tercet.tercetNumber}</span>
            </div>
            <h2 className="memory-title">Memory Training</h2>
            <p className="memory-instructions">
                Read the translation, then try to recall the Italian text from memory.
            </p>
        </header>
    )
}

function MemoryContent({ tercet }: { tercet: Tercet }) {
    return (
        <div className="memory-content">
            {/* Always visible: English translation */}
            <div className="memory-prompt">
                <h3 className="prompt-title">Your Task:</h3>
                <div className="tercet-translation">
                    <p className="translation-text">{tercet.translation}</p>
                    <p className="translator">—{tercet.translator}</p>
                </div>
            </div>
            
            {/* User input area */}
            <div className="memory-input-section">
                <label htmlFor="user-attempt" className="memory-label">
                    Enter the Italian text from memory:
                </label>
                <textarea 
                    id="user-attempt"
                    className="memory-textarea"
                    placeholder="Type your attempt here..."
                    rows={4}
                ></textarea>
            </div>
            
            {/* Interactive controls */}
            <div className="memory-controls">
                <button 
                    className="button button--primary"
                    hx-get={`/api/tercet/${tercet.id}/check-answer`}
                    hx-target="#answer-area"
                    hx-swap="innerHTML"
                    hx-include="#user-attempt"
                >
                    Check My Answer
                </button>
                
                <button 
                    className="button button--secondary"
                    hx-get={`/api/tercet/${tercet.id}/reveal-answer`}
                    hx-target="#answer-area"
                    hx-swap="innerHTML"
                >
                    Show Answer
                </button>
                
                <button 
                    className="button button--ghost"
                    hx-get={`/api/tercet/${tercet.id}/reset-memory`}
                    hx-target="#answer-area"
                    hx-swap="innerHTML"
                    onclick="document.getElementById('user-attempt').value = ''"
                >
                    Try Again
                </button>
            </div>
            
            {/* Dynamic answer area */}
            <div id="answer-area" className="answer-area">
                <p className="placeholder-text">Your results will appear here after checking your answer.</p>
            </div>
        </div>
    )
}

// Component for showing the correct answer
export function AnswerReveal({ tercet }: { tercet: Tercet }) {
    return (
        <div className="answer-reveal">
            <h3 className="answer-title">Correct Answer:</h3>
            <div className="tercet-lines">
                {tercet.lines.map((line, index) => (
                    <p key={index} className="tercet-line">{line}</p>
                ))}
            </div>
        </div>
    )
}

// Component for checking user's answer (simplified version)
export function AnswerCheck({ 
    tercet, 
    userAttempt 
}: { 
    tercet: Tercet
    userAttempt: string 
}) {
    // Simple comparison - in a real app, this would be more sophisticated
    const correctText = tercet.lines.join(' ').toLowerCase().replace(/[^\w\s]/g, '')
    const userText = userAttempt.toLowerCase().replace(/[^\w\s]/g, '')
    const similarity = calculateSimilarity(correctText, userText)
    
    return (
        <div className="answer-check">
            <div className={`score-display score-${getScoreCategory(similarity)}`}>
                <div className="score-number">{Math.round(similarity * 100)}%</div>
                <div className="score-label">Accuracy</div>
            </div>
            
            <div className="feedback">
                <h3 className="feedback-title">
                    {similarity > 0.9 ? "Excellent!" : 
                     similarity > 0.7 ? "Good work!" : 
                     similarity > 0.5 ? "Keep practicing!" : 
                     "Try again!"}
                </h3>
                
                {similarity < 1 && (
                    <details className="answer-comparison">
                        <summary>See the correct answer</summary>
                        <div className="correct-answer">
                            {tercet.lines.map((line, index) => (
                                <p key={index} className="tercet-line">{line}</p>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        </div>
    )
}

export function MemoryReset() {
    return (
        <p className="placeholder-text">
            Ready for another attempt! Enter your answer and click "Check My Answer".
        </p>
    )
}
```

Add the supporting utility functions at the end of `src/components.tsx`:

```typescript
// ===== UTILITY FUNCTIONS =====

function calculateSimilarity(text1: string, text2: string): number {
    // Simple word-based similarity calculation
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)
    
    if (words1.length === 0 && words2.length === 0) return 1
    if (words1.length === 0 || words2.length === 0) return 0
    
    const maxLength = Math.max(words1.length, words2.length)
    let matches = 0
    
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
        if (words1[i] === words2[i]) {
            matches++
        }
    }
    
    return matches / maxLength
}

function getScoreCategory(similarity: number): string {
    if (similarity > 0.9) return 'excellent'
    if (similarity > 0.7) return 'good'
    if (similarity > 0.5) return 'fair'
    return 'poor'
}
```

Add the CSS for memory training:

```css
/* ===== MEMORY TRAINING STYLES ===== */

.memory-display {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.memory-header {
  background: linear-gradient(135deg, #7b1fa2, #9c27b0);
  color: white;
  padding: var(--space-6);
  text-align: center;
}

.memory-title {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  font-weight: 400;
  margin: var(--space-2) 0;
}

.memory-instructions {
  font-size: var(--text-base);
  opacity: 0.9;
  margin: 0;
  font-style: italic;
}

.memory-content {
  padding: var(--space-8);
}

.memory-prompt {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.prompt-title {
  font-size: var(--text-lg);
  color: var(--color-accent);
  margin: 0 0 var(--space-4) 0;
  font-weight: 600;
}

.memory-input-section {
  margin: var(--space-6) 0;
}

.memory-label {
  display: block;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-3);
}

.memory-textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  transition: border-color var(--transition-fast);
}

.memory-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.memory-controls {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin: var(--space-6) 0;
  flex-wrap: wrap;
}

.answer-area {
  min-height: 150px;
  padding: var(--space-6);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-top: var(--space-6);
}

/* Answer checking styles */
.answer-check {
  text-align: center;
}

.score-display {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-md);
}

.score-excellent { background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; }
.score-good { background: linear-gradient(135deg, #2196f3, #42a5f5); color: white; }
.score-fair { background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; }
.score-poor { background: linear-gradient(135deg, #f44336, #ef5350); color: white; }

.score-number {
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1;
}

.score-label {
  font-size: var(--text-sm);
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feedback-title {
  color: var(--color-accent);
  margin: 0 0 var(--space-4) 0;
}

.answer-comparison {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-top: var(--space-4);
  text-align: left;
}

.answer-comparison summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-accent);
  padding: var(--space-2);
}

.answer-comparison summary:hover {
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
}

.correct-answer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .memory-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .memory-controls .button {
    width: 100%;
    max-width: 280px;
  }
  
  .score-display {
    width: 100px;
    height: 100px;
  }
  
  .score-number {
    font-size: var(--text-2xl);
  }
}
```

Now add the server endpoints for memory training in `src/index.tsx`:

```typescript
// Memory training endpoints
app.get('/api/tercet/:id/check-answer', async (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html('<p class="error-text">Tercet not found.</p>', 404)
    }
    
    // Get user's attempt from form data
    const formData = await c.req.formData()
    const userAttempt = formData.get('user-attempt') as string || ''
    
    return c.html(<AnswerCheck tercet={tercet} userAttempt={userAttempt} />)
})

app.get('/api/tercet/:id/reveal-answer', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html('<p class="error-text">Tercet not found.</p>', 404)
    }
    
    return c.html(<AnswerReveal tercet={tercet} />)
})

app.get('/api/tercet/:id/reset-memory', (c) => {
    return c.html(<MemoryReset />)
})

// Memory training route
app.get('/memory/:id', (c) => {
    const idParam = c.req.param('id')
    const id = parseInt(idParam)
    
    if (isNaN(id) || id < 1) {
        return c.html(
            <ErrorPage 
                error="Please provide a valid tercet number." 
                statusCode={400} 
            />, 
            400
        )
    }
    
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html(
            <ErrorPage 
                error="The requested tercet was not found." 
                statusCode={404} 
            />, 
            404
        )
    }
    
    return c.html(
        <Layout title={`Memory Training: ${tercet.canticle} - Canto ${tercet.canto}, Tercet ${tercet.tercetNumber}`}>
            <div className="stack">
                <MemoryNavigation currentId={id} totalTercets={sampleTercets.length} />
                <MemoryTrainingDisplay tercet={tercet} />
            </div>
        </Layout>
    )
})
```

Create the memory navigation component in `src/components.tsx`:

```typescript
export function MemoryNavigation({ 
    currentId, 
    totalTercets 
}: { 
    currentId: number
    totalTercets: number 
}) {
    const hasPrevious = currentId > 1
    const hasNext = currentId < totalTercets
    
    return (
        <nav className="nav">
            <div className="nav__content">
                <a 
                    href={`/memory/${currentId - 1}`}
                    className={`button button--secondary nav__button ${!hasPrevious ? 'button--disabled' : ''}`}
                    style={!hasPrevious ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    ← Previous
                </a>
                
                <div className="nav__mode-info">
                    <div className="nav__current">Memory Training</div>
                    <div className="nav__progress">Tercet {currentId} of {totalTercets}</div>
                </div>
                
                <a 
                    href={`/memory/${currentId + 1}`}
                    className={`button button--secondary nav__button ${!hasNext ? 'button--disabled' : ''}`}
                    style={!hasNext ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    Next →
                </a>
            </div>
            
            <div className="nav__mode-switcher">
                <a href={`/study/${currentId}`} className="button button--ghost">
                    Study Mode
                </a>
                <a href={`/tercet/${currentId}`} className="button button--ghost">
                    Reading Mode
                </a>
                <a href="/index" className="button button--ghost">
                    Browse All
                </a>
            </div>
        </nav>
    )
}
```

## Creating a Mode Switcher

Let's add easy ways for users to switch between the different modes. Update your existing navigation components to include mode switching. Add this to the regular `TercetNavigation` component:

```typescript
export function TercetNavigation({ 
    currentId, 
    totalTercets 
}: { 
    currentId: number
    totalTercets: number 
}) {
    const hasPrevious = currentId > 1
    const hasNext = currentId < totalTercets
    
    return (
        <nav className="nav">
            <div className="nav__content">
                <a 
                    href={`/tercet/${currentId - 1}`}
                    className={`button button--secondary nav__button ${!hasPrevious ? 'button--disabled' : ''}`}
                    style={!hasPrevious ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    ← Previous
                </a>
                
                <div className="nav__mode-info">
                    <div className="nav__current">Reading Mode</div>
                    <div className="nav__progress">Tercet {currentId} of {totalTercets}</div>
                </div>
                
                <a 
                    href={`/tercet/${currentId + 1}`}
                    className={`button button--secondary nav__button ${!hasNext ? 'button--disabled' : ''}`}
                    style={!hasNext ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    Next →
                </a>
            </div>
            
            <div className="nav__mode-switcher">
                <a href={`/study/${currentId}`} className="button button--ghost">
                    Study Mode
                </a>
                <a href={`/memory/${currentId}`} className="button button--ghost">
                    Memory Training
                </a>
                <a href="/index" className="button button--ghost">
                    Browse All
                </a>
            </div>
        </nav>
    )
}
```

## Testing Your htmx Implementation

Start your server with `bun dev` and test your new features:

1. Visit `http://localhost:3000/study/1` for the study mode
2. Visit `http://localhost:3000/memory/1` for memory training
3. Visit `http://localhost:3000/tercet/1` for regular reading mode

Notice how:
- Clicking "Reveal Translation" updates only the translation area
- The page never refreshes completely
- Loading states provide immediate feedback
- The memory training checks your answers dynamically

## Understanding htmx's Power

What we've built demonstrates several key principles of htmx:

### Hypermedia as the Engine of Application State (HATEOAS)

Each response from the server contains not just data, but the interface elements needed for the next user actions. This is a fundamental principle of REST architecture that most modern frameworks ignore, but htmx embraces.

### Progressive Enhancement

Our application works at multiple levels:
- Basic HTML navigation (if JavaScript is disabled)
- Enhanced interactions with htmx
- Additional polish with CSS transitions and animations

### Locality of Behavior

The htmx attributes are placed directly on the elements that trigger the behavior. This makes the code easier to understand and maintain—you can see what a button does by looking at the button itself, not searching through separate JavaScript files.

## Dante Deep Dive: Interactive Reading and Memory

Our implementation reflects centuries of pedagogical thinking about how students learn classical texts.

### The Tradition of Progressive Disclosure

Medieval education used a method called *lectio divina* (divine reading) that involved multiple passes through the same text with increasing depth. Our study mode mirrors this: first encounter the text, then reveal meaning, then test comprehension.

The memory training mode reflects the classical tradition of memorization that was central to medieval education. Students were expected to memorize vast amounts of text, not just for rote recall, but because having texts "by heart" enabled deeper contemplation and analysis.

### Digital Enhancement of Ancient Methods

Our interactive features enhance rather than replace traditional study methods:

**Immediate Feedback**: The answer checking provides instant feedback that a medieval tutor might give
**Flexible Pacing**: Students can reveal translations when ready, not when the class schedule dictates
**Repetition Support**: Easy navigation between tercets enables the repetitive practice that builds memory
**Multiple Modalities**: Reading, studying, and memorizing modes serve different learning styles and goals

### The Memorization Imperative

Why does memorization matter for literary study? When you know a text by heart, it becomes available for contemplation at any moment. Walking, waiting, or drifting off to sleep, the memorized lines can surface and reveal new meanings.

Dante himself was deeply influenced by texts he had memorized—Virgil's *Aeneid*, the Bible, works of philosophy and theology. His own poem is woven through with half-remembered lines and transformed quotations. By memorizing Dante, modern students participate in this same tradition of internalized literary knowledge.

## Exercises and Reflection

### Technical Exercises

1. **Enhance the Similarity Algorithm**: The current answer checking is quite simple. Research and implement better text comparison algorithms:
   - Account for different word orders
   - Handle synonyms and alternate translations
   - Provide specific feedback about which words are correct/incorrect

2. **Add More Interactive Modes**: Create additional study modes:
   - Fill-in-the-blank exercises for key words
   - Audio playback for pronunciation practice
   - Timed recall challenges

3. **Implement User Preferences**: Use htmx to create a settings panel that lets users:
   - Choose different translators
   - Adjust text size and spacing
   - Select preferred study modes

### Reflection Questions

1. **Learning Modalities**: How do different interactive modes serve different learning styles? Which mode do you find most effective for your own memorization?

2. **Technology and Tradition**: How does interactive software compare to traditional memorization methods? What are the advantages and limitations of each approach?

3. **Progressive Disclosure**: When studying complex texts, how important is controlling the pace of revelation? How might this apply to other forms of learning?

4. **Hypermedia vs. Applications**: How does the htmx approach of "hypermedia as application state" differ from traditional app architecture? What are the implications for user experience?

### Extended Projects

1. **Spaced Repetition Preview**: Research spaced repetition algorithms and design (but don't implement yet) how your interactive modes could track user progress and schedule review sessions.

2. **Collaborative Features**: Design how multiple users could study together:
   - Shared study sessions
   - Peer reviewing of memorization attempts
   - Discussion threads attached to specific tercets

3. **Accessibility Enhancement**: Research and implement additional accessibility features:
   - Screen reader support for dynamic content
   - High contrast modes
   - Voice input for memorization exercises

## Looking Forward

In our next chapter, we'll expand beyond simple click interactions to handle user input through forms. You'll learn to create search interfaces, user preference panels, and data collection forms that integrate seamlessly with your htmx-powered interface.

We'll also explore more advanced htmx features like:
- Form validation and error handling
- Dependent form fields that update based on user selections
- Auto-complete and suggestion systems
- File upload interfaces

But pause to appreciate what you've built. You now have:

- **Dynamic content updates** without page refreshes
- **Multiple study modes** that serve different learning goals
- **Interactive feedback systems** that respond to user input
- **Smooth, responsive interfaces** that feel like native applications
- **Progressive enhancement** that works for all users

Most importantly, you've experienced the htmx philosophy firsthand: extending HTML to be more expressive rather than replacing it with complex JavaScript frameworks. This approach scales from simple interactions to sophisticated applications while remaining conceptually simple.

Your application now responds to users rather than simply displaying static content. Like Dante's journey through the realms of the afterlife, your users can now actively participate in their own learning journey, choosing their own pace and level of challenge.

In the poet's words: *"O voi che avete li 'ntelletti sani, / mirate la dottrina che s'asconde / sotto 'l velame de li versi strani"*—"O you who have sound intellects, observe the doctrine that is hidden beneath the veil of the strange verses."

You've learned to see the doctrine hidden beneath the veil of HTML attributes. In the next chapter, we'll unveil even more.

---