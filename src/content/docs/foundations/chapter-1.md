---
title: "Chapter 1: Why These Technologies Matter for Humanities Students"
description: Introduction to the technology stack and building your first Dante web page
---

*"Nel mezzo del cammin di nostra vita / mi ritrovai per una selva oscura, / ché la diritta via era smarrita."*

*In the middle of the journey of our life, I found myself in a dark wood, where the straight way was lost.*

Dante's opening lines describe a moment of disorientation—finding oneself lost in unfamiliar territory. Many humanities students feel similarly when confronted with programming and web development. The landscape seems foreign, the path unclear, the destination uncertain.

But what if learning to code could actually deepen your engagement with the texts you love? What if building software became a new form of close reading, a way of understanding literature from the inside out?

This chapter introduces you to the technologies we'll use to build a complete Dante memorization application. But more importantly, it shows you why these particular tools—htmx, Hono, TypeScript, and Bun—represent a revolution in how humanities students can engage with programming.

## Learning Objectives

By the end of this chapter, you will:

- Understand how modern web technologies can enhance literary study
- Set up a complete development environment on your computer
- Create your first web page displaying Dante's poetry
- Recognize how HTML, CSS, and JavaScript work together
- See the connection between code structure and textual organization
- Feel confident that programming is an accessible skill for humanities students

## The Digital Humanities Revolution

Before we write our first line of code, let's address a fundamental question: Why should English students learn to program?

The answer lies in understanding how technology is transforming humanities scholarship. Digital humanities isn't just about using computers—it's about recognizing that computational thinking can reveal new dimensions of literary experience.

Consider what happens when you memorize poetry the traditional way. You read lines repeatedly, gradually internalizing rhythm and meaning. Memory becomes a form of interpretation, as patterns emerge through repetition. The poem takes residence in your mind, available for contemplation at any moment.

Now imagine enhancing this process with software that:

- Presents poems at scientifically optimal intervals for memory retention
- Tracks your progress through complex literary works
- Reveals patterns across cantos and canticles
- Connects your personal reading journey with centuries of scholarship
- Makes the beauty of classical texts accessible through modern interfaces

This isn't about replacing traditional study—it's about augmenting it. The computer becomes a collaborator in the ancient practice of slow, deep reading.

### Why These Technologies?

The web development landscape can seem overwhelming, with new frameworks appearing monthly. But we've chosen our tools deliberately:

**htmx** represents a return to the web's roots. Instead of complex JavaScript frameworks that treat HTML as an afterthought, htmx enhances HTML itself. For humanities students comfortable with marking up texts, this feels natural and intuitive.

**Hono** is a server framework that prioritizes clarity and simplicity. Reading Hono code feels like reading well-structured prose—logical, elegant, purposeful.

**TypeScript** catches errors before they become frustrating problems. It's like having a vigilant editor checking your work, preventing the small mistakes that can derail a programming session.

**Bun** is a modern JavaScript runtime that starts fast and stays responsive. It eliminates much of the complexity that has historically made web development intimidating for newcomers.

Together, these technologies form a stack that's both beginner-friendly and professionally powerful. You'll learn skills directly applicable to modern software development while working on a project that matters to your academic interests.

## Setting Up Your Development Environment

Let's begin with the practical work of getting your computer ready for development. Unlike many technical books that rush through setup, we'll take time to understand each step and its purpose.

### Installing Bun

Bun is our JavaScript runtime—the software that will execute the code we write. It combines several tools that were traditionally separate, making the development process much smoother.

**On macOS or Linux:**
Open your terminal application and run:

```bash
curl -fsSL https://bun.sh/install | bash
```

**On Windows:**
You have two options:

1. Use Windows Subsystem for Linux (WSL) and run the same command as above
2. Use PowerShell and run:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

After installation, restart your terminal and verify that Bun is working:

```bash
bun --version
```

You should see a version number printed to the console.

### Understanding the Terminal

If you're new to using the command line, don't worry—we'll only use a few simple commands. Think of the terminal as a text-based way to interact with your computer, similar to how you might navigate folders in Finder or File Explorer, but using typed commands instead of clicking.

The basic commands you'll need:

- `ls` (or `dir` on Windows): List files in the current directory
- `cd folder-name`: Change into a directory
- `cd ..`: Go up one directory level
- `pwd`: Show your current location

### Creating Your First Project

Let's create our first project. In your terminal, navigate to where you'd like to keep your programming projects (perhaps a new folder called "code" in your home directory), then run:

```bash
bun create hono dante-memorization
```

This command creates a new project using the Hono framework template. You'll see output indicating that files are being created and dependencies installed.

Navigate into your new project:

```bash
cd dante-memorization
```

Take a moment to explore what was created:

```bash
ls -la
```

You'll see several files and folders:

- `src/`: Contains our application code
- `public/`: Contains files served directly to browsers
- `package.json`: Describes our project and its dependencies
- `tsconfig.json`: Configures TypeScript

## Your First Web Page with Dante

Now let's create something meaningful. We'll build a simple web page that displays the opening tercet of the *Inferno*—the same lines that opened this chapter.

### Understanding HTML Structure

HTML (HyperText Markup Language) is the foundation of all web pages. For humanities students, HTML should feel familiar—it's a way of marking up text to indicate structure and meaning, not unlike the editorial annotations you've seen in critical editions.

Create a new file called `index.html` in the `public` folder of your project:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dante's Divine Comedy - Memorization App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main>
        <header>
            <h1>La Divina Commedia</h1>
            <p class="subtitle">A Digital Memorization Journey</p>
        </header>
        
        <section class="tercet-display">
            <div class="canto-info">
                <span class="canticle">Inferno</span>
                <span class="canto-number">Canto I</span>
                <span class="line-numbers">Lines 1-3</span>
            </div>
            
            <div class="tercet">
                <p class="line">Nel mezzo del cammin di nostra vita</p>
                <p class="line">mi ritrovai per una selva oscura,</p>
                <p class="line">ché la diritta via era smarrita.</p>
            </div>
            
            <div class="translation">
                <p class="translation-text">
                    In the middle of the journey of our life, I found myself in a dark wood, where the straight way was lost.
                </p>
                <p class="translator">—Translation by Charles S. Singleton</p>
            </div>
        </section>
    </main>
</body>
</html>
```

### Making It Beautiful with CSS

HTML provides structure, but CSS (Cascading Style Sheets) provides beauty. Let's create a stylesheet that honors the dignity of Dante's text while embracing modern design principles.

Create a file called `styles.css` in the `public` folder:

```css
/* Root variables for consistent design */
:root {
    --primary-color: #2c1810;
    --accent-color: #8b4513;
    --text-light: #f4f1e8;
    --background: #faf8f3;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --border-radius: 8px;
}

/* Typography inspired by medieval manuscripts */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:wght@300;400;500&display=swap');

body {
    font-family: 'Crimson Text', serif;
    line-height: 1.6;
    color: var(--primary-color);
    background: var(--background);
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

header {
    text-align: center;
    margin-bottom: 3rem;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 2rem;
}

h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 300;
    margin: 0;
    color: var(--accent-color);
    letter-spacing: 1px;
}

.subtitle {
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-top: 0.5rem;
    font-style: italic;
}

.tercet-display {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 2rem;
    margin: 2rem 0;
}

.canto-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--accent-color);
}

.tercet {
    margin: 2rem 0;
    text-align: center;
}

.line {
    font-size: 1.3rem;
    margin: 0.5rem 0;
    font-style: italic;
    color: var(--primary-color);
}

.translation {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.translation-text {
    font-size: 1.1rem;
    color: #555;
    text-align: center;
    margin-bottom: 0.5rem;
}

.translator {
    text-align: right;
    font-size: 0.9rem;
    color: var(--accent-color);
    font-style: italic;
}

/* Responsive design for different screen sizes */
@media (max-width: 600px) {
    main {
        padding: 1rem 0.5rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .canto-info {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .line {
        font-size: 1.1rem;
    }
}
```

### Starting Your Server

Now let's see our creation in action. Hono provides a simple server that can serve our HTML and CSS files. Let's modify the server code to serve our static files properly.

Open `src/index.ts` and replace its contents with:

```typescript
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static files from the public directory
app.use('/*', serveStatic({ root: './public' }))

// A simple API endpoint to get information about Dante
app.get('/api/dante-info', (c) => {
  return c.json({
    title: "La Divina Commedia",
    author: "Dante Alighieri",
    completed: "c. 1320",
    canticles: ["Inferno", "Purgatorio", "Paradiso"],
    totalCantos: 100,
    message: "Your journey through the Divine Comedy begins here."
  })
})

export default app
```

Now start your server:

```bash
bun dev
```

You should see output indicating that your server is running. Open your web browser and navigate to `http://localhost:3000`. You'll see your first Dante web page!

## Understanding What We've Built

Let's pause to examine what we've accomplished and why it matters.

### HTML as Literary Markup

Look at the HTML structure we created. Notice how it mirrors the way scholars organize textual information:

- The `<header>` contains title and contextual information
- The `<section class="tercet-display">` groups related content
- The `.canto-info` provides scholarly apparatus (canticle, canto, line numbers)
- The `.tercet` contains the actual poetic lines
- The `.translation` provides interpretive context

This isn't accidental. HTML evolved from SGML (Standard Generalized Markup Language), which was created for exactly this kind of scholarly text encoding. When you write HTML, you're participating in a tradition of textual scholarship that predates the web.

### CSS as Editorial Design

Our CSS choices reflect centuries of thinking about how to present classical texts:

- **Typography**: We chose serif fonts that echo the tradition of printed editions
- **Spacing**: Line heights and margins create breathing room for contemplation
- **Hierarchy**: Different font sizes and colors guide the reader's attention
- **Color**: Our palette evokes parchment and ink, connecting digital design to manuscript traditions

### The Server as Digital Publisher

The Hono server we created acts like a digital publisher, making your content available to anyone with a web browser. The `serveStatic` function tells the server to deliver your HTML and CSS files when requested.

The API endpoint (`/api/dante-info`) demonstrates how servers can provide structured data—information that could come from databases, external sources, or computational analysis.

## The Connection to Digital Humanities

What we've built might seem simple, but it embodies key principles of digital humanities:

**Enhanced Access**: Your web page makes Dante accessible to anyone with an internet connection, potentially reaching readers who might never encounter the *Divine Comedy* otherwise.

**Multimedia Integration**: By combining original Italian, English translation, and scholarly apparatus, you've created a richer reading experience than any single printed edition could provide.

**Structured Data**: The HTML markup transforms unstructured text into structured information that computers can process, search, and analyze.

**Preservation**: Digital formats ensure that texts can be preserved and transmitted across time and space without degradation.

**Collaboration**: Web technologies enable collaborative scholarship—multiple scholars could contribute translations, annotations, or commentary to your digital edition.

## Looking Ahead: The Journey Before Us

This first page represents the foundation of everything we'll build. In coming chapters, we'll enhance it with:

- **Dynamic Content**: Pages that change based on user interaction
- **Database Integration**: Storing all 100 cantos of the *Divine Comedy*
- **Spaced Repetition**: Algorithms that optimize memory retention
- **Progress Tracking**: Monitoring your journey through Dante's text
- **Beautiful Interactions**: Smooth, engaging user experiences

But we'll always return to this core principle: technology serves the goal of deeper engagement with literature.

## Exercises and Reflection

### Technical Exercises

1. **Customize the Design**: Modify the CSS to create your own visual interpretation of Dante's text. Experiment with:
   - Different color schemes
   - Alternative typography choices
   - Varied spacing and layout
   - Background images or patterns

2. **Add More Content**: Expand the HTML to include:
   - The second tercet of Inferno Canto I
   - Multiple translations for comparison
   - Historical context about the poem's composition

3. **Explore the API**: Open your browser's developer tools and visit `http://localhost:3000/api/dante-info`. Examine the JSON response and consider what other information might be useful to provide through an API.

### Reflection Questions

1. **Literary Structure**: How does marking up Dante's text with HTML help you notice structural elements you might have missed in regular reading?

2. **Design Choices**: What do your CSS design decisions reveal about your interpretation of the text? How might different visual presentations change a reader's experience?

3. **Digital vs. Print**: What are the advantages and disadvantages of digital presentation compared to traditional printed editions? What is gained and what is lost?

4. **Collaborative Potential**: How might web technologies enable new forms of collaborative scholarship around classical texts?

### Extended Projects

1. **Create a Digital Edition**: Choose a poem or prose passage you've studied and create your own digital presentation. Consider what scholarly apparatus would be most valuable.

2. **Comparative Analysis**: Build a page that presents the same tercet in multiple languages. Research how different translators have approached Dante's opening lines.

3. **Historical Context**: Design a timeline page that places Dante's work in its historical context, using HTML and CSS to create an engaging visual presentation.

## Looking Forward

In our next chapter, we'll move beyond static pages to create our first server endpoints. You'll learn how web applications can generate content dynamically, responding to user requests with customized information. We'll start building the foundation for a system that can serve different parts of the *Divine Comedy* based on what users want to study.

But take a moment to appreciate what you've already accomplished. You've written HTML that structure's Dante's poetry for digital presentation. You've created CSS that makes classical text beautiful in a modern medium. You've configured a web server that makes your work accessible to the world.

Most importantly, you've taken the first step in a journey that will transform how you think about both literature and technology. Like Dante in his dark wood, you've found the beginning of a path that will lead to new understanding.

In the words of the poet himself: *"E come quei che con lena affannata, / uscito fuor del pelago a la riva, / si volge a l'acqua perigliosa e guata"*—"And like one who with laboring breath has escaped from the deep to the shore, turns to the perilous water and gazes."

You've reached the shore. Now the real journey begins.

---