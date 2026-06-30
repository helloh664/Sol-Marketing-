import { Config } from "@remotion/cli/config";

// Vertical Instagram Reels output. These compositions are designed to
// composite over footage, so we default the renderer to a codec/format that
// preserves alpha. ProRes 4444 carries an alpha channel; PNG image frames keep
// transparency intact during the frame stage.
Config.setVideoImageFormat("png");
Config.setCodec("prores");
Config.setProResProfile("4444");

// Keep the rendered pixels honest for compositing — no premultiplied surprises.
Config.setPixelFormat("yuva444p10le");
