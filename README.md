# arnavdhariya.github.io

Personal research site, built with [Astro](https://astro.build) and deployed to GitHub Pages (`.github/workflows/deploy.yml`).

```
npm install
npm run dev      # local preview
npm run build    # static output in dist/
```

## Editing content

- **Positions**: one Markdown file per lab in `src/content/positions/`. Frontmatter holds facts (dates, advisor, tags); the body is the summary/bullets. `draft: true` means the text has not yet been written/refined by Arnav.
- **Papers, talks, awards, links**: `src/data/site.ts`.
- **Medium posts** are fetched at build time; the site rebuilds daily.

## Writing policy

Prose on this site is Arnav's. Claude helps structure and edit but does not invent claims: for each position, Arnav supplies the summary or raw bullets, Claude proposes a tightened draft, and Arnav approves or revises before it ships.
