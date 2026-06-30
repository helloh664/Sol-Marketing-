# Sol-Marketing-

Remotion project for vertical **Instagram Reels** — `1080x1920` @ `30fps`. Every
composition renders over a **transparent background** so it composites over
footage in your editor.

## Setup

```bash
npm install
npm run dev      # open Remotion Studio
```

## Project layout

```
src/
  theme.ts                  # brand palette + Google fonts (Anton, Inter) + global video config
  components/
    Stamp.tsx               # word-by-word "slam in" stamp with spring overshoot
    KineticList.tsx         # list that ticks items in one after another
  compositions/
    StampReel.tsx           # demo wiring <Stamp> over transparent bg
    KineticListReel.tsx     # demo wiring <KineticList> over transparent bg
  Root.tsx                  # registers every composition
  index.ts                  # registerRoot entry point
remotion.config.ts          # defaults renders to alpha-preserving ProRes 4444
```

### Theme

`src/theme.ts` exposes the brand `colors` (placeholders — swap for real brand
hex values), the global `video` dimensions/fps, and `fonts` (`display` = Anton
for stamps, `ui` = Inter for everything else), loaded via
`@remotion/google-fonts`.

### Primitives

- **`<Stamp>`** — `text` slams in word-by-word. Each word rides a `spring()`
  that overshoots in scale and settles to `1.0`. Props: `text`, `color`,
  `fontSize`, `perWordStagger` (frames between words), `flashFinalWord` (small
  flash accent on the last word).
- **`<KineticList>`** — `items: string[]` tick in one after another, each with a
  quick spring entrance; previous items stay on screen so the list builds. Props
  include `perItemStagger`, `startAt`, `fontSize`, `color`, `markerColor`,
  `marker`, `gap`, `align`.

## Rendering (alpha-preserving)

Renders default to **ProRes 4444** with PNG frames, preserving the alpha
channel. Pass a composition id and an output path ending in `.mov`:

```bash
npm run render:prores -- StampReel out/stamp.mov
npm run render:prores -- KineticListReel out/list.mov
```

`remotion.config.ts` already sets the codec, ProRes profile, and a
`yuva444p10le` pixel format, so a plain `npm run render -- <Comp> out/x.mov`
also produces an alpha video.
