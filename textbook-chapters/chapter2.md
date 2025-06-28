

# Chapter 2: Your First Server with Hono

*"O voi che siete in piccioletta barca, / desiderosi d'ascoltar, seguiti / dietro al mio legno che cantando varca"*

*O you who are in a little bark, eager to hear, following behind my ship that singing makes its way*

In Paradiso II, Dante addresses readers who have followed him this far, warning that the journey ahead requires greater preparation. Similarly, having created your first static web page, you're ready for the next challenge: building dynamic applications that respond to users and generate content on demand.

This chapter introduces you to server-side programming with Hono, a TypeScript framework that makes web development feel almost literary in its elegance. You'll learn to create endpoints that serve different parts of Dante's text, handle user requests, and begin building the interactive features that will power your memorization application.

## Learning Objectives

By the end of this chapter, you will:

- Understand the fundamental concepts of client-server architecture
- Write TypeScript code that generates dynamic HTML responses
- Create multiple server endpoints that serve different content
- Handle URL parameters to customize responses
- Understand how HTTP requests and responses work
- Build the foundation for a content management system for the *Divine Comedy*

## From Static to Dynamic: Understanding Web Architecture

Before we start coding, let's understand the conceptual shift we're making. Your first web page was static—the same HTML and CSS files were served to every visitor. While beautiful and functional, static pages can't respond to user input or provide personalized experiences.

Dynamic web applications work differently. When someone visits your site, your server:

1. **Receives a request** specifying what the user wants
2. **Processes that request** using your application logic
3. **Generates a response** tailored to that specific request
4. **Sends the response** back to the user's browser

This request-response cycle is the heartbeat of all web applications, from simple blogs to complex social networks.

### Why This Matters for Literary Study

Think about how scholars have traditionally engaged with Dante's text. A printed edition provides the same experience to every reader—the same page layout, the same annotations, the same supplementary materials.

But imagine a digital edition that could:

- Show different translations based on the reader's preference
- Provide contextual notes that appear only when relevant
- Track which cantos a student has studied
- Generate personalized study sequences based on learning progress
- Connect related passages across the three canticles

This kind of adaptive, personalized literary experience requires dynamic web applications.

## Understanding TypeScript

TypeScript is a superset of JavaScript that adds static type checking. For humanities students, it's helpful to think of TypeScript as adding scholarly rigor to programming—it helps catch errors and makes code more self-documenting.

Consider this simple example:

```typescript
// JavaScript (error-prone)
function getCantoTitle(number) {
    return "Canto " + number;
}

// TypeScript (more precise)
function getCantoTitle(number: number): string {
    return "Canto " + number;
}
```

The TypeScript version explicitly states that `number` must be a number and the function returns a string. This prevents errors like accidentally passing text where a number is expected.

### Why TypeScript for Literature Students?

TypeScript's emphasis on explicit contracts and clear documentation aligns with scholarly practice. Just as academic writing requires precise citations and clear argumentation, TypeScript requires precise type declarations and explicit interfaces.

When you're managing complex literary data—tracking cantos, line numbers, translations, and scholarly apparatus—TypeScript's type system prevents the small errors that can compound into major problems.

## Building Your First Server Routes

Let's start building endpoints that serve different parts of Dante's text. We'll begin by modifying your existing server to handle multiple routes.

Replace the contents of `src/index.ts` with:

```typescript
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

// Define types for our Dante data structures
type Tercet = {
    id: number
    canticle: 'Inferno' | 'Purgatorio' | 'Paradiso'
    canto: number
    tercetNumber: number
    lines: [string, string, string]
    translation: string
    translator: string
}

// Sample data - in later chapters, this will come from a database
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
    }
]

const app = new Hono()

// Serve static files from the public directory
app.use('/*', serveStatic({ root: './public' }))

// Home route - serves our main page
app.get('/', (c) => {
    return c.redirect('/index.html')
})

// API route to get all tercets
app.get('/api/tercets', (c) => {
    return c.json(sampleTercets)
})

// API route to get a specific tercet by ID
app.get('/api/tercets/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.json({ error: 'Tercet not found' }, 404)
    }
    
    return c.json(tercet)
})

// Route to display a tercet as HTML
app.get('/tercet/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html('<h1>Tercet not found</h1>', 404)
    }
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${tercet.canticle} - Canto ${tercet.canto}, Tercet ${tercet.tercetNumber}</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <main>
            <header>
                <h1>La Divina Commedia</h1>
                <p class="subtitle">A Digital Memorization Journey</p>
            </header>
            
            <nav class="tercet-navigation">
                <a href="/tercet/${id - 1}" ${id <= 1 ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>← Previous</a>
                <span class="current-tercet">Tercet ${id}</span>
                <a href="/tercet/${id + 1}" ${id >= sampleTercets.length ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>Next →</a>
            </nav>
            
            <section class="tercet-display">
                <div class="canto-info">
                    <span class="canticle">${tercet.canticle}</span>
                    <span class="canto-number">Canto ${tercet.canto}</span>
                    <span class="tercet-number">Tercet ${tercet.tercetNumber}</span>
                </div>
                
                <div class="tercet">
                    ${tercet.lines.map(line => `<p class="line">${line}</p>`).join('')}
                </div>
                
                <div class="translation">
                    <p class="translation-text">${tercet.translation}</p>
                    <p class="translator">—${tercet.translator}</p>
                </div>
            </section>
        </main>
    </body>
    </html>
    `
    
    return c.html(html)
})

export default app
```

Now let's add some CSS for the navigation. Add this to your `styles.css` file:

```css
.tercet-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding: 1rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.tercet-navigation a {
    color: var(--accent-color);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid var(--accent-color);
    transition: all 0.3s ease;
}

.tercet-navigation a:hover {
    background: var(--accent-color);
    color: white;
}

.current-tercet {
    font-weight: bold;
    color: var(--primary-color);
}
```

## Exploring Your Dynamic Server

Start your server with `bun dev` and explore what you've built:

1. Visit `http://localhost:3000/tercet/1` to see the first tercet
2. Use the navigation buttons to move between tercets
3. Try `http://localhost:3000/api/tercets` to see the raw JSON data
4. Try `http://localhost:3000/api/tercets/2` to see a specific tercet's data

### Understanding the Code

Let's examine the key concepts demonstrated in this server:

**Type Definitions**: The `Tercet` type defines the structure of our data. This is like creating a formal schema for how we represent Dante's text digitally.

**Route Parameters**: The `:id` in `/tercet/:id` creates a parameter that users can change. This allows one endpoint to serve many different tercets.

**Data Lookup**: The `find` method searches our array for a tercet with a matching ID, demonstrating how servers process requests and return relevant data.

**HTML Generation**: The `/tercet/:id` endpoint generates complete HTML pages dynamically, inserting data into a template.

**Error Handling**: When a tercet isn't found, we return appropriate error responses with HTTP status codes.

## Enhancing with JSX

While string concatenation works for simple HTML, it becomes unwieldy for complex pages. JSX (JavaScript XML) provides a more elegant solution. Let's refactor our server to use JSX for HTML generation.

First, rename your server file from `src/index.ts` to `src/index.tsx` (the `.tsx` extension enables JSX support).

Update your `package.json` to reflect this change:

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.tsx"
  }
}
```

Now let's refactor the server to use JSX:

```typescript
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

// Type definitions remain the same
type Tercet = {
    id: number
    canticle: 'Inferno' | 'Purgatorio' | 'Paradiso'
    canto: number
    tercetNumber: number
    lines: [string, string, string]
    translation: string
    translator: string
}

// Sample data remains the same
const sampleTercets: Tercet[] = [
    // ... (same as before)
]

const app = new Hono()

// Serve static files from the public directory
app.use('/*', serveStatic({ root: './public' }))

// Component for rendering a tercet page
function TercetPage({ tercet, currentId }: { tercet: Tercet, currentId: number }) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{tercet.canticle} - Canto {tercet.canto}, Tercet {tercet.tercetNumber}</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <main>
                    <header>
                        <h1>La Divina Commedia</h1>
                        <p className="subtitle">A Digital Memorization Journey</p>
                    </header>
                    
                    <nav className="tercet-navigation">
                        <a 
                            href={`/tercet/${currentId - 1}`}
                            style={currentId <= 1 ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                        >
                            ← Previous
                        </a>
                        <span className="current-tercet">Tercet {currentId}</span>
                        <a 
                            href={`/tercet/${currentId + 1}`}
                            style={currentId >= sampleTercets.length ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                        >
                            Next →
                        </a>
                    </nav>
                    
                    <section className="tercet-display">
                        <div className="canto-info">
                            <span className="canticle">{tercet.canticle}</span>
                            <span className="canto-number">Canto {tercet.canto}</span>
                            <span className="tercet-number">Tercet {tercet.tercetNumber}</span>
                        </div>
                        
                        <div className="tercet">
                            {tercet.lines.map((line, index) => (
                                <p key={index} className="line">{line}</p>
                            ))}
                        </div>
                        
                        <div className="translation">
                            <p className="translation-text">{tercet.translation}</p>
                            <p className="translator">—{tercet.translator}</p>
                        </div>
                    </section>
                </main>
            </body>
        </html>
    )
}

// Home route
app.get('/', (c) => {
    return c.redirect('/index.html')
})

// API routes remain the same
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

// Route to display a tercet as HTML using JSX
app.get('/tercet/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const tercet = sampleTercets.find(t => t.id === id)
    
    if (!tercet) {
        return c.html(<h1>Tercet not found</h1>, 404)
    }
    
    return c.html(<TercetPage tercet={tercet} currentId={id} />)
})

export default app
```

## The Literary Significance of What We've Built

Let's pause to consider the literary and scholarly implications of your server architecture.

### Digital Editions and Hypertext

Your tercet navigation system embodies the concept of hypertext—non-linear reading that allows users to follow their own paths through a text. This isn't just a technological convenience; it represents a fundamental shift in how we can engage with literary works.

Traditional print editions force linear reading, but Dante's poem itself contains numerous cross-references and recursive structures. Your digital edition allows readers to follow these connections dynamically, perhaps jumping to related tercets, parallel passages, or thematic groupings.

### Componentization as Editorial Practice

The JSX component structure mirrors editorial practices in critical editions. Just as editors separate:

- **Base text** (the tercet itself)
- **Apparatus** (canto information, line numbers)
- **Commentary** (translations, notes)

Your code separates these concerns into reusable components that can be combined in different ways for different purposes.

### API Design as Scholarly Architecture

Your API endpoints (`/api/tercets`, `/api/tercets/:id`) create a structured way to access Dante's text programmatically. This is more than technical convenience—it's creating a research infrastructure.

Imagine scholars who could:

- Query all tercets containing specific words or phrases
- Analyze metrical patterns across cantos
- Track character appearances throughout the journey
- Generate statistical analyses of Dante's vocabulary
- Create visualizations of the poem's structure

Your API architecture makes these kinds of computational literary analysis possible.

## Building a Canto Index

Let's extend our server to provide a more comprehensive view of Dante's work. We'll create an index page that shows all available cantos and tercets.

Add this route to your server:

```typescript
// Component for the canto index
function CantoIndex({ tercets }: { tercets: Tercet[] }) {
    // Group tercets by canticle and canto
    const groupedTercets = tercets.reduce((acc, tercet) => {
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
    
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Divine Comedy - Canto Index</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <main>
                    <header>
                        <h1>La Divina Commedia</h1>
                        <p className="subtitle">Canto Index</p>
                    </header>
                    
                    <div className="canto-index">
                        {Object.values(groupedTercets).map((group, index) => (
                            <div key={index} className="canto-group">
                                <h2 className="canto-title">
                                    {group.canticle} - Canto {group.canto}
                                </h2>
                                <div className="tercet-list">
                                    {group.tercets.map(tercet => (
                                        <a 
                                            key={tercet.id} 
                                            href={`/tercet/${tercet.id}`}
                                            className="tercet-link"
                                        >
                                            <div className="tercet-preview">
                                                <span className="tercet-number">Tercet {tercet.tercetNumber}</span>
                                                <span className="first-line">{tercet.lines[0]}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </body>
        </html>
    )
}

// Add this route to your server
app.get('/index', (c) => {
    return c.html(<CantoIndex tercets={sampleTercets} />)
})
```

Add the corresponding CSS to your `styles.css`:

```css
.canto-index {
    display: grid;
    gap: 2rem;
}

.canto-group {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 1.5rem;
}

.canto-title {
    font-family: 'Cormorant Garamond', serif;
    color: var(--accent-color);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.tercet-list {
    display: grid;
    gap: 0.5rem;
}

.tercet-link {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
}

.tercet-link:hover {
    background: #f9f9f9;
    border-color: var(--accent-color);
}

.tercet-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tercet-number {
    font-weight: bold;
    color: var(--accent-color);
    min-width: 80px;
}

.first-line {
    font-style: italic;
    color: var(--primary-color);
    flex: 1;
    margin-left: 1rem;
}
```

Visit `http://localhost:3000/index` to see your new canto index!

## Error Handling and Edge Cases

Professional web applications must handle errors gracefully. Let's improve our error handling:

```typescript
// Enhanced error handling component
function ErrorPage({ error, statusCode }: { error: string, statusCode: number }) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Error - Divine Comedy</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <main>
                    <header>
                        <h1>La Divina Commedia</h1>
                        <p className="subtitle">A Digital Memorization Journey</p>
                    </header>
                    
                    <section className="error-display">
                        <h2>Error {statusCode}</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <a href="/" className="button">Return Home</a>
                            <a href="/index" className="button">Browse Cantos</a>
                        </div>
                    </section>
                </main>
            </body>
        </html>
    )
}

// Update the tercet route with better error handling
app.get('/tercet/:id', (c) => {
    const idParam = c.req.param('id')
    const id = parseInt(idParam)
    
    // Check if ID is a valid number
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
    
    return c.html(<TercetPage tercet={tercet} currentId={id} />)
})
```

Add the error styling to your CSS:

```css
.error-display {
    text-align: center;
    padding: 3rem 2rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.error-display h2 {
    color: var(--accent-color);
    margin-bottom: 1rem;
}

.error-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.button {
    padding: 0.75rem 1.5rem;
    background: var(--accent-color);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s ease;
}

.button:hover {
    background: var(--primary-color);
}
```

## Understanding HTTP Status Codes

HTTP status codes communicate the result of requests. Here are the most important ones for our application:

- **200 OK**: Request successful, content returned
- **201 Created**: Resource successfully created
- **400 Bad Request**: Client sent invalid data
- **404 Not Found**: Requested resource doesn't exist
- **500 Internal Server Error**: Server encountered an error

Using appropriate status codes helps both users and other applications understand what happened with each request.

## Dante Deep Dive: Structure and Navigation

Our server architecture reflects the careful structure of Dante's *Divine Comedy*. The poem's organization—three canticles, each with 33 cantos (plus the introductory canto in Inferno), each canto containing multiple tercets—provides a natural hierarchy for digital navigation.

### The Significance of Tercets

Dante's choice to write in tercets (three-line stanzas) wasn't arbitrary. The number three held profound theological significance in medieval Christianity, representing the Trinity. By organizing our application around tercets as fundamental units, we're respecting both the poem's formal structure and its spiritual architecture.

### Digital Pilgrimage

Your navigation system creates a digital parallel to Dante's pilgrimage. Just as Dante moves progressively through Hell, Purgatory, and Paradise, users of your application can follow their own learning journey through the text. The "Previous" and "Next" buttons become more than mere interface elements—they're the digital equivalent of Dante's footsteps on his otherworldly path.

### Hypertext and Medieval Commentary

Medieval manuscripts of Dante's work often included extensive marginal commentary and cross-references. Your API endpoints and linking structure create similar possibilities for digital commentary and cross-reference. Future versions of your application could link related tercets, provide scholarly annotations, or connect passages that echo across different canticles.

## Exercises and Reflection

### Technical Exercises

1. **Extend the Data Model**: Add fields to the `Tercet` type for:
   - Rhyme scheme information
   - Scholarly notes or commentary
   - Keywords or themes
   - Cross-references to other tercets

2. **Create New Endpoints**: Build additional routes for:
   - `/canticle/:name` - Show all cantos from a specific canticle
   - `/search?q=term` - Search tercets for specific words
   - `/random` - Display a random tercet

3. **Improve Error Handling**: Add validation for:
   - Invalid canticle names
   - Out-of-range canto numbers
   - Malformed search queries

### Reflection Questions

1. **Digital Structure**: How does organizing Dante's text as data (in TypeScript types and JSON) change your understanding of the poem's structure?

2. **Navigation and Reading**: How might non-linear navigation through a text change the reading experience? What is gained and lost compared to traditional book reading?

3. **Accessibility**: How could server-side rendering (generating HTML on the server) make classical texts more accessible to different audiences?

4. **Scholarly Applications**: What kinds of literary research become possible when texts are structured as data and accessible through APIs?

### Extended Projects

1. **Multi-Language Support**: Research different translations of Dante and modify your server to support multiple translators and languages.

2. **Thematic Organization**: Create routes that group tercets by theme (e.g., all references to light, all character encounters, all geographical references).

3. **Performance Optimization**: Research and implement caching strategies to make your server respond faster to repeated requests.

## Looking Forward

In our next chapter, we'll transform your server from a static data provider to a dynamic application that responds to user input. You'll learn to create beautiful, interactive user interfaces using HTML, CSS, and JSX that rival any modern web application.

We'll also begin implementing the features that will make your application truly useful for memorization: user progress tracking, personalized study sessions, and the foundation for the spaced repetition algorithm that will optimize learning.

But take a moment to appreciate what you've accomplished. You've built a web server that can:

- Serve dynamic content based on user requests
- Handle errors gracefully with appropriate feedback
- Organize complex literary data in accessible formats
- Generate beautiful HTML interfaces using modern TypeScript
- Provide APIs that other applications could use for research

Most importantly, you've created the technological foundation for a new kind of engagement with classical literature—one that respects the text's traditional structure while enabling entirely new forms of interaction and study.

Your server is no longer just serving static files; it's generating personalized literary experiences. Like Dante's journey through the realms of the afterlife, your application creates a unique path for each user while maintaining the essential structure and meaning of the original work.

In the poet's words: *"Quali colombe dal disio chiamate / con l'ali alzate e ferme al dolce nido / vegnon per l'aere, dal voler portate"*—"As doves called by desire, with wings raised and steady, come through the air, carried by their will to their sweet nest."

Your code now has wings. In the next chapter, we'll teach it to fly.

---