import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type DateDoingProps = {
  /** Text inside the date chip. */
  date?: string;
};

/**
 * <DateDoing> — a small navy date chip fades/slides in top-center, then a
 * "teach by DOING" title slides in below it (off-white "teach by", amber
 * "DOING") with an amber underline that wipes in under "DOING". Transparent.
 */
export const DateDoing: React.FC<DateDoingProps> = ({ date = "Dec 2023" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Date chip: slide down + fade in.
  const chip = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.7 },
  });
  const chipY = interpolate(chip, [0, 1], [-40, 0], {
    extrapolateLeft: "clamp",
  });
  const chipOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title: slides up + fades in after the chip.
  const titleStart = 14;
  const titleLocal = frame - titleStart;
  const title = spring({
    frame: titleLocal,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.7 },
  });
  const titleY = interpolate(title, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
  });
  const titleOpacity = interpolate(titleLocal, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Amber underline under "DOING" wipes in (left -> right) once the title lands.
  const underlineWipe = interpolate(frame, [32, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 360,
        gap: 64,
      }}
    >
      {/* Date chip */}
      <div
        style={{
          transform: `translateY(${chipY}px)`,
          opacity: chipOpacity,
          background: colors.navy,
          color: colors.offwhite,
          fontFamily: fonts.ui,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "16px 36px",
          borderRadius: 999,
          boxShadow: "0 12px 30px rgba(0,0,0,0.30)",
        }}
      >
        {date}
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: colors.offwhite,
          }}
        >
          teach by
        </span>

        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: 220,
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: colors.amber,
              textShadow: "0 10px 30px rgba(0,0,0,0.30)",
            }}
          >
            DOING
          </span>
          <div
            style={{
              marginTop: 18,
              height: 16,
              borderRadius: 16,
              background: colors.amber,
              transform: `scaleX(${underlineWipe})`,
              transformOrigin: "left center",
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
