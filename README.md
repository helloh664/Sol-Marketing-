# Sol-Marketing — Remotion Reels

Remotion (TypeScript) project for vertical Instagram Reels.

- **Resolution:** 1080×1920
- **Frame rate:** 30fps
- **Compositions render on a transparent background** so they composite over
  footage. Render to ProRes 4444 to preserve the alpha channel.

## Setup

```bash
npm install
```

## Develop

Open Remotion Studio to preview and tweak compositions:

```bash
npm run dev
```

## Project structure

```
src/
  index.ts              # registerRoot entry point
  Root.tsx              # registers every Composition
  theme.ts              # brand palette + Google fonts + global video config
  components/
    Stamp.tsx           # word-by-word "slam in" display text (spring overshoot)
    KineticList.tsx     # builds a list one item at a time
remotion.config.ts      # render defaults (ProRes 4444 + alpha pixel format)
```

### Theme

`src/theme.ts` exposes:

- `colors` — brand palette (currently **placeholder** values, swap for real
  brand colors): `navy`, `amber`, `offwhite`, `ink`, `redacted`.
- `fonts` — `display` (Anton, bold condensed, for stamps) and `ui` (Inter),
  both loaded via `@remotion/google-fonts`.
- `video` — global `width` / `height` / `fps`.

### Components

- `<Stamp>` — text that slams in word-by-word. Each word is driven by a
  `spring()` whose value maps to scale, launching from 0, overshooting past
  1.0 and settling back to 1.0. Props: `text`, `color`, `fontSize`,
  `perWordStagger` (frames between words), `flashFinalWord` (optional white
  burst on the last word).
- `<KineticList>` — takes an array of strings and ticks them in one after
  another with a quick `spring()` entrance; earlier items stay on screen so
  the list builds. Props: `items`, `perItemStagger`, `color`, `accent`,
  `fontSize`, `startAt`.

## Rendering

Render any registered composition to **ProRes 4444** (alpha preserving):

```bash
npm run render:prores -- <CompositionId> out/<CompositionId>.mov
```

Examples:

```bash
npm run render:prores -- StampDemo out/StampDemo.mov
npm run render:prores -- KineticListDemo out/KineticListDemo.mov
```

The `render:prores` script sets `--codec=prores --prores-profile=4444` plus an
alpha-capable pixel format (`yuva444p10le`), so the resulting `.mov` carries a
transparent background ready to composite over footage.

> In sandboxed environments where Chromium cannot download or validate certs,
> append `--browser-executable=<path-to-chromium> --ignore-certificate-errors`.
