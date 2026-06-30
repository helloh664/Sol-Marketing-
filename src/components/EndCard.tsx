import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type EndCardProps = {
  /** Off-white portion of the comment prompt. */
  prompt?: string;
  /** Highlighted (amber) keyword that completes the prompt. */
  keyword?: string;
  /** Handle shown below the bubble. */
  handle?: string;
};

const TYPE_START = 16;
const CHAR_DURATION = 2.4;

/**
 * <EndCard> — a FULL-FRAME end card on a solid navy background (the one
 * composition that is not a transparent overlay). A chat bubble pops in and
 * types out "Comment SHOW" (SHOW in amber), the handle fades in below, and a
 * subtle pulse on the bubble draws the eye.
 */
export const EndCard: React.FC<EndCardProps> = ({
  prompt = "Comment ",
  keyword = "SHOW",
  handle = "@solleesays",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bubble pops in, then breathes with a subtle pulse.
  const pop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  const popScale = interpolate(pop, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 7) * 0.02;
  const bubbleScale = popScale * pulse;
  const glow = 24 + (Math.sin(frame / 7) + 1) * 14;

  // Typewriter reveal across the full "Comment SHOW" string.
  const full = prompt + keyword;
  const visible = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - TYPE_START) / CHAR_DURATION))
  );
  const promptPart = prompt.slice(0, Math.min(visible, prompt.length));
  const keywordPart = keyword.slice(0, Math.max(0, visible - prompt.length));
  const caretOn = frame >= TYPE_START && Math.floor(frame / 8) % 2 === 0;

  // Handle fades in after typing finishes.
  const handleOpacity = interpolate(frame, [52, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const handleY = interpolate(frame, [52, 64], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.navy,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 72,
      }}
    >
      {/* Chat bubble */}
      <div
        style={{
          position: "relative",
          transform: `scale(${bubbleScale})`,
          opacity: interpolate(frame, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          background: colors.offwhite,
          borderRadius: 48,
          padding: "56px 64px",
          width: 720,
          boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 ${glow}px ${colors.amber}66`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: fonts.ui,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            color: colors.ink,
          }}
        >
          <span>{promptPart}</span>
          <span style={{ color: colors.amber }}>{keywordPart}</span>
          <span
            style={{
              display: "inline-block",
              width: "0.08em",
              height: "1em",
              marginLeft: "0.06em",
              transform: "translateY(0.12em)",
              background: colors.ink,
              opacity: caretOn ? 1 : 0,
            }}
          />
        </div>

        {/* Tail, bottom-left */}
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: -24,
            width: 56,
            height: 56,
            background: colors.offwhite,
            transform: "rotate(45deg)",
            borderRadius: 10,
          }}
        />
      </div>

      {/* Handle */}
      <div
        style={{
          transform: `translateY(${handleY}px)`,
          opacity: handleOpacity,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 48,
          letterSpacing: "0.02em",
          color: colors.offwhite,
        }}
      >
        {handle}
      </div>
    </AbsoluteFill>
  );
};
