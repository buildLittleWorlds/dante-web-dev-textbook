# Chapter 3: Making HTML Beautiful with JSX and CSS

*"L'acqua ch'io prendo già mai non si corse; / Minerva spira, e conducemi Apollo, / e nove Muse mi dimostran l'Orse."*

*The water I am entering has never been sailed; Minerva breathes, and Apollo guides me, and nine Muses point out to me the Bears.*

As Dante ventures into uncharted waters at the beginning of *Paradiso*, he acknowledges the need for divine inspiration to accomplish something unprecedented. Similarly, as we move from functional but plain web pages to beautiful, engaging interfaces, we need the inspiration of good design principles and the technical skill to implement them.

This chapter transforms your application from a working prototype into a polished digital experience worthy of Dante's masterpiece. You'll learn advanced CSS techniques, responsive design principles, and how to create reusable JSX components that make your code as elegant as your interface.

## Learning Objectives

By the end of this chapter, you will:

- Master advanced CSS techniques including Grid, Flexbox, and CSS custom properties
- Create responsive designs that work beautifully on all devices
- Build reusable JSX components following modern React patterns
- Implement sophisticated typography and visual hierarchy
- Understand the principles of user experience (UX) design
- Apply these skills to create an interface worthy of great literature

## The Art and Science of Interface Design

Before diving into code, let's establish the principles that will guide our design decisions. Creating interfaces for literary content requires balancing several considerations:

### Respect for the Text

Your interface should honor the dignity and importance of Dante's work. This means:

- **Typography** that echoes the tradition of fine book design
- **Spacing** that gives the text room to breathe and be contemplated
- **Color palettes** that feel timeless rather than trendy
- **Interactions** that feel deliberate and meaningful, not flashy or distracting

### Modern Usability

While respecting tradition, your interface must work for contemporary users:

- **Responsive design** that adapts to phones, tablets, and desktops
- **Fast loading** that doesn't test users' patience
- **Intuitive navigation** that doesn't require explanation
- **Accessibility** features that welcome all users

### Scholarly Functionality

Your design must support serious study:

- **Clear information hierarchy** that separates text from apparatus
- **Consistent patterns** that users can learn and rely on
- **Flexible layouts** that accommodate different kinds of content
- **Progress indicators** that help users track their learning journey

## Advanced CSS: Building a Design System

Let's begin by creating a comprehensive design system using CSS custom properties (also called CSS variables). This approach ensures consistency across your application and makes it easy to modify the design later.

Replace your existing `styles.css` with this enhanced version:

```css
/* ===== DESIGN SYSTEM ===== */

/* Typography Scale - Based on classical proportions */
:root {
  /* Colors - Inspired by medieval manuscripts */
  --color-primary: #2c1810;        /* Dark brown for primary text */
  --color-secondary: #5d4037;      /* Medium brown for secondary text */
  --color-accent: #8b4513;         /* Warm brown for accents */
  --color-accent-light: #a0522d;   /* Lighter accent for hovers */
  --color-background: #faf8f3;     /* Warm off-white background */
  --color-surface: #ffffff;        /* Pure white for cards */
  --color-surface-alt: #f5f3ee;    /* Slightly tinted alternative */
  --color-border: #e8e3db;         /* Subtle borders */
  --color-border-accent: #d7ccc8;  /* More prominent borders */
  --color-error: #c62828;          /* Error states */
  --color-success: #2e7d32;        /* Success states */
  --color-warning: #f57c00;        /* Warning states */
  
  /* Typography */
  --font-primary: 'Crimson Text', 'Times New Roman', serif;
  --font-secondary: 'Cormorant Garamond', 'Garamond', serif;
  --font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
  
  /* Font sizes using modular scale */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  
  /* Spacing using 8px grid */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  
  /* Layout */
  --max-width-prose: 65ch;    /* Optimal reading width */
  --max-width-wide: 80rem;    /* Wide container */
  --max-width-full: 100vw;    /* Full width */
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
  --transition-slow: 400ms ease-out;
  
  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #f5f3ee;
    --color-secondary: #d7ccc8;
    --color-accent: #a0522d;
    --color-accent-light: #8b4513;
    --color-background: #1a1611;
    --color-surface: #252017;
    --color-surface-alt: #2a241b;
    --color-border: #3d352a;
    --color-border-accent: #4a3f32;
  }
}

/* ===== BASE STYLES ===== */

/* Load fonts */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  line-height: 1.6;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-primary);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== TYPOGRAPHY ===== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-secondary);
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 var(--space-4) 0;
  color: var(--color-primary);
}

h1 { font-size: var(--text-4xl); font-weight: 300; }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); font-weight: 600; }

p {
  margin: 0 0 var(--space-4) 0;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-accent-light);
  text-decoration: underline;
}

/* ===== LAYOUT COMPONENTS ===== */

.container {
  width: 100%;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container--prose {
  max-width: var(--max-width-prose);
}

.stack {
  display: flex;
  flex-direction: column;
}

.stack > * + * {
  margin-top: var(--space-4);
}

.stack--sm > * + * { margin-top: var(--space-2); }
.stack--lg > * + * { margin-top: var(--space-8); }

.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.cluster--sm { gap: var(--space-2); }
.cluster--lg { gap: var(--space-8); }

.grid {
  display: grid;
  gap: var(--space-4);
}

.grid--2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid--3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }

/* ===== COMPONENT STYLES ===== */

/* Cards */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card__content {
  padding: var(--space-6);
}

.card__content--sm { padding: var(--space-4); }
```css
.card__content--lg { padding: var(--space-8); }

/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.button--primary {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.button--primary:hover {
  background: var(--color-accent-light);
  border-color: var(--color-accent-light);
  color: white;
  text-decoration: none;
}

.button--secondary {
  background: transparent;
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.button--secondary:hover {
  background: var(--color-accent);
  color: white;
  text-decoration: none;
}

.button--ghost {
  background: transparent;
  color: var(--color-secondary);
  border-color: transparent;
}

.button--ghost:hover {
  background: var(--color-surface-alt);
  color: var(--color-primary);
  text-decoration: none;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Forms */
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--color-primary);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.label {
  display: block;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

/* ===== APPLICATION-SPECIFIC STYLES ===== */

/* Site header */
.site-header {
  text-align: center;
  padding: var(--space-12) 0 var(--space-8) 0;
  border-bottom: 2px solid var(--color-border-accent);
  margin-bottom: var(--space-8);
}

.site-title {
  font-family: var(--font-secondary);
  font-size: var(--text-5xl);
  font-weight: 300;
  margin: 0 0 var(--space-2) 0;
  color: var(--color-accent);
  letter-spacing: 1px;
}

.site-subtitle {
  font-size: var(--text-xl);
  color: var(--color-secondary);
  margin: 0;
  font-style: italic;
}

/* Navigation */
.nav {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  margin: var(--space-6) 0;
}

.nav__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.nav__current {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--text-lg);
}

.nav__button {
  min-width: 120px;
}

/* Tercet display */
.tercet-display {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.tercet-header {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
  color: white;
  padding: var(--space-6);
  text-align: center;
}

.tercet-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.tercet-meta__separator {
  width: 2px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1px;
}

.tercet-title {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  font-weight: 400;
  margin: 0;
}

.tercet-content {
  padding: var(--space-8);
}

.tercet-lines {
  text-align: center;
  margin-bottom: var(--space-8);
}

.tercet-line {
  font-size: var(--text-xl);
  line-height: 1.8;
  margin: var(--space-2) 0;
  font-style: italic;
  color: var(--color-primary);
}

.tercet-translation {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.translation-text {
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--space-3);
}

.translator {
  text-align: right;
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-style: italic;
  font-weight: 600;
}

/* Index styles */
.canto-index {
  display: grid;
  gap: var(--space-6);
}

.canto-group {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-normal);
}

.canto-group:hover {
  box-shadow: var(--shadow-md);
}

.canto-group__header {
  background: var(--color-surface-alt);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-6);
}

.canto-group__title {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  color: var(--color-accent);
  margin: 0;
}

.canto-group__content {
  padding: var(--space-4);
}

.tercet-list {
  display: grid;
  gap: var(--space-2);
}

.tercet-link {
  display: block;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.tercet-link:hover {
  background: var(--color-surface-alt);
  border-color: var(--color-accent);
  color: inherit;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.tercet-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.tercet-number {
  font-weight: 600;
  color: var(--color-accent);
  font-size: var(--text-sm);
  min-width: 80px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.first-line {
  font-style: italic;
  color: var(--color-primary);
  flex: 1;
  font-size: var(--text-base);
}

/* Error styles */
.error-display {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.error-display h2 {
  color: var(--color-error);
  margin-bottom: var(--space-4);
}

.error-display p {
  color: var(--color-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.error-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Mobile-first responsive breakpoints */
@media (max-width: 640px) {
  .container {
    padding: 0 var(--space-3);
  }
  
  .site-title {
    font-size: var(--text-3xl);
  }
  
  .site-subtitle {
    font-size: var(--text-lg);
  }
  
  .nav__content {
    flex-direction: column;
    gap: var(--space-3);
    text-align: center;
  }
  
  .tercet-meta {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .tercet-meta__separator {
    width: 12px;
    height: 2px;
  }
  
  .tercet-line {
    font-size: var(--text-lg);
  }
  
  .tercet-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .tercet-content {
    padding: var(--space-6) var(--space-4);
  }
  
  .tercet-header {
    padding: var(--space-5) var(--space-4);
  }
}

/* Print styles */
@media print {
  body {
    background: white;
    color: black;
  }
  
  .nav,
  .error-actions {
    display: none;
  }
  
  .tercet-display,
  .card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .tercet-header {
    background: #f5f5f5 !important;
    color: black !important;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border: #666;
    --color-border-accent: #333;
  }
  
  .button--primary {
    border-width: 2px;
  }
  
  .tercet-link:hover {
    border-width: 2px;
  }
}
```

## Creating Reusable JSX Components

Now let's refactor our server code to use proper component architecture. This will make our code more maintainable and our interfaces more consistent.

Create a new file `src/components.tsx`:

```typescript
// ===== TYPE DEFINITIONS =====

export type Tercet = {
    id: number
    canticle: 'Inferno' | 'Purgatorio' | 'Paradiso'
    canto: number
    tercetNumber: number
    lines: [string, string, string]
    translation: string
    translator: string
}

// ===== BASE LAYOUT COMPONENTS =====

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

export function SiteHeader() {
    return (
        <header className="site-header">
            <h1 className="site-title">La Divina Commedia</h1>
            <p className="site-subtitle">A Digital Memorization Journey</p>
        </header>
    )
}

// ===== NAVIGATION COMPONENTS =====

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
                
                <div className="nav__current">
                    Tercet {currentId} of {totalTercets}
                </div>
                
                <a 
                    href={`/tercet/${currentId + 1}`}
                    className={`button button--secondary nav__button ${!hasNext ? 'button--disabled' : ''}`}
                    style={!hasNext ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                    Next →
                </a>
            </div>
        </nav>
    )
}

// ===== TERCET DISPLAY COMPONENTS =====

export function TercetDisplay({ tercet }: { tercet: Tercet }) {
    return (
        <article className="tercet-display">
            <TercetHeader tercet={tercet} />
            <TercetContent tercet={tercet} />
        </article>
    )
}

function TercetHeader({ tercet }: { tercet: Tercet }) {
    return (
        <header className="tercet-header">
            <div className="tercet-meta">
                <span>{tercet.canticle}</span>
                <div className="tercet-meta__separator"></div>
                <span>Canto {tercet.canto}</span>
                <div className="tercet-meta__separator"></div>
                <span>Tercet {tercet.tercetNumber}</span>
            </div>
            <h2 className="tercet-title">
                {getCantoTitle(tercet.canticle, tercet.canto)}
            </h2>
        </header>
    )
}

function TercetContent({ tercet }: { tercet: Tercet }) {
    return (
        <div className="tercet-content">
            <div className="tercet-lines">
                {tercet.lines.map((line, index) => (
                    <p key={index} className="tercet-line">{line}</p>
                ))}
            </div>
            
            <div className="tercet-translation">
                <p className="translation-text">{tercet.translation}</p>
                <p className="translator">—{tercet.translator}</p>
            </div>
        </div>
    )
}

// ===== INDEX COMPONENTS =====

export function CantoIndex({ tercets }: { tercets: Tercet[] }) {
    const groupedTercets = groupTercetsByCanticleAndCanto(tercets)
    
    return (
        <Layout title="Canto Index" className="container--wide">
            <div className="stack stack--lg">
                <div className="canto-index">
                    {Object.values(groupedTercets).map((group, index) => (
                        <CantoGroup key={index} group={group} />
                    ))}
                </div>
                
                <div className="cluster" style={{ justifyContent: 'center', marginTop: 'var(--space-12)' }}>
                    <a href="/" className="button button--primary">
                        Return Home
                    </a>
                    <a href="/random" className="button button--secondary">
                        Random Tercet
                    </a>
                </div>
            </div>
        </Layout>
    )
}

function CantoGroup({ 
    group 
}: { 
    group: { canticle: string, canto: number, tercets: Tercet[] } 
}) {
    return (
        <section className="canto-group">
            <header className="canto-group__header">
                <h2 className="canto-group__title">
                    {getCantoTitle(group.canticle, group.canto)}
                </h2>
            </header>
            
            <div className="canto-group__content">
                <div className="tercet-list">
                    {group.tercets.map(tercet => (
                        <TercetLink key={tercet.id} tercet={tercet} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function TercetLink({ tercet }: { tercet: Tercet }) {
    return (
        <a href={`/tercet/${tercet.id}`} className="tercet-link">
            <div className="tercet-preview">
                <span className="tercet-number">
                    Tercet {tercet.tercetNumber}
                </span>
                <span className="first-line">
                    {tercet.lines[0]}
                </span>
            </div>
        </a>
    )
}

// ===== ERROR COMPONENTS =====

export function ErrorPage({ 
    error, 
    statusCode 
}: { 
    error: string
    statusCode: number 
}) {
    const errorMessages = {
        400: "The request was malformed or invalid.",
        404: "The requested resource could not be found.",
        500: "An internal server error occurred."
    }
    
    const defaultMessage = errorMessages[statusCode as keyof typeof errorMessages] || "An unexpected error occurred."
    
    return (
        <Layout title={`Error ${statusCode}`}>
            <div className="error-display">
                <h2>Error {statusCode}</h2>
                <p>{error || defaultMessage}</p>
                <div className="error-actions">
                    <a href="/" className="button button--primary">
                        Return Home
                    </a>
                    <a href="/index" className="button button--secondary">
                        Browse Cantos
                    </a>
                </div>
            </div>
        </Layout>
    )
}

// ===== UTILITY FUNCTIONS =====

function getCantoTitle(canticle: string, canto: number): string {
    const romanNumerals = [
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
        'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
        'XXXI', 'XXXII', 'XXXIII', 'XXXIV'
    ]
    
    return `${canticle} - Canto ${romanNumerals[canto] || canto}`
}

function groupTercetsByCanticleAndCanto(tercets: Tercet[]) {
    return tercets.reduce((acc, tercet) => {
        const key = `${tercet.canticle}-${tercet.canto}`
        if (!acc[key]) {
            acc[key] = {
                canticle: tercet.canticle,
                canto: tercet.canto,
                tercets: []
            }
        }
        acc[key].tercets.push(tercet)
        return acc
    }, {} as Record<string, { canticle: string, canto: number, tercets: Tercet[] }>)
}
```

## Updating the Server with New Components

Now let's update your server to use these new components. Replace `src/index.tsx` with:

```typescript
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { 
    Layout, 
    TercetDisplay, 
    TercetNavigation, 
    CantoIndex, 
    ErrorPage,
    type Tercet 
} from './components'

// Expanded sample data
const sampleTercets: Tercet[] = [
    {
        id: 1,
        canticle: 'Inferno',
        canto: 1,
        tercetNumber: 1,
        lines: [
            "Nel mezzo del cammin di nostra vita",
            "mi ritrovai per una selva oscura,",
            "ché la diritta via era smarrita."
        ],
        translation: "In the middle of the journey of our life, I found myself in a dark wood, where the straight way was lost.",
        translator: "Charles S. Singleton"
    },
    {
        id: 2,
        canticle: 'Inferno',
        canto: 1,
        tercetNumber: 2,
        lines: [
            "Ahi quanto a dir qual era è cosa dura",
            "esta selva selvaggia e aspra e forte",
            "che nel pensier rinova la paura!"
        ],
        translation: "Ah, how hard it is to tell what that wood was, wild, rough, and dense with fear, the very thought of it renews my terror!",
        translator: "Charles S. Singleton"
    },
    {
        id: 3,
        canticle: 'Inferno',
        canto: 1,
        tercetNumber: 3,
        lines: [
            "Tant' è amara che poco è più morte;",
            "ma per trattar del ben ch'i' vi trovai,",
            "dirò de l'altre cose ch'i' v'ho scorte."
        ],
        translation: "So bitter is it, death is little worse; but to treat of the good that I found there, I will tell of the other things I saw as well.",
        translator: "Charles S. Singleton"
    },
    {
        id: 4,
        canticle: 'Inferno',
        canto: 1,
        tercetNumber: 4,
        lines: [
            "Io non so ben ridir com' i' v'intrai,",
            "tant' era pien di sonno a quel punto",
            "che la verace via abbandonai."
        ],
        translation: "I cannot well remember how I entered, so full of sleep was I at that moment when I abandoned the true way.",
        translator: "Charles S. Singleton"
    },
    {
        id: 5,
        canticle: 'Purgatorio',
        canto: 1,
        tercetNumber: 1,
        lines: [
            "Per correr miglior acque alza le vele",
            "omai la navicella del mio ingegno,",
            "che lascia dietro a sé mar sì crudele;"
        ],
        translation: "To course over better waters the little bark of my genius now hoists her sails, leaving behind her so cruel a sea.",
        translator: "Charles S. Singleton"
    },
    {
        id: 6,
        canticle: 'Paradiso',
        canto: 1,
        tercetNumber: 1,
        lines: [
            "La gloria di colui che tutto move",
            "per l'universo penetra, e risplende",
            "in una parte più e meno altrove."
        ],
        translation: "The glory of Him who moves all things penetrates through the universe and shines in one part more and in another less.",
        translator: "Charles S. Singleton"
    }
]

const app = new Hono()

// Serve static files
app.use('/*', serveStatic({ root: './public' }))

// Home route - redirect to first tercet
app.get('/', (c) => {
    return c.redirect('/tercet/1')
})

// API routes
app.get('/api/tercets', (c) => {
    return c.json(sampleTercets)
})

app.get('/api/tercets/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.json({ error: 'Tercet not found' }, 404)
    }
    
    return c.json(tercet)
})

// Tercet display route
app.get('/tercet/:id', (c) => {
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
                error="The requested tercet was not found. Please check the tercet number and try again." 
                statusCode={404} 
            />, 
            404
        )
    }
    
    return c.html(
        <Layout title={`${tercet.canticle} - Canto ${tercet.canto}, Tercet ${tercet.tercetNumber}`}>
            <div className="stack">
                <TercetNavigation currentId={id} totalTercets={sampleTercets.length} />
                <TercetDisplay tercet={tercet} />
            </div>
        </Layout>
    )
})

// Canto index route
app.get('/index', (c) => {
    return c.html(<CantoIndex tercets={sampleTercets} />)
})

// Random tercet route
app.get('/random', (c) => {
    const randomId = Math.floor(Math.random() * sampleTercets.length) + 1
    return c.redirect(`/tercet/${randomId}`)
})

export default app
```

## Adding Interactive Features with Progressive Enhancement

Let's add some subtle interactive features that enhance the user experience without requiring complex JavaScript. Create a new file `public/app.js`:

```javascript
// Progressive enhancement for the Dante memorization app
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        setupKeyboardNavigation();
        setupPreloading();
        setupAccessibility();
        setupPersistence();
    }
    
    // Keyboard navigation for tercets
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Only handle keys when not in an input
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            const currentPath = window.location.pathname;
            const tercetMatch = currentPath.match(/\/tercet\/(\d+)/);
            
            if (!tercetMatch) return;
            
            const currentId = parseInt(tercetMatch[1]);
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'h': // Vim-style navigation
                    e.preventDefault();
                    navigateToTercet(currentId - 1);
                    break;
                case 'ArrowRight':
                case 'l': // Vim-style navigation
                    e.preventDefault();
                    navigateToTercet(currentId + 1);
                    break;
                case 'r':
                    e.preventDefault();
                    window.location.href = '/random';
                    break;
                case 'i':
                    e.preventDefault();
                    window.location.href = '/index';
                    break;
            }
        });
    }
    
    function navigateToTercet(id) {
        if (id >= 1) {
            window.location.href = `/tercet/${id}`;
        }
    }
    
    // Preload adjacent tercets for faster navigation
    function setupPreloading() {
        const currentPath = window.location.pathname;
        const tercetMatch = currentPath.match(/\/tercet\/(\d+)/);
        
        if (!tercetMatch) return;
        
        const currentId = parseInt(tercetMatch[1]);
        
        // Preload previous and next tercets
        preloadPage(`/tercet/${currentId - 1}`);
        preloadPage(`/tercet/${currentId + 1}`);
    }
    
    function preloadPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
    
    // Enhanced accessibility features
    function setupAccessibility() {
        // Add skip links
        addSkipLinks();
        
        // Improve focus management
        manageFocus();
        
        // Add ARIA live regions for dynamic content
        addLiveRegions();
    }
    
    function addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add corresponding IDs
        const main = document.querySelector('main');
        if (main) main.id = 'main-content';
        
        const nav = document.querySelector('.nav');
        if (nav) nav.id = 'navigation';
    }
    
    function manageFocus() {
        // Ensure focus is visible
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    function addLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }
    
    // Persist user preferences
    function setupPersistence() {
        // Save reading position
        const currentPath = window.location.pathname;
        const tercetMatch = currentPath.match(/\/tercet\/(\d+)/);
        
        if (tercetMatch) {
            const currentId = parseInt(tercetMatch[1]);
            localStorage.setItem('dante-last-tercet', currentId.toString());
        }
        
        // Restore reading position on home page
        if (currentPath === '/' && localStorage.getItem('dante-last-tercet')) {
            const lastTercet = localStorage.getItem('dante-last-tercet');
            if (confirm(`Continue reading from tercet ${lastTercet}?`)) {
                window.location.href = `/tercet/${lastTercet}`;
            }
        }
    }
    
    // Announce navigation to screen readers
    function announceNavigation(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    // Export utilities for other scripts
    window.DanteApp = {
        navigateToTercet,
        announceNavigation
    };
})();
```

Add the corresponding CSS for accessibility features to your `styles.css`:

```css
/* ===== ACCESSIBILITY STYLES ===== */

.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--z-modal);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Enhanced focus styles for keyboard navigation */
body.keyboard-navigation *:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Focus within styles for better UX */
.tercet-link:focus-within {
  background: var(--color-surface-alt);
  border-color: var(--color-accent);
}

/* Motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .button {
    border-width: 2px;
  }
  
  .tercet-link {
    border-width: 2px;
  }
  
  .card {
    border-width: 2px;
  }
}
```

Update the `Layout` component to include the JavaScript file:

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

## Dante Deep Dive: Visual Design and Literary Tradition

The design choices we've made reflect centuries of thinking about how to present classical texts to readers.

### Typography and Authority

Our font choices—Crimson Text for body text and Cormorant Garamond for headings—connect to the tradition of scholarly publishing. These fonts echo the typefaces used in prestigious academic presses while remaining highly legible on screens.

The careful attention to line height, letter spacing, and font weights creates what typographers call "texture"—the overall visual impression of a block of text. Good texture invites sustained reading, essential for poetry that rewards slow contemplation.

### Color and Symbolism

Our color palette draws from medieval manuscript traditions:

- **Warm browns** echo the ink and parchment of historical manuscripts
- **Subtle gradients** suggest the illumination techniques used in medieval books
- **Careful contrast ratios** ensure accessibility while maintaining aesthetic harmony

The progression from light backgrounds to darker accents creates visual hierarchy that guides readers through different types of content—from the primary text to scholarly apparatus.

### Layout and Sacred Geometry

Medieval manuscripts often used proportional systems based on mathematical relationships considered divine or natural. Our spacing system, based on multiples of 8 pixels, creates similar harmonic relationships throughout the interface.

The card-based layout echoes the codex form—individual pages bound together—while enabling the non-linear navigation that digital media uniquely provides.

### Progressive Enhancement Philosophy

Our approach to JavaScript reflects a core principle of web design: start with semantic HTML that works everywhere, then layer on enhancements for capable browsers. This ensures that even users with older devices or limited connectivity can access Dante's text.

The keyboard navigation we've added (arrow keys, h/l for vim users, r for random, i for index) creates shortcuts for power users while never preventing basic mouse/touch interaction.

## Exercises and Reflection

### Technical Exercises

1. **Customize the Design System**: Modify the CSS custom properties to create your own visual interpretation:
   - Try a dark theme inspired by medieval illuminated manuscripts
   - Experiment with different font combinations
   - Create a high-contrast mode for accessibility

2. **Build New Components**: Create additional JSX components for:
   - A search interface for finding specific tercets
   - A progress indicator showing reading completion
   - A favorites system for bookmarking tercets

3. **Enhance Interactions**: Add JavaScript features for:
   - Smooth scrolling animations between tercets
   - A reading mode that hides navigation for focused study
   - Auto-save reading position across browser sessions

### Reflection Questions

1. **Design and Interpretation**: How do your visual design choices reflect your interpretation of Dante's work? What would different color schemes or layouts communicate?

2. **Accessibility and Inclusion**: How do accessibility features change who can engage with classical texts? What barriers does thoughtful design remove?

3. **Digital vs. Print**: What aspects of reading poetry are enhanced by digital interfaces? What aspects are diminished? How might we preserve the benefits of both?

4. **Component Architecture**: How does breaking user interfaces into reusable components compare to organizing literary texts into cantos and tercets?

### Extended Projects

1. **Multi-Work Platform**: Extend your component system to support other works of poetry or classical literature. What components would be reusable? What would need to be specific to Dante?

2. **Responsive Reading Experience**: Create different layouts optimized for different contexts:
   - A full-screen reading mode for distraction-free study
   - A mobile-optimized version for reading on commutes
   - A print stylesheet for creating physical study materials

3. **Design System Documentation**: Create a style guide documenting your design decisions, color choices, and component usage. This practice is common in professional development and helps maintain consistency.

## Looking Forward

In our next chapter, we'll bring our beautiful interface to life with htmx. You'll learn how to make web pages that respond to user interaction without the complexity of traditional JavaScript frameworks. We'll implement the dynamic features that will transform your static display into an interactive learning platform.

We'll also begin building the features that will make your application genuinely useful for memorization: the ability to hide and reveal text, track reading progress, and customize the study experience for individual users.

But pause to appreciate what you've accomplished. You've created:

- **A comprehensive design system** that ensures visual consistency
- **Reusable components** that make your code maintainable and extensible  
- **Responsive layouts** that work beautifully on any device
- **Accessibility features** that welcome users with different needs
- **Progressive enhancements** that improve the experience without breaking basic functionality

Most importantly, you've learned to think about user interface design as a form of literary interpretation. Every color choice, every spacing decision, every interaction pattern communicates something about how you understand Dante's work and how you want others to experience it.

Your application now has the visual foundation to support serious literary study. In Dante's words: *"E qual è quei che cosa innanzi sé nova / vede che di smarrisce sì che l'aspetta / e non l'aspetta"*—"And like one who sees something new before him and wavers, so that he waits and does not wait."

You've moved past waiting. In the next chapter, we build the future.