<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

// Raw markdown source for the "Copy for LLM" button. Resolved at
// prerender time so the text is baked into the static payload.
const slug = computed(() => route.path.split('/').filter(Boolean).pop())
const { data: rawMarkdown } = await useAsyncData(`${route.path}-raw`, () =>
  $fetch('/api/raw-markdown', { query: { slug: slug.value } })
)

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,

  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  ogImage: page.value.image,

  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: page.value.image,
  twitterCreator: '@norbiros_dev',

  articlePublishedTime: page.value.date,
  articleAuthor: page.value.author?.to
    ? [page.value.author.to]
    : undefined
})

const articleLink = computed(() => `${window?.location}`)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UMain class="mt-8 px-2">
    <UContainer class="relative min-h-screen">
      <nav
        v-if="page?.body?.toc?.links?.length"
        class="post-toc not-prose"
      >
        <UContentToc
          highlight
          title="On this page"
          :links="page.body.toc.links"
          :ui="{ root: 'bg-transparent ring-0 backdrop-blur-none' }"
        />
      </nav>

      <UPage v-if="page">
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="i-lucide-chevron-left" />
          Blog
        </ULink>
        <header class="mt-8 flex flex-col gap-5">
          <div class="flex items-center gap-2 text-xs font-medium tracking-wide text-dimmed uppercase">
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span
              v-if="page.date && page.minRead"
              class="size-1 rounded-full bg-dimmed"
            />
            <span v-if="page.minRead">
              {{ page.minRead }} min read
            </span>
          </div>
          <h1 class="max-w-4xl text-4xl leading-[1.05] font-bold tracking-tight text-balance text-highlighted sm:text-5xl">
            {{ page.title }}
          </h1>
          <p class="max-w-2xl text-xl leading-snug tracking-tight text-muted text-pretty sm:text-2xl">
            {{ page.description }}
          </p>
          <div class="mt-1 flex items-center gap-2">
            <UUser
              color="neutral"
              variant="ghost"
              v-bind="page.author"
              :ui="{ root: 'gap-2.5' }"
            />
          </div>
        </header>

        <USeparator class="my-8" />

        <UPageBody>
          <div class="article-prose">
            <ContentRenderer
              v-if="page.body"
              :value="page"
            />
          </div>

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              v-if="rawMarkdown"
              size="sm"
              variant="link"
              color="neutral"
              icon="i-lucide-sparkles"
              label="Copy for LLM"
              @click="copyToClipboard(rawMarkdown, 'Markdown copied — paste it into your LLM')"
            />
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              icon="i-lucide-link"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
