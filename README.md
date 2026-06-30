# Sol Marketing — Instagram Reels (Remotion)

Vertical (1080×1920 @ 30fps) Remotion project for Instagram Reels. Every
composition renders with a **transparent background** so it composites over
footage in your editor.

## Stack

- [Remotion](https://remotion.dev) 4 + React 19 + TypeScript
- Google fonts via `@remotion/google-fonts` — **Anton** (bold condensed display,
  used for stamps) and **Inter** (UI/body)

## Globals & theme

`src/theme.ts` is the single source of truth:

- `VIDEO` — `{ width: 1080, height: 1920, fps: 30 }`
- `COLORS` — brand palette (currently placeholders; swap the hex values):
  navy `#16263F`, amber `#E0A458`, offwhite `#F7F4EE`, ink `#23303F`,
  redacted `#8A8A8A`
- `FONTS` — `display` (Anton) and `ui` (Inter)

## Reusable primitives (`src/components/`)

- **`<Stamp>`** — text that slams in word-by-word. Each word rides a single
  underdamped `spring()` mapped to scale, so it pops in, overshoots just past
  `1.0`, and settles to `1.0`. Props: `text`, `color`, `fontSize`,
  `perWordStagger` (frames between words), `flashOnFinalWord` (amber glow on the
  last word).
- **`<KineticList>`** — takes a `string[]` and ticks each item in with a quick
  spring entrance (slide up + fade), staggered by `perItemStagger`. Earlier
  items stay on screen, so the list builds up. Props include `items`, `color`,
  `accent`, `fontSize`, `perItemStagger`, `startFrame`, `bullet`, `align`.

## Compositions

Registered in `src/Root.tsx`: `StampScene`, `KineticListScene`. Both are
1080×1920 @ 30fps with a transparent `AbsoluteFill`.

## Develop

```bash
npm install
npm run dev        # Remotion Studio
npm run typecheck
```

## Render to ProRes 4444 (alpha-preserving)

`render:prores` renders to ProRes 4444 with `yuva444p10le` so the alpha channel
is preserved. Pass the composition id and an output `.mov` path after `--`:

```bash
npm run render:prores -- StampScene out/stamp.mov
npm run render:prores -- KineticListScene out/list.mov
```

> In sandboxed/CI environments without a downloadable Chrome, point Remotion at
> a pre-installed Chromium headless shell and (if a TLS-proxy is in play) allow
> cert errors:
>
> ```bash
> npm run render:prores -- StampScene out/stamp.mov \
>   --browser-executable=/path/to/headless_shell --ignore-certificate-errors
> ```
