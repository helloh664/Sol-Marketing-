import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Stamp, type StampProps } from "./components/Stamp";
import { KineticList, type KineticListProps } from "./components/KineticList";
import { TipCardCollage } from "./components/TipCardCollage";
import { ScoreSlam } from "./components/ScoreSlam";
import { StatStamp } from "./components/StatStamp";
import { VIDEO } from "./theme";

const { width, height, fps } = VIDEO;

/**
 * IMPORTANT: every composition keeps a transparent background. AbsoluteFill is
 * left without a backgroundColor so the output composites cleanly over footage
 * (render with the `render:prores` script to preserve alpha).
 */

const StampReel: React.FC<StampProps> = (props) => (
  <AbsoluteFill>
    <Stamp {...props} />
  </AbsoluteFill>
);

const KineticListReel: React.FC<KineticListProps> = (props) => (
  <AbsoluteFill>
    <KineticList {...props} />
  </AbsoluteFill>
);

// A small showcase combining both primitives over a single transparent canvas.
type ComboProps = {
  headline: string;
  items: string[];
};

const ComboReel: React.FC<ComboProps> = ({ headline, items }) => (
  <AbsoluteFill>
    <Sequence durationInFrames={Infinity}>
      <AbsoluteFill style={{ justifyContent: "flex-start", paddingTop: 260 }}>
        <Stamp
          text={headline}
          color="amber"
          fontSize={150}
          perWordStagger={6}
          flashOnLastWord
        />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={40}>
      <KineticList items={items} startFrame={0} />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StampReel"
        component={StampReel}
        durationInFrames={90}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          text: "BREAKING NEWS",
          color: "amber",
          fontSize: 150,
          perWordStagger: 6,
          flashOnLastWord: true,
          startFrame: 0,
        }}
      />

      <Composition
        id="KineticListReel"
        component={KineticListReel}
        durationInFrames={150}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          items: [
            "No hidden fees",
            "Cancel anytime",
            "Built for creators",
            "Ships in minutes",
          ],
          perItemStagger: 12,
          startFrame: 6,
          color: "offwhite",
          accent: "amber",
          fontSize: 64,
          showMarker: true,
        }}
      />

      <Composition
        id="ComboReel"
        component={ComboReel}
        durationInFrames={180}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          headline: "THE TRUTH",
          items: [
            "No hidden fees",
            "Cancel anytime",
            "Built for creators",
          ],
        }}
      />

      <Composition
        id="TipCardCollage"
        component={TipCardCollage}
        durationInFrames={90}
        fps={fps}
        width={width}
        height={height}
      />

      <Composition
        id="HookStamp"
        component={StampReel}
        durationInFrames={45}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          text: "live. cold. no edits.",
          color: "amber",
          fontSize: 130,
          perWordStagger: 5,
          flashOnLastWord: true,
          startFrame: 0,
          uppercase: false,
          verticalAlign: "lower-third",
        }}
      />

      <Composition
        id="ScoreSlam"
        component={ScoreSlam}
        durationInFrames={75}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          value: "1600",
          small: false,
        }}
      />

      <Composition
        id="StatStamp"
        component={StatStamp}
        durationInFrames={60}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          stagger: 12,
        }}
      />
    </>
  );
};
