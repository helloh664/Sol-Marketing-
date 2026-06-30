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

export type ScoreSlamProps = {
  /** The number to slam in. Defaults to "1600". */
  value?: string;
  /** Compact version for an earlier, low-key contextual mention. */
  small?: boolean;
};

// Frame at which the number is considered to have landed: flash, shake and
// the underline wipe all key off this moment.
const LAND_FRAME = 8;

/**
 * <ScoreSlam> — a huge number slams onto a transparent center screen out of
 * nothing: scale ~2.5 overshooting down to 1.0 on a heavy spring, a 2-frame
 * white flash on impact, a decaying screen-shake, and an amber underline that
 * wipes in after the number lands. Built to feel like a gut-punch reveal.
 */
export const ScoreSlam: React.FC<ScoreSlamProps> = ({
  value = "1600",
  small = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fontSize = small ? 220 : 460;
  const underlineHeight = small ? 10 : 22;
  const underlineGap = small ? 16 : 34;
  const shakeAmplitude = small ? 6 : 20;
  const flashPeak = small ? 0.55 : 0.9;

  // Heavy spring: starts big and overshoots past 1.0 (dipping below) before
  // settling, which reads as a hard slam.
  const slam = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 110, mass: 1.1 },
  });
  const scale = interpolate(slam, [0, 1], [2.5, 1], {
    extrapolateLeft: "clamp",
  });

  // Appears out of nothing — snap to visible on the first frame.
  const opacity = interpolate(frame, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2-frame white flash on impact.
  const flash = interpolate(
    frame,
    [LAND_FRAME, LAND_FRAME + 1, LAND_FRAME + 2],
    [0, flashPeak, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Decaying screen-shake that settles, kicking in on impact.
  const sinceLand = frame - LAND_FRAME;
  const shakeDecay = interpolate(sinceLand, [0, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shaking = sinceLand >= 0 ? 1 : 0;
  const shakeX =
    Math.sin(frame * 1.7) * shakeAmplitude * shakeDecay * shaking;
  const shakeY =
    Math.cos(frame * 2.3) * shakeAmplitude * 0.6 * shakeDecay * shaking;

  // Amber underline wipes in (left -> right) after the number lands.
  const underlineWipe = interpolate(
    frame,
    [LAND_FRAME + 4, LAND_FRAME + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "stretch",
            transform: `scale(${scale})`,
            opacity,
            willChange: "transform, opacity",
          }}
        >
          <span
            style={{
              fontFamily: fonts.display,
              fontSize,
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              textAlign: "center",
              color: colors.offwhite,
              textShadow: "0 10px 40px rgba(0,0,0,0.35)",
            }}
          >
            {value}
          </span>
          <div
            style={{
              marginTop: underlineGap,
              height: underlineHeight,
              borderRadius: underlineHeight,
              background: colors.amber,
              transform: `scaleX(${underlineWipe})`,
              transformOrigin: "left center",
              willChange: "transform",
            }}
          />
        </div>
      </div>

      {/* Full-screen white flash on impact (covers the transparent canvas). */}
      <AbsoluteFill
        style={{
          background: "#FFFFFF",
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
