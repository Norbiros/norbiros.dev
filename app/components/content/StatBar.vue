<script setup lang="ts">
// StatBar: a minimal before/after comparison. Two (or more) horizontal bars
// scaled to the largest value, one accent (the winner, in brand orange) against
// a muted baseline — magnitude at a glance, no axis furniture. Values are direct-
// labelled; the numbers wear ink tokens, only the mark carries the accent.
//
// ::stat-bar
// ---
// title: Linear's production build
// bars:
//   - { label: "Rollup", value: 46, display: "46s" }
//   - { label: "Rolldown", value: 6, display: "6s", highlight: true }
// source: Vite 8 announcement
// sourceTo: https://vite.dev/blog/announcing-vite8
// ---
// The kind of win you get for free once Nuxt sits on Vite 8.
// ::
interface Bar {
  label: string
  value: number
  display: string
  highlight?: boolean
}
const props = defineProps<{
  title: string
  bars: Bar[]
  source?: string
  sourceTo?: string
}>()

const max = computed(() => Math.max(...props.bars.map(b => b.value), 1))
const pct = (v: number) => (v / max.value) * 100
const width = (v: number) => `${Math.max(pct(v), 4)}%`
// Keep the value label inside the bar only when the bar is wide enough to hold
// it; otherwise it renders just after the bar so short bars never clip or
// collide with the row label.
const isInside = (v: number) => pct(v) >= 25
</script>

<template>
  <figure class="not-prose my-8 rounded-xl ring ring-default bg-elevated/30 p-5 sm:p-6">
    <figcaption class="mb-5 text-sm font-medium text-highlighted">
      {{ title }}
    </figcaption>

    <div class="flex flex-col gap-3.5">
      <div
        v-for="bar in bars"
        :key="bar.label"
        class="flex items-center gap-3"
      >
        <span class="w-20 shrink-0 text-right text-xs text-muted sm:w-24">{{ bar.label }}</span>
        <div class="flex h-7 flex-1 items-center">
          <div
            class="flex h-full items-center overflow-hidden rounded-md transition-[width] duration-700 ease-out"
            :class="[bar.highlight ? 'bg-primary' : 'bg-muted/60', isInside(bar.value) ? 'justify-end' : '']"
            :style="{ width: width(bar.value) }"
          >
            <span
              v-if="isInside(bar.value)"
              class="px-2.5 text-sm font-semibold tabular-nums"
              :class="bar.highlight ? 'text-inverted' : 'text-highlighted'"
            >{{ bar.display }}</span>
          </div>
          <span
            v-if="!isInside(bar.value)"
            class="pl-2 text-sm font-semibold tabular-nums text-highlighted"
          >{{ bar.display }}</span>
        </div>
      </div>
    </div>

    <figcaption
      v-if="$slots.default"
      class="mt-5 text-sm leading-relaxed text-muted"
    >
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
