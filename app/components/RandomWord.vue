<script setup lang="ts">
// Picks one word at random on mount. Wrapped in <ClientOnly> by the caller, so
// it's never prerendered and re-rolls on every entry — including navigating
// away and back. No looping animation, just a single word per visit.
const props = defineProps<{
  words: string[]
}>()

const word = ref(props.words[0] ?? '')

onMounted(() => {
  word.value = props.words[Math.floor(Math.random() * props.words.length)] ?? word.value
})
</script>

<template>
  <span class="text-primary">{{ word }}</span>
</template>
