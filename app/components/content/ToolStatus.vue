<script setup lang="ts">
// ToolStatus: a quiet, consistent one-line verdict that closes each tool's
// section. Not a card — just a labelled status line so the reader gets the same
// "where it stands / what it means for you" beat every time, without a dashboard
// widget repeating after every heading.
//
// ::tool-status
// ---
// status: stable
// nuxt: First in Nuxt 4.x, full in Nuxt 5
// blockedBy: embedded framework support RFC
// blockedByTo: https://github.com/…
// ---
// Faster builds and one consistent dev/build pipeline.
// ::
const props = defineProps<{
  status: string
  /** Where this lands in Nuxt (e.g. "Nuxt 5", "usable experimentally"). */
  nuxt?: string
  /** What's holding it back, if anything. */
  blockedBy?: string
  blockedByTo?: string
}>()

const meta = computed(() => blogStatus(props.status))
</script>

<template>
  <aside class="not-prose my-6 border-t border-default pt-4 text-sm leading-relaxed">
    <p class="flex items-center gap-2">
      <span
        class="size-2 shrink-0 rounded-full"
        :class="{
          'bg-success': meta.color === 'success',
          'bg-info': meta.color === 'info',
          'bg-warning': meta.color === 'warning',
          'bg-primary': meta.color === 'primary',
          'bg-muted': meta.color === 'neutral'
        }"
      />
      <span class="font-semibold text-highlighted">{{ meta.label }}</span>
      <span
        v-if="nuxt"
        class="inline-flex items-center gap-1.5 text-muted"
      >
        <span class="text-dimmed">·</span>
        <UIcon
          name="i-simple-icons-nuxtdotjs"
          class="size-3.5 text-primary/80"
        />
        {{ nuxt }}
      </span>
    </p>

    <div class="mt-1.5 text-muted [&>p]:my-0 [&_strong]:font-semibold [&_strong]:text-highlighted">
      <slot />
    </div>

    <p
      v-if="blockedBy"
      class="mt-1.5 flex items-center gap-1.5 text-xs text-dimmed"
    >
      <UIcon
        name="i-lucide-lock"
        class="size-3.5 shrink-0"
      />
      <span>Blocked by</span>
      <ULink
        v-if="blockedByTo"
        :to="blockedByTo"
        target="_blank"
        class="underline decoration-dimmed underline-offset-2 hover:text-muted"
      >{{ blockedBy }}</ULink>
      <span v-else>{{ blockedBy }}</span>
    </p>
  </aside>
</template>
