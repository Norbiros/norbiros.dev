<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

// Landing is the brand itself, so drop the "· Norbiros" suffix to avoid "Norbiros · Norbiros".
useHead({ titleTemplate: null })

useSeoMeta({
  title: 'Norbiros',
  ogTitle: 'Norbiros',
  description: 'The personal corner of Norbiros — a Polish developer into Rust, the Nuxt ecosystem and Linux. This site is temporary; the blog is where things are happening.',
  ogDescription: 'The personal corner of Norbiros — a Polish developer into Rust, the Nuxt ecosystem and Linux.'
})

defineOgImage('Portfolio', {
  title: 'Norbiros',
  description: 'Rust, Nuxt & Linux — notes from whatever I\'m building.'
})

// `zeryaWords` is auto-imported from ~/utils/zeryaWords.ts — RandomWord picks one
// at random client-side, so this part is intentionally never prerendered.
const socials = [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/Norbiros'
}, {
  label: 'LinkedIn',
  icon: 'i-simple-icons-linkedin',
  to: 'https://www.linkedin.com/in/norbert-szeremet/'
}, {
  label: 'X',
  icon: 'i-simple-icons-x',
  to: 'https://x.com/norbiros_dev'
}, {
  label: 'Email',
  icon: 'i-lucide-mail',
  to: 'mailto:me@norbiros.dev'
}]
</script>

<template>
  <main class="relative flex min-h-[calc(100svh-1.5rem)] flex-col justify-center p-8 sm:min-h-[calc(100svh-2rem)] sm:p-12 lg:min-h-[calc(100svh-3rem)] lg:p-16">
    <!-- top bar -->
    <header class="absolute left-8 top-8 flex items-center text-sm text-muted sm:left-12 sm:top-12 lg:left-16 lg:top-16">
      <ULink
        to="/"
        class="text-muted transition-colors hover:text-highlighted"
      >
        norbiros.dev
      </ULink>
    </header>

    <!-- centered content -->
    <div class="flex flex-col gap-6">
      <Motion
        :initial="{ opacity: 0, y: 24, filter: 'blur(12px)' }"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :transition="{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6 lg:gap-8">
          <img
            :src="'/ProfilePic.png'"
            alt="Norbiros"
            class="size-16 shrink-0 rounded-lg bg-elevated object-cover object-top ring-1 ring-default sm:size-20 lg:size-28"
          >
          <h1 class="text-6xl font-bold leading-[0.9] tracking-tighter text-highlighted sm:text-8xl lg:text-[9.5rem]">
            Norbiros
          </h1>
        </div>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.15 }"
      >
        <div class="flex flex-col gap-1">
          <p class="flex items-baseline gap-x-2 text-lg text-default sm:text-xl">
            <ClientOnly>
              <RandomWord :words="zeryaWords" />
              <template #fallback>
                <span class="text-primary">Cooking</span>
              </template>
            </ClientOnly>
            <span class="text-muted">at</span>
            <ULink
              to="https://zerya.dev"
              target="_blank"
              class="text-highlighted underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              @Zerya
            </ULink>
          </p>
          <p class="text-sm text-muted sm:text-base">
            Open-source developer — Nuxt, Rust, and Minecraft mods.
          </p>
        </div>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
      >
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            to="/blog"
            color="primary"
            variant="solid"
            trailing-icon="i-lucide-arrow-right"
            label="Read the blog"
          />
          <USeparator
            orientation="vertical"
            class="mx-1 h-6"
          />
          <UButton
            v-for="link in socials"
            :key="link.label"
            :to="link.to"
            :icon="link.icon"
            :aria-label="link.label"
            target="_blank"
            color="neutral"
            variant="ghost"
          />
        </div>
      </Motion>
    </div>

    <!-- rotated congrats note -->
    <div
      class="pointer-events-none absolute right-8 top-24 hidden sm:right-10 sm:block lg:right-12"
    >
      <p
        class="max-h-[60svh] text-sm leading-relaxed tracking-[0.15em] text-dimmed [writing-mode:vertical-rl]"
      >
        You found my temporary personal site — just the blog for now.
        The real thing is coming <span class="text-muted">soon™</span>.
      </p>
    </div>
  </main>
</template>
