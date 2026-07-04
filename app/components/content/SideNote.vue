<script setup lang="ts">
// SideNote: real marginalia. On wide screens it floats into the gutter the
// article reserves on its right (see `.article-prose` in main.css), sitting
// beside the paragraph it follows — an aside that is actually aside. On narrow
// screens it degrades to a tidy inset note in the flow.
//
// ::side-note
// A quick aside with a [link](https://…).
// ::
</script>

<template>
  <aside class="side-note not-prose text-sm leading-relaxed text-muted [&_a]:border-b [&_a]:border-transparent [&_a]:text-primary [&_a]:transition-colors [&_a:hover]:border-primary [&_a:focus-visible]:border-primary [&_p]:my-0 [&_p+p]:mt-2">
    <span class="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-widest text-dimmed uppercase">
      <UIcon
        name="i-lucide-corner-down-right"
        class="size-3"
      />
      Aside
    </span>
    <slot />
  </aside>
</template>

<style scoped>
.side-note {
  margin-block: 1.5rem;
  border-left: 2px solid color-mix(in oklab, var(--ui-primary) 55%, transparent);
  padding: 0.25rem 0 0.25rem 1rem;
}

@media (min-width: 1280px) {
  .side-note {
    float: right;
    clear: right;
    width: 13.5rem;
    margin-right: -15rem; /* pull into the reserved --gutter */
    margin-left: 2rem;
    margin-block: 0.35rem;
    border-left: 0;
    padding: 0;
  }
}
</style>
