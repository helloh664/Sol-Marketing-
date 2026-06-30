import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts, resolveColor, type ColorName } from "../theme";

export type StampProps = {
  /** The phrase to stamp in. Split on whitespace into words. */
  text: string;
  /** Palette name (e.g. "amber") or any CSS color. */
  color?: ColorName | (string & {});
  /** Font size in px for the stamped words. */
  fontSize?: number;
  /** Frames between each word slamming in. */
  perWordStagger?: number;
  /** Flash the final word white as it lands. */
  flashOnLastWord?: boolean;
  /** Delay (frames) before the first word starts. */
  startFrame?: number;
  /** Uppercase the words. Defaults to true. */
  uppercase?: boolean;
  /** Vertical placement of the phrase. Defaults to "center". */
  verticalAlign?: "center" | "lower-third";
};

/**
 * <Stamp> slams a phrase in word-by-word. Each word uses spring() to overshoot
 * its scale and settle to exactly 1.0, like a rubber stamp hitting paper.
 */
export const Stamp: React.FC<StampProps> = ({
  text,
  color = "amber",
  fontSize = 140,
  perWordStagger = 6,
  flashOnLastWord = false,
  startFrame = 0,
  uppercase = true,
  verticalAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const resolved = resolveColor(color);
  const lowerThird = verticalAlign === "lower-third";

  return (
    <AbsoluteFill
      style={{
        justifyContent: lowerThird ? "flex-end" : "center",
        alignItems: "center",
        paddingBottom: lowerThird ? "18%" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: `${fontSize * 0.18}px`,
          padding: "0 80px",
        }}
      >
        {words.map((word, i) => {
          const isLast = i === words.length - 1;
          const localFrame = frame - startFrame - i * perWordStagger;

          // Spring overshoots above 1 then settles; mapping it from a large
          // scale down to 1.0 yields a "slam" that briefly undershoots and
          // resolves to exactly 1.0.
          const slam = spring({
            frame: localFrame,
            fps,
            config: { damping: 11, stiffness: 140, mass: 0.7 },
          });
          const scale = interpolate(slam, [0, 1], [1.85, 1], {
            extrapolateLeft: "clamp",
          });
          const opacity = interpolate(localFrame, [0, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // A short white flash on the last word right as it lands.
          const flash =
            flashOnLastWord && isLast
              ? interpolate(localFrame, [2, 5, 12], [0, 1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

          return (
            <span
              key={`${word}-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                transform: `scale(${scale})`,
                opacity,
                fontFamily: fonts.display,
                fontSize,
                lineHeight: 1,
                letterSpacing: "0.01em",
                textTransform: uppercase ? "uppercase" : "none",
                color: resolved,
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
