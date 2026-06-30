import { Config } from "@remotion/cli/config";

// Project-wide defaults. Compositions render with a transparent background,
// so PNG image format is required to carry the alpha channel through to the
// encoder (e.g. ProRes 4444). See the `render:prores` npm script.
Config.setVideoImageFormat("png");
Config.overrideWebpackConfig((config) => config);
