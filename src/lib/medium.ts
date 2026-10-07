// Fetched once at build time so visitors don't depend on third-party CORS proxies.
export interface Post { title: string; link: string; date: string; excerpt: string }

export async function getMediumPosts(user: string, max = 6): Promise<Post[]> {
  try {
    const res = await fetch(`https://medium.com/feed/@${user}`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, max).map(([, item]) => {
      const pick = (tag: string) =>
        item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1].trim() ?? '';
      const text = pick('content:encoded').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const d = pick('pubDate');
      return {
        title: pick('title'),
        link: pick('link'),
        date: d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        excerpt: text.split(' ').slice(0, 28).join(' '),
      };
    });
  } catch {
    return [];
  }
}
