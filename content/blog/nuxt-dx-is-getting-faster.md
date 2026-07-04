---
title: Nuxt DX is about to get much faster
description: The JavaScript tooling layer underneath Nuxt is being rebuilt in native code, bringing faster builds, installs, linting, type-checking and dev startup.
date: 2026-07-04
image: /img/nuxt-dx-roadmap.png
minRead: 11
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

**This post is written from a perspective of a Nuxt developer, but it will still have a lot of value if you care about modern web development in general.**

::tldr
Nuxt's DX was rarely the real bottleneck; the JavaScript tooling under it was. That whole layer (bundling, linting, type-checking, installs, the server engine) is being rebuilt in native code, mostly Rust. Some of it arrives for free as you upgrade (Vite 8, Rolldown, Nitro v3); the rest are opt-in tools still maturing, and a few aren't Nuxt-ready yet. Either way it points at a much faster workflow.
::

Nuxt has long been the framework you reach for when you want a genuinely good developer experience with Vue. File-based routing, auto-imports, server routes, sensible defaults — it quietly handles the boring parts so you can build.

The one thing it could never fix was *workflow* speed. Not your app in production — the tools around you. Installing dependencies, type-checking, linting, formatting, bundling, cold-starting the dev server. On a large project each of those costs real time, and almost none of it was ever Nuxt's fault. It's the stack underneath — and that's the part finally changing.

It's also the thing I keep getting excited about. Across the ecosystem, the tools we build with are being rebuilt on native foundations, and the long era of *performance-critical JavaScript tooling written mostly in JavaScript* is quietly ending. It arrives piece by piece, backed by real investment: several of these projects now sit inside Cloudflare, Vercel, and Microsoft. Your app stays JavaScript; the machinery around it goes native.

Here's the whole shift on one screen, ordered by when you'll actually feel it: what's shipping **now**, what lands **soon** across 2026, and what's still experimental for **later**.

::blog-figure
---
src: /img/nuxt-dx-roadmap.png
alt: "A three-column roadmap titled \"The roadmap to better Nuxt DX\". SHIPPING (stable today): Vite 8 + Rolldown. SOON (landing across 2026): oxlint & oxfmt, TypeScript 7, Nitro v3, pnpm v12. LATER (still experimental): Bundled Dev Mode, Vize."
wide: true
---
The same map I'll walk through below — read it left to right and it's roughly the order a Nuxt developer will feel each change.
::

## Where a lot of this starts

A lot of this story traces back to two groups: one company most Nuxt developers can't name, and the core team that maintains Nuxt itself. Start with the company. VoidZero was founded by [Evan You](https://evanyou.me/) — creator of Vue and Vite — and was [recently acquired by Cloudflare](https://blog.cloudflare.com/voidzero-joins-cloudflare/), which has said the projects will stay open-source and vendor-agnostic. VoidZero is behind **Vite**, **Vitest**, **Rolldown**, and **Oxc**. I will focus on three of those.

### Vite & Rolldown — the bundler

Start with the tool you touch most without thinking about it: **Vite**. It powers Nuxt's dev server and production builds — the thing that turns your source files into something a browser can run. This is the piece you can feel *today*.

For years Vite leaned on two tools underneath. In development it used **esbuild**, which is blisteringly fast. For production it used **Rollup**, which has a mature plugin ecosystem and excellent output but runs noticeably slower. The split worked, but it cost you: subtle dev-vs-production differences, duplicated integration work, and two pipelines to keep in sync.

**Rolldown** is VoidZero's answer — a single Rust bundler that replaces both sides of that split. It keeps Rollup-style plugin compatibility while running much closer to esbuild speed, so one engine handles dev *and* build. 

::stat-bar
---
title: Linear's production build, during the Vite 8 beta
bars:
- label: Rollup
  value: 46
  display: 46s
- label: Rolldown
  value: 6
  display: 6s
  highlight: true
source: Vite 8 announcement, vite.dev
sourceTo: https://vite.dev/blog/announcing-vite8
---
Vite 8 clocks Rolldown at [10–30× faster than Rollup](https://vite.dev/blog/announcing-vite8). This is the kind of win you mostly get for free once Nuxt sits on top of it.
::

Vite 8 has been stable since March 2026 (8.1 is out too). On the Nuxt side, based on the current [Vite 8 migration work](https://github.com/nuxt/nuxt/pull/34256), **4.5** looks like the first likely place most users may touch it, with **Nuxt 5** bringing the full frontend/server alignment — because Nuxt isn't only a frontend Vite app. Its server engine (Nitro, below) has to move onto the same Vite 8 / Rolldown foundation too.

::tool-status
---
status: stable
nuxt: Likely first in Nuxt 4.5 · full alignment in Nuxt 5
---
**Faster builds and one consistent dev/build pipeline** — plus a foundation for future improvements like Full Bundle Mode (more below).
::

### oxc — linting & formatting

VoidZero isn't stopping at bundling. In parallel they are building **Oxc**, the Oxidation Compiler: a full JavaScript/TypeScript toolchain in Rust — parser, transformer, resolver, minifier, linter, formatter. Day to day, you might end up using **oxlint** (an ESLint-compatible linter) and **oxfmt** (a Prettier-compatible formatter).

::speed-stats
---
items:
- value: "50–100×"
  tool: oxlint
  vs: vs ESLint
- value: "30×"
  tool: oxfmt
  vs: vs Prettier
- value: "3×"
  tool: Oxc parser
  vs: vs SWC
source: oxc.rs benchmarks
sourceTo: https://oxc.rs
---
::

That parser number matters more than it looks: parsing sits underneath almost every other tool, so making it fast lifts everything built on top. And it's about to get faster still — the team is prototyping **SIMD-powered lexing** (scanning several bytes at once) in its [2026 Q3 plan](https://github.com/oxc-project/oxc/issues/23976), targeting another ~3×. Because every linter, formatter, and bundler *starts* by parsing text.

The catch for us is Vue. A Vue SFC isn't just a `.ts` file — a linter has to understand how `<script setup>` relates to `<template>`, or rules like "unused variable" get the wrong answer. Oxc has an [RFC for embedded framework support](https://github.com/oxc-project/oxc/discussions/21936) and a [tracking issue for language plugins](https://github.com/oxc-project/oxc/issues/23207), but the JS plugin system is not yet implemented, so Vue developers can't lean on it yet.

::side-note
This is the piece I'm most impatient for — oxlint is the foundation of a Nuxt linting module I'm building, [nustack/lint](https://npmx.dev/package/@nustackjs/lint) alongside multiple related oxlint plugins for Nuxt ecosystem.
::

Still, near-instant linting and formatting changes the feedback loop entirely. It enables deeper rules, such as type-aware mode powered by [tsgolint](https://github.com/oxc-project/tsgolint), which allows for better and faster linting — especially important when AI agents run these checks over and over again.

To be clear about real work, though: I wouldn't treat oxlint and oxfmt as a full ESLint/Prettier replacement in a Nuxt app yet. Until the Vue SFC support lands, they're something you can run *alongside* your existing setup on plain JS/TS, not instead of it.

::tool-status
---
status: partial
nuxt: Usable for JS/TS · Vue templates not yet
blockedBy: embedded framework support
blockedByTo: https://github.com/oxc-project/oxc/issues/23207
---
**Way faster and more powerful linting and formatting** once Vue support is good enough to trust.
::

## The wider native wave

VoidZero is central for the entire JS ecosystem, but it isn't the whole story. The same rewrite is happening across the rest of the toolchain — the parts that sit under *every* framework, not just Nuxt. These are the pieces landing **soon**.

### TypeScript, rewritten in Go — type-checking

You've probably heard this one: TypeScript is getting a native port written in **Go**, shipping as **TypeScript 7**.

::side-note
[Rustaceans](https://rustacean.net/) may be disappointed it wasn't Rust. The tsgo team had strong reasoning behind that [explained in this discussion](https://github.com/microsoft/typescript-go/discussions/411).
::

The language matters less than the result: a native implementation that should cut most type-checks by up to [10×](https://devblogs.microsoft.com/typescript/typescript-native-port/), with much faster editor startup and lower memory use. It's already at release-candidate stage.

For Vue and Nuxt there's the usual delay. `vue-tsc` and Vue's language tooling lean on TypeScript more deeply than a plain project does; there's an [open issue for TypeScript 7 support](https://github.com/vuejs/language-tools/issues/5381), but full adoption may wait on the native API stabilizing. As I mentioned before, it loops back to oxlint, too: Oxc is building *type-aware* linting on the native compiler, so the endgame isn't just faster linting — it's faster linting that actually knows your types.

::tool-status
---
status: rc
nuxt: Vue/Nuxt support still TBD
blockedBy: vue-tsc support + native-API maturity
blockedByTo: https://github.com/vuejs/language-tools/issues/5381
---
**Much faster type-checking and IDE feedback** once Vue tooling catches up.
::

### pnpm, moving to Rust — installs

Package managers are riding the same wave. The best pick for me and most of the Nuxt ecosystem was (and still is) **pnpm**, for its strict layout, security model, community (especially the developers), and disk-efficient store — the one weak spot was raw speed. That's what **pnpm v12** targets: a Rust rewrite of pnpm's install engine.

This isn't a new package manager or a reimagining. It's meant to *become* pnpm's install engine while preserving its behavior, lockfile, and defaults. pnpm 11 already ships [experimental opt-in support](https://pnpm.io/blog/releases/11.2), the work has [moved into the main pnpm repo](https://github.com/pnpm/pacquet), and **pnpm 12** is expected to make the Rust engine the main path — benchmarks point to big wins, though real-world workspaces still need shaking out.

::blog-figure
---
src: https://pnpm.io/img/benchmarks/alotta-files-pnpm.svg?v=0b1a77c0
alt: "pnpm's live install benchmark: horizontal bars for pnpm 12 (with the new Rust engine) in orange, against the additional time pnpm 11 takes shown in grey, across scenarios like clean install, warm cache, existing node_modules, and update. pnpm 12 is faster in every row."
surface: light
source: pnpm benchmarks
sourceTo: https://pnpm.io/benchmarks
---
This is the win, measured — pnpm's own benchmark of pnpm 12's Rust engine (orange) against pnpm 11 across install scenarios. Lower is better; the grey is the time the rewrite shaves off.
::

::tool-status
---
status: preview
nuxt: Usable experimentally today
---
**Faster dependency installation**.
::

## Where it gets Nuxt-specific

Everything above touches *all* JS/frontend development. Now I want to focus a bit more on Nuxt-specific upgrades brought to us by  **NuxtLabs**, the company behind **Nuxt**, **Nitro**, **Nuxt UI**, **Nuxt Studio**, and much of the unjs ecosystem, founded by [Sébastien Chopin](https://github.com/atinux), Nuxt's creator. After [NuxtLabs joined Vercel](https://nuxtlabs.com/), the team leaned *further* into open source — Nuxt UI v4 merged the free and Pro libraries into one [open package](https://ui.nuxt.com/docs/getting-started), and Nuxt Studio shipped as a [free, self-hosted module](https://content.nuxt.com/blog/studio-oss).

### Nitro v3 — the server engine

**Nitro** is Nuxt's server engine — it builds and runs your backend, API routes, server rendering, and deployment output. It's the reason one Nuxt app can target Node, serverless, edge, or static.

**Nitro v3** is a ground-up cleanup of that foundation, [built around web standards, Rolldown, and Vite 8](https://nitro.build/blog/v3-beta). So Vite 8 / Rolldown gains now reach your *server* build too. Three changes stand out: Rolldown-powered server builds with leaner output; less runtime overhead (routes compiled at build time, only what a request needs gets loaded); and far fewer dependencies, which matters more than you probably think.

::stat-bar
---
title: Dependencies Nitro pulls in
bars:
- label: Nitro v2
  value: 321
  display: "321"
- label: Nitro v3
  value: 20
  display: "≤20"
  highlight: true
source: Nitro v3 beta announcement, nitro.build
sourceTo: https://nitro.build/blog/v3-beta
---
Fewer packages means fewer things to audit, fewer to break, a smaller [supply-chain attack surface](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/) — and faster cold starts.
::

Nitro v3 matters most for serverless and edge, where cold starts and bundle size bite hardest. It lands in core with **Nuxt 5**, alongside H3 v2.

::tool-status
---
status: beta
nuxt: Lands in Nuxt 5
---
**Smaller server bundles, fewer dependencies, faster development thanks to Vite 8.**
::

### unjs & H3 — the plumbing

That's not everything! A lot of framework performance hides in unglamorous runtime packages — HTTP handling, config loading, storage adapters, module loading — and this is where the **unjs** ecosystem matters. **unjs** is not a single framework, but a collection of small, focused JavaScript and TypeScript packages used throughout Nuxt and Nitro. 

The clearest example is **H3**, the small HTTP framework under Nitro's request handling. In Nitro v3, **H3 v2** is rebuilt around web-standard primitives (`Request`, `Response`, `Headers`, `URL`), making server code far more portable across Node, Bun, Deno, and Workers. It's not flashy, but it's exactly the kind of cleanup that makes a framework more reliable over time.

## What I'm most excited about

The pieces above are the ones you'll feel soonest. The ones I'm *most* excited about are further out — they are not close to being production ready today, but the development is moving fast. This is the **later** column: assume everything here is experimental.

::side-note
I'm skipping Vue Vapor Mode and other runtime-performance work on purpose — it's important, but it's about your *users'* runtime, and this post is about developer experience.
::

### Vite Bundled Dev Mode — dev speed on huge apps

Vite's dev server has always served unbundled ESM — a brilliant call at launch: start instantly, compile only what the browser asks for. But very large apps now fire off hundreds or thousands of dev requests, and the bottleneck shifts from the build tool to the browser and network.

Vite 8.1 adds experimental **Bundled Dev Mode** (formerly Full Bundle Mode): it bundles during development, closer to the production model, while keeping fast HMR.

::speed-stats
---
items:
- value: "15×"
  tool: startup
  vs: 10,000-component test
- value: "10×"
  tool: reloads
  vs: 10,000-component test
source: Vite 8.1 announcement
sourceTo: https://vite.dev/blog/announcing-vite8-1
---
::

For real performance benefits that affect Nuxt, we’ll still have to wait some time. You can check the current [rollout plan](https://github.com/rolldown/rolldown/issues/9030), but after that, Nitro and Nuxt will still need to adopt it. It should also finally make `vite.optimizeDeps` unnecessary, since everything will be optimized.


### Vize — a unified Rust toolchain for Vue

React is already moving toward a compiler-heavy future — Oxc even ships a [Rust port of the React Compiler](https://oxc.rs/docs/guide/usage/transformer/react-compiler.html). Vue deserves the same level of tooling ambition, and that’s exactly what [@ubugeeei](https://github.com/ubugeeei) is exploring with [**Vize**](https://vizejs.dev/): an experimental Rust-native toolchain for Vue.

The goal isn't just "a faster Vue compiler." It's a *vertically integrated* toolchain where compilation, linting, formatting, type-checking, and editor tooling share one high-performance core — instead of being stitched together from disconnected tools that each re-parse the file and disagree about the edge cases.

> The interesting part was never a faster compiler. It's one shared core that finally agrees on what your file means.

Vize already posts impressive numbers, integrates oxlint, and has passed thousands of tests. I wouldn’t use it in production just yet, but it’s clearly entering its real-world testing phase. So if you’re interested in Vue tooling, give it a try, test it, report bugs, and follow its development!

## Where this leaves us

The trend is no longer subtle: installing, parsing, linting, formatting, type-checking, bundling, serving — every layer is being rebuilt or seriously reworked, most of it on native foundations. The result is a workflow that fights you less. Builds finish sooner, type errors surface faster, linters stop feeling like a tax, dev servers cold-start quicker. And it matters more now that AI agents are part of daily development: they run these tools constantly, so every second saved per install, lint, build, or type-check adds up.

Two things stick with me from all of this.

**Rust has quietly become the language the JavaScript ecosystem builds its tools in** — not for your app, but for everything around it. Rolldown, Oxc, oxlint, oxfmt, pnpm v12, Vize: all Rust. TypeScript's Go port is the notable exception that proves the rule. The pattern is the same either way — your app stays JavaScript, the machinery goes native.

**And the acquisitions people were nervous about — myself included — have so far gone the good way.** VoidZero into Cloudflare, NuxtLabs into Vercel: still open, better resourced, and shipping *faster* than before. That's not how every open-source acquisition has gone, which is exactly why this one is worth saying out loud.

Mostly I want to say thank you, to the people doing this hard, mostly unglamorous work: the **VoidZero**, **NuxtLabs** companies, **unjs**, **TypeScript** and **pnpm** teams, and the individuals pushing the edge.

::side-note
All of this comes from OSS developers, and a lot of it from the people whose names you never see. I feel real gratitude to them for the work:
- **Vite & Rolldown** — the Rolldown core team, especially [@hyf0](https://github.com/hyf0), [@IWANNABETHATGUY](https://github.com/IWANNABETHATGUY) and [@h-a-n-a](https://github.com/h-a-n-a), plus the Vite core team ([@sapphi-red](https://github.com/sapphi-red), [@hi-ogawa](https://github.com/hi-ogawa))
- **Oxc** — [Boshen](https://github.com/Boshen), [@overlookmotel](https://github.com/overlookmotel), [@camc314](https://github.com/camc314) and [@leaysgur](https://github.com/leaysgur)
- **pnpm** — [Zoltan Kochan](https://github.com/zkochan)
- **unjs and Nitro** — [Pooya Parsa](https://github.com/pi0)
- **Vize** — [@ubugeeei](https://github.com/ubugeeei)

Far more names than fit here; if I missed you, it wasn't for lack of gratitude.
::

## What should Nuxt developers do now?

Some of this you'll get for free; some of it you'll have to reach for. A few pieces upgrade *underneath* you as Nuxt, Vite, and the rest move on. Others are opt-in, and a couple will want real migration work. Here's how I'd approach it:

- **Now.** You're already on Vite, so the Vite 8 and Rolldown gains land as Nuxt adopts them — likely first around **4.5**, with full alignment in **Nuxt 5**. You won't rewrite anything for this one, you'll just upgrade and watch your build times drop, in some cases massively.
- **Across 2026.** oxlint and oxfmt, TypeScript 7, Nitro v3, and pnpm 12 all mature. These are opt-in: try them on side projects first, and watch the Vue SFC support before trusting oxlint/oxfmt on templates. Nitro v3 lands with Nuxt 5 and may need real work if you have custom server code.
- **Later.** Bundled Dev Mode and Vize are still experiments. Keep an eye on them and give them a spin on side projects.

And whichever bucket **a tool falls into, get involved**. Spread the word. Migrate your projects. Report the bugs you find. Give the maintainers honest feedback, and contribute back where you can. Native tooling gets good because people push it hard in the open, and the faster we move onto the new foundation, the sooner the next round of improvements arrives.
