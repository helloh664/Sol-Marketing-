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
  /** The items to tick in, in order. */
  items: string[];
  /** Frames between each item's entrance. */
  perItemStagger?: number;
  /** Text color for items. Defaults to off-white. */
  color?: string;
  /** Accent color for the leading bullet/marker. Defaults to amber. */
  accent?: string;
  /** Font size in px. */
  fontSize?: number;
  /** Optional frame offset before the first item ticks in. */
  startAt?: number;
};

/**
 * <KineticList> — builds a list on screen one item at a time.
 *
 * Each item gets a quick `spring()` entrance (rise + fade + slight scale).
 * Earlier items stay fully visible once landed, so the list accumulates as
 * the video plays. Renders transparent for compositing over footage.
 */
export const KineticList: React.FC<KineticListProps> = ({
  items,
  perItemStagger = 10,
  color = colors.offwhite,
  accent = colors.amber,
  fontSize = 64,
  startAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        // Transparent background — no fill.
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${fontSize * 0.45}px`,
          width: "100%",
          fontFamily: fonts.ui,
          fontSize,
          fontWeight: 600,
          lineHeight: 1.1,
        }}
      >
        {items.map((item, i) => {
          const delay = startAt + i * perItemStagger;

          const entrance = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 18,
              mass: 0.6,
              stiffness: 200,
            },
          });

          const opacity = interpolate(entrance, [0, 1], [0, 1]);
          const translateX = interpolate(entrance, [0, 1], [-40, 0]);
          const scale = interpolate(entrance, [0, 1], [0.92, 1]);

          return (
            <div
              key={`${item}-${i}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: `${fontSize * 0.35}px`,
                color,
                opacity,
                transform: `translateX(${translateX}px) scale(${scale})`,
                transformOrigin: "left center",
                willChange: "transform, opacity",
              }}
            >
              <span
                aria-hidden
                style={{
                  flex: "none",
                  width: `${fontSize * 0.35}px`,
                  height: `${fontSize * 0.35}px`,
                  borderRadius: 4,
                  background: accent,
                  // Lift the marker to roughly cap height.
                  alignSelf: "center",
                }}
              />
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
