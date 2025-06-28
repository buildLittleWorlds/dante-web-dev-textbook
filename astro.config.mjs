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
          label: 'Introduction',
          items: [
            { label: 'Preface', link: '/introduction/preface/' },
            { label: 'Course Overview', link: '/introduction/overview/' },
          ],
        },
        {
          label: 'Part I: Foundations',
          items: [
            { label: 'Chapter 1: Why These Technologies Matter', link: '/foundations/chapter-1/' },
            { label: 'Chapter 2: Your First Server with Hono', link: '/foundations/chapter-2/' },
            { label: 'Chapter 3: Making HTML Beautiful with JSX and CSS', link: '/foundations/chapter-3/' },
          ],
        },
        {
          label: 'Part II: Interactivity',
          collapsed: true,
          items: [
            { label: 'Chapter 4: Your First htmx Magic', link: '/interactivity/chapter-4/' },
            { label: 'Chapter 5: Forms and User Input with htmx', link: '/interactivity/chapter-5/' },
            { label: 'Chapter 6: Alpine.js - Adding Client-Side Polish', link: '/interactivity/chapter-6/' },
          ],
        },
        {
          label: 'Part III: Data Persistence',
          collapsed: true,
          items: [
            { label: 'Chapter 7: Introduction to Databases - SQLite Basics', link: '/data-persistence/chapter-7/' },
            { label: 'Chapter 8: Advanced Data Operations', link: '/data-persistence/chapter-8/' },
          ],
        },
        {
          label: 'Part IV: Learning System',
          collapsed: true,
          items: [
            { label: 'Chapter 9: Understanding Memory and Learning', link: '/learning-system/chapter-9/' },
            { label: 'Chapter 10: Building the Spaced Repetition System', link: '/learning-system/chapter-10/' },
            { label: 'Chapter 11: Advanced htmx - Real-time Updates', link: '/learning-system/chapter-11/' },
          ],
        },
        {
          label: 'Part V: Production',
          collapsed: true,
          items: [
            { label: 'Chapter 12: Professional Touches - Error Handling', link: '/production/chapter-12/' },
            { label: 'Chapter 13: Making It Beautiful - Advanced CSS', link: '/production/chapter-13/' },
            { label: 'Chapter 14: Sharing Your Work - Deployment', link: '/production/chapter-14/' },
          ],
        },
        {
          label: 'Part VI: Advanced Topics',
          collapsed: true,
          items: [
            { label: 'Chapter 15: Extensions and Customization', link: '/advanced/chapter-15/' },
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
        {
          label: 'Appendices',
          collapsed: true,
          items: [
            { label: 'Project Structure', link: '/appendices/project-structure/' },
            { label: 'Deployment Guide', link: '/appendices/deployment-guide/' },
            { label: 'Accessibility Guidelines', link: '/appendices/accessibility-guidelines/' },
            { label: 'Further Reading', link: '/appendices/further-reading/' },
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