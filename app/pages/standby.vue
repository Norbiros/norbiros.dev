<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Standby',
  robots: 'noindex, nofollow',
  description: 'A tiny presentation standby screen for when the slides are definitely almost ready.'
})

type Mood = 'panic' | 'corporate' | 'arcade'

const stage = ref<HTMLElement | null>(null)
const avatar = ref<HTMLElement | null>(null)
const mood = ref<Mood>('panic')
const isPaused = ref(false)
const hits = ref(0)
const progress = ref(37)
const currentExcuse = ref(0)
const currentLog = ref(0)
const cornerFlash = ref(false)
const position = reactive({ x: 72, y: 64 })
const velocity = reactive({ x: 220, y: 168 })

const excuses = [
  'Slajdy kompilują się w trybie release.',
  'Jeszcze tylko jeden mały refactor i zaczynamy.',
  'Demo działało lokalnie 12 minut temu.',
  'Czekam, aż cache przestanie mieć własne zdanie.',
  'To nie opóźnienie, to pre-render napięcia.',
  'Presenter.exe negocjuje z projektorem.'
]

const logs = [
  'mounting /dev/projector',
  'hydrating audience reactions',
  'warming up live demo confidence',
  'retrying coffee handshake',
  'loading slide_final_final_v7.key',
  'patching reality with optimistic UI',
  'benchmarking awkward silence',
  'syncing presenter charisma'
]

const moodConfig = computed(() => {
  if (mood.value === 'corporate') {
    return {
      label: 'boardroom',
      title: 'Quarterly synergy buffer',
      status: 'Strategic alignment pending',
      tone: 'All deliverables are converging toward readiness.',
      speed: 0.7
    }
  }

  if (mood.value === 'arcade') {
    return {
      label: 'arcade',
      title: 'Insert slides to continue',
      status: 'Attract mode running',
      tone: 'High score: one presentation survived without notes.',
      speed: 1.35
    }
  }

  return {
    label: 'panic',
    title: 'Prezentacja zaraz startuje',
    status: 'Loading content...',
    tone: 'Spokojnie. Wszystko jest pod kontrolą technicznie rzecz biorąc.',
    speed: 1
  }
})

const progressLabel = computed(() => `${Math.round(progress.value)}%`)
const activeExcuse = computed(() => excuses[currentExcuse.value])
const activeLog = computed(() => logs[currentLog.value])

let frameId = 0
let lastFrame = 0
let progressTimer: number | undefined
let textTimer: number | undefined

function cycleMood() {
  mood.value = mood.value === 'panic' ? 'corporate' : mood.value === 'corporate' ? 'arcade' : 'panic'
}

function togglePause() {
  isPaused.value = !isPaused.value
}

async function toggleFullscreen() {
  const element = stage.value

  if (!element || !document.fullscreenEnabled) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }

  await element.requestFullscreen()
}

function nudge() {
  velocity.x = (Math.random() > 0.5 ? 1 : -1) * (260 + Math.random() * 140)
  velocity.y = (Math.random() > 0.5 ? 1 : -1) * (190 + Math.random() * 160)
  currentExcuse.value = (currentExcuse.value + 1) % excuses.length
}

function animate(time: number) {
  if (!lastFrame) {
    lastFrame = time
  }

  const stageRect = stage.value?.getBoundingClientRect()
  const avatarRect = avatar.value?.getBoundingClientRect()
  const delta = Math.min((time - lastFrame) / 1000, 0.032)
  lastFrame = time

  if (!isPaused.value && stageRect && avatarRect) {
    const width = avatarRect.width
    const height = avatarRect.height
    const maxX = Math.max(stageRect.width - width, 0)
    const maxY = Math.max(stageRect.height - height, 0)
    const speed = moodConfig.value.speed

    position.x += velocity.x * speed * delta
    position.y += velocity.y * speed * delta

    let bounced = false

    if (position.x <= 0 || position.x >= maxX) {
      position.x = Math.min(Math.max(position.x, 0), maxX)
      velocity.x *= -1
      bounced = true
    }

    if (position.y <= 0 || position.y >= maxY) {
      position.y = Math.min(Math.max(position.y, 0), maxY)
      velocity.y *= -1
      bounced = true
    }

    if (bounced) {
      hits.value += 1
      cornerFlash.value = true
      window.setTimeout(() => {
        cornerFlash.value = false
      }, 120)
    }
  }

  frameId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  frameId = window.requestAnimationFrame(animate)

  progressTimer = window.setInterval(() => {
    const next = progress.value + 2.7
    progress.value = next > 96 ? 34 + Math.random() * 12 : next
  }, 900)

  textTimer = window.setInterval(() => {
    currentExcuse.value = (currentExcuse.value + 1) % excuses.length
    currentLog.value = (currentLog.value + 1) % logs.length
  }, 2600)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(frameId)

  if (progressTimer) {
    window.clearInterval(progressTimer)
  }

  if (textTimer) {
    window.clearInterval(textTimer)
  }
})
</script>

<template>
  <main
    ref="stage"
    class="standby"
    :class="[`standby--${mood}`, { 'standby--flash': cornerFlash }]"
  >
    <div class="standby__scanline" />

    <header class="standby__topbar">
      <ULink
        to="/"
        aria-label="Back to homepage"
        class="standby__brand"
      >
        <img
          src="/ProfilePic.png"
          alt=""
          class="standby__brand-avatar"
        >
        <span>norbiros.dev</span>
      </ULink>

      <div class="standby__controls">
        <UTooltip text="Change mode">
          <button
            type="button"
            class="standby__icon-button"
            aria-label="Change mode"
            @click="cycleMood"
          >
            <UIcon name="i-lucide-sparkles" />
          </button>
        </UTooltip>
        <UTooltip :text="isPaused ? 'Resume' : 'Pause'">
          <button
            type="button"
            class="standby__icon-button"
            :aria-label="isPaused ? 'Resume' : 'Pause'"
            @click="togglePause"
          >
            <UIcon :name="isPaused ? 'i-lucide-play' : 'i-lucide-pause'" />
          </button>
        </UTooltip>
        <UTooltip text="Fullscreen">
          <button
            type="button"
            class="standby__icon-button"
            aria-label="Fullscreen"
            @click="toggleFullscreen"
          >
            <UIcon name="i-lucide-maximize" />
          </button>
        </UTooltip>
      </div>
    </header>

    <section
      class="standby__copy"
      aria-live="polite"
    >
      <p class="standby__eyebrow">
        {{ moodConfig.label }} mode
      </p>
      <h1>{{ moodConfig.title }}</h1>
      <p class="standby__tone">
        {{ moodConfig.tone }}
      </p>
    </section>

    <div
      class="standby__loader"
      aria-label="Loading status"
    >
      <div class="standby__loader-head">
        <span>{{ moodConfig.status }}</span>
        <strong>{{ progressLabel }}</strong>
      </div>
      <div class="standby__track">
        <div
          class="standby__bar"
          :style="{ width: progressLabel }"
        />
      </div>
      <p>{{ activeExcuse }}</p>
    </div>

    <div class="standby__terminal">
      <span class="standby__dot" />
      <code>{{ activeLog }}</code>
    </div>

    <button
      ref="avatar"
      type="button"
      class="standby__dvd"
      :style="{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }"
      aria-label="Bounce the avatar faster"
      @click="nudge"
    >
      <img
        src="/ProfilePic.png"
        alt="Norbiros"
      >
      <span>DVD</span>
    </button>

    <footer class="standby__footer">
      <span>hits: {{ hits }}</span>
      <span>eta: soon™</span>
      <span>demo integrity: unverifiable</span>
    </footer>
  </main>
</template>

<style scoped>
.standby {
  --standby-bg: #050505;
  --standby-panel: color-mix(in srgb, #111 72%, transparent);
  --standby-ink: #f6f0df;
  --standby-muted: #a8a293;
  --standby-line: color-mix(in srgb, var(--standby-accent) 22%, transparent);
  --standby-accent: #f26a2e;
  --standby-accent-2: #f7d44a;
  --standby-danger: #ff3f57;

  position: relative;
  min-height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--standby-accent) 22%, transparent), transparent 28rem),
    radial-gradient(circle at 88% 82%, color-mix(in srgb, var(--standby-accent-2) 18%, transparent), transparent 32rem),
    linear-gradient(135deg, #050505 0%, #10100d 52%, #050505 100%);
  color: var(--standby-ink);
  font-family: "Public Sans", sans-serif;
  isolation: isolate;
}

.standby--corporate {
  --standby-accent: #7dd3fc;
  --standby-accent-2: #d9f99d;
}

.standby--arcade {
  --standby-accent: #ff3f8b;
  --standby-accent-2: #35f2c9;
}

.standby--flash::after {
  position: absolute;
  inset: 0;
  z-index: 3;
  border: 2px solid var(--standby-accent-2);
  content: "";
  pointer-events: none;
}

.standby__scanline {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 5px,
      rgb(255 255 255 / 0.035) 6px,
      transparent 7px
    );
  mix-blend-mode: screen;
  opacity: 0.55;
  pointer-events: none;
}

.standby__topbar,
.standby__copy,
.standby__loader,
.standby__terminal,
.standby__footer {
  position: absolute;
  z-index: 2;
}

.standby__topbar {
  top: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1rem, 2vw, 1.5rem);
  left: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.standby__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--standby-ink);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0;
}

.standby__brand-avatar {
  width: 2rem;
  height: 2rem;
  border: 1px solid rgb(255 255 255 / 0.22);
  border-radius: 0.4rem;
  object-fit: cover;
  object-position: top;
}

.standby__controls {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.standby__icon-button {
  display: grid;
  width: 2.35rem;
  height: 2.35rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 0.45rem;
  background: rgb(0 0 0 / 0.38);
  color: var(--standby-ink);
  transition: border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.standby__icon-button:hover {
  border-color: var(--standby-accent-2);
  color: var(--standby-accent-2);
  transform: translateY(-1px);
}

.standby__copy {
  top: clamp(5.5rem, 12vw, 8rem);
  left: clamp(1.1rem, 5vw, 5rem);
  max-width: min(44rem, calc(100% - 2.2rem));
}

.standby__eyebrow {
  margin: 0 0 0.85rem;
  color: var(--standby-accent-2);
  font-size: clamp(0.75rem, 1.6vw, 0.9rem);
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.standby h1 {
  max-width: 12ch;
  margin: 0;
  font-family: "Instrument Serif", Georgia, serif;
  font-size: clamp(3.6rem, 11vw, 9.4rem);
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: 0;
  text-wrap: balance;
}

.standby__tone {
  max-width: 36rem;
  margin: 1.15rem 0 0;
  color: var(--standby-muted);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.5;
}

.standby__loader {
  right: clamp(1rem, 4vw, 3.5rem);
  bottom: clamp(5.4rem, 10vw, 7rem);
  width: min(29rem, calc(100% - 2rem));
  border: 1px solid var(--standby-line);
  border-radius: 0.5rem;
  background: var(--standby-panel);
  padding: 1rem;
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 0.32);
  backdrop-filter: blur(18px);
}

.standby__loader-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--standby-ink);
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.standby__loader-head strong {
  color: var(--standby-accent-2);
}

.standby__track {
  height: 0.65rem;
  margin-top: 0.8rem;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: 999px;
  background: rgb(0 0 0 / 0.34);
}

.standby__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--standby-accent), var(--standby-accent-2));
  box-shadow: 0 0 1.7rem color-mix(in srgb, var(--standby-accent) 70%, transparent);
  transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.standby__loader p {
  min-height: 1.5rem;
  margin: 0.85rem 0 0;
  color: var(--standby-muted);
  font-size: 0.95rem;
}

.standby__terminal {
  right: clamp(1rem, 4vw, 3.5rem);
  bottom: clamp(2.1rem, 4vw, 2.8rem);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: min(29rem, calc(100% - 2rem));
  color: var(--standby-muted);
  font-size: 0.83rem;
}

.standby__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--standby-danger);
  box-shadow: 0 0 1rem var(--standby-danger);
  animation: standby-pulse 900ms steps(2, end) infinite;
}

.standby__dvd {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: clamp(5.6rem, 11vw, 8.8rem);
  border: 0;
  background: transparent;
  color: var(--standby-accent-2);
  cursor: pointer;
  filter: drop-shadow(0 1.3rem 1.7rem rgb(0 0 0 / 0.45));
  will-change: transform;
}

.standby__dvd img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid color-mix(in srgb, var(--standby-accent-2) 72%, white);
  border-radius: 0.7rem;
  object-fit: cover;
  object-position: top;
}

.standby__dvd span {
  display: block;
  margin-top: 0.35rem;
  color: currentColor;
  font-size: clamp(1rem, 2.5vw, 1.55rem);
  font-weight: 950;
  letter-spacing: 0.12em;
  line-height: 1;
  text-align: center;
  text-shadow: 0 0 1rem currentColor;
}

.standby__footer {
  bottom: clamp(1rem, 2vw, 1.5rem);
  left: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 1rem;
  max-width: calc(100% - 2rem);
  color: color-mix(in srgb, var(--standby-muted) 82%, transparent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@keyframes standby-pulse {
  50% {
    opacity: 0.25;
  }
}

@media (max-width: 700px) {
  .standby__copy {
    top: 5.2rem;
  }

  .standby h1 {
    max-width: 9ch;
  }

  .standby__tone {
    max-width: 20rem;
  }

  .standby__loader {
    bottom: 5.8rem;
  }

  .standby__terminal {
    bottom: 3.4rem;
  }

  .standby__footer {
    font-size: 0.68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .standby__bar,
  .standby__icon-button {
    transition: none;
  }

  .standby__dot {
    animation: none;
  }
}
</style>
