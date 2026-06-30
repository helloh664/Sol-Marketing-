import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type StampProps = {
  /** The text to stamp in. Split on whitespace; each word slams in on its own. */
  text: string;
  /** Text color. Accepts any CSS color. Defaults to the offwhite brand color. */
  color?: string;
  /** Font size in px for the stamped words. */
  fontSize?: number;
  /** Frames to wait between each word's entrance. */
  perWordStagger?: number;
  /**
   * When true, the final word gets a brief brightness/scale "flash" right after
   * it settles — a punchy accent for the last beat of the line.
   */
  flashFinalWord?: boolean;
  /** Optional letter-spacing in px. Condensed display type reads well tight. */
  letterSpacing?: number;
};

/**
 * <Stamp> — display text that slams in word-by-word. Each word rides a
 * spring() that overshoots past 1.0 in scale and settles back to 1.0, giving
 * the impression of being physically stamped onto the frame. Optionally the
 * final word flashes once it lands.
 *
 * Renders over a transparent AbsoluteFill so it composites over footage.
 */
export const Stamp: React.FC<StampProps> = ({
  text,
  color = colors.offwhite,
  fontSize = 160,
  perWordStagger = 4,
  flashFinalWord = false,
  letterSpacing = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        // Transparent background — composites over footage.
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: `${fontSize * 0.08}px ${fontSize * 0.28}px`,
        padding: "0 6%",
      }}
    >
      {words.map((word, i) => {
        const isFinal = i === words.length - 1;
        const startAt = i * perWordStagger;

        // Spring with an overshoot that settles back to 1.0. Lower damping +
        // moderate stiffness gives the "slam then settle" feel.
        const enter = spring({
          frame: frame - startAt,
          fps,
          config: {
            damping: 9,
            stiffness: 180,
            mass: 0.7,
          },
        });

        // Drive scale from a big overshoot down to a resting 1.0. `enter`
        // already overshoots past 1; map it onto a scale that starts large.
        const scale = interpolate(enter, [0, 1], [2.2, 1], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(enter, [0, 0.35], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Optional flash on the final word: a short brightness/scale pop that
        // fires just after the word has essentially settled.
        let flash = 0;
        if (flashFinalWord && isFinal) {
          const flashStart = startAt + Math.round(fps * 0.45);
          const flashProgress = spring({
            frame: frame - flashStart,
            fps,
            config: { damping: 12, stiffness: 220, mass: 0.5 },
          });
          // 0 -> 1 -> 0 bump.
          flash = interpolate(flashProgress, [0, 0.5, 1], [0, 1, 0], {
            extrapolateRight: "clamp",
          });
        }

        const flashScale = 1 + flash * 0.06;
        const brightness = 1 + flash * 0.9;

        return (
          <span
            key={`${word}-${i}`}
            style={{
              fontFamily: fonts.display,
              fontSize,
              lineHeight: 1,
              color,
              letterSpacing,
              textTransform: "uppercase",
              opacity,
              transform: `scale(${scale * flashScale})`,
              transformOrigin: "center",
              filter: flash > 0 ? `brightness(${brightness})` : undefined,
              willChange: "transform, opacity, filter",
            }}
          >
            {word}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
