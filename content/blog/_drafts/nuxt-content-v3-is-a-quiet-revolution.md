---
title: Nuxt Content v3 is a quiet revolution
description: Swapping a flat-file content layer for a real SQL collection changed how I think about building content-driven sites.
date: 2026-04-30
image: /hero/random-4.avif
minRead: 7
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

This very site runs on Nuxt Content v3, and migrating to it from the v2 mental model was the moment a bunch of things finally clicked. The headline feature isn't flashy — it's that your markdown now lives in a real, queryable collection with a schema. But that one change ripples outward into everything.

## Collections with schemas

In v2, your content was a loosely-typed bag of frontmatter. You found out a field was missing or misspelled when something rendered blank. In v3, you define a collection up front:

```ts
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.date(),
        minRead: z.number(),
        image: z.string().nonempty()
      })
    })
  }
})
```

Now the frontmatter is validated against a Zod schema at build time. Forget the `date` on a post and the build tells you, with the filename, before it ever ships.

## Querying feels like an ORM

Because content lives in SQLite under the hood, querying it reads like data access, not file globbing:

```ts
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
```

Ordering, filtering, limiting, fetching a single item by path, grabbing the surrounding items for prev/next navigation — it's all there, typed, and fast.

## What I actually like about it

- **Typed everywhere.** The shape you defined in the schema flows into your components. Autocomplete on `post.date` is a small joy that adds up.
- **`queryCollectionItemSurroundings`** gives you previous/next links for free. I used to hand-roll this every time.
- **Prerendering is the default mental model.** Build once, serve static, and the content queries resolve at build time.

> The best frameworks make the right thing the easy thing. v3 makes "validated, typed, queryable content" the path of least resistance.

## The one gotcha

The body of a page is an **AST**, not raw markdown. That's great for rendering with `<ContentRenderer>` and terrible the moment you want the original markdown back — say, to offer a "copy this post as markdown" button.

I solved that on this very blog with a tiny Nitro route that reads the source file and serves it as plain text. If you're reading this post, there's a button at the bottom that does exactly that. Funny how the gotcha became a feature.

## Worth migrating?

If you're starting fresh: absolutely, don't even look back at v2. If you're migrating: budget a real afternoon for the schema and query rewrites, but the result is a content layer that actually has your back.
