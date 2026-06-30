import { Config } from "@remotion/cli/config";

// Compositions render over footage, so frames must preserve alpha.
// PNG is the only image format that carries an alpha channel through to
// ProRes 4444 (yuva444p10le).
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
