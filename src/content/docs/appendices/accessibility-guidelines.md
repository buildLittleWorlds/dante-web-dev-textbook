---
title: "Accessibility Guidelines and Testing"
description: "WCAG 2.2 compliance, testing procedures, and creating inclusive educational applications"
---

# Appendix D: Accessibility Guidelines and Testing

## WCAG 2.2 Compliance Overview

WCAG 2.2, published in October 2023, includes 13 guidelines organized under four principles: perceivable, operable, understandable, and robust, with success criteria at three levels: A, AA, and AAA. For educational institutions in 2025, WCAG 2.1 AA remains the standard requirement, though WCAG 2.2 AA compliance provides additional benefits and future-proofing.

## The POUR Principles

### 1. Perceivable
Information and UI components must be presentable to users in ways they can perceive.

**Implementation in Dante App:**

```typescript
// Alternative text for images
export function TercetIllustration({ tercet, altText }: { tercet: Tercet, altText: string }) {
  return (
    <figure className="tercet-illustration">
      <img 
        src={`/images/tercets/${tercet.id}.jpg`}
        alt={altText || `Illustration for ${tercet.canticle} Canto ${tercet.canto}, Tercet ${tercet.number}`}
        loading="lazy"
      />
      <figcaption className="sr-only">
        {altText}
      </figcaption>
    </figure>
  )
}

// Color contrast compliance
:root {
  /* WCAG AA compliant color ratios (4.5:1 minimum) */
  --color-text: #212529;        /* 16.75:1 on white */
  --color-text-muted: #6c757d;  /* 4.54:1 on white */
  --color-link: #0056b3;        /* 4.51:1 on white */
  --color-error: #dc3545;       /* 4.5:1 on white */
  --color-success: #155724;     /* 7.8:1 on white */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text: #000000;
    --color-background: #ffffff;
    --color-border: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Audio and Video Accessibility:**
```typescript
// Captions and transcripts for multimedia content
export function DanteRecitation({ tercet }: { tercet: Tercet }) {
  return (
    <div className="media-content">
      <audio controls>
        <source src={`/audio/tercets/${tercet.id}.mp3`} type="audio/mpeg" />
        <track 
          kind="captions" 
          src={`/captions/tercets/${tercet.id}.vtt`} 
          srcLang="en" 
          label="English"
        />
        Your browser does not support the audio element.
      </audio>
      
      <details className="transcript">
        <summary>View Transcript</summary>
        <div className="transcript-content">
          {tercet.lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </details>
    </div>
  )
}
```

### 2. Operable
UI components and navigation must be operable by all users.

**Keyboard Navigation:**
```typescript
// Comprehensive keyboard support
export function StudyInterface({ tercets }: { tercets: Tercet[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'h':
          event.preventDefault()
          previousTercet()
          break
        case 'ArrowRight':
        case 'l':
          event.preventDefault()
          nextTercet()
          break
        case ' ':
          event.preventDefault()
          toggleAnswer()
          break
        case 'r':
          event.preventDefault()
          repeatAudio()
          break
        case 'Escape':
          event.preventDefault()
          exitStudyMode()
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])
  
  return (
    <div 
      className="study-interface"
      role="application"
      aria-label="Dante memorization study interface"
      tabIndex={0}
    >
      <div className="keyboard-instructions sr-only">
        Press arrow keys or H/L to navigate, Space to reveal answer, R to repeat audio, Escape to exit
      </div>
      {/* Study content */}
    </div>
  )
}

// Focus management
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
    } else if (previousFocus.current) {
      previousFocus.current.focus()
    }
  }, [isOpen])
  
  return isOpen ? (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null
}
```

**Touch and Mobile Accessibility:**
```css
/* Touch target sizing (minimum 44px) */
.btn,
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Improved touch interactions */
.tercet-card {
  touch-action: manipulation; /* Prevents zoom on double-tap */
}

/* Hover states that work on touch */
@media (hover: hover) {
  .btn:hover {
    background-color: var(--color-hover);
  }
}

/* Focus indicators for all interaction methods */
.btn:focus-visible,
.form-input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### 3. Understandable
Information and UI operation must be understandable.

**Clear Language and Instructions:**
```typescript
// Form validation with clear error messages
export function AnnotationForm({ tercetId }: { tercetId: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateForm = (data: FormData) => {
    const newErrors: Record<string, string> = {}
    
    const title = data.get('title') as string
    if (!title || title.length < 3) {
      newErrors.title = 'Annotation title must be at least 3 characters long'
    }
    
    const content = data.get('content') as string
    if (!content || content.length < 10) {
      newErrors.content = 'Annotation content must be at least 10 characters long'
    }
    
    return newErrors
  }
  
  return (
    <form 
      hx-post="/api/annotations"
      hx-validate="true"
      aria-describedby={errors.form ? 'form-errors' : undefined}
    >
      <fieldset>
        <legend>Add Annotation</legend>
        
        <div className="form-group">
          <label htmlFor="annotation-title">
            Annotation Title
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="annotation-title"
            name="title"
            type="text"
            required
            aria-describedby={errors.title ? 'title-error' : 'title-help'}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          <div id="title-help" className="form-help">
            Provide a brief, descriptive title for your annotation
          </div>
          {errors.title && (
            <div id="title-error" className="error-message" role="alert">
              {errors.title}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="annotation-content">
            Annotation Content
            <span className="required" aria-label="required">*</span>
          </label>
          <textarea
            id="annotation-content"
            name="content"
            required
            rows={4}
            aria-describedby={errors.content ? 'content-error' : 'content-help'}
            aria-invalid={errors.content ? 'true' : 'false'}
          />
          <div id="content-help" className="form-help">
            Share your thoughts, analysis, or questions about this tercet
          </div>
          {errors.content && (
            <div id="content-error" className="error-message" role="alert">
              {errors.content}
            </div>
          )}
        </div>
      </fieldset>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Annotation
        </button>
        <button type="button" className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

// Help and documentation
export function HelpTooltip({ content }: { content: string }) {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <span className="help-tooltip">
      <button
        type="button"
        className="help-trigger"
        aria-label="Help"
        aria-expanded={isVisible}
        onClick={() => setIsVisible(!isVisible)}
      >
        ?
      </button>
      {isVisible && (
        <div className="help-content" role="tooltip">
          {content}
        </div>
      )}
    </span>
  )
}
```

**Consistent Navigation:**
```typescript
// Breadcrumb navigation
export function Breadcrumb({ path }: { path: Array<{ label: string, href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {path.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < path.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true"> / </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Skip links for keyboard users
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#search" className="skip-link">
        Skip to search
      </a>
    </div>
  )
}
```

### 4. Robust
Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.

**Semantic HTML:**
```typescript
// Proper document structure
export function StudyPage({ tercet }: { tercet: Tercet }) {
  return (
    <main id="main-content">
      <header>
        <h1>Study Session: {tercet.canticle}</h1>
        <nav aria-label="Study progress">
          <div className="progress-indicator">
            <span className="sr-only">Progress: </span>
            Canto {tercet.canto}, Tercet {tercet.number}
          </div>
        </nav>
      </header>
      
      <article>
        <header>
          <h2 id="tercet-title">
            {tercet.canticle} - Canto {tercet.canto}, Tercet {tercet.number}
          </h2>
        </header>
        
        <section aria-labelledby="original-text">
          <h3 id="original-text">Original Italian</h3>
          <div className="tercet-lines" lang="it">
            {tercet.lines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>
        
        <section aria-labelledby="translation">
          <h3 id="translation">English Translation</h3>
          <blockquote cite={tercet.translationSource}>
            <p>{tercet.translation}</p>
            <footer>
              <cite>— {tercet.translator}</cite>
            </footer>
          </blockquote>
        </section>
      </article>
      
      <aside aria-labelledby="study-tools">
        <h2 id="study-tools">Study Tools</h2>
        {/* Study interface components */}
      </aside>
    </main>
  )
}

// ARIA live regions for dynamic updates
export function StudyProgress({ progress }: { progress: StudyProgress }) {
  return (
    <div className="study-progress">
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        Progress updated: {progress.completed} of {progress.total} tercets completed
      </div>
      
      <div className="progress-visual">
        <div 
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progress.completed}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-label={`Study progress: ${progress.completed} of ${progress.total} tercets`}
        >
          <div 
            className="progress-fill"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
```

## Accessibility Testing Checklist

WCAG compliance requires both automated and human testing, as automated tools can only detect approximately 30% of accessibility issues.

### Automated Testing Tools

```typescript
// Accessibility testing with axe-core
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<StudyInterface tercets={mockTercets} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should handle keyboard navigation correctly', async () => {
    const { getByRole } = render(<StudyInterface tercets={mockTercets} />)
    const interface = getByRole('application')
    
    // Test keyboard navigation
    fireEvent.keyDown(interface, { key: 'ArrowRight' })
    // Assert expected navigation behavior
  })
})

// Pa11y integration for full page testing
import pa11y from 'pa11y'

async function testPageAccessibility(url: string) {
  try {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      includeNotices: false,
      includeWarnings: true
    })
    
    if (results.issues.length > 0) {
      console.log('Accessibility issues found:')
      results.issues.forEach(issue => {
        console.log(`${issue.type}: ${issue.message}`)
        console.log(`Element: ${issue.selector}`)
        console.log(`---`)
      })
    }
    
    return results
  } catch (error) {
    console.error('Pa11y testing failed:', error)
  }
}
```

### Manual Testing Procedures

**Keyboard Navigation Testing:**
1. Navigate the entire application using only the Tab, Shift+Tab, Arrow keys, Enter, and Space
2. Ensure all interactive elements are reachable and operable
3. Verify focus indicators are clearly visible
4. Test custom keyboard shortcuts

**Screen Reader Testing:**
1. Test with NVDA (Windows), VoiceOver (macOS), or Orca (Linux)
2. Verify all content is announced correctly
3. Check that form labels and error messages are associated properly
4. Ensure navigation landmarks are properly identified

**Color and Contrast Testing:**
```css
/* Test high contrast mode */
@media (prefers-contrast: high) {
  /* Verify all content remains visible and usable */
}

/* Test with grayscale to check color-only information */
.test-grayscale * {
  filter: grayscale(100%);
}
```

**Mobile Accessibility Testing:**
1. Test with mobile screen readers (TalkBack on Android, VoiceOver on iOS)
2. Verify touch targets meet minimum size requirements (44px)
3. Test orientation changes
4. Ensure content reflows properly at 320px width

## Legal Compliance Considerations

The European Accessibility Act comes into force on June 28, 2025, requiring e-commerce, travel, and banking websites in the EU to meet WCAG 2.2 Level AA standards. Similar requirements exist under the ADA in the United States, Section 508 for federal agencies, and AODA in Ontario.

### Accessibility Statement Template

```markdown
# Accessibility Statement for Dante Memorization Application

## Commitment to Accessibility
We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Standards
This website aims to conform with WCAG 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities.

## Current Status
We believe this website currently meets WCAG 2.1 Level AA standards. We continue to monitor and improve accessibility.

## Feedback
We welcome your feedback on the accessibility of this website. Please contact us if you encounter accessibility barriers:
- Email: accessibility@yourschool.edu
- Phone: [Your phone number]

## Technical Information
This website has been tested for accessibility using:
- Automated testing tools (axe-core, Pa11y)
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)
- Color contrast validation

Last updated: [Date]
```

## Future Accessibility Considerations

As we move toward 2025 and beyond, accessibility considerations include AI-powered assistive technologies, voice interfaces, and emerging interaction patterns.

```typescript
// Voice interface integration
export function VoiceStudyInterface() {
  const [isListening, setIsListening] = useState(false)
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleVoiceCommand(transcript)
      }
      
      // Voice command implementation
    }
  }, [])
  
  return (
    <div className="voice-interface">
      <button
        onClick={() => setIsListening(!isListening)}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={isListening}
      >
        {isListening ? 'Stop Listening' : 'Voice Commands'}
      </button>
    </div>
  )
}
```

Creating accessible educational applications ensures that the transformative power of literature remains available to all learners, regardless of their abilities or the assistive technologies they use.