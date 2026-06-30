import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type StatStampProps = {
  /** Frames between the two credentials stamping in. */
  stagger?: number;
};

const Credential: React.FC<{
  /** Frame this stamp starts on. */
  startFrame: number;
  /** Resting (hand-stamped) angle in degrees. */
  restRotation: number;
  fontSize: number;
  children: React.ReactNode;
}> = ({ startFrame, restRotation, fontSize, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  // Quick, snappy spring for the "ka-chunk" stamp.
  const press = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.6 },
  });

  // Scale presses down from above 1.0 and settles to 1.0 (briefly dipping
  // below as the spring overshoots) — like a stamp hitting paper.
  const scale = interpolate(press, [0, 1], [1.55, 1], {
    extrapolateLeft: "clamp",
  });
  // Rotation settles into the resting angle, overshooting slightly first.
  const rotation = interpolate(press, [0, 1], [restRotation - 7, restRotation], {
    extrapolateLeft: "clamp",
  });
  const opacity = interpolate(local, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pad = fontSize * 0.22;

  return (
    <div
      style={{
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: `${fontSize * 0.16}px`,
          padding: `${pad * 0.6}px ${pad}px`,
          border: `${Math.max(4, fontSize * 0.03)}px solid ${colors.amber}`,
          borderRadius: fontSize * 0.08,
          fontFamily: fonts.display,
          fontSize,
          lineHeight: 1,
          letterSpacing: "0.02em",
          color: colors.offwhite,
          textTransform: "uppercase",
          // Soft drop shadow on both the box and the text.
          boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          textShadow: "0 6px 18px rgba(0,0,0,0.30)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * <StatStamp> — two credentials ka-chunk in sequentially like a stamped score
 * report. Each stamps in with a quick scale-down spring, a slight rotation
 * settle and a soft drop shadow. Off-white text with amber accents, on a
 * transparent background.
 */
export const StatStamp: React.FC<StatStampProps> = ({ stagger = 12 }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 64,
      }}
    >
      <Credential startFrame={0} restRotation={-3} fontSize={300}>
        1600
      </Credential>

      <Credential startFrame={stagger} restRotation={2.5} fontSize={130}>
        <span>10</span>
        <span style={{ color: colors.amber }}>&times;</span>
        <span>AP</span>
        <span style={{ color: colors.amber }}>5</span>
      </Credential>
    </AbsoluteFill>
  );
};
