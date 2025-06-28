import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Web Apps with htmx & Dante',
      description: 'A literature-first approach to modern web development',
      logo: {
        src: './src/assets/houston.webp', // We'll replace this later
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/buildLittleWorlds/dante-web-dev-textbook',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', link: '/' },
            { label: 'Course Philosophy', link: '/getting-started/philosophy/' },
            { label: 'Environment Setup', link: '/getting-started/setup/' },
          ],
        },
        {
          label: 'Part I: Foundations',
          items: [
            { label: 'Chapter 1: Introduction & HTML/CSS', link: '/foundations/chapter-1/' },
            { label: 'Chapter 2: TypeScript & Hono', link: '/foundations/chapter-2/' },
            { label: 'Chapter 3: JSX & Styling', link: '/foundations/chapter-3/' },
          ],
        },
        {
          label: 'Part II: Interactivity',
          collapsed: true,
          items: [
            { label: 'Chapter 4: htmx Basics', link: '/interactivity/chapter-4/' },
            { label: 'Chapter 5: Forms & Validation', link: '/interactivity/chapter-5/' },
            { label: 'Chapter 6: Alpine.js', link: '/interactivity/chapter-6/' },
          ],
        },
        {
          label: 'Part III: Data Persistence',
          collapsed: true,
          items: [
            { label: 'Chapter 7: SQLite Basics', link: '/data-persistence/chapter-7/' },
            { label: 'Chapter 8: Advanced SQL', link: '/data-persistence/chapter-8/' },
          ],
        },
        {
          label: 'Part IV: Learning System',
          collapsed: true,
          items: [
            { label: 'Chapter 9: Memory & Learning', link: '/learning-system/chapter-9/' },
            { label: 'Chapter 10: Spaced Repetition', link: '/learning-system/chapter-10/' },
            { label: 'Chapter 11: Advanced htmx', link: '/learning-system/chapter-11/' },
          ],
        },
        {
          label: 'Part V: Production',
          collapsed: true,
          items: [
            { label: 'Chapter 12: Security & Errors', link: '/production/chapter-12/' },
            { label: 'Chapter 13: CSS & Accessibility', link: '/production/chapter-13/' },
            { label: 'Chapter 14: Deployment', link: '/production/chapter-14/' },
          ],
        },
        {
          label: 'Part VI: Advanced',
          collapsed: true,
          items: [
            { label: 'Chapter 15: Extensibility', link: '/advanced/chapter-15/' },
          ],
        },
        {
          label: 'Dante & Literature',
          collapsed: true,
          items: [
            { label: 'About the Divine Comedy', link: '/dante/about/' },
            { label: 'Memorization Techniques', link: '/dante/memorization/' },
            { label: 'Historical Context', link: '/dante/context/' },
          ],
        },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      expressiveCode: {
        themes: ['starlight-dark', 'starlight-light'],
        styleOverrides: {
          borderRadius: '0.5rem',
        },
      },
    }),
  ],
});