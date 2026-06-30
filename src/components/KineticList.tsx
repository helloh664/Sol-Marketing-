import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

export type KineticListProps = {
  /** The list items, ticked in one after another. */
  items: string[];
  /** Frames between each item's entrance. */
  perItemStagger?: number;
  /** Frame at which the first item starts entering. */
  startAt?: number;
  /** Font size in px for the items. */
  fontSize?: number;
  /** Text color for the items. */
  color?: string;
  /** Color for the leading bullet/marker. */
  markerColor?: string;
  /** Bullet/marker rendered before each item. Set to "" to hide. */
  marker?: string;
  /** Vertical gap between items in px. */
  gap?: number;
  /** Horizontal alignment of the list block within the frame. */
  align?: "flex-start" | "center" | "flex-end";
};

/**
 * <KineticList> — takes an array of strings and ticks them in one after
 * another, each with a quick spring entrance (slide up + fade). Previous items
 * stay on screen, so the list visibly builds beat by beat.
 *
 * Renders over a transparent AbsoluteFill so it composites over footage.
 */
export const KineticList: React.FC<KineticListProps> = ({
  items,
  perItemStagger = 8,
  startAt = 0,
  fontSize = 64,
  color = colors.offwhite,
  markerColor = colors.amber,
  marker = "—",
  gap = 28,
  align = "flex-start",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        // Transparent background — composites over footage.
        justifyContent: "center",
        alignItems: align,
        padding: "0 10%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          alignItems: align,
        }}
      >
        {items.map((item, i) => {
          const itemStart = startAt + i * perItemStagger;

          // Quick spring entrance for each item.
          const enter = spring({
            frame: frame - itemStart,
            fps,
            config: { damping: 14, stiffness: 200, mass: 0.6 },
          });

          // Slide up from below and fade in. Once `enter` reaches 1 the item
          // rests in place and stays for the remainder — the list builds.
          const translateY = interpolate(enter, [0, 1], [40, 0], {
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(enter, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={`${item}-${i}`}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                gap: marker ? fontSize * 0.4 : 0,
                opacity,
                transform: `translateY(${translateY}px)`,
                willChange: "transform, opacity",
              }}
            >
              {marker ? (
                <span
                  style={{
                    fontFamily: fonts.ui,
                    fontSize,
                    fontWeight: 700,
                    color: markerColor,
                    lineHeight: 1.1,
                  }}
                >
                  {marker}
                </span>
              ) : null}
              <span
                style={{
                  fontFamily: fonts.ui,
                  fontSize,
                  fontWeight: 600,
                  color,
                  lineHeight: 1.1,
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
