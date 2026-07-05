<script setup lang="ts">
// SpeedStats: a row of hero numbers. Multipliers like "50–100×" don't chart
// well against a baseline of 1×, so per the form heuristic they're stat tiles,
// not bars — the big number does the talking, the accent sits only on the "×".
//
// ::speed-stats
// ---
// items:
//   - { value: "50–100×", tool: "oxlint", vs: "vs ESLint" }
//   - { value: "30×", tool: "oxfmt", vs: "vs Prettier" }
// source: oxc.rs
// sourceTo: https://oxc.rs
// ---
// ::
interface Item {
  value: string
  tool: string
  vs: string
}
defineProps<{
  items: Item[]
  source?: string
  sourceTo?: string
}>()
</script>

<template>
  <figure class="not-prose my-8">
    <div
      class="grid gap-px overflow-hidden rounded-xl ring ring-default bg-default"
      :class="items.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'"
    >
      <div
        v-for="item in items"
        :key="item.tool"
        class="flex flex-col gap-1 bg-elevated/30 px-4 py-5 sm:px-5 sm:py-6"
      >
        <span class="text-2xl leading-none font-bold tracking-tight whitespace-nowrap text-highlighted tabular-nums sm:text-3xl">
          {{ item.value.replace('×', '') }}<span class="text-primary">×</span>
        </span>
        <span class="mt-1 text-sm font-medium text-default">{{ item.tool }}</span>
        <span class="text-xs text-dimmed">{{ item.vs }}</span>
      </div>
    </div>
    <figcaption
      v-if="source"
      class="mt-2 px-1 text-xs text-dimmed"
    >
      Source:
      <ULink
        v-if="sourceTo"
        :to="sourceTo"
        target="_blank"
        class="underline underline-offset-2 hover:text-muted"
      >{{ source }}</ULink>
      <span v-else>{{ source }}</span>
    </figcaption>
  </figure>
</template>
