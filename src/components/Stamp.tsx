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
  /** The phrase to slam in. Split on whitespace into words. */
  text: string;
  /** Text color. Defaults to off-white. */
  color?: string;
  /** Font size in px. */
  fontSize?: number;
  /** Frames between the entrance of each successive word. */
  perWordStagger?: number;
  /**
   * When true, the final word gets a brief white flash as it lands,
   * emphasising the punchline.
   */
  flashFinalWord?: boolean;
};

/**
 * <Stamp> — display text that slams in one word at a time.
 *
 * Each word is driven by its own `spring()` whose value is mapped directly
 * to scale: it launches from 0, overshoots past 1.0 and settles back to
 * exactly 1.0 (the spring's resting value). Words are staggered so the
 * phrase reads like it is being stamped in, beat by beat.
 */
export const Stamp: React.FC<StampProps> = ({
  text,
  color = colors.offwhite,
  fontSize = 140,
  perWordStagger = 6,
  flashFinalWord = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);
  const lastIndex = words.length - 1;

  return (
    <AbsoluteFill
      style={{
        // Transparent — composites over footage. No background fill.
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: `${fontSize * 0.05}px ${fontSize * 0.25}px`,
          maxWidth: "90%",
          fontFamily: fonts.display,
          fontSize,
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "0.01em",
          textAlign: "center",
        }}
      >
        {words.map((word, i) => {
          const delay = i * perWordStagger;

          // Spring with overshoot: starts at 0, swings past 1, settles to 1.0.
          const progress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 9,
              mass: 0.7,
              stiffness: 180,
            },
          });

          // Opacity ramps in fast and independently so words don't flicker
          // while the scale is still overshooting.
          const opacity = interpolate(
            frame - delay,
            [0, 3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const isFinal = i === lastIndex;

          // Optional flash: a short white burst layered over the final word
          // as it lands. Fades out over ~8 frames after the word's entrance.
          const flash =
            flashFinalWord && isFinal
              ? interpolate(
                  frame - delay,
                  [1, 4, 12],
                  [0, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                )
              : 0;

          return (
            <span
              key={`${word}-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                color,
                opacity,
                transform: `scale(${progress})`,
                transformOrigin: "center bottom",
                willChange: "transform, opacity",
              }}
            >
              {word}
              {flash > 0 ? (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    color: "#FFFFFF",
                    opacity: flash,
                    // Soft glow so the flash reads as light, not just a recolor.
                    textShadow: `0 0 ${fontSize * 0.25}px rgba(255,255,255,${flash})`,
                    pointerEvents: "none",
                  }}
                >
                  {word}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
