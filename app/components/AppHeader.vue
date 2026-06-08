<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <header class="flex items-center justify-between gap-4 border-b border-default pb-4">
    <ULink
      to="/"
      class="flex items-center gap-2.5 text-sm font-medium text-highlighted"
    >
      <img
        :src="'/ProfilePic.png'"
        alt="Norbiros"
        width="28"
        height="28"
        class="size-7 rounded-lg bg-elevated object-cover object-top ring-1 ring-default"
      >
      <span>norbiros.dev</span>
    </ULink>

    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      :ui="{
        link: 'px-2.5 py-1 text-sm',
        linkLeadingIcon: 'hidden'
      }"
    />
  </header>
</template>
