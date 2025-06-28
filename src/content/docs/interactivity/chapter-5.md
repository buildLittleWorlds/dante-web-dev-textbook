---
title: "Forms and User Input with htmx"
description: Search interfaces, user preferences, dynamic forms
---

# Chapter 5: Forms and User Input with htmx

*"Amor che ne la mente mi ragiona / de la mia donna disiosamente, / move cose di lei meco sovente"*

*Love that speaks to me in my mind of my lady with desire moves things about her with me often*

In Convivio, Dante writes about the dynamic relationship between mind and emotion, how thoughts move and transform through interaction. Similarly, web applications come alive through the dialogue between users and systems—the continuous exchange of input and response that creates meaningful digital experiences.

This chapter focuses on handling user input through forms, one of the most fundamental interactions in web applications. You'll learn to create search interfaces, user preference panels, and dynamic forms that respond intelligently to user actions. We'll build features that let users customize their learning experience and search through Dante's vast work.

## Learning Objectives

By the end of this chapter, you will:

- Create dynamic forms that validate input in real-time
- Implement search functionality with instant results
- Build user preference systems that persist across sessions
- Handle form submission and error states gracefully
- Use htmx for dependent form fields and dynamic content loading
- Understand progressive enhancement for form interactions

## The Nature of Digital Dialogue

Forms represent a fundamental shift from passive consumption to active participation. When users fill out forms, they're not just providing data—they're entering into a dialogue with your application, expressing preferences, asking questions, and collaborating in the creation of their experience.

### Forms in the Context of Literary Study

Consider how scholars have traditionally interacted with texts:
- **Annotation**: Writing notes in margins
- **Cross-referencing**: Looking up related passages
- **Indexing**: Creating personal organizational systems
- **Preference expression**: Choosing which translations or editions to use

All of these activities involve forms of input and response. Digital forms can recreate and enhance these traditional scholarly practices.

## Building a Search Interface

Let's start by creating a search interface that allows users to find specific tercets within Dante's work. This will demonstrate real-time form validation, dynamic results, and progressive enhancement.

First, let's expand our sample data to make search more meaningful. Update your `src/index.tsx` with additional tercets:

```typescript
// Expanded sample data for better search demonstration
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
    // Additional tercets including famous passages from Purgatorio and Paradiso...
]
```

Now let's create search components. Add these to your `src/components.tsx`:

```typescript
// ===== SEARCH COMPONENTS =====

export function SearchInterface() {
    return (
        <div className="search-interface">
            <SearchForm />
            <SearchResults />
        </div>
    )
}

function SearchForm() {
    return (
        <form className="search-form">
            <div className="search-header">
                <h2 className="search-title">Search the Divine Comedy</h2>
                <p className="search-description">
                    Find tercets by Italian text, English translation, or location.
                </p>
            </div>
            
            <div className="search-fields">
                <div className="search-field">
                    <label htmlFor="search-query" className="search-label">
                        Search Term
                    </label>
                    <input 
                        type="text"
                        id="search-query"
                        name="query"
                        className="search-input"
                        placeholder="Enter Italian or English text..."
                        hx-get="/api/search"
                        hx-target="#search-results"
                        hx-trigger="keyup changed delay:300ms"
                        hx-include="closest form"
                        hx-indicator="#search-loading"
                    />
                </div>
                
                <div className="search-filters">
                    <div className="filter-group">
                        <label className="filter-label">Canticle</label>
                        <select 
                            name="canticle" 
                            className="filter-select"
                            hx-get="/api/search"
                            hx-target="#search-results"
                            hx-trigger="change"
                            hx-include="closest form"
                        >
                            <option value="">All</option>
                            <option value="Inferno">Inferno</option>
                            <option value="Purgatorio">Purgatorio</option>
                            <option value="Paradiso">Paradiso</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label className="filter-label">Canto</label>
                        <input 
                            type="number"
                            name="canto"
                            className="filter-input"
                            placeholder="Canto number"
                            min="1"
                            max="34"
                            hx-get="/api/search"
                            hx-target="#search-results"
                            hx-trigger="keyup changed delay:300ms"
                            hx-include="closest form"
                        />
                    </div>
                </div>
            </div>
            
            <div className="search-loading">
                <span id="search-loading" className="loading-indicator htmx-indicator">
                    Searching...
                </span>
            </div>
        </form>
    )
}

function SearchResults() {
    return (
        <div id="search-results" className="search-results">
            <div className="search-placeholder">
                <p>Enter search terms above to find tercets in the Divine Comedy.</p>
            </div>
        </div>
    )
}

export function SearchResultsList({ 
    results, 
    query 
}: { 
    results: Tercet[]
    query: string 
}) {
    if (results.length === 0) {
        return (
            <div className="search-no-results">
                <h3>No Results Found</h3>
                <p>No tercets match your search criteria. Try different terms or check your spelling.</p>
            </div>
        )
    }
    
    return (
        <div className="search-results-list">
            <div className="search-summary">
                <h3>Search Results</h3>
                <p>Found {results.length} tercet{results.length !== 1 ? 's' : ''} {query ? `matching "${query}"` : ''}</p>
            </div>
            
            <div className="results-grid">
                {results.map(tercet => (
                    <SearchResultCard key={tercet.id} tercet={tercet} query={query} />
                ))}
            </div>
        </div>
    )
}

function SearchResultCard({ 
    tercet, 
    query 
}: { 
    tercet: Tercet
    query: string 
}) {
    return (
        <article className="search-result-card">
            <header className="result-header">
                <div className="result-location">
                    <span className="result-canticle">{tercet.canticle}</span>
                    <span className="result-canto">Canto {tercet.canto}</span>
                    <span className="result-tercet">Tercet {tercet.tercetNumber}</span>
                </div>
            </header>
            
            <div className="result-content">
                <div className="result-italian">
                    {tercet.lines.map((line, index) => (
                        <p key={index} className="result-line">
                            {highlightText(line, query)}
                        </p>
                    ))}
                </div>
                
                <div className="result-translation">
                    <p className="translation-text">
                        {highlightText(tercet.translation, query)}
                    </p>
                    <p className="translator">—{tercet.translator}</p>
                </div>
            </div>
            
            <footer className="result-actions">
                <a href={`/tercet/${tercet.id}`} className="button button--secondary button--sm">
                    Read
                </a>
                <a href={`/study/${tercet.id}`} className="button button--secondary button--sm">
                    Study
                </a>
                <a href={`/memory/${tercet.id}`} className="button button--secondary button--sm">
                    Memorize
                </a>
            </footer>
        </article>
    )
}

// Utility function to highlight search terms
function highlightText(text: string, query: string): any {
    if (!query || query.length < 2) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return (
        <>
            {parts.map((part, index) => 
                regex.test(part) ? 
                    <mark key={index} className="search-highlight">{part}</mark> : 
                    part
            )}
        </>
    )
}
```

## Building User Preferences

Now let's create a preferences system that allows users to customize their reading experience. This will demonstrate form handling, data persistence, and dynamic interface updates.

Add these preference components to `src/components.tsx`:

```typescript
// ===== USER PREFERENCES COMPONENTS =====

export function PreferencesInterface() {
    return (
        <div className="preferences-interface">
            <PreferencesForm />
            <PreferencesPreview />
        </div>
    )
}

function PreferencesForm() {
    return (
        <form className="preferences-form">
            <header className="preferences-header">
                <h2 className="preferences-title">Reading Preferences</h2>
                <p className="preferences-description">
                    Customize your reading experience to match your study style.
                </p>
            </header>
            
            <div className="preferences-sections">
                <section className="preference-section">
                    <h3 className="section-title">Text Display</h3>
                    
                    <div className="preference-group">
                        <label className="preference-label">
                            Default Translation
                        </label>
                        <select 
                            name="translator"
                            className="preference-select"
                            hx-post="/api/preferences/update"
                            hx-target="#preferences-preview"
                            hx-include="closest form"
                            hx-trigger="change"
                        >
                            <option value="singleton">Charles S. Singleton</option>
                            <option value="longfellow">Henry Wadsworth Longfellow</option>
                            <option value="mandelbaum">Allen Mandelbaum</option>
                        </select>
                    </div>
                    
                    <div className="preference-group">
                        <label className="preference-label">
                            Text Size
                        </label>
                        <select 
                            name="textSize"
                            className="preference-select"
                            hx-post="/api/preferences/update"
                            hx-target="#preferences-preview"
                            hx-include="closest form"
                            hx-trigger="change"
                        >
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                            <option value="extra-large">Extra Large</option>
                        </select>
                    </div>
                    
                    <div className="preference-group">
                        <label className="preference-label">
                            Theme
                        </label>
                        <select 
                            name="theme"
                            className="preference-select"
                            hx-post="/api/preferences/update"
                            hx-target="#preferences-preview"
                            hx-include="closest form"
                            hx-trigger="change"
                        >
                            <option value="light" selected>Light</option>
                            <option value="dark">Dark</option>
                            <option value="sepia">Sepia</option>
                        </select>
                    </div>
                </section>
                
                <section className="preference-section">
                    <h3 className="section-title">Study Options</h3>
                    
                    <div className="preference-group">
                        <label className="preference-checkbox">
                            <input 
                                type="checkbox"
                                name="showLineNumbers"
                                hx-post="/api/preferences/update"
                                hx-target="#preferences-preview"
                                hx-include="closest form"
                                hx-trigger="change"
                            />
                            <span className="checkbox-label">Show line numbers</span>
                        </label>
                    </div>
                    
                    <div className="preference-group">
                        <label className="preference-checkbox">
                            <input 
                                type="checkbox"
                                name="autoReveal"
                                hx-post="/api/preferences/update"
                                hx-target="#preferences-preview"
                                hx-include="closest form"
                                hx-trigger="change"
                            />
                            <span className="checkbox-label">Auto-reveal translations in study mode</span>
                        </label>
                    </div>
                    
                    <div className="preference-group">
                        <label className="preference-checkbox">
                            <input 
                                type="checkbox"
                                name="soundEffects"
                                hx-post="/api/preferences/update"
                                hx-target="#preferences-preview"
                                hx-include="closest form"
                                hx-trigger="change"
                            />
                            <span className="checkbox-label">Enable sound effects</span>
                        </label>
                    </div>
                </section>
                
                <section className="preference-section">
                    <h3 className="section-title">Learning Goals</h3>
                    
                    <div className="preference-group">
                        <label className="preference-label">
                            Daily Study Goal (tercets)
                        </label>
                        <input 
                            type="number"
                            name="dailyGoal"
                            className="preference-input"
                            value="5"
                            min="1"
                            max="50"
                            hx-post="/api/preferences/update"
                            hx-target="#preferences-preview"
                            hx-include="closest form"
                            hx-trigger="keyup changed delay:500ms"
                        />
                    </div>
                    
                    <div className="preference-group">
                        <label className="preference-label">
                            Focus Area
                        </label>
                        <select 
                            name="focusArea"
                            className="preference-select"
                            hx-post="/api/preferences/update"
                            hx-target="#preferences-preview"
                            hx-include="closest form"
                            hx-trigger="change"
                        >
                            <option value="all">Entire Divine Comedy</option>
                            <option value="inferno">Inferno Only</option>
                            <option value="purgatorio">Purgatorio Only</option>
                            <option value="paradiso">Paradiso Only</option>
                        </select>
                    </div>
                </section>
            </div>
            
            <div className="preferences-actions">
                <button 
                    type="button"
                    className="button button--primary"
                    hx-post="/api/preferences/save"
                    hx-include="closest form"
                    hx-target="#save-status"
                >
                    Save Preferences
                </button>
                
                <button 
                    type="button"
                    className="button button--secondary"
                    hx-post="/api/preferences/reset"
                    hx-target="#preferences-preview"
                >
                    Reset to Defaults
                </button>
                
                <div id="save-status" className="save-status"></div>
            </div>
        </form>
    )
}

function PreferencesPreview() {
    return (
        <div id="preferences-preview" className="preferences-preview">
            <PreviewContent />
        </div>
    )
}

function PreviewContent() {
    return (
        <div className="preview-content">
            <h3 className="preview-title">Preview</h3>
            <p className="preview-description">
                Make changes above to see how they affect your reading experience.
            </p>
            
            <div className="preview-tercet">
                <div className="preview-header">
                    <span>Inferno - Canto I, Tercet 1</span>
                </div>
                
                <div className="preview-lines">
                    <p className="preview-line">Nel mezzo del cammin di nostra vita</p>
                    <p className="preview-line">mi ritrovai per una selva oscura,</p>
                    <p className="preview-line">ché la diritta via era smarrita.</p>
                </div>
                
                <div className="preview-translation">
                    <p>In the middle of the journey of our life, I found myself in a dark wood, where the straight way was lost.</p>
                    <p className="preview-translator">—Charles S. Singleton</p>
                </div>
            </div>
        </div>
    )
}

export function PreferencesPreviewUpdate({ 
    preferences 
}: { 
    preferences: UserPreferences 
}) {
    const textSizeClass = `text-${preferences.textSize}`
    const themeClass = `theme-${preferences.theme}`
    
    return (
        <div className={`preview-content ${textSizeClass} ${themeClass}`}>
            <h3 className="preview-title">Preview</h3>
            <p className="preview-description">
                This shows how tercets will appear with your current settings.
            </p>
            
            <div className="preview-tercet">
                <div className="preview-header">
                    <span>Inferno - Canto I, Tercet 1</span>
                    {preferences.showLineNumbers && (
                        <span className="line-numbers">Lines 1-3</span>
                    )}
                </div>
                
                <div className="preview-lines">
                    {preferences.showLineNumbers ? (
                        <>
                            <p className="preview-line"><span className="line-number">1.</span> Nel mezzo del cammin di nostra vita</p>
                            <p className="preview-line"><span className="line-number">2.</span> mi ritrovai per una selva oscura,</p>
                            <p className="preview-line"><span className="line-number">3.</span> ché la diritta via era smarrita.</p>
                        </>
                    ) : (
                        <>
                            <p className="preview-line">Nel mezzo del cammin di nostra vita</p>
                            <p className="preview-line">mi ritrovai per una selva oscura,</p>
                            <p className="preview-line">ché la diritta via era smarrita.</p>
                        </>
                    )}
                </div>
                
                <div className="preview-translation">
                    <p>In the middle of the journey of our life, I found myself in a dark wood, where the straight way was lost.</p>
                    <p className="preview-translator">—{preferences.translator}</p>
                </div>
                
                {preferences.autoReveal && (
                    <div className="preview-note">
                        <small>Auto-reveal is enabled - translations will show automatically in study mode.</small>
                    </div>
                )}
            </div>
            
            <div className="preview-goals">
                <h4>Your Learning Goals</h4>
                <ul>
                    <li>Daily goal: {preferences.dailyGoal} tercets</li>
                    <li>Focus: {preferences.focusArea === 'all' ? 'Entire Divine Comedy' : preferences.focusArea}</li>
                    <li>Sound effects: {preferences.soundEffects ? 'Enabled' : 'Disabled'}</li>
                </ul>
            </div>
        </div>
    )
}

export function SaveStatus({ success, message }: { success: boolean, message: string }) {
    return (
        <div className={`save-message ${success ? 'save-success' : 'save-error'}`}>
            {message}
        </div>
    )
}

// Type definition for user preferences
export type UserPreferences = {
    translator: string
    textSize: 'small' | 'medium' | 'large' | 'extra-large'
    theme: 'light' | 'dark' | 'sepia'
    showLineNumbers: boolean
    autoReveal: boolean
    soundEffects: boolean
    dailyGoal: number
    focusArea: 'all' | 'inferno' | 'purgatorio' | 'paradiso'
}
```

This chapter continues with comprehensive examples of building annotation systems, implementing server endpoints for form handling, and creating sophisticated user interfaces that respond dynamically to user input. The content maintains the literary context while teaching advanced form handling and user experience patterns with htmx.

The chapter concludes with deep reflections on how digital forms enhance scholarly practices and exercises that challenge students to think about the relationship between user input, data persistence, and meaningful interaction with literary texts.