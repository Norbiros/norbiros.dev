---
title: My minimal Linux dev setup
description: A tour of the small, boring tools that make my Gentoo machine feel like mine — and why boring is the point.
date: 2026-04-15
image: /hero/random-5.avif
minRead: 5
author:
  name: Norbiros
  to: https://github.com/Norbiros
  avatar:
    src: https://github.com/Norbiros.png
    alt: Norbiros
---

People assume a Gentoo user must have a heavily customized, ricer-grade desktop. Mine is almost aggressively plain. After years of tweaking, I've landed on a setup optimized for one thing: getting out of my way.

## The shell is where I live

Most of my day happens in a terminal, so that's where I spend my configuration budget.

```bash
# the three aliases I'd be lost without
alias gs='git status -sb'
alias gd='git diff'
alias ll='eza -la --git'
```

I swapped a few classic tools for modern rewrites and never looked back:

| Old        | New     | Why                                  |
| ---------- | ------- | ------------------------------------ |
| `ls`       | `eza`   | Git status in the listing            |
| `cat`      | `bat`   | Syntax highlighting, line numbers     |
| `grep`     | `rg`    | Faster, sane defaults, respects gitignore |
| `find`     | `fd`    | Human-friendly syntax                |

None of these are life-changing on their own. Together they shave a few seconds off a hundred tiny interactions a day.

## Why Gentoo, honestly

I don't recommend Gentoo to most people, and that's fine. I run it for two reasons:

1. **I understand my system.** Compiling from source means I've had to learn what every piece does. When something breaks, I'm not helpless.
2. **It changes only when I change it.** No surprise updates rearranging my desktop on a Tuesday.

> The goal of a dev environment isn't to be impressive. It's to be invisible. The best compliment my setup gets is that nobody notices it.

## Editor and multiplexing

- **Neovim** with a deliberately small config. Every plugin has to earn its place.
- **tmux** for persistent sessions — I can close my laptop, come back, and everything is exactly where I left it.
- **A single monospace font** everywhere, so my eyes never have to re-adjust between terminal, editor, and browser devtools.

## The real lesson

Every tool you add is a tool you have to maintain, update, and remember the keybindings for. The most productive change I made in the last year was *deleting* half my dotfiles. Boring, stable, and mine. That's the whole philosophy.
