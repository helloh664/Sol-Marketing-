import React from "react";
import { Composition } from "remotion";
import { video } from "./theme";
import {
  StampReel,
  stampReelDefaults,
} from "./compositions/StampReel";
import {
  KineticListReel,
  kineticListReelDefaults,
} from "./compositions/KineticListReel";

/**
 * Every composition is registered here. All are vertical 1080x1920 @ 30fps and
 * render over a transparent background so they composite over footage.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StampReel"
        component={StampReel}
        durationInFrames={90}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={stampReelDefaults}
      />
      <Composition
        id="KineticListReel"
        component={KineticListReel}
        durationInFrames={150}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={kineticListReelDefaults}
      />
    </>
  );
};
