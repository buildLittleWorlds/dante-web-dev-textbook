

## Chapter 13: Making It Beautiful - Advanced CSS and Responsive Design

### Opening Vignette

A student opens your Dante memorization application on her laptop during a study break between classes. The elegant typography displays each tercet with the care and attention that the 700-year-old verses deserve. As she walks across campus, she pulls out her phone to review a challenging passage—the interface seamlessly adapts to the smaller screen, maintaining both beauty and functionality. Later that evening, her grandfather, who has been slowly losing his vision, uses the same application with the text size increased and high contrast enabled, finding that he can still engage with the poetry that has been meaningful to him for decades.

This is the power of thoughtful design in digital humanities: it doesn't just make applications look good, it makes them universally accessible and genuinely pleasant to use. When we design interfaces for literary study, we're not just arranging pixels on screens—we're creating digital spaces where people encounter some of humanity's greatest artistic achievements.

In this chapter, you'll transform your secure and reliable Dante application into something truly beautiful: a digital interface that honors both the aesthetic traditions of book design and the best practices of modern web accessibility.

### Learning Objectives

By the end of this chapter, you will be able to:

- **Create sophisticated visual designs** using advanced CSS Grid, Flexbox, and custom properties
- **Implement responsive design** that works elegantly across all device sizes and orientations
- **Design accessible interfaces** following WCAG guidelines for inclusive user experiences
- **Apply animation and micro-interactions** that enhance rather than distract from the content
- **Understand design systems** and how to maintain visual consistency across complex applications
- **Honor literary traditions** while creating modern, digital-native user experiences

These design skills serve the broader humanities goal of making cultural treasures accessible to diverse audiences while respecting the artistic integrity of the source material.

### Conceptual Introduction

#### Design as Digital Humanities Practice

Visual design in digital humanities projects carries responsibilities that go far beyond making things "look nice." When we design interfaces for literary works, we become part of a long tradition of book designers, manuscript illuminators, and typography craftspeople who have shaped how readers encounter texts across centuries.

Consider the historical evolution of how Dante's work has been presented visually:

- **Medieval manuscripts** used elaborate illuminations and careful scribal hands to make the text both beautiful and sacred
- **Renaissance printed editions** employed new typography technologies to create more accessible and standardized presentations
- **Modern critical editions** use sophisticated layout systems to present multiple text layers, annotations, and scholarly apparatus
- **Digital editions** now offer unprecedented opportunities for customization, interactivity, and accessibility

Your application sits within this tradition. Every design choice you make—typography, color, spacing, animation—either honors or betrays the literary heritage you're working with.

#### The Intersection of Beauty and Accessibility

One of the most important principles in modern interface design is that beauty and accessibility are not in tension—they're mutually reinforcing. An interface that's truly beautiful is one that welcomes all users and adapts to their diverse needs and preferences.

This principle has deep resonance with Dante's own aesthetic philosophy. Throughout the *Divine Comedy*, beauty is not superficial decoration but rather the visible manifestation of underlying order, justice, and love. True beauty, for Dante, includes and uplifts rather than excluding or diminishing others.

In our application, this means:

- **Typography** that's not just elegant but also legible for users with vision differences
- **Color schemes** that provide appropriate contrast while creating emotional resonance
- **Interactive elements** that work for users navigating with keyboards, screen readers, or touch devices
- **Layout systems** that adapt gracefully to different screen sizes and user preferences

#### Responsive Design as Cultural Inclusion

Responsive design—the practice of creating interfaces that adapt to different devices and screen sizes—is often treated as a purely technical concern. But in the context of digital humanities, responsive design becomes a question of cultural inclusion and access.

Who gets to engage with Dante's work? Only users with large desktop computers? Only those who can afford the latest smartphones? Or can we create experiences that work beautifully whether someone is reading on a library computer, an older tablet, or a small phone screen?

When we implement responsive design thoughtfully, we're acting on the democratic ideal that great literature should be available to all readers, regardless of their economic circumstances or technological resources.

### Hands-On Implementation

#### Creating a Design System

Before we dive into specific implementations, let's establish a comprehensive design system that will guide all our visual choices. This system will be based on the principles of classical typography and book design, adapted for digital interfaces.

Create a new file `src/styles/design-system.css`:

```css
/* ===== DESIGN SYSTEM: DANTE MEMORIZATION APP ===== */

/* Design Tokens - Core Values */
:root {
  /* Color Palette - Inspired by Medieval Illuminated Manuscripts */
  
  /* Primary Brand Colors */
  --color-dante-gold: #D4AF37;
  --color-dante-deep-red: #8B0000;
  --color-dante-royal-blue: #000080;
  --color-manuscript-cream: #FDF5E6;
  --color-parchment: #F4E5BC;
  
  /* Semantic Color System */
  --color-primary: var(--color-dante-deep-red);
  --color-primary-light: #CD853F;
  --color-primary-dark: #4B0000;
  
  --color-secondary: var(--color-dante-royal-blue);
  --color-secondary-light: #4169E1;
  --color-secondary-dark: #000060;
  
  --color-accent: var(--color-dante-gold);
  --color-accent-light: #FFD700;
  --color-accent-dark: #B8860B;
  
  /* Neutral Palette */
  --color-white: #FFFFFF;
  --color-surface: var(--color-manuscript-cream);
  --color-surface-raised: #FDFBF7;
  --color-border-light: #E8D7C3;
  --color-border: #D4C3A0;
  --color-border-dark: #B8A687;
  
  /* Text Colors */
  --color-text-primary: #2C1810;
  --color-text-secondary: #5D4E37;
  --color-text-muted: #8B7355;
  --color-text-inverse: var(--color-manuscript-cream);
  
  /* Status Colors */
  --color-success: #2E7D32;
  --color-success-light: #C8E6C9;
  --color-warning: #F57C00;
  --color-warning-light: #FFE0B2;
  --color-error: #C62828;
  --color-error-light: #FFCDD2;
  --color-info: var(--color-secondary);
  --color-info-light: #E3F2FD;
  
  /* Typography Scale - Based on Classical Proportions */
  --font-scale: 1.25; /* Major Third */
  
  --font-size-xs: 0.64rem;    /* 10.24px at 16px base */
  --font-size-sm: 0.8rem;     /* 12.8px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-md: 1.25rem;    /* 20px */
  --font-size-lg: 1.563rem;   /* 25px */
  --font-size-xl: 1.953rem;   /* 31.25px */
  --font-size-2xl: 2.441rem;  /* 39.06px */
  --font-size-3xl: 3.052rem;  /* 48.83px */
  
  /* Font Families - Optimized for Literary Content */
  --font-primary: 'Crimson Text', 'Times New Roman', serif;
  --font-secondary: 'Cinzel', 'Trajan Pro', serif;
  --font-ui: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights - Optimized for Reading */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 1.75;
  
  /* Spacing Scale - Based on Musical Intervals */
  --space-px: 1px;
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  /* Border Radius - Subtle, Classical */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows - Inspired by Paper and Parchment */
  --shadow-sm: 0 1px 2px 0 rgba(44, 24, 16, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(44, 24, 16, 0.1), 
                 0 1px 2px 0 rgba(44, 24, 16, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(44, 24, 16, 0.1), 
               0 2px 4px -1px rgba(44, 24, 16, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(44, 24, 16, 0.1), 
               0 4px 6px -2px rgba(44, 24, 16, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(44, 24, 16, 0.1), 
               0 10px 10px -5px rgba(44, 24, 16, 0.04);
  --shadow-inner: inset 0 2px 4px 0 rgba(44, 24, 16, 0.06);
  
  /* Transitions - Refined and Purposeful */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  --transition-slower: 500ms ease-in-out;
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
  
  /* Breakpoints for Responsive Design */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
  
  /* Content Widths */
  --content-width-sm: 640px;
  --content-width-md: 768px;
  --content-width-lg: 1024px;
  --content-width-reading: 65ch; /* Optimal for reading text */
}

/* Dark Theme Variants */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #1A1611;
    --color-surface-raised: #1F1B16;
    --color-text-primary: var(--color-manuscript-cream);
    --color-text-secondary: #D4C3A0;
    --color-text-muted: #B8A687;
    --color-border-light: #2D2720;
    --color-border: #3D342B;
    --color-border-dark: #4D4136;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
    --transition-slower: 0ms;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #1A1A1A;
    --color-border: #666666;
    --color-accent: #0066CC;
  }
}
```

Now let's create the base typography and layout system. Create `src/styles/typography.css`:

```css
/* ===== TYPOGRAPHY SYSTEM ===== */

/* Font Loading and Performance */
@font-face {
  font-family: 'Crimson Text';
  src: url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  font-display: swap;
}

@font-face {
  font-family: 'Cinzel';
  src: url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap');
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  font-display: swap;
}

/* Base Typography */
html {
  font-size: 16px;
  line-height: var(--line-height-normal);
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Heading System */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-secondary);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
  text-wrap: balance;
}

h1 {
  font-size: var(--font-size-3xl);
  letter-spacing: -0.025em;
  margin-bottom: var(--space-6);
}

h2 {
  font-size: var(--font-size-2xl);
  letter-spacing: -0.025em;
  margin-top: var(--space-8);
  margin-bottom: var(--space-5);
}

h3 {
  font-size: var(--font-size-xl);
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
}

h4 {
  font-size: var(--font-size-lg);
  margin-top: var(--space-5);
}

h5 {
  font-size: var(--font-size-md);
  margin-top: var(--space-4);
}

h6 {
  font-size: var(--font-size-base);
  margin-top: var(--space-4);
  font-weight: var(--font-weight-bold);
}

/* Body Text */
p {
  margin: 0 0 var(--space-4) 0;
  line-height: var(--line-height-relaxed);
  text-wrap: pretty;
}

.lead {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.small {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Dante-Specific Typography */
.tercet {
  font-family: var(--font-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-loose);
  margin: var(--space-6) 0;
  padding: var(--space-5);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.tercet-line {
  display: block;
  margin-bottom: var(--space-1);
  text-indent: 0;
}

.tercet-line:last-child {
  margin-bottom: 0;
}

.canto-title {
  font-family: var(--font-secondary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-align: center;
  margin: var(--space-8) 0 var(--space-6) 0;
  position: relative;
}

.canto-title::after {
  content: '';
  position: absolute;
  bottom: -var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  width: 3rem;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-accent),
    transparent
  );
}

.canticle-title {
  font-family: var(--font-secondary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-align: center;
  margin: var(--space-12) 0 var(--space-8) 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.italian-text {
  font-style: italic;
  color: var(--color-text-primary);
}

.english-text {
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

/* Lists */
ul, ol {
  margin: 0 0 var(--space-4) 0;
  padding-left: var(--space-6);
}

li {
  margin-bottom: var(--space-1);
  line-height: var(--line-height-relaxed);
}

/* Links */
a {
  color: var(--color-accent-dark);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color var(--transition-fast);
}

a:hover, a:focus {
  color: var(--color-accent);
  text-decoration-thickness: 2px;
}

a:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Quotes and Citations */
blockquote {
  margin: var(--space-6) 0;
  padding: var(--space-4) var(--space-6);
  border-left: 4px solid var(--color-accent);
  background: var(--color-surface-raised);
  font-style: italic;
  position: relative;
}

blockquote::before {
  content: '"';
  font-size: var(--font-size-3xl);
  color: var(--color-accent);
  position: absolute;
  left: var(--space-2);
  top: 0;
  line-height: 1;
}

cite {
  font-style: normal;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  display: block;
  margin-top: var(--space-2);
}

cite::before {
  content: '— ';
}

/* Code (for technical documentation) */
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-border-light);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}

pre {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  overflow-x: auto;
  line-height: var(--line-height-normal);
}

pre code {
  background: none;
  padding: 0;
}

/* Accessibility and User Preferences */
@media (min-width: 768px) {
  .tercet {
    font-size: var(--font-size-lg);
    padding: var(--space-6) var(--space-8);
  }
}

/* Large text preference */
@media (prefers-reduced-motion: no-preference) {
  .tercet {
    transition: all var(--transition-base);
  }
  
  .tercet:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
}

/* Focus indicators for keyboard navigation */
.tercet:focus-within {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Now let's create our responsive layout system. Create `src/styles/layout.css`:

```css
/* ===== RESPONSIVE LAYOUT SYSTEM ===== */

/* Reset and Base Layout */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Main Application Layout */
.app-container {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header"
    "main"
    "footer";
}

.app-header {
  grid-area: header;
  background: var(--color-surface-raised);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.app-main {
  grid-area: main;
  padding: var(--space-6) var(--space-4);
  max-width: 100%;
  overflow-x: hidden;
}

.app-footer {
  grid-area: footer;
  background: var(--color-surface-raised);
  border-top: 1px solid var(--color-border);
  padding: var(--space-4);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Container System */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container-sm {
  max-width: var(--content-width-sm);
}

.container-md {
  max-width: var(--content-width-md);
}

.container-lg {
  max-width: var(--content-width-lg);
}

.container-reading {
  max-width: var(--content-width-reading);
}

/* Responsive Grid System */
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive breakpoints */
@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .grid-3, .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Flexbox Utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.flex-1 {
  flex: 1;
}

.flex-auto {
  flex: auto;
}

.flex-none {
  flex: none;
}

/* Spacing Utilities */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }

/* Study Interface Layout */
.study-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  max-width: var(--content-width-reading);
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .study-layout {
    grid-template-columns: 2fr 1fr;
    max-width: var(--content-width-lg);
    gap: var(--space-8);
  }
}

.study-content {
  /* Main content area */
}

.study-sidebar {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  height: fit-content;
  position: sticky;
  top: calc(var(--space-16) + var(--space-4)); /* Account for header */
}

/* Card Layout System */
.card {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-surface);
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Navigation Layout */
.nav-primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
}

.nav-brand {
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover, .nav-link.active {
  color: var(--color-primary);
  background: var(--color-border-light);
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .nav-primary {
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
  }
  
  .nav-menu {
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }
  
  .nav-link {
    text-align: center;
    padding: var(--space-3);
  }
}

/* Content Spacing */
.section {
  margin: var(--space-8) 0;
}

.section-sm {
  margin: var(--space-6) 0;
}

.section-lg {
  margin: var(--space-12) 0;
}

/* Responsive Text Alignment */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .sm\:text-center {
    text-align: center;
  }
  
  .sm\:text-left {
    text-align: left;
  }
}

/* Print Styles */
@media print {
  .app-header,
  .app-footer,
  .study-sidebar,
  .nav-menu {
    display: none;
  }
  
  .app-main {
    padding: 0;
  }
  
  .tercet {
    box-shadow: none;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
}
```

Now let's create interactive components with sophisticated styling. Create `src/styles/components.css`:

```css
/* ===== INTERACTIVE COMPONENTS ===== */

/* Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  line-height: 1;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Button Variants */
.btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: var(--color-text-inverse);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-secondary-dark);
  border-color: var(--color-secondary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-accent {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.btn-accent:hover:not(:disabled) {
  background: var(--color-accent-light);
  border-color: var(--color-accent-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-border-dark);
  color: var(--color-text-primary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--color-surface-raised);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-border-light);
  color: var(--color-text-primary);
}

/* Button Sizes */
.btn-sm {
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
}

.btn-lg {
  font-size: var(--font-size-lg);
  padding: var(--space-4) var(--space-6);
}

.btn-xl {
  font-size: var(--font-size-xl);
  padding: var(--space-5) var(--space-8);
}

/* Loading state */
.btn.loading {
  color: transparent;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: 50%;
  left: 50%;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: btn-loading 1s linear infinite;
}

@keyframes btn-loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form Elements */
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  font-family: var(--font-ui);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-textarea,
.form-select {
  display: block;
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: border-color var(--transition-fast), 
              box-shadow var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input:invalid,
.form-textarea:invalid,
.form-select:invalid {
  border-color: var(--color-error);
}

.form-textarea {
  resize: vertical;
  min-height: 6rem;
}

.form-help {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--space-1);
}

/* Study Session Controls */
.difficulty-selector {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin: var(--space-4) 0;
}

.difficulty-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: all var(--transition-fast);
}

.difficulty-btn[data-difficulty="1"] {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.difficulty-btn[data-difficulty="2"] {
  background: var(--color-success-light);
  border-color: var(--color-success);
  color: var(--color-success);
}

.difficulty-btn[data-difficulty="3"] {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.difficulty-btn[data-difficulty="4"] {
  background: var(--color-error-light);
  border-color: var(--color-error);
  color: var(--color-error);
}

.difficulty-btn[data-difficulty="5"] {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.difficulty-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

/* Progress Indicators */
.progress {
  width: 100%;
  height: var(--space-2);
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-accent-dark),
    var(--color-accent),
    var(--color-accent-light)
  );
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shine 2s ease-in-out infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  margin-top: var(--space-2);
}

/* Statistics Cards */
.stat-card {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  text-align: center;
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-value {
  font-family: var(--font-secondary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-medium);
}

/* Alert Messages */
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid;
  margin: var(--space-4) 0;
}

.alert-success {
  background: var(--color-success-light);
  border-color: var(--color-success);
  color: var(--color-success);
}

.alert-warning {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
  color: var(--color-warning);
}

.alert-error {
  background: var(--color-error-light);
  border-color: var(--color-error);
  color: var(--color-error);
}

.alert-info {
  background: var(--color-info-light);
  border-color: var(--color-info);
  color: var(--color-info);
}

.alert-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-1);
}

.alert-description {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Tooltips */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip::before,
.tooltip::after {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
}

.tooltip::before {
  content: attr(data-tooltip);
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  white-space: nowrap;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-var(--space-1));
  z-index: var(--z-tooltip);
}

.tooltip::after {
  content: '';
  border: 4px solid transparent;
  border-top-color: var(--color-text-primary);
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-tooltip);
}

.tooltip:hover::before,
.tooltip:hover::after,
.tooltip:focus::before,
.tooltip:focus::after {
  opacity: 1;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  z-index: var(--z-modal);
}

.modal-header {
  padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--color-primary);
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-4) var(--space-6) var(--space-6) var(--space-6);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text-primary);
  background: var(--color-border-light);
}

/* Animation Classes */
.fade-in {
  animation: fade-in var(--transition-base) ease-out;
}

.slide-up {
  animation: slide-up var(--transition-base) ease-out;
}

.scale-in {
  animation: scale-in var(--transition-base) ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    opacity: 0;
    transform: translateY(1rem);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive adjustments for components */
@media (max-width: 768px) {
  .btn {
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-sm);
  }
  
  .btn-lg {
    padding: var(--space-4) var(--space-5);
    font-size: var(--font-size-base);
  }
  
  .difficulty-selector {
    gap: var(--space-1);
  }
  
  .difficulty-btn {
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--font-size-base);
  }
  
  .modal {
    margin: var(--space-2);
    max-width: calc(100vw - var(--space-4));
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}
```

#### Creating Animations and Micro-interactions

Now let's add sophisticated animations that enhance the learning experience. Create `src/styles/animations.css`:

```css
/* ===== ANIMATIONS AND MICRO-INTERACTIONS ===== */

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Study Session Animations */
.tercet-reveal {
  animation: tercet-reveal 0.8s ease-out;
}

@keyframes tercet-reveal {
  0% {
    opacity: 0;
    transform: translateY(2rem) scale(0.95);
  }
  50% {
    opacity: 0.7;
    transform: translateY(0.5rem) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.tercet-line {
  opacity: 0;
  animation: line-appear 0.6s ease-out forwards;
}

.tercet-line:nth-child(1) {
  animation-delay: 0.2s;
}

.tercet-line:nth-child(2) {
  animation-delay: 0.4s;
}

.tercet-line:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes line-appear {
  0% {
    opacity: 0;
    transform: translateX(-1rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Success and feedback animations */
.answer-correct {
  animation: answer-correct 1s ease-out;
}

@keyframes answer-correct {
  0% {
    background: var(--color-surface);
    transform: scale(1);
  }
  25% {
    background: var(--color-success-light);
    transform: scale(1.02);
  }
  50% {
    background: var(--color-success-light);
    transform: scale(1.02);
  }
  100% {
    background: var(--color-surface);
    transform: scale(1);
  }
}

.answer-review {
  animation: answer-review 1s ease-out;
}

@keyframes answer-review {
  0% {
    background: var(--color-surface);
    transform: scale(1);
  }
  25% {
    background: var(--color-info-light);
    transform: scale(1.01);
  }
  50% {
    background: var(--color-info-light);
    transform: scale(1.01);
  }
  100% {
    background: var(--color-surface);
    transform: scale(1);
  }
}

/* Loading and transition states */
.loading-text {
  position: relative;
  color: transparent;
}

.loading-text::after {
  content: attr(data-loading-text);
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-text-primary);
  animation: loading-dots 1.5s infinite;
}

@keyframes loading-dots {
  0%, 20% {
    content: attr(data-loading-text);
  }
  40% {
    content: attr(data-loading-text) '.';
  }
  60% {
    content: attr(data-loading-text) '..';
  }
  80%, 100% {
    content: attr(data-loading-text) '...';
  }
}

/* Page transition effects */
.page-transition-enter {
  opacity: 0;
  transform: translateY(1rem);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--transition-base), 
              transform var(--transition-base);
}

.page-transition-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateY(-1rem);
  transition: opacity var(--transition-base), 
              transform var(--transition-base);
}

/* Hover and focus micro-interactions */
.interactive {
  transition: all var(--transition-fast);
  transform-origin: center;
}

.interactive:hover {
  transform: translateY(-1px);
}

.interactive:active {
  transform: translateY(0) scale(0.98);
}

/* Progress animations */
.progress-grow {
  animation: progress-grow 1s ease-out;
}

@keyframes progress-grow {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  100% {
    transform: scaleX(1);
    transform-origin: left;
  }
}

/* Notification animations */
.notification-slide-in {
  animation: notification-slide-in 0.5s ease-out;
}

@keyframes notification-slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-slide-out {
  animation: notification-slide-out 0.3s ease-in forwards;
}

@keyframes notification-slide-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Focus ring animations */
.focus-ring {
  position: relative;
}

.focus-ring::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--color-accent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
}

.focus-ring:focus::before {
  opacity: 1;
}

/* Stagger animations for lists */
.stagger-children > * {
  animation: stagger-fade-in 0.5s ease-out backwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
.stagger-children > *:nth-child(n+6) { animation-delay: 0.6s; }

@keyframes stagger-fade-in {
  0% {
    opacity: 0;
    transform: translateY(1rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Breathing animation for important elements */
.breathing {
  animation: breathing 3s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Pulse animation for notifications */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(212, 175, 55, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
  }
}

/* Typewriter effect for special text */
.typewriter {
  overflow: hidden;
  border-right: 0.15em solid var(--color-accent);
  white-space: nowrap;
  animation: typewriter 3s steps(40, end), 
             cursor-blink 0.75s step-end infinite;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes cursor-blink {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: var(--color-accent);
  }
}

/* Sparkle effect for achievements */
.sparkle {
  position: relative;
  overflow: visible;
}

.sparkle::before,
.sparkle::after {
  content: '✨';
  position: absolute;
  font-size: var(--font-size-sm);
  animation: sparkle 2s ease-in-out infinite;
  pointer-events: none;
}

.sparkle::before {
  top: -0.5rem;
  left: -0.5rem;
  animation-delay: 0s;
}

.sparkle::after {
  bottom: -0.5rem;
  right: -0.5rem;
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Text reveal animations */
.text-reveal {
  overflow: hidden;
  position: relative;
}

.text-reveal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
  animation: text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes text-reveal {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Parallax scrolling effect */
.parallax {
  transform: translateZ(0);
  transition: transform 0.1s linear;
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* Loading skeleton animations */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    var(--color-border) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 1em;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-text:last-child {
  width: 60%;
  margin-bottom: 0;
}
```

#### Implementing Accessibility Features

Now let's create comprehensive accessibility enhancements. Create `src/styles/accessibility.css`:

```css
/* ===== ACCESSIBILITY ENHANCEMENTS ===== */

/* Screen Reader Only Content */
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

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  z-index: var(--z-modal);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 6px;
}

/* Focus Management */
.focus-trap {
  outline: none;
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #1a1a1a;
    --color-text-muted: #333333;
    --color-border: #666666;
    --color-border-dark: #333333;
    --color-accent: #0066cc;
    --color-primary: #800000;
    --color-success: #006600;
    --color-warning: #ff6600;
    --color-error: #cc0000;
  }
  
  .tercet {
    border: 2px solid var(--color-border-dark);
  }
  
  .btn {
    border-width: 2px;
    font-weight: var(--font-weight-bold);
  }
  
  .card {
    border: 2px solid var(--color-border-dark);
  }
}

/* Large Text Support */
@media (min-width: 768px) {
  .large-text {
    font-size: 1.25em;
    line-height: 1.6;
  }
  
  .large-text .tercet {
    font-size: var(--font-size-xl);
    line-height: 2;
    padding: var(--space-8);
  }
  
  .large-text .btn {
    font-size: var(--font-size-lg);
    padding: var(--space-4) var(--space-6);
  }
}

/* User Text Size Preferences */
@supports (font-size: 1cap) {
  .respect-user-font-size {
    font-size: max(1rem, 1cap);
  }
}

/* Color Blind Friendly Patterns */
.colorblind-friendly .difficulty-btn[data-difficulty="1"]::after {
  content: '✓';
  font-weight: bold;
}

.colorblind-friendly .difficulty-btn[data-difficulty="2"]::after {
  content: '○';
  font-weight: bold;
}

.colorblind-friendly .difficulty-btn[data-difficulty="3"]::after {
  content: '△';
  font-weight: bold;
}

.colorblind-friendly .difficulty-btn[data-difficulty="4"]::after {
  content: '⬦';
  font-weight: bold;
}

.colorblind-friendly .difficulty-btn[data-difficulty="5"]::after {
  content: '✗';
  font-weight: bold;
}

/* Enhanced Focus Indicators */
.enhanced-focus *:focus {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 1px var(--color-primary);
}

.enhanced-focus .btn:focus {
  outline-color: var(--color-accent-light);
  outline-width: 4px;
}

/* Keyboard Navigation Helpers */
.keyboard-user .interactive:focus {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.keyboard-user .btn:focus {
  transform: scale(1.05);
}

/* Landmark Regions */
[role="main"] {
  min-height: 50vh;
}

[role="navigation"] {
  position: relative;
}

[role="navigation"]::before {
  content: 'Navigation';
  position: absolute;
  left: -10000px;
  font-weight: bold;
}

/* ARIA Live Regions */
.live-region {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Status Messages */
.status-message {
  background: var(--color-info-light);
  border: 1px solid var(--color-info);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  font-weight: var(--font-weight-medium);
}

.status-message[role="status"] {
  /* Ensure screen readers announce status */
}

.status-message[role="alert"] {
  /* Ensure screen readers announce alerts immediately */
  background: var(--color-error-light);
  border-color: var(--color-error);
  color: var(--color-error);
}

/* Form Accessibility */
.form-group {
  position: relative;
}

.form-required .form-label::after {
  content: ' (required)';
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.form-error[role="alert"] {
  margin-top: var(--space-2);
  font-weight: var(--font-weight-medium);
}

.form-input[aria-invalid="true"] {
  border-color: var(--color-error);
  border-width: 2px;
  box-shadow: 0 0 0 1px var(--color-error);
}

.form-input[aria-describedby] + .form-help {
  margin-top: var(--space-2);
}

/* Modal Accessibility */
.modal[role="dialog"] {
  position: relative;
}

.modal[role="dialog"]:focus {
  outline: none;
}

.modal-title[id] {
  /* Ensure modal title is properly labeled */
}

.modal-overlay {
  /* Ensure backdrop clicks close modal */
  cursor: pointer;
}

.modal {
  cursor: auto;
}

/* Table Accessibility */
.accessible-table {
  border-collapse: collapse;
  width: 100%;
  margin: var(--space-4) 0;
}

.accessible-table th,
.accessible-table td {
  border: 1px solid var(--color-border);
  padding: var(--space-3);
  text-align: left;
}

.accessible-table th {
  background: var(--color-surface-raised);
  font-weight: var(--font-weight-semibold);
}

.accessible-table caption {
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
  text-align: left;
}

/* Progress Indicator Accessibility */
.progress[role="progressbar"] {
  position: relative;
}

.progress[role="progressbar"]::after {
  content: attr(aria-valuenow) '% complete';
  position: absolute;
  left: -10000px;
}

/* Touch Target Sizes */
@media (pointer: coarse) {
  .btn,
  .form-input,
  .form-select,
  .difficulty-btn,
  [role="button"],
  [role="tab"],
  [role="menuitem"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  .difficulty-btn {
    width: 48px;
    height: 48px;
  }
}

/* Hover vs Touch Differentiation */
@media (hover: hover) {
  .hover-only:hover {
    /* Styles that only apply on hover-capable devices */
  }
}

@media (hover: none) {
  .touch-friendly {
    /* Enhanced touch targets and spacing */
    padding: var(--space-4);
  }
}

/* Print Accessibility */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  a::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
    color: #666;
  }
  
  .tercet {
    border: 1px solid #000;
    page-break-inside: avoid;
  }
  
  h1, h2, h3 {
    page-break-after: avoid;
  }
}

/* Error Prevention */
.confirm-action::before {
  content: '⚠️ ';
}

.destructive-action {
  border: 2px solid var(--color-error);
  background: var(--color-error-light);
}

.destructive-action:hover,
.destructive-action:focus {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

/* Loading State Accessibility */
.loading[aria-busy="true"] {
  position: relative;
}

.loading[aria-busy="true"]::after {
  content: 'Loading...';
  position: absolute;
  left: -10000px;
}

/* Responsive Text */
@media (max-width: 480px) {
  .responsive-text {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
  }
  
  .responsive-text .tercet {
    font-size: var(--font-size-base);
    padding: var(--space-4);
  }
}

/* User Preference Classes */
.user-prefers-dark {
  color-scheme: dark;
}

.user-prefers-light {
  color-scheme: light;
}

.user-prefers-large-text .tercet {
  font-size: var(--font-size-xl);
  line-height: 2;
}

.user-prefers-high-contrast {
  filter: contrast(1.5);
}

/* Semantic Color Communication */
.success-message::before {
  content: '✓ Success: ';
  font-weight: bold;
}

.warning-message::before {
  content: '⚠ Warning: ';
  font-weight: bold;
}

.error-message::before {
  content: '✗ Error: ';
  font-weight: bold;
}

.info-message::before {
  content: 'ℹ Info: ';
  font-weight: bold;
}
```

#### Implementing Dark Theme Support

Let's create a comprehensive dark theme system. Create `src/styles/themes.css`:

```css
/* ===== THEME SYSTEM ===== */

/* Light Theme (Default) */
[data-theme="light"] {
  --color-surface: var(--color-manuscript-cream);
  --color-surface-raised: #FDFBF7;
  --color-text-primary: #2C1810;
  --color-text-secondary: #5D4E37;
  --color-text-muted: #8B7355;
  --color-text-inverse: var(--color-manuscript-cream);
  --color-border-light: #E8D7C3;
  --color-border: #D4C3A0;
  --color-border-dark: #B8A687;
}

/* Dark Theme */
[data-theme="dark"] {
  --color-surface: #1A1611;
  --color-surface-raised: #1F1B16;
  --color-text-primary: var(--color-manuscript-cream);
  --color-text-secondary: #D4C3A0;
  --color-text-muted: #B8A687;
  --color-text-inverse: #2C1810;
  --color-border-light: #2D2720;
  --color-border: #3D342B;
  --color-border-dark: #4D4136;
  
  /* Adjust accent colors for dark theme */
  --color-accent: #E4BF47;
  --color-accent-light: #F0D060;
  --color-accent-dark: #C5A436;
  
  /* Adjust semantic colors */
  --color-success: #4CAF50;
  --color-success-light: #2D4A2F;
  --color-warning: #FF9800;
  --color-warning-light: #4A3D1A;
  --color-error: #F44336;
  --color-error-light: #4A2C2A;
  --color-info: #2196F3;
  --color-info-light: #1A2A3A;
}

/* Sepia Theme for Extended Reading */
[data-theme="sepia"] {
  --color-surface: #F4F1EA;
  --color-surface-raised: #F7F4ED;
  --color-text-primary: #5C4B37;
  --color-text-secondary: #7A6B57;
  --color-text-muted: #96876D;
  --color-text-inverse: #F4F1EA;
  --color-border-light: #E6DFD0;
  --color-border: #D6C9B0;
  --color-border-dark: #C6B49B;
  --color-accent: #B8860B;
  --color-primary: #8B4513;
  --color-secondary: #4682B4;
}

/* High Contrast Theme */
[data-theme="high-contrast"] {
  --color-surface: #FFFFFF;
  --color-surface-raised: #FFFFFF;
  --color-text-primary: #000000;
  --color-text-secondary: #000000;
  --color-text-muted: #333333;
  --color-text-inverse: #FFFFFF;
  --color-border-light: #666666;
  --color-border: #333333;
  --color-border-dark: #000000;
  --color-accent: #0066CC;
  --color-primary: #000000;
  --color-secondary: #000000;
  --color-success: #006600;
  --color-warning: #FF6600;
  --color-error: #CC0000;
}

[data-theme="high-contrast-dark"] {
  --color-surface: #000000;
  --color-surface-raised: #000000;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #FFFFFF;
  --color-text-muted: #CCCCCC;
  --color-text-inverse: #000000;
  --color-border-light: #666666;
  --color-border: #CCCCCC;
  --color-border-dark: #FFFFFF;
  --color-accent: #66CCFF;
  --color-primary: #FFFFFF;
  --color-secondary: #FFFFFF;
  --color-success: #66FF66;
  --color-warning: #FFCC66;
  --color-error: #FF6666;
}

/* Theme Transitions */
* {
  transition: background-color var(--transition-base),
              color var(--transition-base),
              border-color var(--transition-base),
              box-shadow var(--transition-base);
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
  }
}

/* Theme Toggle Button */
.theme-toggle {
  position: relative;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--color-accent-light);
  transform: scale(1.05);
}

.theme-toggle:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform var(--transition-base);
}

[data-theme="dark"] .theme-icon.sun {
  transform: rotate(180deg) scale(0);
}

[data-theme="light"] .theme-icon.moon {
  transform: rotate(-180deg) scale(0);
}

/* Theme-specific adjustments */
[data-theme="dark"] .tercet {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .btn-primary {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .btn-primary:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Sepia theme adjustments */
[data-theme="sepia"] .tercet {
  background: #F7F4ED;
  border-color: #E6DFD0;
}

[data-theme="sepia"] .tercet-line {
  color: #5C4B37;
}

/* High contrast adjustments */
[data-theme^="high-contrast"] .tercet {
  border-width: 2px;
  border-style: solid;
}

[data-theme^="high-contrast"] .btn {
  border-width: 2px;
  font-weight: var(--font-weight-bold);
}

[data-theme^="high-contrast"] .card {
  border-width: 2px;
}

/* Auto theme based on system preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-surface: #1A1611;
    --color-surface-raised: #1F1B16;
    --color-text-primary: var(--color-manuscript-cream);
    --color-text-secondary: #D4C3A0;
    --color-text-muted: #B8A687;
    --color-text-inverse: #2C1810;
    --color-border-light: #2D2720;
    --color-border: #3D342B;
    --color-border-dark: #4D4136;
  }
}

/* Theme persistence */
.theme-persistent {
  /* Ensure theme settings persist across page loads */
}
```

#### Implementing Enhanced Responsive Design

Now let's create our comprehensive responsive system that works beautifully across all devices. Update your main application template to include the complete design system:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Learn and memorize Dante's Divine Comedy with scientifically-proven spaced repetition">
    <title>Dante Memorization - Digital Humanities Learning</title>
    
    <!-- Performance and accessibility -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Design system CSS -->
    <link rel="stylesheet" href="/static/styles/design-system.css">
    <link rel="stylesheet" href="/static/styles/typography.css">
    <link rel="stylesheet" href="/static/styles/layout.css">
    <link rel="stylesheet" href="/static/styles/components.css">
    <link rel="stylesheet" href="/static/styles/animations.css">
    <link rel="stylesheet" href="/static/styles/accessibility.css">
    <link rel="stylesheet" href="/static/styles/themes.css">
    
    <!-- htmx and Alpine.js -->
    <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
</head>
<body x-data="danteApp()" x-init="initializeApp()">
    <!-- Skip Links for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
    
    <!-- Live Region for Announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="live-region"></div>
    <div aria-live="assertive" aria-atomic="true" class="sr-only" id="alert-region"></div>
    
    <div class="app-container">
        <!-- Header with Navigation -->
        <header class="app-header" role="banner">
            <nav class="nav-primary" role="navigation" id="navigation" aria-label="Main navigation">
                <a href="/" class="nav-brand" aria-label="Dante Memorization App Home">
                    <span aria-hidden="true">📖</span>
                    Dante Memorization
                </a>
                
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="/study" class="nav-link" 
                           :class="{ 'active': currentPage === 'study' }">
                            Study
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/progress" class="nav-link" 
                           :class="{ 'active': currentPage === 'progress' }">
                            Progress
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/library" class="nav-link" 
                           :class="{ 'active': currentPage === 'library' }">
                            Library
                        </a>
                    </li>
                    <li class="nav-item">
                        <button @click="toggleTheme()" 
                                class="theme-toggle"
                                :aria-label="themeToggleLabel"
                                :title="themeToggleLabel">
                            <svg class="theme-icon sun" aria-hidden="true" 
                                 x-show="currentTheme !== 'dark'" 
                                 width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                            </svg>
                            <svg class="theme-icon moon" aria-hidden="true" 
                                 x-show="currentTheme === 'dark'" 
                                 width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                            </svg>
                        </button>
                    </li>
                    <li class="nav-item">
                        <button @click="toggleAccessibilityMenu()" 
                                class="btn btn-ghost btn-sm"
                                aria-label="Accessibility options"
                                aria-expanded="false"
                                :aria-expanded="showAccessibilityMenu">
                            <span aria-hidden="true">♿</span>
                            <span class="sr-only">Accessibility</span>
                        </button>
                    </li>
                </ul>
            </nav>
            
            <!-- Accessibility Menu -->
            <div x-show="showAccessibilityMenu" 
                 x-transition:enter="fade-in"
                 x-transition:leave="fade-out"
                 class="accessibility-menu"
                 role="dialog"
                 aria-label="Accessibility Options"
                 x-trap="showAccessibilityMenu">
                <div class="accessibility-controls">
                    <h3>Accessibility Options</h3>
                    
                    <div class="control-group">
                        <label class="form-label">
                            <input type="checkbox" 
                                   x-model="preferences.largeText"
                                   @change="updatePreference('largeText', $event.target.checked)">
                            Large Text
                        </label>
                        
                        <label class="form-label">
                            <input type="checkbox" 
                                   x-model="preferences.highContrast"
                                   @change="updatePreference('highContrast', $event.target.checked)">
                            High Contrast
                        </label>
                        
                        <label class="form-label">
                            <input type="checkbox" 
                                   x-model="preferences.reducedMotion"
                                   @change="updatePreference('reducedMotion', $event.target.checked)">
                            Reduce Motion
                        </label>
                        
                        <label class="form-label">
                            <input type="checkbox" 
                                   x-model="preferences.keyboardNavigation"
                                   @change="updatePreference('keyboardNavigation', $event.target.checked)">
                            Enhanced Keyboard Navigation
                        </label>
                    </div>
                    
                    <div class="control-group">
                        <label class="form-label" for="theme-select">
                            Theme:
                        </label>
                        <select id="theme-select" 
                                x-model="currentTheme" 
                                @change="setTheme($event.target.value)"
                                class="form-select">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="sepia">Sepia</option>
                            <option value="high-contrast">High Contrast</option>
                            <option value="high-contrast-dark">High Contrast Dark</option>
                        </select>
                    </div>
                    
                    <button @click="toggleAccessibilityMenu()" 
                            class="btn btn-secondary btn-sm">
                        Close
                    </button>
                </div>
            </div>
        </header>
        
        <!-- Main Content Area -->
        <main class="app-main" role="main" id="main-content">
            <div class="container container-lg">
                <!-- Content will be loaded here via htmx -->
                <div id="app-content" 
                     hx-get="/current-page" 
                     hx-trigger="load"
                     hx-target="this"
                     hx-swap="innerHTML">
                    
                    <!-- Loading State -->
                    <div class="loading-placeholder">
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text" style="width: 60%;"></div>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Footer -->
        <footer class="app-footer" role="contentinfo">
            <div class="container container-lg">
                <p>&copy; 2025 Dante Memorization App. Built with ❤️ for digital humanities.</p>
                <p>
                    <a href="/about">About</a> | 
                    <a href="/accessibility">Accessibility</a> | 
                    <a href="/privacy">Privacy</a>
                </p>
            </div>
        </footer>
    </div>
    
    <!-- Alpine.js Application Logic -->
    <script>
        function danteApp() {
            return {
                currentTheme: localStorage.getItem('theme') || 'light',
                currentPage: 'home',
                showAccessibilityMenu: false,
                preferences: {
                    largeText: localStorage.getItem('largeText') === 'true',
                    highContrast: localStorage.getItem('highContrast') === 'true',
                    reducedMotion: localStorage.getItem('reducedMotion') === 'true',
                    keyboardNavigation: localStorage.getItem('keyboardNavigation') === 'true'
                },
                
                get themeToggleLabel() {
                    return this.currentTheme === 'dark' 
                        ? 'Switch to light theme' 
                        : 'Switch to dark theme';
                },
                
                initializeApp() {
                    this.setTheme(this.currentTheme);
                    this.applyPreferences();
                    this.setupKeyboardNavigation();
                    this.announceToScreenReader('Application loaded successfully');
                },
                
                toggleTheme() {
                    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                    this.setTheme(newTheme);
                },
                
                setTheme(theme) {
                    this.currentTheme = theme;
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                    this.announceToScreenReader(`Theme changed to ${theme}`);
                },
                
                toggleAccessibilityMenu() {
                    this.showAccessibilityMenu = !this.showAccessibilityMenu;
                },
                
                updatePreference(key, value) {
                    this.preferences[key] = value;
                    localStorage.setItem(key, value.toString());
                    this.applyPreferences();
                    this.announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
                },
                
                applyPreferences() {
                    const body = document.body;
                    
                    body.classList.toggle('large-text', this.preferences.largeText);
                    body.classList.toggle('enhanced-focus', this.preferences.highContrast);
                    body.classList.toggle('keyboard-user', this.preferences.keyboardNavigation);
                    
                    if (this.preferences.reducedMotion) {
                        body.style.setProperty('--transition-fast', '0ms');
                        body.style.setProperty('--transition-base', '0ms');
                        body.style.setProperty('--transition-slow', '0ms');
                    } else {
                        body.style.removeProperty('--transition-fast');
                        body.style.removeProperty('--transition-base');
                        body.style.removeProperty('--transition-slow');
                    }
                },
                
                setupKeyboardNavigation() {
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Tab') {
                            document.body.classList.add('keyboard-user');
                        }
                        
                        // Escape key closes overlays
                        if (e.key === 'Escape') {
                            this.showAccessibilityMenu = false;
                        }
                    });
                    
                    document.addEventListener('mousedown', () => {
                        document.body.classList.remove('keyboard-user');
                    });
                },
                
                announceToScreenReader(message, isAlert = false) {
                    const region = document.getElementById(isAlert ? 'alert-region' : 'live-region');
                    region.textContent = message;
                    
                    // Clear after announcement
                    setTimeout(() => {
                        region.textContent = '';
                    }, 1000);
                }
            }
        }
        
        // htmx configuration
        document.addEventListener('DOMContentLoaded', function() {
            // Configure htmx for better accessibility
            document.body.addEventListener('htmx:beforeRequest', function(evt) {
                // Show loading state
                const target = evt.detail.target;
                target.setAttribute('aria-busy', 'true');
                target.style.opacity = '0.7';
            });
            
            document.body.addEventListener('htmx:afterRequest', function(evt) {
                // Hide loading state
                const target = evt.detail.target;
                target.removeAttribute('aria-busy');
                target.style.opacity = '1';
                
                // Announce page changes to screen readers
                if (evt.detail.xhr.status === 200) {
                    const app = Alpine.store('danteApp') || window.danteApp;
                    if (app && app.announceToScreenReader) {
                        app.announceToScreenReader('Page content updated');
                    }
                }
            });
            
            document.body.addEventListener('htmx:responseError', function(evt) {
                const app = Alpine.store('danteApp') || window.danteApp;
                if (app && app.announceToScreenReader) {
                    app.announceToScreenReader('Error loading content. Please try again.', true);
                }
            });
        });
    </script>
    
    <!-- Additional CSS for accessibility menu -->
    <style>
        .accessibility-menu {
            position: absolute;
            top: 100%;
            right: var(--space-4);
            background: var(--color-surface-raised);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--space-6);
            min-width: 250px;
            z-index: var(--z-dropdown);
        }
        
        .accessibility-controls h3 {
            margin: 0 0 var(--space-4) 0;
            font-size: var(--font-size-lg);
            color: var(--color-primary);
        }
        
        .control-group {
            margin-bottom: var(--space-4);
        }
        
        .control-group:last-child {
            margin-bottom: 0;
        }
        
        .control-group .form-label {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            margin-bottom: var(--space-2);
            font-size: var(--font-size-sm);
        }
        
        .control-group input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        
        .loading-placeholder {
            padding: var(--space-8);
        }
        
        .fade-in {
            animation: fade-in var(--transition-base) ease-out;
        }
        
        .fade-out {
            animation: fade-out var(--transition-fast) ease-in;
        }
        
        @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    </style>
</body>
</html>
```

Now let's create enhanced study interface components that showcase our design system:

```typescript
// Enhanced study session component with beautiful UI
export function StudySessionCard({ tercet, onAnswer }: StudySessionProps) {
    return `
        <article class="tercet-card" 
                 role="article" 
                 aria-labelledby="tercet-title-${tercet.id}"
                 x-data="studyCard(${JSON.stringify(tercet)})"
                 x-init="initCard()">
            
            <header class="tercet-header">
                <h2 id="tercet-title-${tercet.id}" class="canto-title">
                    ${tercet.canticle_name} - Canto ${tercet.canto_number}
                </h2>
                <div class="tercet-meta">
                    <span class="tercet-number" aria-label="Tercet number">
                        Tercet ${tercet.number}
                    </span>
                    <span class="difficulty-indicator" 
                          :class="'difficulty-' + currentDifficulty"
                          :aria-label="'Current difficulty: ' + currentDifficulty + ' out of 5'">
                        <span class="sr-only">Difficulty: </span>
                        <span x-text="'★'.repeat(currentDifficulty) + '☆'.repeat(5 - currentDifficulty)"></span>
                    </span>
                </div>
            </header>
            
            <div class="tercet-content" 
                 x-show="showContent" 
                 x-transition:enter="tercet-reveal"
                 x-transition:leave="fade-out">
                
                <div class="tercet-text" role="group" aria-label="Tercet text">
                    <div class="italian-text" lang="it">
                        <span class="tercet-line" x-show="showLine1" x-transition.delay.200ms>
                            ${tercet.line1_italian}
                        </span>
                        <span class="tercet-line" x-show="showLine2" x-transition.delay.400ms>
                            ${tercet.line2_italian}
                        </span>
                        <span class="tercet-line" x-show="showLine3" x-transition.delay.600ms>
                            ${tercet.line3_italian}
                        </span>
                    </div>
                    
                    <div class="english-text" 
                         x-show="showTranslation" 
                         x-transition:enter.delay.800ms="slide-up">
                        <span class="tercet-line">${tercet.line1_english}</span>
                        <span class="tercet-line">${tercet.line2_english}</span>
                        <span class="tercet-line">${tercet.line3_english}</span>
                    </div>
                </div>
                
                <div class="study-controls" 
                     x-show="showControls" 
                     x-transition:enter.delay.1000ms="fade-in">
                    
                    <button @click="toggleTranslation()" 
                            class="btn btn-outline btn-sm"
                            :aria-label="showTranslation ? 'Hide translation' : 'Show translation'">
                        <span x-text="showTranslation ? 'Hide' : 'Show'"></span> Translation
                    </button>
                    
                    <button @click="playAudio()" 
                            class="btn btn-ghost btn-sm"
                            aria-label="Play audio pronunciation"
                            x-show="hasAudio">
                        <span aria-hidden="true">🔊</span>
                        <span class="sr-only">Play audio</span>
                    </button>
                </div>
            </div>
            
            <div class="study-assessment" 
                 x-show="showAssessment" 
                 x-transition:enter.delay.500ms="slide-up"
                 role="group" 
                 aria-label="Rate your understanding">
                
                <h3 class="assessment-title">How well did you remember this tercet?</h3>
                
                <div class="difficulty-selector" role="radiogroup" aria-label="Difficulty rating">
                    <button x-for="level in [1,2,3,4,5]" 
                            :key="level"
                            @click="selectDifficulty(level)"
                            class="difficulty-btn"
                            :class="{ 'selected': selectedDifficulty === level }"
                            :data-difficulty="level"
                            :aria-label="getDifficultyLabel(level)"
                            :aria-pressed="selectedDifficulty === level"
                            role="radio">
                        <span x-text="level"></span>
                        <span class="sr-only" x-text="getDifficultyLabel(level)"></span>
                    </button>
                </div>
                
                <div class="difficulty-legend">
                    <small class="text-muted">
                        1 = Perfect recall • 2 = Good • 3 = Fair • 4 = Difficult • 5 = Forgot completely
                    </small>
                </div>
                
                <div class="assessment-actions">
                    <button @click="submitAnswer()" 
                            class="btn btn-primary"
                            :disabled="!selectedDifficulty"
                            :class="{ 'loading': submitting }">
                        <span x-show="!submitting">Continue</span>
                        <span x-show="submitting">Recording...</span>
                    </button>
                    
                    <button @click="skipTercet()" 
                            class="btn btn-outline">
                        Skip for Now
                    </button>
                </div>
            </div>
            
            <!-- Progress Indicator -->
            <div class="study-progress" aria-hidden="true">
                <div class="progress">
                    <div class="progress-bar" 
                         :style="{ width: progressPercent + '%' }"
                         x-transition:enter="progress-grow"></div>
                </div>
                <div class="progress-text" x-text="progressText"></div>
            </div>
        </article>
    `;
}
```

### Dante Deep Dive: Beauty as Moral Imperative

As we implement these design systems, we're engaging with one of the central themes of Dante's *Divine Comedy*: the relationship between beauty and moral order. Throughout his journey, Dante discovers that true beauty is not superficial decoration but rather the visible manifestation of underlying harmony, justice, and love.

#### The Aesthetics of Paradise

In the *Paradiso*, Dante encounters increasingly beautiful and harmonious realms as he ascends toward the ultimate source of beauty and truth. Each sphere is more radiant than the last, not because of arbitrary decoration, but because it more perfectly expresses the divine order that underlies all creation.

Our design system follows a similar principle. The colors, typography, spacing, and animations we've implemented aren't arbitrary aesthetic choices—they're systematic expressions of underlying principles:

- **Typography hierarchy** reflects the structural relationships in Dante's text
- **Color systems** create emotional resonance while maintaining accessibility
- **Spacing rhythms** establish visual harmony that supports sustained reading
- **Animation timing** guides attention without overwhelming the content

#### Universal Design as Christian Virtue

Dante's conception of Paradise is fundamentally inclusive—all souls who have achieved salvation participate in the divine vision, each according to their capacity and nature. Similarly, our accessibility features embody the principle that great literature should be available to all readers, regardless of their physical capabilities or technological resources.

When we implement features like:
- **Screen reader support** for users with vision impairments
- **Keyboard navigation** for users who cannot use pointing devices
- **High contrast themes** for users with visual processing differences
- **Reduced motion options** for users with vestibular disorders

We're not just following technical guidelines—we're acting on the moral principle that beauty and knowledge should be universally accessible.

#### The Craft of Illumination

Medieval manuscripts of Dante's work were often elaborately illuminated, with scribes and artists working together to create books that were both functional and beautiful. The illuminators understood that their decorative work served the higher purpose of drawing readers into deeper engagement with the text.

Our CSS animations and micro-interactions serve a similar function. When we animate the appearance of each line of a tercet, we're creating a digital equivalent of the page-turn ritual that slows down reading and increases attention. When we provide visual feedback for user interactions, we're helping readers maintain their place in complex learning sequences.

The key insight from medieval book design is that beauty is not separate from function—it is the form that function takes when it is executed with genuine care and skill.

### Reflection and Extension

With the implementation of our comprehensive design system, your Dante memorization application has achieved something remarkable: it combines cutting-edge technology with aesthetic principles that honor both the literary tradition you're serving and the diverse needs of modern learners.

#### What We've Accomplished

In this chapter, we've created:

1. **A Comprehensive Design System**: Consistent visual language that scales across all application features
2. **Responsive Excellence**: Interfaces that work beautifully on devices from phones to large desktop displays
3. **Universal Accessibility**: Features that welcome users with diverse capabilities and preferences
4. **Meaningful Animation**: Motion that enhances rather than distracts from the learning experience
5. **Cultural Sensitivity**: Visual choices that honor the literary heritage while embracing modern usability

#### The Deeper Impact

But the real achievement goes beyond the technical implementation. You've demonstrated that digital humanities projects can be both intellectually serious and genuinely beautiful. You've shown that accessibility and elegance are not competing goals but mutually reinforcing aspects of excellent design.

Every animation you've crafted respects the reader's attention. Every color choice balances aesthetic appeal with practical legibility. Every responsive layout ensures that a student reading on a phone has an experience just as dignified and effective as one reading on a desktop computer.

#### Looking Forward

The design system we've built will serve as the foundation for all future development on this project. In Chapter 14, we'll explore how to deploy and maintain this work so that it can serve learners around the world. But more importantly, the principles we've established here—care for users, respect for content, and commitment to universal access—will inform every aspect of your continued work in digital humanities.

### Exercises and Projects

#### Technical Exercises

1. **Custom Theme Creation**: Design and implement a theme specifically optimized for different types of learning:
   - Create a "Focus Mode" theme with minimal distractions and enhanced contrast
   - Implement a "Reading Mode" theme optimized for extended study sessions
   - Design a "Presentation Mode" theme for classroom or conference use

2. **Advanced Animation System**: Build sophisticated micro-interactions that enhance the learning experience:
   - Create staggered animations for revealing tercet lines that match Italian verse rhythm
   - Implement gesture-based interactions for mobile devices
   - Design celebration animations for learning milestones that feel appropriate for scholarly work

3. **Responsive Enhancement**: Optimize the interface for specific use cases:
   - Create a tablet layout optimized for note-taking during study sessions
   - Design a mobile interface that works well for quick review during commutes
   - Implement a large-screen layout that takes advantage of extra space for contextual information

#### Humanities Projects

1. **Design History Research**: Write a comprehensive analysis (1000-1500 words) tracing the visual presentation of Dante's work from medieval manuscripts to modern digital editions. How do the design choices in different eras reflect the technological possibilities and cultural values of their time?

2. **Accessibility in Digital Humanities**: Research and report on how accessibility considerations in digital humanities projects connect to broader questions of social justice and educational equity. Interview disabled scholars about their experiences with digital humanities tools.

3. **Cross-Cultural Design Analysis**: Investigate how different cultural traditions approach the visual presentation of classical literature. How might your design system need to adapt to serve readers from different cultural backgrounds?

#### Collaborative Activities

1. **User Experience Testing**: Conduct comprehensive usability testing with diverse user groups:
   - Test with students who have different types of learning differences
   - Evaluate the interface with users from different age groups
   - Gather feedback from both Dante scholars and programming beginners

2. **Design System Documentation**: Create comprehensive documentation for your design system that could be used by other digital humanities projects:
   - Document the reasoning behind major design decisions
   - Create examples showing how the system adapts to different types of content
   - Write guidelines for extending the system while maintaining consistency

3. **Internationalization Planning**: Work with language learners to understand how your design system might need to adapt for different languages:
   - Research the typography requirements for displaying Italian text correctly
   - Investigate how the interface might need to change for right-to-left languages
   - Consider how color symbolism varies across cultures

### Looking Ahead

As we move into Chapter 14, we'll take our beautifully designed, accessible, and secure application and learn how to share it with the world. We'll explore deployment strategies, maintenance planning, and the ongoing responsibilities that come with creating educational technology that others depend on.

The transition from local development to public deployment is not just a technical challenge—it's a moment when your work becomes part of the broader ecosystem of digital humanities tools. The care and attention you've put into design and accessibility will determine whether your application becomes a valuable resource that serves scholars and students for years to come.

The principles that guided our approach to visual design—attention to detail, respect for users, and commitment to excellence—will continue to inform our approach to deployment and maintenance. Beautiful code that no one can access serves no one; accessible features that are unreliable betray the trust of the users who depend on them.

---