# Open Shelf

> Know what you have. Know when it expires.

Open Shelf is a local-first Progressive Web App for tracking your pantry inventory and food expiration dates — so you never arrive home to find the ingredient you skipped buying has already expired.

## The Problem

You open the fridge before heading to the store. You think you have yogurt, chicken, or that block of cheese. So you don't buy it. You get home, and it expired three days ago.

Or the opposite: you've been buying the same pasta every week because you forgot you already have two unopened packs sitting in the back of the cupboard.

The root cause is the same: **you don't know what you actually have, or when it expires.** Expiration dates get hidden when items are pushed to the back of shelves, labels are hard to read, and memory is unreliable across a week of busy days.

This leads to:

- Food waste from expired items you didn't notice in time
- Unnecessary purchases of things you already own
- Last-minute recipe failures when a key ingredient turns out to be unusable
- No way to know what needs to be used up first

## What Open Shelf Does

Open Shelf gives you a real-time view of your pantry: what you have, how much, and when each item expires.

Each time you buy something, you register it as a **batch** — a quantity tied to an expiration date. Open Shelf then:

- Shows you the current state of every item in your inventory
- Warns you in advance when batches are approaching their expiration date
- Guides you to consume the oldest batch first (FIFO)
- Lets you record consumption so quantities stay accurate
- Runs entirely offline on your device — no account, no server, no sync

## Key Features

- **Multi-batch tracking** — Each purchase is a separate batch with its own expiration date and quantity
- **Expiration alerts** — Configurable advance warning (e.g. 3 days before expiry) surfaced in a dedicated alerts view
- **FIFO consumption** — Batches are ordered by expiration date; you consume the soonest-to-expire first
- **Consumption tracking** — Record partial or full consumption to keep quantities accurate
- **Searchable inventory** — Filter by name, category, or stock status
- **JSON export / import** — Full backup and restore of all data
- **Local-first** — All data lives in IndexedDB on your device; no backend required
- **Installable PWA** — Add to home screen, works 100% offline

## Tech Stack

| Layer             | Choice                       |
| ----------------- | ---------------------------- |
| UI framework      | React 19 + Vite              |
| Routing           | TanStack Router (file-based) |
| Server state      | TanStack Query               |
| Component library | shadcn/ui + Tailwind CSS v4  |
| Local database    | Dexie.js (IndexedDB)         |
| PWA               | vite-plugin-pwa + Workbox    |
| Language          | TypeScript (strict mode)     |
| Lint / format     | Biome                        |
| Tests             | Vitest                       |

## Project Status

**Specification phase.** The full MVP is designed and documented; implementation has not started yet.

## License

MIT © [Jonathan García](./LICENSE)
