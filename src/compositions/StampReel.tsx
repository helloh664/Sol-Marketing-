import React from "react";
import { AbsoluteFill } from "remotion";
import { Stamp } from "../components/Stamp";
import { colors } from "../theme";

export type StampReelProps = {
  text: string;
  color: string;
  fontSize: number;
  perWordStagger: number;
  flashFinalWord: boolean;
};

/**
 * Demo composition wiring <Stamp> over a TRANSPARENT background so it
 * composites over footage.
 */
export const StampReel: React.FC<StampReelProps> = ({
  text,
  color,
  fontSize,
  perWordStagger,
  flashFinalWord,
}) => {
  return (
    <AbsoluteFill>
      {/* No background fill — transparent for compositing over footage. */}
      <Stamp
        text={text}
        color={color}
        fontSize={fontSize}
        perWordStagger={perWordStagger}
        flashFinalWord={flashFinalWord}
      />
    </AbsoluteFill>
  );
};

export const stampReelDefaults: StampReelProps = {
  text: "READ THE FINE PRINT",
  color: colors.amber,
  fontSize: 170,
  perWordStagger: 5,
  flashFinalWord: true,
};
