import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/**
 * Brand palette. These are placeholders — swap the hex values for the real
 * brand colors. Keep the keys stable so component code keeps working.
 */
export const colors = {
  navy: "#16263F",
  amber: "#E0A458",
  offwhite: "#F7F4EE",
  ink: "#23303F",
  redacted: "#8A8A8A",
} as const;

export type ColorName = keyof typeof colors;

/** Resolve a palette name (e.g. "amber") or pass through a raw CSS color. */
export const resolveColor = (color: ColorName | (string & {})): string =>
  (colors as Record<string, string>)[color] ?? color;

// Anton ships a single weight (400) but is a bold, condensed display face —
// perfect for stamps. Inter covers UI / list text. Load only the weights and
// subset we actually use to keep font requests minimal.
const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const inter = loadInter("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const fonts = {
  /** Bold condensed display font, used for <Stamp>. */
  display: anton.fontFamily,
  /** Clean UI font, used for lists and general text. */
  ui: inter.fontFamily,
} as const;

/** Awaitable handles in case a composition wants to block on font readiness. */
export const fontHandles = { anton, inter } as const;

/** Global video constants for vertical Instagram Reels. */
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
