---
title: Error handling — Rust vs Kotlin
description: Two languages I love, two completely different philosophies for dealing with the moment things go wrong.
date: 2026-03-22
image: /hero/random-6.avif
minRead: 9
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

I spend most of my time split between Rust and Kotlin, and nothing exposes their differing worldviews quite like error handling. Both are modern, both are type-safe, and they reach almost opposite conclusions about how a program should fail.

## Rust: errors are values

In Rust, a function that can fail says so in its type. There's no hidden control flow — the failure is right there in the signature as a `Result`.

```rust
fn parse_config(raw: &str) -> Result<Config, ConfigError> {
    let parsed = toml::from_str(raw)?; // ? propagates the error
    validate(&parsed)?;
    Ok(parsed)
}
```

The `?` operator is the quiet hero. It says "if this is an error, return it; otherwise unwrap it." You handle errors by *not being able to ignore them* — a `Result` you don't use is a compiler warning.

The cost: error types are explicit, and you'll spend time designing them or reaching for crates like `thiserror` and `anyhow`.

## Kotlin: exceptions, but disciplined

Kotlin inherits exceptions from the JVM, but it deliberately removed *checked* exceptions. Nothing forces you to declare or catch.

```kotlin
fun parseConfig(raw: String): Config {
    val parsed = Toml.decodeFromString<Config>(raw)
    validate(parsed)
    return parsed
}
```

Cleaner to read, but the failure modes are invisible at the call site. You have to know — from docs, convention, or a stack trace in production — that this can throw.

Kotlin gives you tools to opt into value-based errors when you want them:

```kotlin
val result = runCatching { parseConfig(raw) }
result
    .onSuccess { use(it) }
    .onFailure { log(it) }
```

`Result<T>` and sealed-class hierarchies let you model the Rust style when a particular domain demands it.

## How I actually choose

| Situation                          | I reach for         |
| ---------------------------------- | ------------------- |
| A recoverable, expected failure    | Values (`Result`)   |
| A genuine bug / impossible state   | Exception / `panic` |
| Public library API                 | Explicit error type |
| Quick internal script              | Whatever's shortest |

The dividing line I've settled on: **expected failures are values, bugs are exceptions.** Rust nudges you toward that line by making values ergonomic. Kotlin lets you choose, which means the discipline has to come from you.

> A failure you modeled in the type system is a failure you'll remember to handle. A failure hidden in a thrown exception is a failure you'll meet in production.

## The takeaway

Neither approach is wrong. Rust optimizes for "you cannot forget"; Kotlin optimizes for "don't make me write ceremony for the common case." Working in both has made me a better engineer in each — I write more deliberate Kotlin because Rust taught me to, and I write less ceremonious Rust because Kotlin showed me where it's overkill.
