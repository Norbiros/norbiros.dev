<script setup lang="ts">
// BlogFigure: an image with accessible alt text and a caption in my own voice
// (the takeaway, not a label). Named to avoid colliding with the native
// <figure> that MDC renders for `::figure`. Used from Markdown via MDC:
//
// ::blog-figure{src="…" alt="what is visually there" surface="light"}
// Caption — explains the point, not the picture.
// ::
withDefaults(defineProps<{
  src: string
  alt: string
  /** Attribution shown under the caption (e.g. "pnpm benchmarks"). */
  source?: string
  /** Optional URL to link the attribution to. */
  sourceTo?: string
  /** "light" gives the image a white surface — for charts drawn for light bg. */
  surface?: 'default' | 'light'
  /** Let the image fill the figure width (for wide, self-framed graphics). */
  wide?: boolean
}>(), {
  surface: 'default',
  wide: false
})
</script>

<template>
  <figure class="not-prose my-8 flex flex-col gap-3">
    <div
      class="flex justify-center rounded-xl ring ring-default"
      :class="[
        surface === 'light' ? 'bg-white' : 'bg-elevated/40',
        wide ? 'p-2 sm:p-3' : 'p-4 sm:p-6'
      ]"
    >
      <ProseImg
        :src="src"
        :alt="alt"
        loading="lazy"
        decoding="async"
        :class="['h-auto rounded', wide ? 'w-full' : 'w-full max-w-xl']"
      />
    </div>
    <figcaption class="px-1 text-sm leading-relaxed text-muted">
      <slot />
      <span
        v-if="source"
        class="mt-1 block text-xs text-dimmed"
      >
        Source:
        <ULink
          v-if="sourceTo"
          :to="sourceTo"
          target="_blank"
          class="underline underline-offset-2 hover:text-muted"
        >{{ source }}</ULink>
        <span v-else>{{ source }}</span>
      </span>
    </figcaption>
  </figure>
</template>
