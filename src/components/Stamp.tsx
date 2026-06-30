import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

export type StampProps = {
  /** The phrase to stamp in. Split on spaces; each word slams independently. */
  text: string;
  /** Text color. Defaults to the off-white brand color. */
  color?: string;
  /** Font size in px for the stamped words. */
  fontSize?: number;
  /** Frames to wait between each word's entrance. */
  perWordStagger?: number;
  /** Flash a quick highlight behind the final word as it lands. */
  flashOnFinalWord?: boolean;
};

/**
 * <Stamp> — display text that slams in word-by-word.
 *
 * Each word rides a single `spring()` whose value is mapped straight to scale,
 * so it pops from 0, overshoots just past 1.0, and settles back to exactly 1.0
 * (the spring config is underdamped to produce that overshoot). Words are
 * staggered by `perWordStagger` frames. The optional final-word flash is a
 * brief amber glow that punches in and fades as the last word lands.
 */
export const Stamp: React.FC<StampProps> = ({
  text,
  color = COLORS.offwhite,
  fontSize = 150,
  perWordStagger = 5,
  flashOnFinalWord = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ").filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: fontSize * 0.28,
          rowGap: fontSize * 0.12,
          maxWidth: "100%",
        }}
      >
        {words.map((word, i) => {
          const isFinal = i === words.length - 1;
          const local = frame - i * perWordStagger;

          // Underdamped spring -> overshoots past 1.0 then settles to 1.0.
          const enter = spring({
            frame: local,
            fps,
            config: { damping: 9, mass: 0.6, stiffness: 170 },
          });

          // Scale rides the spring directly so we keep the natural overshoot.
          const scale = enter;
          const opacity = interpolate(local, [0, 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Brief amber flash that punches in with the final word and fades out.
          const flash =
            isFinal && flashOnFinalWord
              ? interpolate(local, [0, 2, 9], [0, 0.85, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

          return (
            <span
              key={`${word}-${i}`}
              style={{
                position: "relative",
                display: "inline-flex",
                transform: `scale(${scale})`,
                opacity,
              }}
            >
              {flash > 0 && (
                <span
                  style={{
                    position: "absolute",
                    inset: `-${fontSize * 0.15}px -${fontSize * 0.25}px`,
                    background: COLORS.amber,
                    opacity: flash,
                    filter: `blur(${fontSize * 0.12}px)`,
                    borderRadius: fontSize * 0.2,
                    zIndex: -1,
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize,
                  lineHeight: 1,
                  letterSpacing: fontSize * 0.01,
                  textTransform: "uppercase",
                  color,
                  whiteSpace: "pre",
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
