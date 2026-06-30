import React from "react";
import { AbsoluteFill } from "remotion";
import { KineticList, KineticListProps } from "../components/KineticList";
import { COLORS } from "../theme";

export type KineticListSceneProps = KineticListProps;

/**
 * Demo composition for <KineticList>. The AbsoluteFill has no background fill,
 * keeping the scene transparent for compositing over footage.
 */
export const KineticListScene: React.FC<KineticListSceneProps> = (props) => {
  return (
    <AbsoluteFill>
      <KineticList {...props} />
    </AbsoluteFill>
  );
};

export const kineticListSceneDefaultProps: KineticListSceneProps = {
  items: [
    "No setup fees",
    "Cancel anytime",
    "Real humans, 24/7",
    "Results in 30 days",
  ],
  color: COLORS.offwhite,
  accent: COLORS.amber,
  fontSize: 80,
  perItemStagger: 12,
  startFrame: 6,
  bullet: "—",
  align: "left",
};
