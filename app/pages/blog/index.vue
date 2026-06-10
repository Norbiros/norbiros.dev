<script setup lang="ts">
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    />
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div
        v-if="!posts?.length"
        class="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-default px-6 py-16 text-center sm:py-24"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-elevated ring-1 ring-default">
          <UIcon
            name="i-lucide-pen-line"
            class="size-5 text-muted"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="text-highlighted text-lg font-medium">
            No posts yet
          </p>
          <p class="mx-auto max-w-sm text-sm text-muted">
            The first one is being written. Check back soon.
          </p>
        </div>
        <UButton
          to="https://github.com/Norbiros"
          target="_blank"
          icon="i-simple-icons-github"
          label="Follow along on GitHub"
          color="neutral"
          variant="subtle"
          size="sm"
        />
      </div>
      <UBlogPosts
        v-else
        orientation="vertical"
      >
        <Motion
          v-for="(post, index) in posts"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: Math.min(index * 0.06, 0.24), duration: 0.45, ease: [0.16, 1, 0.3, 1] }"
          :in-view-options="{ once: true, margin: '0px 0px -10% 0px' }"
        >
          <UBlogPost
            variant="naked"
            orientation="horizontal"
            :to="post.path"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
              image:
                'group-hover/blog-post:scale-105 rounded-lg shadow-lg border-4 border-muted ring-2 ring-default',
              header:
                index % 2 === 0
                  ? 'sm:-rotate-1 overflow-visible'
                  : 'sm:rotate-1 overflow-visible'
            }"
          />
        </Motion>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
