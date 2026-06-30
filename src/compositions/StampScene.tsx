import React from "react";
import { AbsoluteFill } from "remotion";
import { Stamp, StampProps } from "../components/Stamp";
import { COLORS } from "../theme";

export type StampSceneProps = StampProps;

/**
 * Demo composition for <Stamp>. The AbsoluteFill is intentionally left without
 * a background fill so the scene composites over footage with a transparent
 * background.
 */
export const StampScene: React.FC<StampSceneProps> = (props) => {
  return (
    <AbsoluteFill>
      <Stamp {...props} />
    </AbsoluteFill>
  );
};

export const stampSceneDefaultProps: StampSceneProps = {
  text: "CLASSIFIED INTEL",
  color: COLORS.offwhite,
  fontSize: 170,
  perWordStagger: 6,
  flashOnFinalWord: true,
};
