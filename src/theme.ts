/**
 * Central design tokens for the Sol Marketing reels.
 *
 * NOTE: the colors below are placeholders — swap the hex values for the real
 * brand palette without touching the rest of the codebase.
 */
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// --- Video globals ---------------------------------------------------------
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// --- Palette (placeholders) ------------------------------------------------
export const COLORS = {
  navy: "#16263F",
  amber: "#E0A458",
  offwhite: "#F7F4EE",
  ink: "#23303F",
  redacted: "#8A8A8A",
} as const;

export type ColorName = keyof typeof COLORS;

// --- Fonts -----------------------------------------------------------------
// Anton: bold condensed display face used for slammed stamps (single weight).
// Inter: neutral UI face for lists and supporting copy.
// Only the weights/subsets actually used are loaded to keep renders fast.
const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  /** Bold condensed display font for stamps/headlines. */
  display: anton.fontFamily,
  /** Clean UI font for lists and body copy. */
  ui: inter.fontFamily,
} as const;
