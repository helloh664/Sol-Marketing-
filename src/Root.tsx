import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Stamp, StampProps } from "./components/Stamp";
import { KineticList, KineticListProps } from "./components/KineticList";
import { colors, video } from "./theme";

/**
 * Demo composition for <Stamp>. Background is transparent so the result
 * composites cleanly over footage when rendered to ProRes 4444.
 */
const StampScene: React.FC<StampProps> = (props) => {
  return (
    <AbsoluteFill>
      <Stamp {...props} />
    </AbsoluteFill>
  );
};

/**
 * Demo composition for <KineticList>. Transparent background.
 */
const KineticListScene: React.FC<KineticListProps> = (props) => {
  return (
    <AbsoluteFill>
      <KineticList {...props} />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StampDemo"
        component={StampScene}
        durationInFrames={90}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{
          text: "NO MORE EXCUSES",
          color: colors.offwhite,
          fontSize: 150,
          perWordStagger: 6,
          flashFinalWord: true,
        }}
      />

      <Composition
        id="KineticListDemo"
        component={KineticListScene}
        durationInFrames={120}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{
          items: [
            "Plan the shoot",
            "Cut the reel",
            "Add the captions",
            "Hit publish",
          ],
          perItemStagger: 12,
          color: colors.offwhite,
          accent: colors.amber,
          fontSize: 72,
          startAt: 0,
        }}
      />
    </>
  );
};
