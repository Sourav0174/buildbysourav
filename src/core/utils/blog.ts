export const SITE_URL = 'https://buildbysourav.in'

/**
 * Normalizes text into a URL-friendly slug.
 * Removes non-alphanumeric characters, replaces whitespace with hyphens,
 * and strips leading/trailing hyphens.
 */
export function slugify(text: string): string {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '') // remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // convert spaces/symbols to hyphen
    .replace(/^-+|-+$/g, '') // strip leading and trailing hyphens
}

/**
 * Calculates human reading time in minutes based on ~200 words per minute.
 * Strips code blocks, HTML, and markdown tags to evaluate natural language reading velocity.
 * Returns formatted string (e.g., "1 min read", "5 min read").
 */
export function calculateReadingTime(content: string): string {
  if (!content || !content.trim()) {
    return '1 min read'
  }

  // Strip code blocks and markdown syntax for clean word count
  const cleanText = content
    .replace(/```[\s\S]*?```/g, ' ') // remove fenced code blocks
    .replace(/`[^`]*`/g, ' ')        // remove inline code
    .replace(/<\/?[^>]+(>|$)/g, ' ') // remove HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, ' ') // remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // retain link label, strip URL
    .replace(/[#*>\-_~`]/g, ' ')     // strip markdown formatting characters

  const words = cleanText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}
