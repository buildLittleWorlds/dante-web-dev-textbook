---
title: "Your First htmx Magic - Dynamic Content"
description: Introduction to htmx, progressive disclosure, study modes
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

This chapter continues with extensive code examples and explanations about creating memory training interfaces, building annotation systems, and implementing server endpoints that support htmx functionality. The content teaches practical htmx implementation while maintaining the literary context of studying Dante's Divine Comedy.

The chapter concludes with exercises and reflection questions that connect the technical implementation to broader questions about digital humanities, interactive learning, and the relationship between technology and literature.