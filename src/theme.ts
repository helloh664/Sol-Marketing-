import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/**
 * Brand palette. These are placeholders — swap the hex values for the real
 * brand colors and every composition/primitive updates automatically.
 */
export const colors = {
  navy: "#16263F",
  amber: "#E0A458",
  offwhite: "#F7F4EE",
  ink: "#23303F",
  redacted: "#8A8A8A",
} as const;

export type ColorName = keyof typeof colors;

/**
 * Global video settings for vertical Instagram Reels.
 */
export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Anton — a bold, condensed display face used for the slamming stamps.
const anton = loadAnton();
// Inter — clean UI/body face for lists and supporting text.
const inter = loadInter();

export const fonts = {
  /** Bold condensed display font for <Stamp> and headlines. */
  display: anton.fontFamily,
  /** UI font for <KineticList> and body copy. */
  ui: inter.fontFamily,
} as const;

/** Promise that resolves once both fonts are ready. */
export const fontsReady = Promise.all([anton.waitUntilDone(), inter.waitUntilDone()]);
