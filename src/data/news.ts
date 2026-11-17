// Newest first. Add new items at the top: { date, text (5–10 words), href? }.
export const news: { date: string; text: string; href?: string }[] = [
  { date: 'Nov 16, 2026', text: 'Published a post on how Quail handles hybrid models', href: 'https://fsdatalab.github.io/blog/hybrid-models-in-quail/' },
  { date: 'Oct 16, 2026', text: 'Presented our deletion poster at NorCal DB Day 2026' },
  { date: 'Oct 1, 2026', text: 'Published a post on ideal-cost baselines for AI filters', href: 'https://fsdatalab.github.io/blog/ai-filter-cost-estimates/' },
  { date: 'Sep 24, 2026', text: 'Published a post on building high throughput' }, // TODO: exact title + URL
  { date: 'Jun 10, 2026', text: 'Awarded $1,500 Summer Undergraduate Research Program (SURP) fellowship' },
];
