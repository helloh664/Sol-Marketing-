import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts } from "../theme";

/**
 * A single parody clickbait card config. All values are intentionally garish.
 * `from` / `out` are off-screen vectors (px) the card flies in from and whips
 * out to; `spin` is extra rotation applied during the whip-out.
 */
type CardConfig = {
  text: string;
  /** Resting offset from screen center, px. */
  x: number;
  y: number;
  /** Resting rotation, degrees (the messy-pile angle). */
  rot: number;
  bg: string;
  textColor: string;
  from: [number, number];
  out: [number, number];
  spin: number;
};

// Seven generic, fake "SAT tips" thumbnails — not real people or channels.
const CARDS: CardConfig[] = [
  {
    text: "SECRET SAT HACK!!",
    x: -200,
    y: -380,
    rot: -12,
    bg: "#FFD60A",
    textColor: "#111111",
    from: [-1400, -600],
    out: [-1700, -400],
    spin: -110,
  },
  {
    text: "+200 PTS GUARANTEED",
    x: 175,
    y: -330,
    rot: 10,
    bg: "#FF2D2D",
    textColor: "#FFF200",
    from: [1400, -700],
    out: [1750, -300],
    spin: 130,
  },
  {
    text: "TIPS NOBODY TELLS YOU",
    x: -150,
    y: -30,
    rot: -7,
    bg: "#FFD60A",
    textColor: "#111111",
    from: [-1600, 0],
    out: [-1750, 250],
    spin: -80,
  },
  {
    text: "5 TRICKS TO 1600",
    x: 210,
    y: 60,
    rot: 15,
    bg: "#28C24B",
    textColor: "#FFFFFF",
    from: [1500, 200],
    out: [1750, 0],
    spin: 120,
  },
  {
    text: "DO THIS BEFORE THE SAT",
    x: -210,
    y: 330,
    rot: -11,
    bg: "#FF2D2D",
    textColor: "#FFF200",
    from: [-1300, 850],
    out: [-1650, 650],
    spin: -120,
  },
  {
    text: "RAISE YOUR SCORE FAST",
    x: 150,
    y: 365,
    rot: 8,
    bg: "#FFD60A",
    textColor: "#111111",
    from: [1300, 950],
    out: [1650, 550],
    spin: 100,
  },
  {
    text: "COLLEGES HATE THIS!!",
    x: 0,
    y: 120,
    rot: -4,
    bg: "#0A84FF",
    textColor: "#FFF200",
    from: [0, 1500],
    out: [220, 1750],
    spin: 150,
  },
];

const CARD_W = 620;
const CARD_H = 360;

// Decorative red clickbait arrow.
const Arrow: React.FC = () => (
  <svg
    width={210}
    height={150}
    viewBox="0 0 210 150"
    style={{
      position: "absolute",
      right: 18,
      bottom: 14,
      transform: "rotate(-18deg)",
      filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.55))",
    }}
  >
    <path
      d="M18 120 C 70 120, 120 110, 165 55"
      fill="none"
      stroke="#FF1E1E"
      strokeWidth={24}
      strokeLinecap="round"
    />
    <path
      d="M120 50 L172 40 L160 92"
      fill="none"
      stroke="#FF1E1E"
      strokeWidth={24}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TipCard: React.FC<{ config: CardConfig; index: number }> = ({
  config,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast staggered entrance.
  const enterStart = index * 5;
  const enterLocal = frame - enterStart;
  const enter = spring({
    frame: enterLocal,
    fps,
    config: { damping: 13, stiffness: 190, mass: 0.7 },
  });

  // The whole pile whips out near the end, slightly staggered for chaos.
  const exitStart = 60;
  const exitLocal = frame - (exitStart + index * 2);
  const exit = interpolate(exitLocal, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Fly from off-screen to the resting (messy) position, then add the whip-out.
  const baseX = interpolate(enter, [0, 1], [config.from[0], config.x]);
  const baseY = interpolate(enter, [0, 1], [config.from[1], config.y]);
  const x = baseX + exit * (config.out[0] - config.x);
  const y = baseY + exit * (config.out[1] - config.y);

  const startRot = config.rot + (index % 2 === 0 ? -40 : 40);
  const rotation =
    interpolate(enter, [0, 1], [startRot, config.rot]) + exit * config.spin;
  const scale = interpolate(enter, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
  });

  const fadeIn = interpolate(enterLocal, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * (1 - exit);

  // Low-quality look + motion blur as it whips away.
  const blur = 1.8 + exit * 8;

  return (
    <div
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        zIndex: index,
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: config.bg,
          border: "8px solid #000000",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 36px",
        }}
      >
        {/* Fake video timestamp badge, YouTube-thumbnail style. */}
        <span
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            background: "rgba(0,0,0,0.82)",
            color: "#FFFFFF",
            fontFamily: fonts.ui,
            fontWeight: 700,
            fontSize: 26,
            padding: "4px 12px",
            borderRadius: 8,
          }}
        >
          {`1${index}:0${index % 9}`}
        </span>

        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 78,
            lineHeight: 0.92,
            textTransform: "uppercase",
            textAlign: "center",
            color: config.textColor,
            WebkitTextStroke: "3px #000000",
            textShadow: "0 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          {config.text}
        </span>

        <Arrow />
      </div>
    </div>
  );
};

/**
 * <TipCardCollage> — 7 garish, fake "SAT tips" thumbnails fly in fast and pile
 * up chaotically, then the whole pile whips/fades out. Transparent background
 * so it composites over footage. Conveys overwhelming, low-value tutor hype.
 */
export const TipCardCollage: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {CARDS.map((config, index) => (
        <TipCard key={config.text} config={config} index={index} />
      ))}
    </AbsoluteFill>
  );
};
