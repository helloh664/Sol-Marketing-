import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, resolveColor, type ColorName } from "../theme";

export type KineticListProps = {
  /** Items to tick in, one after another. */
  items: string[];
  /** Frames between each item entering. */
  perItemStagger?: number;
  /** Delay (frames) before the first item enters. */
  startFrame?: number;
  /** Color of the item text. */
  color?: ColorName | (string & {});
  /** Color of the leading bullet/marker. */
  accent?: ColorName | (string & {});
  /** Font size in px. */
  fontSize?: number;
  /** Show a leading marker before each item. */
  showMarker?: boolean;
};

/**
 * <KineticList> ticks an array of strings in one after another. Each item gets
 * a quick spring entrance (slide up + fade) and previous items stay on screen,
 * so the list visibly builds.
 */
export const KineticList: React.FC<KineticListProps> = ({
  items,
  perItemStagger = 10,
  startFrame = 0,
  color = "offwhite",
  accent = "amber",
  fontSize = 64,
  showMarker = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textColor = resolveColor(color);
  const accentColor = resolveColor(accent);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${fontSize * 0.55}px`,
        }}
      >
        {items.map((item, i) => {
          const localFrame = frame - startFrame - i * perItemStagger;

          const enter = spring({
            frame: localFrame,
            fps,
            config: { damping: 14, stiffness: 170, mass: 0.6 },
          });
          const translateY = interpolate(enter, [0, 1], [40, 0], {
            extrapolateLeft: "clamp",
          });
          const opacity = interpolate(localFrame, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Marker pops slightly ahead of the text settling.
          const markerScale = interpolate(enter, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
          });

          return (
            <div
              key={`${item}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${fontSize * 0.5}px`,
                transform: `translateY(${translateY}px)`,
                opacity,
                willChange: "transform, opacity",
              }}
            >
              {showMarker ? (
                <span
                  style={{
                    flex: "0 0 auto",
                    width: `${fontSize * 0.45}px`,
                    height: `${fontSize * 0.45}px`,
                    borderRadius: 4,
                    background: accentColor,
                    transform: `scale(${markerScale}) rotate(45deg)`,
                    boxShadow: `0 0 24px ${colors.amber}55`,
                  }}
                />
              ) : null}
              <span
                style={{
                  fontFamily: fonts.ui,
                  fontWeight: 700,
                  fontSize,
                  lineHeight: 1.1,
                  color: textColor,
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
