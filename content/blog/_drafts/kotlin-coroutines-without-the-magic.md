---
title: Kotlin coroutines without the magic
description: Suspend functions feel like magic until you understand the state machine underneath. Then they just feel like good design.
date: 2026-05-12
image: /hero/random-3.avif
minRead: 8
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

The first time I used a Kotlin coroutine, I copied a snippet off Stack Overflow, it worked, and I had no idea why. That's a dangerous place to be — code that works for reasons you don't understand is code that will break for reasons you can't debug.

So I sat down and worked out what `suspend` actually does. It's less magical and more clever than I expected.

## A suspend function is a state machine

When you mark a function `suspend`, the compiler doesn't give it a special runtime. It rewrites it into a state machine that can pause and resume. Conceptually:

```kotlin
suspend fun loadUser(id: String): User {
    val profile = fetchProfile(id)   // suspension point 1
    val settings = fetchSettings(id) // suspension point 2
    return User(profile, settings)
}
```

Each `await`-like suspension point becomes a label in a generated state machine. The function gets an extra hidden parameter — a `Continuation` — that captures "what to do next." When `fetchProfile` finishes, it calls back into the continuation, which jumps to the next state.

No threads are blocked while waiting. That's the entire point.

## Structured concurrency is the real feature

Coroutines would be a footgun without **structured concurrency**. The rule is simple: a coroutine cannot outlive its scope.

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { loadUser("123") }
    val feed = async { loadFeed() }
    Dashboard(user.await(), feed.await())
}
```

If `loadFeed()` throws, `loadUser` is cancelled automatically, and `loadDashboard` propagates the failure. You don't leak work. You don't get zombie tasks running after the thing that needed them is gone.

This is the part people miss when they say "coroutines are just async/await." They're async/await with the cleanup built into the language.

## Things that bit me early

1. **Calling a blocking API inside a coroutine.** `Thread.sleep()` blocks the underlying thread. Use `delay()`. If you must call blocking code, wrap it in `withContext(Dispatchers.IO)`.
2. **Swallowing `CancellationException`.** A `catch (e: Exception)` that also catches cancellation will break cooperative cancellation. Rethrow it.
3. **Launching into `GlobalScope`.** It's the coroutine equivalent of leaking a thread. Almost always the wrong choice.

> Cancellation in coroutines is cooperative. Your code has to check for it — at every suspension point, the runtime does this for you, but a tight CPU loop with no suspension points will happily ignore a cancel.

## The mental model that stuck

Stop thinking of `suspend` as "this runs in the background." Think of it as "this function is allowed to pause here and let something else run on this thread." Once that clicked, everything else — dispatchers, scopes, flows — fell into place.

Kotlin made the hard part (the state machine) invisible and the important part (structured lifetimes) explicit. That's good language design.
