<script setup lang="ts">
// SideNote: real marginalia. On wide screens it floats into the aside gutter
// the article reserves on its right (see .blog-main / .side-note in
// article.css), sitting beside the paragraph it follows. On narrow screens it
// degrades to a tidy inset note in the flow. Layout lives in article.css.
//
// ::side-note
// A quick aside with a [link](https://…).
// ::
</script>

<template>
  <aside class="side-note not-prose">
    <span class="side-note__label">
      <UIcon
        name="i-lucide-corner-down-right"
        class="size-3"
      />
      Aside
    </span>
    <slot />
  </aside>
</template>
