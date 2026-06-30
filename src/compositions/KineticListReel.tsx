import React from "react";
import { AbsoluteFill } from "remotion";
import { KineticList } from "../components/KineticList";
import { colors } from "../theme";

export type KineticListReelProps = {
  items: string[];
  perItemStagger: number;
  fontSize: number;
  color: string;
  markerColor: string;
};

/**
 * Demo composition wiring <KineticList> over a TRANSPARENT background so it
 * composites over footage.
 */
export const KineticListReel: React.FC<KineticListReelProps> = ({
  items,
  perItemStagger,
  fontSize,
  color,
  markerColor,
}) => {
  return (
    <AbsoluteFill>
      {/* No background fill — transparent for compositing over footage. */}
      <KineticList
        items={items}
        perItemStagger={perItemStagger}
        fontSize={fontSize}
        color={color}
        markerColor={markerColor}
      />
    </AbsoluteFill>
  );
};

export const kineticListReelDefaults: KineticListReelProps = {
  items: ["No hidden fees", "Cancel anytime", "Same-day support", "Built for teams"],
  perItemStagger: 10,
  fontSize: 68,
  color: colors.offwhite,
  markerColor: colors.amber,
};
