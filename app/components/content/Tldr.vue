<script setup lang="ts">
// Tldr: a compact summary callout for the very top of a post — the one-breath
// version for readers who want the takeaway before committing to the long read.
// Quiet card in the site's language (ring + elevated surface), primary-tinted
// label.
//
// ::tldr
// The whole post in three sentences.
// ::
</script>

<template>
  <aside class="not-prose my-8 rounded-xl ring ring-default bg-elevated/30 p-4 sm:p-5">
    <div class="mb-2 flex items-center gap-2">
      <UIcon
        name="i-lucide-zap"
        class="size-3.5 text-primary"
      />
      <span class="text-xs font-semibold tracking-widest text-primary uppercase">
        TL;DR
      </span>
    </div>
    <div class="text-[0.95rem] leading-relaxed text-muted [&>p]:my-0 [&>p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-highlighted [&_a]:border-b [&_a]:border-transparent [&_a]:text-primary [&_a]:transition-colors [&_a:hover]:border-primary [&_a:focus-visible]:border-primary">
      <slot />
    </div>
  </aside>
</template>
