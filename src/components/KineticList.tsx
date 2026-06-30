import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../theme";

export type KineticListProps = {
  /** The list items, ticked in one after another. */
  items: string[];
  /** Text color for the items. */
  color?: string;
  /** Accent color used for the bullet/marker. */
  accent?: string;
  /** Font size in px. */
  fontSize?: number;
  /** Frames to wait between each item's entrance. */
  perItemStagger?: number;
  /** Frame at which the first item starts entering. */
  startFrame?: number;
  /** Marker rendered before each item. Set to "" to hide. */
  bullet?: string;
  /** Horizontal alignment of the stacked list. */
  align?: "left" | "center";
};

/**
 * <KineticList> — builds a list on screen item-by-item.
 *
 * Each item gets a quick underdamped `spring()` entrance (slide up + fade +
 * subtle scale), staggered by `perItemStagger`. Items that have already entered
 * stay put at their resting transform, so the list accumulates rather than
 * replacing itself.
 */
export const KineticList: React.FC<KineticListProps> = ({
  items,
  color = COLORS.offwhite,
  accent = COLORS.amber,
  fontSize = 72,
  perItemStagger = 10,
  startFrame = 0,
  bullet = "—",
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: "0 110px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: fontSize * 0.42,
          alignItems: align === "center" ? "center" : "flex-start",
        }}
      >
        {items.map((item, i) => {
          const local = frame - (startFrame + i * perItemStagger);

          const enter = spring({
            frame: local,
            fps,
            config: { damping: 14, mass: 0.6, stiffness: 160 },
          });

          // Slide up from below and fade in; settles to its resting place and
          // stays there because the spring holds at 1 for all later frames.
          const translateY = interpolate(enter, [0, 1], [fontSize * 0.6, 0]);
          const scale = interpolate(enter, [0, 1], [0.92, 1]);
          const opacity = interpolate(local, [0, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={`${item}-${i}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: fontSize * 0.4,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                transformOrigin: align === "center" ? "center" : "left center",
              }}
            >
              {bullet ? (
                <span
                  style={{
                    fontFamily: FONTS.ui,
                    fontSize,
                    fontWeight: 700,
                    color: accent,
                    lineHeight: 1.05,
                  }}
                >
                  {bullet}
                </span>
              ) : null}
              <span
                style={{
                  fontFamily: FONTS.ui,
                  fontSize,
                  fontWeight: 600,
                  color,
                  lineHeight: 1.05,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
