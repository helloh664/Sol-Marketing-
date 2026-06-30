import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/**
 * Brand palette.
 *
 * NOTE: these are placeholder values — swap them for the real brand colors.
 */
export const colors = {
  /** Deep background navy. */
  navy: "#16263F",
  /** Accent amber, used for highlights and the final-word flash base. */
  amber: "#E0A458",
  /** Off-white, primary text on dark footage. */
  offwhite: "#F7F4EE",
  /** Near-black ink, primary text on light footage. */
  ink: "#23303F",
  /** Muted grey for "redacted" / de-emphasized text. */
  redacted: "#8A8A8A",
} as const;

export type ColorName = keyof typeof colors;

// Load the two Google fonts at module scope so they are ready before any
// composition renders. `loadFont` returns the resolved CSS `fontFamily`.
// We restrict to the latin subset and the weights we actually use to keep
// the number of font requests (and the render bundle) small.
const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const inter = loadInter("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  /** Bold condensed display face — used for <Stamp> and big callouts. */
  display: anton.fontFamily,
  /** Neutral UI face — used for body copy, lists, captions. */
  ui: inter.fontFamily,
} as const;

/** Global composition settings shared across every Reel. */
export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
