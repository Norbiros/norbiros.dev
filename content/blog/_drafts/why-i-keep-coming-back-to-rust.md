---
title: Why I keep coming back to Rust
description: It's not the borrow checker that keeps me here — it's everything that becomes possible once you stop fighting it.
date: 2026-05-28
image: /hero/random-2.avif
minRead: 6
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

Every couple of months I try to talk myself out of Rust. I'll start a side project in something "faster to write" — Go, TypeScript, the occasional Python script — and within a week I find myself missing the one thing Rust gives me that nothing else does: the quiet confidence that if it compiles, it probably works.

## The borrow checker is a teacher, not a gatekeeper

The first month with Rust, the borrow checker feels like an adversary. You write code the way you'd write it in any other language, and the compiler rejects it. It's frustrating because the rejection feels arbitrary.

It isn't. Most of those rejections are bugs you'd have shipped in another language and debugged at 2am three weeks later.

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

Once the lifetimes click, you stop thinking about them consciously. They become the same kind of background knowledge as knowing not to mutate a list while iterating over it.

## What actually keeps me here

It's the small things that compound:

- **`Result` and `?`** make error handling something you do, not something you skip.
- **Exhaustive `match`** means adding a variant to an enum turns into a to-do list of every place that needs updating.
- **`cargo`** is the toolchain I wish every language had. Build, test, format, lint, docs — one tool, no config archaeology.

> The best code review I get is the one that happens before I open a PR — from a compiler that refuses to let a whole category of mistakes through.

## A quick comparison

Here's roughly how I think about the trade-offs day to day:

| Concern              | Rust            | The alternative I tried |
| -------------------- | --------------- | ----------------------- |
| Time to first commit | Slow            | Fast                    |
| Time to first bug    | Slow            | Fast                    |
| Refactor confidence  | High            | "Run it and see"        |
| Onboarding a new dev | Steep           | Gentle                  |

The top two rows are the whole story. Rust front-loads the cost. You pay during development instead of in production, and that's a trade I'll take almost every time.

## So should you learn it?

If you've been curious, yes — but give it more than a weekend. The payoff lives on the other side of the frustration, and most people quit one week too early.

More on the actual projects I'm building with it soon.
