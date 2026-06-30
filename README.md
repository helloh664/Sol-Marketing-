# Sol-Marketing- — Remotion Reels

Remotion (TypeScript) project for vertical Instagram Reels.

- **Resolution:** 1080×1920 (9:16)
- **Frame rate:** 30 fps
- **Background:** every composition renders on a **transparent** canvas so it
  composites over footage. Render to ProRes 4444 to keep the alpha channel.

## Scripts

```bash
npm run dev          # open Remotion Studio
npm run typecheck    # tsc --noEmit

# Render any composition to alpha-preserving ProRes 4444:
npm run render:prores -- <CompositionId> out/<name>.mov
# e.g.
npm run render:prores -- StampReel out/stamp.mov
```

`render:prores` forces `--codec=prores --prores-profile=4444
--pixel-format=yuva444p10le --image-format=png`, which preserves transparency.

## Project layout

- `src/theme.ts` — color palette (placeholder brand colors), Google fonts
  (Anton for stamps, Inter for UI), and the global video constants.
- `src/components/Stamp.tsx` — `<Stamp>`: text that slams in word-by-word with a
  spring scale overshoot settling to 1.0, plus an optional flash on the last word.
- `src/components/KineticList.tsx` — `<KineticList>`: ticks an array of strings in
  one after another; earlier items stay on screen so the list builds.
- `src/Root.tsx` — registers all compositions (`StampReel`, `KineticListReel`,
  `ComboReel`).

## Note on rendering

Google Fonts are fetched at runtime from `fonts.gstatic.com`. If you render in an
environment without a pre-installed Chrome, Remotion downloads one on first run.
Where a browser is already provided, pass
`--browser-executable=/path/to/chrome-headless-shell`.
