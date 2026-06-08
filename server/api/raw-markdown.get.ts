import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Serves the original markdown source of a blog post. Used by the
// "Copy for LLM" button — Nuxt Content only keeps a parsed AST at
// runtime, so the raw file has to be read from disk. This is fetched
// at prerender time via useAsyncData, so the result is baked into the
// static payload and no server call happens in the browser.
export default defineEventHandler(async (event) => {
  const slug = String(getQuery(event).slug || '')

  // Restrict to simple slugs so a request can't escape the blog dir.
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  try {
    const raw = await readFile(
      join(process.cwd(), 'content', 'blog', `${slug}.md`),
      'utf-8'
    )
    setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
    return raw
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Markdown source not found' })
  }
})
