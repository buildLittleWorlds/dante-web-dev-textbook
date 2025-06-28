

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
    {
        id: 4,
        canticle: 'Inferno',
        canto: 3,
        tercetNumber: 1,
        lines: [
            "Per me si va ne la città dolente,",
            "per me si va ne l'etterno dolore,",
            "per me si va tra la perduta gente."
        ],
        translation: "Through me the way into the suffering city, through me the way to the eternal pain, through me the way among the lost people.",
        translator: "Charles S. Singleton"
    },
    {
        id: 5,
        canticle: 'Inferno',
        canto: 3,
        tercetNumber: 2,
        lines: [
            "Giustizia mosse il mio fattore:",
            "fecemi la divina potestate,",
            "la somma sapienza e 'l primo amore."
        ],
        translation: "Justice moved my maker: divine power made me, highest wisdom, and primal love.",
        translator: "Charles S. Singleton"
    },
    {
        id: 6,
        canticle: 'Inferno',
        canto: 5,
        tercetNumber: 1,
        lines: [
            "Stavvi Minòs orribilmente, e ringhia:",
            "esamina le colpe ne l'intrata;",
            "giudica e manda secondo ch'avvinghia."
        ],
        translation: "There stands Minos, horrible and snarling; he examines the crimes at the entrance; he judges and dispatches according to how he girds himself.",
        translator: "Charles S. Singleton"
    },
    {
        id: 7,
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
        id: 8,
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
    },
    {
        id: 9,
        canticle: 'Paradiso',
        canto: 33,
        tercetNumber: 1,
        lines: [
            "Vergine Madre, figlia del tuo figlio,",
            "umile e alta più che creatura,",
            "termine fisso d'etterno consiglio,"
        ],
        translation: "Virgin Mother, daughter of your son, humble and exalted more than any creature, fixed goal of eternal counsel,",
        translator: "Charles S. Singleton"
    }
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

Add the CSS for search interface to your `styles.css`:

```css
/* ===== SEARCH INTERFACE STYLES ===== */

.search-interface {
  max-width: 900px;
  margin: 0 auto;
}

.search-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}

.search-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.search-title {
  font-family: var(--font-secondary);
  color: var(--color-accent);
  margin-bottom: var(--space-3);
}

.search-description {
  color: var(--color-secondary);
  margin: 0;
}

.search-fields {
  display: grid;
  gap: var(--space-6);
}

.search-field {
  display: grid;
  gap: var(--space-2);
}

.search-label {
  font-weight: 600;
  color: var(--color-primary);
}

.search-input {
  padding: var(--space-4);
  font-size: var(--text-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.search-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.filter-group {
  display: grid;
  gap: var(--space-2);
}

.filter-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select,
.filter-input {
  padding: var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: var(--text-base);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.search-loading {
  text-align: center;
  margin-top: var(--space-4);
}

.loading-indicator {
  color: var(--color-secondary);
  font-style: italic;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.htmx-request .loading-indicator {
  opacity: 1;
}

/* Search Results */
.search-results {
  min-height: 200px;
}

.search-placeholder {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-secondary);
  font-style: italic;
}

.search-no-results {
  text-align: center;
  padding: var(--space-8);
  background: var(--color-surface-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.search-no-results h3 {
  color: var(--color-accent);
  margin-bottom: var(--space-3);
}

.search-summary {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.search-summary h3 {
  color: var(--color-accent);
  margin-bottom: var(--space-2);
}

.search-summary p {
  color: var(--color-secondary);
  margin: 0;
}

.results-grid {
  display: grid;
  gap: var(--space-6);
}

.search-result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.search-result-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.result-header {
  background: var(--color-surface-alt);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.result-location {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-size: var(--text-sm);
  color: var(--color-secondary);
}

.result-canticle {
  font-weight: 600;
  color: var(--color-accent);
}

.result-content {
  padding: var(--space-6);
}

.result-italian {
  margin-bottom: var(--space-4);
}

.result-line {
  font-style: italic;
  color: var(--color-primary);
  margin: var(--space-1) 0;
  line-height: 1.6;
}

.result-translation {
  padding-top: var(--space-4);

  ```css
  border-top: 1px solid var(--color-border);
}

.search-highlight {
  background: #ffeb3b;
  color: #333;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}

.result-actions {
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface-alt);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-3);
}

.button--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .search-filters {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .result-location {
    flex-wrap: wrap;
    gap: var(--space-2);
  }
}
```

Now implement the search functionality in your server. Add these routes to `src/index.tsx`:

```typescript
// Search API endpoint
app.get('/api/search', async (c) => {
    const query = c.req.query('query') || ''
    const canticle = c.req.query('canticle') || ''
    const cantoParam = c.req.query('canto') || ''
    const canto = cantoParam ? parseInt(cantoParam) : null
    
    // Filter tercets based on search criteria
    let results = sampleTercets
    
    // Filter by canticle if specified
    if (canticle) {
        results = results.filter(tercet => tercet.canticle === canticle)
    }
    
    // Filter by canto if specified
    if (canto) {
        results = results.filter(tercet => tercet.canto === canto)
    }
    
    // Filter by text query if specified
    if (query && query.length >= 2) {
        const searchTerm = query.toLowerCase()
        results = results.filter(tercet => {
            // Search in Italian text
            const italianText = tercet.lines.join(' ').toLowerCase()
            if (italianText.includes(searchTerm)) return true
            
            // Search in English translation
            const translationText = tercet.translation.toLowerCase()
            if (translationText.includes(searchTerm)) return true
            
            return false
        })
    }
    
    // If no query provided, return empty results
    if (!query && !canticle && !canto) {
        results = []
    }
    
    // Simulate search delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return c.html(<SearchResultsList results={results} query={query} />)
})

// Search page route
app.get('/search', (c) => {
    return c.html(
        <Layout title="Search the Divine Comedy">
            <SearchInterface />
        </Layout>
    )
})
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

Add the CSS for preferences interface:

```css
/* ===== PREFERENCES INTERFACE STYLES ===== */

.preferences-interface {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  max-width: 1200px;
  margin: 0 auto;
}

.preferences-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
}

.preferences-header {
  text-align: center;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.preferences-title {
  font-family: var(--font-secondary);
  color: var(--color-accent);
  margin-bottom: var(--space-3);
}

.preferences-description {
  color: var(--color-secondary);
  margin: 0;
}

.preferences-sections {
  display: grid;
  gap: var(--space-8);
}

.preference-section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  background: var(--color-surface-alt);
}

.section-title {
  font-size: var(--text-lg);
  color: var(--color-accent);
  margin: 0 0 var(--space-4) 0;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.preference-group {
  margin-bottom: var(--space-4);
}

.preference-group:last-child {
  margin-bottom: 0;
}

.preference-label {
  display: block;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.preference-select,
.preference-input {
  width: 100%;
  padding: var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.preference-select:focus,
.preference-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.preference-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.preference-checkbox:hover {
  background: var(--color-surface);
}

.preference-checkbox input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
}

.checkbox-label {
  font-size: var(--text-base);
  color: var(--color-primary);
}

.preferences-actions {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
}

.save-status {
  margin-left: auto;
}

.save-message {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
}

.save-success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.save-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #f44336;
}

/* Preferences Preview */
.preferences-preview {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
  position: sticky;
  top: var(--space-8);
  max-height: calc(100vh - var(--space-16));
  overflow-y: auto;
}

.preview-content {
  transition: all var(--transition-normal);
}

.preview-title {
  color: var(--color-accent);
  margin-bottom: var(--space-3);
}

.preview-description {
  color: var(--color-secondary);
  margin-bottom: var(--space-6);
  font-size: var(--text-sm);
}

.preview-tercet {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
  color: var(--color-secondary);
}

.line-numbers {
  font-weight: 600;
  color: var(--color-accent);
}

.preview-lines {
  margin-bottom: var(--space-4);
}

.preview-line {
  font-style: italic;
  margin: var(--space-1) 0;
  line-height: 1.6;
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.line-number {
  font-size: var(--text-xs);
  color: var(--color-secondary);
  font-weight: 600;
  min-width: 20px;
  font-style: normal;
}

.preview-translation {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.preview-translator {
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-style: italic;
  text-align: right;
  margin-top: var(--space-2);
}

.preview-note {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: var(--radius-md);
  color: #1565c0;
}

.preview-goals {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.preview-goals h4 {
  color: var(--color-accent);
  margin: 0 0 var(--space-3) 0;
  font-size: var(--text-base);
}

.preview-goals ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.preview-goals li {
  padding: var(--space-1) 0;
  color: var(--color-secondary);
  font-size: var(--text-sm);
}

/* Theme variations */
.text-small { font-size: 0.9rem; }
.text-medium { font-size: 1rem; }
.text-large { font-size: 1.1rem; }
.text-extra-large { font-size: 1.25rem; }

.theme-dark {
  background: #1a1a1a;
  color: #e0e0e0;
}

.theme-dark .preview-tercet {
  background: #2a2a2a;
  border-color: #444;
}

.theme-sepia {
  background: #f4f1e8;
  color: #5d4037;
}

.theme-sepia .preview-tercet {
  background: #efebe2;
  border-color: #d7ccc8;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .preferences-interface {
    grid-template-columns: 1fr;
  }
  
  .preferences-preview {
    position: static;
    max-height: none;
  }
  
  .preferences-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .save-status {
    margin-left: 0;
    text-align: center;
  }
}
```

Now implement the preferences endpoints in your server:

```typescript
// Add this at the top of your server file
let userPreferences: UserPreferences = {
    translator: 'Charles S. Singleton',
    textSize: 'medium',
    theme: 'light',
    showLineNumbers: false,
    autoReveal: false,
    soundEffects: false,
    dailyGoal: 5,
    focusArea: 'all'
}

// Preferences API endpoints
app.post('/api/preferences/update', async (c) => {
    const formData = await c.req.formData()
    
    // Update preferences based on form data
    const translator = formData.get('translator') as string
    const textSize = formData.get('textSize') as string
    const theme = formData.get('theme') as string
    const showLineNumbers = formData.get('showLineNumbers') === 'on'
    const autoReveal = formData.get('autoReveal') === 'on'
    const soundEffects = formData.get('soundEffects') === 'on'
    const dailyGoal = parseInt(formData.get('dailyGoal') as string) || 5
    const focusArea = formData.get('focusArea') as string
    
    // Update global preferences object
    userPreferences = {
        translator: translator || userPreferences.translator,
        textSize: (textSize as any) || userPreferences.textSize,
        theme: (theme as any) || userPreferences.theme,
        showLineNumbers,
        autoReveal,
        soundEffects,
        dailyGoal,
        focusArea: (focusArea as any) || userPreferences.focusArea
    }
    
    return c.html(<PreferencesPreviewUpdate preferences={userPreferences} />)
})

app.post('/api/preferences/save', async (c) => {
    // In a real application, this would save to a database
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return c.html(<SaveStatus success={true} message="Preferences saved successfully!" />)
})

app.post('/api/preferences/reset', (c) => {
    // Reset to default preferences
    userPreferences = {
        translator: 'Charles S. Singleton',
        textSize: 'medium',
        theme: 'light',
        showLineNumbers: false,
        autoReveal: false,
        soundEffects: false,
        dailyGoal: 5,
        focusArea: 'all'
    }
    
    return c.html(<PreferencesPreviewUpdate preferences={userPreferences} />)
})

// Preferences page route
app.get('/preferences', (c) => {
    return c.html(
        <Layout title="Reading Preferences">
            <PreferencesInterface />
        </Layout>
    )
})
```

## Building a Smart Annotation System

Let's create one more sophisticated form interface: an annotation system that allows users to add notes to specific tercets. This will demonstrate more complex form handling and dynamic content updates.

Add these annotation components to `src/components.tsx`:

```typescript
// ===== ANNOTATION COMPONENTS =====

export function AnnotationInterface({ tercet }: { tercet: Tercet }) {
    return (
        <div className="annotation-interface">
            <TercetWithAnnotations tercet={tercet} />
            <AnnotationForm tercet={tercet} />
        </div>
    )
}

function TercetWithAnnotations({ tercet }: { tercet: Tercet }) {
    return (
        <article className="annotated-tercet">
            <header className="annotation-header">
                <div className="tercet-meta">
                    <span>{tercet.canticle}</span>
                    <div className="tercet-meta__separator"></div>
                    <span>Canto {tercet.canto}</span>
                    <div className="tercet-meta__separator"></div>
                    <span>Tercet {tercet.tercetNumber}</span>
                </div>
                <h2 className="annotation-title">Annotated Reading</h2>
            </header>
            
            <div className="tercet-content">
                <div className="tercet-lines">
                    {tercet.lines.map((line, index) => (
                        <p key={index} className="tercet-line annotatable-line">
                            {line}
                            <button 
                                className="annotation-marker"
                                hx-get={`/api/annotations/form/${tercet.id}/${index}`}
                                hx-target="#annotation-form-area"
                                hx-swap="innerHTML"
                                title="Add annotation to this line"
                            >
                                +
                            </button>
                        </p>
                    ))}
                </div>
                
                <div className="tercet-translation">
                    <p className="translation-text">{tercet.translation}</p>
                    <p className="translator">—{tercet.translator}</p>
                </div>
            </div>
            
            <div id="annotations-display" className="annotations-display">
                <AnnotationsList tercetId={tercet.id} />
            </div>
        </article>
    )
}

function AnnotationForm({ tercet }: { tercet: Tercet }) {
    return (
        <div className="annotation-form-container">
            <h3 className="form-title">Add Annotation</h3>
            <div id="annotation-form-area" className="annotation-form-area">
                <p className="form-placeholder">
                    Click the + button next to any line to add an annotation.
                </p>
            </div>
        </div>
    )
}

export function AnnotationFormFields({ 
    tercetId, 
    lineIndex 
}: { 
    tercetId: number
    lineIndex: number 
}) {
    const lineLabels = ['First line', 'Second line', 'Third line']
    
    return (
        <form className="annotation-form">
            <div className="form-header">
                <h4>Annotating: {lineLabels[lineIndex]}</h4>
            </div>
            
            <div className="form-fields">
                <div className="field-group">
                    <label htmlFor="annotation-title" className="field-label">
                        Title (optional)
                    </label>
                    <input 
                        type="text"
                        id="annotation-title"
                        name="title"
                        className="field-input"
                        placeholder="Brief title for your note..."
                    />
                </div>
                
                <div className="field-group">
                    <label htmlFor="annotation-content" className="field-label">
                        Your Annotation
                    </label>
                    <textarea 
                        id="annotation-content"
                        name="content"
                        className="field-textarea"
                        rows={4}
                        placeholder="Enter your thoughts, interpretations, or questions about this line..."
                        required
                    ></textarea>
                </div>
                
                <div className="field-group">
                    <label htmlFor="annotation-type" className="field-label">
                        Type
                    </label>
                    <select 
                        id="annotation-type"
                        name="type"
                        className="field-select"
                    >
                        <option value="interpretation">Interpretation</option>
                        <option value="question">Question</option>
                        <option value="connection">Connection to other texts</option>
                        <option value="historical">Historical context</option>
                        <option value="linguistic">Linguistic note</option>
                        <option value="personal">Personal reflection</option>
                    </select>
                </div>
                
                <input type="hidden" name="tercetId" value={tercetId} />
                <input type="hidden" name="lineIndex" value={lineIndex} />
            </div>
            
            <div className="form-actions">
                <button 
                    type="submit"
                    className="button button--primary"
                    hx-post="/api/annotations/create"
                    hx-target="#annotations-display"
                    hx-swap="innerHTML"
                    hx-include="closest form"
                >
                    Save Annotation
                </button>
                
                <button 
                    type="button"
                    className="button button--secondary"
                    onclick="document.getElementById('annotation-form-area').innerHTML = '<p class=\"form-placeholder\">Click the + button next to any line to add an annotation.</p>'"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}

export function AnnotationsList({ 
    tercetId, 
    annotations = [] 
}: { 
    tercetId: number
    annotations?: Annotation[] 
}) {
    if (annotations.length === 0) {
        return (
            <div className="no-annotations">
                <p>No annotations yet. Add some notes to enhance your understanding!</p>
            </div>
        )
    }
    
    return (
        <div className="annotations-list">
            <h3 className="annotations-title">Your Annotations ({annotations.length})</h3>
            
            <div className="annotations-grid">
                {annotations.map(annotation => (
                    <AnnotationCard key={annotation.id} annotation={annotation} />
                ))}
            </div>
        </div>
    )
}

function AnnotationCard({ annotation }: { annotation: Annotation }) {
    const typeColors = {
        interpretation: '#2196f3',
        question: '#ff9800',
        connection: '#4caf50',
        historical: '#9c27b0',
        linguistic: '#f44336',
        personal: '#607d8b'
    }
    
    const lineLabels = ['First line', 'Second line', 'Third line']
    
    return (
        <div className="annotation-card">
            <header className="annotation-card-header">
                <div className="annotation-meta">
                    <span 
                        className="annotation-type"
                        style={{ backgroundColor: typeColors[annotation.type] }}
                    >
                        {annotation.type}
                    </span>
                    <span className="annotation-line">
                        {lineLabels[annotation.lineIndex]}
                    </span>
                </div>
                
                {annotation.title && (
                    <h4 className="annotation-card-title">{annotation.title}</h4>
                )}
            </header>
            
            <div className="annotation-card-content">
                <p>{annotation.content}</p>
            </div>
            
            <footer className="annotation-card-footer">
                <time className="annotation-date">
                    {new Date(annotation.createdAt).toLocaleDateString()}
                </time>
                
                <button 
                    className="annotation-delete"
                    hx-delete={`/api/annotations/${annotation.id}`}
                    hx-target="#annotations-display"
                    hx-confirm="Are you sure you want to delete this annotation?"
                    title="Delete annotation"
                >
                    ×
                </button>
            </footer>
        </div>
    )
}

// Type definition for annotations
export type Annotation = {
    id: number
    tercetId: number
    lineIndex: number
    title?: string
    content: string
    type: 'interpretation' | 'question' | 'connection' | 'historical' | 'linguistic' | 'personal'
    createdAt: string
}
```

Add the CSS for annotations:

```css
/* ===== ANNOTATION STYLES ===== */

.annotation-interface {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
  max-width: 1400px;
  margin: 0 auto;
}

.annotated-tercet {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.annotation-header {
  background: linear-gradient(135deg, #6a1b9a, #8e24aa);
  color: white;
  padding: var(--space-6);
  text-align: center;
}

.annotation-title {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  font-weight: 400;
  margin: var(--space-2) 0;
}

.annotatable-line {
  position: relative;
  padding-right: var(--space-10);
  transition: background-color var(--transition-fast);
}

.annotatable-line:hover {
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
}

.annotation-marker {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: bold;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.annotatable-line:hover .annotation-marker {
  opacity: 1;
}

.annotation-marker:hover {
  background: var(--color-accent);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.annotations-display {
  padding: var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-alt);
}

.annotation-form-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  position: sticky;
  top: var(--space-8);
  max-height: calc(100vh - var(--space-16));
  overflow-y: auto;
}

.form-title {
  color: var(--color-accent);
  margin-bottom: var(--space-4);
}

.annotation-form-area {
  min-height: 300px;
}

.form-placeholder {
  color: var(--color-secondary);
  font-style: italic;
  text-align: center;
  padding: var(--space-8);
}

.annotation-form {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  background: var(--color-surface-alt);
}

.form-header h4 {
  color: var(--color-accent);
  margin: 0 0 var(--space-4) 0;
}

.form-fields {
  display: grid;
  gap: var(--space-4);
}

.field-group {
  display: grid;
  gap: var(--space-2);
}

.field-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--text-sm);
}

.field-input,
.field-textarea,
.field-select {
  padding: var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

/* Annotations List */
.no-annotations {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-secondary);
  font-style: italic;
}

.annotations-title {
  color: var(--color-accent);
  margin-bottom: var(--space-4);
}

.annotations-grid {
  display: grid;
  gap: var(--space-4);
}

.annotation-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all var(--transition-normal);
}

.annotation-card:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.annotation-card-header {
  margin-bottom: var(--space-3);
}

.annotation-meta {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  margin-bottom: var(--space-2);
}

.annotation-type {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
}

.annotation-line {
  font-size: var(--text-xs);
  color: var(--color-secondary);
  background: var(--color-surface-alt);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.annotation-card-title {
  font-size: var(--text-base);
  color: var(--color-primary);
  margin: 0;
}

.annotation-card-content p {
  margin: 0;
  line-height: 1.5;
  color: var(--color-primary);
}

.annotation-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.annotation-date {
  font-size: var(--text-xs);
  color: var(--color-secondary);
}

.annotation-delete {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--color-error);
  color: white;
  cursor: pointer;
  font-size: var(--text-base);
  font-weight: bold;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.annotation-delete:hover {
  background: #b71c1c;
  transform: scale(1.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .annotation-interface {
    grid-template-columns: 1fr;
  }
  
  .annotation-form-container {
    position: static;
    max-height: none;
  }
  
  .annotatable-line {
    padding-right: var(--space-6);
  }
  
  .annotation-marker {
    opacity: 1;
    position: static;
    transform: none;
    margin-left: var(--space-2);
  }
  
  .form-actions {
    flex-direction: column;
  }
}
```

Finally, implement the annotation endpoints:

```typescript
// Simple in-memory storage for annotations (in production, use a database)
let annotations: Annotation[] = []
let annotationIdCounter = 1

// Annotation API endpoints
app.get('/api/annotations/form/:tercetId/:lineIndex', (c) => {
    const tercetId = parseInt(c.req.param('tercetId'))
    const lineIndex = parseInt(c.req.param('lineIndex'))
    
    return c.html(<AnnotationFormFields tercetId={tercetId} lineIndex={lineIndex} />)
})

app.post('/api/annotations/create', async (c) => {
    const formData = await c.req.formData()
    
    const newAnnotation: Annotation = {
        id: annotationIdCounter++,
        tercetId: parseInt(formData.get('tercetId') as string),
        lineIndex: parseInt(formData.get('lineIndex') as string),
        title: formData.get('title') as string || undefined,
        content: formData.get('content') as string,
        type: formData.get('type') as any,
        createdAt: new Date().toISOString()
    }
    
    annotations.push(newAnnotation)
    
    // Return updated annotations list for this tercet
    const tercetAnnotations = annotations.filter(a => a.tercetId === newAnnotation.tercetId)
    return c.html(<AnnotationsList tercetId={newAnnotation.tercetId} annotations={tercetAnnotations} />)
})

app.delete('/api/annotations/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const annotation = annotations.find(a => a.id === id)
    
    if (!annotation) {
        return c.html('<p class="error-text">Annotation not found.</p>', 404)
    }
    
    annotations = annotations.filter(a => a.id !== id)
    
    // Return updated annotations list for this tercet
    const tercetAnnotations = annotations.filter(a => a.tercetId === annotation.tercetId)
    return c.html(<AnnotationsList tercetId={annotation.tercetId} annotations={tercetAnnotations} />)
})

// Annotation page route
app.get('/annotate/:id', (c) => {
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
        <Layout title={`Annotate: ${tercet.canticle} - Canto ${tercet.canto}, Tercet ${tercet.tercetNumber}`}>
            <AnnotationInterface tercet={tercet} />
        </Layout>
    )
})
```

## Creating Navigation Links

Finally, let's update your site header to include links to all these new features. Update the `SiteHeader` component in `src/components.tsx`:

```typescript
export function SiteHeader() {
    return (
        <header className="site-header">
            <h1 className="site-title">La Divina Commedia</h1>
            <p className="site-subtitle">A Digital Memorization Journey</p>
            
            <nav className="site-nav">
                <a href="/" className="nav-link">Home</a>
                <a href="/index" className="nav-link">Browse</a>
                <a href="/search" className="nav-link">Search</a>
                <a href="/preferences" className="nav-link">Preferences</a>
            </nav>
        </header>
    )
}
```

Add the CSS for site navigation:

```css
.site-nav {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: var(--space-6);
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .site-nav {
    gap: var(--space-3);
  }
  
  .nav-link {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }
}
```

Also, update your navigation components to include annotation links:

```typescript
// Add this to your TercetNavigation mode switcher
<div className="nav__mode-switcher">
    <a href={`/study/${currentId}`} className="button button--ghost">
        Study Mode
    </a>
    <a href={`/memory/${currentId}`} className="button button--ghost">
        Memory Training
    </a>
    <a href={`/annotate/${currentId}`} className="button button--ghost">
        Annotate
    </a>
    <a href="/index" className="button button--ghost">
        Browse All
    </a>
</div>
```

## Dante Deep Dive: Forms as Scholarly Practice

The form interfaces we've built reflect fundamental practices in literary scholarship and learning.

### Search as Literary Discovery

The search interface mirrors traditional concordances and indexes that scholars have used for centuries to find specific passages, trace themes, or locate quotations. But digital search offers capabilities that print indexes cannot:

- **Simultaneous text and translation search** allows finding passages in either language
- **Flexible filtering** enables exploration by structural elements (canticle, canto)
- **Instant results** support exploratory, iterative inquiry

The highlighting of search terms reflects the scholarly practice of marking important passages, but made dynamic and contextual.

### Preferences as Personal Editions

Historically, serious readers created personal copies of important texts—annotating margins, underlining key passages, adding cross-references. Your preferences system digitizes this practice, allowing readers to create personalized editions that reflect their learning needs and aesthetic preferences.

The immediate preview functionality serves the same purpose as mock-ups in traditional publishing: ensuring that design choices serve readability and comprehension.

### Annotation as Active Reading

The annotation system recreates the marginalia tradition that has been central to literary study since ancient times. Medieval manuscripts often contain multiple layers of commentary from different readers across centuries. Your digital system enables similar layering while organizing notes by type and making them searchable.

The line-specific annotation approach reflects close reading practices, encouraging attention to individual verses rather than general impressions.

## Exercises and Reflection

### Technical Exercises

1. **Enhance Search Functionality**: Add more sophisticated search features:
   - Fuzzy matching for misspelled words
   - Synonym matching (e.g., "dark" matches "oscura")
   - Regular expression support for advanced users
   - Save and recall previous searches

2. **Extend Preferences**: Add more customization options:
   - Custom color themes
   - Font family selection
   - Reading speed preferences for auto-advance features
   - Notification settings

3. **Improve Annotations**: Add collaborative features:
   - Public/private annotation settings
   - Annotation sharing between users
   - Community annotation highlighting
   - Export annotations to standard formats

### Reflection Questions

1. **Form Design and User Experience**: How do well-designed forms change the relationship between readers and texts? What makes a form feel helpful rather than intrusive?

2. **Personalization vs. Standardization**: What are the benefits and risks of allowing extensive customization of reading interfaces? How might personal preferences affect interpretation?

3. **Digital vs. Physical Annotation**: How does digital annotation compare to writing in the margins of physical books? What are the unique affordances of each medium?

4. **Search and Serendipity**: Does powerful search capability change how we encounter texts? What is lost and gained when we can instantly find any passage?

### Extended Projects

1. **Advanced Analytics**: Create a dashboard that analyzes user behavior:
   - Track which tercets are most searched
   - Identify common annotation themes
   - Show reading progress over time
   - Suggest related passages based on user interests

2. **Import/Export Features**: Build interfaces for:
   - Importing annotations from other tools
   - Exporting notes in academic citation formats
   - Sharing reading lists and preferences
   - Backing up personal data

3. **Accessibility Enhancement**: Add features for diverse users:
   - Voice input for searches and annotations
   - Screen reader optimization
   - Dyslexia-friendly formatting options
   - Multilingual interface support

## Looking Forward

In our next chapter, we'll add the final layer of interactivity by incorporating Alpine.js for client-side state management and interface polish. You'll learn to create smooth animations, manage complex UI state, and build the real-time features that will make your application feel truly responsive.

We'll also begin implementing the foundation for spaced repetition by tracking user progress and building the data structures that will support intelligent learning algorithms.

But take a moment to appreciate what you've built in this chapter:

- **Intelligent search** that finds content across multiple data fields
- **Real-time form validation** with instant user feedback  
- **Dynamic preferences** that update interfaces immediately
- **Sophisticated annotation systems** that support scholarly practices
- **Progressive enhancement** that works for all users and devices

Most importantly, you've learned to think about forms not as simple data collection tools, but as interfaces for dialogue—ways for users to express intent, customize experience, and actively participate in their learning journey.

Your application now responds not just to clicks, but to the full range of user input. Like Dante's journey through the afterlife, your users can now shape their own path through the text, creating personal meaning through interaction.

In the poet's words from *Purgatorio*: *"Libertà va cercando, ch'è sì cara, / come sa chi per lei vita rifiuta"*—"He goes seeking freedom, which is so precious, as he knows who gives up life for it."

Your forms have given users freedom to shape their own learning experience. In the next chapter, we'll make that experience even more engaging and responsive.

---