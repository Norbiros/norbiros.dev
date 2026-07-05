<template>
  <div class="default-layout">
    <UContainer class="sm:border-x border-default pt-6 sm:pt-8">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>

<style scoped>
.default-layout {
  --ui-container: 60rem;
}

@media (min-width: 1280px) {
  .default-layout {
    --ui-container: 77rem;
  }
}
</style>
