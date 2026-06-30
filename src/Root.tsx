import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import {
  StampScene,
  stampSceneDefaultProps,
} from "./compositions/StampScene";
import {
  KineticListScene,
  kineticListSceneDefaultProps,
} from "./compositions/KineticListScene";

/**
 * All compositions are 1080x1920 @ 30fps and render with a transparent
 * background so they can be composited over footage (render to ProRes 4444
 * via `npm run render:prores`).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StampScene"
        component={StampScene}
        durationInFrames={90}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={stampSceneDefaultProps}
      />
      <Composition
        id="KineticListScene"
        component={KineticListScene}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={kineticListSceneDefaultProps}
      />
    </>
  );
};
